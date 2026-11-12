import type { Testimonial } from '@/payload-types'

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const course = typeof testimonial.course === 'object' ? testimonial.course : null

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex gap-1 text-accent-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill={i < (testimonial.rating ?? 5) ? 'currentColor' : '#e2e8f0'}
          >
            <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L10 1.5z" />
          </svg>
        ))}
      </div>
      <p className="mt-4 flex-1 text-sm text-slate-700">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-sm font-semibold text-slate-900">{testimonial.studentName}</p>
        {course && <p className="text-xs text-slate-500">{course.title}</p>}
        {testimonial.placedAt && <p className="mt-1 text-xs font-medium text-brand-600">{testimonial.placedAt}</p>}
      </div>
    </div>
  )
}
