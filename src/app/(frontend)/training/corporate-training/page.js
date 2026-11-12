"use client";

import Link from "next/link"
import { Layers, Users, Search, BookOpen, Sparkles, ShieldCheck } from "lucide-react"; 

const featuresData = [
  {
    title: "System-Oriented Design Thinking",
    description: "Learn to understand system complexities, interpret them effectively, and implement meaningful project solutions.",
    icon: Layers,
    color: "green",
  },
  {
    title: "Collaborative Approach",
    description: "We foster teamwork and peer-to-peer collaboration, enhancing collective learning outcomes.",
    icon: Users,
    color: "purple",
  },
  {
    title: "Problem Solving",
    description: "Develop structured approaches to identify root causes, prioritize issues, and select effective solutions.",
    icon: Search,
    color: "red",
  },
  {
    title: "Experiential Learning",
    description: "We emphasize real-world practice, turning experiences into lessons that empower lasting growth.",
    icon: BookOpen,
    color: "yellow",
  },
  {
    title: "Creativity Development",
    description: "Encourage innovative thinking and 'outside the box' approaches for creative problem-solving.",
    icon: Sparkles,
    color: "indigo",
  },
  {
    title: "Proactive Mindset",
    description: "We train your team to anticipate challenges and take action early—staying one step ahead.",
    icon: ShieldCheck,
    color: "teal",
  },
]

