import test from 'node:test'
import assert from 'node:assert/strict'
import target from '../src/integrations/staging/target.json' with { type: 'json' }
import { assertStagingEnvironment } from '../src/lib/staging/environment.mjs'
const url = `postgresql://verification@${target.host}/${target.database}?sslmode=verify-full`
const env = { DB_PROVIDER: 'postgres', INTEGRATION_TARGET: 'staging', PAYLOAD_SCHEMA_PUSH: 'false', ENABLE_DEV_SEED: 'false', DATABASE_URL: url, STAGING_DATABASE_URL: url, STAGING_NEON_PROJECT_ID: target.projectID, STAGING_NEON_BRANCH_ID: target.branchID, PAYLOAD_SECRET: 'isolated-verification-only-never-a-real-secret', STORAGE_PROVIDER: 's3', PRIVATE_STORAGE_ENDPOINT: target.storageEndpoint, PRIVATE_STORAGE_ACCESS_KEY_ID: 'verification-only', PRIVATE_STORAGE_SECRET_ACCESS_KEY: 'verification-only', PRIVATE_STORAGE_CONTENT_BUCKET: 'academy-content', PRIVATE_STORAGE_RECORDINGS_BUCKET: 'academy-recordings', PRIVATE_STORAGE_MEDIA_BUCKET: 'site-media', APP_URL: 'https://localhost:3200' }
test('only the independently created staging target is accepted without making a connection', () => { assert.equal(assertStagingEnvironment(env).projectID, target.projectID) })
test('a different Neon host cannot be substituted even when both URL variables match', () => {
  const other = url.replace(target.host, 'production.example.invalid')
  assert.throws(() => assertStagingEnvironment({ ...env, DATABASE_URL: other, STAGING_DATABASE_URL: other }), /allowlist/)
})
test('SQLite, schema push and a different branch are refused', () => {
  assert.throws(() => assertStagingEnvironment({ ...env, DATABASE_URI: 'file:test.db' }), /SQLite/)
  assert.throws(() => assertStagingEnvironment({ ...env, PAYLOAD_SCHEMA_PUSH: 'true' }), /schema push/)
  assert.throws(() => assertStagingEnvironment({ ...env, STAGING_NEON_BRANCH_ID: 'unapproved' }), /branch/)
})
test('staging cannot fall back to filesystem storage or another storage endpoint', () => {
  assert.throws(() => assertStagingEnvironment({ ...env, STORAGE_PROVIDER: 'local' }), /storage/)
  assert.throws(() => assertStagingEnvironment({ ...env, PRIVATE_STORAGE_ENDPOINT: 'https://elsewhere.example.invalid' }), /storage/)
})
test('HTTPS is mandatory, and a loopback application URL is refused on Netlify', () => {
  assert.throws(() => assertStagingEnvironment({ ...env, APP_URL: 'http://localhost:3200' }), /HTTPS/)
  assert.throws(() => assertStagingEnvironment({ ...env, NETLIFY: 'true' }), /public application/)
})
