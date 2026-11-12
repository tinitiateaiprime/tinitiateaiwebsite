import { getPayload } from 'payload'
import config from '../../src/payload.config'
if (process.env.INTEGRATION_TARGET !== 'local' || process.env.DB_PROVIDER !== 'sqlite' || !process.env.DATABASE_URI?.replaceAll('\\', '/').endsWith('/.phase2-local/site.db')) throw Error('Phase 2C setup requires isolated Phase 2 SQLite')
const payload = await getPayload({ config })
try {
  const admin = (await payload.find({ collection: 'users', where: { role: { equals: 'admin' } }, limit: 1, depth: 0 })).docs[0]
  const lesson = (await payload.find({ collection: 'academy-lessons', where: { key: { equals: 'foundational-python-print' } }, limit: 1, depth: 0 })).docs[0]
  if (!admin || !lesson) throw Error('Existing administrator and original Python Print import are required')
  const course = await payload.findByID({ collection: 'courses', id: typeof lesson.course === 'object' ? lesson.course.id : lesson.course, depth: 0 })
  if (!course.previewLesson) await payload.update({ collection: 'courses', id: course.id, user: { ...admin, collection: 'users' }, data: { previewLesson: lesson.id, approvePreviewVersion: true } })
  console.log(JSON.stringify({ course: course.id, previewLesson: lesson.key, configuredByLocalAdministrator: true, productionWrites: 0 }))
} finally { await payload.destroy() }
