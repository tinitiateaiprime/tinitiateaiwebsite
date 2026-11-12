import { headers as getHeaders } from 'next/headers'
import { authenticatedUser } from '@/lib/auth/session'
import type { Student } from '@/payload-types'

export async function getCurrentStudent(): Promise<Student | null> {
  const headers = await getHeaders()
  const user = await authenticatedUser(headers)

  if (user && 'collection' in user && user.collection === 'students') {
    return user as unknown as Student
  }

  return null
}
