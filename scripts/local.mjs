import { mkdir, access, cp, readFile, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import path from 'node:path'
import {randomBytes} from 'node:crypto'

// Child-process overrides win over .env.local, whose configured PostgreSQL target is never used.
const phase2=process.env.PHASE2_LOCAL==='true'
const folder = path.resolve(phase2?'.phase2-local':'.phase1-local')
await mkdir(folder, { recursive: true })
const database = path.join(folder, 'site.db')
let initializeSchema = false
try { await access(database) } catch {
  try {
    const { DatabaseSync, backup } = await import('node:sqlite')
    const source = new DatabaseSync(phase2?'.phase1-local/site.db':'tinitiateai.db', { readOnly: true })
    try { await backup(source, database) } finally { source.close() }
    initializeSchema = true
  } catch (error) {
    throw new Error('Cannot make an isolated backup of tinitiateai.db. No existing database was modified.', { cause: error })
  }
}
await cp(path.resolve(phase2?'.phase1-local/media':'public/media'), path.join(folder, 'media'), { recursive: true, force: false, errorOnExist: false })
let phase2Secret=''
if(phase2){try{phase2Secret=await readFile(path.join(folder,'session-secret.txt'),'utf8')}catch{phase2Secret=randomBytes(48).toString('hex');await writeFile(path.join(folder,'session-secret.txt'),phase2Secret,{mode:0o600})}}
const command = process.argv[2] || 'dev'
const commands = {
  dev: ['node_modules/next/dist/bin/next', 'dev', '--webpack', ...process.argv.slice(3)],
  build: ['node_modules/next/dist/bin/next', 'build', '--webpack'],
  start: ['node_modules/next/dist/bin/next', 'start', ...process.argv.slice(3)],
  import: ['node_modules/payload/bin.js', 'run', 'scripts/import-azure.ts'],
  enquiries: ['node_modules/payload/bin.js', 'run', 'scripts/import-enquiries.ts'],
  academy: ['node_modules/payload/bin.js','run','scripts/academy/import.ts'],
  'academy-fixtures': ['node_modules/payload/bin.js','run','scripts/academy/fixtures.ts'],
  worker: ['node_modules/payload/bin.js','run','scripts/academy/worker.mjs'],
  initialize: ['node_modules/payload/bin.js','run','scripts/academy/initialize.ts'],
  'phase2c-setup': ['node_modules/payload/bin.js','run','scripts/academy/phase2c-setup.ts'],
  notifications: ['node_modules/payload/bin.js','run','scripts/academy/notifications.ts'],
  fixtures: ['node_modules/payload/bin.js', 'run', 'scripts/test-fixtures.ts'],
}
if (!commands[command]) throw new Error('Unknown local command')
const child = spawn(process.execPath, commands[command], { stdio: 'inherit', env: {
  ...process.env, DB_PROVIDER: 'sqlite', DATABASE_URI: `file:${database.replaceAll('\\', '/')}`,
  DATABASE_URL: '', DATABASE_URL_UNPOOLED: '', INTEGRATION_TARGET: 'local',
  PAYLOAD_SECRET: phase2Secret || process.env.PAYLOAD_SECRET || 'local-phase1-isolated-verification-secret',
  PAYLOAD_MEDIA_DIR: path.join(folder, 'media'),
  PAYLOAD_SCHEMA_PUSH: initializeSchema || process.env.PHASE1_INITIALIZE_SCHEMA === 'true' || command==='initialize' ? 'true' : 'false',
  ...(process.env.PHASE1_ENABLE_CHAT === 'true' ? {} : { CHAT_ENABLED: 'false', GEMINI_API_KEY: '' }),
  ...(process.env.PHASE2_ENABLE_EMAIL === 'true' ? {} : { SMTP_HOST: '', SMTP_USER: '', SMTP_PASS: '', DEMO_NOTIFICATION_EMAIL: '', ADMIN_NOTIFICATION_EMAIL: '', COURSE_REQUEST_NOTIFICATION_EMAIL: '' }),
  GOOGLE_CLIENT_ID: '', GOOGLE_CLIENT_SECRET: '', ENABLE_DEV_SEED: 'false',
} })
child.on('exit', code => { process.exitCode = code ?? 1 })
