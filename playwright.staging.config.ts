import { defineConfig } from '@playwright/test'
export default defineConfig({ testDir: './tests/staging', workers: 1, timeout: 240000, expect: { timeout: 20000 }, outputDir: '.staging-private/test-results',
  webServer: { command: 'node scripts/staging/run.mjs start', url: 'https://localhost:3200/demos', ignoreHTTPSErrors: true, reuseExistingServer: true, timeout: 180000 },
  // This bypass is confined to the generated loopback certificate in browser tests.
  // PostgreSQL, object storage and SMTP retain normal certificate verification.
  use: { baseURL: 'https://localhost:3200', ignoreHTTPSErrors: true, launchOptions: { args: ['--ignore-certificate-errors'] }, actionTimeout: 20000, navigationTimeout: 60000, screenshot: 'only-on-failure', trace: 'retain-on-failure' }, reporter: [['list']] })
