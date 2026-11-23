'use client';

import Link from 'next/link';
import { useEffect, useEffectEvent, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Bot, Cloud, Layers, MousePointerClick, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';
import { HandNote } from '../SectionHeading';

export type HeroRole = {
  id: string;
  label: string;
  note: string;
  /** Icon key, see ROLE_ICONS. */
  icon: keyof typeof ROLE_ICONS;
  /** Used in "Explore the …" link. */
  track: string;
  exploreHref: string;
  /** How long each scene plays (ms) before sliding to the next. */
  durations: number[];
  /** Scene titles, for the "Up next" hint. */
  titles: string[];
};

type Slide = { role: number; step: number; key: number };

const ROLE_ICONS = { sparkles: Sparkles, bot: Bot, cloud: Cloud, shield: ShieldCheck, layers: Layers };

const REDUCED = '(prefers-reduced-motion: reduce)';
function subscribeReduced(onChange: () => void) {
  const query = matchMedia(REDUCED);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/**
 * Left: large role names (Accenture-style list). Right: that role's story as
 * pictorial scenes. When a scene finishes it slides away to the left and the
 * next one slides in. Scenes are server-rendered nodes; this component only
 * owns which one is showing and when to move on.
 */
export function HeroRoleSwitcher({ intro, roles, scenes, footers }: { intro: ReactNode; roles: HeroRole[]; scenes: ReactNode[][]; footers: ReactNode[] }) {
  const [slide, setSlide] = useState<Slide>({ role: 0, step: 0, key: 0 });
  const [leaving, setLeaving] = useState<Slide | null>(null);
  const [stopped, setStopped] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const reducedMotion = useSyncExternalStore(subscribeReduced, () => matchMedia(REDUCED).matches, () => true);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = roles[slide.role];
  const lastStep = slide.step + 1 >= current.durations.length;
  const nextTitle = !lastStep ? current.titles[slide.step + 1] : !stopped ? roles[(slide.role + 1) % roles.length].label : current.titles[0];

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function go(role: number, step: number, byUser: boolean) {
    if (byUser) setStopped(true);
    if (role === slide.role && step === slide.step) return;
    setLeaving(slide);
    setSlide({ role, step, key: slide.key + 1 });
  }

  function next(byUser: boolean) {
    const count = current.durations.length;
    if (slide.step + 1 < count) go(slide.role, slide.step + 1, byUser);
    else if (!stopped && !byUser) go((slide.role + 1) % roles.length, 0, false);
    else go(slide.role, 0, byUser);
  }
  function previous() {
    go(slide.role, (slide.step - 1 + current.durations.length) % current.durations.length, true);
  }

  // Each scene plays for its duration, then the story moves on (paused off-screen).
  const onTimer = useEffectEvent(() => next(false));
  useEffect(() => {
    if (reducedMotion || !onScreen) return;
    const timer = setTimeout(onTimer, roles[slide.role].durations[slide.step]);
    return () => clearTimeout(timer);
  }, [slide, onScreen, reducedMotion, roles]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = roles.length - 1;
    const target = { ArrowDown: slide.role + 1, ArrowRight: slide.role + 1, ArrowUp: slide.role - 1, ArrowLeft: slide.role - 1, Home: 0, End: last }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    const index = target > last ? 0 : target < 0 ? last : target;
    go(index, 0, true);
    tabs.current[index]?.focus();
  }

  return <div ref={root} className="grid w-full gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-[1fr_auto_auto_auto_1fr] lg:gap-x-12 lg:gap-y-6 xl:gap-x-16 short:gap-y-5">
    <div className="lg:col-start-1 lg:row-start-2">{intro}</div>

    <div className="lg:col-start-1 lg:row-start-3">
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-accent"><MousePointerClick aria-hidden="true" className="size-4" />Pick the job you want to see what you&apos;ll build</p>
      <div role="tablist" aria-label="Choose a career path" aria-orientation="vertical" onKeyDown={onKeyDown} className="-mx-2">
      {roles.map((item, index) => {
        const selected = index === slide.role;
        const Icon = ROLE_ICONS[item.icon];
        return <button
          key={item.id}
          ref={node => { tabs.current[index] = node; }}
          type="button"
          role="tab"
          id={`hero-tab-${item.id}`}
          aria-selected={selected}
          aria-controls="hero-panel"
          tabIndex={selected ? 0 : -1}
          onClick={() => go(index, 0, true)}
          onPointerEnter={event => { if (event.pointerType === 'mouse' && !selected) go(index, 0, true); }}
          className={cn('group flex w-full items-center gap-3.5 rounded-2xl px-2 py-1.5 text-left transition-colors duration-300 sm:gap-4 short:py-1', !selected && 'hover:bg-neutral-50')}
        >
          <span aria-hidden="true" className={cn('grid size-10 shrink-0 place-items-center rounded-xl border transition-colors duration-300 sm:size-11 short:size-9', selected ? 'border-accent bg-accent text-white shadow-[0_8px_20px_-8px_rgb(47_84_235/0.7)]' : 'border-neutral-200 bg-surface text-neutral-500 group-hover:border-accent/40 group-hover:text-accent')}><Icon className="size-5" /></span>
          <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <span className={cn('relative isolate text-[1.4rem] font-semibold leading-[1.2] tracking-[-0.03em] transition-colors duration-300 sm:text-[1.65rem] xl:text-[1.85rem] short:text-[1.45rem]', selected ? 'text-ink' : 'text-neutral-500 group-hover:text-ink')}>
              {selected && <span aria-hidden="true" className="hero-mark absolute inset-x-0 -bottom-[0.1em] -z-10 h-[0.14em] rounded-full bg-[#fff200]" />}
              {item.label}
            </span>
            <span className={cn('text-xs font-semibold uppercase tracking-[0.1em] transition-colors duration-300 sm:text-[13px]', selected ? 'text-accent' : 'text-neutral-400')}>{item.note}</span>
          </span>
          <ArrowRight aria-hidden="true" className={cn('size-4 shrink-0 transition duration-300', selected ? 'text-accent opacity-100' : '-translate-x-1 text-neutral-400 opacity-0 group-hover:translate-x-0 group-hover:opacity-100')} />
        </button>;
      })}
      </div>
    </div>

    <div id="hero-panel" role="tabpanel" aria-labelledby={`hero-tab-${current.id}`} aria-live="polite" className="min-w-0 lg:col-start-2 lg:row-span-5 lg:row-start-1 lg:self-center">
      <div className="light-island relative">
        <div className="grid grid-cols-[minmax(0,1fr)] overflow-hidden">
          {leaving && <div key={`out-${leaving.key}`} aria-hidden="true" className="hero-leave [grid-area:1/1]" onAnimationEnd={event => { if (event.target === event.currentTarget) setLeaving(null); }}>
            {scenes[leaving.role][leaving.step]}
          </div>}
          <div key={`in-${slide.key}`} className={cn('[grid-area:1/1]', leaving && 'hero-enter')}>{scenes[slide.role][slide.step]}</div>
        </div>
        <div className="absolute right-3 top-3 flex gap-1.5 sm:right-4 sm:top-4">
          <button type="button" onClick={previous} aria-label="Previous scene" className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-surface/90 text-neutral-700 transition hover:border-neutral-400 hover:text-ink"><ArrowLeft className="size-4" /></button>
          <button type="button" onClick={() => next(true)} aria-label="Next scene" className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-surface/90 text-neutral-700 transition hover:border-neutral-400 hover:text-ink"><ArrowRight className="size-4" /></button>
        </div>
        {/* Story progress + what comes next, so visitors know there is more to see. */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center gap-2.5 sm:inset-x-6 sm:bottom-5 sm:gap-4">
          <div className="flex flex-1 gap-1.5">
            {current.durations.map((ms, i) => <span key={`${current.id}-${i}`} className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-200">
              {i < slide.step && <span className="block h-full bg-accent" />}
              {i === slide.step && <span key={slide.key} className="hero-progress" style={{ animationDuration: `${ms}ms`, animationPlayState: onScreen ? 'running' : 'paused' }} />}
            </span>)}
          </div>
          <button type="button" onClick={() => next(true)} className="group pointer-events-auto inline-flex max-w-[64%] shrink-0 items-center gap-1.5 truncate rounded-full bg-surface px-2.5 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-[13px] font-semibold text-ink shadow-[0_4px_14px_-6px_rgb(10_10_11/0.25)] ring-1 ring-neutral-200 transition hover:ring-accent/40 sm:text-sm">
            <span className="font-medium text-neutral-500"><span className="hidden sm:inline">Up next</span><span className="sm:hidden">Next</span></span>
            <span className="truncate">{nextTitle}</span>
            <ArrowRight aria-hidden="true" className="size-3.5 shrink-0 text-accent transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
      {footers[slide.role]}
    </div>

    <div className="lg:col-start-1 lg:row-start-4">
      <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
        <Link href={`/request-callback?course=${encodeURIComponent(current.label)}`} className="group inline-flex h-13 items-center gap-2.5 rounded-full bg-accent pl-7 pr-6 text-base font-semibold text-white shadow-[0_8px_24px_-10px_rgb(47_84_235/0.7)] transition-colors hover:bg-[#2443c8]">
          Book 2 free sessions
          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
        <Link href={current.exploreHref} className="group inline-flex items-center gap-1.5 text-base font-semibold text-ink">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:0%_1px]">See the {current.track}</span>
          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
      <HandNote arrow="up" className="mt-3 short:mt-2">no card, no catch. a mentor calls you within a day</HandNote>
    </div>
  </div>;
}
