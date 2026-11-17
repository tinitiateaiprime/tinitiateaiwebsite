import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight, CheckCircle2, Quote } from 'lucide-react';
import type { IconType } from 'react-icons';
import {
  PiBriefcaseDuotone, PiChalkboardTeacherDuotone, PiChartLineUpDuotone, PiCloudDuotone, PiGraduationCapDuotone, PiRobotDuotone,
  PiShieldCheckDuotone, PiSparkleDuotone, PiStackDuotone, PiTargetDuotone, PiTreeStructureDuotone, PiUsersThreeDuotone,
} from 'react-icons/pi';
import { BrandMark, Highlight, SectionHeading } from '@/components/home/SectionHeading';

export const metadata: Metadata = {
  title: 'About',
  description: 'Tinitiate AI Solutions: practical IT training, project mentoring, and technology consulting for learners, professionals, and growing teams.',
};

const expert = ['Free 1-on-1 career guidance', 'Course roadmap matched to your goal', 'Project and portfolio direction', 'Flexible batch timing support'];
const principles: { title: string; text: string; icon: IconType }[] = [
  { title: 'Execution', text: 'Every concept is tied to a task, checkpoint, and outcome.', icon: PiBriefcaseDuotone },
  { title: 'Clarity', text: 'Learners practice explaining decisions with professional confidence.', icon: PiUsersThreeDuotone },
  { title: 'Evidence', text: 'Finished work becomes proof for interviews, reviews, and portfolios.', icon: PiChartLineUpDuotone },
];
const paths: { title: string; note: string; text: string; href: string; icon: IconType }[] = [
  { title: 'AI Engineer', note: 'LLMs · RAG', text: 'Build AI apps with prompts, RAG, evaluation and guardrails.', href: '/masterclasses/ai/index.html', icon: PiSparkleDuotone },
  { title: 'Agentic AI Developer', note: 'Agents · MCP', text: 'Design agents that plan, use tools and get work done.', href: '/masterclasses/agentic-development/index.html', icon: PiRobotDuotone },
  { title: 'Cloud Engineer', note: 'AWS · Azure', text: 'Deploy, scale and secure real systems on both clouds.', href: '/courses/aws-beginner-course', icon: PiCloudDuotone },
  { title: 'Data Governance', note: 'Purview · Unity', text: 'Catalog, lineage and access policies for trusted data.', href: '/masterclasses/data-governence/index.html', icon: PiShieldCheckDuotone },
  { title: 'Full Stack Developer', note: 'React · APIs', text: 'Ship complete products, from interface to database.', href: '/masterclasses/full-stack/index.html', icon: PiStackDuotone },
];
const values: { title: string; text: string; icon: IconType }[] = [
  { title: 'Industry-grounded learning', text: 'Training designed around real workflows, tools, collaboration, and project execution.', icon: PiGraduationCapDuotone },
  { title: 'Professional mentorship', text: 'Guidance shaped by hands-on experience, not generic classroom instruction.', icon: PiChalkboardTeacherDuotone },
  { title: 'Structured delivery', text: 'Clarity, discipline, and technical depth so every engagement is dependable.', icon: PiTreeStructureDuotone },
  { title: 'Long-term growth', text: 'Learning that keeps improving outcomes for students, professionals, and teams.', icon: PiTargetDuotone },
];

