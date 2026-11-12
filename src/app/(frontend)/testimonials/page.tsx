import { Container } from '@/components/ui/Container'
import { TestimonialCard } from '@/components/TestimonialCard'
import { getPayload } from '@/lib/getPayload'

export const metadata = { title: 'Testimonials — TinitiateAI' }

export default async function TestimonialsPage() {
  const payload = await getPayload()
  const testimonials = await payload.find({ collection: 'testimonials', limit: 50, depth: 1 })

  return (
    <Container className="py-16">
      <div className="max-w-2xl">
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">Testimonials</span>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Loved by students across cohorts</h1>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.docs.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </Container>
  )
}
