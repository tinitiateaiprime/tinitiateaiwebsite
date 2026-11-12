import { notFound, permanentRedirect } from 'next/navigation'
import { findCourse } from '@/lib/courseCatalog'

// Azure used /courses/professionalCourses/{catalog}/{courseSlug}.
export default async function LegacyCoursePage({ params }: { params: Promise<{ slug: string; catalog: string; courseSlug: string }> }) {
  const { slug, catalog, courseSlug } = await params
  if (slug !== 'professionalCourses' || !['backend', 'cloud', 'dataEngineering', 'reporting', 'frontend', 'devops'].includes(catalog)) notFound()
  const course = await findCourse(courseSlug)
  if (!course) notFound()
  permanentRedirect(`/courses/${course.slug}`)
}
