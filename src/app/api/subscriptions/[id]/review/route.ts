import { APIError } from 'payload'
import { authenticatedUser } from '@/lib/auth/session'
import { isAdmin } from '@/lib/academy/access'
import { getPayload } from '@/lib/getPayload'
import { readSmallJSON } from '@/lib/requestLimits'
import { apiFailure } from '@/lib/academy/authorization'
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticatedUser(request.headers, 'users')
    if (!isAdmin(user)) throw new APIError('Administrator review is required.', 403)
    if (request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) throw new APIError('Use the administrator interface to review requests.', 403)
    const input = await readSmallJSON(request) as { action?: string; note?: string }
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new APIError('Invalid review.', 400)
    const id = Number((await params).id)
    if (!Number.isSafeInteger(id) || !['approve', 'reject'].includes(input.action || '') || input.note && (typeof input.note !== 'string' || input.note.length > 2000)) throw new APIError('Invalid review.', 400)
    const row = await (await getPayload()).update({ collection: 'course-subscription-requests', id, overrideAccess: false, user, data: { status: input.action === 'approve' ? 'approved' : 'rejected', reviewNote: input.note || '' } })
    return Response.json({ id: row.id, status: row.status, license: row.license }, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (error) { return apiFailure(error) }
}
