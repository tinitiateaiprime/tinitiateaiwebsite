import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { BrandMark, Highlight } from '@/components/home/SectionHeading';
import { paths, toolIcon } from '@/data/paths';

export const metadata: Metadata = {
  title: 'Career Paths',
  description: 'Compare five live, mentor-led career paths: AI Engineer, Agentic AI Developer, Cloud Engineer, Data Engineer and Full Stack Developer.',
};

export default function PathsPage() {
  return <div className="bg-[#f7f8fa]">
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:pt-12">
      <h1 className="isolate max-w-3xl text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-5xl">
        <BrandMark className="mr-[0.3em] inline-block h-[0.6em] w-auto -translate-y-[0.05em] align-baseline drop-shadow-[0_0_0.6px_rgb(10_10_11/0.45)]" />
        Pick the job. <Highlight>We&apos;ll map the path.</Highlight>
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">Each path is a set of live, mentor-led courses in the right order, with real projects and interview preparation. Not sure which fits? A mentor will help you choose on a free call.</p>

      <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {paths.map(p => <li key={p.id}>
          <Link href={`/paths/${p.id}`} className="group flex h-full flex-col rounded-[24px] border border-neutral-200 bg-white p-6 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-32px_rgb(10_10_11/0.5)] sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: p.accent }}>{p.note}</p>
              <span className="flex -space-x-2">{p.tools.slice(0, 4).map(t => <span key={t.name} className="grid size-9 place-items-center rounded-full bg-white ring-2 ring-white shadow-[0_2px_8px_-2px_rgb(10_10_11/0.2)]">
                {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG logos */}
                <img src={toolIcon(t.icon)} alt="" width={20} height={20} className="size-5 object-contain" />
              </span>)}</span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-ink">{p.label}</h2>
            <p className="mt-2 text-[15px] leading-7 text-neutral-600">{p.pitch}</p>
            <p className="mt-4 text-sm text-neutral-500"><span className="font-semibold text-neutral-700">Best for:</span> {p.forWho}</p>
            <p className="mt-4 flex-1 text-sm text-neutral-500"><span className="font-semibold text-neutral-700">Roles:</span> {p.roles.join(' · ')}</p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold" style={{ color: p.accent }}>See the full path <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
          </Link>
        </li>)}
        <li>
          <Link href="/request-callback?course=Not%20sure%20yet" className="group flex h-full flex-col justify-between rounded-[24px] bg-ink p-6 text-white sm:p-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#a5b8ff]">Still deciding?</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">Let a mentor recommend one</h2>
              <p className="mt-2 text-[15px] leading-7 text-white/70">Share your background, goal and weekly time. We&apos;ll suggest a path and set up your 2 free sessions.</p>
            </div>
            <span className="mt-6 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-ink transition-colors group-hover:bg-[#fff200]">Get a free career call <ArrowRight aria-hidden="true" className="size-4" /></span>
          </Link>
        </li>
      </ul>
    </div>
  </div>;
}
