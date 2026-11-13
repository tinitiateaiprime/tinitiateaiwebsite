"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { motion, useInView, AnimatePresence, MotionConfig } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import { Briefcase, BookOpen, Code2, Brain, Cloud, BarChart3, Layers, Smartphone, Settings, ShoppingCart, ShieldCheck, Factory, Truck, Plane, Hospital, ClipboardCheck, FileText, UserCheck } from "lucide-react";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 1, y: 24 },
  show: { opacity: 1, y: 0 },
};

function ScrollReveal({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
    amount: 0.2
  });

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={{
        opacity: 1,
        y: isInView ? 0 : 24,
      }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

const careerSupport = [
  {
    icon: Briefcase,
    title: "IT Career Guidance",
    description:
      "Personalized guidance from industry experts to align your goals with real-world IT roles.",
    href: "/it-career-guidance",
  },
  {
    icon: BookOpen,
    title: "Basics to Advanced Learning",
    description:
      "Step-by-step learning paths from fundamentals to advanced technologies.",
    href: "/basics-to-advanced-learning",
  },
  {
    icon: Code2,
    title: "Hands-On Coding Practice",
    description:
      "Daily coding challenges, real projects, and practice labs for skill building.",
    href: "/hands-on-coding-exercises",
  },
  {
    icon: ClipboardCheck,
    title: "Mock Interviews",
    description:
      "Real interview simulations to boost confidence and improve performance.",
    href: "/mock-interviews",
  },
  {
    icon: FileText,
    title: "Resume Building",
    description:
      "Professional resume creation tailored for IT job applications.",
    href: "/resume-building",
  },
  {
    icon: UserCheck,
    title: "Job Placement Support",
    description:
      "End-to-end placement assistance with interview scheduling and referrals.",
    href: "/job-placement-support",
  },
];

function HeroSection() {

  const slides = [
    {
      image: "/azure/images/courses/python.png",
      title: "PYTHON",
      heading: "Redefine Your Professional Trajectory with Python",
      points: [
        "Master Logic to Advanced Architecture",
        "Exclusive Gateway to Premium Hiring",
        "Build High-Stakes Industry Projects",
        "Elite Mentorship to the Finish Line",
        "Your Future, Engineered to Lead",
        "100% Career Transition Support",
      ],
      roles: [
        "Python Web Developer",
        "Software Engineer",
        "Fullstack developer",
        "Backend developer",
        "Frontend developer",
        "Web Developer",
      ],
    },

    {
      image: "/azure/images/courses/js.png",
      title: "JAVASCRIPT",
      heading: "JavaScript: Build the Web",
      points: [
        "Master Async Logic & DOM Orchestration",
        "Build Fast, Responsive Digital Products",
        "Write Clean, Scalable Industry Code",
        "Career-Ready Training for the Modern Era",
        "Your Evolution into a Lead Web Developer",
      ],
      roles: [
        "Frontend Developer",
        "Web Developer",
        "Mobile App Developer",
        "Backend Engineer",
        "Cloud Developer",
        "DevOps Engineer",
      ],
    },

    {
      image: "/azure/Typescript.png",
      title: "TYPESCRIPT",
      heading: "TypeScript: Scale Your Potential",
      points: [
        "Master Type-Safe Logic & Class Systems",
        "Fast-Track Your Path to Senior Developer Status",
        "Build Secure, Fail-Proof Applications",
        "Accelerate Your Path to Lead Engineer",
        "Future-Proof Your Professional Career",
      ],
      roles: [
        "QA Automation Engineer",
        "Software Architect",
        "Tooling Engineer",
        "Site Reliability Engineer",
        "Systems Programmer",
        "Solutions Architect",
      ],
    },

    {
      image: "/azure/images/courses/java.png",
      title: "JAVA",
      heading: "Java: The Enterprise Engine",
      points: [
        "Command Core Logic & Advanced OOP",
        "Fast-Track to High-Stability Tech Careers",
        "Engineer Resilient, Multi-Threaded Apps",
        "Master Professional Industry Standards",
        "Your Entry into Corporate Engineering",
      ],
      roles: [
        "Java Full Stack developer",
        "Web Developer",
        "Software Engineer",
        "Backend developer",
        "Frontend developer",
        "UI Developer",
      ],
    },
  ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % 4);
    }, 6500);

    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div>
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-black text-white">

        <AnimatePresence mode="wait">
          <motion.div
            key={slides[index].image}
            className="absolute left-10 top-1/2 -translate-y-1/2 w-[40%] h-[60%] hidden md:block bg-contain bg-no-repeat bg-center z-0"
            style={{
              backgroundImage: `url(${slides[index].image})`,
            }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-black to-purple-900 opacity-70 z-10" />

        <div className="relative z-20 w-full py-16 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

          <div></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 1 }}
            >

              <h1 className="text-2xl text-blue-400 font-bold mb-2">
                {slides[index].title}
              </h1>

              <h2 className="text-3xl md:text-1xl mb-6">
                {slides[index].heading}
              </h2>

              <ul className="mb-6 space-y-2 text-gray-400">
                {slides[index].points.map((p, i) => (
                  <li key={i}>• {p}</li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold mb-2">
                Career Outcomes:
              </h3>

              <div className="flex flex-wrap gap-2 mb-6">
                {slides[index].roles.map((role, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/10 rounded-full text-sm"
                  >
                    {role}
                  </span>
                ))}
              </div>

              <Link
                href="/request-callback"
                className="inline-block px-8 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition"
              >
                Get Started
              </Link>

            </motion.div>
          </AnimatePresence>

        </div>
        <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-3">
          <button type="button" aria-label={paused ? 'Play hero slides' : 'Pause hero slides'} onClick={() => setPaused(!paused)} className="rounded-full border border-white/40 bg-slate-950/70 px-4 py-2 text-sm">{paused ? 'Play' : 'Pause'}</button>
          <button type="button" aria-label="Next hero slide" onClick={() => setIndex(previous => (previous + 1) % slides.length)} className="rounded-full border border-white/40 bg-slate-950/70 px-4 py-2 text-sm">Next</button>
        </div>
      </section>
    </div>
  );
}

function SolutionsSection() {
  const items = [
    { title: "AI Chatbots", icon: Brain },
    { title: "Cloud Services", icon: Cloud },
    { title: "Data Analytics", icon: BarChart3 },
    { title: "Full Stack Dev", icon: Layers },
    { title: "Mobile Apps", icon: Smartphone },
    { title: "DevOps", icon: Settings },
  ];

  return (
    <ScrollReveal> 
      <section className="py-20 bg-white text-gray-800"> 
        <div className="max-w-7xl mx-auto px-6">

          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Our AI & IT Solutions
            </h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-10"
          >

            {items.map((item) => {
              const Icon = item.icon; // ✅ FIXED

              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="flex items-start gap-5"
                >
                  <Icon className="w-6 h-6" /> 
                  <h3>{item.title}</h3>
                </motion.div>
              );
            })}

          </motion.div>

        </div>
      </section>
    </ScrollReveal>
  );
}

