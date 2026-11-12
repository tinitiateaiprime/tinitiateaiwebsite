import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'

export const policyDirectory = [
  { label: 'Pricing Policy', href: '/pricing-policy' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
]

export const policyInlineLinkClassName =
  'font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4 transition hover:text-blue-800 dark:text-sky-200 dark:decoration-sky-500/40'

const themes = {
  amber: {
    badge:
      'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200',
    heroWash:
      'from-amber-50 via-white to-sky-50 dark:from-amber-500/10 dark:via-slate-950 dark:to-sky-500/10',
    orbLeft: 'bg-amber-200/60 dark:bg-amber-500/12',
    orbRight: 'bg-sky-200/60 dark:bg-sky-500/12',
    sectionLine: 'from-[#c9a227] via-amber-400 to-sky-400',
    sectionIcon:
      'bg-[#0f2242] text-white dark:bg-sky-500/15 dark:text-sky-200',
    smallBadge:
      'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200',
    activePolicy:
      'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-100',
    highlightNumber: 'text-amber-600 dark:text-amber-200',
  },
  emerald: {
    badge:
      'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200',
    heroWash:
      'from-emerald-50 via-white to-sky-50 dark:from-emerald-500/10 dark:via-slate-950 dark:to-sky-500/10',
    orbLeft: 'bg-emerald-200/60 dark:bg-emerald-500/12',
    orbRight: 'bg-sky-200/60 dark:bg-sky-500/12',
    sectionLine: 'from-emerald-400 via-sky-400 to-blue-500',
    sectionIcon:
      'bg-[#0f2242] text-white dark:bg-sky-500/15 dark:text-sky-200',
    smallBadge:
      'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200',
    activePolicy:
      'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-100',
    highlightNumber: 'text-emerald-600 dark:text-emerald-200',
  },
  slate: {
    badge:
      'border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
    heroWash:
      'from-slate-50 via-white to-[#eef5ff] dark:from-slate-500/10 dark:via-slate-950 dark:to-sky-500/10',
    orbLeft: 'bg-slate-200/70 dark:bg-slate-500/12',
    orbRight: 'bg-sky-200/60 dark:bg-sky-500/12',
    sectionLine: 'from-slate-500 via-sky-400 to-blue-500',
    sectionIcon:
      'bg-[#0f2242] text-white dark:bg-sky-500/15 dark:text-sky-200',
    smallBadge:
      'border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
    activePolicy:
      'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100',
    highlightNumber: 'text-slate-600 dark:text-slate-200',
  },
  sky: {
    badge:
      'border border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-200',
    heroWash:
      'from-sky-50 via-white to-indigo-50 dark:from-sky-500/10 dark:via-slate-950 dark:to-indigo-500/10',
    orbLeft: 'bg-sky-200/60 dark:bg-sky-500/12',
    orbRight: 'bg-indigo-200/60 dark:bg-indigo-500/12',
    sectionLine: 'from-sky-400 via-blue-500 to-indigo-500',
    sectionIcon:
      'bg-[#0f2242] text-white dark:bg-sky-500/15 dark:text-sky-200',
    smallBadge:
      'border border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-200',
    activePolicy:
      'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-100',
    highlightNumber: 'text-sky-600 dark:text-sky-200',
  },
}

function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

function PolicyDirectoryCard({ currentHref, palette, supportTitle, supportDescription }) {
  return (
    <div className="rounded-[1.75rem] bg-[#0f2242] p-6 text-white shadow-[0_28px_80px_rgba(2,6,23,0.24)] dark:bg-slate-900 dark:ring-1 dark:ring-sky-500/10">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
        Policy Hub
      </p>
      <h2 className="mt-3 text-2xl font-bold leading-tight">
        Browse every policy with a cleaner, easier reading flow.
      </h2>

      <div className="mt-6 grid gap-3">
        {policyDirectory.map((item) => {
          const isCurrent = item.href === currentHref

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent ? 'page' : undefined}
              className={cx(
                'flex items-center justify-between rounded-[1.15rem] border px-4 py-3 text-sm font-semibold transition',
                isCurrent
                  ? cx('border-white/10 bg-white/10 text-white', palette.activePolicy)
                  : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10'
              )}
            >
              <span>{item.label}</span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Link>
          )
        })}
      </div>

      <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
          {supportTitle}
        </p>
        <div className="mt-2 text-sm leading-7 text-slate-200">
          {supportDescription}
        </div>
      </div>
    </div>
  )
}

