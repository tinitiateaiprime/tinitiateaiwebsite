// Delete only newly created, reserved verification identities in the allowlisted
// isolated project. Never import/delete accounts from another environment.
import { getPayload } from 'payload'
import { readFile, writeFile } from 'node:fs/promises'
import { assertPrivateVerificationEnvironment } from '../../src/lib/staging/environment.mjs'
assertPrivateVerificationEnvironment()
const payload = await getPayload({ config: (await import('../../src/payload.config.ts')).default })
try {
  const accounts = JSON.parse(await readFile('.staging-private/verification-accounts.json', 'utf8'))
  const students = (await payload.find({ collection: 'students', depth: 0, pagination: false })).docs.filter(row => /^(?:verify|verification)-student-/.test(row.email) && row.email.endsWith('@example.invalid'))
  for (const student of students) {
    for (const collection of ['course-request-notifications', 'course-subscription-requests', 'course-licenses', 'lesson-progress', 'enrollments']) await payload.delete({ collection, where: { student: { equals: student.id } } })
    await payload.delete({ collection: 'students', id: student.id })
  }
  const admin = (await payload.find({ collection: 'users', where: { id: { equals: accounts.adminID } }, depth: 0, limit: 1 })).docs[0]
  if (admin) {
    if (!admin.email.startsWith('verification-admin-') || !admin.email.endsWith('@example.invalid')) throw Error('Refusing to delete an unrelated administrator')
    await payload.delete({ collection: 'recording-jobs', where: { trainer: { equals: admin.id } } })
    await payload.delete({ collection: 'trainer-assignments', where: { trainer: { equals: admin.id } } })
    await payload.delete({ collection: 'users', id: admin.id })
  }
  const uploads = (await payload.find({ collection: 'media', where: { alt: { equals: 'Private staging storage verification' } }, pagination: false, depth: 0 })).docs
  for (const media of uploads) { if (!media.filename?.startsWith('staging-storage-verification')) throw Error('Refusing to delete unrelated media'); await payload.delete({ collection: 'media', id: media.id }) }
  const result = { verificationStudentsRemoved: students.length, verificationAdminRemoved: Boolean(admin), remainingUsers: (await payload.count({ collection: 'users' })).totalDocs, remainingStudents: (await payload.count({ collection: 'students' })).totalDocs, originalAccountsCopied: 0 }
  await writeFile('.staging-private/cleanup-result.json', JSON.stringify(result, null, 2))
  console.log(JSON.stringify(result))
} finally { await payload.destroy() }
