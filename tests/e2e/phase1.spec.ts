import { test, expect, type Page } from '@playwright/test'

async function dismissPromotion(page: Page) {
  await page.getByRole('button', { name: 'Close promotion' }).click({ timeout: 1200 }).catch(() => {})
}

const password = 'Phase1-Local-Verification-Only!'
const routes = ['/', '/courses', '/training', '/training/beginner-training', '/training/professional-training', '/training/corporate-training', '/training/personalized-training', '/training/campus-training', '/training/opt-training', '/work-experience-program', '/company', '/services', '/contact', '/request-callback', '/book-a-demo', '/login', '/signup', '/admin/login', '/online-training', '/classroom-training', '/weekend-training', '/internships', '/new-batches', '/workshops', '/real-time-projects', '/job-assistance', '/placements', '/placement-registration', '/testimonials', '/trainers', '/blog', '/interview-questions', '/privacy-policy', '/terms', '/refund-policy', '/pricing-policy', '/cookie-policy', '/pricing', '/faq/why-tinitiate', '/faq/students-stem', '/faq/students-nonstem', '/faq/parents-stem', '/faq/parents-nonstem', '/courses/coming-soon']

test('public routes and retained URLs return actual pages', async ({ request }) => {
  test.setTimeout(300_000)
  for (const route of routes) {
    const response = await request.get(route)
    expect(response.status(), route).toBe(200)
    expect(await response.text(), route).not.toContain('NEXT_HTTP_ERROR_FALLBACK;500')
  }
  for (const [source, destination] of [['/it-training', '/training'], ['/training/it-training', '/training'], ['/training/online-training', '/online-training'], ['/training/new-batches', '/new-batches'], ['/about', '/company'], ['/resume-building', '/job-assistance']]) {
    const response = await request.get(source, { maxRedirects: 0 })
    expect(response.status()).toBe(308)
    expect(response.headers().location).toContain(destination)
  }
})

