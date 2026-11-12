'use client'

import { useMemo, useState } from 'react'
import { formatShortDate, formatTimeLabel } from '@/lib/dateFormat'

type Batch = {
  id: number
  courseName: string
  facultyName: string
  mode: string
  startsAt: string
  meetingLink: string | null
}

const modeLabels: Record<string, string> = {
  online: 'Online Training',
  classroom: 'Classroom Training',
  weekend: 'Weekend Training',
  workshop: 'Workshop',
  internship: 'Internship',
}

export function BatchTimetable({ batches }: { batches: Batch[] }) {
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(10)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    if (!q) return batches

    return batches.filter((batch) => {
      const trainingType = modeLabels[batch.mode] ?? batch.mode

      return (
        batch.courseName.toLowerCase().includes(q) ||
        batch.facultyName.toLowerCase().includes(q) ||
        trainingType.toLowerCase().includes(q)
      )
    })
  }, [batches, query])

  const visible = filtered.slice(0, limit)

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Show
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="rounded-lg border border-slate-300 px-2 py-1 text-sm focus:border-brand-500 focus:outline-none"
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          entries
        </label>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search course, faculty or training type..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:w-80"
        />
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">S No</th>
              <th className="px-4 py-3">Course Name</th>
              <th className="px-4 py-3">Faculty</th>
              <th className="px-4 py-3">Training Type</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Meeting Link</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {visible.map((batch, i) => (
              <tr
                key={batch.id}
                className="odd:bg-white even:bg-slate-50 transition hover:bg-slate-100"
              >
                <td className="px-4 py-3 text-slate-500">{i + 1}</td>

                <td className="px-4 py-3 font-medium text-slate-900">
                  {batch.courseName}
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {batch.facultyName}
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                    {modeLabels[batch.mode] ?? batch.mode}
                  </span>
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {formatShortDate(batch.startsAt)}
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {formatTimeLabel(batch.startsAt)} (IST)
                </td>

                <td className="px-4 py-3">
                  {batch.meetingLink ? (
                    <a
                      href={batch.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-lg border border-brand-500 px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-brand-50"
                    >
                      Click here
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">
                      Contact for details
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visible.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-500">
            No upcoming batches found.
          </p>
        )}
      </div>
    </div>
  )
}