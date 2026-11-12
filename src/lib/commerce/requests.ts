import { randomUUID } from 'node:crypto'
import { APIError, createLocalReq, type Payload, type PayloadRequest } from 'payload'
import { getPayload } from '@/lib/getPayload'
import { deliverCourseNotification } from './notifications'
import type { Student } from '@/payload-types'

export async function activeCourseIDs(payload: Payload, student: number, req?: PayloadRequest) {
  const now = new Date().toISOString()
  const licenses = await payload.find({ collection: 'course-licenses', req, depth: 0, pagination: false, where: { and: [
    { student: { equals: student } }, { status: { equals: 'active' } }, { or: [{ startsAt: { exists: false } }, { startsAt: { less_than_equal: now } }] }, { or: [{ expiresAt: { exists: false } }, { expiresAt: { greater_than: now } }] },
  ] } })
  return new Set(licenses.docs.flatMap(row => row.courses.map(course => typeof course === 'object' ? course.id : course)))
}

const locks = new Map<number, Promise<void>>()
async function serialize<T>(student: number, run: () => Promise<T>) {
  const before = locks.get(student) || Promise.resolve()
  let release!: () => void
  const next = new Promise<void>(resolve => { release = resolve })
  locks.set(student, next)
  await before
  try { return await run() } finally { release(); if (locks.get(student) === next) locks.delete(student) }
}

export async function submitCourseRequests(student: Student & { collection: 'students' }, courseIDs: number[]) {
  const payload = await getPayload()
  const result = await serialize(student.id, async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      const req = await createLocalReq({ user: student, context: { courseCheckout: true } }, payload)
      const transactionID = await payload.db.beginTransaction()
      if (!transactionID) throw new APIError('Transactional checkout is unavailable.', 503)
      req.transactionID = transactionID
      try {
        const courses = (await payload.find({ collection: 'courses', req, where: { id: { in: courseIDs } }, pagination: false, depth: 0 })).docs
        if (courses.length !== courseIDs.length) throw new APIError('One or more selected courses are no longer available. Review your selection.', 400)
        const licensed = await activeCourseIDs(payload, student.id, req)
        const checkoutReference = `CHECKOUT-${randomUUID()}`
        const requestedAt = new Date().toISOString()
        const submitted = [], existing = [], skipped = []
        for (const course of courses) {
          if (licensed.has(course.id)) { skipped.push(course.id); continue }
          const key = `${student.id}:${course.id}`
          const old = (await payload.find({ collection: 'course-subscription-requests', req, where: { key: { equals: key } }, limit: 1, depth: 0 })).docs[0]
          if (old?.status === 'pending') { existing.push(old); continue }
          const data = { key, reference: old?.reference || `CSR-${randomUUID()}`, checkoutReference, student: student.id, course: course.id, studentName: student.name, studentEmail: student.email, studentPhone: student.phone || '', requestedAt, status: 'pending' as const, paymentStatus: 'not-collected' as const, reviewNote: null, reviewedAt: null, reviewedBy: null,
            history: [...(Array.isArray(old?.history) ? old.history : []), { status: 'pending', at: requestedAt }] }
          submitted.push(old ? await payload.update({ collection: 'course-subscription-requests', id: old.id, data, req }) : await payload.create({ collection: 'course-subscription-requests', data, req }))
        }
        let notification: number | null = null
        if (submitted.length) {
          const mail = await payload.create({ collection: 'course-request-notifications', req, data: { key: checkoutReference, reference: checkoutReference, student: student.id, requests: submitted.map(row => row.id), studentName: student.name, studentEmail: student.email, studentPhone: student.phone || '', submittedAt: requestedAt, courses: submitted.map(row => ({ id: typeof row.course === 'object' ? row.course.id : row.course, title: courses.find(course => course.id === (typeof row.course === 'object' ? row.course.id : row.course))!.title, reference: row.reference })), deliveryStatus: 'queued', attempts: 0 } })
          notification = mail.id
          for (const row of submitted) await payload.update({ collection: 'course-subscription-requests', id: row.id, req, data: { notification } })
        }
        await payload.db.commitTransaction(transactionID)
        return { submitted, existing, skipped, notification, reference: submitted.length ? checkoutReference : existing[0]?.checkoutReference || null }
      } catch (error) {
        await payload.db.rollbackTransaction(transactionID)
        if (error instanceof APIError && error.status < 500) throw error
        if (attempt === 2) throw error
        await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)))
      }
    }
    throw new APIError('Unable to save your selection. Please retry.', 503)
  })
  if (result.notification) {
    // The request transaction is already committed; mail failure cannot lose it.
    try { await deliverCourseNotification(result.notification) } catch { payload.logger.warn({ msg: 'Notification remains queued for administrator retry', notification: result.notification }) }
  }
  return result
}
