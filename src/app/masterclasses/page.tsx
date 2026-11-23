import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { BrandMark } from '@/components/home/SectionHeading';
import { PlacementCell } from '@/components/masterclasses/PlacementCell';
import { MasterclassBrowser, totalTopics } from '@/components/masterclasses/MasterclassBrowser';

export const metadata: Metadata = {
  title: 'MasterClasses',
  description: 'Interactive MasterClasses in AI, data engineering, data governance, full stack and computer science foundations, plus a placement guide for freshers.',
};

export default function MasterclassesPage() {
  return <div className="bg-subtle">
    <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <div className="max-w-3xl">
          <h1 className="isolate text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-5xl">
            <BrandMark className="mr-[0.3em] inline-block h-[0.6em] w-auto -translate-y-[0.05em] align-baseline drop-shadow-[0_0_0.6px_rgb(10_10_11/0.45)]" />
            <a href="/masterclasses/index.html" className="group rounded-md" title="Open the MasterClass Academy home">Explore <span className="mc-word relative whitespace-nowrap"><span aria-hidden="true" className="mc-mark absolute inset-x-[-0.06em] bottom-[0.04em] -z-10 h-[0.36em] rounded-[3px] bg-[#fff200]" />MasterClasses</span><ArrowUpRight aria-hidden="true" className="mc-arrow ml-1 inline-block size-[0.55em] -translate-y-[0.35em] text-accent" /></a>
          </h1>
          <p className="mt-4 text-base leading-7 text-neutral-600 sm:text-lg">Free, self-paced lessons that open right in your browser. No sign-up. Pick a category, then a technology.</p>
          <p className="mt-2 text-[15px] text-neutral-500">Want a mentor, live classes and real projects? <a href="/request-callback?course=MasterClass%20learner" className="font-semibold text-accent underline-offset-4 hover:underline">Book 2 free live sessions</a>.</p>
        </div>
        <a href="/masterclasses/index.html" className="mc-cta mc-cta-ring group inline-flex h-12 shrink-0 items-center gap-2.5 rounded-full bg-accent pl-6 pr-5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-10px_rgb(47_84_235/0.7)] transition-colors hover:bg-[#2443c8]">
          Open MasterClass Academy <ArrowRight aria-hidden="true" className="mc-cta-arrow size-4" />
        </a>
      </header>

      <PlacementCell />

      <div className="mb-4 mt-10 flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">Technology MasterClasses</h2>
        <span className="text-sm font-medium text-neutral-500">{totalTopics} MasterClasses · 6 categories</span>
      </div>
      <MasterclassBrowser />
    </div>
  </div>;
}
