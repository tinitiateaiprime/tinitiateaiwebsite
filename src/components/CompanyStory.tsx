import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { getSiteSettings } from '@/lib/siteSettings'

export const metadata = { title: 'About — TinitiateAI' }

export default async function CompanyStory() {
  const settings = await getSiteSettings()

  return (
    <>
      <Container className="grid gap-12 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Our Story</h2>
          <p className="mt-4 text-slate-600">
            {settings.siteName} was founded by AI practitioners who saw a gap between how AI is taught in most
            courses and how it is actually built and shipped in the industry. Every program we run is designed
            backwards from the skills hiring managers are actually looking for.
          </p>
          <p className="mt-4 text-slate-600">
            We keep cohorts small, projects real, and trainers active in the field — not full-time educators
            reciting slides.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">What We Believe</h2>
          <ul className="mt-4 space-y-4">
            <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="font-semibold text-slate-900">Learning by building</p>
              <p className="mt-1 text-sm text-slate-600">Every course ends in a portfolio-ready project, not just a certificate.</p>
            </li>
            <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="font-semibold text-slate-900">Trainers who ship</p>
              <p className="mt-1 text-sm text-slate-600">Our instructors work on production AI systems outside the classroom too.</p>
            </li>
            <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="font-semibold text-slate-900">Outcomes over hours</p>
              <p className="mt-1 text-sm text-slate-600">We measure success in placements and promotions, not seat time.</p>
            </li>
          </ul>
        </div>
      </Container>

      <section className="bg-slate-50 py-16">
        <Container className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Meet the trainers behind the curriculum</h2>
          <Link href="/trainers" className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">
            View Trainers
          </Link>
        </Container>
      </section>
    </>
  )
}
