import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { courses, courseBySlug } from '@/lib/courses';
export function generateStaticParams(){return courses.map(course=>({slug:course.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const course=courseBySlug(decodeURIComponent((await params).slug));return {title:course?.title||'Course'};}
export default async function CoursePage({params}:{params:Promise<{slug:string}>}){
  const course=courseBySlug(decodeURIComponent((await params).slug));if(!course)notFound();
  return <div className="mx-auto max-w-5xl px-6 py-14"><Link href="/courses" className="text-sm font-semibold text-blue-700 hover:underline">← All courses</Link><p className="mt-8 text-xs font-bold uppercase tracking-widest text-blue-600">{course.level} · {course.duration}</p><h1 className="mt-3 text-4xl font-bold tracking-tight">{course.title}</h1><p className="mt-6 text-lg leading-8 text-slate-600">{course.shortDescription}</p><div className="mt-10 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><h2 className="text-2xl font-bold">About this course</h2><div className="mt-5 space-y-4 text-slate-700">{course.description.split('\n').filter(Boolean).map((p,i)=><p key={i} className="leading-7">{p}</p>)}</div></div>
  {Boolean(course.topics?.length)&&<section className="mt-10"><h2 className="text-2xl font-bold">Course outline</h2><div className="mt-5 space-y-3">{course.topics?.map((section,i)=><details key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-5"><summary className="cursor-pointer font-semibold">{section.title}</summary><ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">{section.topics?.map((topic,j)=><li key={j}>{topic}</li>)}</ul></details>)}</div></section>}
  <div className="mt-10 flex flex-wrap gap-3"><Link className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700" href={`/request-callback?course=${encodeURIComponent(course.title)}`}>Ask about this course</Link><Link href="/masterclasses" className="rounded-full border border-blue-300 px-6 py-3 font-semibold text-blue-800">Browse free MasterClasses</Link></div></div>;
}
