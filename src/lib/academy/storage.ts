import { createReadStream } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { Readable } from 'node:stream'
import path from 'node:path'
import { parseRange } from './primitives.mjs'
import { objectStore, bucket, storedSource, HeadObjectCommand, GetObjectCommand } from './object-store'
export const privateRoot = () => path.resolve(process.env.ACADEMY_PRIVATE_ROOT || '.academy-private')
export interface PrivateVideoStorage { resolve(blob: string): Promise<{ filename: string; size: number }> }
export class LocalVideoStorage implements PrivateVideoStorage {
  async resolve(blob: string) {
    if (!/^[a-f0-9]{64}\.mp4$/.test(blob)) throw Error('Invalid video identity')
    const filename = path.join(privateRoot(),'blobs',blob)
    return { filename, size: (await stat(filename)).size }
  }
}
// A future Blob implementation must issue private authorized reads, never public container URLs.
export const videoStorage: PrivateVideoStorage = new LocalVideoStorage()
export async function sourceFile(relative: string) { return process.env.STORAGE_PROVIDER === 's3' ? storedSource(relative) : readFile(path.join(privateRoot(),'source',relative)) }
export const privateHeaders = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Access-Control-Allow-Origin': 'null', 'Vary': 'Origin' }
export async function videoResponse(request: Request, blob: string) {
  if (!/^[a-f0-9]{64}\.mp4$/.test(blob)) throw Error('Invalid video identity')
  if (process.env.STORAGE_PROVIDER === 's3') {
    const head = await objectStore().send(new HeadObjectCommand({ Bucket: bucket('RECORDINGS'), Key: blob }))
    const size = head.ContentLength!
    const range = parseRange(request.headers.get('range'), size)
    if (!range) return new Response(null, { status: 416, headers: { ...privateHeaders, 'Content-Range': `bytes */${size}`, 'Accept-Ranges': 'bytes' } })
    const headers: Record<string, string> = { ...privateHeaders, 'Content-Type': 'video/mp4', 'Content-Length': String(range.end - range.start + 1), 'Accept-Ranges': 'bytes' }
    if (range.partial) headers['Content-Range'] = `bytes ${range.start}-${range.end}/${size}`
    const response = request.method === 'HEAD' ? null : await objectStore().send(new GetObjectCommand({ Bucket: bucket('RECORDINGS'), Key: blob, Range: `bytes=${range.start}-${range.end}`, IfMatch: head.ETag }), { abortSignal: request.signal })
    return new Response(response?.Body?.transformToWebStream() as ReadableStream<Uint8Array> | undefined || null, { status: range.partial ? 206 : 200, headers })
  }
  const { filename, size } = await videoStorage.resolve(blob)
  const range = parseRange(request.headers.get('range'),size)
  if (!range) return new Response(null,{ status:416,headers:{ ...privateHeaders,'Content-Range':`bytes */${size}`,'Accept-Ranges':'bytes' } })
  const headers: Record<string,string> = { ...privateHeaders,'Content-Type':'video/mp4','Accept-Ranges':'bytes','Content-Length':String(range.end-range.start+1) }
  if (range.partial) headers['Content-Range'] = `bytes ${range.start}-${range.end}/${size}`
  const body = request.method === 'HEAD' ? null : Readable.toWeb(createReadStream(filename,{ start:range.start,end:range.end })) as ReadableStream<Uint8Array>
  return new Response(body,{status:range.partial?206:200,headers})
}
