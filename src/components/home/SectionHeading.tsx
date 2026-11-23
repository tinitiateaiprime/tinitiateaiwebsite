import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** The yellow chevron from the Tinitiate AI logo. Kept for page titles only. */
export function BrandMark({ className }: { className?: string }) {
  return <svg viewBox="0 0 22 16" aria-hidden="true" className={className}><path d="M0 0H11L22 8L11 16H0L8 8Z" fill="#fff200" /></svg>;
}

/**
 * A loose marker stroke under the key words, like someone underlined them by
 * hand. Sits below the text, so it reads on light and dark backgrounds.
 */
export function Highlight({ children }: { children: ReactNode }) {
  return <span className="relative inline-block whitespace-nowrap">
    {children}
    <svg aria-hidden="true" viewBox="0 0 300 18" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-[0.18em] left-[-2%] h-[0.32em] w-[104%] overflow-visible">
      <path d="M3 11C40 6 86 4 140 5.5C190 7 238 9 297 6.5" fill="none" stroke="var(--color-marker)" strokeWidth="9" strokeLinecap="round" opacity=".95" />
      <path d="M18 14.5C80 12 160 11.5 260 12.5" fill="none" stroke="var(--color-marker)" strokeWidth="3.5" strokeLinecap="round" opacity=".7" />
    </svg>
  </span>;
}

/** A short handwritten aside with a drawn arrow. Use sparingly: two or three per page at most. */
export function HandNote({ children, arrow = 'left', className }: { children: ReactNode; arrow?: 'left' | 'up' | 'down' | 'none'; className?: string }) {
  const paths = {
    left: 'M44 6C30 4 14 10 6 22M6 22L5 12M6 22L15 20',
    up: 'M8 40C6 26 10 14 20 6M20 6L10 8M20 6L21 16',
    down: 'M30 4C34 18 30 30 18 40M18 40L19 30M18 40L28 37',
    none: '',
  };
  return <span className={cn('inline-flex items-center gap-1.5 font-hand text-[1.4rem] leading-none text-neutral-600', className)}>
    {arrow !== 'none' && <svg aria-hidden="true" viewBox="0 0 48 46" className="size-8 shrink-0 text-accent"><path d={paths[arrow]} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
    <span className="-rotate-2">{children}</span>
  </span>;
}

/**
 * Section heading: title on the left, the supporting line beside it on wide
 * screens. Left-aligned and split, so sections stop all looking the same and
 * the space to the right of the title is used.
 */
export function SectionHeading({ id, title, children, className, center }: { id: string; title: ReactNode; children?: ReactNode; className?: string; center?: boolean }) {
  if (center) return <div className={cn('mx-auto max-w-3xl text-center', className)}>
    <h2 id={id} className="text-balance text-[2rem] font-semibold leading-[1.12] tracking-[-0.035em] text-ink sm:text-[2.4rem]">{title}</h2>
    {children && <p className="mx-auto mt-3 max-w-2xl text-pretty text-base leading-7 text-neutral-600 sm:text-lg">{children}</p>}
  </div>;
  return <div className={cn('grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-12', className)}>
    <h2 id={id} className="text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.035em] text-ink sm:text-[2.4rem] lg:text-[2.7rem]">{title}</h2>
    {children && <p className="max-w-xl text-pretty text-base leading-7 text-neutral-600 sm:text-[17px] lg:pb-1.5">{children}</p>}
  </div>;
}
