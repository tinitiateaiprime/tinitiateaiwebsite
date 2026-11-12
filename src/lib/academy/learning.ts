import { getPayload } from '@/lib/getPayload'
import { idOf } from './authorization'
import type { AcademyLesson, CourseLicense, Course, LessonProgress } from '@/payload-types'
import progressConfig from '@/integrations/academy/progress-config.json'
import manifest from '@/integrations/academy/manifest.json'

export function licenseStatus(license: Pick<CourseLicense, 'status' | 'startsAt' | 'expiresAt'>, now = Date.now()) {
  if (license.status === 'revoked') return 'Revoked'
  if (license.expiresAt && Date.parse(license.expiresAt) <= now) return 'Expired'
  if (license.startsAt && Date.parse(license.startsAt) > now) return 'Upcoming'
  return 'Active'
}

export function lessonProgress(lesson: AcademyLesson, record?: LessonProgress) {
  const deck = lesson.sourcePath.split('/').pop()!.replace('.html', '')
  const state = record?.state as Record<string, unknown> | undefined
  const values = Array.isArray(state?.[deck]) ? state[deck] as number[] : []
  const python = lesson.sourcePath.startsWith('foundational/python/') && lesson.kind === 'lesson'
  const validConfig = manifest.files[progressConfig.source as keyof typeof manifest.files] === progressConfig.sha256
  const total = python ? validConfig ? (progressConfig.slides as Record<string, number>)[deck] : undefined : 1
  const completed = total ? new Set(values.filter(n => Number.isInteger(n) && n >= 0 && n < total)).size : 0
  return { percent: total ? Math.min(100, Math.round(completed / total * 100)) : 0, complete: !!total && completed >= total, started: values.length > 0 }
}

export async function studentLearning(studentID: number) {
  const payload = await getPayload()
  const [licenses, progress, enrollments] = await Promise.all([
    payload.find({ collection: 'course-licenses', where: { student: { equals: studentID } }, pagination: false, depth: 1, sort: '-createdAt' }),
    payload.find({ collection: 'lesson-progress', where: { student: { equals: studentID } }, pagination: false, depth: 0 }),
    payload.find({ collection: 'enrollments', where: { student: { equals: studentID } }, pagination: false, depth: 1, sort: '-enrolledAt' }),
  ])
  const active = licenses.docs.filter(row => licenseStatus(row) === 'Active')
  const groups = new Map<number, { course: Course; licenses: CourseLicense[] }>()
  for (const license of active) for (const course of license.courses) {
    if (typeof course !== 'object') continue
    const group = groups.get(course.id) || { course, licenses: [] }
    group.licenses.push(license); groups.set(course.id, group)
  }
  const lessons = groups.size ? (await payload.find({ collection: 'academy-lessons', where: { course: { in: [...groups.keys()] } }, pagination: false, depth: 0 })).docs : []
  const records = new Map(progress.docs.map(row => [idOf(row.lesson), row]))
  const order = ['print', 'variables', 'datatypes', 'operators', 'strings', 'lists']
  const courses = [...groups.values()].map(group => {
    const related = lessons.filter(lesson => idOf(lesson.course) === group.course.id).sort((a, b) => {
      const rank = (row: AcademyLesson) => row.sourcePath.startsWith('foundational/python/') ? order.indexOf(row.sourcePath.split('/').pop()!.replace('.html', '')) : -1
      const left = rank(a), right = rank(b)
      return left >= 0 && right >= 0 ? left - right : a.kind === b.kind ? a.sourcePath.localeCompare(b.sourcePath) : a.kind === 'lesson' ? -1 : b.kind === 'lesson' ? 1 : a.kind === 'course-hub' ? -1 : 1
    })
    const units = related.filter(lesson => lesson.kind === 'lesson')
    const measurable = units.length ? units : related.filter(lesson => lesson.kind === 'demo')
    const completed = measurable.filter(lesson => lessonProgress(lesson, records.get(lesson.id)).complete).length
    const percent = measurable.length ? Math.round(measurable.reduce((sum, lesson) => sum + lessonProgress(lesson, records.get(lesson.id)).percent, 0) / measurable.length) : 0
    const recent = [...progress.docs].filter(row => measurable.some(lesson => lesson.id === idOf(row.lesson)) && !lessonProgress(measurable.find(lesson => lesson.id === idOf(row.lesson))!, row).complete).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]
    const next = recent ? related.find(row => row.id === idOf(recent.lesson)) : measurable.find(lesson => !lessonProgress(lesson, records.get(lesson.id)).complete) || measurable[0] || related[0]
    const expiries = group.licenses.map(row => row.expiresAt)
    const expiry = expiries.some(value => !value) ? null : expiries.filter(Boolean).sort().at(-1)
    return { ...group, lessons: related.map(lesson => ({ ...lesson, progress: lessonProgress(lesson, records.get(lesson.id)) })), completed, total: measurable.length, percent, next, expiry }
  })
  return { courses, licenses: licenses.docs, inactive: licenses.docs.filter(row => licenseStatus(row) !== 'Active'), enrollments: enrollments.docs }
}
