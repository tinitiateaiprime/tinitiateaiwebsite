import pg from 'pg'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { groupSources, loadSources, matchCourse } from '../src/integrations/azure/import-utils.mjs'

process.loadEnvFile('.env.local')
const client = new pg.Client({ connectionString: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL, connectionTimeoutMillis: 10000, statement_timeout: 10000 })
try {
  await client.connect()
  await client.query('BEGIN READ ONLY')
  const { rows } = await client.query('SELECT id, title, slug FROM courses ORDER BY id')
  const aliases = JSON.parse(await readFile(new URL('../src/integrations/azure/course-aliases.json', import.meta.url), 'utf8'))
  const groups = groupSources(await loadSources(new URL('../src/integrations/azure/data/', import.meta.url)), aliases)
  const plans = groups.map(group => {
    const existing = matchCourse(group, rows)
    return { sourceSlugs: [...group.aliases], canonicalSlug: existing?.slug || group.slug, existingID: existing?.id, action: existing ? 'merge' : 'create' }
  })
  await client.query('ROLLBACK')
  await mkdir('.integration-private', { recursive: true })
  await writeFile('.integration-private/postgres-course-preview.json', JSON.stringify({ readOnly: true, existingCourses: rows.length, plans }, null, 2))
  console.log(JSON.stringify({ readOnly: true, existingCourses: rows.length, merge: plans.filter(p => p.action === 'merge').length, create: plans.filter(p => p.action === 'create').length, report: '.integration-private/postgres-course-preview.json' }))
} catch (error) {
  console.error(`Read-only PostgreSQL preview failed (${error.code || 'CONNECTION_OR_QUERY_FAILED'}). Connection details are withheld.`)
  process.exitCode = 1
} finally { await client.end() }
