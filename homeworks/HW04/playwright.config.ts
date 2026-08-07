import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['html', {
      open: 'never',
      outputFolder: 'playwright-report'
    }]
  ],

  use: {
    baseURL: 'http://localhost:5173'
  },

  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'WebKit',
      use: { ...devices['Desktop Safari'] },
    }
  ]
});