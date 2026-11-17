import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { JourneyTrack } from './JourneyTrack';
import { Highlight, SectionHeading } from '../SectionHeading';
import { BuildProjectsArt, JobReadyArt, LearnLiveArt, WorkExperienceArt } from './scenes';

const stops: { title: string; line: string; art: ReactNode }[] = [
  { title: 'Learn live', line: 'Small live classes with industry mentors.', art: <LearnLiveArt /> },
  { title: 'Build real projects', line: 'Work in sprints with Git, like a real tech team.', art: <BuildProjectsArt /> },
  { title: 'Work experience', line: 'Join live projects and ship with a team.', art: <WorkExperienceArt /> },
  { title: 'Get job-ready', line: 'A resume and portfolio that prove what you can do.', art: <JobReadyArt /> },
];

function Stop({ index, title, line, art }: { index: number; title: string; line: string; art: ReactNode }) {
  return <figure>
    <div className="hero-stage rounded-[24px] border border-neutral-200/80 px-2 py-4 sm:rounded-[28px] sm:px-5 sm:py-6">{art}</div>
    <figcaption className="mt-5">
      <span className="font-mono text-sm font-medium text-accent">0{index + 1}</span>
      <span className="mt-1 block text-[1.6rem] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-3xl">{title}</span>
      <span className="mt-1.5 block text-base text-neutral-500 sm:text-lg">{line}</span>
    </figcaption>
  </figure>;
}

export function JourneySection() {
  return <section aria-labelledby="journey-title" className="border-t border-neutral-100 bg-white py-20 lg:py-0">
    <JourneyTrack
      header={<SectionHeading id="journey-title" title={<>From classroom to <Highlight>codebase.</Highlight></>}>Four steps that take you from your first class to real work.</SectionHeading>}
      stops={stops.map((stop, i) => <Stop key={stop.title} index={i} {...stop} />)}
      finale={<div>
        <p className="text-[2rem] font-semibold leading-[1.1] tracking-[-0.035em] text-ink sm:text-[2.6rem]">Your first job experience, before your first job.</p>
        <Link href="/request-callback" className="group mt-8 inline-flex h-13 items-center gap-2.5 rounded-full bg-accent pl-7 pr-6 text-base font-semibold text-white shadow-[0_8px_24px_-10px_rgb(47_84_235/0.7)] transition-colors hover:bg-[#2443c8]">
          Book 2 free sessions
          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>}
    />
  </section>;
}
