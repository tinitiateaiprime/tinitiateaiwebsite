import type { CSSProperties } from 'react';
import { Briefcase, CalendarClock, Presentation, Rocket } from 'lucide-react';

/** Four colourful promises, overlapping the bottom of the hero. */
const tiles = [
  { title: 'Live mentor-led classes', text: 'Taught by people who have done the job.', icon: Presentation, from: '#2f54eb', to: '#6681ff' },
  { title: 'Real-time projects', text: 'Build a portfolio you can demo in interviews.', icon: Rocket, from: '#7c3aed', to: '#c026d3' },
  { title: 'Resume & interview prep', text: 'Mock rounds, LinkedIn and career guidance.', icon: Briefcase, from: '#f97316', to: '#ec4899' },
  { title: 'Weekday & weekend batches', text: 'Learn alongside college or a full-time job.', icon: CalendarClock, from: '#0d9488', to: '#0891b2' },
];

export function FeatureTiles() {
  return <section aria-label="What you get" className="relative z-10 -mt-14 px-4 sm:px-6">
    <ul className="mx-auto grid max-w-7xl gap-3 rounded-[22px] border border-neutral-200 bg-surface p-3 shadow-[0_30px_60px_-36px_rgb(10_10_11/0.45)] sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map(({ title, text, icon: Icon, from, to }) => <li key={title} className="flex items-start gap-4 rounded-2xl p-4 transition-colors hover:bg-subtle">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl text-white shadow-[0_10px_20px_-10px_var(--c)]" style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})`, '--c': from } as CSSProperties}>
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <span>
          <span className="block text-[16px] font-bold text-ink">{title}</span>
          <span className="mt-0.5 block text-sm leading-6 text-neutral-500">{text}</span>
        </span>
      </li>)}
    </ul>
  </section>;
}
