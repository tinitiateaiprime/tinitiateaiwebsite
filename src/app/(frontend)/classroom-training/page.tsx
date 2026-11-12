import { ResponsiveHero } from '@/components/ResponsiveHero'
import { Container } from '@/components/ui/Container'
import { ScheduleTable } from '@/components/ScheduleTable'
import { getUpcomingBatches } from '@/lib/batches'
import { getSiteSettings } from '@/lib/siteSettings'

export const metadata = {
  title: 'Classroom Training — TinitiateAI',
}

export default async function ClassroomTrainingPage() {
  const [batches, settings] = await Promise.all([
    getUpcomingBatches('classroom'),
    getSiteSettings(),
  ])

  return (
    <>
      <ResponsiveHero
        imageSrc="/images/training/classroom-training.png"
        mobileImageSrc="/images/training/mobile/classroom-training.webp"
        eyebrow="Training"
        title="Classroom Training"
        description={
          <>
            Prefer learning in person? Our classroom sessions run in small groups
            with direct, in-room access to your trainer for hands-on practice and
            immediate feedback.
            {settings.address && ` Sessions are held at ${settings.address}.`}
          </>
        }
        cta={{
          href: '/book-a-demo',
          label: 'Book a Free Demo',
        }}
      />

      <Container className="py-16">
        <h2 className="text-xl font-bold text-slate-900">
          Upcoming Classroom Batches
        </h2>

        <div className="mt-6">
          <ScheduleTable batches={batches} />
        </div>
      </Container>
    </>
  )
}