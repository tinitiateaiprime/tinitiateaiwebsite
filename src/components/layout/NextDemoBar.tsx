import Link from 'next/link'
import type { DemoSlot } from '@/payload-types'

export function NextDemoBar({ slot }: { slot: DemoSlot | null }) {
  if (!slot) return null

  const course = typeof slot.course === 'object' ? slot.course : null
  const date = new Date(slot.startsAt).toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const time = new Date(slot.startsAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })

  return (
    <Link
      href="/book-a-demo"
      className="flex items-center justify-center gap-2 bg-slate-900 px-4 py-2 text-center text-xs font-medium text-white transition hover:bg-slate-800 sm:text-sm"
    >
      <span className="hidden h-2 w-2 animate-pulse rounded-full bg-emerald-400 sm:inline-block" />
      <span>
        Next Demo: <strong className="font-semibold">{date} at {time}</strong>
        {course ? ` — ${course.title}` : ' — General Orientation'}
      </span>
      <span className="font-semibold text-brand-300">Reserve your seat →</span>
    </Link>
  )
}
