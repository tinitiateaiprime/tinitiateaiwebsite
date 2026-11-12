import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const base = {
  BRANCH: 'deploy/netlify-staging', DB_PROVIDER: 'postgres', INTEGRATION_TARGET: 'staging',
  PAYLOAD_SCHEMA_PUSH: 'false', ENABLE_DEV_SEED: 'false',
  PAYLOAD_SECRET: 'preflight-verification-only-never-use-as-a-secret',
  STAGING_DATABASE_URL: 'postgresql://staging.example.test/isolated_staging',
  DATABASE_URL: 'postgresql://staging.example.test/isolated_staging',
}
function run(script, env) {
  return spawnSync(process.execPath, [script], { encoding: 'utf8', env })
}
test('Netlify ignores other branches and considers only the explicit staging branch', () => {
  assert.equal(run('scripts/netlify-ignore.cjs', { BRANCH: 'main' }).status, 0)
  assert.equal(run('scripts/netlify-ignore.cjs', { BRANCH: base.BRANCH }).status, 1)
})
test('unconfigured Netlify build stops before invoking Next.js or any database', () => {
  const result = run('scripts/netlify-preflight.mjs', {})
  assert.equal(result.status, 1)
  assert.match(result.stderr, /STAGING_DATABASE_URL/)
  assert.match(result.stderr, /Release blocked/)
})
test('valid-looking variables cannot bypass the outstanding hosting review', () => {
  const result = run('scripts/netlify-preflight.mjs', base)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /separate worker hosting/)
  assert.ok(!result.stderr.includes(base.PAYLOAD_SECRET))
  assert.ok(!result.stderr.includes(base.STAGING_DATABASE_URL))
})
test('mismatched database configuration and SQLite are rejected without printing values', () => {
  const result = run('scripts/netlify-preflight.mjs', { ...base, DATABASE_URL: 'postgresql://wrong.example.test/wrong_database', DATABASE_URI: 'file:local.db' })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /must match/)
  assert.match(result.stderr, /Remove DATABASE_URI/)
  assert.ok(!result.stderr.includes('wrong.example.test'))
})
