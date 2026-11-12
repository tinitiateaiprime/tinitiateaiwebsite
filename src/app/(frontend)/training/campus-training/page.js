"use client";

import Link from "next/link"
import { useMemo } from "react"
import { FiTrendingUp, FiServer, FiActivity, FiCheckCircle } from "react-icons/fi";






export default function ClassroomToCodebasePage() {
  const valueProps = useMemo(() => ([
    {
      title: "Industry-Grade Delivery",
      desc: "Remote experts teach, on-site trainers coach. Students build real projects with code reviews and CI/CD.",
      Icon: FiServer,
    },
    {
      title: "Measured & Transparent",
      desc: "Structured learning, project reviews, and regular feedback support learner progress.",
      Icon: FiActivity,
    },
    {
      title: "Placement-Ready Outcomes",
      desc: "Projects, quizzes, and interview preparation build a portfolio that hiring managers trust.",
      Icon: FiTrendingUp,
    },
  ]), [])

  const steps = useMemo(() => ([
    { step: "Step 1", title: "Set Up the Room", desc: "Projector, laptop, audio, and connectivity tested. Student learning plans agreed with the campus." },
    { step: "Step 2", title: "Run the Day", desc: "Attendance → live lecture → guided lab → project work → quiz → check-out." },
    { step: "Step 3", title: "Report & Improve", desc: "Admin daily report + weekly KPIs (attendance, quiz averages, lab completion, at-risk flags)." },
  ]), [])

const FAQ = [
  { q: "Is this fully on-campus?", a: "Yes—delivered in your classrooms with remote experts joining as needed." },
  { q: "What if internet fails?", a: "Contact the training team to arrange alternate practice material and rescheduled sessions." },
  { q: "Can you customize the syllabus?", a: "Absolutely. We map to department goals and semester timelines." },
  { q: "Do students get certificates?", a: "Yes—based on attendance, assessments, and capstone completion." },
]

  return (
    <div className="bg-white text-gray-900">

      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(59,130,246,0.20),transparent),radial-gradient(1200px_600px_at_10%_10%,rgba(99,102,241,0.18),transparent)]" />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <section className="relative w-full bg-gradient-to-br from-gray-950 to-gray-800 text-white">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            From Classroom to Codebase
          </h1>
          <p className="mt-4 inline-block rounded-full px-4 py-1 text-sm font-medium bg-indigo-100 text-indigo-700">
            Academia × Industry: Real Projects, Real Impact
          </p>
          <p className="mt-4 text-base md:text-lg text-white/90 max-w-3xl mx-auto">
            Industry-grade training delivered inside your campus.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="#contact"
              className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Book a Campus Demo
            </Link>
            <Link
              href="#brochure"
              className="px-6 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition"
            >
              Download Program Brochure
            </Link>
          </div>
        </div>
      </section>

<section className="px-6 py-10 bg-white">
  <div className="mx-auto max-w-7xl">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
      Why This Program Works
    </h2>
    <p className="mt-3 text-gray-700 leading-relaxed">
      Empowering the next generation of software engineers — delivered
      right inside your campus with live lectures, guided labs, biometric
      attendance, and masterclasses by reputed instructors.
    </p>

    <ul className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
      {[
        "Biometric-verified attendance",
        "On-site admin oversight",
        "Live + remote trainers",
        "Masterclasses recorded",
      ].map((chip, i) => (
        <li
          key={i}
          className="flex items-center gap-2 rounded- border bg-white px-3 py-1 text-sm text-gray-700 shadow-sm"
        >
          <FiCheckCircle className="h-4 w-4 text-blue-600" />
          <span>{chip}</span>
        </li>
      ))}
    </ul>
  </div>
</section>

<section className="px-6 py-1 bg-white">
  <div className="mx-auto max-w-7xl">
    <div className="rounded-2xl border bg-white shadow-md p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
        In Action
      </p>
      <ul className="mt-3 space-y-3 text-sm text-gray-700">
        <li className="flex items-start gap-2">
          <FiCheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          Live lecture + lab combo every morning
        </li>
        <li className="flex items-start gap-2">
          <FiCheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          Afternoon project sprints with trainer support
        </li>
        <li className="flex items-start gap-2">
          <FiCheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          Daily reports and weekly KPIs for transparency
        </li>
      </ul>
    </div>
  </div>
</section>

      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="relative text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14 flex justify-center">
            <span className="relative inline-block">
              What You Get
              <span className="absolute left-0 -bottom-2 w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-blue-500 rounded" />
            </span>
          </h2>

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {valueProps.map(({ title, desc, Icon }, i) => (
              <article
                key={i}
                className="relative rounded-3xl bg-white p-8 shadow-lg hover:shadow-2xl transition"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-white p-3 shadow-sm text-indigo-600">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {title}
                  </h3>
                  <p className="text-base leading-relaxed text-gray-600">
                    {desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50/70">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border bg-white shadow-sm"
              >
                <div className="text-sm font-medium text-indigo-700">
                  {item.step}
                </div>
                <h3 className="mt-2 font-semibold text-lg">{item.title}</h3>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-indigo-50/60">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl border bg-white p-10 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Masterclasses by Reputed Instructors
            </h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Deep-dive sessions with recordings and notes. Each masterclass includes a short quiz or
              reflection to reinforce learning.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-700">
              <span className="px-3 py-1 rounded-full border">Recorded & shared</span>
              <span className="px-3 py-1 rounded-full border">Moderated Q&A</span>
              <span className="px-3 py-1 rounded-full border">Ties into lab work</span>
            </div>
          </div>
        </div>
      </section>

       <section className="px-6 py-12">
  <div className="mx-auto max-w-7xl">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-start mb-6">
      FAQs
    </h2>
    <div className="grid gap-6 md:grid-cols-2">
      {FAQ.map(({ q, a }, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm hover:shadow-md transition"
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

      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bring industry-grade training to your campus
          </h2>
          <p className="mb-6 text-lg leading-relaxed max-w-2xl mx-auto">
            Schedule a walkthrough, review the timetable, and meet the trainer pod.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#contact"
              className="px-6 py-3 rounded-full bg-white text-blue-700 font-semibold hover:bg-gray-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              Request a Campus Walkthrough
            </Link>
            <Link
              href="#syllabus"
              className="px-6 py-3 rounded-full border border-white text-white hover:bg-white hover:text-blue-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              View Syllabus & Rubrics
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
