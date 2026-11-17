import nodemailer from 'nodemailer';

/** Default inbox for every website enquiry (Request Callback + Contact). */
export const ENQUIRY_INBOX = 'contact@tinitiateai.com';

export type Enquiry = { id: string; name: string; email: string; phone: string; preferredTime: string; course: string; message: string; createdAt: string };

/**
 * SMTP settings, read from the server environment (Azure App Service →
 * Configuration → Application settings, or .env.local for local testing).
 * Works with any SMTP provider: Microsoft 365, Google Workspace, Zoho, Amazon SES SMTP…
 */
export function mailConfig() {
  const host = process.env.SMTP_HOST, user = process.env.SMTP_USER, pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  const port = Number(process.env.SMTP_PORT || 587);
  return {
    host, port, user, pass,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
    from: process.env.CONTACT_FORM_FROM || user,
    to: process.env.CONTACT_FORM_TO || ENQUIRY_INBOX,
  };
}

const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Builds the email the team receives for one enquiry. */
export function enquiryMessage(e: Enquiry, from: string, to: string) {
  const rows: [string, string][] = [
    ['Name', e.name], ['Email', e.email], ['Phone', e.phone], ['Preferred time', e.preferredTime],
    ['Course / topic', e.course || '—'], ['Message', e.message || '—'], ['Received', new Date(e.createdAt).toUTCString()], ['Reference', e.id],
  ];
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#0a0a0b;max-width:620px">
<h2 style="margin:0 0 4px;font-size:20px">New website enquiry</h2>
<p style="margin:0 0 18px;color:#52525b">Submitted on tinitiateai.com. Reply to this email to answer ${escape(e.name)} directly.</p>
<table cellpadding="10" style="border-collapse:collapse;width:100%;font-size:14px">${rows.map(([k, v]) => `<tr><td style="border-bottom:1px solid #e4e4e7;color:#71717a;width:150px;vertical-align:top">${k}</td><td style="border-bottom:1px solid #e4e4e7;white-space:pre-wrap">${escape(v)}</td></tr>`).join('')}</table></div>`;
  return {
    from: `"Tinitiate AI Website" <${from}>`,
    to,
    replyTo: `"${e.name.replace(/"/g, '')}" <${e.email}>`,
    subject: `New enquiry${e.course ? `: ${e.course}` : ''} — ${e.name}`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
    html,
  };
}

export async function sendEnquiryEmail(e: Enquiry) {
  const config = mailConfig();
  if (!config) throw new Error('Email is not configured');
  const transport = nodemailer.createTransport({ host: config.host, port: config.port, secure: config.secure, auth: { user: config.user, pass: config.pass } });
  await transport.sendMail(enquiryMessage(e, config.from, config.to));
}
