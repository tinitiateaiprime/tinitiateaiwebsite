import { Check } from 'lucide-react';

/** The basics a visitor checks first, stated plainly right under the hero. */
const facts = ['Live, mentor-led classes', 'Beginners welcome', 'Real portfolio projects', 'Resume and interview prep', 'Weekday & weekend batches'];

export function TrustStrip() {
  return <section aria-label="What you get" className="border-y border-neutral-200 bg-subtle">
    <ul className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-5 sm:px-6 lg:justify-between">
      {facts.map(f => <li key={f} className="flex items-center gap-2 text-[15px] font-medium text-neutral-700"><Check aria-hidden="true" className="size-4 shrink-0 text-accent" strokeWidth={3} />{f}</li>)}
    </ul>
  </section>;
}
