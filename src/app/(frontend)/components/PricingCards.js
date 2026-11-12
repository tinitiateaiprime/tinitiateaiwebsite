"use client";

import Link from "next/link";
import {
  BookOpenCheck,
  CheckCircle2,
  Crown,
  Rocket,
} from "lucide-react";

const RUPEE = "\u20b9";

const pricingPlans = [
  {
    key: "spark",
    title: "The Spark",
    shortName: "Spark",
    tagline: "Learn \u00b7 Practice \u00b7 Build",
    price: `${RUPEE}50K + GST`,
    salary: "No Salary/Stipend",
    freeTrial: "2 Free Sessions",
    bestFor: "Beginners, career switchers, foundation",
    programDetails: ["3 Months Learning"],
    benefits: [
      "Python Full Stack with Gen AI basics",
      "Java Full Stack with Gen AI basics",
      "HTML, CSS, JavaScript fundamentals",
      "Git & GitHub version control",
      "SQL basics (MySQL/PostgreSQL)",
      "Basic REST API concept",
      "Tinitiate Training Certificate",
    ],
    tags: ["Beginner Friendly", "Guided"],
    
    icon: BookOpenCheck,
    color: "#1f5fae",
    textColor: "#1f5fae",
    borderColor: "#86a9d8",
    headerGradient:
      "linear-gradient(135deg,#07182f 0%,#123f79 45%,#1f5fae 100%)",
    bodyGradient:
      "linear-gradient(180deg,#ffffff 0%,#f6f9ff 58%,#eef5ff 100%)",
    priceGradient:
      "linear-gradient(135deg,#ffffff 0%,#f7fbff 55%,#e8f1ff 100%)",
    glow: "rgba(31,95,174,0.38)",
  },
  {
    key: "prime",
    title: "The Prime",
    shortName: "Prime",
    tagline: "Build \u00b7 Earn \u00b7 Experience",
    price: `${RUPEE}99K + GST`,
    salary: `Earn ${RUPEE}10K/month during R&D`,
    freeTrial: "2 Sessions Free Trial",
    bestFor: "Knows basics, wants real projects",
    programDetails: ["3 Months Learning", "3 Months Paid R&D"],
    benefits: [
      "Everything in Spark, plus:",
      "React.js / Node.js (MERN basics)",
      "Advanced Gen AI integration (LangChain, OpenAI/Claude APIs)",
      "Docker fundamentals",
      "Postman & API testing",
      "Agile/Scrum exposure",
      "Cloud basics (AWS/Azure fundamentals)",
      "Tinitiate Training Certificate",
    ],
    tags: ["Interview Ready", "Earn Salary"],
    
    icon: Rocket,
    color: "#b98519",
    textColor: "#9a6100",
    borderColor: "#ddb85d",
    headerGradient:
      "linear-gradient(135deg,#171100 0%,#6f4300 42%,#c79225 100%)",
    bodyGradient:
      "linear-gradient(180deg,#ffffff 0%,#fffaf0 56%,#fff3d1 100%)",
    priceGradient:
      "linear-gradient(135deg,#ffffff 0%,#fffaf0 58%,#ffefbd 100%)",
    glow: "rgba(199,146,37,0.46)",
    featured: true,
  },
  {
    key: "apex",
    title: "The Apex",
    shortName: "Apex",
    tagline: "Work \u00b7 Lead \u00b7 Succeed",
    price: `${RUPEE}199K + GST`,
    salary: `${RUPEE}10K/month as Trainee Software Engineer`,
    freeTrial: "2 Sessions Free Trial",
    bestFor: "Serious learners, job readiness",
    programDetails: ["6 Months On-job Training", "3 Months R&D"],
    benefits: [
      "Everything in Prime, plus:",
      "Microservices architecture",
      "CI/CD pipelines (Jenkins/GitHub Actions)",
      "Kubernetes & containerization",
      "Advanced cloud deployment (AWS/Azure full stack)",
      "System design fundamentals",
      "Code review & production debugging practices",
      "Tinitiate Training Certificate",
    ],
    tags: ["Job From Day 1", "Career Security"],
   
    icon: Crown,
    color: "#b9223a",
    textColor: "#b9223a",
    borderColor: "#dc7481",
    headerGradient:
      "linear-gradient(135deg,#1f0711 0%,#6b1730 44%,#c6283c 100%)",
    bodyGradient:
      "linear-gradient(180deg,#ffffff 0%,#fff7f8 58%,#ffecee 100%)",
    priceGradient:
      "linear-gradient(135deg,#ffffff 0%,#fff7f8 58%,#ffe2e7 100%)",
    glow: "rgba(185,34,58,0.42)",
  },
];

