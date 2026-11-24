import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { HeroRoleSwitcher, type HeroRole } from './HeroRoleSwitcher';
import { EvalScene, GuardrailScene, PromptScene, RagScene } from './scenes/ai';
import { CodeScene, SaveScene, SearchScene } from './scenes/agentic';
import { DeployScene, ScaleScene, ServerlessScene } from './scenes/cloud';
import { ApiScene, DataScene, UiScene } from './scenes/fullstack';
import { CatalogScene, LineageScene, PolicyScene } from './scenes/governance';

type Scene = { title: string; sub: string; ms: number; art: ReactNode };
type RoleContent = Omit<HeroRole, 'durations' | 'titles'> & { scenes: Scene[]; tools: [name: string, icon: string][]; lesson: { label: string; href: string } };

const roles: RoleContent[] = [
  {
    id: 'ai-engineer', label: 'AI Engineer', note: 'LLMs · RAG', icon: 'sparkles', track: 'AI Engineer path', exploreHref: '/paths/ai-engineer',
    scenes: [
      { title: 'RAG', sub: 'Answers from your own documents', ms: 6800, art: <RagScene /> },
      { title: 'Prompt engineering', sub: 'Reliable, structured answers', ms: 5600, art: <PromptScene /> },
      { title: 'Evals', sub: 'Catch mistakes before users do', ms: 5400, art: <EvalScene /> },
      { title: 'Guardrails', sub: 'Stop attacks, protect personal data', ms: 6400, art: <GuardrailScene /> },
    ],
    tools: [['Python', 'python'], ['OpenAI', 'openai'], ['Claude', 'claude'], ['LangChain', 'langchain'], ['Hugging Face', 'huggingface'], ['Pinecone', 'pinecone']],
    lesson: { label: 'Claude SDK MasterClass', href: '/masterclasses/ai/claude-sdk/index.html' },
  },
  {
    id: 'agentic-ai', label: 'Agentic AI Developer', note: 'Agents · MCP', icon: 'bot', track: 'Agentic AI path', exploreHref: '/paths/agentic-ai',
    scenes: [
      { title: 'The agent searches', sub: 'It finds what matters and skips the rest', ms: 6200, art: <SearchScene /> },
      { title: 'It writes code', sub: 'Python, run safely in a sandbox', ms: 5600, art: <CodeScene /> },
      { title: 'It saves the results', sub: 'Into a database, then reports back', ms: 5000, art: <SaveScene /> },
    ],
    tools: [['LangGraph', 'langgraph'], ['CrewAI', 'crewai-icon'], ['MCP', 'mcp'], ['Claude', 'claude'], ['Gemini', 'google-gemini-icon'], ['Langfuse', 'langfuse']],
    lesson: { label: 'AI Agents MasterClass', href: '/masterclasses/agentic-development/agents/index.html' },
  },
  {
    id: 'cloud-engineer', label: 'Cloud Engineer', note: 'AWS · Azure', icon: 'cloud', track: 'Cloud Engineer path', exploreHref: '/paths/cloud-engineer',
    scenes: [
      { title: 'Serverless', sub: 'The same pattern on AWS and Azure', ms: 7400, art: <ServerlessScene /> },
      { title: 'CI/CD', sub: 'One push, live on both clouds', ms: 6000, art: <DeployScene /> },
      { title: 'Auto scaling', sub: 'Handle traffic spikes, stay healthy', ms: 5200, art: <ScaleScene /> },
    ],
    tools: [['AWS', 'aws'], ['Azure', 'azure'], ['Lambda', 'aws-lambda'], ['Functions', 'azure-functions'], ['Terraform', 'terraform'], ['Docker', 'docker']],
    lesson: { label: 'AWS Bedrock MasterClass', href: '/masterclasses/ai/aws-bedrock/index.html' },
  },
  {
    id: 'data-engineer', label: 'Data Engineer', note: 'Pipelines · Governance', icon: 'shield', track: 'Data Engineer path', exploreHref: '/paths/data-engineer',
    scenes: [
      { title: 'Data catalog', sub: 'Find and tag every data asset', ms: 6000, art: <CatalogScene /> },
      { title: 'Lineage', sub: 'Trace every column, end to end', ms: 6000, art: <LineageScene /> },
      { title: 'Access policies', sub: 'The right data for the right people', ms: 5600, art: <PolicyScene /> },
    ],
    tools: [['Spark', 'spark'], ['Databricks', 'databricks'], ['Snowflake', 'snowflake'], ['Airflow', 'airflow'], ['Azure Purview', 'azure'], ['dbt', 'dbt']],
    lesson: { label: 'Data Governance MasterClass', href: '/masterclasses/data-governence/index.html' },
  },
  {
    id: 'full-stack', label: 'Full Stack Developer', note: 'React · APIs', icon: 'layers', track: 'Full Stack path', exploreHref: '/paths/full-stack',
    scenes: [
      { title: 'Frontend', sub: 'Build the interface in React', ms: 5000, art: <UiScene /> },
      { title: 'API', sub: 'Fast, secure requests', ms: 5200, art: <ApiScene /> },
      { title: 'Database', sub: 'Data in, dashboard out', ms: 5200, art: <DataScene /> },
    ],
    tools: [['React', 'react'], ['Node.js', 'nodejs'], ['FastAPI', 'fastapi'], ['Java', 'java'], ['PostgreSQL', 'postgresql'], ['Git', 'git']],
    lesson: { label: 'React & Next.js MasterClass', href: '/masterclasses/full-stack/nodejs-react-nextjs/index.html' },
  },
];

