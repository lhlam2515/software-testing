import { defineConfig, devices } from '@playwright/test';

const STUDENT_ID = process.env.STUDENT_ID ?? '23127216';
const RUN_AT = new Date().toISOString();
const HTML_OUT = process.env.HTML_OUT ?? 'html-reports/_default';

process.env.PLAYWRIGHT_HTML_TITLE = `EShop HW04 - Run by: ${STUDENT_ID} - ${RUN_AT}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [
    [
      'html',
      {
        open: 'never',
        outputFolder: HTML_OUT,
      },
    ],
    ['list'],
  ],
  metadata: {
    'Run by': STUDENT_ID,
    'Run at': RUN_AT,
  },
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
