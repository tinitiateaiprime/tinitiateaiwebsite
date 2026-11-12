import BeginnerOverview from '@/components/azure/BeginnerOverview'
import { getPayload } from '@/lib/getPayload'
export const metadata = { title: 'Beginner Training | Tinitiate AI' }
export default async function BeginnerPage() {
  const payload = await getPayload()
  const courses = await payload.find({ collection: 'courses', where: { level: { equals: 'beginner' } }, limit: 200, depth: 1, sort: 'title' })
  return <BeginnerOverview courses={courses.docs} />
}
