import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  GraduationCap,
  Layers3,
  LineChart,
  Plus,
  Target,
} from "lucide-react";
import { PricingCardsDeck, PricingComparisonTable } from "../components/PricingCards";

export const metadata = {
  title: "Pricing | Tinitiate AI Solutions",
  description:
    "Compare Tinitiate Spark, Prime, and Apex pathway fees, GST, project work, R&D phases, stipend/salary support, and completion proof.",
};

const stageGuide = [
  {
    title: "Starting out",
    plan: "The Spark",
    detail:
      "A beginner-friendly guided path for 3 months of learning and core full-stack foundations.",
    icon: GraduationCap,
  },
  {
    title: "Earning in R&D",
    plan: "The Prime",
    detail:
      "Learning plus paid R&D, with Rs.10K/month during the R&D phase.",
    icon: Layers3,
  },
  {
    title: "Work-experience path",
    plan: "The Apex",
    detail:
      "On-job training, R&D work, job readiness, and Rs.10K/month as a Trainee Software Engineer.",
    icon: BriefcaseBusiness,
  },
];

const included = [
  {
    title: "Full Stack Tracks",
    detail:
      "Python Full Stack with Gen AI and Java Full Stack with Gen AI foundations start in Spark and grow by tier.",
    icon: Target,
  },
  {
    title: "Modern Tooling",
    detail:
      "Prime adds MERN basics, advanced Gen AI integration, Docker, API testing, Agile/Scrum, and cloud basics.",
    icon: ClipboardList,
  },
  {
    title: "R&D And Work Rhythm",
    detail:
      "Prime includes paid R&D time; Apex adds 6 months on-job training and Trainee Software Engineer support.",
    icon: BadgeCheck,
  },
  {
    title: "Career Proof",
    detail:
      "All plans include a Tinitiate Training Certificate, with deeper production-readiness skills in higher tiers.",
    icon: LineChart,
  },
];

const processSteps = [
  {
    title: "Tell us your goal",
    detail:
      "Share your background, target role, available time, and current skill level.",
  },
  {
    title: "Get a fit recommendation",
    detail:
      "The team explains whether The Spark, The Prime, or The Apex is the right pathway for your stage.",
  },
  {
    title: "Attend free sessions",
    detail:
      "Use the 2 free sessions included on all plans before you commit.",
  },
  {
    title: "Confirm fee and start",
    detail:
      "Batch timing, one-time pathway fee, GST, and plan scope are confirmed before enrollment.",
  },
];

const faqs = [
  {
    question: "Which pricing plan is best for beginners?",
    answer:
      "The Spark is built for beginners, career-switchers, and students who need a guided foundation before advanced project work.",
  },
  {
    question: "Does Prime include paid R&D time?",
    answer:
      "Yes. The Prime includes 3 months learning plus 3 months paid R&D, with Rs.10K/month during the R&D phase.",
  },
  {
    question: "What makes Apex different?",
    answer:
      "The Apex adds 6 months on-job training, 3 months R&D, Rs.10K/month as a Trainee Software Engineer, and advanced production-readiness skills.",
  },
  {
    question: "Are these prices final?",
    answer:
      "The pricing sheet lists one-time pathway fees as Rs.50K, Rs.99K, and Rs.199K, each plus GST. Batch timing, payment schedule, and scope are confirmed before enrollment.",
  },
  {
    question: "Do all plans include free sessions?",
    answer:
      "Yes. The pricing sheet lists 2 free sessions before you commit on The Spark, The Prime, and The Apex.",
  },
  {
    question: "Which tracks are listed in the pricing sheet?",
    answer:
      "The Spark starts with Python Full Stack with Gen AI basics, Java Full Stack with Gen AI basics, HTML, CSS, JavaScript, Git, SQL, and REST API concepts. The Prime and The Apex add progressively deeper modern engineering skills.",
  },
];

