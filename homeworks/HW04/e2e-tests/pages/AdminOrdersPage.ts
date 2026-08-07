import { expect, type Page } from '@playwright/test';

export class AdminOrdersPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:5174/');
  }

  emailInput() {
    return this.page.getByPlaceholder('Email');
  }

  passwordInput() {
    return this.page.getByPlaceholder('Password');
  }

  loginButton() {
    return this.page.getByRole('button', { name: 'Login' });
  }

  async login(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }

  async openOrdersTab() {
    await this.page.getByText('Đơn hàng', { exact: true }).click();
  }

  async expectDashboardLoaded() {
    await expect(this.page.getByRole('heading', { name: 'EShop Admin' })).toBeVisible();
  }
}
