import { readFile } from 'node:fs/promises'
import { parseEnv } from 'node:util'
import { spawn } from 'node:child_process'
import { assertStagingEnvironment, assertPrivateVerificationEnvironment } from '../../src/lib/staging/environment.mjs'
const settings = parseEnv(await readFile('.env.staging.local', 'utf8'))
const env = { ...process.env, ...settings, DATABASE_URI: '', GOOGLE_CLIENT_ID: '', GOOGLE_CLIENT_SECRET: '', PHASE2_LOCAL: '', ENABLE_DEV_SEED: 'false', PAYLOAD_SCHEMA_PUSH: 'false' }
assertStagingEnvironment(env)
const command = process.argv[2]
if (['test', 'accounts', 'cleanup', 'worker-check'].includes(command)) assertPrivateVerificationEnvironment(env)
const commands = {
  build: ['node_modules/next/dist/bin/next', 'build', '--webpack'],
  start: ['scripts/staging/https-server.mjs'],
  migrate: ['scripts/staging/migrate.mjs'],
  schema: ['node_modules/payload/bin.js', 'run', 'scripts/staging/schema.mjs'],
  import: ['node_modules/payload/bin.js', 'run', 'scripts/staging/import.mjs'],
  verify: ['node_modules/payload/bin.js', 'run', 'scripts/staging/verify.mjs'],
  accounts: ['node_modules/payload/bin.js', 'run', 'scripts/staging/verification-accounts.mjs'],
  types: ['node_modules/payload/bin.js', 'generate:types'],
  'worker-check': ['node_modules/payload/bin.js', 'run', 'scripts/staging/worker-check.mjs'],
  cleanup: ['node_modules/payload/bin.js', 'run', 'scripts/staging/cleanup-verification.mjs'],
  upload: ['scripts/staging/upload.mjs'],
  worker: ['node_modules/payload/bin.js', 'run', 'scripts/academy/worker.mjs'],
  test: ['node_modules/@playwright/test/cli.js', 'test', '--config', 'playwright.staging.config.ts', ...process.argv.slice(3)],
}
if (!commands[command]) throw Error('Unknown staging command')
const child = spawn(process.execPath, commands[command], { stdio: 'inherit', env })
child.on('exit', code => { process.exitCode = code ?? 1 })
