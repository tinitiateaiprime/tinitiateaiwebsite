import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { courses } from '@/lib/courses';
import { CourseSearch } from '@/components/CourseSearch';
import { BrandMark, Highlight } from '@/components/home/SectionHeading';
import { paths } from '@/data/paths';

export const metadata: Metadata = {
  title: 'Live Courses',
  description: 'Live, mentor-led courses in AI, cloud, data engineering, full stack development, databases and programming. See the syllabus, level and duration of every course.',
};

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const { category } = await searchParams;
  return <div className="bg-subtle">
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:pt-12">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-10">
      <div>
      <h1 className="isolate text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-5xl">
        <BrandMark className="mr-[0.3em] inline-block h-[0.6em] w-auto -translate-y-[0.05em] align-baseline drop-shadow-[0_0_0.6px_rgb(10_10_11/0.45)]" />
        Live <Highlight>courses</Highlight>
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">Every course is taught live by an industry mentor. Open any course to see the full syllabus, level and duration.</p>
      </div>

      {/* Most visitors want a job, not one tool: point them to the paths first. */}
      <div className="rounded-[16px] border border-neutral-200 bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[15px] text-neutral-700"><span className="font-semibold text-ink">Aiming for a job role?</span> Start with a career path. It bundles the right courses in order.</p>
          <Link href="/request-callback?course=Not%20sure%20yet" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent underline-offset-4 hover:underline">Help me choose <ArrowRight aria-hidden="true" className="size-4" /></Link>
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">{paths.map(p => <li key={p.id}><Link href={`/paths/${p.id}`} className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-subtle px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent">{p.label}</Link></li>)}</ul>
      </div>
      </div>

      <CourseSearch courses={courses} initialCategory={typeof category === 'string' ? category : undefined} />
    </div>
  </div>;
}
