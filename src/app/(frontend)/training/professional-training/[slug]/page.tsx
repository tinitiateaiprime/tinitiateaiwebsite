import { notFound, permanentRedirect } from 'next/navigation'
import { findCourse } from '@/lib/courseCatalog'
export default async function LegacyProfessionalPage({ params }: { params: Promise<{ slug: string }> }) {
  const course = await findCourse((await params).slug)
  if (!course) notFound()
  permanentRedirect(`/courses/${course.slug}`)
}
