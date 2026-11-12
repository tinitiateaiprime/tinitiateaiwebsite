import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Container } from '@/components/ui/Container'

type HeroCta = {
  href: string
  label: string
}

type ResponsiveHeroProps = {
  imageSrc: string
  mobileImageSrc: string
  imageAlt?: string
  eyebrow: string
  title: string
  description: ReactNode
  cta?: HeroCta
}

export function ResponsiveHero({
  imageSrc,
  mobileImageSrc,
  imageAlt,
  eyebrow,
  title,
  description,
  cta,
}: ResponsiveHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      {/* MOBILE IMAGE */}
      <div className="relative w-full sm:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mobileImageSrc}
          alt={imageAlt || title}
          className="block h-auto w-full"
        />
      </div>

      {/* DESKTOP IMAGE */}
      <div className="absolute inset-0 -z-20 hidden sm:block">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Desktop overlay */}
      <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/20 sm:block" />

      <div className="absolute inset-0 -z-10 hidden bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/10 sm:block" />

      <Container className="relative z-10 py-10 sm:py-20">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-brand-300">
            {eyebrow}
          </span>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            {title}
          </h1>

          <div className="mt-4 text-base leading-7 text-slate-200">
            {description}
          </div>

          {cta && (
            <Link
              href={cta.href}
              className="mt-6 inline-block rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-400 hover:shadow-xl"
            >
              {cta.label}
            </Link>
          )}
        </div>
      </Container>
    </section>
  )
}