export default function CorporateTrainingPage() {
  return (
    <div className="bg-white text-gray-900">

      <section className="relative w-full bg-gradient-to-br from-gray-950 to-gray-800 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Corporate Training for High-Performing Teams
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/90 max-w-7xl">
            Hands-on, outcome-driven programs tailored to your tech stack, use cases, and schedule—delivered by
            practitioners who ship in production.
          </p>
          <div className="mt-6">
            <Link
              href="/request-callback/?service=corporate-training"
              className="inline-flex items-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            >
              Request Callback
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto ">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center">
            CORPORATE TRAINING
          </h2>
        </div>
        <div className="mx-auto max-w-7xl space-y-5 text-gray-700 mt-10">
          <p>
            At <span className="font-semibold text-gray-900">Tinitiate</span>, corporate training is a core offering.
            Our senior instructors are hands-on engineers who specialize in modern platforms and practices. We design
            each program around your current environment—tools, workflows, and business goals—so teams learn by doing
            and can apply outcomes immediately.
          </p>

          <p>
            Our trainers have delivered programs for engineering and data teams across India in technologies such as
            <span className="font-medium text-gray-900"> Microsoft Azure, Java, Microservices, Docker &amp; Kubernetes, ASP.NET Core,</span> and
            related cloud-native stacks. Sessions blend fundamentals with architecture patterns, labs, and code reviews
            to ensure practical, production-ready skills.
          </p>

          <p>
            Backed by <span className="font-semibold text-gray-900">3+ years</span> of focused delivery at Tinitiate,
            we’ve partnered with organizations of varying sizes and maturity levels—helping teams upskill, standardize
            best practices, and accelerate delivery. Our corporate engagements inform how we teach, letting us align
            content with real-world industry needs and your roadmap.
          </p>

          <p className="text-gray-800">
            Connect with us to schedule a corporate training engagement. We’ll tailor the curriculum, labs, and
            schedule to your team’s objectives and experience levels—so you get measurable impact from day one.
          </p>
        </div>

      </section>

      <section className="px-6 pb-10 md:pb-12">
        <div className="mx-auto max-w-7xl space-y-5 text-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Empower Your Team with Tinitiate
          </h2>
          <p>
            At <span className="font-semibold text-gray-900">Tinitiate</span>, we bring together experienced trainers
            and industry experts to deliver impactful training that unlocks your team’s potential. Our programs are
            built to strengthen both technical expertise and problem-solving skills, ensuring your workforce is ready
            to excel in real-world scenarios.
          </p>
          <p>
            We specialize in modern technologies such as{" "}
            <span className="font-medium text-gray-900">
              Microsoft Azure, Microservices, Docker &amp; Kubernetes, ASP.NET Core, MVC, Java
            </span>
            , and beyond.
          </p>
          <p>
            The primary objective of our training engagements is to enable technological transformation within your
            organization—helping you improve operational efficiency, foster innovation, and scale globally with
            confidence.
          </p>
        </div>
      </section>

      <section className="px-6 pb-12 md:pb-14">
        <div className="mx-auto max-w-7xl space-y-5 text-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Discover the Tinitiate Advantage
          </h2>
          <p>
            What sets our training apart is a focus on hands-on learning, collaboration, and peer-to-peer engagement.
            Every program is customized to your business environment, ensuring relevance and immediate applicability.
          </p>
          <p>
            Through real-time projects and interactive sessions, your teams gain not only knowledge but also the
            confidence to take on practical challenges. This experiential learning model drives long-term impact and
            sustainable growth for your organization.
          </p>
        </div>
      </section>

<section className="px-6 py-10">
  <div className="mx-auto max-w-7xl">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
      Key Features of Our Training
    </h2>

    <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {featuresData.map((item, index) => {
        const Icon = item.icon
        return (
          <div
            key={index}
            className={`
              group px-8 py-14 flex flex-col items-center text-center 
              border border-gray-200 shadow-md transition-all duration-500
              hover:-translate-y-2 hover:shadow-2xl 
              bg-gradient-to-tr from-indigo-0 to-indigo-0
              hover:from-indigo-500 hover:to-indigo-700
              rounded-tr-3xl rounded-bl-3xl
            `}
          >

            <div
              className={`
                rounded-full p-6 mb-6 transition-all duration-300 
                bg-indigo-100 text-indigo-600 
                group-hover:bg-white group-hover:text-indigo-500
              `}
            >
              <Icon className="h-12 w-12" />
            </div>

            <h3
              className={`
                text-xl font-semibold mb-4 transition-colors duration-300
                text-gray-900 group-hover:text-white
              `}
            >
              {item.title}
            </h3>

            <p
              className={`
                text-base leading-relaxed transition-colors duration-300
                text-gray-600 group-hover:text-gray-100
              `}
            >
              {item.description}
            </p>
          </div>
        )
      })}
    </div>
  </div>
</section>

<section className="px-6 py-10 bg-white">
  <div className="mx-auto max-w-7xl space-y-6 text-gray-700">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
      Discover the Transformative Potential of Tinitiate Training
    </h2>
    <p className="text-base md:text-lg leading-relaxed text-center max-w-6xl mx-auto">
      Our corporate training stands apart through a strong emphasis on practical, hands-on learning and meaningful
      peer-to-peer collaboration. Each program is customized to your organization’s unique needs and delivered
      through real-time projects—ensuring your teams gain not only knowledge but also the confidence to apply it
      in real-world challenges.
    </p>
  </div>
</section>

<section className="px-6 mt-4 pb-10">
  <div className="mx-auto max-w-7xl space-y-6 text-gray-700">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
      Why Invest in Training Your Team
    </h2>
    <p className="text-base md:text-lg leading-relaxed text-center max-w-6xl mx-auto">
      Recruiting new employees with niche skills is often expensive and time-consuming. Training your existing team,
      however, is a cost-effective way to boost capabilities, strengthen loyalty, and increase productivity. At
      <span className="font-semibold text-gray-900"> Tinitiate</span>, we provide a structured and supportive
      environment that empowers employees to achieve their full potential.
    </p>
    <p className="text-base md:text-lg leading-relaxed text-center max-w-6xl mx-auto">
      By enhancing workplace learning, organizations can close skill gaps, eliminate weaknesses, and nurture stronger
      decision-making and leadership qualities. This leads to improved efficiency, accelerated growth, and measurable
      gains in both revenue and profitability.
    </p>
  </div>
</section>

    </div>
  )
}
