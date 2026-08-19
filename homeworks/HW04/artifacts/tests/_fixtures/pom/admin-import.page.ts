import type { Locator, Page } from '@playwright/test';

const ADMIN_URL = process.env.ADMIN_URL ?? 'http://localhost:5174';

/**
 * FR-16 — admin CSV import (:5174). Admin login inputs have clean accessible
 * names via placeholder (unlike web `/login`, see ui-survey.md P1-3), so
 * role-based locators work directly here.
 */
export class AdminImportPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly productsMenuItem: Locator;
  readonly fileInput: Locator;
  readonly importButton: Locator;
  readonly previewSummary: Locator;
  readonly resultMessage: Locator;
  readonly resultErrors: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.productsMenuItem = page.getByText('Sản phẩm', { exact: true });
    this.fileInput = page.locator('input[type="file"]');
    this.importButton = page.getByRole('button', { name: /Import \d+ sản phẩm/ });
    this.previewSummary = page.getByText(/Xem trước \(\d+ dòng\):/);
    this.resultMessage = page.getByText(/Import hoàn tất/);
    this.resultErrors = page
      .getByRole('listitem')
      .filter({ hasText: /^Hàng \d+:/ });
  }

  async gotoLogin(): Promise<void> {
    await this.page.goto(ADMIN_URL);
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async goToProducts(): Promise<void> {
    await this.productsMenuItem.click();
  }

  async uploadCsv(filePath: string): Promise<void> {
    await this.fileInput.setInputFiles(filePath);
  }

  async clickImport(): Promise<void> {
    await this.importButton.click();
  }

  resultErrorForRow(rowNumber: number): Locator {
    return this.resultErrors.filter({ hasText: new RegExp(`^Hàng ${rowNumber}:`) });
  }
}
