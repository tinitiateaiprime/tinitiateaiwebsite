import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaRedditAlien, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { PiEnvelopeSimpleDuotone, PiMapPinDuotone, PiPhoneDuotone } from 'react-icons/pi';
import { paths as careerPaths } from '@/data/paths';
import { Logo } from '@/components/Logo';

const explore = [
  { href: '/request-callback', label: 'Book 2 free sessions' },
  { href: '/paths', label: 'Compare career paths' },
  { href: '/courses', label: 'Live Courses' },
  { href: '/masterclasses', label: 'Free MasterClasses' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];
const pathLinks = careerPaths.map(p => ({ href: `/paths/${p.id}`, label: p.label }));
const policies = [
  { href: '/privacy-policy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/refund-policy', label: 'Refunds' },
  { href: '/cookie-policy', label: 'Cookies' },
  { href: '/pricing-policy', label: 'Pricing policy' },
];
const social = [
  { href: 'https://www.linkedin.com/company/tinitiate-ai/', label: 'LinkedIn', icon: FaLinkedinIn },
  { href: 'https://www.youtube.com/channel/UCXVm8lbVkHOxEJ4XzggTeJw', label: 'YouTube', icon: FaYoutube },
  { href: 'https://x.com/TinitiateAI', label: 'X', icon: FaXTwitter },
  { href: 'https://www.facebook.com/profile.php?id=61589182754060', label: 'Facebook', icon: FaFacebookF },
  { href: 'https://www.instagram.com/tinitiate.ai/', label: 'Instagram', icon: FaInstagram },
  { href: 'https://www.reddit.com/user/tinitiate_ai/', label: 'Reddit', icon: FaRedditAlien },
];

const heading = 'text-[13px] font-semibold uppercase tracking-[0.14em] text-neutral-400';
const link = 'text-[15px] text-neutral-700 transition-colors hover:text-accent';

export function SiteFooter() {
  return <footer className="border-t border-neutral-200 bg-subtle">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* Columns */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-[1.4fr_0.7fr_1fr_1.25fr] lg:gap-12">
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" aria-label="Tinitiate AI homepage" className="inline-block">
            <Logo className="w-[230px] sm:w-[250px]" />
          </Link>
          <p className="mt-6 max-w-sm text-[15px] leading-7 text-neutral-600">Tinitiate AI Solutions empowers learners with industry-relevant skills through hands-on training and real-time project experience in AI, Data Engineering, and Cloud.</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Follow us">
            {social.map(({ href, label, icon: Icon }) => <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Tinitiate AI Solutions on ${label}`} title={label}
                className="grid size-10 place-items-center rounded-full border border-neutral-200 bg-surface text-neutral-700 transition-colors hover:border-accent hover:bg-accent hover:text-white">
                <Icon aria-hidden="true" className="size-4" />
              </a>
            </li>)}
          </ul>
        </div>

        <nav aria-label="Explore">
          <h2 className={heading}>Explore</h2>
          <ul className="mt-5 space-y-3">{explore.map(l => <li key={l.href}><Link href={l.href} className={link}>{l.label}</Link></li>)}</ul>
        </nav>

        <nav aria-label="Career paths">
          <h2 className={heading}>Career paths</h2>
          <ul className="mt-5 space-y-3">{pathLinks.map(l => <li key={l.href}><Link href={l.href} className={link}>{l.label}</Link></li>)}</ul>
        </nav>

        <div className="col-span-2 lg:col-span-1">
          <h2 className={heading}>Contact &amp; office</h2>
          <ul className="mt-5 space-y-5 text-[15px] leading-6 text-neutral-700">
            <li className="flex gap-3"><PiEnvelopeSimpleDuotone aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" /><a href="mailto:contact@tinitiateai.com" className="break-all font-medium text-ink hover:text-accent">contact@tinitiateai.com</a></li>
            <li className="flex gap-3"><PiPhoneDuotone aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
              <div><p><span className="font-semibold text-ink">India</span> <a href="tel:+916309123485" className="whitespace-nowrap hover:text-accent">+91 6309123485</a></p>
                <p className="mt-1"><span className="font-semibold text-ink">USA</span> <a href="tel:+19736536870" className="whitespace-nowrap hover:text-accent">+1 (973) 653-6870</a></p>
                <p className="mt-1 pl-[2.35rem]"><a href="tel:+12068024102" className="whitespace-nowrap hover:text-accent">+1 (206) 802-4102</a></p></div>
            </li>
            <li className="flex gap-3"><PiMapPinDuotone aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
              <div className="space-y-3">
                <address className="not-italic"><span className="font-semibold text-ink">Corporate office</span><br />1-2/10 SBH Colony, Mohan Nagar, Kothapet, Telangana 500036, India</address>
                <address className="not-italic"><span className="font-semibold text-ink">US office</span><br />1420 Valley Trl, Irving, TX 75063, USA</address>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="border-t border-neutral-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-neutral-500 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Tinitiate AI Solutions. All rights reserved.</p>
        <nav aria-label="Policies" className="flex flex-wrap gap-x-5 gap-y-2">{policies.map(p => <Link key={p.href} href={p.href} className="hover:text-ink">{p.label}</Link>)}</nav>
      </div>
    </div>
  </footer>;
}
