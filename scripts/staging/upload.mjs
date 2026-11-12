import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { readFile, writeFile } from 'node:fs/promises'
import { createHash, createHmac } from 'node:crypto'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { assertStagingEnvironment } from '../../src/lib/staging/environment.mjs'
const target = assertStagingEnvironment()
if (process.env.PRIVATE_STORAGE_ENDPOINT !== target.storageEndpoint) throw Error('Unexpected private storage target')
const client = new S3Client({ endpoint: process.env.PRIVATE_STORAGE_ENDPOINT, region: process.env.PRIVATE_STORAGE_REGION, credentials: { accessKeyId: process.env.PRIVATE_STORAGE_ACCESS_KEY_ID, secretAccessKey: process.env.PRIVATE_STORAGE_SECRET_ACCESS_KEY }, forcePathStyle: true, requestChecksumCalculation: 'WHEN_REQUIRED' })
const manifest = JSON.parse(await readFile('src/integrations/academy/manifest.json', 'utf8'))
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
let uploaded = 0, reused = 0
async function put(Bucket, Key, filename, sha256, ContentType) {
  const bytes = await readFile(filename)
  if (hash(bytes) !== sha256) throw Error('Source file integrity failure')
  let head
  try { head = await client.send(new HeadObjectCommand({ Bucket, Key })) } catch (error) { if (error.$metadata?.httpStatusCode !== 404) throw error }
  if (head) {
    if (head.Metadata?.sha256 !== sha256 || head.ContentLength !== bytes.length) throw Error('Existing private object differs; refusing overwrite')
    reused++
  } else {
    await client.send(new PutObjectCommand({ Bucket, Key, Body: bytes, Metadata: { sha256 }, ContentType, IfNoneMatch: '*' }))
    head = await client.send(new HeadObjectCommand({ Bucket, Key })); uploaded++
  }
  return head
}
try {
  const source = Object.entries(manifest.files)
  for (let index = 0; index < source.length; index += 5) await Promise.all(source.slice(index, index + 5).map(([key, sha]) => put(process.env.PRIVATE_STORAGE_CONTENT_BUCKET, key, '.academy-private/source/' + key, sha, 'application/octet-stream')))
  const receipts = {}
  for (const row of manifest.recordings) {
    const filename = '.academy-private/blobs/' + row.blob
    const head = await put(process.env.PRIVATE_STORAGE_RECORDINGS_BUCKET, row.blob, filename, row.sha256, 'video/mp4')
    const actual = await client.send(new GetObjectCommand({ Bucket: process.env.PRIVATE_STORAGE_RECORDINGS_BUCKET, Key: row.blob }))
    const digest = createHash('sha256')
    for await (const chunk of actual.Body) digest.update(chunk)
    if (digest.digest('hex') !== row.sha256) throw Error('Remote original recording integrity failure')
    const probe = JSON.parse((await promisify(execFile)(process.env.FFPROBE_BIN || 'ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,width,height:format=duration', '-of', 'json', filename], { timeout: 20000 })).stdout)
    const lesson = manifest.lessons.find(lesson => lesson.key === row.lessonKey)
    const value = { blob: row.blob, sha256: row.sha256, bytes: row.bytes, fingerprint: lesson.fingerprint, duration: Number(probe.format.duration), audio: probe.streams.some(stream => stream.codec_type === 'audio'), video: probe.streams.some(stream => stream.codec_type === 'video' && stream.width > 0 && stream.height > 0), etag: head.ETag }
    if (!value.audio || !value.video || Math.abs(value.duration - row.duration) > 2) throw Error('Original recording validation failure')
    const payload = JSON.stringify(value)
    receipts[row.lessonKey] = { payload, signature: createHmac('sha256', process.env.PAYLOAD_SECRET).update('recording-verification-v1:' + payload).digest('hex') }
  }
  await writeFile('.staging-private/storage-receipts.json', JSON.stringify(receipts, null, 2))
  const anonymous = await fetch(target.storageEndpoint + '/' + process.env.PRIVATE_STORAGE_CONTENT_BUCKET + '/foundational/python/print.html')
  if (![401, 403].includes(anonymous.status)) throw Error('Private content bucket allowed an anonymous read')
  await writeFile('.staging-private/storage-result.json', JSON.stringify({ uploaded, reused, originalVideoHashesVerified: 6, privateSourceObjects: source.length, anonymousStatus: anonymous.status }, null, 2))
  console.log(JSON.stringify({ uploaded, reused, originalVideoHashesVerified: 6, privateSourceObjects: source.length, anonymousStatus: anonymous.status }))
} finally { client.destroy() }
