import ProfessionalOverview from '@/components/azure/ProfessionalOverview'
import { getPayload } from '@/lib/getPayload'
export const metadata = { title: 'Professional Training | Tinitiate AI' }
export default async function ProfessionalPage() {
  const payload = await getPayload()
  const courses = await payload.find({ collection: 'courses', limit: 200, depth: 1, sort: 'title' })
  return <ProfessionalOverview courses={courses.docs} />
}
