import { readFile, writeFile } from 'node:fs/promises'
import { parseEnv } from 'node:util'
import { randomBytes } from 'node:crypto'
const env = JSON.parse(await readFile('.staging-private/bootstrap.json', 'utf8'))
env.PAYLOAD_SECRET = randomBytes(48).toString('hex')
// Copy only the explicitly required mail settings. Never load the production DB.
const local = parseEnv(await readFile('.env.local', 'utf8'))
for (const name of ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM', 'DEMO_NOTIFICATION_EMAIL', 'ADMIN_NOTIFICATION_EMAIL', 'COURSE_REQUEST_NOTIFICATION_EMAIL']) if (local[name]) env[name] = local[name]
env.COURSE_REQUEST_NOTIFICATION_EMAIL ||= env.ADMIN_NOTIFICATION_EMAIL || env.DEMO_NOTIFICATION_EMAIL || ''
await writeFile('.env.staging.local', Object.entries(env).map(([key, value]) => `${key}=${JSON.stringify(value)}`).join('\n') + '\n', { mode: 0o600, flag: 'wx' })
console.log('Created ignored .env.staging.local. Staging secrets are stored there; keep that file private and store a secure backup. No credentials printed.')
