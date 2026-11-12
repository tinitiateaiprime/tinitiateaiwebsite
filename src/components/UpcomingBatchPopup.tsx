'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000
const SEEN_KEY = 'tinitiateai_seen_training_promo'

function formatIST(iso: string) {
  const d = new Date(new Date(iso).getTime() + IST_OFFSET_MS)
  const hours24 = d.getUTCHours()
  const minutes = d.getUTCMinutes().toString().padStart(2, '0')
  const period = hours24 >= 12 ? 'PM' : 'AM'
  const hours12 = hours24 % 12 || 12

  return {
    weekday: WEEKDAYS[d.getUTCDay()],
    date: `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`,
    time: `${hours12}:${minutes} ${period}`,
  }
}

type UpcomingBatchPopupProps = {
  slotId?: number | null
  startsAt?: string | null
  courseTitle?: string | null
  trainerName?: string | null
}

export function UpcomingBatchPopup({
  slotId,
  startsAt,
  courseTitle,
  trainerName,
}: UpcomingBatchPopupProps) {
  const [open, setOpen] = useState(false)
  const popupKey = slotId ? `slot-${slotId}` : 'general-training-promo'

  const demo = useMemo(() => (startsAt ? formatIST(startsAt) : null), [startsAt])

  useEffect(() => {
    let alreadySeen = false

    try {
      alreadySeen = sessionStorage.getItem(SEEN_KEY) === popupKey
    } catch {
      alreadySeen = false
    }

    if (alreadySeen) return

    const timer = window.setTimeout(() => {
      setOpen(true)
      try {
        sessionStorage.setItem(SEEN_KEY, popupKey)
      } catch {
        // Ignore storage errors (private browsing, disabled storage, etc.).
      }
    }, 50)

    return () => window.clearTimeout(timer)
  }, [popupKey])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-[2px] sm:p-5"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <div
        className="relative flex max-h-[94vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_30px_90px_rgba(2,6,23,0.55)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="TinitiateAI training promotion"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close promotion"
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md ring-1 ring-slate-200 transition hover:scale-105 hover:bg-white"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-100">
          <Image
            src="/images/tinitiateai-training-popup.png"
            alt="TinitiateAI Multi-Cloud, DevOps and AI Ops training promotion"
            width={1145}
            height={1374}
            sizes="(max-width: 640px) calc(100vw - 24px), 560px"
            className="h-auto w-full"
            fetchPriority="high"
          />
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 sm:px-5 sm:py-4">
          {demo && (
            <div className="mb-3 rounded-xl bg-sky-50 px-3 py-2 text-center text-xs font-medium text-slate-700 sm:text-sm">
              <span className="font-bold text-sky-700">Next live demo:</span>{' '}
              {demo.weekday}, {demo.date} · {demo.time} IST
              {courseTitle ? ` · ${courseTitle}` : ''}
              {trainerName ? ` · ${trainerName}` : ''}
            </div>
          )}

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
            <Link
              href="/book-a-demo"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:brightness-105"
            >
              Book Your Free Demo →
            </Link>
            <Link
              href="/courses"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
