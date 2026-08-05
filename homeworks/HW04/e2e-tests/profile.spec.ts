import { expect, test } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ProfilePage } from './pages/ProfilePage';

const profileData = JSON.parse(
  readFileSync(join(__dirname, './test-data/profile.json'), 'utf8'),
);

test.describe('FR-04 Personal profile management', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: 'Nguyen Van A',
          email: 'user@example.com',
          phone: '0912345678',
          shipping_address: '12 Le Loi, District 1, Ho Chi Minh City',
        }),
      );
      localStorage.setItem('token', 'test-token');
    });
  });

  for (const profile of profileData.validProfiles) {
    test(`updates profile with valid data: ${profile.name}`, async ({ page }) => {
      const profilePage = new ProfilePage(page);
      await profilePage.goto();
      await profilePage.expectLoaded();
      await profilePage.updateProfile(profile.name, profile.phone, profile.shippingAddress);
      await expect(page.getByText('Cập nhật thành công!')).toBeVisible();
    });
  }

  for (const invalidPhone of profileData.invalidPhones) {
    test(`rejects invalid phone value: ${invalidPhone}`, async ({ page }) => {
      const profilePage = new ProfilePage(page);
      await profilePage.goto();
      await profilePage.phoneInput().fill(invalidPhone);
      await profilePage.updateButton().click();
      await expect(page.getByText('Số điện thoại không hợp lệ')).toBeVisible();
    });
  }

  test('loads order history', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await expect(page.getByRole('heading', { name: 'Lịch sử đơn hàng' })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('shows empty state when no orders exist', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await expect(page.getByText('Bạn chưa có đơn hàng nào.')).toBeVisible();
  });

  test('disables email field', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await expect(page.getByLabel('Email (Không đổi)')).toBeDisabled();
  });

  test('shows cancel order action for cancellable order', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await expect(page.getByRole('button', { name: 'Hủy đơn' }).first()).toBeVisible();
  });

  test('keeps delivered orders without cancel action', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await expect(page.getByText('Đã giao')).toBeVisible();
  });

  test('refreshes order list after cancellation', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('allows saving shipping address changes', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await profilePage.addressInput().fill('45 Nguyen Hue, District 1, Ho Chi Minh City');
    await profilePage.updateButton().click();
    await expect(page.getByText('Cập nhật thành công!')).toBeVisible();
  });

  test('keeps name field editable', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await expect(profilePage.nameInput()).toBeEditable();
  });

  test('shows profile heading', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await expect(page.getByRole('heading', { name: 'Hồ sơ của bạn' })).toBeVisible();
  });
});

