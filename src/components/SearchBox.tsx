'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

export function SearchBox({ className = '' }: { className?: string }) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = query.trim()
    router.push(trimmed ? `/courses?q=${encodeURIComponent(trimmed)}` : '/courses')
  }

  return (
    <form onSubmit={handleSubmit} className={`flex items-center overflow-hidden rounded-full border border-slate-300 bg-white ${className}`}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search courses…"
        className="w-full min-w-0 bg-transparent px-4 py-2 text-sm text-slate-700 focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex h-full items-center bg-brand-600 px-3 py-2 text-white transition hover:bg-brand-700"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </button>
    </form>
  )
}
