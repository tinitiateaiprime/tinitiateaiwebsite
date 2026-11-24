import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { courses } from '@/lib/courses';
import { categories, courseCategory } from '@/lib/courseDetails';
import { toolIcon } from '@/data/paths';

const look: Record<string, { icons: string[]; bg: string }> = {
  ai: { icons: ['openai', 'claude', 'huggingface'], bg: 'from-violet-500/15 to-fuchsia-500/10' },
  data: { icons: ['spark', 'databricks', 'snowflake'], bg: 'from-teal-500/15 to-cyan-500/10' },
  cloud: { icons: ['aws', 'azure', 'docker'], bg: 'from-sky-500/15 to-blue-500/10' },
  web: { icons: ['react', 'nodejs', 'java'], bg: 'from-orange-500/15 to-pink-500/10' },
  'data-bi': { icons: ['postgresql', 'mysql', 'power-bi'], bg: 'from-amber-500/15 to-red-500/10' },
  programming: { icons: ['python', 'java', 'git'], bg: 'from-indigo-500/15 to-blue-500/10' },
};

/** "Browse by domain": each tile opens the course list filtered to that category. */
export function DomainsSection() {
  const count = (id: string) => courses.filter(c => courseCategory(c) === id).length;
  return <section aria-labelledby="domains-title" className="bg-surface py-16 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 id="domains-title" className="text-[2.1rem] font-bold leading-tight tracking-[-0.035em] text-ink sm:text-[2.7rem]">Browse by <span className="bg-[linear-gradient(100deg,#0d9488,#2f54eb)] bg-clip-text text-transparent">Domains</span></h2>
        <p className="mt-3 text-base leading-7 text-neutral-600 sm:text-lg">Pick an area to see every live course in it.</p>
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(cat => {
          const { icons, bg } = look[cat.id];
          return <li key={cat.id}>
            <Link href={`/courses?category=${cat.id}`} className={`group flex items-center gap-5 rounded-[20px] border border-neutral-200 bg-gradient-to-br ${bg} p-5 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-32px_rgb(10_10_11/0.5)]`}>
              <span className="light-island grid size-16 shrink-0 grid-cols-2 place-items-center gap-0.5 rounded-2xl bg-white p-2 shadow-sm">
                {icons.map((ic, i) => (
                  // eslint-disable-next-line @next/next/no-img-element -- tiny local SVG logos
                  <img key={ic} src={toolIcon(ic)} alt="" width={20} height={20} className={i === 2 ? 'col-span-2 size-5 object-contain' : 'size-5 object-contain'} />
                ))}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold text-ink group-hover:text-accent">{cat.label}</span>
                <span className="block text-sm text-neutral-500">{count(cat.id)} courses</span>
              </span>
              <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </Link>
          </li>;
        })}
      </ul>
    </div>
  </section>;
}
