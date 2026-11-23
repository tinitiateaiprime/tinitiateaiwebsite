import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { cn } from '@/lib/cn';

export const policies = [
  { label: 'Pricing Policy', href: '/pricing-policy' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
];

export type PolicyBlock = { type?: 'text' | 'subheading' | 'list'; text?: string; items?: string[] };
export type PolicySection = { id: string; title: string; blocks: PolicyBlock[] };

function Block({ block }: { block: PolicyBlock }) {
  if (block.type === 'subheading') return <h3 className="mt-6 text-[17px] font-semibold text-ink">{block.text}</h3>;
  if (block.type === 'list') return <ul className="mt-3 space-y-2">
    {block.items?.map(item => <li key={item} className="flex gap-3 text-[15px] leading-7 text-neutral-600"><span className="mt-[11px] size-1.5 shrink-0 rounded-full bg-accent" />{item}</li>)}
  </ul>;
  return <p className="mt-3 text-[15px] leading-7 text-neutral-600">{block.text}</p>;
}

/** Shared layout for the legal / policy pages (content from the kaushik-branch site). */
export function LegalPage({ currentHref, eyebrow, title, intro = [], sections = [], closingTitle, closing = [], supportEmail = 'contact@tinitiateai.com' }: {
  currentHref: string; eyebrow: string; title: string; intro?: string[]; sections?: PolicySection[]; closingTitle?: string; closing?: string[]; supportEmail?: string;
}) {
  return <div className="bg-surface">
    <section className="border-b border-neutral-100 bg-subtle">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 lg:pb-16 lg:pt-16">
        <p className="text-[15px] font-semibold text-accent">{eyebrow}</p>
        <h1 className="mt-3 text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.04em] text-ink sm:text-5xl">{title}</h1>
        <div className="mt-5 max-w-3xl space-y-3">{intro.map(t => <p key={t} className="text-[17px] leading-8 text-neutral-600">{t}</p>)}</div>
        <a href={`mailto:${supportEmail}`} className="mt-7 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-surface px-5 py-2.5 text-[15px] font-semibold text-ink transition hover:border-ink"><Mail aria-hidden="true" className="size-4" />{supportEmail}</a>
      </div>
    </section>

    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16 lg:py-16">
      <aside className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-neutral-400">Policies</p>
        <nav aria-label="Policies" className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
          {policies.map(p => <Link key={p.href} href={p.href} aria-current={p.href === currentHref ? 'page' : undefined}
            className={cn('rounded-full px-4 py-2 text-[15px] font-medium transition-colors lg:rounded-xl', p.href === currentHref ? 'bg-accent-soft text-accent' : 'border border-neutral-200 text-neutral-600 hover:text-ink lg:border-transparent lg:hover:bg-neutral-50')}>{p.label}</Link>)}
        </nav>
        {sections.length > 3 && <>
          <p className="mt-8 hidden text-[13px] font-semibold uppercase tracking-[0.12em] text-neutral-400 lg:block">On this page</p>
          <nav aria-label="On this page" className="mt-3 hidden flex-col gap-1.5 lg:flex">
            {sections.map(s => <a key={s.id} href={`#${s.id}`} className="text-sm leading-5 text-neutral-500 hover:text-ink">{s.title}</a>)}
          </nav>
        </>}
      </aside>

      <article className="max-w-3xl">
        {sections.map(s => <section key={s.id} id={s.id} className="scroll-mt-28 border-b border-neutral-100 py-8 first:pt-0">
          <h2 className="text-[1.4rem] font-semibold tracking-[-0.02em] text-ink">{s.title}</h2>
          {s.blocks.map((b, i) => <Block key={i} block={b} />)}
        </section>)}
        {closing.length > 0 && <section className="mt-8 rounded-2xl bg-night p-7 text-white ring-1 ring-white/10">
          <h2 className="text-xl font-semibold">{closingTitle}</h2>
          {closing.map(t => <p key={t} className="mt-3 text-[15px] leading-7 text-white/80">{t}</p>)}
        </section>}
        <Link href="/contact" className="group mt-10 inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent">Questions about this policy? Contact us <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" /></Link>
      </article>
    </div>
  </div>;
}
