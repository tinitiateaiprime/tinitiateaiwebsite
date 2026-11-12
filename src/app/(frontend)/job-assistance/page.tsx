import Link from 'next/link'
import { ResponsiveHero } from '@/components/ResponsiveHero'
import { Container } from '@/components/ui/Container'

export const metadata = {
  title: 'Job Assistance — TinitiateAI',
}

const benefits = [
  {
    title: 'Skill Assessments',
    description:
      'Structured assessments that benchmark your skills against what hiring teams actually look for, so you know exactly where you stand before you start applying.',
  },
  {
    title: 'Hiring Partner Network',
    description:
      'We share qualified graduate profiles with our hiring partners and organize referral drives to create direct introductions to potential employers.',
  },
  {
    title: 'Career Counseling',
    description:
      'One-on-one guidance on resume building, LinkedIn optimization, and interview preparation from counselors who understand the AI and data job market.',
  },
  {
    title: 'Job Market Insights',
    description:
      'Regular briefings on current hiring trends and in-demand skills, so you can position yourself for where the market is heading, not where it was.',
  },
]

export default function JobAssistancePage() {
  return (
    <>
      <ResponsiveHero
        imageSrc="/images/training/job-assistance.png"
        mobileImageSrc="/images/training/mobile/job-assistance.webp"
        eyebrow="Training"
        title="Job Assistance"
        description="Our commitment to your career doesn't end when the course does. Our placement support team works with every graduate on the fundamentals that actually move the needle in a job search."
      />

      <Container className="py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>

              <h2 className="mt-4 font-semibold text-slate-900">
                {benefit.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-3xl text-sm text-slate-500">
          We offer wide-ranging support and resources to every graduate, but
          please note that employment is not guaranteed. Your outcomes depend
          on your own effort, the market, and how you apply what you&apos;ve
          learned.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/placement-registration"
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Register for Placement Assistance
          </Link>

          <Link
            href="/book-a-demo"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Book a Free Demo
          </Link>
        </div>
      </Container>
    </>
  )
}