export default function AzureHome({ children }) {
  const router = useRouter();

  return (
    <MotionConfig reducedMotion="user"><div className="text-gray-800">

      <HeroSection />
{children}

<ScrollReveal> 
<section className="py-16 px-6 bg-white">
  <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
    Why to Choose TINITIATE?
  </h2>

  <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">

    {[
      {
        icon: Briefcase,
        title: "Industry Expert Trainers",
        desc: "Learn from professionals with real-time experience in top IT companies.",
      },
      {
        icon: Code2,
        title: "Hands-On Project Learning",
        desc: "Build real-world projects that make your portfolio job-ready.",
      },
      {
        icon: Brain,
        title: "Practical AI Learning",
        desc: "Explore AI tools through guided practice and project-based learning.",
      },
      {
        icon: BookOpen,
        title: "Career Guidance",
        desc: "Personal mentorship and step-by-step career roadmap support.",
      },
      {
        icon: ClipboardCheck,
        title: "Mock Interviews",
        desc: "Real interview practice sessions to improve confidence and performance.",
      },
      {
        icon: UserCheck,
        title: "Placement Assistance",
        desc: "Resume building, referrals, and end-to-end job support.",
      },
    ].map((item, i) => {
      const Icon = item.icon;

      return (
        <div
          key={i}
          className="group bg-gray-50 border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 rounded-2xl p-6"
        >

          <div className="w-12 h-12 mb-4 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Icon className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
            {item.title}
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed">
            {item.desc}
          </p>
        </div>
      );
    })}
  </div>
</section>
</ScrollReveal>

      <SolutionsSection />

<ScrollReveal> 
<section className="py-24 px-6 bg-white">
  <div className="max-w-7xl mx-auto">

    <div className="text-center mb-16">
      <h2 className="text-4xl font-semibold text-gray-900">
        Industries We Serve
      </h2>
      <p className="text-gray-500 mt-3 max-w-xl mx-auto">
        We build scalable solutions across multiple industries with innovation and precision
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

      {[
        { name: "Technology", icon: Code2 },
        { name: "E-Commerce", icon: ShoppingCart },
        { name: "Insurance", icon: ShieldCheck },
        { name: "Logistics", icon: Truck },
        { name: "Travel", icon: Plane },
        { name: "Education", icon: BookOpen },
        { name: "Hospital", icon: Hospital },
        { name: "Manufacturing", icon: Factory },
      ].map(({ name, icon: Icon }) => (

        <div
          key={name}
          className="group bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        >

          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-gray-200 mb-4 group-hover:bg-blue-50 transition">
            <Icon className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition" />
          </div>

          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600">
            {name}
          </h3>

        </div>

      ))}

    </div>
  </div>
</section>
</ScrollReveal>

      <ScrollReveal>
       <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-10">
          Career Support
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {careerSupport.map(({ icon: Icon, title, description, href }) => (
            <div
              key={title}
              className="bg-white p-6 rounded-xl shadow text-center cursor-pointer"
              onClick={() => router.push(href)}
              role="link" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") router.push(href) }}
            >
              <Icon className="mx-auto mb-3 text-blue-600 w-7 h-7" />
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </section>
      </ScrollReveal>

    <ScrollReveal>
  <section className="py-16 text-center">

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: false }}
    >

      <Link
        href="/request-callback"
        className="relative inline-block px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg 
                   transition-all duration-300 hover:scale-105 hover:shadow-xl"
      >

        <span className="absolute inset-0 rounded-lg bg-blue-500 opacity-0 blur-md 
                         transition duration-300 hover:opacity-30"></span>

        <span className="relative z-10">
          Get Started Today
        </span>
      </Link>

    </motion.div>

  </section>
</ScrollReveal>

    </div></MotionConfig>
  );
}
