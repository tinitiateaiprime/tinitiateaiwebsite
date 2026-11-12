import { readFile } from 'node:fs/promises'

export const normalizeTitle = value => String(value || '').toLowerCase().replace(/\b(course|training|language)\b/g, '').replace(/[^a-z0-9]+/g, '')
export const slugify = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function groupSources(sources, aliases) {
  const groups = new Map()
  for (const source of sources) {
    const slug = source.record.slug || source.record.key || source.record.href?.split('/').pop()
    if (!slug || !source.record.title) throw new Error(`Missing source identifier/title: ${source.source}`)
    const target = aliases[slug] || slug
    const group = groups.get(target) || { slug: target, aliases: new Set([target]), sources: [] }
    group.aliases.add(slug)
    group.sources.push(source)
    groups.set(target, group)
  }
  return [...groups.values()]
}

export function matchCourse(group, courses) {
  const exact = courses.filter(course => group.aliases.has(course.slug))
  if (exact.length > 1) throw new Error(`Ambiguous existing slugs for ${group.slug}: ${exact.map(c => c.slug)}`)
  if (exact.length) return exact[0]
  const titles = new Set(group.sources.map(s => normalizeTitle(s.record.title)))
  const matches = courses.filter(course => titles.has(normalizeTitle(course.title)))
  if (matches.length > 1) throw new Error(`Ambiguous title match for ${group.slug}; supply an explicit alias mapping`)
  return matches[0]
}

export function mergeCurriculum(existing = [], incoming = []) {
  const modules = structuredClone(existing || [])
  for (const section of incoming) {
    const title = section.moduleTitle || section.title || section.name
    if (!title) continue
    let curriculumModule = modules.find(item => normalizeTitle(item.moduleTitle) === normalizeTitle(title))
    if (!curriculumModule) { curriculumModule = { moduleTitle: title, topics: [] }; modules.push(curriculumModule) }
    curriculumModule.topics ||= []
    for (const topic of section.topics || section.lessons || []) {
      const text = typeof topic === 'string' ? topic : topic.topic || topic.title || JSON.stringify(topic)
      if (!curriculumModule.topics.some(item => item.topic === text)) curriculumModule.topics.push({ topic: text })
    }
  }
  return modules
}

export async function loadSources(directory) {
  const files = ['courses.json', 'professional-training-syllabus.json', 'professionalCourses/backend.json', 'professionalCourses/cloud.json', 'professionalCourses/dataEngineering.json', 'professionalCourses/reporting.json', 'it-training.json']
  const sources = []
  for (const source of files) {
    const data = JSON.parse(await readFile(new URL(source, directory), 'utf8'))
    const records = Array.isArray(data) ? data : data.courses || [...(data.beginner || []), ...(data.advanced || [])]
    for (const record of records) sources.push({ source, record })
  }
  return sources
}

/** Enquiry IDs are scoped to the originating Cosmos database/container. */
export function enquiryData(record, source) {
  if (!record || !record.id || !record.name || !record.email || !record.createdAt || Number.isNaN(Date.parse(record.createdAt))) throw new Error('Enquiry is missing its stable ID, name, email or original timestamp')
  if (!/^[a-zA-Z0-9._-]{1,100}$/.test(source)) throw new Error('Invalid enquiry source namespace')
  return {
    name: String(record.name), email: String(record.email), phone: String(record.phone || ''),
    subject: `Cosmos ${source}:${record.id}`,
    message: [`Course: ${record.course || ''}`, `Preferred time: ${record.preferredTime || ''}`, `Original enquiry: ${record.createdAt}`, String(record.message || '')].join('\n\n'),
    createdAt: record.createdAt,
  }
}

export function assertLocalImport(env) {
  if (env.NODE_ENV === 'production' || env.INTEGRATION_TARGET !== 'local' || env.DB_PROVIDER !== 'sqlite' || !env.DATABASE_URI?.startsWith('file:')) throw new Error('Imports require an explicit local SQLite target. PostgreSQL and production imports are refused.')
}
