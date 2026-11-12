export const USERS_COOKIE_PREFIX = 'tinitiate-users'
export const STUDENT_COOKIE_PREFIX = 'tinitiate-students'
export const AUDIENCE_COOKIE = 'tinitiate-audience'
export type AuthCollection = 'students' | 'users'

export function cookieValues(headers: Headers) {
  return new Map((headers.get('cookie') || '').split(';').map(value => {
    const index = value.indexOf('=')
    return [value.slice(0, index).trim(), value.slice(index + 1)] as [string, string]
  }).filter(([key]) => key))
}

export function activeCollection(headers: Headers): AuthCollection {
  const cookies = cookieValues(headers)
  const audience = cookies.get(AUDIENCE_COOKIE)
  if (audience === 'students' || audience === 'users') return audience
  return cookies.has(`${USERS_COOKIE_PREFIX}-token`) ? 'users' : 'students'
}

// Payload still verifies its own JWT and database session. Only the cookie name
// is adapted; neither identity nor role comes from the audience preference.
export function collectionHeaders(headers: Headers, collection: AuthCollection) {
  const result = new Headers(headers)
  const values = cookieValues(headers)
  const native = `${USERS_COOKIE_PREFIX}-token`
  const token = values.get(collection === 'students' ? `${STUDENT_COOKIE_PREFIX}-token` : native)
  values.delete(native)
  if (token) values.set(native, token)
  result.set('cookie', [...values].map(([key, value]) => `${key}=${value}`).join('; '))
  return result
}
