// Import only the reviewed public catalog and Academy metadata. No auth, contact,
// enrollment, license, request, session or notification data crosses environments.
import { DatabaseSync } from 'node:sqlite'
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { getPayload } from 'payload'
import pg from 'pg'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { assertStagingEnvironment } from '../../src/lib/staging/environment.mjs'
assertStagingEnvironment()
const source = new DatabaseSync('.phase2-local/site.db', { readOnly: true })
const client = new pg.Client({ connectionString: process.env.DATABASE_URL_UNPOOLED })
const manifest = JSON.parse(await readFile('src/integrations/academy/manifest.json', 'utf8'))
const receipts = JSON.parse(await readFile('.staging-private/storage-receipts.json', 'utf8'))
const courses = source.prepare('SELECT * FROM courses ORDER BY id').all()
if (courses.length !== 101 || courses.some(course => course.trainer_id !== null)) throw Error('Catalog identity/trainer references need review before this sanitized import')
const mediaIDs = new Set(courses.flatMap(course => [course.thumbnail_id, course.card_logo_id]).filter(Boolean))
const tables = ['media', 'categories', 'courses', 'courses_curriculum', 'courses_curriculum_topics', 'courses_key_features', 'courses_tools', 'courses_target_audience', 'courses_tags', 'academy_lessons']
const dataset = Object.fromEntries(tables.map(table => [table, source.prepare(`SELECT * FROM "${table}" ORDER BY id`).all().filter(row => table !== 'media' || mediaIDs.has(row.id))]))
source.close()
for (const lesson of dataset.academy_lessons) {
  const original = manifest.lessons.find(row => row.key === lesson.key)
  if (!original || original.fingerprint !== lesson.fingerprint || !courses.some(course => course.id === lesson.course_id)) throw Error('Academy metadata does not match the reviewed manifest')
}
const digest = createHash('sha256').update(JSON.stringify(dataset)).digest('hex')
const s3 = new S3Client({ endpoint: process.env.PRIVATE_STORAGE_ENDPOINT, region: process.env.PRIVATE_STORAGE_REGION, credentials: { accessKeyId: process.env.PRIVATE_STORAGE_ACCESS_KEY_ID, secretAccessKey: process.env.PRIVATE_STORAGE_SECRET_ACCESS_KEY }, forcePathStyle: true, requestChecksumCalculation: 'WHEN_REQUIRED' })
let payload
try {
  await client.connect()
  await client.query('CREATE TABLE IF NOT EXISTS tinitiate_catalog_import (id integer PRIMARY KEY, sha256 text NOT NULL, imported_at timestamptz DEFAULT now())')
  const old = (await client.query('SELECT sha256 FROM tinitiate_catalog_import WHERE id=1')).rows[0]
  if (old && old.sha256 !== digest) throw Error('The reviewed catalog snapshot changed; reconcile before reimport')
  if (!old) {
    for (const table of ['users', 'students', 'courses', 'course_licenses', 'course_subscription_requests']) if (Number((await client.query(`SELECT count(*) n FROM "${table}"`)).rows[0].n)) throw Error('Initial sanitized import requires an empty staging application')
    // Uploaded media remains in a private bucket; Payload authorizes/proxies image reads.
    for (const media of dataset.media) for (const filename of [media.filename, media.sizes_thumbnail_filename, media.sizes_card_filename].filter(Boolean)) {
      if (filename.includes('/') || filename.includes('\\')) throw Error('Unexpected media path')
      const bytes = await readFile('.phase2-local/media/' + filename)
      await s3.send(new PutObjectCommand({ Bucket: process.env.PRIVATE_STORAGE_MEDIA_BUCKET, Key: filename, Body: bytes, ContentType: media.mime_type }))
    }
    await client.query('BEGIN')
    try {
      for (const table of tables) {
        const schema = (await client.query("SELECT column_name,data_type FROM information_schema.columns WHERE table_schema='public' AND table_name=$1", [table])).rows
        const columns = schema.filter(column => dataset[table].length && Object.hasOwn(dataset[table][0], column.column_name))
        for (let offset = 0; offset < dataset[table].length; offset += 80) {
          const batch = dataset[table].slice(offset, offset + 80)
          const values = []
          const rows = batch.map(row => '(' + columns.map(column => {
            let value = row[column.column_name]
            if (table === 'courses' && column.column_name === 'preview_lesson_id' || table === 'academy_lessons' && column.column_name === 'published_recording_id') value = null
            if (column.data_type === 'boolean' && value !== null) value = Boolean(value)
            if (['json', 'jsonb'].includes(column.data_type) && typeof value === 'string') value = JSON.parse(value)
            if (table === 'media' && /(?:^url$|_url$|thumbnail_u_r_l)/.test(column.column_name) && value) value = process.env.APP_URL + '/api/media/file/' + encodeURIComponent(column.column_name.startsWith('sizes_thumbnail') ? row.sizes_thumbnail_filename : column.column_name.startsWith('sizes_card') ? row.sizes_card_filename : row.filename)
            values.push(value); return '$' + values.length
          }).join(',') + ')')
          await client.query(`INSERT INTO "${table}" (${columns.map(column => '"' + column.column_name + '"').join(',')}) VALUES ${rows.join(',')}`, values)
        }
        const sequence = (await client.query('SELECT pg_get_serial_sequence($1,\'id\') AS name', [table])).rows[0]?.name
        if (sequence) await client.query(`SELECT setval($1::regclass, GREATEST(COALESCE((SELECT max(id) FROM "${table}"),0),1), EXISTS(SELECT 1 FROM "${table}"))`, [sequence])
      }
      for (const course of courses.filter(course => course.preview_lesson_id)) await client.query('UPDATE courses SET preview_lesson_id=$1,preview_fingerprint=$2 WHERE id=$3', [course.preview_lesson_id, course.preview_fingerprint, course.id])
      await client.query('INSERT INTO tinitiate_catalog_import(id,sha256) VALUES(1,$1)', [digest])
      await client.query('COMMIT')
    } catch (error) { await client.query('ROLLBACK'); throw error }
  }
  payload = await getPayload({ config: (await import('../../src/payload.config.ts')).default })
  for (const row of manifest.recordings) {
    const lesson = (await payload.find({ collection: 'academy-lessons', where: { key: { equals: row.lessonKey } }, limit: 1, depth: 0 })).docs[0]
    const key = `${row.lessonKey}:${row.sha256}:${lesson.fingerprint}`
    if (!(await payload.count({ collection: 'lesson-recordings', where: { key: { equals: key } } })).totalDocs) await payload.create({ collection: 'lesson-recordings', data: { key, lesson: lesson.id, fingerprint: lesson.fingerprint, blob: row.blob, sha256: row.sha256, bytes: row.bytes, duration: row.duration, status: 'pending-review', metadata: { ...row.metadata, storageVerification: receipts[row.lessonKey] } } })
  }
  const result = { catalogCourses: courses.length, categories: dataset.categories.length, importedMedia: dataset.media.length, academyLessons: dataset.academy_lessons.length, originalRecordings: 6, courseIDsPreserved: true, authAccountsCopied: 0, personalRecordsCopied: 0, reused: Boolean(old) }
  await writeFile('.staging-private/import-result.json', JSON.stringify(result, null, 2))
  console.log(JSON.stringify(result))
} finally { if (payload) await payload.destroy(); await client.end(); s3.destroy() }
