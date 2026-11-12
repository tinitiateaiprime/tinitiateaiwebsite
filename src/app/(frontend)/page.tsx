import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { TestimonialCard } from '@/components/TestimonialCard'
import AzureHome from '@/components/azure/Home'
import { QuickLinks } from '@/components/QuickLinks'
import { CourseCarousel } from '@/components/CourseCarousel'
import { getPayload } from '@/lib/getPayload'
import { CampusPlacementVisit } from '@/components/CampusPlacementVisit'

export default async function HomePage() {
  const payload = await getPayload()
  const [allCourses, categories, testimonials] = await Promise.all([
  payload.find({ collection: 'courses', limit: 20, sort: 'startDate', depth: 1 }),
  payload.find({ collection: 'categories', limit: 6 }),
  payload.find({ collection: 'testimonials', limit: 3, depth: 1 }),
])

  return (
    <>
      <AzureHome>
      <QuickLinks />



      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Categories" title="Explore our AI &amp; Data training tracks" />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.docs.map((category) => (
              <Link
                key={category.id}
                href={`/courses?category=${category.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 hover:shadow-md"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-20">
        <Container>
          <SectionHeading eyebrow="Featured" title="Popular courses to launch your AI career" />
          <div className="mt-10">
            <CourseCarousel courses={allCourses.docs} />
          </div>
          <div className="mt-8 text-center">
            <Link href="/courses" className="text-sm font-semibold text-brand-600 hover:underline">
              View all courses â†’
            </Link>
          </div>
        </Container>
      </section>
      
      {/* Campus Placement Visit */}
      <CampusPlacementVisit />
      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Success Stories" title="What our students say" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.docs.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-gradient-to-br from-brand-600 to-accent-500 py-16 text-white">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-bold">Not sure which course is right for you?</h2>
          <p className="max-w-xl text-brand-50">
            Book a free 1:1 demo session with our team and get a personalized learning path based on your goals.
          </p>
          <Link
            href="/book-a-demo"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50"
          >
            Book a Free Demo
          </Link>
        </Container>
      </section>
      </AzureHome>
    </>
  )
}



function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">{eyebrow}</span>
      <h2 className="mt-2 text-3xl font-bold text-slate-900">{title}</h2>
    </div>
  )
}
