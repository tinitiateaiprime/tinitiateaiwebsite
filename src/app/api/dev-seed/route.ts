import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/getPayload'
import { seedDatabase } from '@/seed/seed'

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_DEV_SEED !== 'true') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  const payload = await getPayload()
  const { user } = await payload.auth({ headers: request.headers })
  if (user?.collection !== 'users' || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await seedDatabase(payload)

  return NextResponse.json({ ok: true })
}
