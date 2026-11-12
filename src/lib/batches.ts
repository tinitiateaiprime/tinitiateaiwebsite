import { getPayload } from '@/lib/getPayload'
import type { Where } from 'payload'

export async function getUpcomingBatches(mode?: string) {
  const payload = await getPayload()

  const conditions: Where[] = [
    { isActive: { equals: true } },
    { startsAt: { greater_than: new Date().toISOString() } },
  ]
  if (mode) conditions.push({ mode: { equals: mode } })

  const result = await payload.find({
    collection: 'batches',
    where: { and: conditions },
    depth: 1,
    limit: 100,
    sort: 'startsAt',
  })

  return result.docs.map((b) => ({
    id: b.id,
    courseName: typeof b.course === 'object' ? b.course.title : '',
    facultyName: b.facultyName,
    mode: b.mode,
    startsAt: b.startsAt,
    meetingLink: b.meetingLink ?? null,
  }))
}
