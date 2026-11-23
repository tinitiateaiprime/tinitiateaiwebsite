'use client';

import Link from 'next/link';
import { useState, type CSSProperties } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { paths, toolIcon } from '@/data/paths';
import { Highlight, SectionHeading } from '../SectionHeading';

/**
 * The five career paths as tabs the visitor controls (no autoplay): what you'll
 * learn, the tools, the jobs it leads to, and the two next steps.
 */
export function PathsSection() {
  const [index, setIndex] = useState(0);
  const path = paths[index];

  return <section aria-labelledby="paths-title" className="border-t border-neutral-100 bg-[#f7f8fa] py-12 sm:py-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <SectionHeading id="paths-title" title={<>Five paths. <Highlight>One clear plan.</Highlight></>}>Choose the job you want. Each path tells you exactly what you&apos;ll learn, the tools you&apos;ll use and the roles it leads to.</SectionHeading>

      <div className="mt-8 grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-5">
        <div role="tablist" aria-label="Career paths" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
          {paths.map((p, i) => {
            const on = i === index;
            return <button key={p.id} type="button" role="tab" id={`path-tab-${p.id}`} aria-selected={on} aria-controls="path-panel" onClick={() => setIndex(i)}
              className={cn('flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors lg:py-4', on ? 'border-ink bg-ink text-white' : 'border-neutral-200 bg-white text-ink hover:border-neutral-400')}>
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG logos */}
                <img src={toolIcon(p.tools[0].icon)} alt="" width={22} height={22} className="size-[22px] object-contain" />
              </span>
              <span className="min-w-0">
                <span className="block whitespace-nowrap text-[15px] font-semibold">{p.label}</span>
                <span className={cn('block whitespace-nowrap text-xs font-semibold uppercase tracking-[0.08em]', on ? 'text-white/60' : 'text-neutral-400')}>{p.note}</span>
              </span>
            </button>;
          })}
        </div>

        <div key={path.id} id="path-panel" role="tabpanel" aria-labelledby={`path-tab-${path.id}`} style={{ '--c': path.accent } as CSSProperties}
          className="hero-rise grid overflow-hidden rounded-[28px] border border-neutral-200 bg-white lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="p-6 sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--c)]">{path.note}</p>
            <h3 className="mt-2 text-[1.8rem] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[2.1rem]">{path.label}</h3>
            <p className="mt-3 text-[17px] leading-7 text-neutral-600">{path.pitch}</p>
            <ul className="mt-6 space-y-3">{path.learn.map(l => <li key={l} className="flex gap-3 text-[15px] leading-6 text-neutral-700 sm:text-base"><CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--c)]" />{l}</li>)}</ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href={`/request-callback?course=${encodeURIComponent(path.label)}`} className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-10px_rgb(47_84_235/0.7)] transition-colors hover:bg-[#2443c8]">
                Book 2 free sessions <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href={`/paths/${path.id}`} className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline decoration-neutral-300 underline-offset-4 hover:decoration-ink">
                See courses &amp; syllabus <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
          <div className="border-t border-neutral-100 bg-[#fafafa] p-6 sm:p-9 lg:border-l lg:border-t-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">Tools you&apos;ll use</p>
            <ul className="mt-4 grid grid-cols-3 gap-3">{path.tools.map(t => <li key={t.name} className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-2 py-4 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG logos */}
              <img src={toolIcon(t.icon)} alt="" width={32} height={32} className="size-8 object-contain" />
              <span className="text-xs font-semibold text-neutral-700">{t.name}</span>
            </li>)}</ul>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">Jobs it leads to</p>
            <ul className="mt-3 flex flex-wrap gap-2">{path.roles.map(r => <li key={r} className="rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-sm font-medium text-neutral-700">{r}</li>)}</ul>
            <p className="mt-8 text-sm leading-6 text-neutral-500"><span className="font-semibold text-neutral-700">Best for:</span> {path.forWho}</p>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
