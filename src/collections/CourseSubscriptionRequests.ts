import { APIError, type CollectionConfig, type Field } from 'payload'
import { isAdmin, adminOnly } from '../lib/academy/access'

const immutable = { create: () => false, update: () => false }
const snapshot = (name: string, type: 'text' | 'email' | 'date' = 'text'): Field => ({ name, type, required: name !== 'studentPhone', access: immutable, admin: { readOnly: true } } as Field)

export const CourseSubscriptionRequests: CollectionConfig = {
  slug: 'course-subscription-requests',
  labels: { singular: 'Course Subscription Request', plural: 'Course Subscription Requests' },
  admin: { useAsTitle: 'reference', group: 'Course Requests', defaultColumns: ['reference', 'studentName', 'course', 'status', 'requestedAt'] },
  access: { create: () => false, delete: () => false, update: adminOnly, read: ({ req }) => isAdmin(req.user) ? true : req.user?.collection === 'students' ? { student: { equals: req.user.id } } : false },
  fields: [
    { name: 'key', type: 'text', required: true, unique: true, access: immutable, admin: { hidden: true } },
    { name: 'reference', type: 'text', required: true, unique: true, access: immutable, admin: { readOnly: true } },
    { name: 'checkoutReference', type: 'text', required: true, access: immutable, admin: { readOnly: true } },
    { name: 'student', type: 'relationship', relationTo: 'students', required: true, access: immutable, admin: { readOnly: true } },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true, access: immutable, admin: { readOnly: true } },
    snapshot('studentName'), snapshot('studentEmail', 'email'), snapshot('studentPhone'), snapshot('requestedAt', 'date'),
    { name: 'paymentStatus', type: 'select', options: [{ label: 'Not Collected', value: 'not-collected' }], required: true, defaultValue: 'not-collected', access: immutable, admin: { readOnly: true } },
    { name: 'status', type: 'select', required: true, defaultValue: 'pending', options: ['pending', 'approved', 'rejected'], admin: { description: 'Approve/reject each course independently. Approval creates an administrator grant through Course Licenses; it does not record payment.' } },
    { name: 'reviewNote', label: 'Message to student', type: 'textarea', maxLength: 2000 },
    { name: 'license', type: 'relationship', relationTo: 'course-licenses', access: immutable, admin: { readOnly: true, description: 'Use Course Licenses to revoke or expire access after approval.' } },
    { name: 'reviewedBy', type: 'relationship', relationTo: 'users', access: immutable, admin: { readOnly: true } },
    { name: 'reviewedAt', type: 'date', access: immutable, admin: { readOnly: true } },
    { name: 'notification', type: 'relationship', relationTo: 'course-request-notifications', access: immutable, admin: { readOnly: true } },
    { name: 'history', type: 'json', access: immutable, admin: { readOnly: true } },
    { name: 'actions', type: 'ui', admin: { components: { Field: '/components/commerce/AdminRequestActions#AdminRequestActions' } } },
  ],
  hooks: { beforeChange: [async ({ data, originalDoc, req, operation }) => {
    if (req.context.courseCheckout === true) return data
    if (operation === 'create') throw new APIError('Use the authenticated course checkout.', 403)
    if (!isAdmin(req.user)) throw new APIError('Administrator review is required.', 403)
    if (!data.status || data.status === originalDoc.status) return data
    if (originalDoc.status !== 'pending' || !['approved', 'rejected'].includes(data.status)) throw new APIError('This request has already been reviewed. Manage its license, or submit a new request after access ends.', 409)
    const now = new Date().toISOString()
    if (data.status === 'approved') {
      const key = `subscription:${originalDoc.id}:${originalDoc.requestedAt}`
      let grant = (await req.payload.find({ collection: 'course-licenses', where: { key: { equals: key } }, limit: 1, depth: 0, req })).docs[0]
      if (!grant) grant = await req.payload.create({ collection: 'course-licenses', req, data: {
        key, student: typeof originalDoc.student === 'object' ? originalDoc.student.id : originalDoc.student,
        courses: [typeof originalDoc.course === 'object' ? originalDoc.course.id : originalDoc.course], status: 'active',
        grantReason: `Administrator approved ${originalDoc.reference}. Payment was not collected.`,
      } })
      data.license = grant.id
    }
    data.reviewedAt = now; data.reviewedBy = req.user!.id
    data.history = [...(Array.isArray(originalDoc.history) ? originalDoc.history : []), { status: data.status, at: now, reviewer: req.user!.id }]
    return data
  }] },
}

export const CourseRequestNotifications: CollectionConfig = {
  slug: 'course-request-notifications',
  admin: { useAsTitle: 'reference', group: 'Course Requests', defaultColumns: ['reference', 'studentEmail', 'deliveryStatus', 'attempts', 'lastError'] },
  access: { create: () => false, read: adminOnly, update: () => false, delete: () => false },
  fields: [
    { name: 'key', type: 'text', required: true, unique: true }, snapshot('reference'),
    { name: 'student', type: 'relationship', relationTo: 'students', required: true },
    { name: 'requests', type: 'relationship', relationTo: 'course-subscription-requests', hasMany: true, required: true },
    snapshot('studentName'), snapshot('studentEmail', 'email'), snapshot('studentPhone'), snapshot('submittedAt', 'date'),
    { name: 'courses', type: 'json', required: true },
    { name: 'deliveryStatus', type: 'select', required: true, defaultValue: 'queued', options: [
      { label: 'Queued', value: 'queued' }, { label: 'Sending', value: 'sending' }, { label: 'Accepted by SMTP', value: 'sent' },
      { label: 'Failed — retry available', value: 'failed' }, { label: 'SMTP not configured', value: 'not-configured' }, { label: 'Delivery uncertain — review before retry', value: 'unknown' },
    ] },
    { name: 'attempts', type: 'number', defaultValue: 0 }, { name: 'leaseExpiresAt', type: 'date' },
    { name: 'lastError', type: 'textarea' }, { name: 'sentAt', type: 'date' }, { name: 'messageID', type: 'text' },
    { name: 'actions', type: 'ui', admin: { components: { Field: '/components/commerce/AdminRequestActions#NotificationActions' } } },
  ],
}
