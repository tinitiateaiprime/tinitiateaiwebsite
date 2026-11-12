import { Container } from '@/components/ui/Container'
import { DemoBookingForm } from '@/components/DemoBookingForm'
import { getPayload } from '@/lib/getPayload'

export const metadata = { title: 'Book a Demo — TinitiateAI' }

export default async function BookADemoPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>
}) {
  const { course: courseSlug } = await searchParams
  const payload = await getPayload()

  const [slotsResult, coursesResult] = await Promise.all([
    payload.find({
      collection: 'demo-slots',
      where: { and: [{ isActive: { equals: true } }, { startsAt: { greater_than: new Date().toISOString() } }] },
      depth: 1,
      limit: 50,
      sort: 'startsAt',
    }),
    payload.find({ collection: 'courses', pagination: false, sort: 'title' }),
  ])

  const slotsWithAvailability = await Promise.all(
    slotsResult.docs.map(async (slot) => {
      const bookings = await payload.count({
        collection: 'demo-bookings',
        where: { and: [{ slot: { equals: slot.id } }, { status: { not_equals: 'cancelled' } }] },
      })
      return {
        id: slot.id,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        courseTitle: typeof slot.course === 'object' ? slot.course?.title ?? null : null,
        seatsRemaining: Math.max(slot.capacity - bookings.totalDocs, 0),
      }
    }),
  )

  const availableSlots = slotsWithAvailability.filter((s) => s.seatsRemaining > 0)

  const courses = coursesResult.docs.map((c) => ({ id: c.id, title: c.title, slug: c.slug }))
  const preselectedCourse = courses.find((c) => c.slug === courseSlug) ?? null

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">Book a Demo</span>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          Reserve your free 1:1 demo session
        </h1>
        <p className="mt-4 text-slate-600">
          Pick a time that works for you. A member of our team will walk you through the curriculum, answer
          your questions, and help you choose the right course.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <DemoBookingForm slots={availableSlots} courses={courses} preselectedCourseId={preselectedCourse?.id ?? null} />
      </div>
    </Container>
  )
}
