import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { siteUser, identity } from '@/lib/auth/session'
import { SessionBoundary } from '@/components/auth/AuthProvider'
import { studentLearning } from '@/lib/academy/learning'
import { LearningCards } from '@/components/academy/LearningCards'
import { PreviewCards } from '@/components/commerce/PreviewCards'
export const metadata = { title: 'My Learning | Tinitiate AI' }
export default async function LearningPage({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
  const user = await siteUser()
  if (user?.collection !== 'students') redirect('/login?redirect=/learning')
  const { courses } = await studentLearning(user.id)
  const selected = (await searchParams).course
  const visible = selected ? courses.filter(row => row.course.slug === selected) : courses
  return <SessionBoundary account={identity(user)!}><section className="bg-slate-950 text-white"><Container className="py-14"><p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">Your classroom</p><h1 className="mt-3 text-4xl font-bold">My Learning</h1><p className="mt-4 max-w-2xl text-slate-300">Your licensed courses, saved progress and next lesson, all in one place.</p></Container></section><Container className="py-12"><PreviewCards excludeCourses={courses.map(row=>row.course.id)} /><LearningCards courses={visible} />{selected && <Link href="/learning" className="mt-6 inline-block font-semibold text-brand-700">View all my licensed courses →</Link>}{visible.map(({ course, lessons }) => <section key={course.id} className="mt-12"><h2 className="text-2xl font-bold text-slate-900">{course.title} lessons</h2><ul className="mt-5 grid gap-3 md:grid-cols-2">{lessons.map(lesson => <li key={lesson.key}><Link href={`/academy/lessons/${lesson.key}`} className="flex h-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-300"><span><span className="block font-semibold text-slate-900">{lesson.title.replace(/\s*\|.*$/, '')}</span><span className="mt-1 block text-sm text-slate-500">{lesson.kind === 'course-hub' ? 'Course overview' : lesson.progress.complete ? 'Completed' : lesson.progress.started ? `${lesson.progress.percent}% explored` : 'Ready to start'}</span></span><span aria-hidden="true" className="text-brand-600">→</span></Link></li>)}</ul></section>)}</Container></SessionBoundary>
}
