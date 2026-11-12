'use client'

import { useState, type FormEvent } from 'react'

type Course = { id: number; title: string }

export function PlacementRegistrationForm({ courses }: { courses: Course[] }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    const courseCompleted = data.courseCompleted ? Number(data.courseCompleted) : undefined

    try {
      const res = await fetch('/api/placement-registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, courseCompleted }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.errors?.[0]?.message || 'Something went wrong. Please try again.')
      }
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl bg-green-50 p-6 text-green-700">
        <p className="font-semibold">Registration received!</p>
        <p className="mt-1 text-sm">Our placement team will reach out to you within 2 business days.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" name="phone" required />
        <div>
          <label className="block text-sm font-medium text-slate-700">Current status</label>
          <select
            name="currentStatus"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">Select one</option>
            <option value="student">Student</option>
            <option value="fresher">Fresher</option>
            <option value="working">Working Professional</option>
            <option value="career-break">Career Break</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Course completed (optional)</label>
        <select
          name="courseCompleted"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">Not applicable</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>
      <Field label="Resume link (Google Drive, LinkedIn, etc.)" name="resumeLink" />
      <div>
        <label className="block text-sm font-medium text-slate-700">Anything we should know?</label>
        <textarea
          name="message"
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>
      {status === 'error' && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
      >
        {status === 'loading' ? 'Submitting…' : 'Register for Placement Assistance'}
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
    </div>
  )
}
