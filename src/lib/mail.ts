import nodemailer from 'nodemailer'
import addressparser from 'nodemailer/lib/addressparser'

export class MailConfigurationError extends Error {}
export function adminMail(kind: 'course-request' | 'demo') {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || user
  const to = (kind === 'course-request' ? process.env.COURSE_REQUEST_NOTIFICATION_EMAIL : process.env.DEMO_NOTIFICATION_EMAIL) || process.env.ADMIN_NOTIFICATION_EMAIL || process.env.DEMO_NOTIFICATION_EMAIL
  if (!host || !user || !pass || !from || !to) throw new MailConfigurationError('SMTP or the administrator recipient is not configured. Configure SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM and an administrator notification address, then retry.')
  const port = Number(process.env.SMTP_PORT || 587)
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new MailConfigurationError('SMTP_PORT is invalid.')
  const secure = process.env.SMTP_SECURE === 'true'
  const transport = nodemailer.createTransport({ host, port, secure, auth: { user, pass },
    requireTLS: !secure && !['localhost', '127.0.0.1', '::1'].includes(host), connectionTimeout: 6000, greetingTimeout: 6000, socketTimeout: 12000 })
  const sender = addressparser(from).find(entry => 'address' in entry)
  if (!sender || !('address' in sender) || !sender.address) throw new MailConfigurationError('SMTP_FROM must contain a valid sender address.')
  return { transport, from, to, fromAddress: sender.address }
}

export function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;')
}
