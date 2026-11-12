import Link from 'next/link'
import { getPayload } from '@/lib/getPayload'

export async function QuickLinks() {
  const payload = await getPayload()

  // Get real counts directly from Payload collections
  const [courses, projects] = await Promise.all([
    payload.find({
      collection: 'courses',
      limit: 1,
      depth: 0,
    }),
    payload.find({
      collection: 'real-time-projects',
      limit: 1,
      depth: 0,
    }),
  ])

  const courseCount = courses.totalDocs
  const projectCount = projects.totalDocs

  const links = [
    {
      href: '/book-a-demo',
      label: 'Book a Free Demo',
      sub: 'Reserve your seat',
      gradient: 'from-blue-500 to-blue-700',
    },
    {
      href: '/courses',
      label: 'Explore Courses',
      sub: `${courseCount} ${courseCount === 1 ? 'course' : 'courses'} available`,
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      href: '/real-time-projects',
      label: 'Real-Time Projects',
      sub: `${projectCount} ${projectCount === 1 ? 'project' : 'projects'} available`,
      gradient: 'from-fuchsia-500 to-purple-700',
    },
    {
  href: '/new-batches',
  label: 'Upcoming Batches',
  sub: 'See upcoming batches',
  gradient: 'from-indigo-600 to-slate-900',
},
  ]

  return (
    <div className="relative z-10 mx-auto mt-4 grid w-full max-w-6xl grid-cols-2 gap-4 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`rounded-xl bg-gradient-to-br ${link.gradient} p-5 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl`}
        >
          <p className="text-sm font-bold">{link.label}</p>
          <p className="mt-1 text-xs text-white/80">{link.sub}</p>
        </Link>
      ))}
    </div>
  )
}