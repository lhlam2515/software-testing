import { expect, type Page } from '@playwright/test';

export class ProfilePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/profile');
  }

  nameInput() {
    return this.page.getByLabel('Họ Tên');
  }

  phoneInput() {
    return this.page.getByLabel('Số điện thoại');
  }

  addressInput() {
    return this.page.getByLabel('Địa chỉ giao hàng');
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

