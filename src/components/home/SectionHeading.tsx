import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** The yellow chevron from the Tinitiate AI logo. */
export function BrandMark({ className }: { className?: string }) {
  return <svg viewBox="0 0 22 16" aria-hidden="true" className={className}><path d="M0 0H11L22 8L11 16H0L8 8Z" fill="#fff200" /></svg>;
}

/** Logo-yellow highlighter behind the key words of a heading. */
export function Highlight({ children }: { children: ReactNode }) {
  return <span className="relative whitespace-nowrap">
    <span aria-hidden="true" className="absolute inset-x-[-0.06em] bottom-[0.04em] -z-10 h-[0.36em] rounded-[3px] bg-[#fff200]" />
    {children}
  </span>;
}

/**
 * One heading style for every section: the logo chevron, a centred headline
 * with its key phrase highlighted in the logo yellow, and a short line under it.
 */
export function SectionHeading({ id, title, children, className }: { id: string; title: ReactNode; children?: ReactNode; className?: string }) {
  return <div className={cn('mx-auto max-w-3xl text-center', className)}>
    <h2 id={id} className="isolate text-balance text-[2rem] font-semibold leading-[1.12] tracking-[-0.04em] text-ink sm:text-[2.6rem] lg:text-[3rem]">
      <BrandMark className="mr-[0.32em] inline-block h-[0.62em] w-auto -translate-y-[0.06em] align-baseline drop-shadow-[0_0_0.6px_rgb(10_10_11/0.45)]" />
      {title}
    </h2>
    {children && <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">{children}</p>}
  </div>;
}
