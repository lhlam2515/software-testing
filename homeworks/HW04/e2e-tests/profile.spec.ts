import { expect, test } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';

const profileData = JSON.parse(
  readFileSync(join(__dirname, './test-data/profile.json'), 'utf8'),
);

async function registerAndLogin(page, request) {
  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const email = `profile-${uniqueId}@eshop.com`;
  const password = 'Test1234!';

  await request.post('http://localhost:3000/api/register', {
    data: { name: 'Profile Test User', email, password },
  });

  await page.goto('http://localhost:5173/login');
  await page.locator('label', { hasText: 'Username' }).locator('xpath=following-sibling::input').fill(email);
  await page.locator('label', { hasText: 'Mật khẩu' }).locator('xpath=following-sibling::input').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('link', { name: /Chào, Profile Test User/ })).toBeVisible();

  return { email, password };
}

async function seedOrder(request, token) {
  const response = await request.post('http://localhost:3000/api/checkout', {
    data: {
      total_amount: 1500000,
      shipping_address: '12 Le Loi, District 1, Ho Chi Minh City',
    },
    headers: { Authorization: `Bearer ${token}` },
  });
  const { orderId } = await response.json();
  return orderId;
}

async function setOrderStatus(request, orderId, status) {
  const adminLogin = await request.post('http://localhost:3000/api/login', {
    data: { email: 'admin@eshop.com', password: 'Admin123!' },
  });
  const { token } = await adminLogin.json();
  await request.put(`http://localhost:3000/api/admin/orders/${orderId}/status`, {
    data: { status },
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function openProfile(page) {
  await page.getByRole('link', { name: /Chào, / }).click();
  await expect(page).toHaveURL('http://localhost:5173/profile');
  await expect(page.getByRole('heading', { name: 'Hồ sơ của bạn' })).toBeVisible();
}

async function profileInputs(page) {
  return {
    name: page.locator('label', { hasText: 'Họ Tên' }).locator('xpath=following-sibling::input'),
    phone: page.locator('label', { hasText: 'Số điện thoại' }).locator('xpath=following-sibling::input'),
    address: page.locator('label', { hasText: 'Địa chỉ giao hàng' }).locator('xpath=following-sibling::textarea'),
    email: page.locator('label', { hasText: 'Email (Không đổi)' }).locator('xpath=following-sibling::input'),
  };
}

async function updateProfile(page, profile) {
  const inputs = await profileInputs(page);
  await inputs.name.fill(profile.name);
  await inputs.phone.fill(profile.phone);
  await inputs.address.fill(profile.shippingAddress);
  await page.getByRole('button', { name: 'Cập nhật' }).click();
}

test.describe('FR-04 Personal profile management', () => {
  test.beforeEach(async ({ page, request }) => {
    await registerAndLogin(page, request);
  });

  for (const profile of profileData.validProfiles) {
    test(`updates profile with valid data: ${profile.name}`, async ({ page }) => {
      await openProfile(page);
      let dialogMessage = '';
      page.once('dialog', (dialog) => {
        dialogMessage = dialog.message();
        dialog.accept();
      });
      await updateProfile(page, profile);
      expect(dialogMessage).toBe('Cập nhật thành công!');
    });
  }

  for (const invalidPhone of profileData.invalidPhones) {
    test(`rejects invalid phone value: ${invalidPhone}`, async ({ page }) => {
      await openProfile(page);
      const inputs = await profileInputs(page);
      await inputs.phone.fill(invalidPhone);
      let dialogMessage = '';
      page.once('dialog', (dialog) => {
        dialogMessage = dialog.message();
        dialog.accept();
      });
      await page.getByRole('button', { name: 'Cập nhật' }).click();
      expect(dialogMessage).toContain('Số điện thoại không hợp lệ');
    });
  }

  test('loads order history', async ({ page, request }) => {
    const login = await request.post('http://localhost:3000/api/login', {
      data: { email: 'profile-test-user@example.com', password: 'Test1234!' },
    }).catch(() => null);
    void login;
    await openProfile(page);
    await expect(page.getByRole('heading', { name: 'Lịch sử đơn hàng' })).toBeVisible();
  });

  test('shows pending order in history', async ({ page, request }) => {
    const { email } = await registerAndLogin(page, request);
    const login = await request.post('http://localhost:3000/api/login', {
      data: { email, password: 'Test1234!' },
    });
    const { token } = await login.json();
    const orderId = await seedOrder(request, token);
    await setOrderStatus(request, orderId, 'pending');
    await openProfile(page);
    await expect(page.getByText('Chờ xác nhận')).toBeVisible();
  });

  test('disables email field', async ({ page }) => {
    await openProfile(page);
    const inputs = await profileInputs(page);
    await expect(inputs.email).toBeDisabled();
  });

  test('shows cancel order action for cancellable order', async ({ page, request }) => {
    const { email } = await registerAndLogin(page, request);
    const login = await request.post('http://localhost:3000/api/login', {
      data: { email, password: 'Test1234!' },
    });
    const { token } = await login.json();
    const orderId = await seedOrder(request, token);
    await setOrderStatus(request, orderId, 'confirmed');
    await openProfile(page);
    await expect(page.getByRole('button', { name: 'Hủy đơn' }).first()).toBeVisible();
  });

  test('refreshes order list after cancellation', async ({ page, request }) => {
    const { email } = await registerAndLogin(page, request);
    const login = await request.post('http://localhost:3000/api/login', {
      data: { email, password: 'Test1234!' },
    });
    const { token } = await login.json();
    const orderId = await seedOrder(request, token);
    await setOrderStatus(request, orderId, 'confirmed');

    await openProfile(page);
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Hủy đơn' }).first().click();
    await expect(page.getByText('Đã hủy')).toBeVisible();
  });

  test('allows saving shipping address changes', async ({ page }) => {
    await openProfile(page);
    let dialogMessage = '';
    page.once('dialog', (dialog) => {
      dialogMessage = dialog.message();
      dialog.accept();
    });
    await updateProfile(page, {
      name: 'Profile Test User',
      phone: '0912345678',
      shippingAddress: '45 Nguyen Hue, District 1, Ho Chi Minh City',
    });
    expect(dialogMessage).toBe('Cập nhật thành công!');
  });

  test('keeps name field editable', async ({ page }) => {
    await openProfile(page);
    const inputs = await profileInputs(page);
    await expect(inputs.name).toBeEditable();
  });

  test('prefills profile data from current account', async ({ page }) => {
    await openProfile(page);
    const inputs = await profileInputs(page);
    await expect(inputs.name).not.toHaveValue('');
  });

  test('shows current user email', async ({ page }) => {
    await openProfile(page);
    const inputs = await profileInputs(page);
    await expect(inputs.email).toHaveValue(/@eshop\.com$/);
  });

  test('shows profile heading', async ({ page }) => {
    await openProfile(page);
    await expect(page.getByRole('heading', { name: 'Hồ sơ của bạn' })).toBeVisible();
  });
});
