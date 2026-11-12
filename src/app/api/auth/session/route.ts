import { authenticatedUser, identity } from '@/lib/auth/session'
export async function GET(request: Request) {
  return Response.json({ user: identity(await authenticatedUser(request.headers)) }, { headers: { 'Cache-Control': 'private, no-store' } })
}
