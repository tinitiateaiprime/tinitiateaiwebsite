'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, type CSSProperties } from 'react';
import { ArrowRight, Clock, Radio, Signal } from 'lucide-react';
import { cn } from '@/lib/cn';

export type CourseCardData = { slug: string; title: string; image?: string; summary: string; level: string; duration: string; category: string };
export type CourseTab = { id: string; label: string; courses: CourseCardData[] };

const tint: Record<string, string> = {
  'AI & GenAI': 'bg-violet-100 text-violet-700', 'Data Engineering': 'bg-teal-100 text-teal-700', 'Cloud & DevOps': 'bg-sky-100 text-sky-700',
  'Web & Full Stack': 'bg-orange-100 text-orange-700', 'Databases & BI': 'bg-amber-100 text-amber-800', Programming: 'bg-indigo-100 text-indigo-700',
};

export function CourseTabs({ tabs }: { tabs: CourseTab[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const tab = tabs.find(t => t.id === active) ?? tabs[0];
  return <>
    <div role="tablist" aria-label="Course categories" className="-mx-4 mt-9 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
      {tabs.map(t => <button key={t.id} type="button" role="tab" id={`ctab-${t.id}`} aria-selected={t.id === active} aria-controls="ctab-panel" onClick={() => setActive(t.id)}
        className={cn('shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all', t.id === active ? 'bg-[linear-gradient(135deg,#2f54eb,#7c3aed)] text-white shadow-[0_10px_24px_-12px_rgb(47_84_235/0.9)]' : 'border border-neutral-200 bg-surface text-neutral-700 hover:border-accent hover:text-accent')}>
        {t.label}
      </button>)}
    </div>

    <ul key={tab.id} id="ctab-panel" role="tabpanel" aria-labelledby={`ctab-${tab.id}`} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {tab.courses.map((c, i) => <li key={c.slug} className="course-tile" style={{ '--d': `${i * 50}ms` } as CSSProperties}>
        <article className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-neutral-200 bg-surface transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-30px_rgb(47_84_235/0.55)]">
          <Link href={`/courses/${encodeURIComponent(c.slug)}`} tabIndex={-1} aria-hidden="true" className="relative block aspect-video overflow-hidden bg-[#122943]">
            {c.image && <Image unoptimized src={c.image} alt="" width={480} height={270} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />}
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-red-600"><Radio aria-hidden="true" className="size-3" />Live</span>
          </Link>
          <div className="flex flex-1 flex-col p-5">
            <span className={cn('self-start rounded-full px-2.5 py-0.5 text-xs font-semibold', tint[c.category] ?? tint.Programming)}>{c.category}</span>
            <h3 className="mt-3 text-[17px] font-bold leading-snug tracking-[-0.01em] text-ink"><Link href={`/courses/${encodeURIComponent(c.slug)}`} className="hover:text-accent">{c.title}</Link></h3>
            <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-neutral-500">{c.summary}</p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-neutral-100 pt-3 text-[13px] font-medium text-neutral-600">
              <span className="inline-flex items-center gap-1.5"><Signal aria-hidden="true" className="size-3.5 text-accent" />{c.level}</span>
              <span className="inline-flex items-center gap-1.5"><Clock aria-hidden="true" className="size-3.5 text-accent" />{c.duration}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href={`/request-callback?course=${encodeURIComponent(c.title)}`} className="inline-flex h-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white transition-colors hover:bg-[#2443c8]">Enroll now</Link>
              <Link href={`/courses/${encodeURIComponent(c.slug)}`} className="inline-flex h-10 items-center justify-center rounded-full border border-neutral-300 text-sm font-semibold text-ink transition-colors hover:border-ink">Syllabus</Link>
            </div>
          </div>
        </article>
      </li>)}
    </ul>

    <div className="mt-10 flex justify-center">
      <Link href={tab.id === 'trending' ? '/courses' : `/courses?category=${tab.id}`} className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-[15px] font-semibold text-surface transition-opacity hover:opacity-90">
        Explore all {tab.id === 'trending' ? '' : tab.label + ' '}courses <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  </>;
}