const comparisonRows = [
  {
    focus: "Pathway Fee",
    spark: `${RUPEE}50K + GST`,
    prime: `${RUPEE}99K + GST`,
    apex: `${RUPEE}199K + GST`,
  },
  {
    focus: "Salary/Stipend",
    spark: "No Salary/Stipend",
    prime: `Earn ${RUPEE}10K/month during R&D`,
    apex: `${RUPEE}10K/month as Trainee Software Engineer`,
  },
  {
    focus: "Free Trial",
    spark: "2 Free Sessions",
    prime: "2 Sessions Free Trial",
    apex: "2 Sessions Free Trial",
  },
  {
    focus: "Best For",
    spark: "Beginners, career switchers, foundation",
    prime: "Knows basics, wants real projects",
    apex: "Serious learners, job readiness",
  },
  {
    focus: "Program Details",
    spark: "3 Months Learning",
    prime: "3 Months Learning + 3 Months Paid R&D",
    apex: "6 Months On-job Training + 3 Months R&D",
  },
  {
    focus: "Tags",
    spark: "Beginner Friendly + Guided",
    prime: "Interview Ready + Earn Salary",
    apex: "Job From Day 1 + Career Security",
  },
];

function SectionBlock({ title, color, children, className = "" }) {
  return (
    <section
      className={[
        "border-t border-[#dfe8f2] pt-4",
        className,
      ].join(" ")}
    >
      <div
        className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em]"
        style={{ color }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        {title}
      </div>
      <div>{children}</div>
    </section>
  );
}

function InfoTile({ label, value, color, variant = "cool" }) {
  const isCool = variant === "cool";
  return (
    <div
      className={[
        "flex min-h-[82px] flex-col justify-center rounded-[1rem] border bg-white/78 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_38px_-34px_rgba(15,23,42,0.68)] backdrop-blur dark:bg-slate-900/78",
      ].join(" ")}
      style={{
        borderColor: `${color}${isCool ? "45" : "38"}`,
        background: isCool
          ? `linear-gradient(135deg,${color}14 0%,rgba(255,255,255,0.82) 100%)`
          : "linear-gradient(135deg,#fff8e3 0%,rgba(255,255,255,0.84) 100%)",
      }}
    >
      <p
        className="text-[10px] font-black uppercase tracking-[0.14em]"
        style={{ color: isCool ? color : "#9a6100" }}
      >
        {label}
      </p>
      <p className="pricing-plan-title mt-1 text-sm font-extrabold leading-6 text-[#13233a]">
        {value}
      </p>
    </div>
  );
}

