"use client";

import Image from "next/image";
import Link from "next/link";
import AiDevelopBanner from "./AiDevelopBanner";
import { SiReact, SiNextdotjs, SiAngular, SiSnowflake } from "react-icons/si";
import { FaAws, FaJava } from "react-icons/fa6";
import {
  FiArrowRight,
  FiPhone,
  FiBarChart2,
  FiCheckCircle,
  FiZap,
  FiStar,
  FiCpu,
  FiTool,
  FiBookOpen,
} from "react-icons/fi";

import { HiSparkles as FiSparkles } from "react-icons/hi";
import { RiRobot2Line } from "react-icons/ri"
const HERO = {
  title: "Professional Training",
  subtitle:
    "Deep-dive programs for working professionals and serious learners in Databases, Cloud, DevOps, Web, Data Engineering, Analytics, and AI.",
  badge: "Professional Training • TINITIATE",
};

function safeHref(href, fallback = "/training/professional-training") {
  if (typeof href !== "string") return fallback;
  const h = href.trim();
  if (!h) return fallback;
  if (h.includes("undefined") || h.includes("null")) return fallback;
  return h;
}

function makeMapByKey(items) {
  return items.reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, {});
}

const HERO_TECH_REGISTRY = [
  { key: 'course', name: 'Course', Icon: FiBookOpen, color: 'text-blue-600' },
  { key: "Java", name: "Java", Icon: FaJava, color: "text-red-500" },
  { key: "react", name: "React", Icon: SiReact, color: "text-cyan-500" },
  { key: "next", name: "Next.js", Icon: SiNextdotjs, color: "text-slate-900" },
  { key: "angular", name: "Angular", Icon: SiAngular, color: "text-red-500" },

  { key: "aws", name: "AWS", Icon: FaAws, color: "text-amber-400" },
  { key: "snowflake", name: "Snowflake", Icon: SiSnowflake, color: "text-sky-500" },

  { key: "azure", name: "Azure", Icon: null, img: "/azure/images/courses/microsoftAzure.png" },
  { key: "gcp", name: "Google Cloud", Icon: null, img: "/azure/images/courses/google-cloud.png" },

  { key: "visualization", name: "Visualization", Icon: FiBarChart2, color: "text-blue-600" },
];

const HERO_TECH_MAP = makeMapByKey(HERO_TECH_REGISTRY);

const FEATURE_ICON_REGISTRY = [
  { key: "zap", Icon: FiZap },
  { key: "cpu", Icon: FiCpu },
  { key: "tool", Icon: FiTool },
  { key: "check", Icon: FiCheckCircle },
  { key: "barChart", Icon: FiBarChart2 },
  { key: "robot", Icon: RiRobot2Line  },
];

const FEATURE_ICON_MAP = FEATURE_ICON_REGISTRY.reduce((acc, item) => {
  acc[item.key] = item.Icon;
  return acc;
}, {});

const AI_TOOL_REGISTRY = [
  {
    key: "prompt-engineering",
    label: "Prompt Engineering",
    iconKey: "zap",
    iconClass: "text-indigo-600",
  },
  {
    key: "generative-ai",
    label: "Generative AI",
    iconKey: "cpu",
    iconClass: "text-violet-600",
  },
  {
    key: "agentic-ai",
    label: "Agentic AI",
    iconKey: "robot",
    iconClass: "text-sky-600",
  },
  {
    key: "hands-on-projects",
    label: "Hands-on Projects",
    iconKey: "check",
    iconClass: "text-emerald-600",
  },
  {
    key: "machine-learning",
    label: "Machine Learning",
    iconKey: "barChart",
    iconClass: "text-rose-600",
  },
  {
    key: "llm-evaluation",
    label: "LLM Evaluation",
    iconKey: "check",
    iconClass: "text-amber-600",
  },
];

const AI_TOOL_MAP = makeMapByKey(AI_TOOL_REGISTRY);

function resolveAiTools(aiToolKeys) {
  if (!Array.isArray(aiToolKeys)) return [];
  return aiToolKeys.map((k) => AI_TOOL_MAP[k]).filter(Boolean);
}

