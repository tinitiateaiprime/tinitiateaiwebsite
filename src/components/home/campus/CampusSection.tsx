'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { PiChatsCircleDuotone, PiClipboardTextDuotone, PiHandshakeDuotone, PiMapPinDuotone } from 'react-icons/pi';
import { cn } from '@/lib/cn';
import { Highlight, SectionHeading } from '../SectionHeading';

/* Campus placement visit — same layout and content as the kaushik-branch site. */
const NAVY = '#12345f', GOLD = '#c9a227', NIGHT = '#071425', MUTED = '#697b91';

const visit = {
  shortName: 'KITS Warangal',
  college: 'Kakatiya Institute of Technology & Science',
  location: 'Warangal, Telangana',
  description: 'TINITIATE visited KITS Warangal to meet graduating students, share real career pathways, and conduct a focused on-campus assessment bringing industry expectations and student potential into the same room.',
  moments: [
    { id: 'welcome', label: 'Institutional welcome', caption: 'A formal welcome marking the start of a meaningful campus partnership.', image: '/images/campus/kits-formal-welcome.webp', alt: 'TINITIATE representative receiving a formal welcome at KITS Warangal', position: 'center 43%', fit: 'cover' },
    { id: 'campus-day', label: 'A day on campus', caption: 'Student interaction, a panel conversation, and a formal welcome shown together.', image: '/images/campus/kits-day-on-campus.webp', alt: 'KITS Warangal students, a panel discussion, and a formal welcome during TINITIATE’s campus visit', position: 'center', fit: 'contain' },
  ],
};
const journey = [
  { title: 'Connect', detail: 'Career dialogue', icon: PiChatsCircleDuotone },
  { title: 'Assess', detail: 'Readiness check', icon: PiClipboardTextDuotone },
  { title: 'Collaborate', detail: 'Campus bridge', icon: PiHandshakeDuotone },
];
const CYCLE = 5200;

export function CampusSection() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const moment = visit.moments[active];

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hovered || !onScreen || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setTimeout(() => setActive(i => (i + 1) % visit.moments.length), CYCLE);
    return () => clearTimeout(timer);
  }, [active, hovered, onScreen]);

  return <section ref={root} aria-labelledby="campus-title" className="bg-[#f7fafc] px-4 py-12 sm:px-6 sm:py-14 md:px-10">
    <div className="mx-auto max-w-7xl">
      <SectionHeading id="campus-title" title={<>We bring industry <Highlight>to campus.</Highlight></>}>Career talks, readiness checks and real conversations with graduating students.</SectionHeading>

      <article className="mx-auto mt-8 grid overflow-hidden rounded-[1.6rem] border border-[#d8e2ee] bg-white shadow-[0_28px_86px_-64px_rgba(15,23,42,0.92)] lg:grid-cols-2">
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="flex items-center gap-4 border-b border-[#d8e2ee] pb-6">
            <div className="relative h-[104px] w-[94px] shrink-0 sm:h-[116px] sm:w-[104px]">
              <Image src="/images/campus/kits-mark.png" alt="KITS Warangal logo" fill sizes="104px" className="object-contain" />
            </div>
            <div className="min-w-0 border-l border-[#d8e2ee] pl-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: MUTED }}>Featured institution</p>
              <h3 className="mt-1 text-lg font-bold leading-tight sm:text-xl" style={{ color: NAVY }}>{visit.college}</h3>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium" style={{ color: MUTED }}>
                <PiMapPinDuotone aria-hidden="true" className="size-[18px]" style={{ color: GOLD }} />{visit.location}
              </p>
            </div>
          </div>

          <p className="mt-6 text-pretty text-[15px] leading-7 text-[#53677d] sm:text-base sm:leading-8">{visit.description}</p>

          <div className="mt-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: MUTED }}>The visit, end to end</p>
            <ol className="relative mt-4 grid grid-cols-3 gap-2">
              <span aria-hidden="true" className="absolute left-[16%] right-[16%] top-[28px] h-px" style={{ background: `linear-gradient(90deg, ${NAVY}40, ${GOLD}b3, #0f8f7059)` }} />
              {journey.map(({ title, detail, icon: Icon }) => <li key={title} className="relative min-w-0 text-center">
                <span className="relative z-10 mx-auto flex size-14 items-center justify-center rounded-full border-[3px] border-white text-white shadow-[0_5px_14px_rgba(18,52,95,0.2)]" style={{ background: NAVY }}>
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <p className="mt-2.5 text-sm font-bold sm:text-base" style={{ color: NAVY }}>{title}</p>
                <p className="mt-0.5 text-xs font-medium text-[#7b8da4] sm:text-[13px]">{detail}</p>
              </li>)}
            </ol>
          </div>
        </div>

        <figure onMouseEnter={() => { setHovered(true); setActive(1); }} onMouseLeave={() => setHovered(false)} className="relative flex flex-col overflow-hidden" style={{ background: NIGHT }}>
          <div className="relative aspect-video w-full shrink-0 overflow-hidden lg:aspect-auto lg:flex-1">
            {visit.moments.map((m, i) => {
              const on = i === active;
              return <div key={m.id} aria-hidden={!on} className={cn('absolute inset-0 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none', on ? 'scale-100 opacity-100' : 'pointer-events-none scale-[1.015] opacity-0')}>
                <Image src={m.image} alt="" aria-hidden="true" fill sizes="(min-width:1024px) 50vw, 100vw" style={{ objectPosition: m.position }} className="scale-110 object-cover opacity-30 blur-2xl" />
                <div aria-hidden="true" className="absolute inset-0" style={{ background: `${NIGHT}4d` }} />
                <Image src={m.image} alt={on ? m.alt : ''} fill sizes="(min-width:1024px) 50vw, 100vw" style={{ objectPosition: m.position }} className={m.fit === 'cover' ? 'object-cover' : 'object-contain'} />
              </div>;
            })}
            <div className="absolute left-4 top-4 rounded-full border border-white/20 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-lg backdrop-blur-md sm:left-5 sm:top-5" style={{ background: `${NIGHT}bf` }}>{visit.shortName}</div>
            <div className="absolute right-4 top-4 flex gap-1.5 sm:right-5 sm:top-5">
              {visit.moments.map((m, i) => <button key={m.id} type="button" onClick={() => setActive(i)} aria-label={`Show ${m.label}`} aria-current={i === active} className="grid size-6 place-items-center">
                <span className={cn('block h-2 rounded-full transition-all duration-300', i === active ? 'w-5' : 'w-2 bg-white/50')} style={i === active ? { background: GOLD } : undefined} />
              </button>)}
            </div>
          </div>
          <figcaption className="relative flex min-h-[112px] shrink-0 items-center border-t border-white/10 px-5 py-5 text-white sm:px-7" style={{ background: NIGHT }}>
            <div key={moment.id} className="hero-rise min-w-0 max-w-xl">
              <p aria-live="polite" className="text-lg font-bold leading-tight sm:text-xl">{moment.label}</p>
              <p className="mt-1 text-sm leading-6 text-slate-300 sm:text-[15px]">{moment.caption}</p>
            </div>
          </figcaption>
        </figure>
      </article>
    </div>
  </section>;
}
