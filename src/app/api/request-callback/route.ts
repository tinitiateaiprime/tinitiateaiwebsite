import { APIError } from 'payload'
import { getPayload } from '@/lib/getPayload'
import { readSmallJSON, requestIdentity, takeRequest } from '@/lib/requestLimits'

export async function POST(request: Request) {
  if (!takeRequest(`callback:${requestIdentity(request.headers)}`, 10)) return Response.json({ error: 'Please try again later.' }, { status: 429 })
  try {
    const input = await readSmallJSON(request)
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new APIError('Invalid callback request', 400)
    const body = input as Record<string, unknown>
    const text = (name: string, required = false, max = 200) => {
      const value = body[name]
      if (value !== undefined && typeof value !== 'string') throw new APIError(`Invalid ${name}`, 400)
      const result = typeof value === 'string' ? value.trim() : ''
      if ((required && !result) || result.length > max) throw new APIError(`Invalid ${name}`, 400)
      return result
    }
    const name = text('name', true)
    const email = text('email', true)
    const phone = text('phone', true, 40)
    const preferredTime = text('preferredTime', true)
    const course = text('course')
    const message = text('message', false, 4000)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new APIError('Invalid email', 400)
    const payload = await getPayload()
    await payload.create({ collection: 'contact-messages', overrideAccess: false, data: {
      name, email, phone, subject: `Callback${course ? `: ${course}` : ''}`,
      message: [`Preferred time: ${preferredTime}`, course && `Course: ${course}`, message].filter(Boolean).join('\n\n'),
    } })
    return Response.json({ ok: true }, { status: 201 })
  } catch (error) {
    const status = error instanceof APIError ? error.status : 500
    return Response.json({ error: status < 500 && error instanceof Error ? error.message : 'Unable to save your request. Please try again.' }, { status })
  }
}
