import pg from 'pg'
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { assertStagingEnvironment } from '../../src/lib/staging/environment.mjs'
assertStagingEnvironment()
const client = new pg.Client({ connectionString: process.env.DATABASE_URL_UNPOOLED || process.env.STAGING_DATABASE_URL, connectionTimeoutMillis: 15000 })
try {
  await client.connect()
  const identity = (await client.query('SELECT current_database() AS name')).rows[0]
  if (identity.name !== 'tinitiateai_staging') throw Error('Unexpected database identity')
  await client.query("SELECT pg_advisory_lock(hashtext('tinitiate-staging-migrations'))")
  const tables = (await client.query("SELECT tablename FROM pg_tables WHERE schemaname='public'")).rows.map(row => row.tablename)
  if (tables.length && !tables.includes('tinitiate_staging_migrations')) throw Error('A nonempty untracked database must be reviewed before migration')
  await client.query('CREATE TABLE IF NOT EXISTS tinitiate_staging_migrations (name text PRIMARY KEY, sha256 text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())')
  const results = []
  for (const name of ['phase1-baseline.up.sql', 'phase2.up.sql', 'phase2c.up.sql', 'phase2c-storage.up.sql']) {
    let sql
    try { sql = await readFile('src/migrations/postgres/' + name, 'utf8') } catch (error) { if (name === 'phase2c-storage.up.sql' && error.code === 'ENOENT') continue; throw error }
    if (/\b(?:DROP\s+(?:TABLE|COLUMN)|TRUNCATE|DELETE\s+FROM|INSERT\s+INTO)\b/i.test(sql)) throw Error('Unexpected destructive/data statement in reviewed migration')
    const sha = createHash('sha256').update(sql).digest('hex')
    const old = (await client.query('SELECT sha256 FROM tinitiate_staging_migrations WHERE name=$1', [name])).rows[0]
    if (old) { if (old.sha256 !== sha) throw Error('Applied migration checksum changed'); results.push({ name, skipped: true }); continue }
    const body = sql.replace(/^\s*BEGIN;\s*$/gm, '').replace(/^\s*COMMIT;\s*$/gm, '')
    await client.query('BEGIN')
    try { await client.query(body); await client.query('INSERT INTO tinitiate_staging_migrations(name,sha256) VALUES($1,$2)', [name, sha]); await client.query('COMMIT') } catch (error) { await client.query('ROLLBACK'); throw error }
    results.push({ name, applied: true })
  }
  await writeFile('.staging-private/migration-result.json', JSON.stringify({ database: identity.name, results, productionConnections: 0 }, null, 2))
  console.log(JSON.stringify({ database: identity.name, results, productionConnections: 0 }))
} catch (error) { console.error('Staging migration failed:', error.code || error.message); process.exitCode = 1 }
finally { await client.end() }
