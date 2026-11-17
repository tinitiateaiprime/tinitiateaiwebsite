import type { IconType } from 'react-icons';
import {
  PiBriefcaseDuotone, PiBrowsersDuotone, PiBuildingsDuotone, PiChalkboardTeacherDuotone, PiChatsCircleDuotone, PiCloudArrowUpDuotone,
  PiCodeDuotone, PiCompassDuotone, PiFileTextDuotone, PiGraduationCapDuotone, PiPathDuotone, PiRocketLaunchDuotone, PiSparkleDuotone,
  PiStairsDuotone, PiTreeStructureDuotone,
} from 'react-icons/pi';
import { Highlight, SectionHeading } from '../SectionHeading';

/* Content from the kaushik-branch "Why Choose Us" section, grouped by what it gives a learner. */
type Reason = { title: string; text: string; icon: IconType };
const groups: { name: string; tagline: string; icon: IconType; color: string; soft: string; reasons: Reason[] }[] = [
  { name: 'Learning', tagline: 'Strong foundations, step by step', icon: PiGraduationCapDuotone, color: '#2f54eb', soft: '#eef2ff', reasons: [
    { title: 'Expert Faculty', text: 'Learn from mentors with real delivery experience, not just classroom theory.', icon: PiChalkboardTeacherDuotone },
    { title: 'Structured Path', text: 'Move from fundamentals to advanced work through a clear, role-mapped plan.', icon: PiPathDuotone },
    { title: 'Basics to Advanced Learning', text: 'Step-by-step learning paths from foundational concepts to advanced tech stacks and real use cases.', icon: PiStairsDuotone },
    { title: 'Hands-On Coding Exercises', text: 'Daily challenges and practice labs to build strong coding logic and practical development skills.', icon: PiCodeDuotone },
  ] },
  { name: 'Real experience', tagline: 'Work the way real teams work', icon: PiRocketLaunchDuotone, color: '#0f766e', soft: '#e6f6f3', reasons: [
    { title: 'Live Projects', text: 'Build real-world applications with mentorship support to strengthen your portfolio and confidence.', icon: PiBrowsersDuotone },
    { title: 'Business Domain Training', text: 'Understand how technology is used in banking, healthcare, logistics, and more.', icon: PiBuildingsDuotone },
    { title: 'Development Services', text: 'Custom web, Android, API, IoT, and backend solutions shaped for business needs.', icon: PiTreeStructureDuotone },
    { title: 'Data & Cloud Support', text: 'Practical help with AWS, Azure, data engineering, deployment, and testing workflows.', icon: PiCloudArrowUpDuotone },
  ] },
  { name: 'Career', tagline: 'Get ready for the job you want', icon: PiBriefcaseDuotone, color: '#c2410c', soft: '#fff1e6', reasons: [
    { title: 'IT Career Guidance', text: 'Personalized guidance from industry experts to align your goals with real-world roles in IT.', icon: PiCompassDuotone },
    { title: 'Resume Preparation', text: 'Get help crafting a standout, recruiter-friendly resume tailored for your desired job roles.', icon: PiFileTextDuotone },
    { title: 'Interview Preparation', text: 'HR tips and technical assessment practice to boost your readiness and confidence.', icon: PiChatsCircleDuotone },
    { title: 'Bonus Technologies', text: 'Get exposure to adjacent tools that make your profile stronger in interviews.', icon: PiSparkleDuotone },
  ] },
];

export function WhyChooseSection() {
  return <section aria-labelledby="why-title" className="border-t border-neutral-100 bg-white py-20 sm:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <SectionHeading id="why-title" title={<>Where real expertise meets <Highlight>your ambition.</Highlight></>}>
        Not just a training institute. A launchpad engineered for career breakthroughs.
      </SectionHeading>

      {/* Three rows: Learning, Real experience, Career — four reasons each. */}
      <div className="mt-12 space-y-4 sm:space-y-5">
        {groups.map(({ name, tagline, icon: GroupIcon, color, soft, reasons }) => <div key={name} className="grid gap-3 rounded-[26px] border border-neutral-200 bg-[#fafafa] p-3 sm:p-4 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-4">
          {/* Row label */}
          <div className="relative flex items-center gap-4 overflow-hidden rounded-[20px] p-4 lg:flex-col lg:items-start lg:justify-between lg:p-5" style={{ background: soft }}>
            <GroupIcon aria-hidden="true" className="pointer-events-none absolute -bottom-10 -right-10 hidden size-32 opacity-[0.07] lg:block" style={{ color }} />
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl shadow-[0_10px_24px_-12px_rgb(10_10_11/0.45)]" style={{ background: color }}>
              <GroupIcon aria-hidden="true" className="size-7 text-white" />
            </span>
            <div className="relative min-w-0">
              <h3 className="text-lg font-semibold tracking-[-0.02em] lg:text-xl" style={{ color }}>{name}</h3>
              <p className="mt-0.5 text-sm leading-5 text-neutral-600">{tagline}</p>
            </div>
            <span className="ml-auto text-xs font-medium text-neutral-500 sm:hidden">Swipe →</span>
          </div>
          {/* Reasons */}
          <ul className="-mx-3 flex snap-x snap-mandatory scroll-px-3 gap-3 overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
            {reasons.map(({ title, text, icon: Icon }) => <li key={title} className="group w-[78%] shrink-0 snap-start rounded-[20px] border border-neutral-200/80 bg-white p-5 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-30px_rgb(10_10_11/0.5)] sm:w-auto">
              <span className="grid size-12 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-105" style={{ background: soft, color }}>
                <Icon aria-hidden="true" className="size-7" />
              </span>
              <h4 className="mt-4 text-base font-semibold leading-snug text-ink">{title}</h4>
              <p className="mt-1.5 text-sm leading-6 text-neutral-500">{text}</p>
            </li>)}
          </ul>
        </div>)}
      </div>
    </div>
  </section>;
}
