import { Container } from '@/components/ui/Container'
import { Checkout } from '@/components/commerce/Checkout'
import { getPayload } from '@/lib/getPayload'
import { siteUser } from '@/lib/auth/session'
import { activeCourseIDs } from '@/lib/commerce/requests'
export const metadata = { title: 'Review Course Request | Tinitiate AI' }
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ add?: string }> }) {
  const user = await siteUser(); const payload = await getPayload()
  const [catalog, licensed, requests] = await Promise.all([
    payload.find({ collection: 'courses', pagination: false, depth: 0, select: { title: true, slug: true }, sort: 'title' }),
    user?.collection === 'students' ? activeCourseIDs(payload, user.id) : new Set<number>(),
    user?.collection === 'students' ? payload.find({ collection: 'course-subscription-requests', where: { and: [{ student: { equals: user.id } }, { status: { equals: 'pending' } }] }, pagination: false, depth: 0 }) : null,
  ])
  const query = Number((await searchParams).add)
  return <><section className="bg-slate-950 text-white"><Container className="py-14"><p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Your next learning path</p><h1 className="mt-3 text-4xl font-bold">Review Your Course Request</h1><p className="mt-4 max-w-2xl text-slate-300">One course or several — choose what you want to learn. No payment will be collected.</p></Container></section><Container className="py-12"><Checkout catalog={catalog.docs.map(course => ({ id: course.id, title: course.title, slug: course.slug }))} add={Number.isSafeInteger(query) && query > 0 ? query : null} licensed={[...licensed]} pending={requests?.docs.map(row => typeof row.course === 'object' ? row.course.id : row.course) || []} /></Container></>
}
