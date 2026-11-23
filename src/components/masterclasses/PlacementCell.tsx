import type { IconType } from 'react-icons';
import { ArrowUpRight } from 'lucide-react';
import {
  PiBriefcaseDuotone, PiCalculatorDuotone, PiCalendarCheckDuotone, PiChatsCircleDuotone, PiEnvelopeOpenDuotone, PiEnvelopeSimpleDuotone,
  PiFileTextDuotone, PiHandshakeDuotone, PiIdentificationBadgeDuotone, PiMagnifyingGlassDuotone, PiMegaphoneDuotone, PiMicrophoneStageDuotone,
  PiPaperPlaneTiltDuotone, PiSmileyDuotone, PiTrophyDuotone, PiUsersThreeDuotone,
} from 'react-icons/pi';

const base = '/masterclasses/placement-assistance';

/* The "Resume to Offer Letter" placement MasterClass: 15 guides in 4 phases. */
const phases: { title: string; tagline: string; guides: { name: string; href: string; icon: IconType }[] }[] = [
  { title: 'Get Ready', tagline: 'Build the profile that gets you noticed', guides: [
    { name: 'Resume Prep', href: `${base}/resume-prep.html`, icon: PiFileTextDuotone },
    { name: 'Cover Letters', href: `${base}/cover-letters.html`, icon: PiEnvelopeSimpleDuotone },
    { name: 'LinkedIn & Naukri Profile', href: `${base}/linkedin-naukri.html`, icon: PiIdentificationBadgeDuotone },
    { name: 'Communication Skills', href: `${base}/communication-skills.html`, icon: PiMegaphoneDuotone },
    { name: 'Confidence & Mindset', href: `${base}/confidence-mindset.html`, icon: PiSmileyDuotone },
  ] },
  { title: 'Get Shortlisted', tagline: 'Apply smart and clear the tests', guides: [
    { name: 'Job Applications', href: `${base}/job-applications.html`, icon: PiPaperPlaneTiltDuotone },
    { name: 'Off-Campus Job Hunt', href: `${base}/off-campus-jobs.html`, icon: PiMagnifyingGlassDuotone },
    { name: 'Aptitude & Coding Rounds', href: `${base}/aptitude-coding.html`, icon: PiCalculatorDuotone },
  ] },
  { title: 'Crack the Interview', tagline: 'Walk in prepared, walk out confident', guides: [
    { name: 'Interview Prep', href: `${base}/interview-prep.html`, icon: PiMicrophoneStageDuotone },
    { name: 'Group Discussion', href: `${base}/group-discussion.html`, icon: PiUsersThreeDuotone },
    { name: 'Before the Interview', href: `${base}/before-interview.html`, icon: PiCalendarCheckDuotone },
    { name: 'During the Interview', href: `${base}/during-interview.html`, icon: PiChatsCircleDuotone },
    { name: 'HR Round & Salary Talk', href: `${base}/hr-round-salary.html`, icon: PiHandshakeDuotone },
  ] },
  { title: 'Win the Offer', tagline: 'Close strong and stand out', guides: [
    { name: 'After the Interview', href: `${base}/after-interview.html`, icon: PiEnvelopeOpenDuotone },
    { name: 'Handling Competition', href: `${base}/handling-competition.html`, icon: PiTrophyDuotone },
  ] },
];
const total = phases.reduce((n, p) => n + p.guides.length, 0);

/** Placement Cell card for the MasterClasses page: the four phases as columns of guides. */
export function PlacementCell() {
  return <section aria-labelledby="placement-cell" className="overflow-hidden rounded-2xl border border-slate-200 bg-surface shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-amber-100 bg-amber-50/70 px-4 py-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-500 text-white"><PiBriefcaseDuotone aria-hidden="true" className="size-6" /></span>
        <div className="min-w-0">
          <h2 id="placement-cell" className="text-base font-extrabold tracking-wide text-amber-800 sm:text-lg">JOB READINESS &amp; PLACEMENT ASSISTANCE</h2>
          <p className="text-sm text-slate-600">From resume to offer letter · {total} step-by-step guides for freshers</p>
        </div>
      </div>
      <a href={`${base}/index.html`} className="group inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-amber-800 ring-1 ring-amber-200 transition hover:bg-amber-500 hover:text-white hover:ring-amber-500">
        Open the placement guide <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>

    <ol className="grid gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-4">
      {phases.map((phase, i) => <li key={phase.title} className="flex flex-col bg-surface px-2 pb-3 pt-4 sm:px-3">
        <div className="flex items-start gap-3 px-3 pb-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-amber-500 text-xs font-bold text-white">{i + 1}</span>
          <div className="min-w-0"><h3 className="text-[15px] font-bold leading-snug text-slate-900">{phase.title}</h3><p className="mt-0.5 text-xs leading-5 text-slate-500">{phase.tagline}</p></div>
        </div>
        <nav aria-label={`${phase.title} guides`} className="flex flex-col gap-0.5">
          {phase.guides.map(({ name, href, icon: Icon }) => <a key={href} href={href}
            className="group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-slate-800 outline-offset-2 transition hover:bg-amber-50 focus-visible:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-700 ring-1 ring-amber-100 group-hover:bg-surface"><Icon aria-hidden="true" className="size-5" /></span>
            <span className="min-w-0 flex-1 text-sm font-semibold leading-5">{name}</span>
            <span aria-hidden="true" className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-amber-700">›</span>
          </a>)}
        </nav>
      </li>)}
    </ol>
  </section>;
}