export default function PolicyPageShell({
  currentHref,
  eyebrow,
  title,
  intro,
  highlights,
  sections,
  theme = 'sky',
  supportTitle = 'Need Help?',
  supportDescription,
  contactEmail,
}) {
  const palette = themes[theme] ?? themes.sky
  const relatedPolicies = policyDirectory.filter((item) => item.href !== currentHref)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_42%,#ffffff_100%)] text-gray-800 dark:bg-[linear-gradient(180deg,#020617_0%,#071126_44%,#0b1220_100%)] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,162,39,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.06),transparent_28%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.07),transparent_24%)]" />

      <section className="px-4 pb-6 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/92 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/85 sm:p-8 lg:p-10">
            <div
              className={cx(
                'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90',
                palette.heroWash
              )}
            />
            <div
              className={cx(
                'pointer-events-none absolute -left-16 top-8 h-40 w-40 rounded-full blur-3xl',
                palette.orbLeft
              )}
            />
            <div
              className={cx(
                'pointer-events-none absolute -right-10 bottom-0 h-52 w-52 rounded-full blur-3xl',
                palette.orbRight
              )}
            />

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_340px]">
              <div>
                <span
                  className={cx(
                    'inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]',
                    palette.badge
                  )}
                >
                  {eyebrow}
                </span>
                <h1 className="mt-6 max-w-4xl text-balance text-4xl font-black leading-tight tracking-[-0.03em] text-[#0f2242] dark:text-slate-50 sm:text-5xl">
                  {title}
                </h1>
                <p className="mt-5 max-w-3xl text-pretty text-base leading-8 text-[#5b667a] dark:text-slate-300 sm:text-lg">
                  {intro}
                </p>

                

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {highlights.map((item, index) => (
                    <div
                      key={item.title}
                      className="rounded-[1.35rem] border border-white/75 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/85"
                    >
                      <p
                        className={cx(
                          'text-xs font-semibold uppercase tracking-[0.22em]',
                          palette.highlightNumber
                        )}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <h2 className="mt-3 text-base font-bold text-[#0f2242] dark:text-slate-50">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-[#5b667a] dark:text-slate-300">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <PolicyDirectoryCard
                currentHref={currentHref}
                palette={palette}
                supportTitle={supportTitle}
                supportDescription={supportDescription}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-[980px] space-y-6">
            {sections.map((section, index) => {
              const SectionIcon = section.icon

              return (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/92 p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.24)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/85 sm:p-8">
                    <div
                      className={cx(
                        'mb-6 h-1.5 w-16 rounded-full bg-gradient-to-r',
                        palette.sectionLine
                      )}
                    />

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="max-w-3xl">
                        <span
                          className={cx(
                            'inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
                            palette.smallBadge
                          )}
                        >
                          Section {String(index + 1).padStart(2, '0')}
                        </span>
                        <h2 className="mt-4 text-balance text-2xl font-bold tracking-tight text-[#0f2242] dark:text-slate-50 sm:text-[1.85rem]">
                          {section.title}
                        </h2>
                      </div>

                      {SectionIcon ? (
                        <div
                          className={cx(
                            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm',
                            palette.sectionIcon
                          )}
                        >
                          <SectionIcon className="h-5 w-5" />
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-6 grid gap-3">
                      {section.items.map((item, itemIndex) => {
                        const ItemIcon = item.icon

                        return (
                          <div
                            key={`${section.id}-${itemIndex}`}
                            className="rounded-[1.25rem] border border-slate-200/80 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-5"
                          >
                            <div className="flex items-start gap-3">
                              {ItemIcon ? (
                                <span
                                  className={cx(
                                    'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl',
                                    item.iconClassName ||
                                      'bg-blue-50 text-blue-700 dark:bg-sky-500/10 dark:text-sky-200'
                                  )}
                                >
                                  <ItemIcon className="h-4 w-4" />
                                </span>
                              ) : null}
                              <div className="min-w-0 text-sm leading-7 text-[#5b667a] dark:text-slate-300 sm:text-[15px]">
                                {item.content}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </section>
              )
            })}

            <section className="overflow-hidden rounded-[1.75rem] bg-[#0f2242] p-6 text-white shadow-[0_28px_80px_rgba(2,6,23,0.24)] dark:bg-slate-900 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c9a227]">
                Related Policies
              </p>
              <h2 className="mt-3 text-2xl font-bold">
                Explore the rest of our policy pages with the same reading flow.
              </h2>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {relatedPolicies.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-[1.25rem] border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
                  >
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-300">
                      Open page
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
        </div>
      </section>
    </main>
  )
}
