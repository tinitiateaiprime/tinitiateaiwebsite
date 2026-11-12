import { formatShortDate, formatTimeLabel } from '@/lib/dateFormat'

type Batch = {
  id: number
  courseName: string
  facultyName: string
  startsAt: string
  meetingLink: string | null
}

export function ScheduleTable({ batches }: { batches: Batch[] }) {
  if (batches.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
        No upcoming sessions scheduled right now. Check back soon or book a free demo to be notified.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">S No</th>
            <th className="px-4 py-3">Course Name</th>
            <th className="px-4 py-3">Faculty</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Meeting Link</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {batches.map((batch, i) => (
            <tr key={batch.id} className="odd:bg-white even:bg-slate-50">
              <td className="px-4 py-3 text-slate-500">{i + 1}</td>
              <td className="px-4 py-3 font-medium text-slate-900">{batch.courseName}</td>
              <td className="px-4 py-3 text-slate-600">{batch.facultyName}</td>
              <td className="px-4 py-3 text-slate-600">{formatShortDate(batch.startsAt)}</td>
              <td className="px-4 py-3 text-slate-600">{formatTimeLabel(batch.startsAt)} (IST)</td>
              <td className="px-4 py-3">
                {batch.meetingLink ? (
                  <a
                    href={batch.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-brand-500 px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-brand-50"
                  >
                    Click here
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Contact for details</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
