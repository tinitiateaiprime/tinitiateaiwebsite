import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { CourseCard } from '@/components/courses/CourseCard';
import { courseBySlug, type Course } from '@/lib/courses';
import { included, pathById, paths, toolIcon } from '@/data/paths';

export function generateStaticParams() { return paths.map(p => ({ id: p.id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const path = pathById((await params).id);
  return path ? { title: `${path.label} Career Path`, description: `${path.pitch} Live, mentor-led training with real projects. Your first 2 sessions are free.` } : { title: 'Career path' };
}

export default async function PathPage({ params }: { params: Promise<{ id: string }> }) {
  const path = pathById((await params).id);
  if (!path) notFound();
  const courses = path.courses.map(courseBySlug).filter((c): c is Course => Boolean(c));
  const book = `/request-callback?course=${encodeURIComponent(path.label)}`;

  return <>
    {/* Hero: what the job is, who it suits, the one action. */}
    <section className="bg-subtle">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-10 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 lg:pb-14 lg:pt-10">
        <div>
          <nav aria-label="Breadcrumb" className="text-sm text-neutral-500"><Link href="/paths" className="hover:text-ink">Career paths</Link> <span aria-hidden="true">/</span> <span className="text-ink">{path.label}</span></nav>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em]" style={{ color: path.accent }}>{path.note}</p>
          <h1 className="mt-2 text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.045em] text-ink sm:text-[3.4rem]">Become a {path.label}</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-600">{path.pitch}</p>
          <p className="mt-3 max-w-xl text-[15px] leading-7 text-neutral-500"><span className="font-semibold text-neutral-700">Best for:</span> {path.forWho}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href={book} className="group inline-flex h-13 items-center gap-2.5 rounded-full bg-accent pl-7 pr-6 text-base font-semibold text-white shadow-[0_8px_24px_-10px_rgb(47_84_235/0.7)] transition-colors hover:bg-[#2443c8]">
              Book 2 free sessions <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href={path.freeLesson.href} className="group inline-flex items-center gap-1.5 text-base font-semibold text-ink underline decoration-neutral-300 underline-offset-4 hover:decoration-ink">
              Try the free {path.freeLesson.label} <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
        <aside className="rounded-[18px] border border-neutral-200 bg-surface p-6 shadow-[0_1px_2px_rgb(10_10_11/0.05)] sm:p-8 lg:self-center">
          <p className="text-lg font-semibold tracking-[-0.02em] text-ink">Every path includes</p>
          <ul className="mt-4 space-y-3">{included.map(i => <li key={i} className="flex gap-3 text-[15px] text-neutral-700"><CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0" style={{ color: path.accent }} />{i}</li>)}</ul>
          <p className="mt-6 rounded-2xl bg-subtle p-4 text-sm leading-6 text-neutral-600"><span className="font-semibold text-ink">Your first 2 sessions are free.</span> Meet your mentor and see how we teach before you decide.</p>
        </aside>
      </div>
    </section>

    {/* What you will learn + tools + roles */}
    <section className="section-dark py-14 sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-[1.9rem] font-semibold tracking-[-0.035em] text-ink sm:text-[2.2rem]">What you&apos;ll learn</h2>
          <ul className="mt-6 space-y-3">{path.learn.map(l => <li key={l} className="flex gap-3 text-[17px] leading-7 text-neutral-700"><CheckCircle2 aria-hidden="true" className="mt-1 size-5 shrink-0" style={{ color: path.accent }} />{l}</li>)}</ul>
        </div>
        <div className="space-y-10">
          <div>
            <h2 className="text-[1.9rem] font-semibold tracking-[-0.035em] text-ink sm:text-[2.2rem]">Tools you&apos;ll use</h2>
            <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">{path.tools.map(t => <li key={t.name} className="light-island flex flex-col items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG logos */}
              <img src={toolIcon(t.icon)} alt="" width={32} height={32} className="size-8 object-contain" />
              <span className="text-xs font-semibold text-neutral-700">{t.name}</span>
            </li>)}</ul>
          </div>
          <div>
            <h2 className="text-[1.9rem] font-semibold tracking-[-0.035em] text-ink sm:text-[2.2rem]">Jobs it leads to</h2>
            <ul className="mt-5 flex flex-wrap gap-2">{path.roles.map(r => <li key={r} className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-[15px] font-medium text-neutral-700">{r}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>

    {/* The courses, in order */}
    {courses.length > 0 && <section className="bg-surface py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[1.9rem] font-semibold tracking-[-0.035em] text-ink sm:text-[2.2rem]">The courses, in order</h2>
            <p className="mt-2 max-w-2xl text-[17px] leading-7 text-neutral-600">Your mentor adjusts this to your starting point, so you can skip what you already know.</p>
          </div>
          <Link href={book} className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[15px] font-semibold text-surface transition-colors hover:bg-accent hover:text-white">Ask for batch dates <ArrowRight aria-hidden="true" className="size-4" /></Link>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{courses.map((c, i) => <li key={c.slug}><CourseCard course={c} step={i + 1} /></li>)}</ul>
      </div>
    </section>}

    {/* Other paths */}
    <section className="bg-surface pt-10 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-xl font-semibold tracking-[-0.02em] text-ink">Compare other paths</h2>
        <ul className="mt-4 flex flex-wrap gap-2">{paths.filter(p => p.id !== path.id).map(p => <li key={p.id}><Link href={`/paths/${p.id}`} className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-[15px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent">{p.label} <ArrowRight aria-hidden="true" className="size-4" /></Link></li>)}</ul>
      </div>
    </section>
  </>;
}
