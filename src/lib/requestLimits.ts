import { APIError } from 'payload'

const windows = new Map<string, { count: number; expires: number }>()
// Conservative per-process bounds. Multi-instance deployments also need an ingress rate limit.
export function takeRequest(key: string, limit: number, period = 60_000) {
  const now = Date.now()
  for (const [id, entry] of windows) if (entry.expires <= now) windows.delete(id)
  if (windows.size > 10_000) return false
  const current = windows.get(key) || { count: 0, expires: now + period }
  current.count++
  windows.set(key, current)
  return current.count <= limit
}

export function requestIdentity(headers: Headers) {
  // Trust forwarded addresses only behind a configured proxy that overwrites them.
  return process.env.TRUST_PROXY === 'true'
    ? (headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'public')
    : 'public'
}

export async function readSmallJSON(request: Request, maxBytes = 8192): Promise<unknown> {
  if (!request.headers.get('content-type')?.includes('application/json')) throw new APIError('Expected JSON', 415)
  if (Number(request.headers.get('content-length')) > maxBytes) throw new APIError('Request is too large', 413)
  if (!request.body) throw new APIError('JSON body is required', 400)
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let bytes = 0
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    bytes += value.length
    if (bytes > maxBytes) { await reader.cancel(); throw new APIError('Request is too large', 413) }
    chunks.push(value)
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) }
  catch { throw new APIError('Invalid JSON', 400) }
}
