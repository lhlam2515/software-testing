import type { Locator, Page } from '@playwright/test';

/**
 * FR-02 — web login (`/login`, :5173).
 * SUT label has no `for`/`id` (R2 in TEST_PLAN.md) — `getByLabel()` fails,
 * so inputs are located via the parent form row that contains the label text.
 */
export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page
      .locator('form > div')
      .filter({ hasText: 'Username' })
      .locator('input');
    this.passwordInput = page
      .locator('form > div')
      .filter({ hasText: 'Mật khẩu' })
      .locator('input');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.errorMessage = page.locator('.bg-red-100.text-red-700');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async fillCredentials(email: string, password: string): Promise<void> {
    await this.usernameInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.signInButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillCredentials(email, password);
    await this.submit();
  }
}
