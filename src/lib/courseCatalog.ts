import { getPayload } from '@/lib/getPayload'
import aliases from '@/integrations/azure/course-aliases.json'

/** Redirect legacy identifiers only after resolving an actual CMS record. */
export async function findCourse(slug: string) {
  const payload = await getPayload()
  const mapping = aliases as Record<string, string>
  const target = mapping[slug] || slug
  const candidates = [...new Set([slug, target, ...Object.keys(mapping).filter(key => mapping[key] === target)])]
  const result = await payload.find({
    collection: 'courses', where: { slug: { in: candidates } }, limit: candidates.length, depth: 2,
  })
  return result.docs.find(course => course.slug === slug)
    || result.docs.find(course => course.slug === target)
    || (result.docs.length === 1 ? result.docs[0] : undefined)
}
