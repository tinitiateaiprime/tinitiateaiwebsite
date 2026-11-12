import { redirect } from 'next/navigation'
export default async function AcademyPage({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
  const { course } = await searchParams
  redirect(course ? `/demos?course=${encodeURIComponent(course)}` : '/demos')
}
