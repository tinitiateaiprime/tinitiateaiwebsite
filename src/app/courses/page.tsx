import type { Metadata } from 'next';
import { courses } from '@/lib/courses';
import { CourseSearch } from '@/components/CourseSearch';
export const metadata:Metadata={title:'Courses'};
export default function CoursesPage(){return <div className="mx-auto max-w-7xl px-6 py-14"><p className="font-bold uppercase tracking-widest text-blue-600">Static course catalog</p><h1 className="mt-2 text-4xl font-bold">Explore our {courses.length} courses</h1><p className="mt-4 max-w-2xl text-slate-600">Course information is available without signing in. Browse topics and find the skills you want to learn.</p><CourseSearch courses={courses}/></div>}
