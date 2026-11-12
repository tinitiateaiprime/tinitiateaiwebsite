import { ResponsiveHero } from '@/components/ResponsiveHero'
import { Container } from '@/components/ui/Container'
import { ScheduleTable } from '@/components/ScheduleTable'
import { getUpcomingBatches } from '@/lib/batches'

export const metadata = {
  title: 'Online Training — TinitiateAI',
}

export default async function OnlineTrainingPage() {
  const batches = await getUpcomingBatches('online')

  return (
    <>
      <ResponsiveHero
        imageSrc="/images/training/online-training.png"
        mobileImageSrc="/images/training/mobile/online-training.webp"
        eyebrow="Training"
        title="Online Training"
        description="Join live, instructor-led sessions from anywhere with the same curriculum, mentor access, and projects as our classroom batches — ideal if you can't make it to a physical location."
        cta={{
          href: '/book-a-demo',
          label: 'Book a Free Demo',
        }}
      />

      <Container className="py-16">
        <h2 className="text-xl font-bold text-slate-900">
          Upcoming Online Batches
        </h2>

        <div className="mt-6">
          <ScheduleTable batches={batches} />
        </div>
      </Container>
    </>
  )
}