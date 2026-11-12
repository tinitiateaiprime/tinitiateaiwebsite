import { APIError } from 'payload'
import { authenticatedUser } from '@/lib/auth/session'
import { isAdmin } from '@/lib/academy/access'
import { readSmallJSON, takeRequest } from '@/lib/requestLimits'
import { deliverCourseNotification } from '@/lib/commerce/notifications'
import { apiFailure } from '@/lib/academy/authorization'
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticatedUser(request.headers, 'users')
    if (!isAdmin(user)) throw new APIError('Administrator access is required.', 403)
    if (request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) throw new APIError('Use the administrator interface to retry notifications.', 403)
    if (!takeRequest(`course-email-retry:${user!.id}`, 5)) throw new APIError('Please wait before retrying more notifications.', 429)
    const input = await readSmallJSON(request) as { acknowledgePossibleDuplicate?: boolean }
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new APIError('Invalid retry request.', 400)
    const id = Number((await params).id)
    if (!Number.isSafeInteger(id)) throw new APIError('Invalid notification.', 400)
    const row = await deliverCourseNotification(id, input.acknowledgePossibleDuplicate === true)
    return Response.json({ status: row.deliveryStatus, attempts: row.attempts, error: row.lastError }, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (error) { return apiFailure(error) }
}
