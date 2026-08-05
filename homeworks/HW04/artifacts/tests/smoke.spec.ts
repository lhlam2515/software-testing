import { test, expect } from './_fixtures/run-meta';

test('EShop web frontend loads (P0 smoke)', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.+/);
});
