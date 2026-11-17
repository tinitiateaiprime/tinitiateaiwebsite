export type MasterclassTrack = { name: string; logo: string; technology: string; href?: string; kind: 'MasterClass' | 'Course overview' | 'Upcoming'; companion?: { name: string; href: string } };
const icons = '/masterclasses/assets/icons/tech/';
export const masterclassVerticals: { name: string; description: string; tracks: MasterclassTrack[] }[] = [
  { name: 'AI', description: 'Build with AI, from assisted coding to production agent systems.', tracks: [
    { name: 'Vibe Coding', logo: icons + 'cursor.svg', technology: 'Cursor — AI-assisted coding', kind: 'Upcoming' },
    { name: 'LangGraph + MCP + RAG + Guardrails + MLflow + MLOps', logo: icons + 'langgraph.svg', technology: 'LangGraph', href: '/masterclasses/ai/langgraph/index.html', kind: 'MasterClass' },
    { name: 'CrewAI + MCP + RAG + Guardrails + MLflow + MLOps', logo: icons + 'crewai-icon.svg', technology: 'CrewAI', href: '/masterclasses/ai/crewai/index.html', kind: 'MasterClass' },
    { name: 'AWS Bedrock + Strands + MCP + RAG + Guardrails + MLflow + MLOps', logo: icons + 'aws.svg', technology: 'AWS', href: '/masterclasses/ai/aws-bedrock/index.html', kind: 'MasterClass', companion: { name: 'Strands companion', href: '/masterclasses/ai/aws-strands/index.html' } },
    { name: 'Azure Foundry + MCP + RAG + Guardrails + MLflow + MLOps', logo: icons + 'azure.svg', technology: 'Microsoft Azure', href: '/masterclasses/ai/azure-foundry/index.html', kind: 'MasterClass' },
    { name: 'Claude SDK + MCP + RAG + Guardrails + MLflow + MLOps', logo: icons + 'claude.svg', technology: 'Claude', href: '/masterclasses/ai/claude-sdk/index.html', kind: 'MasterClass' },
    { name: 'Gemini ADK + MCP + RAG + Guardrails + MLflow + MLOps', logo: icons + 'google-gemini-icon.svg', technology: 'Google Gemini', href: '/masterclasses/ai/google-gemini-sdk/index.html', kind: 'MasterClass' },
  ] },
  { name: 'Data Engineering', description: 'Explore the platforms behind modern data pipelines and lakehouses.', tracks: [
    { name: 'Snowflake Data Engineering', logo: icons + 'snowflake.svg', technology: 'Snowflake', href: '/masterclasses/snowflake-dataengineering/index.html', kind: 'MasterClass' },
    { name: 'AWS Data Engineering', logo: icons + 'aws.svg', technology: 'AWS', href: '/masterclasses/aws-dataengineering/index.html', kind: 'MasterClass' },
    { name: 'Azure Data Engineering', logo: icons + 'azure.svg', technology: 'Microsoft Azure', href: '/masterclasses/azure-dataengineering/index.html', kind: 'MasterClass' },
    { name: 'GCP Data Engineering', logo: icons + 'google-cloud.svg', technology: 'Google Cloud', href: '/courses/gcp-data-engineering', kind: 'Course overview' },
    { name: 'Databricks Data Engineering', logo: icons + 'databricks.svg', technology: 'Databricks', href: '/masterclasses/databricks-dataengineering/index.html', kind: 'MasterClass' },
    { name: 'PySpark Data Engineering', logo: icons + 'spark.svg', technology: 'Apache Spark', href: '/masterclasses/pyspark/index.html', kind: 'MasterClass' },
  ] },
];
