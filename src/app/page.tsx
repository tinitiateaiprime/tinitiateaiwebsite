import Link from 'next/link';
import Image from 'next/image';
import AzureHome from '@/components/azure/Home';
import { courses } from '@/lib/courses';

export default function HomePage() {
  return <AzureHome>
    <section className="mx-auto max-w-7xl px-6 py-16" aria-labelledby="courses-heading">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-wider text-blue-700">Learn at your own pace</p><h2 id="courses-heading" className="mt-2 text-3xl font-bold text-slate-900">Browse our courses</h2></div><Link href="/courses" className="font-semibold text-blue-700 hover:underline">View all {courses.length} courses →</Link></div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{courses.slice(0,8).map(course=><Link href={`/courses/${encodeURIComponent(course.slug)}`} key={course.slug} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="mb-4 flex h-28 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-cyan-100">{course.image?<Image unoptimized src={course.image} alt="" width={140} height={100} className="h-full w-full object-contain p-3"/>:<span className="text-3xl font-black text-blue-300">T</span>}</div><p className="text-xs font-semibold uppercase tracking-widest text-blue-600">{course.level||'Course'}</p><h3 className="mt-2 text-lg font-bold text-slate-900 group-hover:text-blue-700">{course.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{course.shortDescription}</p><span className="mt-4 inline-block text-sm font-semibold text-blue-700">Explore course →</span></Link>)}</div>
    </section>
    <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-16 text-white"><div className="mx-auto max-w-7xl"><p className="text-sm font-bold uppercase tracking-wider text-cyan-300">Interactive lessons · prerecorded videos</p><h2 className="mt-2 text-3xl font-bold">Explore our MasterClasses</h2><p className="mt-3 max-w-2xl text-slate-300">Discover focused learning paths in AI and Data Engineering, with practical lessons you can explore in your browser.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/masterclasses" className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300">Explore MasterClasses</Link><Link href="/masterclasses/foundational/python/index.html" className="rounded-full border border-white/40 px-6 py-3 font-semibold hover:bg-white/10">Open Python MasterClass</Link></div></div></section>
  </AzureHome>;
}
