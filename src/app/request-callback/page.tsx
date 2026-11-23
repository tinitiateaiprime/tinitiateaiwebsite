import type { Metadata } from 'next';
import type { IconType } from 'react-icons';
import { PiChalkboardTeacherDuotone, PiCompassDuotone, PiEnvelopeSimpleDuotone, PiPhoneCallDuotone, PiPhoneDuotone, PiWhatsappLogoDuotone } from 'react-icons/pi';
import { BrandMark, Highlight } from '@/components/home/SectionHeading';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { contact } from '@/lib/contactInfo';

export const metadata: Metadata = {
  title: 'Book 2 Free Sessions',
  description: 'Book your 2 free live sessions with a Tinitiate AI mentor. Tell us your goal and a mentor will call you back within 24 hours.',
};

const steps: { title: string; text: string; icon: IconType }[] = [
  { title: 'We call you', text: 'A mentor calls at the time that suits you.', icon: PiPhoneCallDuotone },
  { title: 'Free career guidance', text: 'We understand your background and map the right path to your goal.', icon: PiCompassDuotone },
  { title: '2 free sessions', text: 'Meet your mentor and see how we teach before you decide.', icon: PiChalkboardTeacherDuotone },
];

export default async function CallbackPage({ searchParams }: { searchParams: Promise<{ course?: string | string[]; service?: string | string[] }> }) {
  const params = await searchParams;
  const raw = params.course ?? params.service;
  const course = (typeof raw === 'string' ? raw : '').trim().slice(0, 120);

  return <section className="bg-subtle">
    <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-0 lg:pb-16 lg:pt-12">
      <div className="lg:col-start-1 lg:row-start-1">
        <h1 className="isolate text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-[3.4rem]">
          <BrandMark className="mr-[0.3em] inline-block h-[0.6em] w-auto -translate-y-[0.05em] align-baseline drop-shadow-[0_0_0.6px_rgb(10_10_11/0.45)]" />
          Book your <Highlight>2 free sessions.</Highlight>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-600">Tell us what you want to learn. A mentor will call you, recommend the right path and set up your free sessions. No payment, no commitment.</p>
        {course && <p className="mt-6 inline-flex max-w-full items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-4 py-2 text-[15px] text-accent">
          <span className="font-medium text-neutral-600">You&apos;re asking about</span><span className="truncate font-semibold">{course}</span>
        </p>}

      </div>

      <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
        <div className="rounded-[18px] border border-neutral-200 bg-surface p-6 shadow-[0_1px_2px_rgb(10_10_11/0.05)] sm:p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink">Your details</h2>
          <p className="mt-1.5 text-[15px] text-neutral-500">Takes under a minute. We reply within 24 hours.</p>
          <div className="mt-6"><EnquiryForm course={course} source="request a callback page" submitLabel="Book my free sessions" messageLabel="Anything we should know" messagePlaceholder="Your background, goal or questions" /></div>
        </div>
      </div>

      <div className="lg:col-start-1 lg:row-start-2">
        <h2 className="lg:mt-10 text-[13px] font-semibold uppercase tracking-[0.12em] text-neutral-400">What happens next</h2>
        <ol className="relative mt-5 space-y-4">
          <span aria-hidden="true" className="absolute bottom-8 left-6 top-8 w-px bg-[linear-gradient(var(--color-accent)_0_50%,transparent_50%)] bg-[length:1px_10px]" />
          {steps.map(({ title, text, icon: Icon }, i) => <li key={title} className="relative flex gap-4 rounded-[14px] border border-neutral-200 bg-surface p-5">
            <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-white shadow-[0_10px_24px_-12px_rgb(47_84_235/0.8)]"><Icon aria-hidden="true" className="size-7" /></span>
            <div><p className="text-[13px] font-semibold text-accent">Step {i + 1}</p><p className="text-lg font-semibold tracking-[-0.01em] text-ink">{title}</p><p className="mt-1 text-[15px] leading-6 text-neutral-500">{text}</p></div>
          </li>)}
        </ol>

        <h2 className="mt-10 text-[13px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Prefer to reach us now?</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <a href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-surface px-3 py-3.5 text-[15px] font-semibold text-ink transition hover:border-emerald-500 hover:text-emerald-600"><PiWhatsappLogoDuotone aria-hidden="true" className="size-5" />WhatsApp</a>
          <a href={contact.phones[0].href} className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-surface px-3 py-3.5 text-[15px] font-semibold text-ink transition hover:border-accent hover:text-accent"><PiPhoneDuotone aria-hidden="true" className="size-5" />Call us</a>
          <a href={`mailto:${contact.email}`} className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-surface px-3 py-3.5 text-[15px] font-semibold text-ink transition hover:border-accent hover:text-accent"><PiEnvelopeSimpleDuotone aria-hidden="true" className="size-5" />Email</a>
        </div>
      </div>

    </div>
  </section>;
}
