'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

const campusSlides = [
  {
    image: '/images/campus/kits-campus-visit.png',
    title: 'A day on campus',
    description:
      'Student interaction, a panel conversation, and a formal welcome shown together.',
  },
  {
    image: '/images/campus/kits-institutional-welcome.jpg',
    title: 'Institutional welcome',
    description:
      'A formal welcome marking the start of a meaningful campus partnership.',
  },
]

export function CampusPlacementVisit() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || campusSlides.length <= 1) return

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % campusSlides.length)
    }, 3000)

    return () => window.clearInterval(timer)
  }, [paused])

  return (
    <section className="bg-[#f5f8fb] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#123663] sm:text-4xl lg:text-5xl">
            Campus Placement Visit
          </h2>

          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-[#c5a323]" />
        </div>

        {/* Main card */}
        <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,49,95,0.08)] lg:grid lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="flex flex-col px-8 py-10 sm:px-10 lg:px-8 xl:px-10">
            <div className="flex items-center gap-5">
              <div className="relative h-[92px] w-[92px] shrink-0">
                <Image
                  src="/images/campus/kits-logo.png"
                  alt="Kakatiya Institute of Technology and Science"
                  fill
                  sizes="92px"
                  className="object-contain"
                />
              </div>

              <div className="hidden h-16 w-px bg-slate-200 sm:block" />

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Featured Institution
                </p>

                <h3 className="mt-1 text-lg font-extrabold leading-tight text-[#153766] sm:text-xl">
                  Kakatiya Institute of Technology &amp; Science
                </h3>

                <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                  <LocationIcon />
                  Warangal, Telangana
                </div>
              </div>
            </div>

            <div className="my-8 h-px bg-slate-200" />

            <p className="text-base leading-7 text-slate-600">
              TINITIATE visited KITS Warangal to meet graduating students,
              share real career pathways and conduct a focused on-campus
              assessment bringing industry expectations and student potential
              into the same room.
            </p>

            <div className="mt-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                The Visit, End to End
              </p>

              <div className="relative mt-4 grid grid-cols-3">
                <div className="absolute left-[16%] right-[16%] top-5 h-px bg-[#d8cf9f]" />

                <VisitStep
                  icon={<ConnectIcon />}
                  title="Connect"
                  description="Career dialogue"
                />

                <VisitStep
                  icon={<AssessIcon />}
                  title="Assess"
                  description="Readiness check"
                />

                <VisitStep
                  icon={<CollaborateIcon />}
                  title="Collaborate"
                  description="Campus bridge"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE CAROUSEL */}
          <div
            className="flex min-h-[458px] flex-col overflow-hidden bg-[#07182f]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Images */}
            <div className="relative h-[370px] w-full overflow-hidden">
              {campusSlides.map((slide, index) => (
                <div
                  key={slide.image}
                  className={`absolute inset-0 transition-all duration-700 ${
                    index === activeSlide
                      ? 'scale-100 opacity-100'
                      : 'scale-[1.03] opacity-0'
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                    priority={index === 0}
                  />
                </div>
              ))}

              {/* KITS badge */}
              <span className="absolute left-5 top-5 z-20 rounded-full bg-[#25374d]/95 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white shadow-lg">
                KITS WARANGAL
              </span>

              {/* Navigation dots */}
              <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {campusSlides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Show campus image ${index + 1}`}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      activeSlide === index
                        ? 'w-6 bg-white'
                        : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Caption changes with image */}
            <div className="flex flex-1 flex-col justify-center bg-[#07182f] px-6 py-5 text-white">
              <h3
                key={`title-${activeSlide}`}
                className="animate-[fadeIn_500ms_ease-out] text-xl font-extrabold leading-tight"
              >
                {campusSlides[activeSlide].title}
              </h3>

              <p
                key={`desc-${activeSlide}`}
                className="mt-1 text-sm leading-6 text-slate-300"
              >
                {campusSlides[activeSlide].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function VisitStep({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#123663] text-white shadow-md">
        {icon}
      </div>

      <p className="mt-3 text-sm font-extrabold text-[#123663]">
        {title}
      </p>

      <p className="mt-0.5 text-xs text-slate-500">
        {description}
      </p>
    </div>
  )
}

function LocationIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#c5a323"
      strokeWidth="2"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function ConnectIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="4" y="4" width="16" height="14" rx="2" />
      <path d="M8 9h8M8 13h5M8 18l-2 2v-2" />
    </svg>
  )
}

function AssessIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M9 4V2h6v2M9 11l2 2 4-4" />
    </svg>
  )
}

function CollaborateIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m8 12 3 3 5-5" />
      <path d="M7 17 3 13a3 3 0 0 1 0-4l2-2a3 3 0 0 1 4 0l1 1" />
      <path d="m17 7 4 4a3 3 0 0 1 0 4l-2 2a3 3 0 0 1-4 0l-1-1" />
    </svg>
  )
}