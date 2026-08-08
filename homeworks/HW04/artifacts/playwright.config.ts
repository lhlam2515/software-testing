import { defineConfig, devices } from '@playwright/test';

const STUDENT_ID = process.env.STUDENT_ID ?? '23127216';
const RUN_AT = new Date().toISOString();
const HTML_OUT = process.env.HTML_OUT ?? 'html-reports/_default';
const JSON_OUT = process.env.JSON_OUT ?? 'test-results/_default/results.json';
// Playwright rm -rf's the whole `outputDir` at the start of every run (see
// createRemoveOutputDirsTask in the runner). Left at its default ('test-results'),
// that wipes every other feature/browser's JSON_OUT sitting in the same tree —
// each of the 9 P5 runs was silently deleting the previous ones' results.json.
// Scoping outputDir to a per-run `artifacts` subfolder (sibling to, not an
// ancestor of, JSON_OUT) keeps the 9 runs from clobbering each other.
const OUTPUT_DIR = process.env.OUTPUT_DIR ?? 'test-results/_default/artifacts';

process.env.PLAYWRIGHT_HTML_TITLE = `EShop HW04 - Run by: ${STUDENT_ID} - ${RUN_AT}`;

export default defineConfig({
  testDir: './tests',
  outputDir: OUTPUT_DIR,
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
    ['json', { outputFile: JSON_OUT }],
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
