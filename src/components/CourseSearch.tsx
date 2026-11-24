'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import type { Course } from '@/lib/courses';
import { categories, courseCategory, type CategoryId } from '@/lib/courseDetails';
import { CourseCard } from '@/components/courses/CourseCard';
import { cn } from '@/lib/cn';

const PAGE = 12;

/** Browse all courses: category chips, search and level, with a short list by default. */
export function CourseSearch({ courses, initialCategory, initialQuery = '' }: { courses: Course[]; initialCategory?: string; initialQuery?: string }) {
  const valid = categories.some(c => c.id === initialCategory) ? initialCategory as CategoryId : 'all';
  const [category, setCategory] = useState<CategoryId | 'all'>(valid);
  const [search, setSearch] = useState(initialQuery);
  const [level, setLevel] = useState('all');
  const [shown, setShown] = useState(PAGE);

  const withCategory = useMemo(() => courses.map(c => ({ course: c, category: courseCategory(c) })), [courses]);
  const counts = useMemo(() => Object.fromEntries(categories.map(c => [c.id, withCategory.filter(x => x.category === c.id).length])), [withCategory]);
  const q = search.trim().toLowerCase();
  const visible = withCategory.filter(({ course, category: cat }) =>
    (category === 'all' || cat === category) &&
    (level === 'all' || course.level === level) &&
    (!q || `${course.title} ${course.shortDescription}`.toLowerCase().includes(q))).map(x => x.course);
  const levels = [...new Set(courses.map(c => c.level).filter(Boolean))];
  const reset = (fn: () => void) => { fn(); setShown(PAGE); };

  const chip = (on: boolean) => cn('shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors', on ? 'border-accent bg-accent text-white' : 'border-neutral-200 bg-surface text-neutral-700 hover:border-neutral-400');

  return <>
    <div className="sticky top-[var(--header-h)] z-20 -mx-4 mt-6 border-b border-neutral-200/70 bg-subtle/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search courses</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input value={search} onChange={e => reset(() => setSearch(e.target.value))} placeholder="Search: Python, AWS, React…" className="h-12 w-full rounded-full border border-neutral-300 bg-surface pl-11 pr-10 text-[15px] outline-none focus:border-accent focus:ring-4 focus:ring-accent/15" />
          {search && <button type="button" onClick={() => reset(() => setSearch(''))} aria-label="Clear search" className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-neutral-500 hover:bg-neutral-100"><X className="size-4" /></button>}
        </label>
        <select aria-label="Filter by level" className="h-12 rounded-full border border-neutral-300 bg-surface px-5 text-[15px]" value={level} onChange={e => reset(() => setLevel(e.target.value))}>
          <option value="all">All levels</option>{levels.map(x => <option key={x} value={x}>{x[0].toUpperCase() + x.slice(1)}</option>)}
        </select>
      </div>
      <div role="group" aria-label="Filter by category" className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        <button type="button" aria-pressed={category === 'all'} onClick={() => reset(() => setCategory('all'))} className={chip(category === 'all')}>All <span className="opacity-60">{courses.length}</span></button>
        {categories.map(c => <button key={c.id} type="button" aria-pressed={category === c.id} onClick={() => reset(() => setCategory(c.id))} className={chip(category === c.id)}>{c.label} <span className="opacity-60">{counts[c.id]}</span></button>)}
      </div>
    </div>

    <p className="mt-6 text-sm text-neutral-600" aria-live="polite">Showing {Math.min(shown, visible.length)} of {visible.length} courses</p>
    <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {visible.slice(0, shown).map(c => <li key={c.slug}><CourseCard course={c} /></li>)}
    </ul>
    {visible.length > shown && <div className="mt-8 flex justify-center">
      <button type="button" onClick={() => setShown(n => n + PAGE)} className="h-12 rounded-full border border-neutral-300 bg-surface px-7 text-[15px] font-semibold text-ink transition-colors hover:border-ink">Show more courses</button>
    </div>}
    {visible.length === 0 && <div className="mt-6 rounded-[14px] border border-neutral-200 bg-surface p-8 text-center">
      <p className="text-lg font-semibold text-ink">No course matches that search.</p>
      <p className="mt-2 text-neutral-600">We teach more than is listed here. <Link href={`/request-callback?course=${encodeURIComponent(search || 'A course not listed')}`} className="font-semibold text-accent underline underline-offset-4">Ask us about it</Link>.</p>
    </div>}
  </>;
}
