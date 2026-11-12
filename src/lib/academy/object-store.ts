import { S3Client, HeadObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { safeRelative } from './primitives.mjs'
let client: S3Client | undefined
export function objectStoreConfig() {
  return { endpoint: process.env.PRIVATE_STORAGE_ENDPOINT, region: process.env.PRIVATE_STORAGE_REGION,
    credentials: { accessKeyId: process.env.PRIVATE_STORAGE_ACCESS_KEY_ID || '', secretAccessKey: process.env.PRIVATE_STORAGE_SECRET_ACCESS_KEY || '' },
    forcePathStyle: true, requestChecksumCalculation: 'WHEN_REQUIRED' as const }
}
export function objectStore() {
  if (!process.env.PRIVATE_STORAGE_ENDPOINT || !process.env.PRIVATE_STORAGE_ACCESS_KEY_ID || !process.env.PRIVATE_STORAGE_SECRET_ACCESS_KEY) throw Error('Private storage is not configured')
  return client ||= new S3Client(objectStoreConfig())
}
export function bucket(kind: 'CONTENT' | 'RECORDINGS' | 'MEDIA') {
  const name = process.env[`PRIVATE_STORAGE_${kind}_BUCKET`]
  if (!name) throw Error('Private storage bucket is missing')
  return name
}
export async function storedSource(relative: string) {
  if (!safeRelative(relative)) throw Error('Invalid source path')
  const response = await objectStore().send(new GetObjectCommand({ Bucket: bucket('CONTENT'), Key: relative }))
  if (!response.Body) throw Error('Private source is unavailable')
  return Buffer.from(await response.Body.transformToByteArray())
}
export { HeadObjectCommand, GetObjectCommand, PutObjectCommand }
