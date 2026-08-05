import { expect, type Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/checkout');
  }

  couponInput() {
    return this.page.getByLabel('Mã Giảm Giá');
  }

  applyCouponButton() {
    return this.page.getByRole('button', { name: 'Áp dụng' });
  }

  totalInput() {
    return this.page.getByLabel('Tổng tiền thanh toán (VND)');
  }

  checkoutButton() {
    return this.page.getByRole('button', { name: 'Xác Nhận Thanh Toán' });
  }

  async applyCoupon(code: string) {
    await this.couponInput().fill(code);
    await this.applyCouponButton().click();
  }

  async checkout() {
    await this.checkoutButton().click();
  }

  async expectLoaded() {
    await expect(this.page.getByRole('heading', { name: 'Xác Nhận Đơn Hàng' })).toBeVisible();
  }
}

