import { getPayload } from 'payload'
import { readFile, writeFile } from 'node:fs/promises'
import { randomBytes, randomUUID } from 'node:crypto'
import { assertPrivateVerificationEnvironment } from '../../src/lib/staging/environment.mjs'
assertPrivateVerificationEnvironment()
const payload = await getPayload({ config: (await import('../../src/payload.config.ts')).default })
try {
  let saved
  try { saved = JSON.parse(await readFile('.staging-private/verification-accounts.json', 'utf8')) } catch {}
  if (saved && (await payload.count({ collection: 'users', where: { id: { equals: saved.adminID } } })).totalDocs) { console.log('Reusing the isolated staging verification administrator.'); }
  else {
    const id = randomUUID()
    saved = { adminEmail: `verification-admin-${id}@example.invalid`, password: randomBytes(30).toString('base64url'), studentEmail: `verification-student-${id}@example.invalid` }
    const admin = await payload.create({ collection: 'users', data: { email: saved.adminEmail, password: saved.password, name: 'Isolated staging verification', role: 'admin' } })
    saved.adminID = admin.id
    await writeFile('.staging-private/verification-accounts.json', JSON.stringify(saved, null, 2), { mode: 0o600 })
    console.log('Created one new private verification administrator; no local account was copied. Credentials are in the ignored verification file.')
  }
} finally { await payload.destroy() }
