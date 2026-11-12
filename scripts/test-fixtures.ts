import { getPayload } from 'payload'
import config from '../src/payload.config'
import { assertLocalImport } from '../src/integrations/azure/import-utils.mjs'

assertLocalImport(process.env)
if (!process.env.DATABASE_URI?.replaceAll('\\', '/').endsWith('/.phase1-local/site.db')) throw new Error('Fixtures require the isolated verification database')
const payload = await getPayload({ config })
try {
  const password = 'Phase1-Local-Verification-Only!'
  for (const collection of ['users', 'students'] as const) {
    const email = collection === 'users' ? 'phase1-admin@example.test' : 'phase1-student@example.test'
    const existing = (await payload.find({ collection, where: { email: { equals: email } }, limit: 1 })).docs[0]
    if (!existing) await payload.create({ collection, data: { email, password, name: 'Phase 1 Local Verification', ...(collection === 'users' ? { role: 'admin' as const } : {}) } })
  }
  const otherEmail = 'phase1-other@example.test'
  let other = (await payload.find({ collection: 'students', where: { email: { equals: otherEmail } }, limit: 1 })).docs[0]
  if (!other) other = await payload.create({ collection: 'students', data: { email: otherEmail, password, name: 'Other Local Student' } })
  const course = (await payload.find({ collection: 'courses', limit: 1 })).docs[0]
  if (!course) throw new Error('Local snapshot needs a course for scheduling/enrollment verification')
  const student = (await payload.find({ collection: 'students', where: { email: { equals: 'phase1-student@example.test' } }, limit: 1 })).docs[0]
  if (!(await payload.count({ collection: 'enrollments', where: { and: [{ student: { equals: student.id } }, { course: { equals: course.id } }] } })).totalDocs) await payload.create({ collection: 'enrollments', data: { student: student.id, course: course.id, status: 'active' } })
  const startsAt = new Date(Date.now() + 7 * 86400000).toISOString()
  if (!(await payload.count({ collection: 'demo-slots', where: { startsAt: { greater_than: new Date().toISOString() } } })).totalDocs) await payload.create({ collection: 'demo-slots', data: { startsAt, endsAt: new Date(Date.parse(startsAt) + 3600000).toISOString(), course: course.id, capacity: 20, isActive: true } })
  console.log('Local verification accounts, enrollment, and future demo slot are ready. No external services were used.')
} finally { await payload.destroy() }
