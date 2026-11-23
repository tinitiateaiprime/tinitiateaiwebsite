import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, ChevronDown, Clock, MonitorPlay, Signal } from 'lucide-react';
import { PiWhatsappLogoDuotone } from 'react-icons/pi';
import { courses, courseBySlug } from '@/lib/courses';
import { categories, courseCategory, courseDetails, formatDuration, formatLevel } from '@/lib/courseDetails';
import { CourseCard } from '@/components/courses/CourseCard';
import { included, paths } from '@/data/paths';
import { contact } from '@/lib/contactInfo';

export function generateStaticParams() { return courses.map(course => ({ slug: course.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const course = courseBySlug(decodeURIComponent((await params).slug));
  if (!course) return { title: 'Course' };
  return { title: `${course.title} Course`, description: courseDetails(course).summary || `Live, mentor-led ${course.title} training.` };
}

const h2 = 'text-[1.6rem] font-semibold tracking-[-0.03em] text-ink sm:text-[1.9rem]';

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const course = courseBySlug(decodeURIComponent((await params).slug));
  if (!course) notFound();
  const d = courseDetails(course);
  const category = courseCategory(course);
  const categoryLabel = categories.find(c => c.id === category)?.label;
  const book = `/request-callback?course=${encodeURIComponent(course.title)}`;
  const inPaths = paths.filter(p => p.courses.includes(course.slug));
  const related = courses.filter(c => c.slug !== course.slug && courseCategory(c) === category).slice(0, 4);
  const syllabus = course.topics?.filter(s => s.title) ?? [];
  // Outcomes when the record has them; otherwise the module titles say what you'll learn.
  const learn = d.outcomes.length ? d.outcomes : syllabus.slice(0, 8).map(s => s.title);
  const facts = [
    { label: 'Level', value: formatLevel(course.level), icon: Signal },
    { label: 'Duration', value: formatDuration(course.duration), icon: Clock },
    { label: 'Format', value: 'Live online, mentor-led', icon: MonitorPlay },
  ];

  return <div className="bg-surface">
    {/* Hero */}
    <section className="border-b border-neutral-100 bg-subtle">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:pb-10 lg:pt-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-1.5 text-sm text-neutral-500">
          <Link href="/courses" className="hover:text-ink">Live courses</Link><span aria-hidden="true">/</span>
          <Link href={`/courses?category=${category}`} className="hover:text-ink">{categoryLabel}</Link><span aria-hidden="true">/</span>
          <span className="text-ink">{course.title}</span>
        </nav>
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:gap-14">
        <div>
          <h1 className="text-[2.3rem] font-semibold leading-[1.06] tracking-[-0.045em] text-ink sm:text-[3rem]">{course.title}</h1>
          {d.summary && <p className="mt-4 text-lg leading-8 text-neutral-600">{d.summary}</p>}
          {d.stack.length > 0 && <ul className="mt-5 flex flex-wrap gap-2">{d.stack.map(s => <li key={s} className="rounded-full border border-neutral-200 bg-surface px-3 py-1 text-sm font-medium text-neutral-700">{s}</li>)}</ul>}
        </div>
        <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {facts.map(({ label, value, icon: Icon }) => <li key={label} className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-surface p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"><Icon aria-hidden="true" className="size-5" /></span>
            <span><span className="block text-xs font-semibold uppercase tracking-[0.1em] text-neutral-400">{label}</span><span className="block text-[15px] font-semibold text-ink">{value}</span></span>
          </li>)}
        </ul>
        </div>
      </div>
    </section>

    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14 lg:py-12">
      <div className="min-w-0 space-y-10">
        {learn.length > 0 && <section aria-labelledby="learn">
          <h2 id="learn" className={h2}>What you&apos;ll learn</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">{learn.map((l, i) => <li key={i} className="flex gap-3 rounded-2xl border border-neutral-200 p-4 text-[15px] leading-6 text-neutral-700"><CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />{l}</li>)}</ul>
        </section>}

        {d.overview.length > 0 && <section aria-labelledby="about">
          <h2 id="about" className={h2}>About this course</h2>
          <div className="mt-4 space-y-4 text-[17px] leading-8 text-neutral-600">{d.overview.map((p, i) => <p key={i}>{p}</p>)}</div>
        </section>}

        {syllabus.length > 0 && <section aria-labelledby="syllabus">
          <div className="flex items-baseline justify-between gap-4"><h2 id="syllabus" className={h2}>Syllabus</h2><span className="text-sm text-neutral-500">{syllabus.length} modules</span></div>
          <div className="mt-5 divide-y divide-neutral-200 rounded-[14px] border border-neutral-200">
            {syllabus.map((s, i) => <details key={i} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600">{i + 1}</span>
                <span className="flex-1 text-[16px] font-semibold text-ink">{s.title}</span>
                <span className="hidden text-sm text-neutral-400 sm:inline">{s.topics?.length ?? 0} topics</span>
                <ChevronDown aria-hidden="true" className="size-5 text-neutral-400 transition-transform group-open:rotate-180" />
              </summary>
              <ul className="space-y-2 px-5 pb-5 pl-[4.25rem] text-[15px] leading-6 text-neutral-600">{s.topics?.map((t, j) => <li key={j} className="list-disc">{t}</li>)}</ul>
            </details>)}
          </div>
        </section>}

        {(d.projects.length > 0 || d.capstone) && <section aria-labelledby="projects">
          <h2 id="projects" className={h2}>Projects you&apos;ll build</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {[...d.projects, ...(d.capstone ? [d.capstone] : [])].map((p, i) => <li key={i} className="rounded-[14px] border border-neutral-200 p-5">
              <p className="text-[16px] font-semibold text-ink">{p.title}</p>
              {p.description && <p className="mt-2 text-[15px] leading-6 text-neutral-600">{p.description}</p>}
              {p.deliverables && p.deliverables.length > 0 && <ul className="mt-3 space-y-1.5">{p.deliverables.map((x, j) => <li key={j} className="flex gap-2 text-sm text-neutral-600"><CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />{x}</li>)}</ul>}
            </li>)}
          </ul>
        </section>}

        {d.prerequisites.length > 0 && <section aria-labelledby="prereq">
          <h2 id="prereq" className={h2}>Before you start</h2>
          <ul className="mt-4 space-y-2">{d.prerequisites.map(p => <li key={p} className="flex gap-3 text-[16px] leading-7 text-neutral-700"><span className="mt-[11px] size-1.5 shrink-0 rounded-full bg-accent" />{p}</li>)}</ul>
          <p className="mt-4 text-[15px] text-neutral-500">Missing something? Your mentor will suggest a short starter course first.</p>
        </section>}

        {inPaths.length > 0 && <section aria-labelledby="paths" className="rounded-[14px] bg-subtle p-6">
          <h2 id="paths" className="text-lg font-semibold text-ink">Part of {inPaths.length > 1 ? 'these career paths' : 'a career path'}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">{inPaths.map(p => <li key={p.id}><Link href={`/paths/${p.id}`} className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-surface px-4 py-2 text-[15px] font-semibold text-ink hover:border-accent hover:text-accent">{p.label} <ArrowRight aria-hidden="true" className="size-4" /></Link></li>)}</ul>
        </section>}
      </div>

      {/* Booking card stays in view while the visitor reads the syllabus. */}
      <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
        <div className="rounded-[18px] border border-neutral-200 bg-surface p-6 shadow-[0_1px_2px_rgb(10_10_11/0.05)]">
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[13px] font-semibold text-emerald-700"><span className="size-2 rounded-full bg-emerald-500" />First 2 sessions free</p>
          <p className="mt-4 text-xl font-semibold tracking-[-0.02em] text-ink">Try {course.title} before you decide</p>
          <ul className="mt-4 space-y-2.5">{included.map(i => <li key={i} className="flex gap-2.5 text-[15px] text-neutral-700"><CheckCircle2 aria-hidden="true" className="mt-0.5 size-[18px] shrink-0 text-accent" />{i}</li>)}</ul>
          <Link href={book} className="group mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-accent text-[15px] font-semibold text-white transition-colors hover:bg-[#2443c8]">Book 2 free sessions <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" /></Link>
          <a href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer" className="mt-2 flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 text-[15px] font-semibold text-ink transition-colors hover:border-emerald-500 hover:text-emerald-600"><PiWhatsappLogoDuotone aria-hidden="true" className="size-5" />Ask on WhatsApp</a>
          <p className="mt-3 text-center text-[13px] text-neutral-500">Fees and batch dates shared on your free call.</p>
        </div>
      </aside>
    </div>

    {related.length > 0 && <section aria-labelledby="related" className="section-dark py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="related" className={h2}>More in {categoryLabel}</h2>
          <Link href={`/courses?category=${category}`} className="inline-flex items-center gap-1 text-[15px] font-semibold text-accent">See all <ArrowRight aria-hidden="true" className="size-4" /></Link>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{related.map(c => <li key={c.slug}><CourseCard course={c} /></li>)}</ul>
      </div>
    </section>}
  </div>;
}
