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

async function seedOrder(request, emailSuffix) {
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
  return { orderId, userEmail: email, userPassword: password, token };
}

async function loginAndOpenOrders(page, request) {
  await loginAsAdmin(page, request);
  await page.getByText('Đơn hàng', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Quản lý Đơn hàng' })).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
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
    await loginAndOpenOrders(page, request);
  });

  test('shows customer name in order rows', async ({ page, request }) => {
    await seedOrder(request, 'customer');
    await loginAndOpenOrders(page, request);
    await expect(page.getByRole('table')).toContainText('Admin Order User');
  });

  test('shows shipping address in order rows', async ({ page, request }) => {
    const { orderId } = await seedOrder(request, 'address');
    await loginAndOpenOrders(page, request);
    await expect(page.getByRole('table')).toContainText('12 Le Loi');
    await expect(page.getByRole('table')).toContainText(`#${orderId}`);
  });

  test('shows status badge for pending order', async ({ page, request }) => {
    await seedOrder(request, 'pending');
    await loginAndOpenOrders(page, request);
    await expect(page.getByRole('table')).toContainText('Chờ xác nhận');
  });

  test('shows confirm button for pending order', async ({ page, request }) => {
    await seedOrder(request, 'confirm');
    await loginAndOpenOrders(page, request);
    await expect(page.getByRole('button', { name: 'Xác nhận' }).first()).toBeVisible();
  });

  test('shows shipping action for confirmed order', async ({ page, request }) => {
    const { orderId, token } = await seedOrder(request, 'shipping');
    await request.put(`http://localhost:3000/api/admin/orders/${orderId}/status`, {
      data: { status: 'confirmed' },
      headers: { Authorization: `Bearer ${token}` },
    });
    await loginAndOpenOrders(page, request);
    await expect(page.getByRole('button', { name: 'Giao hàng' }).first()).toBeVisible();
  });

  test('shows complete action for shipping order', async ({ page, request }) => {
    const { orderId, token } = await seedOrder(request, 'complete');
    await request.put(`http://localhost:3000/api/admin/orders/${orderId}/status`, {
      data: { status: 'confirmed' },
      headers: { Authorization: `Bearer ${token}` },
    });
    await request.put(`http://localhost:3000/api/admin/orders/${orderId}/status`, {
      data: { status: 'shipping' },
      headers: { Authorization: `Bearer ${token}` },
    });
    await loginAndOpenOrders(page, request);
    await expect(page.getByRole('button', { name: 'Hoàn thành' }).first()).toBeVisible();
  });

  test('confirms pending orders through the dashboard', async ({ page, request }) => {
    const { orderId } = await seedOrder(request, 'transition-confirm');
    await loginAndOpenOrders(page, request);
    await page.getByRole('table').getByRole('button', { name: 'Xác nhận' }).first().click();
    await expect(page.getByRole('table')).toContainText(`#${orderId}`);
    await expect(page.getByRole('table')).toContainText('Đã xác nhận');
  });

  test('moves confirmed orders to shipping', async ({ page, request }) => {
    const { orderId, token } = await seedOrder(request, 'transition-shipping');
    await request.put(`http://localhost:3000/api/admin/orders/${orderId}/status`, {
      data: { status: 'confirmed' },
      headers: { Authorization: `Bearer ${token}` },
    });
    await loginAndOpenOrders(page, request);
    await page.getByRole('table').getByRole('button', { name: 'Giao hàng' }).first().click();
    await expect(page.getByRole('table')).toContainText('Đang giao');
  });

  test('completes shipping orders from the dashboard', async ({ page, request }) => {
    const { orderId, token } = await seedOrder(request, 'transition-complete');
    await request.put(`http://localhost:3000/api/admin/orders/${orderId}/status`, {
      data: { status: 'confirmed' },
      headers: { Authorization: `Bearer ${token}` },
    });
    await request.put(`http://localhost:3000/api/admin/orders/${orderId}/status`, {
      data: { status: 'shipping' },
      headers: { Authorization: `Bearer ${token}` },
    });
    await loginAndOpenOrders(page, request);
    await page.getByRole('table').getByRole('button', { name: 'Hoàn thành' }).first().click();
    await expect(page.getByRole('table')).toContainText('Đã giao');
  });

  test('shows order count in table', async ({ page, request }) => {
    await seedOrder(request, 'count');
    await loginAndOpenOrders(page, request);
    await expect(page.getByRole('table').locator('tbody tr').first()).toBeVisible();
  });
});
