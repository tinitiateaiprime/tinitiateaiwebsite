'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PiWhatsappLogoDuotone } from 'react-icons/pi';
import { contact } from '@/lib/contactInfo';

/** Pages that already are the form: no extra prompts there. */
const FORM_PAGES = ['/request-callback', '/contact'];
const isFormPage = (path: string) => FORM_PAGES.some(p => path === p || path.startsWith(p + '/'));

/** Closing prompt shown above the footer on every page, so no page is a dead end. */
export function CtaBand() {
  const pathname = usePathname();
  // The homepage already ends with the FAQ + enquiry form.
  if (isFormPage(pathname) || pathname === '/') return null;
  return <section aria-labelledby="cta-band-title" className="bg-white px-4 py-10 sm:px-6 sm:py-12">
    <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-ink px-6 py-10 text-white sm:px-10 sm:py-11">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-accent/50 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-[#fff200]/10 blur-3xl" />
      <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_auto]">
        <div>
          <h2 id="cta-band-title" className="text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.04em] sm:text-[2.6rem]">Not sure where to start? Talk to a mentor.</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">Tell us your background and goal. We&apos;ll recommend the right path and set up your 2 free sessions.</p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-white/80">
            {['Free career call', 'No payment to start', 'Reply within 24 hours'].map(t => <li key={t} className="flex items-center gap-2"><CheckCircle2 aria-hidden="true" className="size-4 text-[#a5b8ff]" />{t}</li>)}
          </ul>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link href="/request-callback" className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-white px-7 text-base font-semibold text-ink transition-colors hover:bg-[#fff200]">
            Book 2 free sessions <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer" className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-white/20 px-7 text-base font-semibold text-white transition-colors hover:bg-white/10">
            <PiWhatsappLogoDuotone aria-hidden="true" className="size-5" />Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>;
}

/** Phones: the main action stays one tap away while scrolling. */
export function MobileCtaBar() {
  const pathname = usePathname();
  if (isFormPage(pathname)) return null;
  return <>
    <div aria-hidden="true" className="h-[76px] lg:hidden" />
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-xl gap-2">
        <Link href="/request-callback" className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent text-[15px] font-semibold text-white">
          Book 2 free sessions <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
        <a href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" className="grid size-12 shrink-0 place-items-center rounded-full border border-neutral-200 text-emerald-600">
          <PiWhatsappLogoDuotone aria-hidden="true" className="size-6" />
        </a>
      </div>
    </div>
  </>;
}
