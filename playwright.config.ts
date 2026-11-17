import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', fullyParallel: false, workers: 1, timeout: 90_000,
  use: { baseURL: process.env.UI_PREVIEW_URL || 'http://localhost:3001', viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', trace: 'retain-on-failure' },
  reporter: [['list'], ['html', { open: 'never' }]],
});
