import Link from 'next/link'
import { ResponsiveHero } from '@/components/ResponsiveHero'
import { Container } from '@/components/ui/Container'
import { getPayload } from '@/lib/getPayload'

export const metadata = {
  title: 'Workshops — TinitiateAI',
}

export default async function WorkshopsPage() {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'workshops',
    limit: 100,
    sort: 'scheduledAt',
    depth: 1,
  })

  const workshops = result.docs

  return (
    <>
      <ResponsiveHero
        imageSrc="/images/training/workshops.png"
        mobileImageSrc="/images/training/mobile/workshops.webp"
        eyebrow="Services"
        title="Workshops"
        description="Practical, instructor-led workshops designed to help you understand technologies through hands-on learning and real-world examples."
      />

      <Container className="py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {workshops.map((workshop) => (
            <div
              key={workshop.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                <WorkshopIcon />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                {workshop.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {workshop.shortDescription}
              </p>

              {workshop.duration && (
                <p className="mt-3 text-xs font-medium text-slate-500">
                  Duration: {workshop.duration}
                </p>
              )}

              {workshop.mode && (
                <p className="mt-1 text-xs font-medium capitalize text-slate-500">
                  Mode: {workshop.mode}
                </p>
              )}
            </div>
          ))}
        </div>

        {workshops.length === 0 && (
          <p className="text-sm text-slate-500">
            No workshops available right now.
          </p>
        )}

        <div className="mt-10">
          <Link
            href="/contact"
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Enquire About Workshops
          </Link>
        </div>
      </Container>
    </>
  )
}

function WorkshopIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5h16v10H4z" />
      <path d="M8 19h8" />
      <path d="M12 15v4" />
      <path d="M8 9h8" />
    </svg>
  )
}