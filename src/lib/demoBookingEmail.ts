import { adminMail, escapeHtml } from './mail'

type DemoBookingEmailInput = {
  name: string
  email: string
  phone: string
  message?: string | null
  courseTitle?: string | null
  slotStartsAt: string
}

function formatDemoDate(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(iso))
}


export async function sendDemoBookingEmail({
  name,
  email,
  phone,
  message,
  courseTitle,
  slotStartsAt,
}: DemoBookingEmailInput) {
  const { transport: transporter, from, to } = adminMail('demo')

  const demoDate = formatDemoDate(slotStartsAt)
  const selectedCourse = courseTitle || 'Not specified'
  const bookingMessage = message?.trim() || 'No additional message'

  await transporter.sendMail({
    from: `"TinitiateAI Demo Bookings" <${from}>`,
    to,
    replyTo: email,

    subject: `New Demo Booking — ${selectedCourse}`,

    text: [
      'New TinitiateAI Demo Booking',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Course: ${selectedCourse}`,
      `Demo Date & Time: ${demoDate}`,
      `Message: ${bookingMessage}`,
      '',
      'Status: Pending',
    ].join('\n'),

    html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#172033">
        <h2 style="margin-bottom:4px;">New Demo Booking</h2>
        <p style="color:#667085;margin-top:0;">
          A new demo request was submitted on TinitiateAI.
        </p>

        <table
          cellpadding="10"
          cellspacing="0"
          style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;"
        >
          <tr>
            <td style="font-weight:bold;border-bottom:1px solid #e5e7eb;">Name</td>
            <td style="border-bottom:1px solid #e5e7eb;">${escapeHtml(name)}</td>
          </tr>

          <tr>
            <td style="font-weight:bold;border-bottom:1px solid #e5e7eb;">Email</td>
            <td style="border-bottom:1px solid #e5e7eb;">
              <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
            </td>
          </tr>

          <tr>
            <td style="font-weight:bold;border-bottom:1px solid #e5e7eb;">Phone</td>
            <td style="border-bottom:1px solid #e5e7eb;">${escapeHtml(phone)}</td>
          </tr>

          <tr>
            <td style="font-weight:bold;border-bottom:1px solid #e5e7eb;">Course</td>
            <td style="border-bottom:1px solid #e5e7eb;">${escapeHtml(selectedCourse)}</td>
          </tr>

          <tr>
            <td style="font-weight:bold;border-bottom:1px solid #e5e7eb;">
              Demo Date & Time
            </td>
            <td style="border-bottom:1px solid #e5e7eb;">${escapeHtml(demoDate)} IST</td>
          </tr>

          <tr>
            <td style="font-weight:bold;">Message</td>
            <td>${escapeHtml(bookingMessage)}</td>
          </tr>
        </table>

        <p style="margin-top:20px;">
          <strong>Status:</strong> Pending
        </p>
      </div>
    `,
  })
}