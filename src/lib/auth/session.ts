import { headers } from 'next/headers'
import { getPayload } from '@/lib/getPayload'
import { activeCollection, collectionHeaders, type AuthCollection } from './cookies'

export async function authenticatedUser(requestHeaders: Headers, collection = activeCollection(requestHeaders)) {
  const { user } = await (await getPayload()).auth({ headers: collectionHeaders(requestHeaders, collection) })
  return user?.collection === collection ? user as typeof user & { _sid?: string } : null
}

export async function siteUser() { return authenticatedUser(await headers()) }

export type SiteIdentity = { id: number; collection: AuthCollection; name: string; email: string; role?: string }
export function identity(user: Awaited<ReturnType<typeof authenticatedUser>>): SiteIdentity | null {
  return user ? { id: user.id, collection: user.collection, name: user.name, email: user.email, ...(user.collection === 'users' ? { role: user.role } : {}) } : null
}
