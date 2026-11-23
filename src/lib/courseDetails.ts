import type { Course } from '@/lib/courses';

/**
 * courses.json descriptions mix visitor-facing text with import notes
 * ("Source duration: …", raw JSON for projects). These helpers turn a record
 * into clean, structured content for the course pages.
 */
export type CourseProject = { title: string; description?: string; deliverables?: string[] };
export type CourseDetails = {
  summary: string;
  overview: string[];
  stack: string[];
  prerequisites: string[];
  outcomes: string[];
  projects: CourseProject[];
  capstone?: CourseProject;
};

const INTERNAL = [/^overview-first syllabus/i, /^source (level|category|duration)\s*:/i, /^mode\s*:/i];
const list = (value: string) => value.split(';').map(s => s.trim()).filter(Boolean);
function json<T>(value: string): T | undefined {
  try { return JSON.parse(value) as T; } catch { return undefined; }
}

export function courseDetails(course: Course): CourseDetails {
  const d: CourseDetails = { summary: '', overview: [], stack: [], prerequisites: [], outcomes: [], projects: [] };
  const seen = new Set<string>();
  for (const raw of course.description.split('\n')) {
    const line = raw.trim();
    if (!line || line.toLowerCase() === course.title.toLowerCase() || INTERNAL.some(r => r.test(line))) continue;
    const field = line.match(/^(Prerequisites|Outcomes|Projects|Capstone)\s*:\s*(.*)$/i);
    if (field) {
      const [, key, value] = field;
      switch (key.toLowerCase()) {
        case 'prerequisites': d.prerequisites = /^none\.?$/i.test(value) ? ['No prior experience needed'] : list(value); break;
        case 'outcomes': d.outcomes = list(value); break;
        case 'projects': d.projects = json<CourseProject[]>(value)?.filter(p => p?.title) ?? []; break;
        case 'capstone': d.capstone = json<CourseProject>(value); break;
      }
      continue;
    }
    // Short "A • B • C" or "A + B + C" lines are a technology stack, not prose.
    if (line.length < 80 && /\s[•+]\s/.test(line)) { d.stack.push(...line.split(/\s[•+]\s/).map(s => s.trim()).filter(Boolean)); continue; }
    if (!seen.has(line)) { seen.add(line); d.overview.push(line); }
  }
  const short = course.shortDescription?.trim();
  d.summary = short && short.toLowerCase() !== course.title.toLowerCase() ? short : d.overview[0] ?? '';
  d.overview = d.overview.filter(p => p !== d.summary);
  return d;
}

/** "10weeks" → "10 weeks", "2 Month" → "2 months", "2/Months" → "2 months". */
export function formatDuration(value?: string) {
  if (!value) return 'Flexible';
  if (/contact us/i.test(value)) return 'Flexible schedule';
  return value
    .replace(/(\d)\s*\/?\s*(weeks?|months?|days?)/gi, '$1 $2')
    .replace(/\b(\d+(?:\.\d+)?(?:\s*[–-]\s*\d+(?:\.\d+)?)?)\s+(Week|Month|Day)s?\b/gi, (_, n: string, unit: string) => {
      const plural = n.trim() !== '1';
      return `${n} ${unit.toLowerCase()}${plural ? 's' : ''}`;
    });
}

export const formatLevel = (value?: string) => value ? value[0].toUpperCase() + value.slice(1) : 'All levels';

/** Course categories for browsing. First matching rule wins. */
export const categories = [
  { id: 'ai', label: 'AI & GenAI', test: /gpt|langchain|huggingface|\bai\b/i },
  { id: 'data', label: 'Data Engineering', test: /data-engineering|spark|kafka|airflow|snowflake|snowpark|snowpipe|redshift|glue|emr|athena|kinesis|dataflow|bigquery|pubsub|gcs|adf|databricks|delta|synapse|adls|event-hubs|stream-analytics|aws-s3|lambda|step-functions|csv|json|xml|parquet|pyspark/i },
  { id: 'cloud', label: 'Cloud & DevOps', test: /aws|azure|gcp|docker|kubernetes|linux|terraform|jenkins|github-actions|gitlab|circleci|devops|amplify|netlify|vercel|bitbucket|git/i },
  { id: 'web', label: 'Web & Full Stack', test: /react|angular|next|typescript|javascript|html|css|bootstrap|node|full-stack|spring|django|flask|fastapi|dotnet/i },
  { id: 'data-bi', label: 'Databases & BI', test: /sql|mysql|postgres|oracle|mongodb|power-?bi|tableau|visualization|quicksight|rds/i },
  { id: 'programming', label: 'Programming', test: /python|java|data-structures/i },
] as const;
export type CategoryId = (typeof categories)[number]['id'];

export function courseCategory(course: Course): CategoryId {
  return categories.find(c => c.test.test(course.slug))?.id ?? 'programming';
}
