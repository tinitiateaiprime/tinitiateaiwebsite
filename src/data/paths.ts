/**
 * The five career paths, in one place. The header menu, homepage, path pages,
 * footer, About page and enquiry form all read from here, so a visitor sees the
 * same five choices everywhere.
 */
export type PathTool = { name: string; icon: string };
export type CareerPath = {
  id: string;
  label: string;
  /** Short tag line under the name, e.g. "LLMs · RAG". */
  note: string;
  /** One sentence: what this person does at work. */
  pitch: string;
  /** Who it suits. */
  forWho: string;
  accent: string;
  learn: string[];
  tools: PathTool[];
  roles: string[];
  /** Courses (slugs from courses.json) that make up the path, in study order. */
  courses: string[];
  /** A free MasterClass to try before booking. */
  freeLesson: { label: string; href: string };
};

export const paths: CareerPath[] = [
  {
    id: 'ai-engineer', label: 'AI Engineer', note: 'LLMs · RAG', accent: '#2f54eb',
    pitch: 'Build AI features that answer from real company data: chatbots, search and assistants.',
    forWho: 'Developers and graduates who want to work on generative AI products.',
    learn: ['Prompt engineering for reliable, structured answers', 'RAG over your own documents with vector databases', 'OpenAI, Claude and Gemini APIs in Python', 'Evaluate outputs and add guardrails', 'Ship AI apps behind a FastAPI backend'],
    tools: [{ name: 'Python', icon: 'python' }, { name: 'OpenAI', icon: 'openai' }, { name: 'Claude', icon: 'claude' }, { name: 'LangChain', icon: 'langchain' }, { name: 'Hugging Face', icon: 'huggingface' }, { name: 'Pinecone', icon: 'pinecone' }],
    roles: ['AI Engineer', 'AI Developer', 'Prompt Engineer', 'ML Engineer'],
    courses: ['Python', 'gpt-beginner-course', 'langchain-beginner-course', 'huggingface-beginner-course', 'fastapi-beginner-course'],
    freeLesson: { label: 'AI MasterClass', href: '/masterclasses/ai/index.html' },
  },
  {
    id: 'agentic-ai', label: 'Agentic AI Developer', note: 'Agents · MCP', accent: '#7c3aed',
    pitch: 'Build AI agents that plan, use tools and finish multi-step work on their own.',
    forWho: 'Python developers ready to move from chatbots to agents.',
    learn: ['Design agents with LangChain and LangGraph', 'Connect tools and data through MCP', 'Run multi-agent teams with CrewAI', 'Add memory, guardrails and monitoring', 'Deploy agent apps your team can trust'],
    tools: [{ name: 'LangGraph', icon: 'langgraph' }, { name: 'CrewAI', icon: 'crewai-icon' }, { name: 'MCP', icon: 'mcp' }, { name: 'Claude', icon: 'claude' }, { name: 'Gemini', icon: 'google-gemini-icon' }, { name: 'Langfuse', icon: 'langfuse' }],
    roles: ['Agentic App Developer', 'AI Engineer', 'LLM App Developer', 'AI Automation Engineer'],
    courses: ['Python', 'gpt-beginner-course', 'langchain-beginner-course', 'fastapi-beginner-course', 'docker-beginner-course'],
    freeLesson: { label: 'Agentic Development MasterClass', href: '/masterclasses/agentic-development/index.html' },
  },
  {
    id: 'cloud-engineer', label: 'Cloud Engineer', note: 'AWS · Azure', accent: '#0284c7',
    pitch: 'Deploy, scale and secure applications on AWS and Azure.',
    forWho: 'Beginners, support engineers and developers moving into cloud and DevOps.',
    learn: ['Navigate AWS and Azure with confidence', 'Set up compute, storage and networking', 'Build serverless apps with Lambda and Functions', 'Automate infrastructure with Terraform', 'Containers, CI/CD, monitoring and cost control'],
    tools: [{ name: 'AWS', icon: 'aws' }, { name: 'Azure', icon: 'azure' }, { name: 'Terraform', icon: 'terraform' }, { name: 'Docker', icon: 'docker' }, { name: 'Linux', icon: 'linux' }, { name: 'GitHub Actions', icon: 'github-actions' }],
    roles: ['Cloud Engineer', 'DevOps Engineer', 'Cloud Developer', 'Cloud Support Associate'],
    courses: ['linux-beginner-course', 'aws-beginner-course', 'microsoft-azure-beginner-course', 'docker-beginner-course', 'kubernetes-beginner-course', 'terraform-infrastructure-as-code-course', 'aws-devops-program'],
    freeLesson: { label: 'AWS Bedrock MasterClass', href: '/masterclasses/ai/aws-bedrock/index.html' },
  },
  {
    id: 'data-engineer', label: 'Data Engineer', note: 'Pipelines · Governance', accent: '#0f766e',
    pitch: 'Build the pipelines, lakehouses and governed data platforms that analytics and AI run on.',
    forWho: 'SQL, BI and Python learners who enjoy working with data at scale.',
    learn: ['SQL and Python for data work', 'Batch ETL with Spark and PySpark', 'Lakehouses on Databricks and Snowflake', 'Orchestration with Airflow, streaming with Kafka', 'Catalog, lineage and access policies (data governance)'],
    tools: [{ name: 'Spark', icon: 'spark' }, { name: 'Databricks', icon: 'databricks' }, { name: 'Snowflake', icon: 'snowflake' }, { name: 'Airflow', icon: 'airflow' }, { name: 'Kafka', icon: 'kafka' }, { name: 'dbt', icon: 'dbt' }],
    roles: ['Data Engineer', 'Data Platform Engineer', 'ETL Developer', 'Data Governance Analyst'],
    courses: ['sql-language-course', 'Python', 'apache-spark-beginner-course', 'aws-data-engineering', 'azure-data-engineering', 'snowflake-data-engineering', 'apache-airflow-workflow-orchestration-course', 'apache-kafka-streaming-course'],
    freeLesson: { label: 'Data Engineering MasterClass', href: '/masterclasses/data-engineering/index.html' },
  },
  {
    id: 'full-stack', label: 'Full Stack Developer', note: 'React · APIs', accent: '#0891b2',
    pitch: 'Build complete web products, from the interface people use to the database behind it.',
    forWho: 'Freshers and career switchers who want a strong, portfolio-backed developer profile.',
    learn: ['Build interfaces with React and Next.js', 'Create APIs with Java Spring Boot, Node.js or Python', 'Model data in PostgreSQL and MongoDB', 'Authentication, testing and CI/CD', 'Deploy a capstone app you can demo in interviews'],
    tools: [{ name: 'React', icon: 'react' }, { name: 'Node.js', icon: 'nodejs' }, { name: 'Java', icon: 'java' }, { name: 'FastAPI', icon: 'fastapi' }, { name: 'PostgreSQL', icon: 'postgresql' }, { name: 'Git', icon: 'git' }],
    roles: ['Full Stack Developer', 'Java Full Stack Developer', 'Frontend Developer', 'Backend Developer'],
    courses: ['java-full-stack-development', 'javascript-language-course', 'react-web-development', 'nextjs-web-development', 'nodejs-beginner-course', 'spring-boot-beginner-to-professional', 'postgresql-course'],
    freeLesson: { label: 'Full Stack MasterClass', href: '/masterclasses/full-stack/index.html' },
  },
];

export const pathById = (id: string) => paths.find(p => p.id === id);
export const toolIcon = (icon: string) => `/masterclasses/assets/icons/tech/${icon}.svg`;

/** What every path includes. Kept to claims made elsewhere on the site. */
export const included = [
  'Live online classes with an industry mentor',
  'Real projects for your portfolio',
  'Resume, LinkedIn and interview preparation',
  'Weekday and weekend batches',
  'Recordings and revision support',
];
