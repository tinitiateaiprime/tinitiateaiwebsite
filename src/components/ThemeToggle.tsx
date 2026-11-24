'use client';
import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/cn';

type Theme = 'light' | 'dark';

/**
 * Runs in <head> before the page paints: the visitor's saved choice, else the
 * bright light theme. Keeps the page from flashing the wrong theme.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t='light';document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}
const read = (): Theme => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

/** Sun/moon switch. The choice is a per-visitor convenience, so browser storage is enough. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, read, () => 'light' as Theme);
  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  return <button type="button" onClick={() => {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* private mode: still switches for this visit */ }
  }} aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}
    className={cn('grid size-11 place-items-center rounded-full border border-neutral-200 text-ink transition hover:bg-neutral-100', className)}>
    {theme === 'dark' ? <Sun aria-hidden="true" className="size-[18px]" /> : <Moon aria-hidden="true" className="size-[18px]" />}
  </button>;
}