/** One slide: the scene's name inside the box, then the picture. */
function SceneSlide({ scene }: { scene: Scene }) {
  return <figure className="hero-stage rounded-[16px] border border-neutral-200/80 px-2 pb-11 pt-4 sm:rounded-[18px] sm:px-5 sm:pb-14 sm:pt-5 short:pb-12">
    {/* Always exactly two lines (title, then description) so every scene box has the same height. */}
    <figcaption className="min-w-0 pl-2 pr-24 sm:pl-1">
      <span className="block truncate text-lg font-semibold leading-7 tracking-[-0.02em] text-ink sm:text-xl">{scene.title}</span>
      <span className="block truncate text-sm leading-5 text-neutral-500 sm:text-[15px]">{scene.sub}</span>
    </figcaption>
    <div className="mt-1 sm:mt-2">{scene.art}</div>
  </figure>;
}

function Footer({ role }: { role: RoleContent }) {
  return <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
    <ul className="flex flex-wrap items-center gap-2" aria-label="Tools you will use">
      {role.tools.map(([name, icon]) => <li key={name} title={name} className="grid size-12 place-items-center rounded-2xl border border-neutral-200 bg-white sm:size-[52px]">
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny local SVG icons */}
        <img src={`/masterclasses/assets/icons/tech/${icon}.svg`} alt={name} width={28} height={28} className="size-7 object-contain" />
      </li>)}
    </ul>
    <a href={role.lesson.href} className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink">
      <span className="font-medium text-neutral-500">Try free:</span>
      <span className="underline decoration-neutral-300 underline-offset-4 transition-colors group-hover:decoration-ink">{role.lesson.label}</span>
      <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  </div>;
}

function Intro() {
  return <div>
    <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-surface px-3 py-1 text-[13px] font-semibold text-neutral-700 short:mb-3"><span className="size-2 rounded-full bg-emerald-500" />Live online classes · Weekday &amp; weekend batches</p>
    <h2 id="roles-title" className="text-[2.3rem] font-semibold leading-[1.04] tracking-[-0.04em] text-ink [overflow-wrap:normal] sm:text-5xl xl:text-[3.4rem] short:text-[2.6rem]">
      Get job-ready in AI, Cloud, Data or Full Stack.
    </h2>
    <p className="mt-4 max-w-[32rem] text-[17px] leading-7 text-neutral-600 sm:text-lg sm:leading-8 short:mt-3 short:text-base short:leading-7">
      Live classes with industry mentors, real projects and interview prep. No coding background needed, and your first 2 sessions are free.
    </p>
  </div>;
}

/** The job picker: pick a role on the left, watch what you will build in it on the right. */
export function RoleShowcase() {
  const clientRoles: HeroRole[] = roles.map(({ id, label, note, icon, track, exploreHref, scenes }) => ({ id, label, note, icon, track, exploreHref, durations: scenes.map(s => s.ms), titles: scenes.map(s => s.title) }));
  return <section aria-labelledby="roles-title" className="bg-surface">
    <div className="mx-auto flex max-w-7xl items-center px-4 py-16 sm:px-6 sm:py-20">
      <HeroRoleSwitcher
        intro={<Intro />}
        roles={clientRoles}
        scenes={roles.map(role => role.scenes.map(scene => <SceneSlide key={scene.title} scene={scene} />))}
        footers={roles.map(role => <Footer key={role.id} role={role} />)}
      />
    </div>
  </section>;
}
