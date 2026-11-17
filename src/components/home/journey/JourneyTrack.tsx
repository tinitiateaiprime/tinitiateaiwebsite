'use client';

import { useEffect, useRef, type ReactNode } from 'react';

const DESKTOP = '(min-width: 1024px)';

/**
 * Desktop: the section pins while you scroll; the track of stops slides left
 * and a line draws across it. Each stop's drawing starts when it comes into
 * view. Mobile: a plain vertical list; stops animate as they scroll in.
 *
 * Everything runs off one rAF-throttled scroll handler that writes transforms
 * directly (no React re-renders while scrolling). Drawings stay paused until
 * their stop gets `data-in` (see `.journey-stop` in globals.css).
 */
export function JourneyTrack({ header, stops, finale }: { header: ReactNode; stops: ReactNode[]; finale: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const pinned = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outerEl = outer.current, pinnedEl = pinned.current, trackEl = track.current, fillEl = fill.current;
    if (!outerEl || !pinnedEl || !trackEl || !fillEl) return;
    const desktop = matchMedia(DESKTOP);
    const items = Array.from(trackEl.querySelectorAll<HTMLElement>('[data-stop]'));
    let distance = 0, frame = 0, pinTop = 0;

    const reveal = (el: HTMLElement) => { if (!('in' in el.dataset)) el.dataset.in = ''; };

    function update() {
      frame = 0;
      if (!desktop.matches) return;
      const progress = distance ? Math.min(1, Math.max(0, (pinTop - outerEl!.getBoundingClientRect().top) / distance)) : 0;
      trackEl!.style.transform = `translate3d(${(-progress * distance).toFixed(1)}px,0,0)`;
      fillEl!.style.transform = `scaleX(${progress.toFixed(4)})`;
      const pinnedBox = pinnedEl!.getBoundingClientRect();
      if (pinnedBox.top < innerHeight * 0.6) for (const el of items) if (el.getBoundingClientRect().left < innerWidth * 0.72) reveal(el);
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };

    function measure() {
      if (desktop.matches) {
        pinTop = parseFloat(getComputedStyle(pinnedEl!).top) || 0;
        distance = Math.max(0, trackEl!.scrollWidth - pinnedEl!.clientWidth);
        outerEl!.style.height = `${pinnedEl!.offsetHeight + distance}px`;
      } else {
        outerEl!.style.height = '';
        trackEl!.style.transform = '';
      }
      update();
    }

    // Mobile reveal: stops animate as they scroll into view.
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting && !desktop.matches) reveal(entry.target as HTMLElement);
    }, { threshold: 0.35 });
    items.forEach(el => observer.observe(el));

    const resize = new ResizeObserver(measure);
    resize.observe(pinnedEl);
    resize.observe(trackEl);
    desktop.addEventListener('change', measure);
    addEventListener('scroll', onScroll, { passive: true });
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      desktop.removeEventListener('change', measure);
      removeEventListener('scroll', onScroll);
    };
  }, []);

  return <div ref={outer} className="relative">
    <div ref={pinned} className="overflow-hidden lg:sticky lg:top-[var(--header-h)] lg:flex lg:h-[calc(100svh-var(--header-h))] lg:flex-col lg:justify-center">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">{header}</div>
      <div className="mt-10 lg:mt-12">
        <div ref={track} className="relative flex flex-col gap-14 px-4 will-change-transform sm:px-6 lg:w-max lg:flex-row lg:gap-16 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
          {/* progress line (desktop: across the top; mobile: down the left) */}
          <div aria-hidden="true" className="absolute bottom-0 left-[calc(1rem+7px)] top-2 w-px bg-neutral-200 sm:left-[calc(1.5rem+7px)] lg:inset-x-0 lg:bottom-auto lg:top-[7px] lg:h-[2px] lg:w-auto">
            <div ref={fill} className="hidden h-full origin-left bg-accent lg:block" style={{ transform: 'scaleX(0)' }} />
          </div>
          {stops.map((stop, i) => <div key={i} data-stop className="journey-stop relative pl-10 lg:w-[min(560px,40vw)] lg:shrink-0 lg:pl-0 lg:pt-12">
            <span aria-hidden="true" className="journey-dot absolute left-0 top-1 size-4 rounded-full border-2 border-neutral-300 bg-white transition-colors duration-500 lg:top-0" />
            {stop}
          </div>)}
          <div className="relative pl-10 lg:flex lg:w-[min(520px,38vw)] lg:shrink-0 lg:items-center lg:pl-0 lg:pt-12">
            <span aria-hidden="true" className="absolute left-0 top-1 size-4 rounded-full bg-accent lg:top-0" />
            {finale}
          </div>
        </div>
      </div>
    </div>
  </div>;
}
