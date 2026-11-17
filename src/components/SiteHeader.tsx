'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/courses', label: 'Courses' },
  { href: '/masterclasses', label: 'MasterClasses', highlight: true },
  { href: '/contact', label: 'Contact' },
];

function HeaderNavigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null), trigger = useRef<HTMLButtonElement>(null), menu = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 4);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) { if (!header.current?.contains(event.target as Node)) setOpen(false); }
    function escape(event: KeyboardEvent) { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } }
    const desktop = matchMedia('(min-width: 1024px)');
    function resize() { if (desktop.matches) setOpen(false); }
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape); desktop.addEventListener('change', resize);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); desktop.removeEventListener('change', resize); };
  }, [open]);

  const active = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href + '/'));
  const close = () => setOpen(false);

  return <header ref={header} className={cn('sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300', scrolled || open ? 'border-neutral-200/80 shadow-[0_6px_24px_-18px_rgb(10_10_11/0.35)]' : 'border-transparent')}>
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3">Skip to content</a>
    <div className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
      <Link href="/" onClick={close} aria-label="Tinitiate AI homepage" className="shrink-0 rounded-md">
        <Image src="/tinitiate-logo-transparent.png" width={2001} height={269} alt="Tinitiate AI" priority className="block h-auto w-[180px] sm:w-[220px] lg:w-[240px]" />
      </Link>

      <nav aria-label="Main navigation" className="hidden lg:block">
        <ul className="flex items-center gap-1">
          {navigation.map(({ href, label, highlight }) => {
            const on = active(href);
            return <li key={href}>
              {highlight
                ? <Link href={href} aria-current={on ? 'page' : undefined} className={cn('ml-1 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-semibold ring-1 transition-colors', on ? 'bg-accent text-white ring-accent' : 'bg-accent-soft text-accent ring-accent/20 hover:bg-accent hover:text-white')}>
                    <Sparkles aria-hidden="true" className="size-4" />{label}
                  </Link>
                : <Link href={href} aria-current={on ? 'page' : undefined} className={cn('relative inline-flex rounded-full px-4 py-2 text-[15px] font-medium transition-colors', on ? 'text-ink' : 'text-neutral-600 hover:bg-neutral-100 hover:text-ink')}>
                    {label}
                    {on && <span aria-hidden="true" className="absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-accent" />}
                  </Link>}
            </li>;
          })}
        </ul>
      </nav>

      <button ref={trigger} type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="mobile-navigation"
        className="grid size-11 place-items-center rounded-full border border-neutral-200 text-ink transition hover:bg-neutral-50 lg:hidden"
        onClick={() => setOpen(value => !value)}
        onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); requestAnimationFrame(() => menu.current?.querySelector('a')?.focus()); } }}>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={open ? 'M6 6l12 12M6 18L18 6' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
      </button>
    </div>

    {open && <nav id="mobile-navigation" ref={menu} aria-label="Mobile navigation" className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-h))] overflow-y-auto border-b border-neutral-200 bg-white px-4 pb-6 pt-2 shadow-xl lg:hidden">
      <ul className="mx-auto flex max-w-7xl flex-col">
        {navigation.map(({ href, label, highlight }) => {
          const on = active(href);
          return <li key={href} className="border-b border-neutral-100 last:border-0">
            <Link href={href} onClick={close} aria-current={on ? 'page' : undefined} className={cn('flex items-center justify-between py-4 text-lg font-semibold', on ? 'text-accent' : 'text-ink')}>
              <span className="flex items-center gap-2">{highlight && <Sparkles aria-hidden="true" className="size-4 text-accent" />}{label}</span>
              {highlight && <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">Explore</span>}
            </Link>
          </li>;
        })}
      </ul>
    </nav>}
  </header>;
}

export function SiteHeader() {
  const pathname = usePathname();
  // Keyed so the menu closes on navigation.
  return <HeaderNavigation key={pathname} pathname={pathname} />;
}
