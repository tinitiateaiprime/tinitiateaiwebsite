import type { Course } from '@/payload-types'
import { CourseFeatureCard } from '@/components/CourseFeatureCard'

export function CourseCarouselCard({ course, index }: { course: Course; index: number }) {
  return (
    <div className="w-72 shrink-0 snap-start">
      <CourseFeatureCard course={course} index={index} />
    </div>
  )
}
