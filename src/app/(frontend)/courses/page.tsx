import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { CourseFeatureCard } from '@/components/CourseFeatureCard'
import { getPayload } from '@/lib/getPayload'
import type { Where } from 'payload'

export const metadata = { title: 'Our Courses — TinitiateAI' }

const views = [
  { value: 'all', label: 'All Courses' },
  { value: 'trending', label: 'Trending' },
  { value: 'placement-assistance', label: 'Job Placement Programs' },
  { value: 'internship', label: 'Internships' },
  { value: 'certification', label: 'Certification Courses' },
] as const

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; view?: string; page?: string; welcome?: string }>
}) {
  const { category, q, view, page, welcome } = await searchParams
  const activeView = view && views.some((v) => v.value === view) ? view : 'all'
  const pageNumber = Math.max(1, Math.min(10000, Number.parseInt(page || '1', 10) || 1))
  const href = (values: { category?: string; view?: string; page?: string }) => {
    const params = new URLSearchParams({ view: activeView, ...(q ? { q } : {}), ...(category ? { category } : {}), ...values })
    for (const [key, value] of params) if (!value) params.delete(key)
    return `/courses?${params}`
  }
  const payload = await getPayload()

  const categories = await payload.find({ collection: 'categories', pagination: false, sort: 'name' })

  const conditions: Where[] = []
  if (activeView === 'trending') {
    conditions.push({ featured: { equals: true } })
  } else if (activeView !== 'all') {
    conditions.push({ tags: { equals: activeView } })
  }
  if (category) {
    conditions.push({ 'category.slug': { equals: category } })
  }
  if (q) {
    conditions.push({
      or: [{ title: { like: q } }, { shortDescription: { like: q } }],
    })
  }
  const where: Where = { and: conditions }

  const courses = await payload.find({ collection: 'courses', where, page: pageNumber, limit: 24, depth: 1, sort: 'title' })

  return (
    <Container className="py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">
          <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">Our</span>{' '}
          <span className="text-slate-900">Courses</span>
        </h1>
        <p className="mt-2 text-slate-600">Explore new and trending IT &amp; AI training programs.</p>
        {welcome && <div role="status" className="mt-5 rounded-2xl bg-brand-50 p-5 text-brand-900"><p className="font-semibold">Your student account is ready. Choose your next courses.</p><p className="mt-2 text-sm">Select one or more courses, review your selection and Submit Course Request. No payment will be collected.</p><Link href="/demos" className="mt-3 inline-block text-sm font-semibold underline">Try a free MasterClass preview →</Link></div>}
        <Link href="/checkout" className="mt-5 inline-block text-sm font-semibold text-brand-700">Review course selection →</Link>
        {q && (
          <p className="mt-3 text-sm text-slate-500">
            Showing results for &ldquo;{q}&rdquo; &middot;{' '}
            <Link href="/courses" className="font-medium text-brand-600 hover:underline">
              Clear search
            </Link>
          </p>
        )}
      </div>

      <form action="/courses" className="mt-6 flex max-w-xl gap-2">
        <input type="hidden" name="view" value={activeView} />
        {category && <input type="hidden" name="category" value={category} />}
        <input aria-label="Search courses" name="q" defaultValue={q} maxLength={200} placeholder="Search courses" className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3" />
        <button className="rounded-lg bg-brand-600 px-5 py-3 font-semibold text-white">Search</button>
      </form>

      <div className="mt-8 flex flex-wrap gap-6 border-b border-slate-200">
        {views.map((v) => (
          <Link
            key={v.value}
            href={href({ view: v.value })}
            className={`-mb-px border-b-2 pb-3 text-sm font-semibold transition ${
              activeView === v.value
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {v.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={href({ category: '' })}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            !category ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Categories
        </Link>
        {categories.docs.map((c) => (
          <Link
            key={c.id}
            href={href({ category: c.slug })}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              category === c.slug ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {courses.docs.map((course, i) => (
          <CourseFeatureCard key={course.id} course={course} index={i} />
        ))}
      </div>

      {courses.docs.length === 0 && (
        <p className="mt-10 text-center text-slate-500">No courses found in this view yet.</p>
      )}
      {courses.totalPages > 1 && <nav aria-label="Course pages" className="mt-10 flex items-center justify-center gap-6">
        {courses.hasPrevPage && <Link href={href({ page: String(pageNumber - 1) })}>← Previous</Link>}
        <span>Page {pageNumber} of {courses.totalPages}</span>
        {courses.hasNextPage && <Link href={href({ page: String(pageNumber + 1) })}>Next →</Link>}
      </nav>}
    </Container>
  )
}
