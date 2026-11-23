'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';

const DESKTOP = '(min-width: 1024px)';
const REDUCED = '(prefers-reduced-motion: reduce)';
/** How long each stop stays in focus (its drawing plays), then how long the pan to the next one takes. */
const DWELL = 2400, PAN = 900;

/**
 * The original journey track, played as a timed story instead of being tied
 * to scrolling.
 *
 * Desktop: when the track first comes into view, it plays once on its own:
 * each stop's drawing plays, then the track pans left to the next stop and
 * the line across the top draws on. It always moves one way and finishes on
 * the closing message. Scrolling up or down never speeds it up, reverses it
 * or blocks the page. A Replay button appears at the end.
 * Phones: a vertical list; each stop draws in once when it appears and the
 * line fills down to it.
 * Reduced motion: everything is shown at once, with no movement.
 *
 * Each stop's drawing waits until it gets `data-in` (see `.journey-stop` in globals.css).
 */
export function JourneyTrack({ header, stops, finale }: { header: ReactNode; stops: ReactNode[]; finale: ReactNode }) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const lineX = useRef<HTMLDivElement>(null);
  const lineY = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const viewportEl = viewport.current, trackEl = track.current, xEl = lineX.current, yEl = lineY.current;
    if (!viewportEl || !trackEl || !xEl || !yEl) return;
    const desktop = matchMedia(DESKTOP), reduced = matchMedia(REDUCED);
    const restart = () => setRun(r => r + 1);
    desktop.addEventListener('change', restart);
    reduced.addEventListener('change', restart);
    const unlisten = () => { desktop.removeEventListener('change', restart); reduced.removeEventListener('change', restart); };
    const items = Array.from(trackEl.querySelectorAll<HTMLElement>('[data-stop]'));
    const timers: ReturnType<typeof setTimeout>[] = [];
    const reveal = (el: HTMLElement) => { if (!('in' in el.dataset)) el.dataset.in = ''; };

    if (reduced.matches) {
      viewportEl.dataset.mode = 'static';
      items.forEach(reveal);
      xEl.style.transform = 'scaleX(1)'; yEl.style.transform = 'scaleY(1)';
      return unlisten;
    }

    if (!desktop.matches) {
      // Phones: each stop draws in once as it appears; the line fills to the furthest one shown.
      viewportEl.dataset.mode = 'list';
      trackEl.style.transform = '';
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) { reveal(entry.target as HTMLElement); observer.unobserve(entry.target); }
        const last = items.filter(el => 'in' in el.dataset).pop();
        if (last) yEl.style.transform = `scaleY(${Math.min(1, (last.offsetTop + 8) / trackEl.offsetHeight).toFixed(4)})`;
      }, { threshold: 0.4 });
      items.forEach(el => observer.observe(el));
      return () => { observer.disconnect(); unlisten(); };
    }

    // Desktop: wait until the track is properly in view, then play the whole story once.
    viewportEl.dataset.mode = 'track';
    trackEl.style.transition = 'none';
    trackEl.style.transform = 'translate3d(0,0,0)';
    xEl.style.transition = 'none';
    xEl.style.transform = 'scaleX(0)';

    function play() {
      const first = items[0].offsetLeft;
      const distance = Math.max(0, trackEl!.scrollWidth - viewportEl!.clientWidth);
      const shiftFor = (i: number) => Math.min(distance, items[i].offsetLeft - first);
      trackEl!.style.transition = `transform ${PAN}ms cubic-bezier(.65,0,.35,1)`;
      xEl!.style.transition = `transform ${PAN}ms cubic-bezier(.65,0,.35,1)`;

      // One stop at a time: the line steps to it, the track pans if it is off screen, then its drawing plays.
      items.forEach((el, i) => timers.push(setTimeout(() => {
        const shift = shiftFor(i);
        trackEl!.style.transform = `translate3d(${-shift}px,0,0)`;
        xEl!.style.transform = `scaleX(${Math.min(1, (items[i].offsetLeft + 8) / trackEl!.scrollWidth).toFixed(4)})`;
        timers.push(setTimeout(() => {
          reveal(el);
          if (i === items.length - 1) setDone(true);
        }, i === 0 ? 0 : PAN));
      }, i * (DWELL + PAN))));
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      play();
    }, { threshold: 0.6 });
    observer.observe(viewportEl);
    return () => { observer.disconnect(); timers.forEach(clearTimeout); unlisten(); };
  }, [run]);

  return <div>
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">{header}</div>
    <div ref={viewport} data-mode="list" className="group/journey relative mt-10 overflow-hidden lg:mt-12">
      <div ref={track} className="relative flex flex-col gap-12 px-4 will-change-transform sm:px-6 lg:w-max lg:flex-row lg:gap-12 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] group-data-[mode=static]/journey:lg:w-auto group-data-[mode=static]/journey:lg:flex-wrap">
        {/* Progress line: across the top on desktop, down the left on phones. */}
        <div aria-hidden="true" className="absolute bottom-0 left-[calc(1rem+7px)] top-2 w-px bg-neutral-200 sm:left-[calc(1.5rem+7px)] lg:inset-x-0 lg:bottom-auto lg:top-[7px] lg:h-[2px] lg:w-auto">
          <div ref={lineY} className="h-full w-full origin-top bg-accent transition-transform duration-700 ease-out lg:hidden" style={{ transform: 'scaleY(0)' }} />
          <div ref={lineX} className="hidden h-full origin-left bg-accent lg:block" style={{ transform: 'scaleX(0)' }} />
        </div>
        {stops.map((stop, i) => <div key={`${run}-${i}`} data-stop className="journey-stop relative pl-10 lg:w-[min(400px,30vw)] lg:shrink-0 lg:pl-0 lg:pt-12">
          <span aria-hidden="true" className="journey-dot absolute left-0 top-1 size-4 rounded-full border-2 border-neutral-300 bg-surface transition-colors duration-500 lg:top-0" />
          {stop}
        </div>)}
        <div key={`${run}-finale`} data-stop className="journey-stop relative pl-10 lg:flex lg:w-[min(360px,28vw)] lg:shrink-0 lg:items-center lg:pl-0 lg:pt-12">
          <span aria-hidden="true" className="journey-dot absolute left-0 top-1 size-4 rounded-full border-2 border-neutral-300 bg-surface transition-colors duration-500 lg:top-0" />
          {finale}
        </div>
      </div>
    </div>
    {done && <div className="mx-auto mt-6 hidden max-w-7xl px-4 sm:px-6 lg:block">
      <button type="button" onClick={() => { setDone(false); setRun(r => r + 1); }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 transition-colors hover:text-ink">
        <RotateCcw aria-hidden="true" className="size-4" />Replay
      </button>
    </div>}
  </div>;
}
