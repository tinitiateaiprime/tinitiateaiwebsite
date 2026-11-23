import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Page not found</p>
    <h1 className="mt-3 text-[2.4rem] font-semibold leading-tight tracking-[-0.04em] text-ink sm:text-5xl">We couldn&apos;t find that page.</h1>
    <p className="mt-5 text-lg leading-8 text-neutral-600">It may have moved. Here&apos;s where most people are headed:</p>
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Link href="/paths" className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-[15px] font-semibold text-white hover:bg-[#2443c8]">Career paths <ArrowRight aria-hidden="true" className="size-4" /></Link>
      <Link href="/courses" className="inline-flex h-12 items-center rounded-full border border-neutral-300 px-6 text-[15px] font-semibold text-ink hover:border-ink">Live courses</Link>
      <Link href="/masterclasses" className="inline-flex h-12 items-center rounded-full border border-neutral-300 px-6 text-[15px] font-semibold text-ink hover:border-ink">Free MasterClasses</Link>
    </div>
  </section>;
}
