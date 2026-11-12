import { ResponsiveHero } from '@/components/ResponsiveHero'
import { Container } from '@/components/ui/Container'
import { ScheduleTable } from '@/components/ScheduleTable'
import { getUpcomingBatches } from '@/lib/batches'

export const metadata = {
  title: 'Weekend Training — TinitiateAI',
}

export default async function WeekendTrainingPage() {
  const batches = await getUpcomingBatches('weekend')

  return (
    <>
      <ResponsiveHero
        imageSrc="/images/training/weekend-training.png"
        mobileImageSrc="/images/training/mobile/weekend-training.webp"
        eyebrow="Training"
        title="Weekend Training"
        description="Keep your weekdays free. Our weekend batches cover the same curriculum at a pace built for working professionals, meeting Saturdays and Sundays."
        cta={{
          href: '/book-a-demo',
          label: 'Book a Free Demo',
        }}
      />

      <Container className="py-16">
        <h2 className="text-xl font-bold text-slate-900">
          Upcoming Weekend Batches
        </h2>

        <div className="mt-6">
          <ScheduleTable batches={batches} />
        </div>
      </Container>
    </>
  )
}