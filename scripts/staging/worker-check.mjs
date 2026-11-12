import { getPayload } from 'payload'
import { readFile, writeFile } from 'node:fs/promises'
import { assertPrivateVerificationEnvironment } from '../../src/lib/staging/environment.mjs'
assertPrivateVerificationEnvironment()
const payload = await getPayload({ config: (await import('../../src/payload.config.ts')).default })
try {
  const accounts = JSON.parse(await readFile('.staging-private/verification-accounts.json', 'utf8'))
  const admin = await payload.findByID({ collection: 'users', id: accounts.adminID, depth: 0 })
  if (!admin.email.startsWith('verification-admin-') || !admin.email.endsWith('@example.invalid')) throw Error('Unexpected verification identity')
  const lesson = (await payload.find({ collection: 'academy-lessons', where: { key: { equals: 'foundational-python-print' } }, depth: 0, limit: 1 })).docs[0]
  const assignmentKey = `staging-verification:${admin.id}:python`
  if (!(await payload.count({ collection: 'trainer-assignments', where: { key: { equals: assignmentKey } } })).totalDocs) await payload.create({ collection: 'trainer-assignments', data: { key: assignmentKey, trainer: admin.id, course: 2, active: true } })
  const key = `staging-verification:${admin.id}:${lesson.fingerprint}`
  let job = (await payload.find({ collection: 'recording-jobs', where: { key: { equals: key } }, depth: 0, limit: 1 })).docs[0]
  if (!job) job = await payload.create({ collection: 'recording-jobs', data: { key, lesson: lesson.id, trainer: admin.id, fingerprint: lesson.fingerprint, mode: 'silent-preview', status: 'queued' } })
  await writeFile('.staging-private/worker-job.json', JSON.stringify({ id: job.id, status: job.status }, null, 2))
  console.log(JSON.stringify({ job: job.id, status: job.status, publishesRecording: false }))
} finally { await payload.destroy() }
