import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { RichText } from '@/components/RichText'
import { CourseFeatureCard } from '@/components/CourseFeatureCard'
import { getPayload } from '@/lib/getPayload'

export default async function TrainerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload()

  const result = await payload.find({ collection: 'trainers', where: { slug: { equals: slug } }, limit: 1 })
  const trainer = result.docs[0]
  if (!trainer) notFound()

  const courses = await payload.find({
    collection: 'courses',
    where: { trainer: { equals: trainer.id } },
    depth: 1,
  })

  return (
    <Container className="py-16">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-2xl font-bold text-white">
          {trainer.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{trainer.name}</h1>
          <p className="text-brand-600">{trainer.title}</p>
          <p className="text-sm text-slate-500">{trainer.yearsExperience}+ years experience</p>
        </div>
      </div>

      {trainer.expertise && trainer.expertise.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {trainer.expertise.map((e) => (
            <span key={e.id} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              {e.skill}
            </span>
          ))}
        </div>
      )}

      {trainer.bio && (
        <div className="mt-8 max-w-3xl">
          <RichText data={trainer.bio} />
        </div>
      )}

      {courses.docs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-900">Courses by {trainer.name}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.docs.map((course, i) => (
              <CourseFeatureCard key={course.id} course={course} index={i} />
            ))}
          </div>
        </div>
      )}
    </Container>
  )
}
