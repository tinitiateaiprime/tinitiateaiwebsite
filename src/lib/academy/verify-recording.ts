import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { APIError } from 'payload'
import { videoStorage } from './storage'
import { objectStore, bucket, HeadObjectCommand } from './object-store'
import type { LessonRecording } from '@/payload-types'
export async function verifiedDuration(recording: LessonRecording) {
  if (process.env.STORAGE_PROVIDER === 's3') {
    const metadata = recording.metadata as { storageVerification?: { payload: string; signature: string } } | null
    const receipt = metadata?.storageVerification
    if (!receipt || typeof receipt.payload !== 'string' || receipt.payload.length > 8192 || typeof receipt.signature !== 'string' || !/^[a-f0-9]{64}$/.test(receipt.signature) || !process.env.PAYLOAD_SECRET) throw new APIError('The separate verification worker must validate this recording before approval.', 409)
    const expected = createHmac('sha256', process.env.PAYLOAD_SECRET).update('recording-verification-v1:' + receipt.payload).digest('hex')
    if (receipt.signature.length !== expected.length || !timingSafeEqual(Buffer.from(receipt.signature), Buffer.from(expected))) throw new APIError('Invalid worker verification receipt', 409)
    const value = JSON.parse(receipt.payload) as { blob: string; sha256: string; bytes: number; fingerprint: string; duration: number; audio: boolean; video: boolean; etag: string }
    const head = await objectStore().send(new HeadObjectCommand({ Bucket: bucket('RECORDINGS'), Key: recording.blob }))
    if (value.blob !== recording.blob || value.sha256 !== recording.sha256 || value.bytes !== recording.bytes || value.fingerprint !== recording.fingerprint || value.bytes !== head.ContentLength || value.etag !== head.ETag || !value.audio || !value.video) throw new APIError('Recording integrity or verification version changed', 409)
    return value.duration
  }
  const { filename, size } = await videoStorage.resolve(recording.blob)
  if (size !== recording.bytes || createHash('sha256').update(await readFile(filename)).digest('hex') !== recording.sha256) throw new APIError('Recording integrity check failed', 409)
  const probe = await promisify(execFile)(process.env.FFPROBE_BIN || 'ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,width,height:format=duration', '-of', 'json', filename], { timeout: 15000 })
  const value = JSON.parse(probe.stdout) as { format: { duration: string }; streams: { codec_type: string; width?: number; height?: number }[] }
  if (!value.streams.some(s => s.codec_type === 'video' && (s.width || 0) > 0 && (s.height || 0) > 0) || !value.streams.some(s => s.codec_type === 'audio')) throw new APIError('A publishable tutorial must contain video and narration audio', 409)
  return Number(value.format.duration)
}
