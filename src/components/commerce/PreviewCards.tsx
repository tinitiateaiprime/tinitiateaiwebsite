import Image from 'next/image'
import Link from 'next/link'
import { availablePreviews } from '@/lib/academy/previews'
import { siteUser } from '@/lib/auth/session'
export async function PreviewCards({ courseSlug, excludeCourses = [] }: { courseSlug?: string; excludeCourses?: number[] }) {
  const previews = (await availablePreviews(courseSlug)).filter(row => !excludeCourses.includes(row.course.id))
  if (!previews.length) return null
  const user = await siteUser()
  return <section id="masterclass-previews" className="mb-14 scroll-mt-36"><p className="text-xs font-bold uppercase tracking-widest text-brand-600">A free first step</p><h2 className="mt-3 text-3xl font-bold text-slate-900">Free MasterClass Interactive Previews</h2><p className="mt-3 max-w-2xl text-slate-600">Create a free student account or log in to explore the first approved lesson. Try the original dashboard and code examples before requesting full course access.</p><div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{previews.map(({ course, lesson }) => {
    const target = `/academy/lessons/${lesson.key}`
    return <article key={course.id} data-preview-course-id={course.id} className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm"><div className="flex h-40 items-center justify-between bg-gradient-to-br from-slate-950 to-brand-900 p-7"><div><span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-semibold text-cyan-200">Free student preview</span><p className="mt-4 text-lg font-bold text-white">{course.title}</p></div>{lesson.key.startsWith('foundational-python-') ? <Image src="/azure/python.png" alt="" width={68} height={68} className="h-16 w-16 object-contain" /> : <span aria-hidden="true" className="text-4xl text-cyan-300">⌘</span>}</div><div className="p-6"><h3 className="text-xl font-bold leading-7 text-slate-900">{lesson.title.replace(/\s*\|.*$/, '')}</h3><p className="mt-3 text-sm leading-6 text-slate-600">Explore the complete original interactive lesson, follow the slides and try the working controls. A subscription unlocks the remaining modules and tutorial videos.</p><Link href={user ? target : `/login?redirect=${encodeURIComponent(target)}`} className="mt-6 block rounded-full bg-brand-600 px-5 py-3 text-center text-sm font-semibold text-white">Try Free MasterClass →</Link><Link href={`/courses/${course.slug}`} className="mt-4 block text-center text-sm font-semibold text-brand-700">View Course Details</Link></div></article>
  })}</div></section>
}
