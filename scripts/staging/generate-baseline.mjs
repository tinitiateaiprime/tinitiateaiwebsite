// Build an explicit empty-database baseline from the original Phase 2 snapshot.
// This script never connects to a database and never replaces the reviewed UPs.
import { getPayload } from 'payload'
import { readFile, writeFile } from 'node:fs/promises'
process.env.INTEGRATION_TARGET = 'offline'
process.env.DB_PROVIDER = 'postgres'
process.env.DATABASE_URL = ''; process.env.DATABASE_URL_UNPOOLED = ''
process.env.PAYLOAD_SCHEMA_PUSH = 'false'
const payload = await getPayload({ config: (await import('../../src/payload.config.ts')).default, disableDBConnect: true, disableOnInit: true })
try {
  const baseline = JSON.parse(await readFile('src/migrations/postgres/phase2.snapshot.json', 'utf8'))
  const additions = ['academy_lessons', 'course_licenses', 'trainer_assignments', 'lesson_progress', 'lesson_recordings', 'recording_jobs']
  const isNew = name => additions.some(prefix => name === prefix || name.startsWith(prefix + '_'))
  for (const [name, table] of Object.entries(baseline.tables)) if (isNew(table.name)) delete baseline.tables[name]
  for (const table of Object.values(baseline.tables)) {
    for (const column of Object.keys(table.columns)) if (isNew(column.replace(/_id$/, '')) || column === 'reset_password_requested_at') delete table.columns[column]
    for (const [name, index] of Object.entries(table.indexes || {})) if (index.columns.some(column => !table.columns[column.expression])) delete table.indexes[name]
    for (const [name, fk] of Object.entries(table.foreignKeys || {})) if (isNew(fk.tableTo) || fk.columnsFrom.some(column => !table.columns[column])) delete table.foreignKeys[name]
  }
  for (const [name, enumeration] of Object.entries(baseline.enums)) {
    if (additions.some(prefix => enumeration.name.startsWith('enum_' + prefix + '_'))) delete baseline.enums[name]
    else if (enumeration.name === 'enum_users_role') enumeration.values = enumeration.values.filter(value => value !== 'trainer')
  }
  const empty = { ...structuredClone(baseline), tables: {}, enums: {}, schemas: {}, sequences: {}, views: {}, roles: {}, policies: {} }
  const statements = await payload.db.requireDrizzleKit().generateMigration(empty, baseline)
  if (statements.some(sql => /DROP TABLE|DROP COLUMN|TRUNCATE|DELETE FROM/i.test(sql))) throw Error('Destructive baseline refused')
  await writeFile('src/migrations/postgres/phase1-baseline.up.sql', '-- Empty isolated staging database only; reconstructed from the original Phase 2 snapshot.\nBEGIN;\n' + statements.join('\n\n') + '\nCOMMIT;\n')
  console.log(JSON.stringify({ offline: true, baselineStatements: statements.length, databaseConnections: 0 }))
} finally { await payload.destroy() }
