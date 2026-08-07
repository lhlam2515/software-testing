import { expect, test } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';

const checkoutData = JSON.parse(
  readFileSync(join(__dirname, './test-data/checkout.json'), 'utf8'),
);

async function loginAsUser(page, request) {
  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const email = `checkout-${uniqueId}@eshop.com`;
  const password = 'Test1234!';

  await request.post('http://localhost:3000/api/register', {
    data: { name: 'Checkout Test User', email, password },
  });

  await page.goto('http://localhost:5173/login');
  await page.locator('label', { hasText: 'Username' }).locator('..').getByRole('textbox').fill(email);
  await page.locator('label', { hasText: 'Mật khẩu' }).locator('..').getByRole('textbox').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('http://localhost:5173/');
}

async function addProductToCart(page, index) {
  await page.goto('http://localhost:5173/');
  await expect(page.getByRole('heading', { name: 'Danh sách sản phẩm' })).toBeVisible();
  await page.getByRole('button', { name: 'Thêm vào giỏ' }).nth(index).click();
}

async function goToCheckout(page) {
  await page.getByRole('link', { name: 'Giỏ hàng' }).click();
  await expect(page.getByRole('heading', { name: 'Giỏ Hàng' })).toBeVisible();
  await page.getByRole('button', { name: 'Tiến hành thanh toán' }).click();
  await expect(page.getByRole('heading', { name: 'Xác Nhận Đơn Hàng' })).toBeVisible();
}

test.describe('FR-08 Checkout', () => {
  test.beforeEach(async ({ page, request }) => {
    await loginAsUser(page, request);
  });

  for (const [index, productName] of ['iPhone 15 Pro Max', 'Samsung Galaxy S24 Ultra'].entries()) {
    test(`shows cart item ${productName}`, async ({ page }) => {
      await addProductToCart(page, index);
      await goToCheckout(page);
      await expect(page.getByText(productName)).toBeVisible();
    });
  }

  for (const coupon of checkoutData.couponCases) {
    test(`applies coupon scenario ${coupon.code}`, async ({ page }) => {
      await addProductToCart(page, 0);
      await goToCheckout(page);
      await page.locator('label', { hasText: 'Tổng tiền thanh toán (VND)' }).locator('..').getByRole('spinbutton').fill(String(coupon.totalAmount));
      await page.locator('label', { hasText: 'Mã Giảm Giá' }).locator('..').getByRole('textbox').fill(coupon.code);
      await page.getByRole('button', { name: 'Áp dụng' }).click();

      if (coupon.code === 'INVALIDCODE') {
        await expect(page.getByText('Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa')).toBeVisible();
      } else if (coupon.code === 'EXPIRED') {
        await expect(page.getByText('Mã giảm giá đã hết hạn')).toBeVisible();
      } else {
        await expect(page.getByText('Áp dụng thành công!')).toBeVisible();
        await expect(page.getByText(/Tiết kiệm:/)).toBeVisible();
      }
    });
  }

  test('updates total amount field', async ({ page }) => {
    await addProductToCart(page, 0);
    await goToCheckout(page);
    const total = page.locator('label', { hasText: 'Tổng tiền thanh toán (VND)' }).locator('..').getByRole('spinbutton');
    await total.fill('1500000');
    await expect(total).toHaveValue('1500000');
  });

  test('shows coupon result area for valid code', async ({ page }) => {
    await addProductToCart(page, 0);
    await goToCheckout(page);
    await page.locator('label', { hasText: 'Tổng tiền thanh toán (VND)' }).locator('..').getByRole('spinbutton').fill('1500000');
    await page.locator('label', { hasText: 'Mã Giảm Giá' }).locator('..').getByRole('textbox').fill('SAVE10');
    await page.getByRole('button', { name: 'Áp dụng' }).click();
    await expect(page.getByText('Tiết kiệm:')).toBeVisible();
  });

  test('shows coupon error for invalid code', async ({ page }) => {
    await addProductToCart(page, 0);
    await goToCheckout(page);
    await page.locator('label', { hasText: 'Mã Giảm Giá' }).locator('..').getByRole('textbox').fill('INVALIDCODE');
    await page.getByRole('button', { name: 'Áp dụng' }).click();
    await expect(page.getByText('Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa')).toBeVisible();
  });

  test('shows checkout button', async ({ page }) => {
    await addProductToCart(page, 0);
    await goToCheckout(page);
    await expect(page.getByRole('button', { name: 'Xác Nhận Thanh Toán' })).toBeVisible();
  });

  test('submits checkout flow', async ({ page }) => {
    await addProductToCart(page, 0);
    await goToCheckout(page);
    await page.getByRole('button', { name: 'Xác Nhận Thanh Toán' }).click();
    await expect(page.getByRole('heading', { name: 'Thanh toán thành công!' })).toBeVisible();
  });

  test('shows success return link after checkout', async ({ page }) => {
    await addProductToCart(page, 0);
    await goToCheckout(page);
    await page.getByRole('button', { name: 'Xác Nhận Thanh Toán' }).click();
    await expect(page.getByRole('button', { name: 'Quay lại trang chủ' })).toBeVisible();
  });

  test('uses URL after successful checkout', async ({ page }) => {
    await addProductToCart(page, 0);
    await goToCheckout(page);
    await page.getByRole('button', { name: 'Xác Nhận Thanh Toán' }).click();
    await expect(page).toHaveURL('http://localhost:5173/checkout');
  });

  test('supports coupon application button state', async ({ page }) => {
    await addProductToCart(page, 0);
    await goToCheckout(page);
    await expect(page.getByRole('button', { name: 'Áp dụng' })).toBeDisabled();
  });

  test('renders product summary area', async ({ page }) => {
    await addProductToCart(page, 0);
    await goToCheckout(page);
    await expect(page.getByRole('heading', { name: 'Sản phẩm:' })).toBeVisible();
  });
});
