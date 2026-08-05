import { expect, test } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CheckoutPage } from './pages/CheckoutPage';

const checkoutData = JSON.parse(
  readFileSync(join(__dirname, './test-data/checkout.json'), 'utf8'),
);

test.describe('FR-08 Checkout', () => {
  for (const item of checkoutData.cartItems) {
    test(`shows cart item ${item.name}`, async ({ page }) => {
      const checkoutPage = new CheckoutPage(page);
      await page.addInitScript((cartItems) => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      }, [item]);
      await checkoutPage.goto();
      await checkoutPage.expectLoaded();
      await expect(page.getByText(item.name)).toBeVisible();
    });
  }

  for (const coupon of checkoutData.couponCases) {
    test(`applies coupon scenario ${coupon.code}`, async ({ page }) => {
      const checkoutPage = new CheckoutPage(page);
      await checkoutPage.goto();
      await checkoutPage.totalInput().fill(String(coupon.totalAmount));
      await checkoutPage.applyCoupon(coupon.code);
      await expect(page.locator('body')).toContainText(coupon.description);
    });
  }

  test('updates total amount field', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();
    await checkoutPage.totalInput().fill('1500000');
    await expect(checkoutPage.totalInput()).toHaveValue('1500000');
  });

  test('shows coupon result area for valid code', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();
    await checkoutPage.applyCoupon('SAVE10');
    await expect(page.getByText('Tiết kiệm:')).toBeVisible();
  });

  test('shows coupon error for invalid code', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();
    await checkoutPage.applyCoupon('INVALIDCODE');
    await expect(page.getByText('Không thể áp dụng mã')).toBeVisible();
  });

  test('shows checkout button', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();
    await expect(checkoutPage.checkoutButton()).toBeVisible();
  });

  test('submits checkout flow', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();
    await checkoutPage.checkout();
    await expect(page.getByText('Thanh toán thành công!')).toBeVisible();
  });

  test('shows success return link after checkout', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();
    await checkoutPage.checkout();
    await expect(page.getByRole('link', { name: 'Quay lại trang chủ' })).toBeVisible();
  });

  test('uses URL after successful checkout', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();
    await checkoutPage.checkout();
    await expect(page).toHaveURL(/.*\/checkout/);
  });

  test('supports coupon application button state', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();
    await expect(checkoutPage.applyCouponButton()).toBeEnabled();
  });

  test('renders product summary area', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();
    await expect(page.getByRole('heading', { name: 'Sản phẩm:' })).toBeVisible();
  });
});

