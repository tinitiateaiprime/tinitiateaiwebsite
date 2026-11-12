import { APIError } from 'payload'
import { getPayload } from '@/lib/getPayload'
import { adminMail, MailConfigurationError, escapeHtml } from '@/lib/mail'

export async function deliverCourseNotification(id: number, acknowledgePossibleDuplicate = false) {
  const payload = await getPayload()
  const current = await payload.findByID({ collection: 'course-request-notifications', id, depth: 0 })
  if (current.deliveryStatus === 'sent') return current
  const expired = current.deliveryStatus === 'sending' && current.leaseExpiresAt && Date.parse(current.leaseExpiresAt) <= Date.now()
  if ((current.deliveryStatus === 'unknown' || expired) && !acknowledgePossibleDuplicate) throw new APIError('SMTP acceptance is uncertain. Check the mail server before acknowledging a possible duplicate email and retrying. The course request will not be duplicated.', 409)
  if (current.deliveryStatus === 'sending' && !expired) return current
  const claimed = await payload.db.updateOne({ collection: 'course-request-notifications', where: { and: [
    { id: { equals: id } }, { deliveryStatus: { equals: current.deliveryStatus } }, ...(current.deliveryStatus === 'sending' ? [{ leaseExpiresAt: { less_than_equal: new Date().toISOString() } }] : []),
  ] }, data: { deliveryStatus: 'sending', attempts: (current.attempts || 0) + 1, leaseExpiresAt: new Date(Date.now() + 120000).toISOString(), lastError: null }, options: { atomic: true } })
  if (!claimed) return payload.findByID({ collection: 'course-request-notifications', id, depth: 0 })
  try {
    const { transport, from, to } = adminMail('course-request')
    const courses = current.courses as { id: number; title: string; reference: string }[]
    const text = [ 'New Course Subscription Request', `Checkout reference: ${current.reference}`, `Student name: ${current.studentName}`, `Student email: ${current.studentEmail}`, `Contact: ${current.studentPhone || 'Not provided'}`, `Submitted: ${current.submittedAt}`, '', 'Requested courses:', ...courses.map(course => `- ${course.title} (course ID ${course.id}; request ${course.reference})`), '', 'Payment status: Not Collected', 'Approval status at submission: Pending' ].join('\n')
    const result = await transport.sendMail({ from, to, replyTo: current.studentEmail, subject: `Course Subscription Request — ${current.reference}`, text,
      html: `<div style="font-family:Arial,sans-serif;max-width:700px;color:#172033"><h2>Course Subscription Request</h2><pre style="white-space:pre-wrap;font-family:Arial,sans-serif;line-height:1.7">${escapeHtml(text)}</pre></div>`,
      messageId: `<${current.key}@${from.split('@').at(-1)?.replace(/[<>\s]/g, '') || 'localhost'}>` })
    if (!result.accepted?.length || result.rejected?.length) throw Object.assign(new Error('SMTP did not accept every configured recipient.'), { code: 'PARTIAL' })
    return payload.update({ collection: 'course-request-notifications', id, data: { deliveryStatus: 'sent', sentAt: new Date().toISOString(), messageID: result.messageId, leaseExpiresAt: null, lastError: null } })
  } catch (error) {
    const failure = error as { code?: string; command?: string }
    const configured = !(error instanceof MailConfigurationError)
    const knownFailure = ['EAUTH', 'ECONNECTION', 'ECONNREFUSED', 'ENOTFOUND', 'ESOCKET'].includes(failure.code || '') && !['DATA', '.'].includes(failure.command || '')
    const deliveryStatus = !configured ? 'not-configured' : knownFailure ? 'failed' : 'unknown'
    const lastError = !configured ? (error as Error).message : knownFailure ? `SMTP ${failure.code || 'connection'} failure. Check administrator mail configuration and retry.` : 'SMTP acceptance is uncertain. Check server logs before retrying; a message might already have been accepted.'
    payload.logger.warn({ msg: 'Course request notification was not confirmed by SMTP', notification: id, code: failure.code || deliveryStatus })
    return payload.update({ collection: 'course-request-notifications', id, data: { deliveryStatus, lastError, leaseExpiresAt: null } })
  }
}
