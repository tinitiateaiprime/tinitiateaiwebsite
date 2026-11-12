import { test, expect } from '@playwright/test'
import { readFile, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import sharp from 'sharp'
import type { Page, APIRequestContext } from '@playwright/test'
const print = 'foundational-python-print', variables = 'foundational-python-variables'
function api(page: Page) {
  const headers = { Origin: 'https://localhost:3200' }
  return {
    get: (url: string, options?: Parameters<APIRequestContext['get']>[1]) => page.request.get(url, { ...options, headers: { ...headers, ...options?.headers } }),
    post: (url: string, options?: Parameters<APIRequestContext['post']>[1]) => page.request.post(url, { ...options, headers: { ...headers, ...options?.headers } }),
    patch: (url: string, options?: Parameters<APIRequestContext['patch']>[1]) => page.request.patch(url, { ...options, headers: { ...headers, ...options?.headers } }),
  }
}
async function dismiss(page: Page) { await page.getByRole('button', { name: 'Close promotion' }).click({ timeout: 1500 }).catch(() => {}) }
test('Neon PostgreSQL and private S3: signup, checkout, SMTP, approval, preview, recordings, media and independent logout', async ({ page, browser }) => {
  test.setTimeout(360000)
  const verification = JSON.parse(await readFile('.staging-private/verification-accounts.json', 'utf8'))
  verification.studentEmail = `verify-student-${randomUUID()}@example.invalid`
  await writeFile('.staging-private/verification-accounts.json', JSON.stringify(verification, null, 2))
  await page.goto('/demos')
  await expect(page.locator('[data-preview-course-id]')).toHaveCount(1)
  expect((await api(page).get(`/api/academy/video/${print}`)).status()).toBe(403)
  await page.goto('/signup')
  await dismiss(page)
  await page.locator('input[name=name]').fill('Private Staging Verification')
  await page.locator('input[name=email]').fill(verification.studentEmail)
  await page.locator('input[name=password]').fill(verification.password)
  await page.getByRole('button', { name: 'Sign up', exact: true }).click()
  await expect(page).toHaveURL(/\/courses\?welcome=1/)
  await expect(page.getByRole('banner').getByRole('link', { name: 'My Learning', exact: true })).toBeVisible()
  const student = (await (await api(page).get('/api/students/me')).json()).user
  expect(student.email).toBe(verification.studentEmail)
  console.log('Neon student signup and authenticated navigation verified.')
  await writeFile('.staging-private/verification-accounts.json', JSON.stringify({ ...verification, studentID: student.id }, null, 2))
  await page.goto(`/academy/lessons/${print}`); await dismiss(page)
  await expect(page.getByText('Your Free MasterClass Preview', { exact: true })).toBeVisible()
  const frame = page.frameLocator('iframe')
  await expect(frame.locator('#py-stage')).toBeVisible()
  await frame.locator('#py-continue').click()
  if (await frame.locator('#py-first').isEnabled()) await frame.locator('#py-first').click()
  await frame.locator('#py-run').click()
  await expect(frame.locator('#py-term')).toContainText('Hello, World!', { timeout: 60000 })
  expect(await frame.locator('body').evaluate('Object.keys(PyCourse.DECKS)')).toEqual(['print'])
  console.log('Original interactive preview executed through private S3 storage.')
  await expect(frame.locator('#lesson-video video')).toHaveCount(0)
  await page.getByRole('link', { name: 'Continue to Next Module' }).click()
  await expect(page.getByRole('heading', { name: 'Continue Your Learning' })).toBeVisible()
  expect((await api(page).get(`/api/academy/video/${variables}`)).status()).toBe(403)
  await page.getByRole('link', { name: 'Request Subscription', exact: true }).click()
  await expect(page.locator('[data-selected-course]')).toHaveCount(1)
  await expect(page.getByText('No payment will be collected', { exact: true })).toBeVisible()
  // Add a second existing course through the normal course-selection UI.
  await page.goto('/courses?q=Java%20Full%20Stack')
  await page.getByRole('button', { name: 'Select Java Full Stack Development', exact: true }).click()
  await page.getByRole('banner').getByRole('link', { name: 'Review Selection (2)', exact: true }).click()
  await expect(page.locator('[data-selected-course]')).toHaveCount(2)
  await page.getByRole('button', { name: 'Submit Course Request', exact: true }).click()
  await expect(page).toHaveURL(/\/dashboard\?courseRequestSubmitted=1/)
  await expect(page.locator('[data-subscription-request]')).toHaveCount(2)
  console.log('Two-course checkout persisted against the signed-in Neon student.')
  const requests = (await (await api(page).get('/api/course-subscription-requests?depth=0')).json()).docs
  expect(requests).toHaveLength(2)
  expect((await (await api(page).get('/api/course-licenses?depth=0')).json()).docs).toHaveLength(0)
  const duplicate = await Promise.all(Array.from({ length: 3 }, () => api(page).post('/api/subscriptions', { data: { courses: [1, 2] } })))
  for (const response of duplicate) expect(response.status()).toBe(200)
  expect((await api(page).post(`/api/subscriptions/${requests[0].id}/review`, { data: { action: 'approve' } })).status()).toBe(403)
  await page.screenshot({ path: '.staging-private/neon-dashboard.png', fullPage: true })
  const admin = await browser.newPage()
  try {
    await admin.goto('/admin/login'); await admin.locator('input[name=email]').fill(verification.adminEmail); await admin.locator('input[name=password]').fill(verification.password)
    await admin.getByRole('button', { name: 'Login', exact: true }).click(); await expect(admin).toHaveURL(/\/admin$/)
    const outbox = (await (await api(admin).get('/api/course-request-notifications?depth=0')).json()).docs.filter((row: { student: number }) => row.student === student.id)
    expect(outbox).toHaveLength(1); expect(outbox[0].deliveryStatus).toBe('sent')
    console.log('Configured SMTP accepted the Neon checkout notification; inbox receipt is unverified.')
    const recordings = (await (await api(admin).get('/api/lesson-recordings?limit=100&depth=0')).json()).docs
    expect(recordings).toHaveLength(6)
    for (const recording of recordings) {
      const approval = await api(admin).post('/api/academy/approve', { data: { recording: recording.id } })
      expect(approval.status(), await approval.text()).toBe(200)
    }
    const python = requests.find((row: { course: number }) => row.course === 2)
    const java = requests.find((row: { course: number }) => row.course === 1)
    await admin.goto(`/admin/collections/course-subscription-requests/${python.id}`)
    await Promise.all([admin.waitForEvent('load'), admin.getByRole('button', { name: 'Approve Course Request', exact: true }).click()])
    const grant = (await (await api(admin).get(`/api/course-subscription-requests/${python.id}?depth=0`)).json()).license
    expect(grant).toBeTruthy()
    expect((await api(admin).post(`/api/subscriptions/${java.id}/review`, { data: { action: 'reject' } })).status()).toBe(200)
    await page.goto('/learning'); await expect(page.getByRole('heading', { name: 'My Learning', exact: true })).toBeVisible()
    await page.goto(`/academy/lessons/${variables}`)
    await expect(page.frameLocator('iframe').locator('#lesson-video video')).toHaveCount(1)
    await page.frameLocator('iframe').locator('#lesson-video video').evaluate(async node => { const video = node as HTMLVideoElement; video.muted = true; await video.play() })
    await expect.poll(() => page.frameLocator('iframe').locator('#lesson-video video').evaluate(node => (node as HTMLVideoElement).currentTime)).toBeGreaterThan(0.1)
    for (const key of ['print', 'variables', 'datatypes', 'operators', 'strings', 'lists']) expect((await api(page).get(`/api/academy/video/foundational-python-${key}`, { headers: { Range: 'bytes=0-63' } })).status()).toBe(206)
    for (const data of [{ status: 'revoked' }, { status: 'active', expiresAt: '2020-01-01T00:00:00.000Z' }]) {
      expect((await api(admin).patch(`/api/course-licenses/${grant}`, { data })).status()).toBe(200)
      expect((await api(page).get(`/api/academy/video/${variables}`)).status()).toBe(403)
      await page.goto(`/academy/lessons/${variables}`); await expect(page.getByRole('heading', { name: 'Continue Your Learning' })).toBeVisible()
    }
    await api(admin).patch(`/api/course-licenses/${grant}`, { data: { status: 'active', expiresAt: null } })
    const media = (await (await api(admin).get('/api/media?limit=1')).json()).docs[0]
    expect((await api(page).get(media.url)).status()).toBe(200)
    const upload = await api(admin).post('/api/media', { multipart: { _payload: JSON.stringify({ alt: 'Private staging storage verification' }), file: { name: 'staging-storage-verification.png', mimeType: 'image/png', buffer: await sharp({ create: { width: 16, height: 16, channels: 3, background: '#265ee9' } }).png().toBuffer() } } })
    expect(upload.status(), await upload.text()).toBe(201)
    const uploaded = (await upload.json()).doc
    await writeFile('.staging-private/verification-accounts.json', JSON.stringify({ ...verification, studentID: student.id, mediaID: uploaded.id }, null, 2))
    expect((await api(page).get(uploaded.url)).status()).toBe(200)
    await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/dashboard')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.getByRole('button', { name: 'Toggle menu' }).click(); await expect(page.locator('#mobile-navigation').getByRole('button', { name: 'Logout', exact: true })).toBeVisible()
    await page.locator('#mobile-navigation').getByRole('button', { name: 'Logout', exact: true }).click(); await expect(page).toHaveURL(/\/login\?loggedOut=1/)
    expect((await api(page).get(`/api/academy/video/${variables}`)).status()).toBe(403)
    await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto('/login'); await page.locator('input[name=email]').fill(verification.studentEmail); await page.locator('input[name=password]').fill(verification.password); await page.getByRole('button', { name: 'Log in', exact: true }).click(); await expect(page).toHaveURL(/\/dashboard/)
    await page.getByRole('banner').getByRole('button', { name: 'Logout', exact: true }).click()
    await admin.getByRole('button', { name: 'Logout', exact: true }).click(); await expect(admin).toHaveURL(/\/admin\/login/)
    await writeFile('.staging-private/browser-result.json', JSON.stringify({ passed: true, studentSignupAndLogin: true, checkoutAndApproval: true, smtpStatus: outbox[0].deliveryStatus, inboxReceiptVerified: false, privateS3PreviewExecution: true, originalRecordings: 6, expiryRevocationDenial: true, mediaUploadAndRead: true, studentAndAdminLogout: true }, null, 2))
  } finally { await admin.close() }
})
