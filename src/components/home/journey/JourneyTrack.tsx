'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * The four steps as a plain grid (no scroll pinning, so the page always scrolls
 * normally). Each step's drawing starts when it comes into view; drawings stay
 * paused until their stop gets `data-in` (see `.journey-stop` in globals.css).
 */
export function JourneyTrack({ header, stops, finale }: { header: ReactNode; stops: ReactNode[]; finale: ReactNode }) {
  const grid = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = Array.from(grid.current?.querySelectorAll<HTMLElement>('[data-stop]') ?? []);
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { (entry.target as HTMLElement).dataset.in = ''; observer.unobserve(entry.target); }
    }, { threshold: 0.3 });
    items.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return <div className="mx-auto max-w-7xl px-4 sm:px-6">
    {header}
    <ol ref={grid} className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
      {stops.map((stop, i) => <li key={i} data-stop className="journey-stop">{stop}</li>)}
    </ol>
    <div className="mt-8">{finale}</div>
  </div>;
}
