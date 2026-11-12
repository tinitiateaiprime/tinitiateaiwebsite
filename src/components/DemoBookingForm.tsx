'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { formatDateLabel, formatTimeLabel } from '@/lib/dateFormat'

type Slot = {
  id: number
  startsAt: string
  endsAt: string
  courseTitle: string | null
  seatsRemaining: number
}

type Course = { id: number; title: string }

export function DemoBookingForm({
  slots,
  courses,
  preselectedCourseId,
}: {
  slots: Slot[]
  courses: Course[]
  preselectedCourseId?: number | null
}) {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const slotsByDate = useMemo(() => {
    const groups = new Map<string, Slot[]>()
    for (const slot of slots) {
      const dateKey = formatDateLabel(slot.startsAt)
      if (!groups.has(dateKey)) groups.set(dateKey, [])
      groups.get(dateKey)!.push(slot)
    }
    return Array.from(groups.entries())
  }, [slots])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedSlot) {
      setError('Please select a demo time slot.')
      setStatus('error')
      return
    }
    setStatus('loading')
    setError('')

    const form = e.currentTarget
    const formData = Object.fromEntries(new FormData(form).entries())
    const course = formData.course ? Number(formData.course) : undefined

    try {
      const res = await fetch('/api/demo-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message || undefined,
          course,
          slot: selectedSlot,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.errors?.[0]?.message || 'Something went wrong. Please try another slot.')
      }
      setStatus('success')
      form.reset()
      setSelectedSlot(null)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl bg-green-50 p-8 text-center text-green-700">
        <p className="text-lg font-semibold">Demo booked!</p>
        <p className="mt-2 text-sm">Your demo request has been submitted successfully. Our team will contact you shortly with the next steps.</p>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
        No demo slots are open right now. Please check back soon or reach out via the contact page.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">1. Choose a time</h2>
        <div className="mt-4 space-y-6">
          {slotsByDate.map(([date, daySlots]) => (
            <div key={date}>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{date}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {daySlots.map((slot) => {
                  const time = formatTimeLabel(slot.startsAt)
                  const isSelected = selectedSlot === slot.id
                  return (
                    <button
                      type="button"
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`rounded-lg border px-4 py-2 text-left text-sm transition ${
                        isSelected
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400'
                      }`}
                    >
                      <span className="block font-medium">{time}</span>
                      <span className={`block text-xs ${isSelected ? 'text-brand-100' : 'text-slate-400'}`}>
                        {slot.courseTitle ?? 'General orientation'} &middot; {slot.seatsRemaining} seats left
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-900">2. Your details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full name</label>
            <input
              name="name"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Phone</label>
            <input
              name="phone"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Interested course (optional)</label>
            <select
              name="course"
              defaultValue={preselectedCourseId ?? ''}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">Not sure yet</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700">Anything you&apos;d like us to know?</label>
          <textarea
            name="message"
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {status === 'error' && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60 sm:w-auto"
      >
        {status === 'loading' ? 'Booking…' : 'Confirm Booking'}
      </button>
    </form>
  )
}
