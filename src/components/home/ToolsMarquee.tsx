import { toolIcon } from '@/data/paths';

const tools = [
  ['Python', 'python'], ['OpenAI', 'openai'], ['Claude', 'claude'], ['LangChain', 'langchain'], ['Hugging Face', 'huggingface'], ['AWS', 'aws'],
  ['Azure', 'azure'], ['Google Cloud', 'google-cloud'], ['Docker', 'docker'], ['Databricks', 'databricks'], ['Snowflake', 'snowflake'], ['Spark', 'spark'],
  ['Kafka', 'kafka'], ['Airflow', 'airflow'], ['React', 'react'], ['Node.js', 'nodejs'], ['Java', 'java'], ['PostgreSQL', 'postgresql'], ['Power BI', 'power-bi'], ['GitHub', 'github'],
] as const;

/** A slow scrolling strip of the tools learners work with. Pauses on hover; reduced-motion stops it. */
export function ToolsMarquee() {
  const row = (hidden: boolean) => <ul aria-hidden={hidden || undefined} className="marquee-track flex shrink-0 items-center gap-4 pr-4">
    {tools.map(([name, icon]) => <li key={name} className="light-island flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white px-4 py-2.5 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG logos */}
      <img src={toolIcon(icon)} alt="" width={22} height={22} className="size-[22px] object-contain" />
      <span className="whitespace-nowrap text-sm font-semibold text-neutral-700">{name}</span>
    </li>)}
  </ul>;
  return <section aria-labelledby="tools-title" className="border-y border-neutral-200 bg-subtle py-10">
    <h2 id="tools-title" className="px-4 text-center text-sm font-bold uppercase tracking-[0.16em] text-neutral-500">Tools &amp; platforms you&apos;ll work with</h2>
    <div className="marquee mt-6 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      {row(false)}{row(true)}
    </div>
  </section>;
}
