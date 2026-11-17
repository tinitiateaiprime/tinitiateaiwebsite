'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties, type TouchEvent } from 'react';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

type Tech = { name: string; src: string; color: string };
export type CourseSlide = {
  id: string;
  label: string;
  heading: string;
  accent: string;
  bullets: string[];
  outcomes: string[];
  tech: Tech[];
  href: string;
  cta: string;
};

const DURATION = 5000;

/** Floating logo bubble with a soft glow in the brand's own colour. */
function TechTile({ tech, index, compact }: { tech: Tech; index: number; compact?: boolean }) {
  return <div className="course-tile flex flex-col items-center" style={{ '--d': `${120 + index * 90}ms`, '--c': tech.color, '--float': `${index * 0.35}s` } as CSSProperties}>
    <div className={cn('course-bubble relative grid place-items-center rounded-full', compact ? 'size-[86px]' : 'size-[132px] xl:size-[148px]')}>
      {/* eslint-disable-next-line @next/next/no-img-element -- local SVG logos */}
      <img src={tech.src} alt="" width={80} height={80} className={cn('relative object-contain', compact ? 'size-11' : 'size-[68px] xl:size-[76px]')} />
    </div>
    <span className={cn('relative font-semibold tracking-[-0.01em] text-ink', compact ? 'mt-2 text-[13px]' : 'mt-3 text-base')}>
      {tech.name}
      {!compact && <span aria-hidden="true" className="absolute -bottom-1.5 left-1/2 h-[2px] w-10 -translate-x-1/2 rounded-full opacity-40" style={{ background: tech.color }} />}
    </span>
  </div>;
}

function TechGrid({ slide, compact }: { slide: CourseSlide; compact?: boolean }) {
  const few = slide.tech.length <= 4;
  return <div className={cn('mx-auto grid w-full', compact ? 'max-w-[360px] grid-cols-3 gap-x-3 gap-y-5' : few ? 'max-w-[460px] grid-cols-2 gap-x-12 gap-y-10' : 'max-w-[600px] grid-cols-3 gap-x-6 gap-y-9')}>
    {slide.tech.map((t, i) => <TechTile key={t.name} tech={t} index={i} compact={compact} />)}
  </div>;
}

/**
 * Course categories as one large card: what you'll learn and career outcomes on
 * the left, the real tools as floating logos on the right. Auto-advances with a
 * progress bar; arrows, dots and swipe to move. Pauses only when off-screen.
 */
export function CourseSlider({ slides }: { slides: CourseSlide[] }) {
  const [state, setState] = useState({ index: 0, dir: 1, key: 0 });
  const [onScreen, setOnScreen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const touchX = useRef<number | null>(null);
  const slide = slides[state.index];

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const go = (index: number, dir: number) => setState(s => ({ index: (index + slides.length) % slides.length, dir, key: s.key + 1 }));
  const next = () => go(state.index + 1, 1);
  const prev = () => go(state.index - 1, -1);
  const playing = onScreen;

  // Auto-advance like a classic slider; the progress bar below is only visual.
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setState(s => ({ index: (s.index + 1) % slides.length, dir: 1, key: s.key + 1 })), DURATION);
    return () => clearTimeout(timer);
  }, [playing, state.key, slides.length]);

  function onTouchEnd(e: TouchEvent) {
    if (touchX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(delta) > 50) (delta > 0 ? prev : next)();
    touchX.current = null;
  }

  const progress = <span className="block h-[3px] w-full overflow-hidden rounded-full bg-neutral-200">
    <span key={state.key} className="hero-progress" style={{ background: slide.accent, animationDuration: `${DURATION}ms`, animationPlayState: playing ? 'running' : 'paused' }} />
  </span>;
  const dots = <div className="flex gap-1.5">
    {slides.map((s, i) => <button key={s.id} type="button" onClick={() => go(i, i >= state.index ? 1 : -1)} aria-label={`Show ${s.label}`} aria-current={i === state.index} className="grid h-6 w-6 place-items-center">
      <span className={cn('block h-2.5 rounded-full transition-all duration-300', i === state.index ? 'w-6' : 'w-2.5 bg-neutral-300 hover:bg-neutral-400')} style={i === state.index ? { background: slide.accent } : undefined} />
    </button>)}
  </div>;

  return <section ref={root} aria-roledescription="carousel" aria-label="Course categories"
    onTouchStart={e => { touchX.current = e.touches[0].clientX; }} onTouchEnd={onTouchEnd}
    className="relative overflow-hidden rounded-[28px] border border-neutral-200/80 bg-white shadow-[0_40px_90px_-50px_rgb(10_10_11/0.35)] [touch-action:pan-y]">
    <button type="button" onClick={prev} aria-label="Previous category" className="absolute left-5 top-1/2 z-20 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-neutral-200 bg-white text-ink shadow-[0_8px_20px_-8px_rgb(10_10_11/0.25)] transition hover:border-ink hover:bg-ink hover:text-white lg:grid"><ChevronLeft className="size-5" /></button>
    <button type="button" onClick={next} aria-label="Next category" className="absolute right-5 top-1/2 z-20 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-neutral-200 bg-white text-ink shadow-[0_8px_20px_-8px_rgb(10_10_11/0.25)] transition hover:border-ink hover:bg-ink hover:text-white lg:grid"><ChevronRight className="size-5" /></button>

    <div key={state.key} aria-live="polite" className={cn('grid lg:min-h-[600px] lg:grid-cols-2', state.key > 0 && (state.dir > 0 ? 'course-in-right' : 'course-in-left'))}>
      <div className="flex flex-col justify-center px-6 pb-6 pt-8 sm:px-10 sm:pt-12 lg:py-16 lg:pl-24 lg:pr-6 xl:pl-28">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: slide.accent }}>{slide.label} Training</p>
        <h3 className="mt-3 text-[1.75rem] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[2.1rem]">{slide.heading}</h3>
        <div className="mt-7 lg:hidden"><TechGrid slide={slide} compact /></div>
        <ul className="mt-7 space-y-3">
          {slide.bullets.map((b, i) => <li key={b} className="course-line flex items-start gap-3 text-base leading-6 text-neutral-700 sm:text-[17px]" style={{ '--d': `${80 + i * 60}ms` } as CSSProperties}>
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0" style={{ color: slide.accent }} />{b}
          </li>)}
        </ul>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">Career outcomes</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {slide.outcomes.map(o => <span key={o} className="rounded-full border border-neutral-200 bg-neutral-100 px-3.5 py-1.5 text-[13px] font-medium text-neutral-700 sm:text-sm">{o}</span>)}
        </div>
        <Link href={slide.href} className="group mt-8 inline-flex w-fit items-center gap-1.5 text-[15px] font-semibold" style={{ color: slide.accent }}>
          <span className="underline decoration-current/30 underline-offset-4 transition-colors group-hover:decoration-current">{slide.cta}</span>
          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="relative hidden items-center justify-center px-8 pb-24 pt-16 lg:flex lg:pr-24">
        <TechGrid slide={slide} />
      </div>
    </div>

    <div className="absolute bottom-7 left-1/2 z-20 hidden w-[240px] -translate-x-1/2 flex-col items-center gap-3 lg:flex">{dots}{progress}</div>
    <div className="flex flex-col items-center gap-3 border-t border-neutral-100 px-6 py-4 lg:hidden"><div className="w-full max-w-[180px]">{progress}</div>{dots}</div>
  </section>;
}
