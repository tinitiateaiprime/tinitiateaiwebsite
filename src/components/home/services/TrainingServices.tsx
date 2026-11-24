import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/** How we train, as photo cards. The pictures are dark on the left, so the text sits there. */
const services = [
  { title: 'Live Online Training', text: 'Small interactive classes with a mentor, from anywhere.', img: 'online-training', href: '/courses' },
  { title: 'Weekend Batches', text: 'Saturday and Sunday classes for working professionals.', img: 'weekend-training', href: '/request-callback?course=Weekend%20batch' },
  { title: 'Real-Time Projects', text: 'Build working apps the way real tech teams do.', img: 'real-time-projects', href: '/paths' },
  { title: 'Internships', text: 'Project-based internships that count as experience.', img: 'internships', href: '/request-callback?course=Internship' },
  { title: 'Workshops', text: 'Focused sessions and free MasterClasses on new tools.', img: 'workshops', href: '/masterclasses' },
  { title: 'Placement Assistance', text: 'Resume, LinkedIn, mock interviews and job guidance.', img: 'job-assistance', href: '/request-callback?course=Placement%20assistance' },
];

export function TrainingServices() {
  return <section aria-labelledby="services-title" className="bg-subtle py-16 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">From basics to advanced</p>
        <h2 id="services-title" className="mt-2 text-[2.1rem] font-bold leading-tight tracking-[-0.035em] text-ink sm:text-[2.7rem]">Our <span className="bg-[linear-gradient(100deg,#f97316,#ec4899)] bg-clip-text text-transparent">Training</span> Services</h2>
        <p className="mt-3 text-base leading-7 text-neutral-600 sm:text-lg">Online, weekend and project-based training, with career support until you are interview-ready.</p>
      </div>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(s => <li key={s.title}>
          <Link href={s.href} className="group relative flex aspect-[16/10] flex-col justify-end overflow-hidden rounded-[20px] bg-[#0b1640] p-6 text-white shadow-[0_24px_50px_-34px_rgb(10_10_11/0.7)]">
            <Image src={`/images/training/${s.img}.png`} alt="" fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover object-[80%_50%] transition-transform duration-700 group-hover:scale-105" />
            <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgb(8_12_40/0.95)_5%,rgb(8_12_40/0.55)_45%,transparent_80%)]" />
            <span className="relative">
              <span className="block text-xl font-bold tracking-[-0.02em]">{s.title}</span>
              <span className="mt-1 block text-[15px] leading-6 text-white/75">{s.text}</span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#fff200]">Learn more <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" /></span>
            </span>
          </Link>
        </li>)}
      </ul>
    </div>
  </section>;
}
