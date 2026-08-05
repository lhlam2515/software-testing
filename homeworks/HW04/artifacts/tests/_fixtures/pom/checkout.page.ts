import type { Locator, Page } from '@playwright/test';

/**
 * FR-09 — `/checkout` (:5173), accessed directly (cart add-to-cart is broken,
 * see ui-survey.md P1-2). `total_amount` is entered by hand via the spinbutton.
 */
export class CheckoutPage {
  readonly totalAmountInput: Locator;
  readonly couponInput: Locator;
  readonly applyButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly savedAmount: Locator;
  readonly finalTotal: Locator;
  readonly confirmButton: Locator;

  constructor(private readonly page: Page) {
    this.totalAmountInput = page.getByRole('spinbutton');
    this.couponInput = page.getByPlaceholder('Nhập mã giảm giá...');
    this.applyButton = page.getByRole('button', { name: 'Áp dụng' });
    this.successMessage = page.getByText(/Áp dụng thành công/);
    this.errorMessage = page.getByText(/thất bại|hết hạn|không tồn tại|chưa đủ|đã sử dụng/i);
    this.savedAmount = page.getByText('Tiết kiệm:').locator('..').locator('strong');
    this.finalTotal = page.getByText(/Tổng thanh toán:/);
    this.confirmButton = page.getByRole('button', { name: 'Xác Nhận Thanh Toán' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkout');
  }

  async setTotalAmount(amount: number): Promise<void> {
    await this.totalAmountInput.fill(String(amount));
  }

  async fillCoupon(code: string): Promise<void> {
    await this.couponInput.fill(code);
  }

  async applyCoupon(code: string): Promise<void> {
    await this.fillCoupon(code);
    await this.applyButton.click();
  }
}
