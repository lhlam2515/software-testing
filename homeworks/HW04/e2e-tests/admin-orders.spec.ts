import { expect, test } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AdminOrdersPage } from './pages/AdminOrdersPage';

const adminData = JSON.parse(
  readFileSync(join(__dirname, './test-data/admin-orders.json'), 'utf8'),
);

test.describe('FR-18 Order management (admin)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((token) => {
      localStorage.setItem('adminToken', token);
    }, 'test-admin-token');
  });

  test('shows admin login form when not authenticated', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('adminToken');
    });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
  });

  test('logs in as admin', async ({ page }) => {
    const adminPage = new AdminOrdersPage(page);
    await adminPage.goto();
    await adminPage.login(adminData.adminCredentials.email, adminData.adminCredentials.password);
    await adminPage.expectDashboardLoaded();
  });

  test('opens orders tab', async ({ page }) => {
    const adminPage = new AdminOrdersPage(page);
    await adminPage.goto();
    await adminPage.openOrdersTab();
    await expect(page.getByRole('heading', { name: 'Quản lý Đơn hàng' })).toBeVisible();
  });

  for (const transition of adminData.orderTransitions) {
    test(`handles order transition ${transition.initialStatus} to ${transition.nextStatus}`, async ({ page }) => {
      const adminPage = new AdminOrdersPage(page);
      await adminPage.goto();
      await adminPage.openOrdersTab();
      await expect(page.getByRole('table')).toBeVisible();
      await expect(page.locator('body')).toContainText(transition.initialStatus);
      await expect(page.locator('body')).toContainText(transition.nextStatus);
    });
  }

  test('shows customer name in order rows', async ({ page }) => {
    const adminPage = new AdminOrdersPage(page);
    await adminPage.goto();
    await adminPage.openOrdersTab();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('shows shipping address in order rows', async ({ page }) => {
    const adminPage = new AdminOrdersPage(page);
    await adminPage.goto();
    await adminPage.openOrdersTab();
    await expect(page.locator('body')).toContainText('Địa chỉ');
  });

  test('shows status badge for pending order', async ({ page }) => {
    const adminPage = new AdminOrdersPage(page);
    await adminPage.goto();
    await adminPage.openOrdersTab();
    await expect(page.locator('body')).toContainText('Chờ xác nhận');
  });

  test('shows confirm button for pending order', async ({ page }) => {
    const adminPage = new AdminOrdersPage(page);
    await adminPage.goto();
    await adminPage.openOrdersTab();
    await expect(page.getByRole('button', { name: 'Xác nhận' }).first()).toBeVisible();
  });

  test('shows shipping action for confirmed order', async ({ page }) => {
    const adminPage = new AdminOrdersPage(page);
    await adminPage.goto();
    await adminPage.openOrdersTab();
    await expect(page.getByRole('button', { name: 'Giao hàng' }).first()).toBeVisible();
  });

  test('shows complete action for shipping order', async ({ page }) => {
    const adminPage = new AdminOrdersPage(page);
    await adminPage.goto();
    await adminPage.openOrdersTab();
    await expect(page.getByRole('button', { name: 'Hoàn thành' }).first()).toBeVisible();
  });

  test('shows order count in table', async ({ page }) => {
    const adminPage = new AdminOrdersPage(page);
    await adminPage.goto();
    await adminPage.openOrdersTab();
    await expect(page.getByRole('table').locator('tbody tr').first()).toBeVisible();
  });
});