function PricingCard({ plan, compact = false }) {
  const Icon = plan.icon;

  return (
    <article
      className={[
        "pricing-plan-card group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border bg-white shadow-[0_30px_90px_-58px_rgba(15,23,42,0.78)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_38px_105px_-60px_rgba(15,23,42,0.9)] dark:bg-slate-950",
        compact ? "min-h-[820px]" : "min-h-[860px]",
      ].join(" ")}
      style={{
        borderColor: plan.borderColor,
        background: plan.bodyGradient,
        boxShadow: `0 34px 92px -54px ${plan.glow}, 0 18px 44px -42px rgba(15,23,42,0.62)`,
      }}
    >
      <header
        className="pricing-plan-header relative overflow-hidden px-5 py-5 text-white sm:px-6 sm:py-6"
        style={{ backgroundImage: plan.headerGradient }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.05)_34%,rgba(255,255,255,0.16)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex min-h-7 flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/[0.18] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white ring-1 ring-white/[0.24] backdrop-blur">
                Tinitiate AI Pathway
              </span>
              {plan.featured ? (
                <span className="pricing-plan-popular rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#7a4d00] shadow-[0_10px_24px_-18px_rgba(0,0,0,0.85)]">
                  Popular
                </span>
              ) : null}
            </div>
            <h3 className="text-3xl font-black leading-tight tracking-normal text-white">
              {plan.title}
            </h3>
            <p className="pricing-plan-tagline mt-2 whitespace-nowrap text-[13px] font-bold leading-6 text-white/[0.88] sm:text-sm">
              {plan.tagline}
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.18] text-white ring-1 ring-white/[0.26] shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_18px_42px_-32px_rgba(0,0,0,0.75)] backdrop-blur">
            <Icon className="h-6 w-6" />
          </span>
        </div>
      </header>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div
          className="rounded-[1.05rem] border border-white/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_20px_46px_-36px_rgba(15,23,42,0.82)] dark:border-slate-800 dark:bg-slate-900"
          style={{ background: plan.priceGradient }}
        >
          <p className="pricing-plan-muted text-[11px] font-black uppercase tracking-[0.16em] text-[#7f93b0]">
            Pathway Fee
          </p>
          <p className="pricing-plan-title mt-2 text-4xl font-black leading-none text-[#13233a]">
            {plan.price}
          </p>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <InfoTile label="Salary/Stipend" value={plan.salary} color={plan.color} />
          <InfoTile label="Free Trial" value={plan.freeTrial} color={plan.color} variant="warm" />
        </div>

        <SectionBlock title="Best For" color={plan.color} className="mt-4">
          <p className="pricing-plan-copy text-sm font-semibold leading-6 text-[#26364d]">
            {plan.bestFor}
          </p>
        </SectionBlock>

        <SectionBlock title="Program Details" color={plan.color} className="mt-4">
          <div className="grid gap-2">
            {plan.programDetails.map((item) => (
              <div
                key={item}
                className="pricing-plan-copy flex items-center gap-2 text-sm font-semibold leading-6 text-[#26364d]"
              >
                <CheckCircle2
                  className="h-4 w-4 shrink-0"
                  style={{ color: plan.textColor }}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="What You Get" color={plan.color} className="mt-4">
          <div className="grid gap-2.5">
            {plan.benefits.map((benefit) => (
              <div
                key={benefit}
                className="pricing-plan-copy grid grid-cols-[1rem_1fr] gap-2 text-[13px] font-semibold leading-5 text-[#26364d] sm:text-sm sm:leading-6"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: plan.textColor }}
                />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="Tags" color={plan.color} className="mt-4">
          <div className="flex flex-wrap gap-2">
            {plan.tags.map((tag) => (
              <span
                key={tag}
                className="pricing-plan-tag inline-flex min-h-8 items-center rounded-full border bg-white px-3 py-1 text-xs font-black text-[#13233a]"
                style={{ borderColor: `${plan.color}66` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </SectionBlock>

        
      </div>
    </article>
  );
}

export function PricingCardsDeck({ compact = false }) {
  return (
    <div className="mt-9 grid items-stretch gap-5 lg:grid-cols-3">
      {pricingPlans.map((plan) => (
        <PricingCard key={plan.key} plan={plan} compact={compact} />
      ))}
    </div>
  );
}

export function PricingComparisonTable({ className = "" }) {
  return (
    <div
      className={[
        "overflow-hidden rounded-[1.15rem] border border-[#d8e2ee] bg-white shadow-[0_24px_70px_-56px_rgba(15,23,42,0.72)] dark:border-slate-700 dark:bg-slate-900",
        className,
      ].join(" ")}
    >
      <div className="grid gap-2 border-b border-[#e3ebf4] p-5 text-center dark:border-slate-700 sm:text-left lg:grid-cols-[1.1fr_1.9fr] lg:items-center">
        <div>
          <h3 className="text-2xl font-black text-[#13233a] dark:text-white">
            Compare plans
          </h3>
          <p className="mt-2 text-sm font-medium leading-6 text-[#607089] dark:text-slate-300">
            The same spreadsheet details in a quick scan table.
          </p>
        </div>
        
      </div>

      <div className="lg:hidden">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-[#f7fafc] dark:bg-slate-950">
              <th className="w-[27%] border-b border-r border-[#e3ebf4] px-2 py-3 text-left text-[9px] font-black uppercase tracking-[0.1em] text-[#7f93b0] dark:border-slate-700">
                Focus
              </th>
              {pricingPlans.map((plan) => (
                <th
                  key={plan.key}
                  className="border-b border-r border-[#e3ebf4] px-1.5 py-3 text-center text-[9px] font-black uppercase tracking-[0.08em] text-[#13233a] last:border-r-0 dark:border-slate-700 dark:text-white"
                >
                  {plan.shortName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.focus}>
                <th
                  scope="row"
                  className="border-b border-r border-[#edf2f7] px-2 py-3 text-left align-top text-[10px] font-black leading-4 text-[#13233a] last:border-b-0 dark:border-slate-700 dark:text-white"
                >
                  {row.focus}
                </th>
                {[row.spark, row.prime, row.apex].map((value, index) => (
                  <td
                    key={`${row.focus}-${index}`}
                    className="border-b border-r border-[#edf2f7] px-1.5 py-3 text-center align-top text-[9px] font-semibold leading-4 text-[#53677d] last:border-r-0 dark:border-slate-700 dark:text-slate-300 min-[390px]:text-[10px]"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="hidden lg:block">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-[#f7fafc] dark:bg-slate-950">
              <th className="w-[22%] border-b border-r border-[#e3ebf4] px-5 py-4 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#7f93b0] dark:border-slate-700">
                Focus
              </th>
              {pricingPlans.map((plan) => (
                <th
                  key={plan.key}
                  className="border-b border-r border-[#e3ebf4] bg-[#f7fafc] px-5 py-4 text-center text-xs font-black uppercase tracking-[0.12em] text-[#13233a] last:border-r-0 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  {plan.shortName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.focus}>
                <th
                  scope="row"
                  className="border-b border-r border-[#edf2f7] px-5 py-4 text-left text-sm font-black text-[#13233a] last:border-b-0 dark:border-slate-700 dark:text-white"
                >
                  {row.focus}
                </th>
                {[row.spark, row.prime, row.apex].map((value, index) => (
                  <td
                    key={`${row.focus}-${index}`}
                    className="border-b border-r border-[#edf2f7] px-5 py-4 text-center text-sm font-semibold leading-6 text-[#53677d] last:border-r-0 dark:border-slate-700 dark:text-slate-300"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PricingCardsShowcase({
  heading = "Compare Spark, Prime, and Apex pricing",
  description = "Use the cards and comparison table after the skill check to see the fee, support, earning path, and program outcome clearly.",
  compact = false,
}) {
  return (
    <div className="mx-auto mt-9 max-w-[1360px]">
      <div className="mx-auto max-w-5xl text-center">
        <h3 className="text-balance text-3xl font-extrabold leading-tight text-[#12345f] dark:text-white sm:text-4xl lg:whitespace-nowrap lg:text-[2.8rem]">
          {heading}
        </h3>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#c9a227]" />
        <p className="mx-auto mt-4 max-w-3xl text-pretty text-sm font-medium leading-7 text-[#53677d] dark:text-slate-300 sm:text-base">
          {description}
        </p>
      </div>

      <PricingCardsDeck compact={compact} />
      <PricingComparisonTable className="mt-8" />
    </div>
  );
}

export { pricingPlans };
