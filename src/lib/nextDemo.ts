import { getPayload } from '@/lib/getPayload'

export async function getNextDemoSlot() {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'demo-slots',
    where: {
      and: [{ isActive: { equals: true } }, { startsAt: { greater_than: new Date().toISOString() } }],
    },
    depth: 2,
    limit: 1,
    sort: 'startsAt',
  })

  return result.docs[0] ?? null
}
