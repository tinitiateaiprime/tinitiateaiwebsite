import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = { title: 'MasterClasses' };

type Track = { name: string; icon: string; href: string };

const aiTracks: Track[] = [
  {
    "name": "AI MasterClass",
    "icon": "openai.svg",
    "href": "/masterclasses/ai/index.html"
  },
  {
    "name": "Agentic Development",
    "icon": "mcp.svg",
    "href": "/masterclasses/agentic-development/index.html"
  },
  {
    "name": "LangGraph",
    "icon": "langgraph.svg",
    "href": "/masterclasses/ai/langgraph/index.html"
  },
  {
    "name": "CrewAI",
    "icon": "crewai.svg",
    "href": "/masterclasses/ai/crewai/index.html"
  },
  {
    "name": "AWS Bedrock",
    "icon": "aws.svg",
    "href": "/masterclasses/ai/aws-bedrock/index.html"
  },
  {
    "name": "AWS Strands",
    "icon": "aws.svg",
    "href": "/masterclasses/ai/aws-strands/index.html"
  },
  {
    "name": "Azure Foundry",
    "icon": "azure.svg",
    "href": "/masterclasses/ai/azure-foundry/index.html"
  },
  {
    "name": "Claude SDK",
    "icon": "claude.svg",
    "href": "/masterclasses/ai/claude-sdk/index.html"
  },
  {
    "name": "Gemini ADK",
    "icon": "google-gemini.svg",
    "href": "/masterclasses/ai/google-gemini-sdk/index.html"
  }
];
const dataTracks: Track[] = [
  {
    "name": "Data Engineering",
    "icon": "airflow.svg",
    "href": "/masterclasses/data-engineering/index.html"
  },
  {
    "name": "PySpark",
    "icon": "spark.svg",
    "href": "/masterclasses/pyspark/index.html"
  },
  {
    "name": "Databricks",
    "icon": "databricks.svg",
    "href": "/masterclasses/databricks-dataengineering/index.html"
  },
  {
    "name": "AWS Data Engineering",
    "icon": "aws.svg",
    "href": "/masterclasses/aws-dataengineering/index.html"
  },
  {
    "name": "Snowflake",
    "icon": "snowflake.svg",
    "href": "/masterclasses/snowflake-dataengineering/index.html"
  },
  {
    "name": "Azure Data Engineering",
    "icon": "azure.svg",
    "href": "/masterclasses/azure-dataengineering/index.html"
  },
  {
    "name": "GCP Data Engineering",
    "icon": "google-cloud.svg",
    "href": "/courses/gcp-data-engineering"
  },
  {
    "name": "On-Prem Pandas",
    "icon": "pandas.svg",
    "href": "/masterclasses/data-engineering/onprem-pandas-polars-sql/index.html"
  },
  {
    "name": "DuckDB",
    "icon": "duckdb.svg",
    "href": "/masterclasses/data-engineering/duckdb/index.html"
  }
];

function VerticalCard({title,tracks,variant}:{title:string;tracks:Track[];variant:'ai'|'data'}) {
  const isAI = variant === 'ai';
  return (
    <section aria-label={`${title} MasterClasses`} className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className={`flex items-center justify-between gap-3 border-b px-4 py-4 sm:px-5 ${isAI?'bg-fuchsia-50/60':'bg-sky-50/70'}`}>
        <h2 className={`min-w-0 break-words text-base font-extrabold tracking-wide sm:text-lg ${isAI?'text-fuchsia-700':'text-sky-700'}`}>{title}</h2>
        <span className="shrink-0 text-xs font-semibold text-slate-500">{tracks.length} topics</span>
      </div>
      <nav aria-label={`${title} topics`} className="flex flex-col gap-1 px-2 py-3 sm:px-3">
        {tracks.map(track=>(
          <Link key={track.href} href={track.href}
            className="group flex min-h-12 min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-slate-800 outline-offset-2 transition hover:bg-sky-50 focus-visible:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 ring-1 ring-slate-100 group-hover:bg-white">
              <Image src={`/masterclasses/assets/icons/tech/${track.icon}`} alt="" aria-hidden="true" width={23} height={23} unoptimized className="size-6 object-contain" />
            </span>
            <span className="min-w-0 flex-1 break-words text-sm font-semibold leading-5 sm:text-base">{track.name}</span>
            <span aria-hidden="true" className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600">›</span>
          </Link>
        ))}
      </nav>
    </section>
  );
}

export default function MasterclassesPage() {
  return <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
    <header className="mb-8">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Tinitiate AI · MasterClasses</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Explore MasterClasses</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Choose a technology and open its interactive MasterClass.</p>
    </header>
    <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 md:gap-6">
      <VerticalCard title="AI" variant="ai" tracks={aiTracks}/>
      <VerticalCard title="DATA ENGINEERING" variant="data" tracks={dataTracks}/>
    </div>
  </main>;
}
