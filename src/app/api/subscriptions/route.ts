import { APIError } from 'payload'
import { authenticatedUser } from '@/lib/auth/session'
import { readSmallJSON, takeRequest } from '@/lib/requestLimits'
import { submitCourseRequests } from '@/lib/commerce/requests'
import { apiFailure } from '@/lib/academy/authorization'
export async function POST(request: Request) {
  try {
    const user = await authenticatedUser(request.headers)
    if (user?.collection !== 'students') throw new APIError('Log in with your student account to submit a course request.', 403)
    if (request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) throw new APIError('Submit your request from this website.', 403)
    const body = await readSmallJSON(request) as { courses?: unknown }
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new APIError('Invalid course request.', 400)
    if (!Array.isArray(body.courses) || !body.courses.length || body.courses.length > 20 || body.courses.some(id => !Number.isSafeInteger(id) || id < 1)) throw new APIError('Select between one and twenty valid courses.', 400)
    if (!takeRequest(`course-checkout:${user.id}`, 15)) throw new APIError('Please wait before submitting another request.', 429)
    const result = await submitCourseRequests(user, [...new Set(body.courses as number[])])
    return Response.json({ reference: result.reference, requests: [...result.submitted, ...result.existing].map(row => ({ id: row.id, reference: row.reference, course: typeof row.course === 'object' ? row.course.id : row.course, status: row.status })), alreadyLicensed: result.skipped, paymentStatus: 'not-collected' }, { status: result.submitted.length ? 201 : 200, headers: { 'Cache-Control': 'private, no-store' } })
  } catch (error) { return apiFailure(error) }
}
