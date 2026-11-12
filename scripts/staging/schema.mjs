import { getPayload } from 'payload'
import { readFile, writeFile } from 'node:fs/promises'
const payload = await getPayload({ config: (await import('../../src/payload.config.ts')).default, disableDBConnect: true, disableOnInit: true })
try {
  const before = JSON.parse(await readFile('src/migrations/postgres/phase2c.snapshot.json', 'utf8'))
  const kit = payload.db.requireDrizzleKit()
  const after = await kit.generateDrizzleJson(payload.db.schema)
  const statements = await kit.generateMigration(before, after)
  if (statements.some(sql => /DROP TABLE|DROP COLUMN|TRUNCATE|DELETE FROM/i.test(sql))) throw Error('Destructive storage migration refused')
  await writeFile('src/migrations/postgres/phase2c-storage.up.sql', '-- Additive durable-media adapter fields; staging-only reviewed application.\nBEGIN;\n' + statements.join('\n\n') + '\nCOMMIT;\n')
  await writeFile('src/migrations/postgres/phase2c-storage.snapshot.json', JSON.stringify(after, null, 2))
  console.log(JSON.stringify({ statements: statements.length, databaseConnections: 0 }))
} finally { await payload.destroy() }
