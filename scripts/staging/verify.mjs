import { getPayload } from 'payload'
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { DatabaseSync } from 'node:sqlite'
import { assertStagingEnvironment } from '../../src/lib/staging/environment.mjs'
import { objectStore, bucket, HeadObjectCommand } from '../../src/lib/academy/object-store.ts'
const target = assertStagingEnvironment()
const payload = await getPayload({ config: (await import('../../src/payload.config.ts')).default })
try {
  const sql = payload.db.pool
  const snapshot = JSON.parse(await readFile('src/migrations/postgres/phase2c-storage.snapshot.json', 'utf8'))
  const kit = payload.db.requireDrizzleKit()
  const drift = await kit.generateMigration(snapshot, await kit.generateDrizzleJson(payload.db.schema))
  if (drift.length) throw Error('Current Payload schema differs from reviewed migrations')
  for (const table of Object.values(snapshot.tables)) {
    const actual = new Set((await sql.query("SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name=$1", [table.name])).rows.map(row => row.column_name))
    if (Object.keys(table.columns).some(column => !actual.has(column))) throw Error('A reviewed schema column is absent')
  }
  const ledger = (await sql.query('SELECT name,sha256 FROM tinitiate_staging_migrations ORDER BY name')).rows
  if (ledger.length !== 4) throw Error('Expected four applied migrations')
  for (const row of ledger) if (createHash('sha256').update(await readFile('src/migrations/postgres/' + row.name)).digest('hex') !== row.sha256) throw Error('Migration checksum differs')
  const source = new DatabaseSync('.phase2-local/site.db', { readOnly: true })
  const original = JSON.parse(JSON.stringify(source.prepare('SELECT id,slug,category_id,trainer_id FROM courses ORDER BY id').all())); source.close()
  const actual = (await sql.query('SELECT id,slug,category_id,trainer_id FROM courses ORDER BY id')).rows
  if (JSON.stringify(actual) !== JSON.stringify(original)) throw Error('Course IDs or relationships changed')
  const manifest = JSON.parse(await readFile('src/integrations/academy/manifest.json', 'utf8'))
  const anonymous = []
  const media = (await payload.find({ collection: 'media', limit: 1, depth: 0 })).docs[0]
  for (const [kind, key] of [['CONTENT', 'foundational/python/print.html'], ['RECORDINGS', manifest.recordings[0].blob], ['MEDIA', media.filename]]) {
    const response = await fetch(target.storageEndpoint + '/' + bucket(kind) + '/' + encodeURI(key))
    anonymous.push({ bucket: kind, status: response.status })
    if (![401, 403].includes(response.status)) throw Error('An object bucket permits anonymous access')
  }
  for (const video of manifest.recordings) {
    const head = await objectStore().send(new HeadObjectCommand({ Bucket: bucket('RECORDINGS'), Key: video.blob }))
    if (head.ContentLength !== video.bytes || head.Metadata?.sha256 !== video.sha256) throw Error('Original recording object changed')
  }
  const counts = {}
  for (const table of ['users', 'students', 'courses', 'academy_lessons', 'lesson_recordings', 'course_licenses', 'course_subscription_requests', 'course_request_notifications', 'trainer_assignments', 'recording_jobs']) counts[table] = Number((await sql.query(`SELECT count(*) AS n FROM "${table}"`)).rows[0].n)
  if (counts.courses !== 101 || counts.academy_lessons !== 120 || counts.lesson_recordings !== 6) throw Error('Unexpected canonical metadata count')
  for (const table of ['users', 'students']) if (Number((await sql.query(`SELECT count(*) AS n FROM "${table}" WHERE email LIKE '%@example.test'`)).rows[0].n)) throw Error('A copied local fixture account exists')
  const queued = Number((await sql.query("SELECT count(*) n FROM recording_jobs WHERE status IN ('queued','processing')")).rows[0].n)
  const invalidFKs = Number((await sql.query("SELECT count(*) n FROM pg_constraint WHERE connamespace='public'::regnamespace AND NOT convalidated")).rows[0].n)
  if (queued || invalidFKs) throw Error('Outstanding worker jobs or unvalidated constraints')
  const result = { project: target.projectID, branch: target.branchID, counts, courseIDsAndRelationshipsPreserved: true, appliedMigrations: ledger.length, schemaDriftStatements: drift.length, originalVideoObjects: 6, anonymous, queuedJobs: queued, invalidFKs, productionConnections: 0 }
  await writeFile('.staging-private/integrity-result.json', JSON.stringify(result, null, 2))
  console.log(JSON.stringify(result))
} finally { await payload.destroy() }
