import { expect, type Page } from '@playwright/test';

export class ProfilePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:5173/profile');
  }

  nameInput() {
    return this.page.locator('label', { hasText: 'Họ Tên' }).locator('xpath=following-sibling::input');
  }

  phoneInput() {
    return this.page.locator('label', { hasText: 'Số điện thoại' }).locator('xpath=following-sibling::input');
  }

  addressInput() {
    return this.page.locator('label', { hasText: 'Địa chỉ giao hàng' }).locator('xpath=following-sibling::textarea');
  }

  updateButton() {
    return this.page.getByRole('button', { name: 'Cập nhật' });
  }

  async updateProfile(name: string, phone: string, address: string) {
    await this.nameInput().fill(name);
    await this.phoneInput().fill(phone);
    await this.addressInput().fill(address);
    await this.updateButton().click();
  }

  async expectLoaded() {
    await expect(this.page.getByRole('heading', { name: 'Hồ sơ của bạn' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Lịch sử đơn hàng' })).toBeVisible();
  }
}
