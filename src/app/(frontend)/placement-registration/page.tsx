import { Container } from '@/components/ui/Container'
import { PlacementRegistrationForm } from '@/components/PlacementRegistrationForm'
import { getPayload } from '@/lib/getPayload'

export const metadata = { title: 'Placement Registration — TinitiateAI' }

export default async function PlacementRegistrationPage() {
  const payload = await getPayload()
  const coursesResult = await payload.find({ collection: 'courses', limit: 50, sort: 'title' })
  const courses = coursesResult.docs.map((c) => ({ id: c.id, title: c.title }))

  return (
    <Container className="grid gap-12 py-16 lg:grid-cols-2">
      <div>
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">Training</span>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Placement Registration</h1>
        <p className="mt-4 text-slate-600">
          Register with our placement assistance program to get access to skill assessments, career counseling,
          and introductions to our hiring partner network.
        </p>
        <p className="mt-4 text-sm text-slate-500">
          Open to current students, graduates of any TinitiateAI program, and career-break professionals
          re-entering the workforce.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <PlacementRegistrationForm courses={courses} />
      </div>
    </Container>
  )
}
