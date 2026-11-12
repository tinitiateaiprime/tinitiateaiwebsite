import { test, expect, type Page } from '@playwright/test'
import { createServer, type AddressInfo } from 'node:net'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { writeFile } from 'node:fs/promises'

const password = 'Phase1-Local-Verification-Only!'
const print = 'foundational-python-print'
const variables = 'foundational-python-variables'
const run = promisify(execFile)
async function dismiss(page: Page) { await page.getByRole('button', { name: 'Close promotion' }).click({ timeout: 1000 }).catch(() => {}) }
async function signup(page: Page, email: string) {
  await page.locator('input[name=name]').fill('Phase 2C Verification Student')
  await page.locator('input[name=email]').fill(email)
  await page.locator('input[name=phone]').fill('9000000022')
  await page.locator('input[name=password]').fill(password)
  await page.getByRole('button', { name: 'Sign up', exact: true }).click()
}
async function adminLogin(page: Page) {
  await page.goto('/admin/login'); await page.locator('input[name=email]').fill('phase1-admin@example.test'); await page.locator('input[name=password]').fill(password)
  await page.getByRole('button', { name: 'Login', exact: true }).click(); await expect(page).toHaveURL(/\/admin$/)
}

test('real signup, multi-course checkout, deduplication, individual CMS approval and durable notification retries', async ({ page, browser }) => {
  test.setTimeout(360000)
  await page.setViewportSize({ width: 1440, height: 1000 })
  const email = `phase2c-checkout-${Date.now()}@example.test`
  await page.goto('/signup'); await dismiss(page); await signup(page, email)
  await expect(page).toHaveURL(/\/courses\?welcome=1/)
  await expect(page.getByRole('status')).toContainText('Your student account is ready')
  const all = (await (await page.request.get('/api/courses?limit=200&depth=0')).json()).docs
  const python = all.find((row: { slug: string }) => ['Python', 'python-language-course'].includes(row.slug))
  const java = all.find((row: { slug: string }) => ['full-stack-java', 'java-full-stack-development'].includes(row.slug))
  expect(python).toBeTruthy(); expect(java).toBeTruthy()
  for (const course of [python, java]) {
    await page.goto(`/courses?q=${encodeURIComponent(course.title)}`); await dismiss(page)
    await page.getByRole('button', { name: `Select ${course.title}`, exact: true }).click()
  }
  await page.getByRole('banner').getByRole('link', { name: 'Review Selection (2)', exact: true }).click()
  await expect(page.locator('[data-selected-course]')).toHaveCount(2)
  await expect(page.getByText('No payment will be collected', { exact: true })).toBeVisible()
  await page.screenshot({ path: 'test-results/phase2c-checkout-desktop.png', fullPage: true })
  await page.getByRole('button', { name: 'Submit Course Request', exact: true }).click()
  await expect(page).toHaveURL(/\/dashboard\?courseRequestSubmitted=1/)
  await dismiss(page)
  await expect(page.locator('[data-subscription-request]')).toHaveCount(2)
  await expect(page.getByText('Subscription Requested — Pending Approval', { exact: true })).toHaveCount(2)
  const me = (await (await page.request.get('/api/students/me')).json()).user
  const owned = (await (await page.request.get('/api/course-subscription-requests?limit=100&depth=0')).json()).docs
  expect(owned).toHaveLength(2)
  expect(owned.every((row: { student: number; studentEmail: string; paymentStatus: string; status: string }) => row.student === me.id && row.studentEmail === email && row.paymentStatus === 'not-collected' && row.status === 'pending')).toBe(true)
  expect((await (await page.request.get('/api/course-licenses?depth=0')).json()).docs).toHaveLength(0)
  const duplicate = await Promise.all(Array.from({ length: 3 }, () => page.request.post('/api/subscriptions', { data: { courses: [java.id, python.id, python.id], student: 9999, status: 'approved' } })))
  for (const response of duplicate) { expect(response.status()).toBe(200); expect((await response.json()).requests.map((row: { id: number }) => row.id).sort()).toEqual(owned.map((row: { id: number }) => row.id).sort()) }
  expect((await page.request.post('/api/course-subscription-requests', { data: { student: 9999, course: python.id, status: 'approved' } })).status()).toBe(403)
  expect((await page.request.post(`/api/subscriptions/${owned[0].id}/review`, { data: { action: 'approve' } })).status()).toBe(403)
  expect((await page.request.get('/api/course-request-notifications')).status()).toBe(403)
  await page.screenshot({ path: 'test-results/phase2c-pending-dashboard.png', fullPage: true })
  await page.goto(`/academy/lessons/${print}`); await dismiss(page)
  await expect(page.getByText('Your Free MasterClass Preview', { exact: true })).toBeVisible()
  const frame = page.frameLocator('iframe')
  await expect(frame.locator('#py-stage')).toBeVisible()
  await frame.locator('#py-continue').click(); await frame.locator('#py-first').click(); await frame.locator('#py-run').click()
  await expect(frame.locator('#py-term')).toContainText('Hello, World!', { timeout: 45000 })
  expect(await frame.locator('body').evaluate('Object.keys(PyCourse.DECKS)')).toEqual(['print'])
  await expect(frame.locator('#lesson-video video')).toHaveCount(0)
  expect((await page.request.get(`/api/academy/video/${print}`)).status()).toBe(403)
  const ticket = new URL((await page.locator('iframe').getAttribute('src'))!, 'http://localhost:3100').searchParams.get('t')
  const projection = await page.request.get(`/api/academy/content/${print}/foundational/python/python-course.js?t=${ticket}`)
  expect(projection.status()).toBe(200); expect(await projection.text()).not.toMatch(/\bvariables\s*:\s*\{/)
  expect((await page.request.get(`/api/academy/content/${print}/foundational/python/variables.html?t=${ticket}`)).status()).toBe(404)
  expect((await page.request.get(`/api/academy/content/${variables}/foundational/python/python-course.js?t=${ticket}`)).status()).toBe(403)
  await page.getByRole('link', { name: 'Continue to Next Module' }).click()
  await expect(page.getByRole('heading', { name: 'Continue Your Learning' })).toBeVisible()
  await expect(page.getByText('Subscription Requested — Awaiting Approval', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Request Subscription', exact: true })).toHaveCount(0)
  await page.screenshot({ path: 'test-results/phase2c-pending-paywall.png', fullPage: true })
  const admin = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  try {
    await adminLogin(admin)
    const previewLesson = (await (await admin.request.get(`/api/academy-lessons?where[key][equals]=${print}&depth=0`)).json()).docs[0]
    expect((await admin.request.patch(`/api/courses/${java.id}`, { data: { previewLesson: previewLesson.id } })).status()).toBe(400)
    const previewApproval = await admin.request.patch(`/api/courses/${python.id}`, { data: { previewLesson: previewLesson.id, approvePreviewVersion: true } })
    expect(previewApproval.status()).toBe(200)
    expect((await previewApproval.json()).doc.previewFingerprint).toBe(previewLesson.fingerprint)
    const pythonRequest = owned.find((row: { course: number }) => row.course === python.id)
    const javaRequest = owned.find((row: { course: number }) => row.course === java.id)
    const outbox = (await (await admin.request.get('/api/course-request-notifications?limit=100&depth=0')).json()).docs.filter((row: { student: number }) => row.student === me.id)
    expect(outbox).toHaveLength(1); expect(outbox[0].deliveryStatus).toBe('not-configured')
    await admin.goto(`/admin/collections/course-subscription-requests/${pythonRequest.id}`)
    await expect(admin.getByText('Administrator email: not-configured', { exact: true })).toBeVisible()
    await admin.screenshot({ path: 'test-results/phase2c-admin-request.png', fullPage: true })
    await Promise.all([admin.waitForEvent('load'), admin.getByRole('button', { name: 'Approve Course Request', exact: true }).click()])
    await expect.poll(async () => (await (await admin.request.get(`/api/course-subscription-requests/${pythonRequest.id}?depth=0`)).json()).status).toBe('approved')
    const approved = (await (await admin.request.get(`/api/course-subscription-requests/${pythonRequest.id}?depth=0`)).json())
    expect(approved.license).toBeTruthy()
    await admin.goto(`/admin/collections/course-subscription-requests/${javaRequest.id}`)
    await Promise.all([admin.waitForEvent('load'), admin.getByRole('button', { name: 'Reject Course Request', exact: true }).click()])
    await expect.poll(async () => (await (await admin.request.get(`/api/course-subscription-requests/${javaRequest.id}?depth=0`)).json()).status).toBe('rejected')
    await page.goto(`/academy/lessons/${variables}`); await dismiss(page)
    await expect(page.frameLocator('iframe').locator('#py-stage')).toBeVisible()
    await expect(page.frameLocator('iframe').locator('#lesson-video video')).toHaveCount(1)
    expect((await page.request.get(`/api/academy/video/${variables}`, { headers: { Range: 'bytes=0-31' } })).status()).toBe(206)
    const licenses = (await (await page.request.get('/api/course-licenses?depth=0')).json()).docs
    expect(licenses).toHaveLength(1); expect(licenses[0].courses).toEqual([python.id])
    try {
      for (const data of [{ status: 'revoked' }, { status: 'active', expiresAt: '2020-01-01T00:00:00.000Z' }]) {
        expect((await admin.request.patch(`/api/course-licenses/${approved.license}`, { data })).status()).toBe(200)
        await page.goto(`/academy/lessons/${variables}`); await expect(page.getByRole('heading', { name: 'Continue Your Learning' })).toBeVisible()
        expect((await page.request.get(`/api/academy/video/${variables}`)).status()).toBe(403)
      }
    } finally { await admin.request.patch(`/api/course-licenses/${approved.license}`, { data: { status: 'active', expiresAt: null } }) }
    const javaLesson = (await (await admin.request.get(`/api/academy-lessons?where[course][equals]=${java.id}&where[kind][equals]=lesson&limit=1&depth=0`)).json()).docs[0]
    await page.goto(`/academy/lessons/${javaLesson.key}`); await expect(page.getByRole('heading', { name: 'Continue Your Learning' })).toBeVisible()
    const initialCount = (await (await admin.request.get(`/api/course-subscription-requests?where[student][equals]=${me.id}&limit=100`)).json()).docs.length
    const retry = await admin.request.post(`/api/subscriptions/notifications/${outbox[0].id}/retry`, { data: {} })
    expect(retry.status()).toBe(200); expect((await retry.json()).status).toBe('not-configured')
    const mailEnv = { PHASE2_ENABLE_EMAIL: 'true', COURSE_NOTIFICATION_ID: String(outbox[0].id), SMTP_HOST: '127.0.0.1', SMTP_PORT: '1', SMTP_SECURE: 'false', SMTP_USER: 'smtp-test', SMTP_PASS: 'smtp-test', SMTP_FROM: 'checkout@example.test', COURSE_REQUEST_NOTIFICATION_EMAIL: 'admin@example.test' }
    await run(process.execPath, ['scripts/academy/local.mjs', 'notifications'], { env: { ...process.env, ...mailEnv }, timeout: 60000 })
    expect((await (await admin.request.get(`/api/course-request-notifications/${outbox[0].id}`)).json()).deliveryStatus).toBe('failed')
    const messages: string[] = []
    const smtp = createServer(socket => {
      socket.on('error', () => {}) // SMTP clients may reset their socket after accepting DATA.
      socket.setEncoding('utf8'); socket.write('220 localhost SMTP verification\r\n')
      let buffer = '', data = false, message = ''
      socket.on('data', chunk => {
        buffer += chunk
        let newline: number
        while ((newline = buffer.indexOf('\n')) >= 0) {
          const line = buffer.slice(0, newline).replace(/\r$/, ''); buffer = buffer.slice(newline + 1)
          if (data) { if (line === '.') { messages.push(message); message = ''; data = false; socket.write('250 accepted for local verification\r\n') } else message += line + '\n'; continue }
          if (/^EHLO|^HELO/.test(line)) socket.write('250-localhost\r\n250 AUTH PLAIN\r\n')
          else if (/^AUTH/.test(line)) socket.write('235 Authentication successful\r\n')
          else if (line === 'DATA') { data = true; socket.write('354 End with dot\r\n') }
          else if (line === 'QUIT') { socket.end('221 Bye\r\n') }
          else socket.write('250 OK\r\n')
        }
      })
    })
    await new Promise<void>(resolve => smtp.listen(0, '127.0.0.1', resolve))
    try {
      await run(process.execPath, ['scripts/academy/local.mjs', 'notifications'], { env: { ...process.env, ...mailEnv, SMTP_PORT: String((smtp.address() as AddressInfo).port) }, timeout: 60000 })
      expect(messages).toHaveLength(1)
      for (const value of [email, python.title, java.title, me.name, '9000000022', outbox[0].reference, 'Not Collected', 'Pending']) expect(messages[0]).toContain(value)
      expect((await (await admin.request.get(`/api/course-request-notifications/${outbox[0].id}`)).json()).deliveryStatus).toBe('sent')
      await run(process.execPath, ['scripts/academy/local.mjs', 'notifications'], { env: { ...process.env, ...mailEnv, SMTP_PORT: String((smtp.address() as AddressInfo).port) }, timeout: 60000 })
      expect(messages).toHaveLength(1)
    } finally { await new Promise<void>(resolve => smtp.close(() => resolve())) }
    expect((await (await admin.request.get(`/api/course-subscription-requests?where[student][equals]=${me.id}&limit=100`)).json()).docs).toHaveLength(initialCount)
    await writeFile('.phase2-local/phase2c-verification.json', JSON.stringify({ email, student: me.id, notification: outbox[0].id, python: python.id, java: java.id, requests: owned.map((row: { id: number }) => row.id) }, null, 2))
  } finally { await admin.close() }
})

test('public preview card retains the signup destination; preview works on mobile and the next module is paywalled', async ({ page }) => {
  test.setTimeout(180000)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/demos'); await dismiss(page)
  await expect(page.locator('[data-preview-course-id]')).toHaveCount(1)
  await page.locator('[data-preview-course-id]').getByRole('link', { name: 'Try Free MasterClass' }).click()
  await expect(page).toHaveURL(/\/login\?redirect=/)
  await page.getByRole('link', { name: 'Sign up', exact: true }).click()
  await expect(page).toHaveURL(/\/signup\?redirect=/)
  await signup(page, `phase2c-preview-${Date.now()}@example.test`)
  await expect(page).toHaveURL(new RegExp(`/academy/lessons/${print}$`)); await dismiss(page)
  await expect(page.getByText('Your Free MasterClass Preview', { exact: true })).toBeVisible()
  const frame = page.frameLocator('iframe')
  await expect(frame.locator('#py-stage')).toBeVisible()
  await frame.locator('#py-continue').click(); await frame.locator('#py-first').click(); await frame.locator('#py-run').click()
  await expect(frame.locator('#py-term')).toContainText('Hello, World!', { timeout: 45000 })
  expect(await frame.locator('html').evaluate(node => node.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/phase2c-preview-mobile.png', fullPage: true })
  await page.getByRole('link', { name: 'Continue to Next Module' }).click()
  await expect(page.getByRole('heading', { name: 'Continue Your Learning' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Request Subscription', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View Course Details', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Back to My Dashboard', exact: true })).toBeVisible()
  await page.screenshot({ path: 'test-results/phase2c-paywall-mobile.png', fullPage: true })
  await page.getByRole('link', { name: 'Request Subscription', exact: true }).click()
  await expect(page.locator('[data-selected-course]')).toHaveCount(1)
  await expect(page.getByRole('button', { name: 'Submit Course Request' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/phase2c-checkout-mobile.png', fullPage: true })
})
