'use client';

import * as Tabs from '@radix-ui/react-tabs';
import type { CSSProperties } from 'react';
import type { IconType } from 'react-icons';
import { ArrowUpRight } from 'lucide-react';
import {
  PiBooksDuotone, PiBrainDuotone, PiCirclesThreePlusDuotone, PiCubeDuotone, PiDatabaseDuotone,
  PiFlaskDuotone, PiLockKeyDuotone, PiPuzzlePieceDuotone, 
  PiShieldCheckDuotone, PiSparkleDuotone, PiStackDuotone, PiTreeStructureDuotone,
} from 'react-icons/pi';

/** A topic shows either a tech logo (from the MasterClass icon set) or a two-tone icon. */
type Track = { name: string; sub: string; href: string; logo?: string; icon?: IconType; tag?: string };
type Category = { id: string; name: string; description: string; icon: IconType; color: string; soft: string; overview: Track; tracks: Track[] };

const mc = '/masterclasses';
const categories: Category[] = [
  { id: 'ai', name: 'AI', description: 'Build with AI, from foundation models to production agent systems.', icon: PiSparkleDuotone, color: '#a21caf', soft: '#fdf4ff',
    overview: { name: 'AI MasterClass', sub: 'Foundation models, RAG and agentic systems in one guided path', href: `${mc}/ai/index.html`, logo: 'openai' },
    tracks: [
      { name: 'Agentic Development', sub: 'Agents, loops and multi-agent swarms', href: `${mc}/agentic-development/index.html`, logo: 'mcp' },
      { name: 'LangGraph', sub: 'Stateful agents with MCP, RAG and guardrails', href: `${mc}/ai/langgraph/index.html`, logo: 'langgraph' },
      { name: 'CrewAI', sub: 'Role-based agent crews that collaborate', href: `${mc}/ai/crewai/index.html`, logo: 'crewai-icon' },
      { name: 'AWS Bedrock', sub: 'Foundation models and agents on AWS', href: `${mc}/ai/aws-bedrock/index.html`, logo: 'aws' },
      { name: 'AWS Strands', sub: 'Model-driven agents with the Strands SDK', href: `${mc}/ai/aws-strands/index.html`, logo: 'aws' },
      { name: 'Azure Foundry', sub: 'Build and run AI apps on Azure', href: `${mc}/ai/azure-foundry/index.html`, logo: 'azure' },
      { name: 'Claude SDK', sub: 'Tool use, MCP and agents with Claude', href: `${mc}/ai/claude-sdk/index.html`, logo: 'claude' },
      { name: 'Gemini ADK', sub: 'Google’s Agent Development Kit', href: `${mc}/ai/google-gemini-sdk/index.html`, logo: 'google-gemini-icon' },
    ] },
  { id: 'ai-foundations', name: 'AI & ML Foundations', description: 'The concepts behind AI: machine learning, GenAI, agents and automation.', icon: PiBrainDuotone, color: '#6d28d9', soft: '#f5f3ff',
    overview: { name: 'AI Developer Course', sub: 'From AI basics to agents, step by step', href: `${mc}/automation-ml-ai-agentic/index.html`, logo: 'huggingface' },
    tracks: [
      { name: 'Artificial Intelligence', sub: 'What AI is and how it works', href: `${mc}/automation-ml-ai-agentic/ai.html`, logo: 'tensorflow' },
      { name: 'AI / ML Foundation', sub: 'Models, training and evaluation', href: `${mc}/automation-ml-ai-agentic/ml.html`, logo: 'scikit-learn' },
      { name: 'Generative AI', sub: 'LLMs, prompts and embeddings', href: `${mc}/automation-ml-ai-agentic/genai.html`, logo: 'openai' },
      { name: 'AI Agents', sub: 'Agents that plan and use tools', href: `${mc}/automation-ml-ai-agentic/agents.html`, logo: 'langchain' },
      { name: 'Agentic Loops', sub: 'Plan, act, observe, repeat', href: `${mc}/automation-ml-ai-agentic/agentic-loops.html`, logo: 'langgraph' },
      { name: 'Automation', sub: 'RPA, workflows and hyperautomation', href: `${mc}/automation-ml-ai-agentic/automation.html`, logo: 'airflow' },
      { name: 'Interactive Demo Lab', sub: 'Try AI and automation hands-on', href: `${mc}/automation-ml-ai-agentic/demo.html`, logo: 'jupyter', tag: 'Lab' },
    ] },
  { id: 'data', name: 'Data Engineering', description: 'The platforms behind modern data pipelines and lakehouses.', icon: PiDatabaseDuotone, color: '#0369a1', soft: '#f0f9ff',
    overview: { name: 'Data Engineering', sub: 'Pipelines, orchestration and lakehouses end to end', href: `${mc}/data-engineering/index.html`, logo: 'airflow' },
    tracks: [
      { name: 'PySpark', sub: 'Distributed processing at scale', href: `${mc}/pyspark/index.html`, logo: 'spark' },
      { name: 'Databricks', sub: 'Lakehouse with Delta and Unity', href: `${mc}/databricks-dataengineering/index.html`, logo: 'databricks' },
      { name: 'AWS Data Engineering', sub: 'S3, Glue, Athena and Redshift', href: `${mc}/aws-dataengineering/index.html`, logo: 'aws' },
      { name: 'Snowflake', sub: 'Cloud data warehouse workflows', href: `${mc}/snowflake-dataengineering/index.html`, logo: 'snowflake' },
      { name: 'Azure Data Engineering', sub: 'ADF, ADLS, Synapse and Databricks', href: `${mc}/azure-dataengineering/index.html`, logo: 'azure' },
      { name: 'GCP Data Engineering', sub: 'BigQuery, Dataflow and Pub/Sub', href: '/courses/gcp-data-engineering', logo: 'google-cloud', tag: 'Course' },
      { name: 'On-Prem Pandas', sub: 'Pandas, Polars and SQL locally', href: `${mc}/data-engineering/onprem-pandas-polars-sql/index.html`, logo: 'pandas' },
      { name: 'DuckDB', sub: 'Fast in-process analytics', href: `${mc}/data-engineering/duckdb/index.html`, logo: 'duckdb' },
    ] },
  { id: 'governance', name: 'Data Governance', description: 'Catalog, lineage and access policies for data people can trust.', icon: PiShieldCheckDuotone, color: '#0f766e', soft: '#f0fdfa',
    overview: { name: 'Purview MasterClass', sub: 'Data map, column lineage and stewardship policies', href: `${mc}/data-governence/index.html`, logo: 'azure' },
    tracks: [
      { name: 'Databricks Unity Catalog', sub: 'Unified governance and ABAC', href: `${mc}/data-governence/unity/index.html`, logo: 'databricks' },
      { name: 'Apache Atlas', sub: 'Open-source metadata and lineage', href: `${mc}/data-governence/atlas/index.html`, logo: 'apache' },
      { name: 'Purview Scan Sandbox', sub: 'Practise ingestion scans hands-on', href: `${mc}/data-governence/purview-sandbox/index.html`, icon: PiFlaskDuotone, tag: 'Lab' },
    ] },
  { id: 'full-stack', name: 'Full Stack', description: 'Enterprise web apps end to end, in the stack you want to work in.', icon: PiStackDuotone, color: '#1d4ed8', soft: '#eff6ff',
    overview: { name: 'Full Stack Architecture', sub: 'How enterprise systems fit together, front to back', href: `${mc}/full-stack/index.html`, logo: 'nodejs' },
    tracks: [
      { name: 'Node.js, React & Next.js', sub: 'React 19 and the App Router', href: `${mc}/full-stack/nodejs-react-nextjs/index.html`, logo: 'react' },
      { name: 'Java Spring Boot', sub: 'Spring Boot 3 and microservices', href: `${mc}/full-stack/java-fullstack/index.html`, logo: 'java' },
      { name: 'Python FastAPI', sub: 'Modern async, high-performance APIs', href: `${mc}/full-stack/python-fastapi/index.html`, logo: 'fastapi' },
      { name: 'C# & .NET 8', sub: 'Enterprise architecture on .NET', href: `${mc}/full-stack/dotnet-csharp/index.html`, logo: 'dotnet' },
    ] },
  { id: 'foundational', name: 'Foundational', description: 'Core computer science and software engineering every developer needs.', icon: PiBooksDuotone, color: '#047857', soft: '#ecfdf5',
    overview: { name: 'CS & Software Engineering', sub: 'The fundamentals behind every tech career', href: `${mc}/foundational/index.html`, logo: 'vscode' },
    tracks: [
      { name: 'Python Foundations', sub: 'Learn Python from zero', href: `${mc}/foundational/python/index.html`, logo: 'python', tag: 'Videos' },
      { name: 'SQL Foundations', sub: 'PostgreSQL from zero', href: `${mc}/foundational/sql/index.html`, logo: 'postgresql' },
      { name: 'Data Structures', sub: 'Algorithms and complexity', href: `${mc}/foundational/data-structures/index.html`, icon: PiTreeStructureDuotone },
      { name: 'OOP & SOLID', sub: 'Clean object-oriented design', href: `${mc}/foundational/oop/index.html`, icon: PiCubeDuotone },
      { name: 'Design Patterns', sub: 'GoF patterns in modern code', href: `${mc}/foundational/design-patterns/index.html`, icon: PiPuzzlePieceDuotone },
      { name: 'APIs', sub: 'REST, GraphQL, gRPC and more', href: `${mc}/foundational/apis/index.html`, logo: 'openapi' },
      { name: 'Authentication', sub: 'OAuth, OIDC and access control', href: `${mc}/foundational/authentication/index.html`, icon: PiLockKeyDuotone },
      { name: 'Microservices', sub: 'Distributed, event-driven systems', href: `${mc}/foundational/microservices/index.html`, icon: PiCirclesThreePlusDuotone },
    ] },
];

