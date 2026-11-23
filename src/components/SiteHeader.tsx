'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { paths, toolIcon } from '@/data/paths';
import { contact } from '@/lib/contactInfo';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

const navigation = [
  { href: '/courses', label: 'Live Courses' },
  { href: '/masterclasses', label: 'Free MasterClasses' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];
const BOOK = '/request-callback';

function HeaderNavigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null), trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 4);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open && !menu) return;
    function outside(event: PointerEvent) { if (!header.current?.contains(event.target as Node)) { setOpen(false); setMenu(false); } }
    function escape(event: KeyboardEvent) { if (event.key === 'Escape') { setOpen(false); setMenu(false); trigger.current?.focus(); } }
    const desktop = matchMedia('(min-width: 1024px)');
    function resize() { if (desktop.matches) setOpen(false); }
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape); desktop.addEventListener('change', resize);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); desktop.removeEventListener('change', resize); };
  }, [open, menu]);

  const active = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const close = () => { setOpen(false); setMenu(false); };
  const onPaths = pathname.startsWith('/paths');
  const link = (on: boolean) => cn('relative inline-flex items-center gap-1 rounded-full px-3 py-2 text-[15px] font-medium transition-colors xl:px-4', on ? 'text-ink' : 'text-neutral-600 hover:bg-neutral-100 hover:text-ink');

  return <header ref={header} className={cn('sticky top-0 z-50 border-b bg-surface/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300', scrolled || open || menu ? 'border-neutral-200/80 shadow-[0_6px_24px_-18px_rgb(10_10_11/0.35)]' : 'border-transparent')}>
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-surface focus:p-3">Skip to content</a>
    <div className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
      <Link href="/" onClick={close} aria-label="Tinitiate AI homepage" className="shrink-0 rounded-md">
        <Logo priority className="w-[170px] sm:w-[210px] lg:w-[190px] xl:w-[230px]" />
      </Link>

      <nav aria-label="Main navigation" className="hidden lg:block">
        <ul className="flex items-center gap-0.5">
          <li className="relative" onPointerLeave={e => { if (e.pointerType === 'mouse') setMenu(false); }}>
            <button type="button" aria-expanded={menu} aria-controls="paths-menu" onClick={e => {
              // A mouse already opened it on hover; a click should not close it again. Touch and keyboard toggle.
              const mouse = (e.nativeEvent as PointerEvent).pointerType === 'mouse';
              setMenu(v => mouse ? true : !v);
            }} onPointerEnter={e => { if (e.pointerType === 'mouse') setMenu(true); }} className={link(onPaths || menu)}>
              Career paths <ChevronDown aria-hidden="true" className={cn('size-4 transition-transform', menu && 'rotate-180')} />
              {onPaths && <span aria-hidden="true" className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-accent xl:inset-x-4" />}
            </button>
            {menu && <div id="paths-menu" className="absolute left-0 top-full w-[560px] pt-3">
              <div className="overflow-hidden rounded-[14px] border border-neutral-200 bg-surface shadow-[0_30px_70px_-30px_rgb(10_10_11/0.45)]">
                <p className="px-5 pt-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Choose the job you want</p>
                <ul className="grid grid-cols-2 gap-1 p-2">
                  {paths.map(p => <li key={p.id}>
                    <Link href={`/paths/${p.id}`} onClick={close} className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-neutral-50">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-neutral-200 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG logos */}
                        <img src={toolIcon(p.tools[0].icon)} alt="" width={22} height={22} className="size-[22px] object-contain" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold text-ink group-hover:text-accent">{p.label}</span>
                        <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-neutral-400">{p.note}</span>
                      </span>
                    </Link>
                  </li>)}
                  <li>
                    <Link href="/paths" onClick={close} className="flex h-full items-center justify-between gap-2 rounded-2xl bg-accent-soft p-3 text-[15px] font-semibold text-accent transition-colors hover:bg-accent hover:text-white">
                      Compare all paths <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </li>
                </ul>
                <p className="border-t border-neutral-100 bg-subtle px-5 py-3 text-sm text-neutral-600">Not sure? <Link href={`${BOOK}?course=Not%20sure%20yet`} onClick={close} className="font-semibold text-accent underline-offset-4 hover:underline">A mentor will help you choose</Link> on a free call.</p>
              </div>
            </div>}
          </li>
          {navigation.map(({ href, label }) => {
            const on = active(href);
            return <li key={href}>
              <Link href={href} aria-current={on ? 'page' : undefined} className={link(on)}>
                {label}
                {on && <span aria-hidden="true" className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-accent xl:inset-x-4" />}
              </Link>
            </li>;
          })}
        </ul>
      </nav>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link href={BOOK} className="hidden h-11 items-center gap-2 rounded-full bg-accent px-5 text-[15px] font-semibold text-white shadow-[0_8px_20px_-10px_rgb(47_84_235/0.8)] transition-colors hover:bg-[#2443c8] sm:inline-flex">
          Book 2 free sessions
        </Link>
        <button ref={trigger} type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="mobile-navigation"
          className="grid size-11 place-items-center rounded-full border border-neutral-200 text-ink transition hover:bg-neutral-50 lg:hidden"
          onClick={() => setOpen(value => !value)}>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={open ? 'M6 6l12 12M6 18L18 6' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
        </button>
      </div>
    </div>

    {open && <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-h))] overflow-y-auto border-b border-neutral-200 bg-surface px-4 pb-6 pt-3 shadow-xl lg:hidden">
      <div className="mx-auto max-w-7xl">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Career paths</p>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
          {paths.map(p => <li key={p.id}>
            <Link href={`/paths/${p.id}`} onClick={close} className="flex items-center justify-between rounded-xl px-3 py-3 text-base font-semibold text-ink hover:bg-neutral-50">
              {p.label}<span className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-400">{p.note}</span>
            </Link>
          </li>)}
        </ul>
        <ul className="mt-3 border-t border-neutral-100 pt-2">
          {navigation.map(({ href, label }) => <li key={href}>
            <Link href={href} onClick={close} aria-current={active(href) ? 'page' : undefined} className={cn('block py-3 text-lg font-semibold', active(href) ? 'text-accent' : 'text-ink')}>{label}</Link>
          </li>)}
        </ul>
        <div className="mt-4 grid gap-2">
          <Link href={BOOK} onClick={close} className="flex h-12 items-center justify-center gap-2 rounded-full bg-accent text-base font-semibold text-white">Book 2 free sessions <ArrowRight aria-hidden="true" className="size-4" /></Link>
          <a href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center justify-center rounded-full border border-neutral-200 text-base font-semibold text-ink">Chat on WhatsApp</a>
        </div>
      </div>
    </nav>}
  </header>;
}

export function SiteHeader() {
  const pathname = usePathname();
  // Keyed so the menus close on navigation.
  return <HeaderNavigation key={pathname} pathname={pathname} />;
}