function Container({ children, className = "" }) {
  return (
    <div
      className={[
        "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function SectionHeading({ title, text, align = "left" }) {
  return (
    <div
      className={
        align === "center" ? "mx-auto max-w-6xl text-center" : "max-w-3xl"
      }
    >
      <h2 className="text-balance text-3xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-4xl lg:whitespace-nowrap lg:text-[3rem] xl:text-5xl">
        {title}
      </h2>
      {align === "center" ? (
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#c9a227]" />
      ) : null}
      {text ? (
        <p className="mt-4 text-pretty text-[15px] leading-8 text-[#5b667a] dark:text-slate-300 sm:text-base">
          {text}
        </p>
      ) : null}
    </div>
  );
}

export default function PricingPage() {
  return (
    <main className="bg-white text-gray-900 dark:bg-slate-950 dark:text-white">
      <section className="relative isolate overflow-hidden bg-[#071126] text-white">
        <Image
          src="/images/banners/personalized-training.jpg"
          alt="Tinitiate learners reviewing technology work together"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(238, 240, 243, 0.98)_0%,rgba(238, 240, 245, 0.92)_44%,rgba(239, 242, 248, 0.66)_100%)]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(253, 253, 253, 0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(243, 239, 239, 0.08)_1px,transparent_1px)] [background-size:54px_54px]" />

        <Container className="relative flex min-h-[430px] items-center py-10 sm:min-h-[460px] sm:py-12 lg:min-h-[500px] lg:py-14">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(360px,0.62fr)]">
            <div className="max-w-3xl">
              <h1 className="max-w-[15ch] text-balance text-4xl font-extrabold leading-[1.05] tracking-normal text-white sm:text-5xl lg:text-[3.9rem]">
                Real work. Real salary. Real career.
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-8 text-slate-200 sm:text-lg">
                Compare the pathway fee, project proof, R&D support, and
                trainee salary options before you choose your commitment.
              </p>

              
            </div>

            <div className="relative hidden overflow-hidden rounded-[1.45rem] border border-white/14 bg-white/[0.07] p-3 shadow-[0_26px_76px_-42px_rgba(2,6,23,0.9)] backdrop-blur-xl lg:block">
              <div className="relative h-[270px] overflow-hidden rounded-[1.15rem]">
                <Image
                  src="/images/banners/personalized-training.jpg"
                  alt="Mentor-led pricing discussion"
                  fill
                  priority
                  sizes="420px"
                  className="object-cover opacity-78"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,38,0.12)_0%,rgba(7,17,38,0.84)_100%)]" />
                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/14 bg-[#071126]/78 p-4 backdrop-blur">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f2c94c]">
                    Pricing clarity
                  </p>
                  <div className="mt-3 grid gap-2">
                    {[
                      ["Fee + GST clarity", BadgeCheck],
                      ["R&D and salary support", BriefcaseBusiness],
                      ["Project proof outcome", LineChart],
                    ].map(([label, Icon]) => (
                      <div key={label} className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[#f2c94c]">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-gray-200 bg-white px-4 py-7 sm:px-6 lg:px-10 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto grid max-w-[1440px] gap-5 lg:grid-cols-[0.62fr_1.38fr] lg:items-center">
          <div>
            <h2 className="text-balance text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl dark:text-white">
              Match the pathway to your stage.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#5b667a] dark:text-slate-300">
              Start with your current confidence, then compare the pathway that
              gives you the right structure and support.
            </p>
          </div>

          <div className="overflow-hidden rounded-[1.35rem] border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:shadow-[0_22px_60px_rgba(2,6,23,0.35)]">
            <div className="grid divide-y divide-gray-200 dark:divide-slate-700 md:grid-cols-3 md:divide-x md:divide-y-0">
              {stageGuide.map(({ title, plan, detail, icon: Icon }, index) => (
                <div
                  key={title}
                  className={[
                    "flex gap-4 p-5 transition-colors",
                    index === 1
                      ? "bg-[#fffaf0] dark:bg-[#172033]"
                      : "bg-white dark:bg-slate-950",
                  ].join(" ")}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eef5ff] text-[#1a3c6e] dark:bg-slate-800 dark:text-[#f2c94c]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                      {title}
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#9b7a10] dark:text-[#f2c94c]">
                      Look at {plan}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#5b667a] dark:text-slate-200">
                      {detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="scroll-mt-[132px] bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-10 dark:bg-slate-950">
        <Container>
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center">
            <SectionHeading
              align="center"
              title="Pick the pathway that fits your career stage"
              text="A simple view of the pathway fee, included support, project outcome, and earning support for each plan."
            />
            <Link
              href="/pricing-policy"
              className="inline-flex min-h-[44px] w-fit items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-900 shadow-sm transition hover:border-[#c9a227] hover:text-[#7a5d00] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              Pricing policy
              <FileText className="h-4 w-4" />
            </Link>
          </div>

          <PricingCardsDeck />
          <PricingComparisonTable className="mt-12" />
        </Container>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-14 sm:px-6 sm:py-16 lg:px-10 dark:bg-[linear-gradient(180deg,#071126_0%,#0f172a_100%)]">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Decision system
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#c9a227]" />
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-8 text-[#5b667a] sm:text-base dark:text-slate-300">
              Pricing is only one part of the decision. The team checks fit,
              confirms GST and scope, and helps you use the free sessions before
              you commit.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {included.map(({ title, detail, icon: Icon }) => (
              <article
                key={title}
                className="flex min-h-[235px] flex-col rounded-[1.25rem] border border-[#d8e2ee] bg-white p-5 shadow-[0_22px_58px_-44px_rgba(15,23,42,0.62)] dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#13233a] text-[#f2cf5b] dark:bg-slate-950">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-extrabold leading-tight text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#5b667a] dark:text-slate-300">
                  {detail}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-4">
            {processSteps.map(({ title, detail }, index) => (
              <article
                key={title}
                className="relative flex min-h-[220px] flex-col rounded-[1.25rem] border border-[#d8e2ee] bg-[#fbfdff] p-5 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.62)] dark:border-slate-700 dark:bg-slate-950"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c9a227] text-sm font-black text-[#171100]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#9b7a10] dark:text-[#f2c94c]">
                    Step
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-extrabold leading-tight text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#4d5b73] dark:text-slate-200">
                  {detail}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-10 dark:bg-slate-950">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div className="border-l-4 border-[#c9a227] pl-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b7a10] dark:text-[#f2c94c]">
                Next step
              </p>
              <h2 className="mt-4 max-w-[15ch] text-balance text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
                Choose with clarity before you enroll.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-8 text-[#5b667a] sm:text-base dark:text-slate-300">
                Share your background, target role, and weekly availability.
                The team will recommend Spark, Prime, or Apex, explain the fee
                plus GST, and help you start with the right commitment level.
              </p>
              
            </div>

            <div>
              <div className="border-b border-gray-300 pb-5 dark:border-slate-700">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b7a10] dark:text-[#f2c94c]">
                  FAQ
                </p>
                <h2 className="mt-3 text-balance text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl dark:text-white">
                  Questions before choosing a plan.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5b667a] dark:text-slate-300">
                  Straight answers for pricing, upgrades, outcomes, and plan
                  fit.
                </p>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {faqs.map((item) => (
                  <details key={item.question} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-5 text-base font-extrabold text-gray-900 dark:text-white">
                      <span>{item.question}</span>
                      <Plus className="mt-1 h-5 w-5 shrink-0 text-[#9b7a10] transition group-open:rotate-45 dark:text-[#f2c94c]" />
                    </summary>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5b667a] dark:text-slate-300">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
