import Link from 'next/link'
import type { SiteSetting } from '@/payload-types'

type Office = {
  label: string
  address: string
}

function parseOffices(address?: string | null): Office[] {
  if (!address?.trim()) return []

  return address
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const separator = line.indexOf(':')

      if (separator === -1) {
        return {
          label:
            index === 0
              ? 'Corporate Office'
              : `Office ${index + 1}`,
          address: line,
        }
      }

      return {
        label: line.slice(0, separator).trim(),
        address: line.slice(separator + 1).trim(),
      }
    })
    .filter((office) => office.address)
}

function googleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address,
  )}`
}

export function Footer({ settings }: { settings: SiteSetting }) {
  const offices = parseOffices(settings.address)

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-8">
        <nav aria-label="Explore Tinitiate" className="mb-10 flex flex-wrap gap-x-6 gap-y-3 border-b border-slate-800 pb-8 text-sm">
          <Link href="/training">Training Programs</Link><Link href="/training/corporate-training">Corporate Training</Link><Link href="/work-experience-program">Work Experience</Link><Link href="/company">Company</Link><Link href="/services">Business Services</Link><Link href="/request-callback">Request a Callback</Link><Link href="/demos">Free Demos</Link><Link href="/faq/why-tinitiate">Why Tinitiate?</Link><Link href="/faq/students-stem">Student FAQs (STEM)</Link><Link href="/faq/students-nonstem">Student FAQs (Non-STEM)</Link><Link href="/faq/parents-stem">Parent FAQs (STEM)</Link><Link href="/faq/parents-nonstem">Parent FAQs (Non-STEM)</Link>
        </nav>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.75fr_1.25fr] lg:gap-14">
          {/* Brand */}
          <div>
            <p className="text-xl font-bold text-white">
              {settings.siteName}
            </p>

            {settings.tagline && (
              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
                {settings.tagline}
              </p>
            )}

            {/* Social icons */}
            {settings.socialLinks && settings.socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {settings.socialLinks.map((link) => (
                  <a
                    key={link.id ?? link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    title={link.platform}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 transition duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-600 hover:text-white"
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Explore */}
          <div>
            <p className="text-sm font-semibold text-white">
              Explore
            </p>

            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/courses"
                  className="transition hover:text-white"
                >
                  Courses
                </Link>
              </li>

              <li>
                <Link
                  href="/trainers"
                  className="transition hover:text-white"
                >
                  Trainers
                </Link>
              </li>

              <li>
                <Link
                  href="/placements"
                  className="transition hover:text-white"
                >
                  Placements
                </Link>
              </li>

              <li>
                <Link
                  href="/blog"
                  className="transition hover:text-white"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          {/* Company */}
<div>
  <p className="text-sm font-semibold text-white">
    Company
  </p>

  <ul className="mt-4 space-y-3 text-sm text-slate-400">
    <li>
      <Link
        href="/about"
        className="transition hover:text-white"
      >
        About Us
      </Link>
    </li>

    <li>
      <Link
        href="/pricing"
        className="transition hover:text-white"
      >
        Program Pricing
      </Link>
    </li>

    <li>
      <Link
        href="/pricing-policy"
        className="transition hover:text-white"
      >
        Pricing Policy
      </Link>
    </li>

    <li>
      <Link
        href="/privacy-policy"
        className="transition hover:text-white"
      >
        Privacy Policy
      </Link>
    </li>

    <li>
      <Link
        href="/refund-policy"
        className="transition hover:text-white"
      >
        Refund Policy
      </Link>
    </li>

    <li>
      <Link
        href="/cookie-policy"
        className="transition hover:text-white"
      >
        Cookie Policy
      </Link>
    </li>

    <li>
      <Link
        href="/terms"
        className="transition hover:text-white"
      >
        Terms &amp; Conditions
      </Link>
    </li>

    <li>
      <Link
        href="/contact"
        className="transition hover:text-white"
      >
        Contact
      </Link>
    </li>

    <li>
      <Link
        href="/book-a-demo"
        className="transition hover:text-white"
      >
        Book a Demo
      </Link>
    </li>
  </ul>
</div>

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold text-white">
              Contact
            </p>

            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-400">
              {settings.contactPhone && (
                <div className="flex items-start gap-3">
                  <PhoneIcon />

                  <span className="min-w-0 break-words">
                    {settings.contactPhone}
                  </span>
                </div>
              )}

              {settings.contactEmail && (
                <div className="flex items-start gap-3">
                  <MailIcon />

                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="min-w-0 break-all transition hover:text-white"
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              )}

              {offices.length > 0 && (
  <div className="flex items-start gap-3">
    <LocationIcon />

    <div className="min-w-0 space-y-4">
      {offices.map((office, index) => (
        <div key={`${office.label}-${index}`}>
          <p className="font-semibold text-slate-300">
            {office.label}
          </p>

          <p className="mt-1 max-w-sm leading-6 text-slate-400">
            {office.address}
          </p>

          <a
            href={googleMapsUrl(office.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-brand-400 transition hover:text-white"
          >
            <SmallLocationIcon />
            View on Google Maps
          </a>
        </div>
      ))}
    </div>
  </div>
)}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-slate-500 sm:flex-row lg:px-8">
          <p>
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>

          <p>
            Practical IT &amp; AI Training for Real Careers
          </p>
        </div>
      </div>
    </footer>
  )
}

function SmallLocationIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function SocialIcon({ platform }: { platform: string }) {
  const name = platform.toLowerCase().trim()

  if (name.includes('linkedin')) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9h4v12H3V9Zm6.5 0h3.83v1.64h.05c.53-1.01 1.84-2.08 3.79-2.08C21.22 8.56 22 11.23 22 14.7V21h-4v-5.59c0-1.33-.02-3.05-1.86-3.05-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" />
      </svg>
    )
  }

  if (name.includes('youtube')) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="19"
        height="19"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
      </svg>
    )
  }

  if (name.includes('instagram')) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (name === 'x' || name.includes('twitter')) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2H21l-6.02 6.88L22 22h-5.5l-4.31-5.64L7.25 22H4.49l6.42-7.34L4.17 2h5.64l3.9 5.15L18.244 2Zm-.97 17.69h1.53L8.98 4.19H7.34l9.934 15.5Z" />
      </svg>
    )
  }

  if (name.includes('facebook')) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M13.5 22v-9h3l.5-3.5h-3.5V7.25c0-1.02.29-1.72 1.75-1.72H17V2.4c-.31-.04-1.38-.13-2.62-.13-2.6 0-4.38 1.58-4.38 4.5V9.5H7V13h3v9h3.5Z" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="mt-1 shrink-0 text-brand-400"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="mt-1 shrink-0 text-brand-400"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="mt-1 shrink-0 text-brand-400"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}
