import { CourseSlider, type CourseSlide } from './CourseSlider';
import { Highlight, SectionHeading } from '../SectionHeading';

const icon = (name: string) => `/masterclasses/assets/icons/tech/${name}.svg`;

/** Course categories, in priority order: AI, Agentic, Cloud (AWS · Azure), Full Stack, App Development. */
const slides: CourseSlide[] = [
  {
    id: 'ai', label: 'AI | Generative AI', heading: 'Command the AI Advantage', accent: '#2f54eb',
    bullets: ['Master prompt engineering for LLMs', 'Build RAG over your own documents', 'Use OpenAI, Claude and Gemini APIs', 'Fine-tune and evaluate model outputs', 'Deploy AI apps with FastAPI'],
    outcomes: ['AI Engineer', 'AI Developer', 'Prompt Engineer', 'ML Engineer', 'AI Automation Engineer'],
    tech: [{ name: 'OpenAI', src: icon('openai'), color: '#10a37f' }, { name: 'Claude', src: icon('claude'), color: '#d97757' }, { name: 'Gemini', src: icon('google-gemini-icon'), color: '#8b5cf6' }, { name: 'Hugging Face', src: icon('huggingface'), color: '#f5b400' }, { name: 'Python', src: icon('python'), color: '#3776ab' }, { name: 'PyTorch', src: icon('pytorch'), color: '#ee4c2c' }],
    href: '/courses/gpt-beginner-course', cta: 'Explore the Generative AI course',
  },
  {
    id: 'agentic', label: 'Agentic Development', heading: 'Build Agents That Get Work Done', accent: '#7c3aed',
    bullets: ['Design agents with LangChain and LangGraph', 'Connect tools and data through MCP', 'Run multi-agent teams with CrewAI', 'Add memory, guardrails and monitoring', 'Ship agent apps your team can trust'],
    outcomes: ['Agentic App Developer', 'AI Engineer', 'LLM App Developer', 'AI Automation Engineer', 'Solutions Engineer'],
    tech: [{ name: 'LangChain', src: icon('langchain'), color: '#1c3c3c' }, { name: 'LangGraph', src: icon('langgraph'), color: '#1c3c3c' }, { name: 'CrewAI', src: icon('crewai-icon'), color: '#ff5a50' }, { name: 'MCP', src: icon('mcp'), color: '#111827' }, { name: 'Langfuse', src: icon('langfuse'), color: '#e11d48' }],
    href: '/courses/langchain-beginner-course', cta: 'Explore the LangChain agents course',
  },
  {
    id: 'cloud', label: 'Cloud', heading: 'Run the Modern Cloud Stack', accent: '#0284c7',
    bullets: ['Navigate AWS and Azure confidently', 'Set up compute, storage and networking', 'Build serverless apps with Lambda and Functions', 'Automate infrastructure with Terraform', 'Track security, monitoring and cost'],
    outcomes: ['Cloud Engineer', 'Cloud Developer', 'Data Platform Engineer', 'Data Engineer', 'Cloud Solutions Associate'],
    tech: [{ name: 'AWS', src: icon('aws'), color: '#ff9900' }, { name: 'Azure', src: icon('azure'), color: '#0078d4' }, { name: 'Terraform', src: icon('terraform'), color: '#7b42bc' }, { name: 'Snowflake', src: icon('snowflake'), color: '#29b5e8' }, { name: 'Databricks', src: icon('databricks'), color: '#ff3621' }, { name: 'Docker', src: icon('docker'), color: '#2496ed' }],
    href: '/courses/aws-beginner-course', cta: 'Explore the AWS course',
  },
  {
    id: 'full-stack', label: 'Full Stack Development', heading: 'Create Full-Stack Career Proof', accent: '#0891b2',
    bullets: ['Build interfaces with React and Next.js', 'Create APIs with Node.js, Java or Python', 'Model data in PostgreSQL and MongoDB', 'Deploy apps on AWS Amplify', 'Polish UI for portfolio-grade demos'],
    outcomes: ['Full Stack Developer', 'Frontend Developer', 'React Developer', 'Java Full Stack Developer', 'Web Developer'],
    tech: [{ name: 'React', src: icon('react'), color: '#61dafb' }, { name: 'Next.js', src: '/next.svg', color: '#111827' }, { name: 'Node.js', src: icon('nodejs'), color: '#539e43' }, { name: 'Java', src: icon('java'), color: '#ea2d2e' }, { name: 'PostgreSQL', src: icon('postgresql'), color: '#336791' }, { name: 'MongoDB', src: icon('mongodb'), color: '#47a248' }],
    href: '/courses/java-full-stack-development', cta: 'Explore the Java Full Stack course',
  },
  {
    id: 'app-dev', label: 'Application Development', heading: 'Ship Enterprise App Logic', accent: '#0f766e',
    bullets: ['Write clean, tested Python and Java', 'Build APIs with FastAPI and Django', 'Turn pandas work into app-ready insights', 'Work with SQL databases the right way', 'Practise testing, debugging and releases'],
    outcomes: ['Backend Developer', 'Python Developer', 'Java Developer', 'API Developer', 'Application Engineer'],
    tech: [{ name: 'Python', src: icon('python'), color: '#3776ab' }, { name: 'Java', src: icon('java'), color: '#ea2d2e' }, { name: 'FastAPI', src: icon('fastapi'), color: '#009688' }, { name: 'pandas', src: icon('pandas'), color: '#150458' }, { name: 'pytest', src: icon('pytest'), color: '#0a9edc' }, { name: 'Git', src: icon('git'), color: '#f05032' }],
    href: '/courses/Python', cta: 'Explore the Python course',
  },
];

export function CoursesSection() {
  return <section aria-labelledby="courses-title" className="border-t border-neutral-100 bg-white py-20 sm:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <SectionHeading id="courses-title" title={<>Skills companies are <Highlight>hiring for.</Highlight></>}>Pick a track to see what you&apos;ll learn, the tools you&apos;ll use and the roles it leads to.</SectionHeading>
      <div className="mt-12"><CourseSlider slides={slides} /></div>
    </div>
  </section>;
}
