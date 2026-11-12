import Link from 'next/link'
import { FiArrowRight, FiCheckCircle, FiPhone } from 'react-icons/fi';

import { CourseFeatureCard } from '@/components/CourseFeatureCard'



const HERO = {
  title: 'Beginner Online Training Program',
  subtitle: 'Live online IT training with strong foundations in programming, web development, and databases.',
  badge: 'No prior experience required',
}





const FAQ = [
  {
    q: 'I am completely new to IT. Can I join?',
    a: 'Yes. This beginner training is specifically designed for students and professionals with zero or very little coding background.',
  },
  {
    q: 'Do I need a powerful laptop?',
    a: 'No. A basic laptop with internet connection is enough. We help you set up all required tools step-by-step.',
  },
  {
    q: 'Can I do this along with college or job?',
    a: 'Yes. Sessions can be planned in evenings or weekends, and we share recordings and practice material.',
  },
  {
    q: 'What happens after I finish?',
    a: 'We suggest your next path—Full Stack, Data Engineering, Cloud, or AI—and help you transition smoothly.',
  },
]


export default function BeginnerOverview({ courses }) {
  return (
    <div className="bg-white text-gray-900">

<section className="relative overflow-hidden bg-black px-6 py-20">
  <div className="pointer-events-none absolute inset-0 bg-black opacity-60" />
  <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-black opacity-40" />
  <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-10 md:flex-row md:items-center">
    <div className="flex-1">
      <span className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-200">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />

        {HERO.badge}
        <span className="mx-2 h-3 w-px bg-slate-600" />
        <span className="font-semibold text-emerald-300">
          Online Training
        </span>
      </span>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
        {HERO.title}
      </h1>

      <p className="mt-4 max-w-xl text-sm md:text-base text-slate-200">

        We focus on the essentials first:
        Python, JavaScript/HTML/CSS, TypeScript, Java, and SQL.
        Get the fundamentals clear so you can grow into Full Stack,
        Data, Cloud or AI roles with confidence — from anywhere.
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-xs md:text-sm">
        {['Python', 'JavaScript / HTML / CSS', 'TypeScript', 'Java', 'SQL'].map((item) => (
          <span
            key={item}
            className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-slate-100"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          href="/request-callback"
          className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition"
        >
          Talk to a Mentor
          <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </div>
</section>

      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[3fr,2fr]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              Choose your beginner course
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {courses.map((course) => (
                <CourseFeatureCard key={course.id} course={course} />
              ))}
            </div>
          </div>

        </div>
      </section>

      <section className="px-6 py-12 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-start mb-6">
            FAQs
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {(Array.isArray(FAQ) ? FAQ : []).map(({ q, a }, i) => (
              <div
                key={q ?? i}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-2 mb-3">
                  <FiCheckCircle className="h-5 w-5 text-indigo-600 opacity-80" />
                  <h3 className="text-base font-semibold text-gray-900">{q}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h4 className="text-lg font-bold text-gray-900">Want a personalized study plan?</h4>
                <p className="text-sm text-gray-700">
                  Tell us your goals—career switch, upskilling, or interview prep—and we’ll map the path.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/request-callback"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                >
                  <FiPhone className="h-4 w-4" />
                  Request a Callback
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
