import { SectionHeading } from '../SectionHeading';

/* Content from the kaushik-branch "Why Choose Us" section, written as plain numbered lists instead of icon cards. */
const groups: { name: string; line: string; reasons: [string, string][] }[] = [
  { name: 'Learning', line: 'Strong foundations, step by step', reasons: [
    ['Mentors who have done the job', 'People with real delivery experience, not just classroom theory.'],
    ['A path mapped to a role', 'Fundamentals first, then the advanced work, in an order that makes sense.'],
    ['Practice every day', 'Short coding challenges and labs so the logic sticks.'],
  ] },
  { name: 'Real experience', line: 'Work the way real teams work', reasons: [
    ['Live projects', 'Build working applications with a mentor reviewing your progress.'],
    ['Team workflows', 'Sprints and Git, the way tech teams actually build and ship.'],
    ['Business context', 'How the same tech is used in banking, healthcare and logistics.'],
  ] },
  { name: 'Career', line: 'Get ready for the job you want', reasons: [
    ['Career guidance', 'Honest advice on which roles fit your background and goals.'],
    ['Resume and LinkedIn', 'A recruiter-friendly profile built around your projects.'],
    ['Interview practice', 'Technical rounds and HR conversations, rehearsed before the real thing.'],
  ] },
];

export function WhyChooseSection() {
  return <section aria-labelledby="why-title" className="section-dark py-14 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <SectionHeading id="why-title" title="What you get besides the classes">
        Teaching is half of it. The rest is practice, real project work and help getting hired.
      </SectionHeading>
      <div className="mt-10 grid gap-x-10 gap-y-12 border-t border-neutral-200 pt-10 md:grid-cols-3">
        {groups.map(({ name, line, reasons }, g) => <div key={name}>
          <p className="font-mono text-sm text-accent">0{g + 1}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink">{name}</h3>
          <p className="mt-1 text-[15px] text-neutral-500">{line}</p>
          <ol className="mt-6 space-y-5">
            {reasons.map(([title, text]) => <li key={title} className="border-l-2 border-neutral-200 pl-4">
              <p className="text-[16px] font-semibold text-ink">{title}</p>
              <p className="mt-1 text-[15px] leading-6 text-neutral-500">{text}</p>
            </li>)}
          </ol>
        </div>)}
      </div>
    </div>
  </section>;
}
