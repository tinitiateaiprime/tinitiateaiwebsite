'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
const navigation = [
  { href: '/', label: 'Home' }, { href: '/courses', label: 'Courses' },
  { href: '/masterclasses', label: 'MasterClasses' }, { href: '/training', label: 'Training' },
  { href: '/services', label: 'Services' }, { href: '/company', label: 'Company' }, { href: '/contact', label: 'Contact' },
];
function HeaderNavigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null), trigger = useRef<HTMLButtonElement>(null), menu = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) { if (!header.current?.contains(event.target as Node)) setOpen(false); }
    function escape(event: KeyboardEvent) { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } }
    const desktop = matchMedia('(min-width: 1280px)');
    function resize() { if (desktop.matches) setOpen(false); }
    function historyChange() { setOpen(false); }
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape); desktop.addEventListener('change', resize); window.addEventListener('popstate', historyChange); window.addEventListener('hashchange', historyChange);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); desktop.removeEventListener('change', resize); window.removeEventListener('popstate', historyChange); window.removeEventListener('hashchange', historyChange); };
  }, [open]);
  const active = (href: string) => pathname === href || href !== '/' && pathname.startsWith(href + '/');
  function close() { setOpen(false); }
  return <header ref={header} className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur" onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) close(); }}>
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3">Skip to content</a>
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
      <Link href="/" onClick={close} aria-label="Tinitiate AI homepage" className="shrink-0 rounded-md"><Image src="/tinitiate-logo.png" width={260} height={80} alt="Tinitiate AI" priority className="block h-auto max-h-16 w-[160px] object-contain min-[375px]:w-[190px] sm:w-[220px] xl:w-[240px]" /></Link>
      <nav className="hidden items-center gap-5 xl:flex" aria-label="Main navigation">{navigation.map(({ href, label }) => <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined} className={`rounded-md py-2 text-sm font-semibold transition hover:text-blue-700 ${active(href) ? 'text-blue-700' : 'text-slate-700'}`}>{label}</Link>)}</nav>
      <Link href="/request-callback" className="hidden shrink-0 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 xl:inline-flex">Enquire Now</Link>
      <button ref={trigger} type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="mobile-navigation" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-blue-50 xl:hidden" onClick={() => setOpen(value => !value)} onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); requestAnimationFrame(() => menu.current?.querySelector('a')?.focus()); } }}><span>{open ? 'Close' : 'Menu'}</span><svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d={open ? 'M6 6l12 12M6 18L18 6' : 'M3 6h18M3 12h18M3 18h18'} /></svg></button>
    </div>
    {open && <nav id="mobile-navigation" ref={menu} aria-label="Mobile navigation" className="absolute inset-x-0 top-full max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain border-b border-slate-200 bg-white p-3 shadow-xl xl:hidden"><div className="mx-auto flex max-w-7xl flex-col gap-1">{navigation.map(({ href, label }) => <Link key={href} href={href} onClick={close} aria-current={active(href) ? 'page' : undefined} className={`rounded-lg px-4 py-3 text-sm font-semibold hover:bg-blue-50 ${active(href) ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}>{label}</Link>)}<Link href="/request-callback" onClick={close} className="mt-2 rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700">Enquire Now</Link></div></nav>}
  </header>;
}
export function SiteHeader() {
  const pathname = usePathname();
  // Keyed state also closes on browser history; same-route links close explicitly.
  return <HeaderNavigation key={pathname} pathname={pathname} />;
}
