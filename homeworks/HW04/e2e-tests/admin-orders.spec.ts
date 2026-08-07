import { expect, test } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';

const adminData = JSON.parse(
  readFileSync(join(__dirname, './test-data/admin-orders.json'), 'utf8'),
);

async function loginAsAdmin(page, request) {
  await page.goto('http://localhost:5174/');
  await page.getByPlaceholder('Email').fill(adminData.adminCredentials.email);
  await page.getByPlaceholder('Password').fill(adminData.adminCredentials.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'EShop Admin' })).toBeVisible();
}

async function seedOrder(page, request, emailSuffix) {
  const email = `admin-order-${Date.now()}-${emailSuffix}@eshop.com`;
  const password = 'Test1234!';
  await request.post('http://localhost:3000/api/register', {
    data: { name: 'Admin Order User', email, password },
  });
  const login = await request.post('http://localhost:3000/api/login', {
    data: { email, password },
  });
  const { token } = await login.json();
  const checkout = await request.post('http://localhost:3000/api/checkout', {
    data: {
      total_amount: 1500000,
      shipping_address: '12 Le Loi, District 1, Ho Chi Minh City',
    },
    headers: { Authorization: `Bearer ${token}` },
  });
  const { orderId } = await checkout.json();
  return orderId;
}

test.describe('FR-18 Order management (admin)', () => {
  test('shows admin login form when not authenticated', async ({ page }) => {
    await page.goto('http://localhost:5174/');
    await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
  });

  test('logs in as admin', async ({ page, request }) => {
    await loginAsAdmin(page, request);
  });

  test('opens orders tab', async ({ page, request }) => {
    await loginAsAdmin(page, request);
    await page.getByText('Đơn hàng', { exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Quản lý Đơn hàng' })).toBeVisible();
  });

  test('shows customer name in order rows', async ({ page, request }) => {
    const orderId = await seedOrder(page, request, 'customer');
    await loginAsAdmin(page, request);
    await page.getByText('Đơn hàng', { exact: true }).click();
    await expect(page.getByRole('table')).toContainText('Admin Order User');
    await expect(page.getByRole('table')).toContainText(`#${orderId}`);
  });

  test('shows shipping address in order rows', async ({ page, request }) => {
    await seedOrder(page, request, 'address');
    await loginAsAdmin(page, request);
    await page.getByText('Đơn hàng', { exact: true }).click();
    await expect(page.getByRole('table')).toContainText('12 Le Loi');
  });

  test('shows status badge for pending order', async ({ page, request }) => {
    await seedOrder(page, request, 'pending');
    await loginAsAdmin(page, request);
    await page.getByText('Đơn hàng', { exact: true }).click();
    await expect(page.getByRole('table')).toContainText('Chờ xác nhận');
  });

  test('shows confirm button for pending order', async ({ page, request }) => {
    await seedOrder(page, request, 'confirm');
    await loginAsAdmin(page, request);
    await page.getByText('Đơn hàng', { exact: true }).click();
    await expect(page.getByRole('button', { name: 'Xác nhận' }).first()).toBeVisible();
  });

  test('shows shipping action for confirmed order', async ({ page, request }) => {
    const orderId = await seedOrder(page, request, 'shipping');
    const login = await request.post('http://localhost:3000/api/login', {
      data: { email: adminData.adminCredentials.email, password: adminData.adminCredentials.password },
    });
    const { token } = await login.json();
    await request.put(`http://localhost:3000/api/admin/orders/${orderId}/status`, {
      data: { status: 'confirmed' },
      headers: { Authorization: `Bearer ${token}` },
    });
    await loginAsAdmin(page, request);
    await page.getByText('Đơn hàng', { exact: true }).click();
    await expect(page.getByRole('button', { name: 'Giao hàng' }).first()).toBeVisible();
  });

  test('shows complete action for shipping order', async ({ page, request }) => {
    const orderId = await seedOrder(page, request, 'complete');
    const login = await request.post('http://localhost:3000/api/login', {
      data: { email: adminData.adminCredentials.email, password: adminData.adminCredentials.password },
    });
    const { token } = await login.json();
    await request.put(`http://localhost:3000/api/admin/orders/${orderId}/status`, {
      data: { status: 'confirmed' },
      headers: { Authorization: `Bearer ${token}` },
    });
    await request.put(`http://localhost:3000/api/admin/orders/${orderId}/status`, {
      data: { status: 'shipping' },
      headers: { Authorization: `Bearer ${token}` },
    });
    await loginAsAdmin(page, request);
    await page.getByText('Đơn hàng', { exact: true }).click();
    await expect(page.getByRole('button', { name: 'Hoàn thành' }).first()).toBeVisible();
  });

  test('shows order count in table', async ({ page, request }) => {
    await seedOrder(page, request, 'count');
    await loginAsAdmin(page, request);
    await page.getByText('Đơn hàng', { exact: true }).click();
    await expect(page.getByRole('table').locator('tbody tr').first()).toBeVisible();
  });
});
