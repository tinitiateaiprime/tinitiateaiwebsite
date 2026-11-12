import { activeCollection, AUDIENCE_COOKIE, collectionHeaders, cookieValues, STUDENT_COOKIE_PREFIX, USERS_COOKIE_PREFIX, type AuthCollection } from './cookies'
import { getPayload } from '@/lib/getPayload'

type RESTHandler = (request: Request, args: { params: Promise<{ slug?: string[] }> }) => Promise<Response>
const authPaths = new Set(['login', 'logout', 'me', 'refresh-token', 'forgot-password', 'reset-password', 'unlock', 'verify'])
function fromCMS(request: Request) {
  try {
    const referrer = new URL(request.headers.get('referer') || '')
    return referrer.origin === new URL(request.url).origin && /^\/admin(?:\/|$)/.test(referrer.pathname)
  } catch { return false }
}

function selection(request: Request, slug: string[]): AuthCollection {
  if (slug[0] === 'users') return 'users'
  if (slug[0] === 'students' && authPaths.has(slug[1])) return 'students'
  if (fromCMS(request)) return 'users'
  return activeCollection(request.headers)
}

function audienceCookie(collection: AuthCollection | null, secure: boolean) {
  return `${AUDIENCE_COOKIE}=${collection || ''}; Path=/; HttpOnly; SameSite=Lax; ${collection ? 'Max-Age=2592000' : 'Max-Age=0'}${secure ? '; Secure' : ''}`
}

export function scopedREST(handler: RESTHandler): RESTHandler {
  return async (request, args) => {
    const { slug = [] } = await args.params
    const collection = selection(request, slug)
    const headers = collectionHeaders(request.headers, collection)
    const isAuthAction = (slug[0] === 'students' || slug[0] === 'users') && authPaths.has(slug[1])
    const origin = request.headers.get('origin')
    if (isAuthAction && request.method === 'POST' && origin && origin !== new URL(request.url).origin) return Response.json({ errors: [{ message: 'Use this website to manage your session.' }] }, { status: 403 })

    const secure = new URL(request.url).protocol === 'https:'
    const logout = isAuthAction && slug[1] === 'logout' && request.method === 'POST'
    const login = isAuthAction && slug[1] === 'login' && request.method === 'POST'
    const payload = logout || login ? await getPayload() : null
    const previous = payload ? (await payload.auth({ headers })).user : null
    // An expired/already revoked session is already logged out. Do not invoke
    // Payload logout against a different collection or a nonexistent session.
    let response = logout && !previous
      ? Response.json({ message: 'Logged out successfully.' }, { headers: { 'Set-Cookie': `${USERS_COOKIE_PREFIX}-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}` } })
      : await handler(new Request(request.url, { method: request.method, headers, body: request.body, duplex: 'half' } as RequestInit), args)

    if (login && response.ok && previous?.collection === collection) {
      // Switching accounts in one collection also revokes the replaced session,
      // including the read tickets issued to that session.
      const url = new URL(`/api/${collection}/logout`, request.url)
      const logoutHeaders = new Headers(headers)
      logoutHeaders.delete('content-type'); logoutHeaders.delete('content-length')
      const revoked = await handler(new Request(url, { method: 'POST', headers: logoutHeaders }), { params: Promise.resolve({ slug: [collection, 'logout'] }) })
      if (!revoked.ok) return Response.json({ errors: [{ message: 'The previous session could not be closed. Please try again.' }] }, { status: 503 })
    }

    const outgoing = new Headers(response.headers)
    outgoing.delete('set-cookie')
    for (const cookie of response.headers.getSetCookie()) outgoing.append('set-cookie', collection === 'students' ? cookie.replace(`${USERS_COOKIE_PREFIX}-token=`, `${STUDENT_COOKIE_PREFIX}-token=`) : cookie)
    const preserveStudent = collection === 'users' && fromCMS(request) && cookieValues(request.headers).has(`${STUDENT_COOKIE_PREFIX}-token`) && activeCollection(request.headers) === 'students'
    if (login && response.ok && !preserveStudent) outgoing.append('set-cookie', audienceCookie(collection, secure))
    if (logout && response.ok && activeCollection(request.headers) === collection) {
      // Keep the logged-out audience selected: another collection's session
      // remains independent, rather than silently signing the website into it.
      outgoing.append('set-cookie', audienceCookie(collection, secure))
    }
    if (isAuthAction) outgoing.set('cache-control', 'private, no-store')
    response = new Response(response.body, { status: response.status, statusText: response.statusText, headers: outgoing })
    return response
  }
}
