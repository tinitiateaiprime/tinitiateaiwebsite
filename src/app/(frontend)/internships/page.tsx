import { ResponsiveHero } from '@/components/ResponsiveHero'
import { Container } from '@/components/ui/Container'
import { ScheduleTable } from '@/components/ScheduleTable'
import { getUpcomingBatches } from '@/lib/batches'

export const metadata = {
  title: 'Internships — TinitiateAI',
}

export default async function InternshipsPage() {
  const batches = await getUpcomingBatches('internship')

  return (
    <>
      <ResponsiveHero
        imageSrc="/images/training/internships.png"
        mobileImageSrc="/images/training/mobile/internships.webp"
        eyebrow="Training"
        title="Internships"
        description="Apply what you've learned on a real project with mentorship from our engineering team. Internship batches are project-based and run alongside our core courses."
        cta={{
          href: '/book-a-demo',
          label: 'Book a Free Demo',
        }}
      />

      <Container className="py-16">
        <h2 className="text-xl font-bold text-slate-900">
          Upcoming Internship Batches
        </h2>

        <div className="mt-6">
          <ScheduleTable batches={batches} />
        </div>
      </Container>
    </>
  )
}