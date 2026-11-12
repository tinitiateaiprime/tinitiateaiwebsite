import { Container } from '@/components/ui/Container'
import { BatchTimetable } from '@/components/BatchTimetable'
import { getUpcomingBatches } from '@/lib/batches'

export const metadata = { title: 'New Batches — TinitiateAI' }

export default async function CourseSchedulePage() {
  const batches = await getUpcomingBatches()

  return (
    <Container className="py-16">
      <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">
        Training
      </span>

      <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
        New Batches
      </h1>

      <p className="mt-3 text-slate-600">
        View all active upcoming training batches in one place.
      </p>

      <div className="mt-10">
        <BatchTimetable batches={batches} />
      </div>
    </Container>
  )
}