function HeroMark({ techKey, size = 64 }) {
  const t = HERO_TECH_MAP[techKey];
  if (!t) return null;

  if (typeof t.Icon === "function") {
    const I = t.Icon;
    return <I className={t.color || "text-slate-700"} style={{ width: size, height: size }} />;
  }

  if (t.img) {
    return <Image src={t.img} alt={t.name} width={size} height={size} className="object-contain" />;
  }

  return (
    <div
      className="flex items-center justify-center rounded-2xl bg-gray-200 text-xs text-gray-700"
      style={{ width: size, height: size }}
      title={t.name}
    >
      ?
    </div>
  );
}







function Container({ children }) {
  return <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function SectionHeader({ title, subtitle, kicker }) {
  return (
    <div className="flex flex-col gap-2">
      {kicker ? (
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          {kicker}
        </div>
      ) : null}

      <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">{title}</h2>
      {subtitle ? <p className="text-sm text-gray-600 md:text-base">{subtitle}</p> : null}
    </div>
  );
}

function CourseCard({
  title,
  description,
  href,
  heroTech,
  premium = false,
  aiIncluded = false,
  aiToolKeys = [],
}) {
  const finalHref = safeHref(href);
  const includedItems = resolveAiTools(aiToolKeys);

  return (
<div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-sm ring-1 ring-indigo-100 transition duration-200 hover:-translate-y-1 hover:shadow-xl">

  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-indigo-100/40 to-transparent" />
    <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-indigo-200/40 blur-2xl" />
    <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-sky-200/30 blur-2xl" />
  </div>

  <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-sky-50">

    <div className="absolute inset-x-3 top-3 z-20 flex items-center justify-between gap-2">
      {aiIncluded ? (
        <div className="inline-flex min-w-0 items-center gap-1 rounded-full border border-indigo-200 bg-white/90 px-3 py-1 text-[11px] font-semibold text-indigo-700 shadow-sm backdrop-blur">
          <FiSparkles className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">AI Included</span>
        </div>
      ) : (
        <div />
      )}

      {premium ? (
        <div className="inline-flex min-w-0 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700 shadow-sm">
          <FiStar className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Premium</span>
        </div>
      ) : null}
    </div>

    <div className="relative mt-4 flex h-28 w-28 items-center justify-center rounded-3xl border border-indigo-200 bg-white shadow-sm ring-1 ring-white">
      <HeroMark techKey={heroTech} size={74} />
    </div>
  </div>

  <div className="flex grow flex-col p-6">
    <div className="min-h-[76px]">
      <h3 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-5 text-gray-600">{description}</p>
    </div>

    <div className="mt-2 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-white p-3">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100">
          <FiStar className="h-3.5 w-3.5 text-indigo-700" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-800">
          Included in this course
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {includedItems.map((item) => {
          const Icon = FEATURE_ICON_MAP[item.iconKey] || FiCheckCircle;
          return (
            <li
              key={`${title}-${item.key}`}
              className="flex items-center gap-2 rounded-lg border border-white bg-white px-2.5 py-2 text-xs font-medium text-gray-700 shadow-sm"
            >
              <Icon className={`h-4 w-4 shrink-0 ${item.iconClass}`} />
              <span className="truncate">{item.label}</span>
            </li>
          );
        })}
      </ul>
    </div>

    <div className="mt-auto pt-5">
      <Link
        href={finalHref}
        prefetch={false}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
      >
        View Course
        <FiArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  </div>
</div>
  );
}

export default function ProfessionalOverview({ courses }) {
  const items = courses.map(course => ({
    key: course.slug, courseKey: course.slug, title: course.title,
    description: course.shortDescription, premium: course.isPremium,
    heroTech: /\bjava\b/i.test(course.title) ? 'Java' : /react/i.test(course.title) ? 'react'
      : /next\.js/i.test(course.title) ? 'next' : /angular/i.test(course.title) ? 'angular'
      : /aws|amazon/i.test(course.title) ? 'aws' : /azure/i.test(course.title) ? 'azure'
      : /snowflake/i.test(course.title) ? 'snowflake' : /google|gcp/i.test(course.title) ? 'gcp' : 'course',
    tag: course.level, aiIncluded: false, aiToolKeys: [],
  }))
  const STACK_COURSES = items.filter(c => !/data|cloud|visual|analytics/i.test(c.title))
  const DATA_ENGINEERING_PACKAGES = items.filter(c => /data|cloud/i.test(c.title))
  const Visualization = items.filter(c => !/data|cloud/i.test(c.title) && /visual|analytics/i.test(c.title))
  return (
    <div className="bg-white text-gray-900">
            <section className="bg-white py-5">
        <Container>
          <AiDevelopBanner
            title="Develop with AI"
            subtitle="Learn modern development workflows with ChatGPT, Claude, and Copilot for prompting, coding, debugging, architecture, and project delivery."
          />
        </Container>
      </section>

      <section className="relative overflow-hidden bg-black">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 left-1/2 h-72 w-[60rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.18),transparent_35%)]" />
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />
        </div>

        <Container>
          <div className="relative py-16 sm:py-20">
            <div className="flex flex-col items-start gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-200">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.65)]" />
                {HERO.badge}
                <span className="mx-2 h-3 w-px bg-slate-600" />
                <span className="font-semibold text-emerald-300">Online Training</span>
              </span>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                <span className="bg-gradient-to-r from-white via-white to-indigo-200 bg-clip-text text-transparent">
                  {HERO.title}
                </span>
              </h1>

              <p className="max-w-2xl text-sm text-slate-200 md:text-base">{HERO.subtitle}</p>

              <div className="mt-1 flex flex-wrap items-center gap-4">
                <Link
                  href="/request-callback"
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition"
                >
                  Schedule a counselling call <FiPhone className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                <HeroBenefit text="Mentor-led" />
                <HeroBenefit text="Hands-on Projects" />
                <HeroBenefit text="Interview Prep" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-gray-50 py-16">
        <Container>
          <SectionHeader
            kicker=""
            title="Full-Stack Development"
            subtitle="Pick a track and start building production-ready skills with guided projects."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STACK_COURSES.map((course) => (
              <CourseCard
                key={course.courseKey}
                title={course.title}
                description={course.description}
                heroTech={course.heroTech}
                href={`/courses/${course.courseKey}`}
                tag={course.tag}
                premium={course.premium}
                aiIncluded={course.aiIncluded}
                aiToolKeys={course.aiToolKeys}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16">
        <Container>
          <SectionHeader
            kicker=""
            title="Data Engineering"
            subtitle="Choose your track based on the target platform: AWS, Snowflake, Azure, or GCP."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DATA_ENGINEERING_PACKAGES.map((pkg) => (
              <CourseCard
                key={pkg.key}
                title={pkg.title}
                description={pkg.description}
                heroTech={pkg.heroTech}
                href={`/courses/${pkg.key}`}
                tag={pkg.tag}
                premium={pkg.premium}
                aiIncluded={pkg.aiIncluded}
                aiToolKeys={pkg.aiToolKeys}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-gray-50 py-16">
        <Container>
          <SectionHeader
            kicker=""
            title="Visualization"
            subtitle="Build dashboarding & BI skills with QuickSight and Power BI—turn data into clear, decision-ready insights."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Visualization.map((pkg) => (
              <CourseCard
                key={pkg.key}
                title={pkg.title}
                description={pkg.description}
                heroTech={pkg.heroTech}
                href={`/courses/${pkg.key}`}
                tag={pkg.tag}
                premium={pkg.premium}
                aiIncluded={pkg.aiIncluded}
                aiToolKeys={pkg.aiToolKeys}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-7 sm:p-8">
            <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h4 className="text-lg font-extrabold text-gray-900">
                  Want a personalized study plan?
                </h4>
                <p className="mt-1 text-sm text-gray-700">
                  Tell us your goals—career switch, upskilling, or interview prep—and we’ll map the path.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                </div>
              </div>

              <Link
                href="/request-callback"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                <FiPhone className="h-4 w-4" />
                Request a Callback
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

function HeroBenefit({ text }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">
      {text}
    </span>
  );
}


