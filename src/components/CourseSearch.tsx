'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Course } from '@/lib/courses';
export function CourseSearch({courses}: {courses:Course[]}) {
  const [search,setSearch]=useState('');
  const [level,setLevel]=useState('all');
  const visible=courses.filter(course=>{
    const q=search.trim().toLowerCase();
    return (!q||`${course.title} ${course.shortDescription} ${course.level}`.toLowerCase().includes(q))&&(level==='all'||course.level===level);
  });
  const levels=[...new Set(courses.map(c=>c.level).filter(Boolean))];
  return <>
    <div className="mt-8 flex flex-wrap gap-3"><input aria-label="Search static courses" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search courses" className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"/><select aria-label="Filter by level" className="rounded-xl border border-slate-300 px-4 py-3" value={level} onChange={e=>setLevel(e.target.value)}><option value="all">All levels</option>{levels.map(x=><option key={x} value={x}>{x}</option>)}</select></div>
    <p className="mt-4 text-sm text-slate-600" aria-live="polite">{visible.length} courses</p>
    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map(c=><Link key={c.slug} href={`/courses/${encodeURIComponent(c.slug)}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"><div className="mb-4 flex h-36 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-slate-100">{c.image?<Image unoptimized src={c.image} alt="" width={220} height={130} className="h-full w-full object-contain p-3"/>:<span className="text-3xl font-bold text-blue-300">Tinitiate AI</span>}</div><p className="text-xs font-bold uppercase tracking-wider text-blue-600">{c.level||'Training'} · {c.duration||'Self-paced'}</p><h2 className="mt-2 text-xl font-bold text-slate-900 group-hover:text-blue-700">{c.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{c.shortDescription||c.description}</p><span className="mt-5 inline-block text-sm font-semibold text-blue-700">Read course →</span></Link>)}</div>
    {visible.length===0&&<p className="mt-8 rounded-xl bg-slate-100 p-6">No matching courses. Try a different search.</p>}
  </>;
}
