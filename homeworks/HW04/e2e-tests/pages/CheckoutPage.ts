import { expect, type Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:5173/checkout');
  }

  couponInput() {
    return this.page.locator('label', { hasText: 'Mã Giảm Giá' }).locator('xpath=following-sibling::div//input');
  }

  applyCouponButton() {
    return this.page.getByRole('button', { name: 'Áp dụng' });
  }

  totalInput() {
    return this.page.locator('label', { hasText: 'Tổng tiền thanh toán (VND)' }).locator('xpath=following-sibling::input');
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
