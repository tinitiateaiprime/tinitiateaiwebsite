// Generate a review artifact only. No connection or production schema push is allowed.
import { getPayload } from 'payload'
import { readFile, writeFile } from 'node:fs/promises'
process.env.DB_PROVIDER = 'postgres'
process.env.DATABASE_URL = ''
process.env.DATABASE_URL_UNPOOLED = ''
process.env.PAYLOAD_SCHEMA_PUSH = 'false'
const config = (await import('../../src/payload.config.ts')).default
const payload = await getPayload({ config, disableDBConnect: true, disableOnInit: true })
try {
  const before = JSON.parse(await readFile('src/migrations/postgres/phase2.snapshot.json', 'utf8'))
  const { generateDrizzleJson, generateMigration } = payload.db.requireDrizzleKit()
  const after = await generateDrizzleJson(payload.db.schema)
  const statements = await generateMigration(before, after)
  if (statements.some(sql => /DROP TABLE|DROP COLUMN|TRUNCATE|DELETE FROM/i.test(sql))) throw Error('Unexpected destructive Phase 2C migration')
  await writeFile('src/migrations/postgres/phase2c.up.sql', '-- Offline review artifact; never applied. Compare with staging schema first.\nBEGIN;\n' + statements.join('\n\n') + '\nCOMMIT;\n')
  await writeFile('src/migrations/postgres/phase2c.snapshot.json', JSON.stringify(after, null, 2))
  console.log(JSON.stringify({ offline: true, connectionDisabled: true, statements: statements.length, productionWrites: 0 }))
} finally { await payload.destroy() }
