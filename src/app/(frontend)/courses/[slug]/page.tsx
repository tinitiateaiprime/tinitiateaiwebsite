import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { RichText } from '@/components/RichText'
import { findCourse } from '@/lib/courseCatalog'
import { SelectCourseButton } from '@/components/commerce/CartProvider'

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await findCourse(slug)
  if (!course) notFound()
  if (course.slug !== slug) permanentRedirect(`/courses/${course.slug}`)

  const category = typeof course.category === 'object' ? course.category : null
  const trainer = typeof course.trainer === 'object' ? course.trainer : null

  return (
    <>
      <section className="bg-slate-950 text-white">
        <Container className="grid gap-10 py-16 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {category && (
              <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-brand-200">
                {category.name}
              </span>
            )}
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{course.title}</h1>
            <p className="mt-4 text-lg text-slate-300">{course.shortDescription}</p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-300">
              <span>Level: <strong className="text-white capitalize">{course.level}</strong></span>
              <span>Duration: <strong className="text-white">{course.duration}</strong></span>
              {trainer && <span>Trainer: <strong className="text-white">{trainer.name}</strong></span>}
              {course.curriculum && <span>Modules: <strong className="text-white">{course.curriculum.length}</strong></span>}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 text-slate-900 shadow-xl">
            <p className="text-lg font-bold">Get the full syllabus &amp; fees</p>
            <p className="mt-1 text-sm text-slate-500">
              Book a free 1:1 demo and our team will walk you through the curriculum, batch schedule, and pricing.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <SelectCourseButton id={course.id} title={course.title} />
              <Link href="/checkout" className="text-center text-sm font-semibold text-brand-700">Review course selection →</Link>
              <Link
                href={`/book-a-demo?course=${course.slug}`}
                className="rounded-full bg-brand-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                Book a Free Demo
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Talk to Us
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Container className="grid gap-12 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Link href={`/demos?course=${encodeURIComponent(course.slug)}`} className="mb-8 inline-block rounded-full bg-blue-600 px-6 py-3 font-semibold text-white">Try our free demos and previews</Link>
          <h2 className="text-2xl font-bold text-slate-900">About this course</h2>
          <RichText data={course.description} className="mt-4" />

          {course.keyFeatures && course.keyFeatures.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-slate-900">Key Features</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {course.keyFeatures.map((item, i) => (
                  <li key={item.id ?? i} className="flex items-start gap-2 text-sm text-slate-700">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {item.feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {course.curriculum && course.curriculum.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-slate-900">Curriculum</h2>
              <p className="mt-1 text-sm text-slate-500">{course.curriculum.length} modules, covered step by step.</p>
              <div className="mt-4 space-y-3">
                {course.curriculum.map((module, i) => (
                  <details
                    key={module.id ?? i}
                    className="group rounded-xl border border-slate-200 bg-white p-4 open:shadow-sm"
                    open={i === 0}
                  >
                    <summary className="cursor-pointer list-none text-base font-semibold text-slate-900">
                      {module.moduleTitle}
                    </summary>
                    {module.topics && module.topics.length > 0 && (
                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                        {module.topics.map((t, ti) => (
                          <li key={t.id ?? ti}>{t.topic}</li>
                        ))}
                      </ul>
                    )}
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {course.tools && course.tools.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tools &amp; Technologies</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.tools.map((item, i) => (
                  <span
                    key={item.id ?? i}
                    className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
                  >
                    {item.tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {course.targetAudience && course.targetAudience.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900">Who This Course Is For</h2>
              <ul className="mt-4 space-y-2">
                {course.targetAudience.map((item, i) => (
                  <li key={item.id ?? i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    {item.audience}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {trainer && (
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Trainer</h2>
              <Link
                href={`/trainers/${trainer.slug}`}
                className="mt-4 flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-lg font-bold text-white">
                  {trainer.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{trainer.name}</p>
                  <p className="text-sm text-slate-500">{trainer.title}</p>
                </div>
              </Link>
            </div>
          )}

          <div className="rounded-xl border border-dashed border-brand-300 bg-brand-50 p-5">
            <p className="text-sm font-semibold text-brand-800">Ready to get started?</p>
            <Link
              href={`/book-a-demo?course=${course.slug}`}
              className="mt-2 inline-block text-sm font-semibold text-brand-700 hover:underline"
            >
              Book a free demo to reserve your seat →
            </Link>
          </div>
        </div>
      </Container>
    </>
  )
}
