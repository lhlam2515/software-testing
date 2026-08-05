import fs from 'node:fs';
import path from 'node:path';
import type { Page } from '@playwright/test';
import { expect } from './run-meta';
import { LoginPage } from './pom/login.page';
import { resetUserLoginState, setUserLoginState } from './db';

/**
 * Shared A4 helpers for FR-02 specs (login.spec.ts + lockout.bva.spec.ts).
 * A4 scope only: arrange (DB seed) + act (POM) + UI assertion (pattern #1).
 * Network (#2) and DB-state (#3) assertions are added in A5.
 */

export const TEST_USER_EMAIL = 'test@eshop.com';

export interface LoginCase {
  id: string;
  hw02Ref: string;
  title: string;
  layer: 'ui' | 'api' | 'hybrid';
  type: 'positive' | 'negative' | 'edge';
  arrange: {
    email?: string;
    setAttempts?: number;
    setLockedUntil?: string | null;
    setLockedUntilOffsetSeconds?: number;
  };
  act: {
    email: string;
    password: string;
    submitVia?: 'click' | 'enter';
  };
  assert: {
    ui?: {
      noErrorVisible?: boolean;
      navigatesAwayFromLogin?: boolean;
      staysOnLoginPage?: boolean;
      html5ValidationOnUsername?: boolean;
      genericErrorVisible?: boolean;
      errorRevealsReason?: boolean;
      passwordInputType?: string;
    };
    api?: Record<string, unknown>;
    db?: Record<string, unknown>;
  };
  note?: string;
  knownDefect: string | null;
}

export function loadCases(fixture: 'FR-02'): LoginCase[] {
  const casesPath = path.resolve(process.cwd(), `test-data/${fixture}/cases.json`);
  return JSON.parse(fs.readFileSync(casesPath, 'utf-8'));
}

export function applyArrange(arrange: LoginCase['arrange']): void {
  resetUserLoginState(TEST_USER_EMAIL);
  if (!arrange.email) return;

  const state: { login_attempts?: number; locked_until?: string | null } = {};
  if (arrange.setAttempts !== undefined) state.login_attempts = arrange.setAttempts;
  if ('setLockedUntil' in arrange) {
    state.locked_until = arrange.setLockedUntil ?? null;
  } else if (arrange.setLockedUntilOffsetSeconds !== undefined) {
    state.locked_until = new Date(
      Date.now() + arrange.setLockedUntilOffsetSeconds * 1000,
    ).toISOString();
  }
  if (Object.keys(state).length > 0) {
    setUserLoginState(arrange.email, state);
  }
}

export async function actLogin(loginPage: LoginPage, act: LoginCase['act']): Promise<void> {
  await loginPage.goto();
  if (act.submitVia === 'enter') {
    await loginPage.fillCredentials(act.email, act.password);
    await loginPage.passwordInput.press('Enter');
  } else {
    await loginPage.login(act.email, act.password);
  }
}

export async function assertUi(
  page: Page,
  loginPage: LoginPage,
  ui: LoginCase['assert']['ui'],
): Promise<void> {
  if (!ui) return;

  if (ui.noErrorVisible) {
    await expect(loginPage.errorMessage).not.toBeVisible();
  }
  if (ui.genericErrorVisible) {
    await expect(loginPage.errorMessage).toBeVisible();
  }
  if (ui.errorRevealsReason === false) {
    const text = (await loginPage.errorMessage.textContent()) ?? '';
    expect(text).not.toMatch(/khóa|không tồn tại|not found|locked/i);
  }
  if (ui.navigatesAwayFromLogin) {
    await expect(page).not.toHaveURL(/\/login/);
  }
  if (ui.staysOnLoginPage) {
    await expect(page).toHaveURL(/\/login/);
  }
  if (ui.html5ValidationOnUsername) {
    const isValid = await loginPage.usernameInput.evaluate((el: HTMLInputElement) =>
      el.checkValidity(),
    );
    expect(isValid).toBe(false);
  }
  if (ui.passwordInputType) {
    await expect(loginPage.passwordInput).toHaveAttribute('type', ui.passwordInputType);
  }
}
