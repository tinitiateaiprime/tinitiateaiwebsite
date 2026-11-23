import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Signal } from 'lucide-react';
import type { Course } from '@/lib/courses';
import { courseDetails, formatDuration, formatLevel } from '@/lib/courseDetails';

/** One course in a grid: picture, title, one-line summary, level and length. */
export function CourseCard({ course, step }: { course: Course; step?: number }) {
  const { summary } = courseDetails(course);
  return <Link href={`/courses/${encodeURIComponent(course.slug)}`} className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-neutral-200 bg-surface transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_24px_50px_-32px_rgb(10_10_11/0.5)]">
    <div className="relative flex h-32 items-center justify-center bg-subtle">
      {course.image
        ? <Image unoptimized src={course.image} alt="" width={200} height={120} className="h-full w-full object-contain p-4" />
        : <span className="text-2xl font-semibold text-neutral-300">Tinitiate AI</span>}
      {step !== undefined && <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-surface">Step {step}</span>}
    </div>
    <div className="flex flex-1 flex-col p-5">
      <h3 className="text-lg font-semibold leading-snug tracking-[-0.02em] text-ink group-hover:text-accent">{course.title}</h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-neutral-500">{summary}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-medium text-neutral-600">
        <span className="inline-flex items-center gap-1.5"><Signal aria-hidden="true" className="size-3.5 text-accent" />{formatLevel(course.level)}</span>
        <span className="inline-flex items-center gap-1.5"><Clock aria-hidden="true" className="size-3.5 text-accent" />{formatDuration(course.duration)}</span>
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink">View syllabus <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
    </div>
  </Link>;
}
