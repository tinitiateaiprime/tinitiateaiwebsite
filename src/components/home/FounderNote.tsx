import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HandNote } from './SectionHeading';

/**
 * A real voice on the homepage: the CEO's own video and words (from the About
 * page). TODO(owner): add the CEO's name and a photo here when available.
 */
export function FounderNote() {
  return <section aria-labelledby="note-title" className="bg-surface py-14 sm:py-20">
    <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      <figure className="overflow-hidden rounded-[18px] border border-neutral-200 bg-night">
        <video controls playsInline preload="none" poster="/videos/tinitiate-ai-career-options-poster.webp" className="aspect-video w-full bg-black">
          <source src="/videos/tinitiate-ai-career-options.mp4" type="video/mp4" />
        </video>
        <figcaption className="flex items-center justify-between gap-4 px-5 py-3.5 text-white">
          <span className="text-[15px] font-semibold">STEM or non-STEM: your career options</span>
          <span className="shrink-0 text-sm text-white/60">5:54</span>
        </figcaption>
      </figure>
      <div>
        <HandNote arrow="none" className="text-accent">a note from our CEO</HandNote>
        <h2 id="note-title" className="mt-3 text-[1.9rem] font-semibold leading-[1.2] tracking-[-0.03em] text-ink sm:text-[2.3rem]">&ldquo;Training should help learners think, communicate, and deliver like professionals.&rdquo;</h2>
        <p className="mt-5 text-[17px] leading-8 text-neutral-600">The goal is not a certificate alone. It&apos;s being able to show your work, explain the decisions behind it, and handle what a real project expects of you. That&apos;s what we build every class around.</p>
        <p className="mt-6 text-[15px] font-semibold text-ink">CEO, Tinitiate AI Solutions</p>
        <Link href="/about" className="group mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent underline-offset-4 hover:underline">More about who we are <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" /></Link>
      </div>
    </div>
  </section>;
}
