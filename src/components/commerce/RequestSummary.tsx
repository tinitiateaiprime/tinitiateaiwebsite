import Link from 'next/link'
import { getPayload } from '@/lib/getPayload'
import type { CourseSubscriptionRequest } from '@/payload-types'
export async function RequestSummary({ student, activeCourses }: { student: number; activeCourses: number[] }) {
  const rows = await (await getPayload()).find({ collection: 'course-subscription-requests', where: { student: { equals: student } }, pagination: false, depth: 2, sort: '-requestedAt' })
  if (!rows.docs.length) return null
  function label(row: CourseSubscriptionRequest, courseID: number) {
    return row.status === 'pending' ? 'Subscription Requested — Pending Approval' : row.status === 'rejected' ? 'Request Rejected' : activeCourses.includes(courseID) ? 'Approved — License Active' : 'Approved Request — License Inactive'
  }
  return <section id="subscription-requests" className="scroll-mt-36"><h2 className="text-2xl font-bold text-slate-900">Course Subscription Requests</h2><p className="mt-2 text-sm text-slate-600">No payment was collected. Each requested course is reviewed separately; only active licenses unlock full lessons.</p><ul className="mt-5 space-y-4">{rows.docs.map(row => {
    const course = typeof row.course === 'object' ? row.course : null
    if (!course) return null
    const preview = typeof course.previewLesson === 'object' ? course.previewLesson : null
    return <li key={row.id} data-subscription-request={row.id} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><Link href={`/courses/${course.slug}`} className="font-semibold text-slate-900">{course.title}</Link><p className="mt-2 text-xs text-slate-500">{row.reference} · {new Date(row.requestedAt).toLocaleDateString('en-IN', { timeZone: 'UTC' })}</p></div><span className={`rounded-full px-3 py-2 text-xs font-semibold ${row.status === 'pending' ? 'bg-amber-50 text-amber-900' : row.status === 'rejected' ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'}`}>{label(row, course.id)}</span></div>{row.reviewNote && <p className="mt-3 text-sm text-slate-600">{row.reviewNote}</p>}<div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">{preview && <Link href={`/academy/lessons/${preview.key}`} className="text-brand-700">Try Free Preview →</Link>}{row.status === 'approved' && activeCourses.includes(course.id) ? <Link href={`/learning?course=${encodeURIComponent(course.slug)}`} className="text-brand-700">Open My Learning →</Link> : row.status !== 'pending' && <Link href={`/checkout?add=${course.id}`} className="text-brand-700">Request Subscription Again →</Link>}</div></li>
  })}</ul></section>
}
