'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

/** Course search in the hero: sends the visitor to the course list with their search filled in. */
export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState('');
  return <form role="search" onSubmit={e => { e.preventDefault(); router.push(q.trim() ? `/courses?q=${encodeURIComponent(q.trim())}` : '/courses'); }}
    className="flex items-center gap-2 rounded-full border border-neutral-200 bg-surface p-1.5 pl-5 shadow-[0_18px_40px_-24px_rgb(47_84_235/0.55)] focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15">
    <Search aria-hidden="true" className="size-5 shrink-0 text-neutral-400" />
    <label htmlFor="hero-search" className="sr-only">Search courses</label>
    <input id="hero-search" value={q} onChange={e => setQ(e.target.value)} placeholder="What do you want to learn? Python, AWS, GenAI…"
      className="h-11 min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-neutral-400 sm:text-base" />
    <button type="submit" className="h-11 shrink-0 rounded-full bg-[linear-gradient(135deg,#f97316,#ec4899)] px-5 text-[15px] font-semibold text-white transition-[filter] hover:brightness-110 sm:px-6">Search</button>
  </form>;
}