test('desktop homepage, canonical catalog, images, and detail links', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await dismissPromotion(page)
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Our AI & IT Solutions' })).toBeVisible()
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true })
  await page.goto('/courses?q=Python')
  await dismissPromotion(page)
  await expect(page.getByRole('heading', { name: 'Python', exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Python', exact: true }).click()
  await expect(page.locator('h1')).toContainText('Python')
  await expect(page.getByRole('heading', { name: 'About this course' })).toBeVisible()
  await page.goto('/courses?q=no-such-course-phase1')
  await dismissPromotion(page)
  await expect(page.getByText('No courses found')).toBeVisible()
  await page.goto('/courses/does-not-exist-phase1')
  await dismissPromotion(page)
  await expect(page.getByText('404', { exact: true })).toBeVisible()
  expect(errors).toEqual([])
})

test('category filtering and legacy course identifiers use Payload records', async ({ request }) => {
  const categories = (await (await request.get('/api/categories?limit=100')).json()).docs
  const category = categories.find((item: { slug: string }) => item.slug === 'it-training') || categories[0]
  const response = await request.get(`/courses?category=${category.slug}&q=AWS&view=all`)
  expect(response.status()).toBe(200)
  const courses = (await (await request.get('/api/courses?limit=200&depth=0')).json()).docs
  expect(courses.length).toBeGreaterThan(2)
  const legacy = await request.get('/courses/python-language-course', { maxRedirects: 0 })
  expect(legacy.status()).toBe(308)
  expect(legacy.headers().location).toBe('/courses/Python')
  const professional = await request.get('/training/professional-training/java-full-stack-development', { maxRedirects: 0 })
  expect(professional.status()).toBe(308)
  const nested = await request.get('/courses/professionalCourses/backend/core-java', { maxRedirects: 0 })
  expect(nested.status()).toBe(308)
})

test('all canonical course details and reused asset URLs resolve', async ({ request }) => {
  test.setTimeout(300_000)
  const courses = (await (await request.get('/api/courses?limit=200&depth=0')).json()).docs
  for (const course of courses) expect((await request.get(`/courses/${encodeURIComponent(course.slug)}`)).status(), course.slug).toBe(200)
  const { readFile } = await import('node:fs/promises')
  const inventory = JSON.parse(await readFile('docs/AZURE_SOURCE_INVENTORY.json', 'utf8'))
  for (const asset of inventory.assets) expect((await request.get(`/azure${asset}`)).status(), asset).toBe(200)
})

test('mobile navigation, training, FAQs and callback fit the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const route of ['/', '/training', '/training/professional-training', '/work-experience-program', '/request-callback?course=Python', '/faq/students-stem']) {
    await page.goto(route)
    await dismissPromotion(page)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBe(true)
    await page.screenshot({ path: `test-results/mobile-${route.split('?')[0].replaceAll('/', '-') || 'home'}.png`, fullPage: true })
  }
  await page.getByRole('button', { name: 'Toggle menu' }).click()
  await expect(page.getByRole('button', { name: 'Toggle menu' })).toHaveAttribute('aria-expanded', 'true')
  await page.locator('#mobile-navigation').getByRole('button', { name: 'Training', exact: true }).click()
  await page.locator('#mobile-navigation').getByRole('link', { name: 'Corporate Training', exact: true }).click()
  await expect(page).toHaveURL(/training\/corporate-training/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('contact and callback forms persist to the protected Payload workflow', async ({ page }) => {
  await page.goto('/request-callback?course=Python')
  await dismissPromotion(page)
  await page.locator('input[name=name]').fill('Phase 1 Callback Check')
  await page.locator('input[name=email]').fill('callback@example.test')
  await page.locator('input[name=phone]').fill('9876543210')
  await page.locator('input[name=preferredTime]').fill('Weekdays 2–4 PM IST')
  await page.locator('textarea[name=message]').fill('Callback integration verification')
  await page.getByRole('button', { name: 'Request Callback', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Thank You!' })).toBeVisible()
  await page.goto('/contact')
  await dismissPromotion(page)
  for (const [name, value] of Object.entries({ name: 'Phase 1 Contact Check', email: 'contact@example.test', phone: '9876543210', subject: 'Phase 1 integration verification' })) await page.locator(`input[name=${name}]`).fill(value)
  await page.locator('textarea[name=message]').fill('Contact integration verification')
  await page.getByRole('button', { name: 'Send Message' }).click()
  await expect(page.getByText(/message.*sent|thank you/i).first()).toBeVisible()
  const unauthorized = await page.request.get('/api/contact-messages')
  expect(unauthorized.status()).toBe(403)
  await page.request.post('/api/users/login', { data: { email: 'phase1-admin@example.test', password } })
  const saved = await page.request.get('/api/contact-messages?limit=100')
  expect(saved.status()).toBe(200)
  const docs = (await saved.json()).docs
  expect(docs.some((doc: { name: string; message: string }) => doc.name === 'Phase 1 Callback Check' && doc.message.includes('Weekdays 2–4 PM IST'))).toBe(true)
  expect(docs.some((doc: { name: string }) => doc.name === 'Phase 1 Contact Check')).toBe(true)
})

test('demo booking works and rejects an unavailable slot', async ({ page }) => {
  await page.goto('/book-a-demo?course=Python')
  await dismissPromotion(page)
  await page.locator('form button[type=button]').first().click()
  for (const [name, value] of Object.entries({ name: 'Phase 1 Demo Check', email: 'demo@example.test', phone: '9876543210' })) await page.locator(`input[name=${name}]`).fill(value)
  await page.getByRole('button', { name: 'Confirm Booking' }).click()
  await expect(page.getByText('Demo booked!')).toBeVisible()
  const bad = await page.request.post('/api/demo-bookings', { data: { name: 'Invalid slot', email: 'invalid@example.test', phone: '9876543210', slot: 99999999 } })
  expect(bad.status()).toBeGreaterThanOrEqual(400)
})

test('signup, login failure, student dashboard, and persisted enrollments', async ({ page }) => {
  await page.goto('/dashboard')
  await dismissPromotion(page)
  await expect(page).toHaveURL(/\/login/)
  await page.locator('input[name=email]').fill('absent@example.test')
  await page.locator('input[name=password]').fill('Invalid-password')
  await page.getByRole('button', { name: 'Log in', exact: true }).click()
  await expect(page.locator('form .text-red-600')).toBeVisible()
  await page.goto('/signup')
  await dismissPromotion(page)
  await page.locator('input[name=name]').fill('New Local Learner')
  await page.locator('input[name=email]').fill(`phase1-signup-${Date.now()}@example.test`)
  await page.locator('input[name=password]').fill(password)
  await page.getByRole('button', { name: 'Sign up', exact: true }).click()
  await expect(page).toHaveURL(/\/courses\?welcome=1/)
  await expect(page.getByRole('status')).toContainText('Your student account is ready')
  await page.goto('/dashboard')
  await expect(page.getByText("You haven't enrolled in any courses yet.")).toBeVisible()
  await page.request.post('/api/students/logout')
  await page.goto('/login?redirect=https://example.com')
  await dismissPromotion(page)
  await page.locator('input[name=email]').fill('phase1-student@example.test')
  await page.locator('input[name=password]').fill(password)
  await page.getByRole('button', { name: 'Log in', exact: true }).click()
  await expect(page).toHaveURL(/\/dashboard/)
  await expect(page.getByText('active', { exact: true })).toBeVisible()
})

test('students cannot change CMS content, access other students, or enroll others', async ({ request }) => {
  const loggedIn = await request.post('/api/students/login', { data: { email: 'phase1-student@example.test', password } })
  expect(loggedIn.status()).toBe(200)
  const student = (await loggedIn.json()).user
  const course = (await (await request.get('/api/courses?limit=1')).json()).docs[0]
  expect((await request.patch(`/api/courses/${course.id}`, { data: { title: 'Unauthorized change' } })).status()).toBe(403)
  expect((await request.post('/api/enrollments', { data: { student: 999999, course: course.id, status: 'active' } })).status()).toBe(403)
  const students = await request.get('/api/students')
  expect((await students.json()).docs.every((doc: { id: number }) => doc.id === student.id)).toBe(true)
  expect((await request.get('/api/users')).status()).toBe(403)
  expect((await request.post('/api/globals/site-settings', { data: { siteName: 'Unauthorized' } })).status()).toBe(403)
})

test('CMS admin remains functional and restricted internal APIs are absent', async ({ page }) => {
  await page.goto('/admin/login')
  await dismissPromotion(page)
  await page.locator('input[name=email]').fill('phase1-admin@example.test')
  await page.locator('input[name=password]').fill(password)
  await page.getByRole('button', { name: 'Login', exact: true }).click()
  await expect(page).toHaveURL(/\/admin$/)
  await expect(page.getByRole('link', { name: 'Courses', exact: true }).first()).toBeVisible()
  await page.goto('/admin/collections/courses')
  await dismissPromotion(page)
  await expect(page.getByRole('heading', { name: 'Courses', exact: true })).toBeVisible()
  for (const route of ['/api/rag/reindex', '/api/diag/embed', '/api/dev-seed']) expect((await page.request.get(route)).status(), route).toBeGreaterThanOrEqual(400)
  expect((await page.request.post('/api/dev-seed')).status()).toBe(404)
  const chat = await page.request.post('/api/chat', { data: { message: 'Which courses are available?' } })
  expect(chat.status()).toBe(503)
  const invalid = await page.request.post('/api/request-callback', { data: { name: 'Invalid' } })
  expect(invalid.status()).toBe(400)
  const malformed = await page.request.post('/api/request-callback', { data: '{invalid', headers: { 'Content-Type': 'application/json' } })
  expect(malformed.status()).toBe(400)
  const oversized = await page.request.post('/api/request-callback', { data: { message: 'x'.repeat(9000) } })
  expect(oversized.status()).toBe(413)
  expect((await page.request.post('/api/rag/reindex', { data: { origin: 'https://example.invalid' } })).status()).toBe(404)
})
