import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { ContactForm } from '@/components/ContactForm'
import { getSiteSettings } from '@/lib/siteSettings'

export const metadata = {
  title: 'Contact — TinitiateAI',
}

type Office = {
  label: string
  address: string
}

function parseOffices(address?: string | null): Office[] {
  if (!address?.trim()) return []

  const lines = address
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const offices: Office[] = []

  for (const line of lines) {
    const separator = line.indexOf(':')

    if (separator === -1) {
      offices.push({
        label:
          offices.length === 0
            ? 'Corporate Office'
            : `Office ${offices.length + 1}`,
        address: line,
      })

      continue
    }

    const label = line.slice(0, separator).trim()
    const officeAddress = line
      .slice(separator + 1)
      .trim()

    if (!officeAddress) continue

    offices.push({
      label: label || 'Office',
      address: officeAddress,
    })
  }

  return offices
}

function googleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address,
  )}`
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  const offices = parseOffices(
    settings.address,
  )

  return (
    <Container className="py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left side */}
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Contact
          </span>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Get in touch
          </h1>

          <p className="mt-4 max-w-xl text-slate-600">
            Have a question about a course, corporate training,
            or partnerships? Send us a message and we&apos;ll
            respond within one business day.
          </p>

          {/* Phone and Email */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {settings.contactPhone && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Phone
                </p>

                <a
                  href={`tel:${settings.contactPhone}`}
                  className="mt-2 block font-semibold text-slate-900 transition hover:text-brand-600"
                >
                  {settings.contactPhone}
                </a>
              </div>
            )}

            {settings.contactEmail && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Email
                </p>

                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="mt-2 block break-all font-semibold text-slate-900 transition hover:text-brand-600"
                >
                  {settings.contactEmail}
                </a>
              </div>
            )}
          </div>

          {/* Office card */}
          {offices.length > 0 && (
            <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-400/10 text-amber-400">
                  <LocationIcon />
                </div>

                <p className="text-sm font-bold uppercase tracking-[0.28em] text-slate-400">
                  Office
                </p>
              </div>

              <div className="mt-7 space-y-8 pl-0 sm:pl-[60px]">
                {offices.map(
                  (office, index) => (
                    <div key={`${office.label}-${index}`}>
                      <h2 className="text-xl font-bold text-white">
                        {office.label}:
                      </h2>

                      <p className="mt-3 max-w-lg text-base leading-8 text-slate-300 sm:text-lg">
                        {office.address}
                      </p>

                      <a
                        href={googleMapsUrl(
                          office.address,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-amber-400/70 hover:bg-amber-400/10 hover:text-amber-300"
                      >
                        <SmallPinIcon />
                        View on Google Maps
                      </a>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          <div className="mt-6">
            <Link
              href="/book-a-demo"
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Book a Free Demo
            </Link>
          </div>
        </div>

        {/* Contact form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <ContactForm />
        </div>
      </div>
    </Container>
  )
}

function LocationIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function SmallPinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  )
}