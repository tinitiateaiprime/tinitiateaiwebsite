import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { siteUser, identity } from '@/lib/auth/session'
import { SessionBoundary } from '@/components/auth/AuthProvider'
import { studentLearning, licenseStatus } from '@/lib/academy/learning'
import { LearningCards } from '@/components/academy/LearningCards'
import { RequestSummary } from '@/components/commerce/RequestSummary'
import { PreviewCards } from '@/components/commerce/PreviewCards'

export const metadata = { title: 'My Dashboard | Tinitiate AI' }
export default async function DashboardPage() {
  const student = await siteUser()
  if (student?.collection !== 'students') redirect('/login?redirect=/dashboard')
  const data = await studentLearning(student.id)
  const completed = data.courses.reduce((sum, course) => sum + course.completed, 0)
  return <SessionBoundary account={identity(student)!}>
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div aria-hidden="true" className="absolute -right-24 -top-40 h-96 w-96 rounded-full bg-brand-600/25 blur-3xl" />
      <Container className="relative py-14 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">Your next chapter starts here</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6"><div><h1 className="text-3xl font-bold sm:text-4xl">Welcome back, {student.name}</h1><p className="mt-3 break-all text-slate-300">{student.email}</p></div><Link href="/profile" className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">My Profile →</Link></div>
        <dl className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">{[[data.courses.length, 'Active licensed courses'], [completed, 'Completed lessons'], [data.enrollments.length, 'Enrollment requests']].map(([value, label]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"><dt className="text-sm text-slate-300">{label}</dt><dd className="mt-2 text-3xl font-bold">{value}</dd></div>)}</dl>
      </Container>
    </section>
    <Container className="space-y-12 py-12">
      <RequestSummary student={student.id} activeCourses={data.courses.map(row => row.course.id)} />
      <PreviewCards excludeCourses={data.courses.map(row => row.course.id)} />
      <section><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-bold text-slate-900">My licensed courses</h2><p className="mt-2 text-slate-600">These active licenses give you access to the lessons below.</p></div><Link href="/learning" className="text-sm font-semibold text-brand-700">My Learning →</Link></div><LearningCards courses={data.courses} /><p className="mt-4 text-xs text-slate-500">Progress reflects slides explored or lessons marked complete. It is not a graded assessment.</p></section>
      {data.inactive.length > 0 && <section><h2 className="text-2xl font-bold text-slate-900">License history</h2><p className="mt-2 text-sm text-slate-600">These grants do not currently unlock lessons. An active license may separately cover the same course.</p><ul className="mt-5 space-y-3">{data.inactive.map(license => <li key={license.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5"><div><p className="font-semibold text-slate-900">{license.courses.map(course => typeof course === 'object' ? course.title : 'Course').join(', ')}</p><p className="mt-1 text-sm text-slate-500">{license.expiresAt ? `Expiry: ${new Date(license.expiresAt).toLocaleDateString('en-IN', { dateStyle: 'medium', timeZone: 'UTC' })}` : license.startsAt ? `Starts: ${new Date(license.startsAt).toLocaleDateString('en-IN', { dateStyle: 'medium', timeZone: 'UTC' })}` : 'Contact us to discuss access.'}</p></div><span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">{licenseStatus(license)}</span></li>)}</ul></section>}
      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8"><h2 className="text-2xl font-bold text-slate-900">Enrollment requests</h2><p className="mt-2 text-sm text-slate-600">Enrollment records your interest or registration. It does not establish payment or unlock lessons; course access is listed separately above.</p>{!data.enrollments.length ? <p className="mt-5 text-sm text-slate-500">You haven&apos;t enrolled in any courses yet.</p> : <ul className="mt-5 divide-y divide-slate-200">{data.enrollments.map(enrollment => { const course = typeof enrollment.course === 'object' ? enrollment.course : null; return course ? <li key={enrollment.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><Link href={`/courses/${course.slug}`} className="font-semibold text-slate-900 hover:text-brand-700">{course.title}</Link><p className="mt-1 text-sm text-slate-500">{enrollment.enrolledAt ? `Requested ${new Date(enrollment.enrolledAt).toLocaleDateString('en-IN', { timeZone: 'UTC' })}` : 'Enrollment recorded'}</p></div><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">{enrollment.status}</span></li> : null })}</ul>}</section>
      <section className="flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-brand-50 p-7"><div><h2 className="text-xl font-bold text-brand-900">Keep your curiosity moving</h2><p className="mt-2 text-sm text-slate-600">Try a free interactive demo or explore your next course.</p></div><div className="flex gap-4 text-sm font-semibold"><Link href="/demos" className="text-brand-700">Free Demos →</Link><Link href="/courses" className="text-brand-700">Browse Courses →</Link></div></section>
    </Container>
  </SessionBoundary>
}
