import { Container } from '@/components/ui/Container'
import { TrainerCard } from '@/components/TrainerCard'
import { getPayload } from '@/lib/getPayload'

export const metadata = { title: 'Trainers — TinitiateAI' }

export default async function TrainersPage() {
  const payload = await getPayload()
  const trainers = await payload.find({ collection: 'trainers', limit: 50, sort: 'name' })

  return (
    <Container className="py-16">
      <div className="max-w-2xl">
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">Our Trainers</span>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          Learn from engineers building AI in production
        </h1>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {trainers.docs.map((trainer) => (
          <TrainerCard key={trainer.id} trainer={trainer} />
        ))}
      </div>
    </Container>
  )
}
