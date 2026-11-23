import { Mail, MessageCircle, Phone } from 'lucide-react';
import { HandNote, SectionHeading } from '../SectionHeading';
import { FaqAccordion, type Faq } from './FaqAccordion';
import { EnquiryForm } from '@/components/forms/EnquiryForm';

/* Answers follow the kaushik-branch knowledge base; no promises we can't keep. */
const faqs: Faq[] = [
  { q: 'Can I join if I’m new to IT or from a non-IT background?', a: 'Yes. Our beginner tracks start from the fundamentals and move step by step, so you don’t need any coding experience. A mentor will suggest the right starting point for you.' },
  { q: 'Which path should I choose?', a: 'Tell us your background, your goal and how much time you have each week. A mentor will recommend the right track, whether that’s AI, Agentic AI, Cloud, Data Governance or Full Stack.' },
  { q: 'Are the classes online?', a: 'Classes are live and mentor-led, so you can learn from anywhere and ask questions in real time. Ask us about hybrid options if you prefer to learn in person.' },
  { q: 'Can I learn alongside college or a job?', a: 'Yes. We run weekday and weekend batches with flexible timings, and recordings and revision support help you catch up if you miss a class.' },
  { q: 'How long does a course take?', a: 'Foundation courses usually take 2 to 3 months, and full-stack or advanced tracks take 4 to 6 months. The exact duration depends on the track and your pace.' },
  { q: 'What do I need to get started?', a: 'A basic laptop and an internet connection are enough. We help you set up all the tools you need in the first sessions.' },
  { q: 'How do the 2 free sessions work?', a: 'You can attend 2 sessions before you decide. It’s the best way to see how we teach, meet your mentor and make sure the track fits you.' },
  { q: 'Do you guarantee a job?', a: 'No honest institute can guarantee a job. What we do is make you job-ready: real projects for your portfolio, a strong resume, interview practice and career guidance from industry mentors.' },
];

export function FaqSection() {
  return <section aria-labelledby="faq-title" className="bg-surface py-14 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <SectionHeading id="faq-title" title="Questions people ask before joining">
        Can&apos;t find yours? Send it below. A mentor reads every message and calls you back.
      </SectionHeading>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
        <FaqAccordion faqs={faqs} />

        <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <div className="rounded-[18px] border border-neutral-200 bg-surface p-6 shadow-[0_1px_2px_rgb(10_10_11/0.05)] sm:p-8">
            <p className="text-2xl font-semibold tracking-[-0.03em] text-ink">Talk to a mentor</p>
            <p className="mt-1.5 text-[15px] text-neutral-500">Get a free career call and your 2 free sessions.</p>
            <HandNote arrow="down" className="mt-3">a real person calls you, not a bot</HandNote>
            <div className="mt-6"><EnquiryForm source="homepage FAQ form" /></div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <a href="https://wa.me/916309123485" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-surface px-3 py-3 text-sm font-semibold text-ink transition hover:border-emerald-500 hover:text-emerald-600"><MessageCircle aria-hidden="true" className="size-4" />WhatsApp</a>
            <a href="tel:+916309123485" className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-surface px-3 py-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"><Phone aria-hidden="true" className="size-4" />Call us</a>
            <a href="mailto:contact@tinitiateai.com" className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-surface px-3 py-3 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"><Mail aria-hidden="true" className="size-4" />Email</a>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
