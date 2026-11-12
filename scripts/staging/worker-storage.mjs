import { objectStore, bucket, PutObjectCommand, HeadObjectCommand } from '../../src/lib/academy/object-store.ts'
import { createHmac } from 'node:crypto'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
export async function storeRecording({ filename, bytes, blob, sha256, fingerprint }) {
  await objectStore().send(new PutObjectCommand({ Bucket: bucket('RECORDINGS'), Key: blob, Body: bytes, ContentType: 'video/mp4', Metadata: { sha256 }, IfNoneMatch: '*' }))
  const head = await objectStore().send(new HeadObjectCommand({ Bucket: bucket('RECORDINGS'), Key: blob }))
  const probe = JSON.parse((await promisify(execFile)(process.env.FFPROBE_BIN || 'ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,width,height:format=duration', '-of', 'json', filename])).stdout)
  const value = { blob, sha256, bytes: bytes.length, fingerprint, duration: Number(probe.format.duration), audio: probe.streams.some(stream => stream.codec_type === 'audio'), video: probe.streams.some(stream => stream.codec_type === 'video' && stream.width > 0 && stream.height > 0), etag: head.ETag }
  if (!value.audio || !value.video || !Number.isFinite(value.duration) || value.duration <= 0) throw Error('Worker output has no valid narration or video')
  const payload = JSON.stringify(value)
  return { payload, signature: createHmac('sha256', process.env.PAYLOAD_SECRET).update('recording-verification-v1:' + payload).digest('hex') }
}