export default function AboutPage() {
  return <>
    {/* Intro */}
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:pb-24 lg:pt-20">
        <div>
          <h1 className="isolate text-[2.7rem] font-semibold leading-[1.04] tracking-[-0.045em] text-ink sm:text-6xl">
            <BrandMark className="mr-[0.3em] inline-block h-[0.6em] w-auto -translate-y-[0.05em] align-baseline drop-shadow-[0_0_0.6px_rgb(10_10_11/0.45)]" />
            About <Highlight>Tinitiate</Highlight>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600 sm:text-xl sm:leading-9">Practical IT training, project mentoring, and technology consulting for learners, professionals, and growing teams.</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href="/request-callback" className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-accent pl-6 pr-5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-10px_rgb(47_84_235/0.7)] transition-colors hover:bg-[#2443c8]">
              Book 2 free sessions <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/courses" className="text-[15px] font-semibold text-ink underline decoration-neutral-300 underline-offset-4 hover:decoration-ink">Explore courses</Link>
          </div>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-[#071425] shadow-[0_40px_90px_-50px_rgb(10_10_11/0.55)]">
          <Image src="/images/banners/company.webp" alt="Technology services and training at Tinitiate AI Solutions" fill priority sizes="(min-width:1024px) 620px, 100vw" className="about-kenburns object-cover" />
          <div aria-hidden="true" className="about-sweep pointer-events-none absolute inset-y-0 -left-1/3 w-1/3" />
        </div>
      </div>
    </section>

    {/* Story + talk to an expert */}
    <section className="border-t border-neutral-100 bg-[#f7f8fa] py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14">
        <div>
          <h2 className="isolate text-[2rem] font-semibold leading-[1.12] tracking-[-0.04em] text-ink sm:text-[2.6rem]">Bridging industry demands and <Highlight>individual potential.</Highlight></h2>
          <div className="mt-7 space-y-5 text-[17px] leading-8 text-neutral-600">
            <p><strong className="font-semibold text-ink">Tinitiate AI Solutions</strong> is a leading training company, dedicated to empowering businesses with cutting-edge technology solutions and high-quality professional training. Our vision is to bridge the gap between industry demands and individual potential, helping learners and enterprises grow together.</p>
            <p>With a highly experienced team carrying years of deep expertise in IT services, database management, and cloud computing, we craft tailored solutions that meet the evolving demands of enterprises worldwide, from ambitious startups to established global corporations. Every engagement is backed by real-world experience and a passion for measurable outcomes.</p>
            <p>Our commitment goes beyond training. We partner with our learners through every step of their journey, delivering real-world skills, actionable insights, and the career momentum needed to thrive in today&apos;s rapidly changing digital landscape. <span className="font-medium text-ink">With Tinitiate AI Solutions, your next career breakthrough starts here.</span></p>
          </div>
        </div>
        <aside className="lg:self-start">
          <div className="relative overflow-hidden rounded-[28px] bg-ink p-7 text-white sm:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-accent/40 blur-3xl" />
            <p className="relative inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[13px] font-semibold"><span className="size-2 rounded-full bg-emerald-400" />Available now</p>
            <h3 className="relative mt-4 text-2xl font-semibold tracking-[-0.03em]">Talk to an Expert</h3>
            <p className="relative mt-2 text-[15px] leading-7 text-white/70">Get clear guidance on the right course, batch, and next step for your career goal.</p>
            <ul className="relative mt-6 space-y-3">{expert.map(e => <li key={e} className="flex gap-3 text-[15px] text-white/85"><CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#a5b8ff]" />{e}</li>)}</ul>
            <Link href="/request-callback" className="group relative mt-7 flex h-12 items-center justify-center gap-2 rounded-full bg-white text-[15px] font-semibold text-ink transition hover:bg-[#fff200]">Request a call back <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" /></Link>
            <p className="relative mt-3 text-center text-[13px] text-white/55">Our team responds within 24 hours.</p>
          </div>
        </aside>
      </div>

    </section>

    {/* CEO message */}
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="ceo-title" title={<>A message from <Highlight>our CEO</Highlight></>}>Why we train the way we do, and what we want every learner to leave with.</SectionHeading>
        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12">
          <figure className="overflow-hidden rounded-[28px] border border-neutral-200 bg-ink shadow-[0_40px_90px_-50px_rgb(10_10_11/0.5)]">
            <video controls playsInline preload="none" poster="/videos/tinitiate-ai-career-options-poster.webp" className="aspect-video w-full bg-black">
              <source src="/videos/tinitiate-ai-career-options.mp4" type="video/mp4" />
            </video>
            <figcaption className="flex items-center justify-between gap-4 px-5 py-4 text-white">
              <span className="text-[15px] font-semibold">STEM or Non-STEM career options</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold">5:54 guide</span>
            </figcaption>
          </figure>
          <div>
            <Quote aria-hidden="true" className="size-9 text-accent" />
            <blockquote className="mt-4 text-[1.6rem] font-semibold leading-snug tracking-[-0.03em] text-ink sm:text-[1.9rem]">Training should help learners think, communicate, and deliver like professionals.</blockquote>
            <p className="mt-5 text-[17px] leading-8 text-neutral-600">Tinitiate AI is built around practical depth, review habits, and the confidence to explain completed work. The goal is not a certificate alone; it is the ability to show evidence, discuss decisions, and handle real project expectations.</p>
            <ul className="mt-7 space-y-3">
              {principles.map(({ title, text, icon: Icon }) => <li key={title} className="flex gap-4 rounded-2xl border border-neutral-200 p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"><Icon aria-hidden="true" className="size-6" /></span>
                <div><p className="text-base font-semibold text-ink">{title}</p><p className="mt-0.5 text-sm leading-6 text-neutral-500">{text}</p></div>
              </li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* What we teach */}
    <section className="border-t border-neutral-100 bg-[#f7f8fa] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="paths-title" title={<>Five paths into <Highlight>tech careers.</Highlight></>}>Live, mentor-led tracks built around the skills companies are hiring for right now.</SectionHeading>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {paths.map(({ title, note, text, href, icon: Icon }) => <li key={title}>
            <a href={href} className="group flex h-full flex-col rounded-[22px] border border-neutral-200 bg-white p-6 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-32px_rgb(10_10_11/0.5)]">
              <span className="grid size-12 place-items-center rounded-2xl bg-accent text-white"><Icon aria-hidden="true" className="size-7" /></span>
              <p className="mt-5 text-lg font-semibold leading-snug tracking-[-0.02em] text-ink">{title}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-accent">{note}</p>
              <p className="mt-3 flex-1 text-sm leading-6 text-neutral-500">{text}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-ink">Explore <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
            </a>
          </li>)}
        </ul>
      </div>
    </section>

    {/* Mission & values */}
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <h2 className="isolate text-[2rem] font-semibold leading-[1.12] tracking-[-0.04em] text-ink sm:text-[2.6rem]">
            <BrandMark className="mr-[0.32em] inline-block h-[0.62em] w-auto -translate-y-[0.06em] align-baseline drop-shadow-[0_0_0.6px_rgb(10_10_11/0.45)]" />Our <Highlight>mission</Highlight>
          </h2>
          <p className="mt-6 text-xl leading-9 text-neutral-700">To enable individuals, students, and corporate teams to thrive in the digital world by delivering hands-on, real-time IT education, software development, and cloud-based engineering solutions.</p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {values.map(({ title, text, icon: Icon }) => <li key={title} className="rounded-[22px] border border-neutral-200 p-6">
            <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent"><Icon aria-hidden="true" className="size-7" /></span>
            <p className="mt-4 text-base font-semibold text-ink">{title}</p>
            <p className="mt-1.5 text-sm leading-6 text-neutral-500">{text}</p>
          </li>)}
        </ul>
      </div>
    </section>
  </>;
}
