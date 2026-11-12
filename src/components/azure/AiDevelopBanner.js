"use client";

import { RiOpenaiFill as SiOpenai } from "react-icons/ri";

import Image from "next/image";
import { HiSparkles } from "react-icons/hi2";
import { SiSnowflake } from "react-icons/si";
import { RiRobot2Line } from "react-icons/ri";
import { VscGithubInverted } from "react-icons/vsc";
import { FaAws } from "react-icons/fa6";

const CHIP_GROUPS = [
  {
    key: "chatgpt",
    label: "ChatGPT",
    Icon: SiOpenai,
    iconClass: "text-emerald-300",
    chipClass: "border-emerald-400/20 bg-emerald-500/10 text-emerald-100",
  },
  {
    key: "claude",
    label: "Claude",
    Icon: RiRobot2Line,
    iconClass: "text-orange-300",
    chipClass: "border-orange-400/20 bg-orange-500/10 text-orange-100",
  },
  {
    key: "copilot",
    label: "Copilot",
    Icon: VscGithubInverted,
    iconClass: "text-sky-300",
    chipClass: "border-sky-400/20 bg-sky-500/10 text-sky-100",
  },
  {
    key: "aws",
    label: "AWS",
    Icon: FaAws,
    iconClass: "text-amber-300",
    chipClass: "border-amber-400/20 bg-amber-500/10 text-amber-100",
  },

  {
    key: "snowflake",
    label: "Snowflake",
    Icon: SiSnowflake,
    iconClass: "text-sky-300",
    chipClass: "border-sky-400/20 bg-sky-500/10 text-sky-100",
  },

];

export default function AiDevelopBanner({
  compact = false,
  title = "Develop with AI",
  subtitle = "Train with ChatGPT, Claude, Copilot, and real cloud & development platforms.",
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950 text-white shadow-[0_20px_60px_rgba(2,6,23,0.28)] ${
        compact ? "p-4 md:p-5" : "p-5 md:p-6"
      }`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_28%)]" />
        <div className="absolute -top-16 left-1/3 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-16 right-10 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:42px_42px]" />
      </div>

      <div className="relative flex flex-col gap-2">

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-200 backdrop-blur">
              <HiSparkles className="h-3.5 w-3.5 text-indigo-300" />
              AI-Integrated Learning
            </div>

            <div className="mt-1 flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-3">
              <h2 className={`font-extrabold tracking-tight text-white ${compact ? "text-lg md:text-xl" : "text-xl md:text-2xl"}`}>
                {title}
              </h2>
              <span className="hidden lg:inline-block h-4 w-px bg-white/10" />
              <p className="text-sm text-slate-300">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {CHIP_GROUPS.map(({ key, label, Icon, img, iconClass, chipClass }) => (
            <span
              key={key}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm ${chipClass}`}
            >
              {Icon ? (
                <Icon className={`h-4 w-4 ${iconClass}`} />
              ) : img ? (
                <Image
                  src={img}
                  alt={label}
                  width={15}
                  height={15}
                  className="object-contain"
                />
              ) : null}
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
