import { courses, type Course } from '@/lib/courses';
import { categories, courseCategory, courseDetails, formatDuration, formatLevel } from '@/lib/courseDetails';
import { CourseTabs, type CourseTab } from './CourseTabs';

/** Hand-picked for the first tab: the courses most visitors ask about. */
const trending = ['java-full-stack-development', 'Python', 'aws-beginner-course', 'azure-data-engineering', 'langchain-beginner-course', 'gpt-beginner-course', 'react-web-development', 'snowflake-data-engineering'];

const toCard = (c: Course) => ({
  slug: c.slug, title: c.title, image: c.image, summary: courseDetails(c).summary,
  level: formatLevel(c.level), duration: formatDuration(c.duration), category: categories.find(x => x.id === courseCategory(c))?.label ?? 'Programming',
});

/** "Our Courses": colourful course cards under category tabs, each with Enroll and Syllabus actions. */
export function PopularCourses() {
  const tabs: CourseTab[] = [
    { id: 'trending', label: 'Trending', courses: trending.map(s => courses.find(c => c.slug === s)).filter((c): c is Course => !!c).map(toCard) },
    ...categories.map(cat => ({ id: cat.id, label: cat.label, courses: courses.filter(c => courseCategory(c) === cat.id).slice(0, 8).map(toCard) })),
  ];
  return <section aria-labelledby="courses-title" className="bg-surface pb-16 pt-20 sm:pb-20 sm:pt-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">{Math.floor(courses.length / 10) * 10}+ live courses</p>
        <h2 id="courses-title" className="mt-2 text-[2.1rem] font-bold leading-tight tracking-[-0.035em] text-ink sm:text-[2.7rem]">Our <span className="bg-[linear-gradient(100deg,#2f54eb,#7c3aed)] bg-clip-text text-transparent">Courses</span></h2>
        <p className="mt-3 text-base leading-7 text-neutral-600 sm:text-lg">Every course is taught live by an industry mentor, from first steps to advanced, job-ready skills.</p>
      </div>
      <CourseTabs tabs={tabs} />
    </div>
  </section>;
}
