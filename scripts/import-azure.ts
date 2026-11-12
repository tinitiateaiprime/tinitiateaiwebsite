import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import aliases from '../src/integrations/azure/course-aliases.json'
import { assertLocalImport, groupSources, loadSources, matchCourse, mergeCurriculum, slugify } from '../src/integrations/azure/import-utils.mjs'
import { richTextFromParagraphs } from '../src/seed/richText'
import type { Course } from '../src/payload-types'

type AzureRecord = {
  title: string; description?: string; overview?: string; subtitle?: string;
  prerequisites?: string | string[]; mode?: string; level?: string; category?: string;
  duration?: string; outcomes?: string[]; projects?: unknown[]; capstone?: unknown;
  courseStructure?: object[]; modules?: object[]; stack?: string[]; image?: string;
}

assertLocalImport(process.env)
const apply = process.env.INTEGRATION_APPLY === 'true'
const sources = await loadSources(new URL('../src/integrations/azure/data/', import.meta.url))
const groups = groupSources(sources, aliases)
const payload = await getPayload({ config })
const journalDirectory = path.resolve('.integration-private')
await mkdir(journalDirectory, { recursive: true })
const journal = path.join(journalDirectory, `courses-${Date.now()}.jsonl`)
const report: object[] = []
const log = async (entry: object) => {
  const { appendFile } = await import('node:fs/promises')
  await appendFile(journal, JSON.stringify(entry) + '\n', { mode: 0o600 })
}
try {
  const courses = (await payload.find({ collection: 'courses', pagination: false, depth: 0 })).docs
  // Preflight every match before making any writes; ambiguity must stop the entire import.
  const plans = groups.map(group => ({ group, existing: matchCourse(group, courses) }))
  const matches = new Map<number, string>()
  for (const { group, existing } of plans) {
    if (existing && matches.has(existing.id)) throw new Error(`Multiple source groups resolve to ${existing.slug}; map their aliases together before importing`)
    if (existing) matches.set(existing.id, group.slug)
  }
  if (apply && plans.some(plan => !plan.existing) && (!process.env.INTEGRATION_NEW_COURSE_PRICE || !Number.isFinite(Number(process.env.INTEGRATION_NEW_COURSE_PRICE)) || Number(process.env.INTEGRATION_NEW_COURSE_PRICE) < 0)) throw new Error('New courses require INTEGRATION_NEW_COURSE_PRICE, explicitly reviewed by the operator')
  for (const { group, existing } of plans) {
    const records: AzureRecord[] = group.sources.map((source: { record: AzureRecord }) => source.record)
    const record = records[0]
    const paragraphs = [...new Set(records.flatMap(item => [item.description, item.overview, item.subtitle,
      item.prerequisites && `Prerequisites: ${Array.isArray(item.prerequisites) ? item.prerequisites.join('; ') : item.prerequisites}`,
      item.mode && `Mode: ${item.mode}`, item.level && `Source level: ${item.level}`, item.category && `Source category: ${item.category}`,
      item.duration && `Source duration: ${item.duration}`,
      item.outcomes && `Outcomes: ${item.outcomes.join('; ')}`,
      item.projects && `Projects: ${JSON.stringify(item.projects)}`,
      item.capstone && `Capstone: ${JSON.stringify(item.capstone)}`,
    ].filter(Boolean)))] as string[]
    const existingJSON = JSON.stringify(existing?.description || '')
    const addition = richTextFromParagraphs(paragraphs.filter(text => !existingJSON.includes(JSON.stringify(text).slice(1, -1))))
    const description = existing?.description ? { ...existing.description, root: { ...existing.description.root, children: [...existing.description.root.children, ...addition.root.children] } } : richTextFromParagraphs(paragraphs.length ? paragraphs : [record.title])
    const curriculum = mergeCurriculum(existing?.curriculum, records.flatMap(item => item.courseStructure || item.modules || []))
    const keyFeatures = [...(existing?.keyFeatures || [])]
    for (const feature of records.flatMap(item => item.outcomes || [])) if (!keyFeatures.some(item => item.feature === feature)) keyFeatures.push({ feature })
    const tools = [...(existing?.tools || [])]
    for (const tool of records.flatMap(item => Array.isArray(item.stack) ? item.stack : [])) if (!tools.some(item => item.tool === tool)) tools.push({ tool })
    const data = { description, curriculum, keyFeatures, tools }
    const changed = !existing || Object.entries(data).some(([key, value]) => JSON.stringify(value) !== JSON.stringify(existing[key as keyof Course]))
    const mapping = { sourceSlugs: [...group.aliases], canonicalSlug: existing?.slug || group.slug, id: existing?.id, action: existing ? changed ? 'merge' : 'unchanged' : 'create' }
    report.push(mapping)
    if (!apply || !changed) continue
    if (existing) {
      await log({ collection: 'courses', operation: 'update', id: existing.id, before: existing })
      await payload.update({ collection: 'courses', id: existing.id, data })
      continue
    }
    const categoryName = record.category || 'IT Training'
    const categorySlug = slugify(categoryName)
    let category = (await payload.find({ collection: 'categories', where: { or: [{ slug: { equals: categorySlug } }, { name: { equals: categoryName } }] }, limit: 1 })).docs[0]
    if (!category) {
      await log({ collection: 'categories', operation: 'create-intent', slug: categorySlug })
      category = await payload.create({ collection: 'categories', data: { name: categoryName, slug: categorySlug } })
      await log({ collection: 'categories', operation: 'created', id: category.id })
    }
    let thumbnail: number | undefined
    const image = records.find(item => item.image)?.image
    if (image?.startsWith('/images/') && !image.includes('..')) {
      const file = path.resolve('public/azure', image.slice(1))
      try {
        const buffer = await readFile(file)
        const filename = `azure-${path.basename(image)}`
        let media = (await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 })).docs[0]
        if (!media) {
          await log({ collection: 'media', operation: 'create-intent', filename })
          media = await payload.create({ collection: 'media', data: { alt: record.title }, file: { data: buffer, name: filename, mimetype: image.endsWith('.svg') ? 'image/svg+xml' : image.endsWith('.jpg') || image.endsWith('.jpeg') ? 'image/jpeg' : image.endsWith('.webp') ? 'image/webp' : 'image/png', size: buffer.length } })
          await log({ collection: 'media', operation: 'created', id: media.id })
        }
        thumbnail = media.id
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
        report.push({ missingImage: image, course: group.slug })
      }
    }
    await log({ collection: 'courses', operation: 'create-intent', slug: group.slug })
    const created = await payload.create({ collection: 'courses', data: {
      ...data, title: record.title, slug: group.slug, category: category.id,
      shortDescription: (record.description || record.overview || record.title).slice(0, 200),
      level: /intermediate|advanced|professional/i.test(record.level || '') && !/beginner/i.test(record.level || '') ? 'intermediate' : 'beginner',
      duration: record.duration || 'Contact us for the current schedule', price: Number(process.env.INTEGRATION_NEW_COURSE_PRICE), thumbnail, cardLogo: thumbnail,
    } })
    await log({ collection: 'courses', operation: 'created', id: created.id })
  }
  await writeFile(path.join(journalDirectory, 'course-import-report.json'), JSON.stringify({ apply, sourceRows: sources.length, courses: report }, null, 2))
  console.log(JSON.stringify({ apply, sourceRows: sources.length, canonicalGroups: groups.length, actions: report.reduce<Record<string, number>>((counts, item) => { const action = (item as { action?: string }).action || 'warning'; counts[action] = (counts[action] || 0) + 1; return counts }, {}), report: '.integration-private/course-import-report.json', journal: apply ? journal : null }, null, 2))
} finally { await payload.destroy() }
