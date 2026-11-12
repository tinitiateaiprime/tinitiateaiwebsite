import Link from 'next/link'
import type { Trainer } from '@/payload-types'

export function TrainerCard({ trainer }: { trainer: Trainer }) {
  const initials = trainer.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)

  return (
    <Link
      href={`/trainers/${trainer.slug}`}
      className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-xl font-bold text-white">
        {initials}
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{trainer.name}</h3>
      <p className="text-sm text-brand-600">{trainer.title}</p>
      <p className="mt-2 text-xs text-slate-500">{trainer.yearsExperience}+ years experience</p>
      {trainer.expertise && trainer.expertise.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {trainer.expertise.slice(0, 3).map((e) => (
            <span key={e.id} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              {e.skill}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
