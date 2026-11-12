import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests/e2e', workers: 1, timeout: 90_000,
  expect: { timeout: 15_000 },
  use: { baseURL: process.env.E2E_BASE_URL || 'http://localhost:3100', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  reporter: [['list'], ['html', { open: 'never' }]],
})
