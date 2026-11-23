import type { IconType } from 'react-icons';
import { PiBriefcaseDuotone, PiCalendarCheckDuotone, PiChalkboardTeacherDuotone, PiCodeDuotone, PiPlantDuotone } from 'react-icons/pi';

/** The basics a visitor checks first, stated plainly right under the hero. */
const facts: { title: string; text: string; icon: IconType }[] = [
  { title: 'Live & mentor-led', text: 'Ask questions in real time', icon: PiChalkboardTeacherDuotone },
  { title: 'Beginners welcome', text: 'No coding background needed', icon: PiPlantDuotone },
  { title: 'Real projects', text: 'Portfolio work, team sprints', icon: PiCodeDuotone },
  { title: 'Interview prep', text: 'Resume, mock rounds, guidance', icon: PiBriefcaseDuotone },
  { title: 'Flexible batches', text: 'Weekday & weekend timings', icon: PiCalendarCheckDuotone },
];

export function TrustStrip() {
  return <section aria-label="What you get" className="border-y border-neutral-100 bg-white">
    <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-6 sm:grid-cols-3 sm:px-6 lg:grid-cols-5">
      {facts.map(({ title, text, icon: Icon }) => <li key={title} className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent"><Icon aria-hidden="true" className="size-6" /></span>
        <span className="min-w-0"><span className="block text-[15px] font-semibold text-ink">{title}</span><span className="block text-[13px] leading-5 text-neutral-500">{text}</span></span>
      </li>)}
    </ul>
  </section>;
}
