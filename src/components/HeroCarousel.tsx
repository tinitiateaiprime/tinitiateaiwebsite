'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Slide = {
  headline: string
  backgroundImage: string
  mobileImage: string
  courseHref: string
}

const slides: Slide[] = [
  {
    headline: 'Generative AI Engineering with LLMs',
    backgroundImage: '/images/hero/generative-ai-llms.png',
    mobileImage:
      '/images/hero/mobile/generative-ai-llms.webp',
    courseHref:
      '/courses/generative-ai-engineering-with-llms',
  },
  {
    headline: 'Become a Data Scientist in 12 Weeks',
    backgroundImage:
      '/images/hero/data-scientist-12-weeks.png',
    mobileImage:
      '/images/hero/mobile/data-scientist-12-weeks.webp',
    courseHref: '/courses/data-science-bootcamp',
  },
  {
    headline: 'MLOps & Cloud AI — AWS + Azure',
    backgroundImage:
      '/images/hero/mlops-cloud-ai-aws-azure.png',
    mobileImage:
      '/images/hero/mobile/mlops-cloud-ai-aws-azure.webp',
    courseHref: '/courses/mlops-cloud-ai',
  },
  {
    headline:
      'Master Deep Learning & NLP with Transformers',
    backgroundImage:
      '/images/hero/deep-learning-nlp-transformers.png',
    mobileImage:
      '/images/hero/mobile/deep-learning-nlp-transformers.webp',
    courseHref: '/courses/nlp-with-transformers',
  },
]

const AUTOPLAY_DELAY = 5500

export function HeroCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    if (reducedMotion.matches) return

    let timer: ReturnType<typeof setInterval> | undefined

    const start = () => {
      if (timer) clearInterval(timer)

      timer = setInterval(() => {
        setIndex(
          (current) =>
            (current + 1) % slides.length,
        )
      }, AUTOPLAY_DELAY)
    }

    const stop = () => {
      if (timer) clearInterval(timer)
      timer = undefined
    }

    const handleVisibility = () => {
      if (document.hidden) {
        stop()
      } else {
        start()
      }
    }

    start()

    document.addEventListener(
      'visibilitychange',
      handleVisibility,
    )

    return () => {
      stop()

      document.removeEventListener(
        'visibilitychange',
        handleVisibility,
      )
    }
  }, [])

  function prev() {
    setIndex(
      (current) =>
        (current - 1 + slides.length) %
        slides.length,
    )
  }

  function next() {
    setIndex(
      (current) =>
        (current + 1) % slides.length,
    )
  }

  const slide = slides[index]

  return (
    <section className="w-full bg-white">
      {/* MOBILE */}
      <div className="sm:hidden">
        <div className="relative w-full overflow-hidden bg-slate-950">
          {/* Invisible image fixes the carousel height */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slides[0].mobileImage}
            alt=""
            aria-hidden="true"
            className="block h-auto w-full opacity-0"
          />

          {/* Every slide stays mounted.
              Only opacity changes. */}
          {slides.map((item, slideIndex) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.mobileImage}
              src={item.mobileImage}
              alt={item.headline}
              loading="eager"
              decoding="async"
              aria-hidden={slideIndex !== index}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out will-change-[opacity] ${
                slideIndex === index
                  ? 'opacity-100'
                  : 'opacity-0'
              }`}
            />
          ))}

          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((item, slideIndex) => (
              <button
                type="button"
                key={item.headline}
                aria-label={`Go to slide ${
                  slideIndex + 1
                }`}
                onClick={() =>
                  setIndex(slideIndex)
                }
                className={`h-2.5 rounded-full shadow transition-all duration-300 ${
                  slideIndex === index
                    ? 'w-7 bg-white'
                    : 'w-2.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="relative hidden h-[500px] w-full overflow-hidden bg-slate-950 sm:block lg:h-[540px]">
        {slides.map((item, slideIndex) => (
          <div
            key={item.backgroundImage}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out will-change-[opacity] ${
              slideIndex === index
                ? 'opacity-100'
                : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${item.backgroundImage})`,
            }}
          />
        ))}

        <button
          type="button"
          aria-label="Previous slide"
          onClick={prev}
          className="absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg transition hover:scale-105 hover:bg-white"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Next slide"
          onClick={next}
          className="absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg transition hover:scale-105 hover:bg-white"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>

        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {slides.map((item, slideIndex) => (
            <button
              type="button"
              key={item.headline}
              aria-label={`Go to slide ${
                slideIndex + 1
              }`}
              onClick={() =>
                setIndex(slideIndex)
              }
              className={`h-2.5 rounded-full shadow transition-all duration-300 ${
                slideIndex === index
                  ? 'w-7 bg-white'
                  : 'w-2.5 bg-white/55 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 px-4 py-4 sm:flex sm:justify-center sm:px-6 lg:px-8">
          <Link
            href="/book-a-demo"
            className="flex min-h-12 items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
          >
            Book a Free Demo →
          </Link>

          <Link
            href={slide.courseHref}
            className="flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-center text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md"
          >
            View Course →
          </Link>
        </div>
      </div>
    </section>
  )
}