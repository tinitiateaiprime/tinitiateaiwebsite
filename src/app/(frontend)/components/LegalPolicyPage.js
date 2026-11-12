import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const legalPolicyDirectory = [
  { label: 'Pricing Policy', href: '/pricing-policy' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
]

function renderBlock(block, index) {
  if (!block) return null

  if (block.type === 'subheading') {
    return (
      <h3 key={index} className="mt-6 text-lg font-extrabold text-[#12345f] dark:text-white">
        {block.text}
      </h3>
    )
  }

  if (block.type === 'list') {
    return (
      <ul key={index} className="mt-3 space-y-2">
        {block.items.map((item) => (
          <li key={item} className="flex gap-3 text-sm font-medium leading-7 text-[#53677d] dark:text-slate-300 sm:text-[15px]">
            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a227]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <p key={index} className="mt-3 text-sm font-medium leading-7 text-[#53677d] dark:text-slate-300 sm:text-[15px]">
      {block.text}
    </p>
  )
}

export default function LegalPolicyPage({
  currentHref,
  eyebrow,
  title,
  intro = [],
  sections = [],
  closingTitle,
  closing = [],
  supportEmail = 'contact@tinitiateai.com',
}) {
  const relatedPolicies = legalPolicyDirectory.filter((item) => item.href !== currentHref)

  return (
    <main className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_48%,#ffffff_100%)] text-gray-900 dark:bg-[linear-gradient(180deg,#020617_0%,#071126_48%,#020617_100%)] dark:text-white">
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_28px_80px_-60px_rgba(15,23,42,0.5)] dark:border-slate-800 dark:bg-slate-950 sm:p-8 lg:p-10">
            <span className="inline-flex rounded-full border border-[#c9a227]/30 bg-[#fff8df] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#8a6b00] dark:border-[#c9a227]/30 dark:bg-[#c9a227]/10 dark:text-[#f2cf5b]">
              {eyebrow}
            </span>
            <h1 className="mt-5 text-balance text-4xl font-black leading-tight text-[#12345f] dark:text-white sm:text-5xl">
              {title}
            </h1>
            <div className="mt-5 max-w-4xl">
              {intro.map((text) => (
                <p key={text} className="mt-3 text-base leading-8 text-[#53677d] dark:text-slate-300">
                  {text}
                </p>
              ))}
            </div>

           
          </div>

          <aside className="h-fit rounded-[1.75rem] bg-[#0f2242] p-6 text-white shadow-[0_28px_80px_rgba(2,6,23,0.24)] dark:bg-slate-900">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c9a227]">
              Policy Hub
            </p>
            <div className="mt-5 grid gap-3">
              {legalPolicyDirectory.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={item.href === currentHref ? 'page' : undefined}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                    item.href === currentHref
                      ? 'border-[#c9a227]/40 bg-[#c9a227]/15 text-[#f2cf5b]'
                      : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-32 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_22px_70px_-56px_rgba(15,23,42,0.62)] dark:border-slate-800 dark:bg-slate-950 sm:p-8">
              <h2 className="text-2xl font-black leading-tight text-[#12345f] dark:text-white">
                {section.title}
              </h2>
              <div className="mt-4">{section.blocks.map(renderBlock)}</div>
            </section>
          ))}

          {closing.length ? (
            <section className="rounded-[1.5rem] bg-[#12345f] p-6 text-white shadow-[0_28px_80px_rgba(2,6,23,0.24)] sm:p-8">
              <h2 className="text-2xl font-black">{closingTitle}</h2>
              {closing.map((text) => (
                <p key={text} className="mt-3 text-sm leading-7 text-blue-50 sm:text-base">
                  {text}
                </p>
              ))}
            </section>
          ) : null}

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 sm:p-8">
            <h2 className="text-xl font-black text-[#12345f] dark:text-white">Related Policies</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {relatedPolicies.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-2xl border border-slate-200 p-4 text-sm font-bold text-[#12345f] transition hover:border-[#c9a227] dark:border-slate-700 dark:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
