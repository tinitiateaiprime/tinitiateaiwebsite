import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Gift } from 'lucide-react';
import { toolIcon } from '@/data/paths';
import { HeroSearch } from './HeroSearch';

const popular = ['Python', 'AWS', 'Generative AI', 'Data Engineering', 'React', 'Snowflake'];
const stack = [['Python', 'python'], ['OpenAI', 'openai'], ['AWS', 'aws'], ['Azure', 'azure'], ['React', 'react']] as const;

/**
 * Bright, photo-led hero: who we train and how, a course search, popular
 * topics and the two main actions. The photo carries small cards that answer
 * "is it live?", "when can I start?" and "what does it cost to try?".
 */
export function HomeHero() {
  return <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-[linear-gradient(160deg,#eef2ff_0%,#ffffff_45%,#fff7ed_100%)] dark:bg-[linear-gradient(160deg,#10142b_0%,#0e0e11_50%,#1a1220_100%)]">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgb(47_84_235/0.12)_1px,transparent_0)] [background-size:26px_26px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
    <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-40 -z-10 size-[520px] rounded-full bg-[#6681ff]/25 blur-3xl" />
    <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-10 -z-10 size-[420px] rounded-full bg-[#ec4899]/15 blur-3xl" />
    <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/3 -z-10 size-[360px] rounded-full bg-[#fff200]/25 blur-3xl dark:bg-[#fff200]/5" />

    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-24 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:pb-28 lg:pt-16">
      <div className="hero-rise">
        <p className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-surface/80 px-3.5 py-1.5 text-[13px] font-semibold text-accent shadow-sm backdrop-blur">
          <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-emerald-500" /></span>
          Live online classes · India &amp; USA batches
        </p>
        <h1 id="hero-title" className="mt-5 text-[2.5rem] font-bold leading-[1.05] tracking-[-0.04em] text-ink [overflow-wrap:normal] sm:text-[3.4rem] xl:text-[3.9rem]">
          Launch your tech career in{' '}
          <span className="bg-[linear-gradient(100deg,#2f54eb,#7c3aed_45%,#ec4899)] bg-clip-text text-transparent">AI, Cloud, Data</span>{' '}
          &amp; Full&nbsp;Stack
        </h1>
        <p className="mt-5 max-w-[34rem] text-[17px] leading-8 text-neutral-600 sm:text-lg">
          Live, mentor-led classes with real-time projects, resume and interview prep. Beginners welcome, and your first 2 sessions are free.
        </p>

        <div className="mt-7 max-w-[36rem]"><HeroSearch /></div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-neutral-500">Popular:</span>
          {popular.map(p => <Link key={p} href={`/courses?q=${encodeURIComponent(p)}`} className="rounded-full border border-neutral-200 bg-surface/80 px-3 py-1 text-sm font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent">{p}</Link>)}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/request-callback" className="group inline-flex h-13 items-center gap-2 rounded-full bg-accent px-7 text-base font-semibold text-white shadow-[0_14px_30px_-12px_rgb(47_84_235/0.8)] transition-colors hover:bg-[#2443c8]">
            Book 2 free sessions <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href="/paths" className="inline-flex h-13 items-center rounded-full border border-neutral-300 bg-surface px-7 text-base font-semibold text-ink transition-colors hover:border-ink">
            Explore career paths
          </Link>
        </div>
      </div>

      <div className="hero-rise relative mx-auto w-full max-w-[560px] [--d:150ms] lg:max-w-none">
        <div aria-hidden="true" className="absolute -inset-3 -z-10 rotate-[-3deg] rounded-[32px] bg-[linear-gradient(135deg,#2f54eb,#7c3aed_50%,#ec4899)] opacity-90" />
        <div className="overflow-hidden rounded-[28px] border-4 border-white shadow-[0_40px_80px_-40px_rgb(10_10_11/0.6)] dark:border-neutral-200">
          <Image src="/images/training/weekend-training.png" alt="A mentor guiding a small group of learners working on laptops" width={1672} height={941} loading="eager" fetchPriority="high" sizes="(min-width: 1024px) 560px, 100vw" className="aspect-[4/3] w-full object-cover object-[70%_50%]" />
        </div>

        <div className="hero-float absolute -left-3 top-6 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[0_20px_40px_-20px_rgb(10_10_11/0.5)] ring-1 ring-neutral-200 sm:-left-8">
          <span className="relative flex size-2.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-70" /><span className="relative inline-flex size-2.5 rounded-full bg-red-500" /></span>
          <span><span className="block text-sm font-bold text-ink">Live, not recorded</span><span className="block text-xs text-neutral-500">Ask questions in every class</span></span>
        </div>

        <div className="hero-float absolute -right-2 top-1/2 rounded-2xl bg-surface p-3.5 shadow-[0_20px_40px_-20px_rgb(10_10_11/0.5)] ring-1 ring-neutral-200 [--float:1.2s] sm:-right-6">
          <p className="text-xs font-semibold text-neutral-500">Tools you&apos;ll use</p>
          <ul className="light-island mt-2 flex -space-x-2">
            {stack.map(([name, icon]) => <li key={name} title={name} className="grid size-9 place-items-center rounded-full border-2 border-white bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG logos */}
              <img src={toolIcon(icon)} alt={name} width={20} height={20} className="size-5 object-contain" />
            </li>)}
          </ul>
        </div>

        <div className="hero-float absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[0_20px_40px_-20px_rgb(10_10_11/0.5)] ring-1 ring-neutral-200 [--float:.6s] sm:left-8">
          <span className="grid size-10 place-items-center rounded-xl bg-amber-100 text-amber-700"><CalendarDays aria-hidden="true" className="size-5" /></span>
          <span><span className="block text-sm font-bold text-ink">New batches every month</span><span className="block text-xs text-neutral-500">Weekday &amp; weekend timings</span></span>
        </div>

        <div className="absolute -bottom-6 right-4 hidden items-center gap-2 rounded-full bg-[#fff200] px-4 py-2.5 text-sm font-bold text-[#0a0a0b] shadow-[0_16px_30px_-14px_rgb(10_10_11/0.6)] sm:flex">
          <Gift aria-hidden="true" className="size-4" />2 sessions free
        </div>
      </div>
    </div>
  </section>;
}