export const totalTopics = categories.reduce((n, c) => n + c.tracks.length + 1, 0);

function Mark({ track, color, size }: { track: Track; color: string; size: 'md' | 'lg' }) {
  const Icon = track.icon;
  const box = size === 'lg' ? 'size-14 rounded-2xl' : 'size-12 rounded-xl';
  const img = size === 'lg' ? 'size-8' : 'size-7';
  return <span className={`grid shrink-0 place-items-center bg-white shadow-[0_1px_2px_rgb(10_10_11/0.06)] ring-1 ring-slate-200/80 transition-colors duration-300 group-hover:bg-[var(--s)] ${box}`} style={Icon ? { color } : undefined}>
    {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG logos */}
    {track.logo ? <img src={`/masterclasses/assets/icons/tech/${track.logo}.svg`} alt="" width={32} height={32} className={`${img} object-contain`} /> : Icon && <Icon aria-hidden="true" className={img} />}
  </span>;
}

/**
 * All technology MasterClasses in one block: a dark category rail and, for the
 * chosen category, a "start here" overview card plus a grid of topic cards.
 */
export function MasterclassBrowser() {
  return <Tabs.Root defaultValue="ai" orientation="vertical" className="grid gap-4 lg:grid-cols-[272px_minmax(0,1fr)] lg:gap-5">
    {/* Category rail */}
    <Tabs.List aria-label="MasterClass categories" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:rounded-[24px] lg:bg-ink lg:p-3 lg:pb-3">
      <p className="hidden px-3 pb-2 pt-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45 lg:block">Categories</p>
      {categories.map(({ id, name, icon: Icon, color, tracks }) => <Tabs.Trigger key={id} value={id} style={{ '--c': color } as CSSProperties}
        className="group flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-left transition-colors data-[state=active]:border-ink data-[state=active]:bg-ink lg:border-transparent lg:bg-transparent lg:py-3 lg:hover:bg-white/[0.06] lg:data-[state=active]:border-transparent lg:data-[state=active]:bg-white">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-data-[state=active]:bg-[var(--c)] group-data-[state=active]:text-white lg:bg-white/10 lg:text-white/80"><Icon aria-hidden="true" className="size-[22px]" /></span>
        <span className="whitespace-nowrap text-[15px] font-semibold text-slate-700 group-data-[state=active]:text-white lg:flex-1 lg:text-white/80 lg:group-data-[state=active]:text-ink">{name}</span>
        <span className="text-xs font-semibold text-slate-400 group-data-[state=active]:text-white/70 lg:text-white/40 lg:group-data-[state=active]:text-[var(--c)]">{tracks.length + 1}</span>
      </Tabs.Trigger>)}
    </Tabs.List>

    {/* Category panels: all stacked in one cell (only the active one visible), so the area keeps the height of the tallest and nothing jumps. */}
    <div className="grid min-w-0 [&>*]:[grid-area:1/1]">
    {categories.map(cat => {
      const { id, name, description, color, soft, overview, tracks } = cat;
      const all = [{ ...overview, tag: overview.tag ?? 'Overview' }, ...tracks];
      const logos = all.filter(t => t.logo).slice(0, 5);
      return <Tabs.Content key={id} value={id} forceMount className="mc-panel data-[state=inactive]:invisible min-w-0 overflow-hidden rounded-[24px] border border-slate-200 bg-white outline-none">
        {/* Header */}
        <div className="relative overflow-hidden px-5 pb-5 pt-6 sm:px-7" style={{ background: `linear-gradient(135deg, ${soft}, #fff 70%)` }}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0 max-w-xl">
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color }}>{tracks.length + 1} MasterClasses</p>
              <h3 className="mt-1 text-[1.75rem] font-semibold leading-tight tracking-[-0.03em] text-ink">{name}</h3>
              <p className="mt-1.5 text-[15px] leading-6 text-neutral-600">{description}</p>
            </div>
            {logos.length > 1 && <div aria-hidden="true" className="flex -space-x-2.5">
              {logos.map(t => <span key={t.href} className="grid size-11 place-items-center rounded-full bg-white shadow-[0_4px_12px_-4px_rgb(10_10_11/0.2)] ring-2 ring-white">
                {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG logos */}
                <img src={`/masterclasses/assets/icons/tech/${t.logo}.svg`} alt="" width={24} height={24} className="size-6 object-contain" />
              </span>)}
            </div>}
          </div>
        </div>

        <div className="grid gap-3 p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-3">
          {/* Topics */}
          {all.map((t, i) => <a key={t.href} href={t.href} style={{ '--d': `${60 + i * 45}ms`, '--c': color, '--s': soft } as CSSProperties}
            className="mc-card group relative flex items-center gap-3.5 rounded-[20px] border border-slate-200 bg-white p-4 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-[var(--c)] hover:shadow-[0_18px_40px_-24px_rgb(10_10_11/0.45)]">
            <Mark track={t} color={color} size="md" />
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5"><span className="text-[15px] font-semibold leading-snug text-ink">{t.name}</span>
                {t.tag && <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: soft, color }}>{t.tag}</span>}</span>
              <span className="mt-0.5 line-clamp-2 block text-[13px] leading-5 text-neutral-500">{t.sub}</span>
            </span>
            <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--c)]" />
          </a>)}
        </div>
      </Tabs.Content>;
    })}
    </div>
  </Tabs.Root>;
}
