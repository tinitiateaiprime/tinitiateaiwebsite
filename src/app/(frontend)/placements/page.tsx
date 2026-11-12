import { Container } from '@/components/ui/Container'
import { TestimonialCard } from '@/components/TestimonialCard'
import { getPayload } from '@/lib/getPayload'
import { getSiteSettings } from '@/lib/siteSettings'

export const metadata = { title: 'Placements — TinitiateAI' }

export default async function PlacementsPage() {
  const payload = await getPayload()
  const [settings, testimonials] = await Promise.all([
    getSiteSettings(),
    payload.find({
      collection: 'testimonials',
      where: { placedAt: { exists: true } },
      limit: 50,
      depth: 1,
    }),
  ])

  return (
    <>
      <section className="bg-slate-950 py-16 text-white">
        <Container>
          <span className="text-sm font-semibold uppercase tracking-wide text-brand-300">Placements</span>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold sm:text-4xl">
            {settings.studentsPlaced}+ students placed at {settings.hiringPartners}+ hiring partners
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Our career support team works with every student on interview preparation, portfolio building, and
            employer introductions until they land a role.
          </p>
        </Container>
      </section>

      <Container className="py-16">
        <h2 className="text-2xl font-bold text-slate-900">Recent placement stories</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.docs.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </Container>
    </>
  )
}
