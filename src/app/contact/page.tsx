import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaRedditAlien, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { PiEnvelopeSimpleDuotone, PiMapPinDuotone, PiPhoneDuotone, PiWhatsappLogoDuotone } from 'react-icons/pi';
import { BrandMark, Highlight } from '@/components/home/SectionHeading';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { contact, directions } from '@/lib/contactInfo';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Tinitiate AI Solutions about courses, MasterClasses, campus or corporate training, and partnerships.',
};

const social = [
  { href: 'https://www.linkedin.com/company/tinitiate-ai/', label: 'LinkedIn', icon: FaLinkedinIn },
  { href: 'https://www.youtube.com/channel/UCXVm8lbVkHOxEJ4XzggTeJw', label: 'YouTube', icon: FaYoutube },
  { href: 'https://x.com/TinitiateAI', label: 'X', icon: FaXTwitter },
  { href: 'https://www.facebook.com/profile.php?id=61589182754060', label: 'Facebook', icon: FaFacebookF },
  { href: 'https://www.instagram.com/tinitiate.ai/', label: 'Instagram', icon: FaInstagram },
  { href: 'https://www.reddit.com/user/tinitiate_ai/', label: 'Reddit', icon: FaRedditAlien },
];

const card = 'group flex items-start gap-4 rounded-[14px] border border-neutral-200 bg-surface p-5 transition-[box-shadow,border-color] duration-300 hover:border-accent/40 hover:shadow-[0_20px_44px_-30px_rgb(10_10_11/0.5)]';
const iconTile = 'grid size-12 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent';

export default function ContactPage() {
  return <section className="bg-subtle">
    <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-0 lg:pb-16 lg:pt-12">
      <div className="lg:col-start-1 lg:row-start-1">
        <h1 className="isolate text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-[3.4rem]">
          <BrandMark className="mr-[0.3em] inline-block h-[0.6em] w-auto -translate-y-[0.05em] align-baseline drop-shadow-[0_0_0.6px_rgb(10_10_11/0.45)]" />
          Get in <Highlight>touch.</Highlight>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-600">Questions about a course, a MasterClass, campus or corporate training, or a partnership? Send us a message and our team will get back to you.</p>

      </div>

      <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
        <div className="rounded-[18px] border border-neutral-200 bg-surface p-6 shadow-[0_1px_2px_rgb(10_10_11/0.05)] sm:p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink">Send us a message</h2>
          <p className="mt-1.5 text-[15px] text-neutral-500">We&apos;ll reply by email or call you at your preferred time.</p>
          <div className="mt-6"><EnquiryForm source="contact page" messageLabel="Your message" messagePlaceholder="How can we help?" /></div>
        </div>
      </div>

      <div className="lg:col-start-1 lg:row-start-2">
        <ul className="lg:mt-10 grid gap-4 sm:grid-cols-2">
          <li><a href={`mailto:${contact.email}`} className={card}>
            <span className={iconTile}><PiEnvelopeSimpleDuotone aria-hidden="true" className="size-7" /></span>
            <span className="min-w-0"><span className="block text-[13px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Email</span><span className="mt-1 block break-all text-[15px] font-semibold text-ink group-hover:text-accent">{contact.email}</span></span>
          </a></li>
          <li><a href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer" className={card}>
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><PiWhatsappLogoDuotone aria-hidden="true" className="size-7" /></span>
            <span><span className="block text-[13px] font-semibold uppercase tracking-[0.12em] text-neutral-400">WhatsApp</span><span className="mt-1 block text-[15px] font-semibold text-ink group-hover:text-emerald-600">{contact.whatsapp.label}</span></span>
          </a></li>
          <li className="sm:col-span-2"><div className={`${card} hover:border-neutral-200 hover:shadow-none`}>
            <span className={iconTile}><PiPhoneDuotone aria-hidden="true" className="size-7" /></span>
            <span className="min-w-0"><span className="block text-[13px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Phone</span>
              <span className="mt-1 flex flex-wrap gap-x-6 gap-y-1">{contact.phones.map(p => <a key={p.href} href={p.href} className="whitespace-nowrap text-[15px] text-neutral-700 hover:text-accent"><span className="font-semibold text-ink">{p.region}</span> {p.label}</a>)}</span>
            </span>
          </div></li>
        </ul>

        <h2 className="mt-12 text-[13px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Our offices</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {contact.offices.map(o => <li key={o.name} className="rounded-[14px] border border-neutral-200 bg-surface p-5">
            <div className="flex items-center gap-3"><span className={`${iconTile} size-10`}><PiMapPinDuotone aria-hidden="true" className="size-6" /></span>
              <div><p className="text-[15px] font-semibold text-ink">{o.name}</p><p className="text-sm text-neutral-500">{o.city}</p></div></div>
            <address className="mt-4 text-[15px] not-italic leading-6 text-neutral-600">{o.address}</address>
            <a href={directions(o.address)} target="_blank" rel="noopener noreferrer" className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">Get directions <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
          </li>)}
        </ul>

        <h2 className="mt-12 text-[13px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Follow us</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {social.map(({ href, label, icon: Icon }) => <li key={label}><a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Tinitiate AI Solutions on ${label}`} title={label} className="grid size-11 place-items-center rounded-full border border-neutral-200 bg-surface text-neutral-700 transition-colors hover:border-accent hover:bg-accent hover:text-white"><Icon aria-hidden="true" className="size-4" /></a></li>)}
        </ul>
      </div>

    </div>
  </section>;
}
