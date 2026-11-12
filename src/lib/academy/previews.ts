import type { AcademyLesson, Course } from '@/payload-types'
import { getPayload } from '@/lib/getPayload'
import manifest from '@/integrations/academy/manifest.json'

export function configuredPreview(course: Course, lesson: AcademyLesson) {
  const selected = typeof course.previewLesson === 'object' ? course.previewLesson?.id : course.previewLesson
  const lessonCourse = typeof lesson.course === 'object' ? lesson.course.id : lesson.course
  return selected === lesson.id && lessonCourse === course.id && lesson.kind === 'lesson' && course.previewFingerprint === lesson.fingerprint && manifest.lessons.some(row => row.key === lesson.key && row.fingerprint === lesson.fingerprint)
}

export async function isStudentPreview(lesson: AcademyLesson) {
  const course = typeof lesson.course === 'object' ? lesson.course : await (await getPayload()).findByID({ collection: 'courses', id: lesson.course, depth: 0 })
  return configuredPreview(course, lesson)
}

export async function availablePreviews(courseSlug?: string) {
  const rows = await (await getPayload()).find({ collection: 'courses', where: { and: [{ previewLesson: { exists: true } }, ...(courseSlug ? [{ slug: { equals: courseSlug } }] : [])] }, pagination: false, depth: 1 })
  return rows.docs.flatMap(course => typeof course.previewLesson === 'object' && course.previewLesson && configuredPreview(course, course.previewLesson) ? [{ course, lesson: course.previewLesson }] : [])
}
