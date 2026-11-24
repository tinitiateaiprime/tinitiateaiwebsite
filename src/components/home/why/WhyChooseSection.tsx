import { CheckCircle2 } from 'lucide-react';
import { courses } from '@/lib/courses';
import { paths } from '@/data/paths';

/** Only figures the site already states elsewhere: years of experience (Services page), course and path counts (the data). */
const stats = [
  { value: '15+', label: 'Years of industry experience' },
  { value: `${Math.floor(courses.length / 10) * 10}+`, label: 'Live, mentor-led courses' },
  { value: String(paths.length), label: 'Career paths to a job role' },
  { value: '2', label: 'Free sessions before you pay' },
];

const reasons = [
  ['Mentors who have done the job', 'Real delivery experience, not just classroom theory.'],
  ['A path mapped to a role', 'Fundamentals first, then the advanced work, in order.'],
  ['Practice every day', 'Short coding challenges and labs so the logic sticks.'],
  ['Team workflows', 'Sprints and Git, the way tech teams actually ship.'],
  ['Resume and LinkedIn', 'A recruiter-friendly profile built around your projects.'],
  ['Interview practice', 'Technical and HR rounds, rehearsed before the real thing.'],
];

export function WhyChooseSection() {
  return <section aria-labelledby="why-title" className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#0b1640_0%,#1c2f8f_55%,#3b1f8f_100%)] py-16 text-white sm:py-20">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.08)_1px,transparent_0)] [background-size:24px_24px]" />
    <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 -z-10 size-[460px] rounded-full bg-[#ec4899]/25 blur-3xl" />
    <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#fff200]">Why Tinitiate AI</p>
        <h2 id="why-title" className="mt-2 text-balance text-[2.1rem] font-bold leading-tight tracking-[-0.035em] sm:text-[2.7rem]">Training that gets you hired, not just certified</h2>
        <p className="mt-4 max-w-xl text-lg leading-8 text-white/70">Teaching is half of it. The rest is practice, real project work and help getting hired.</p>
        <dl className="mt-10 grid grid-cols-2 gap-4">
          {stats.map(s => <div key={s.label} className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur">
            <dt className="sr-only">{s.label}</dt>
            <dd className="text-[2.6rem] font-bold leading-none tracking-[-0.04em] text-[#fff200] sm:text-5xl">{s.value}</dd>
            <dd className="mt-2 text-sm font-medium text-white/75">{s.label}</dd>
          </div>)}
        </dl>
      </div>
      <ul className="grid content-center gap-3 sm:grid-cols-2">
        {reasons.map(([title, text]) => <li key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:bg-white/[0.09]">
          <CheckCircle2 aria-hidden="true" className="size-6 text-emerald-300" />
          <p className="mt-3 text-[16px] font-bold">{title}</p>
          <p className="mt-1 text-sm leading-6 text-white/65">{text}</p>
        </li>)}
      </ul>
    </div>
  </section>;
}
