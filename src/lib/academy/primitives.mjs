import { createHmac, timingSafeEqual } from 'node:crypto'
export function signTicket(data, secret) {
  if (!secret || secret.length < 24) throw Error('A strong server secret is required')
  const body = Buffer.from(JSON.stringify(data)).toString('base64url')
  return body + '.' + createHmac('sha256', secret).update(body).digest('base64url')
}
export function verifyTicket(token, secret, now = Date.now()) {
  if (typeof token !== 'string' || token.length > 4096 || !secret) return null
  const [body, signature, extra] = token.split('.')
  if (!body || !signature || extra) return null
  const expected = createHmac('sha256', secret).update(body).digest()
  const actual = Buffer.from(signature, 'base64url')
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null
  try { const data = JSON.parse(Buffer.from(body,'base64url').toString()); return Number.isFinite(data.expires) && data.expires > now ? data : null } catch { return null }
}
export function parseRange(header, size) {
  if (!header) return { start: 0, end: size - 1, partial: false }
  const match = /^bytes=(\d*)-(\d*)$/.exec(header)
  if (!match || (!match[1] && !match[2])) return null
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]))
  const end = match[1] ? (match[2] ? Math.min(Number(match[2]),size-1) : size-1) : size-1
  return Number.isSafeInteger(start) && Number.isSafeInteger(end) && start >= 0 && start < size && end >= start ? { start,end,partial: true } : null
}
export function safeRelative(value) {
  if (typeof value !== 'string' || !value || value.includes('\\') || value.includes('\0') || value.split('/').some(x => x === '..' || x === '.' || !x) || value.startsWith('/')) return false
  return !value.startsWith('dashboard-tutor/') && !value.startsWith('Final-videos/') && !value.startsWith('assets/dashboard-tutorials/')
}
export function progressState(input, deck) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('Invalid progress')
  const values = input[deck]
  if (!Array.isArray(values) || values.length > 1000 || values.some(n => !Number.isInteger(n) || n < 0 || n > 999)) throw Error('Invalid slide progress')
  return { [deck]: [...new Set(values)].sort((a,b) => a-b) }
}
