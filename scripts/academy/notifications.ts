import { getPayload } from 'payload'
import config from '../../src/payload.config'
import { deliverCourseNotification } from '../../src/lib/commerce/notifications'
if (process.env.INTEGRATION_TARGET !== 'local' || process.env.DB_PROVIDER !== 'sqlite' || !process.env.DATABASE_URI?.replaceAll('\\', '/').endsWith('/.phase2-local/site.db')) throw Error('Notification verification requires isolated Phase 2 SQLite')
const payload = await getPayload({ config })
try {
  const id = process.env.COURSE_NOTIFICATION_ID ? Number(process.env.COURSE_NOTIFICATION_ID) : null
  const rows = await payload.find({ collection: 'course-request-notifications', where: id ? { id: { equals: id } } : { deliveryStatus: { in: ['queued', 'failed', 'not-configured'] } }, limit: 20, depth: 0 })
  for (const row of rows.docs) {
    const result = await deliverCourseNotification(row.id)
    console.log(JSON.stringify({ notification: result.id, status: result.deliveryStatus, attempts: result.attempts, externalInboxDeliveryVerified: false }))
  }
} finally { await payload.destroy() }
