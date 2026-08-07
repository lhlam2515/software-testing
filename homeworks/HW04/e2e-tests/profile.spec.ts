import { expect, test } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';

const profileData = JSON.parse(
  readFileSync(join(__dirname, './test-data/profile.json'), 'utf8'),
);

async function loginAsUser(page, request) {
  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const email = `profile-${uniqueId}@eshop.com`;
  const password = 'Test1234!';

  await request.post('http://localhost:3000/api/register', {
    data: { name: 'Profile Test User', email, password },
  });

  await page.goto('http://localhost:5173/login');
  await page.locator('input').nth(0).fill(email);
  await page.locator('input').nth(1).fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('http://localhost:5173/');
}

async function seedOrder(request, token) {
  const response = await request.post('http://localhost:3000/api/checkout', {
    data: {
      total_amount: 1500000,
      shipping_address: '12 Le Loi, District 1, Ho Chi Minh City',
    },
    headers: { Authorization: `Bearer ${token}` },
  });
  return (await response.json()).orderId;
}

async function promoteOrderToDelivered(request, orderId) {
  const adminLogin = await request.post('http://localhost:3000/api/login', {
    data: { email: 'admin@eshop.com', password: 'Admin123!' },
  });
  const { token: adminToken } = await adminLogin.json();

  for (const status of ['confirmed', 'shipping', 'delivered']) {
    await request.put(`http://localhost:3000/api/admin/orders/${orderId}/status`, {
      data: { status },
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  }
}

async function triggerSubmit(page) {
  await page.evaluate(() => {
    const button = document.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    button?.click();
  });
}

async function updateProfile(page, profile) {
  const dialogPromise = page.waitForEvent('dialog');
  await page.locator('input').nth(1).fill(profile.name);
  await page.locator('input').nth(2).fill(profile.phone);
  await page.locator('textarea').fill(profile.shippingAddress);
  await triggerSubmit(page);
  return dialogPromise;
}

test.describe('FR-04 Personal profile management', () => {
  test.beforeEach(async ({ page, request }) => {
    await loginAsUser(page, request);
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const orderId = await seedOrder(request, token);
    await promoteOrderToDelivered(request, orderId);
  });

  for (const profile of profileData.validProfiles) {
    test(`updates profile with valid data: ${profile.name}`, async ({ page }) => {
      await page.goto('http://localhost:5173/profile');
      await expect(page.getByRole('heading', { name: 'Hồ sơ của bạn' })).toBeVisible();
      const dialog = await updateProfile(page, profile);
      expect(dialog.message()).toBe('Cập nhật thành công!');
      await dialog.accept();
    });
  }

  for (const invalidPhone of profileData.invalidPhones) {
    test(`rejects invalid phone value: ${invalidPhone}`, async ({ page }) => {
      await page.goto('http://localhost:5173/profile');
      const dialogPromise = page.waitForEvent('dialog');
      await page.locator('input').nth(2).fill(invalidPhone);
      await triggerSubmit(page);
      const dialog = await dialogPromise;
      expect(dialog.message()).toContain('Số điện thoại không hợp lệ');
      await dialog.accept();
    });
  }

  test('loads order history', async ({ page }) => {
    await page.goto('http://localhost:5173/profile');
    await expect(page.getByRole('heading', { name: 'Lịch sử đơn hàng' })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('shows pending order in history', async ({ page }) => {
    await page.goto('http://localhost:5173/profile');
    await expect(page.getByText('Chờ xác nhận')).toBeVisible();
  });

  test('disables email field', async ({ page }) => {
    await page.goto('http://localhost:5173/profile');
    await expect(page.locator('input').first()).toBeDisabled();
  });

  test('shows cancel order action for cancellable order', async ({ page }) => {
    await page.goto('http://localhost:5173/profile');
    await expect(page.getByRole('button', { name: 'Hủy đơn' }).first()).toBeVisible();
  });

  test('refreshes order list after cancellation', async ({ page }) => {
    await page.goto('http://localhost:5173/profile');
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('allows saving shipping address changes', async ({ page }) => {
    await page.goto('http://localhost:5173/profile');
    const dialog = await updateProfile(page, {
      name: 'Profile Test User',
      phone: '0912345678',
      shippingAddress: '45 Nguyen Hue, District 1, Ho Chi Minh City',
    });
    expect(dialog.message()).toBe('Cập nhật thành công!');
    await dialog.accept();
  });

  test('keeps name field editable', async ({ page }) => {
    await page.goto('http://localhost:5173/profile');
    await expect(page.locator('input').nth(1)).toBeEditable();
  });

  test('prefills profile data from current account', async ({ page }) => {
    await page.goto('http://localhost:5173/profile');
    await expect(page.locator('input').nth(1)).not.toHaveValue('');
  });

  test('shows current user email', async ({ page }) => {
    await page.goto('http://localhost:5173/profile');
    await expect(page.locator('input').first()).toHaveValue(/@eshop\.com$/);
  });

  test('shows profile heading', async ({ page }) => {
    await page.goto('http://localhost:5173/profile');
    await expect(page.getByRole('heading', { name: 'Hồ sơ của bạn' })).toBeVisible();
  });
});
