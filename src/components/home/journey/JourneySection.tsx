import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { JourneyTrack } from './JourneyTrack';
import { SectionHeading } from '../SectionHeading';
import { BuildProjectsArt, JobReadyArt, LearnLiveArt, WorkExperienceArt } from './scenes';

const stops: { title: string; line: string; art: ReactNode }[] = [
  { title: 'Learn live', line: 'Small live classes with industry mentors.', art: <LearnLiveArt /> },
  { title: 'Build real projects', line: 'Work in sprints with Git, like a real tech team.', art: <BuildProjectsArt /> },
  { title: 'Work experience', line: 'Join live projects and ship with a team.', art: <WorkExperienceArt /> },
  { title: 'Get job-ready', line: 'A resume and portfolio that prove what you can do.', art: <JobReadyArt /> },
];

function Stop({ index, title, line, art }: { index: number; title: string; line: string; art: ReactNode }) {
  return <figure>
    <div className="hero-stage rounded-[16px] border border-neutral-200/80 px-2 py-3 sm:px-3 sm:py-4">{art}</div>
    <figcaption className="mt-5">
      <span className="font-mono text-sm font-medium text-accent">0{index + 1}</span>
      <span className="mt-1 block text-[1.4rem] font-semibold leading-tight tracking-[-0.03em] text-ink">{title}</span>
      <span className="mt-1.5 block text-[15px] leading-6 text-neutral-500">{line}</span>
    </figcaption>
  </figure>;
}

export function JourneySection() {
  return <section aria-labelledby="journey-title" className="bg-surface py-12 sm:py-16">
    <JourneyTrack
      header={<SectionHeading id="journey-title" title="What the next few months look like">Four stages, from your first live class to applying for jobs with work you can show.</SectionHeading>}
      stops={stops.map((stop, i) => <Stop key={stop.title} index={i} {...stop} />)}
      finale={<div>
        <p className="text-[1.8rem] font-semibold leading-[1.12] tracking-[-0.035em] text-ink sm:text-[2.2rem]">Your first job experience, before your first job.</p>
        <p className="mt-3 text-[15px] leading-6 text-neutral-500">Step one costs nothing: 2 live sessions with your mentor.</p>
        <Link href="/request-callback" className="group mt-6 inline-flex shrink-0 h-13 items-center gap-2.5 rounded-full bg-accent pl-7 pr-6 text-base font-semibold text-white shadow-[0_8px_24px_-10px_rgb(47_84_235/0.7)] transition-colors hover:bg-[#2443c8]">
          Book 2 free sessions
          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>}
    />
  </section>;
}
