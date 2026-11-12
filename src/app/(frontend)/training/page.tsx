import Link from 'next/link'
import { Container } from '@/components/ui/Container'

export const metadata = { title: 'Training Programs | Tinitiate AI' }
const programs = [
  ['beginner-training', 'Beginner Training', 'Build strong foundations in programming, web development, and databases.'],
  ['professional-training', 'Professional Training', 'Develop practical skills in full stack development, cloud, data engineering, and AI.'],
  ['corporate-training', 'Corporate Training', 'Upskill your team through tailored, project-focused programs.'],
  ['personalized-training', 'Personalized Training', 'Work with a mentor on a learning plan that fits your goals.'],
  ['campus-training', 'Campus Training', 'Connect classroom learning with industry tools and projects.'],
  ['opt-training', 'OPT Training', 'Explore technical training and career preparation for OPT students.'],
  ['/online-training', 'Online Training', 'Join live sessions wherever you are.'],
  ['/classroom-training', 'Classroom Training', 'Learn alongside your peers in the classroom.'],
  ['/weekend-training', 'Weekend Training', 'Build new skills alongside your weekday commitments.'],
  ['/work-experience-program', 'Work Experience Program', 'Build a portfolio through guided projects and teamwork.'],
]
export default function TrainingPage() {
  return <><section className="bg-slate-950 py-20 text-white"><Container><p className="mb-3 text-blue-300">LEARN. BUILD. GROW.</p><h1 className="text-4xl font-bold sm:text-5xl">Training for your next step</h1><p className="mt-5 max-w-2xl text-slate-300">Practical, mentor-led learning for individuals, campuses, and corporate teams.</p><Link href="/courses" className="mt-8 inline-block rounded-full bg-blue-600 px-6 py-3 font-semibold">Explore all courses</Link></Container></section><Container className="grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-3">{programs.map(([path, title, text]) => <Link key={path} href={path.startsWith('/') ? path : `/training/${path}`} className="rounded-2xl border border-slate-200 p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg"><h2 className="text-xl font-semibold">{title}</h2><p className="mt-3 text-slate-600">{text}</p><span className="mt-6 inline-block font-semibold text-blue-600">Explore program →</span></Link>)}</Container></>
}
