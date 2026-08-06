import fs from 'node:fs';
import path from 'node:path';
import type { Page } from '@playwright/test';
import { expect } from './run-meta';
import { LoginPage } from './pom/login.page';
import { resetUserLoginState, setUserLoginState, getUserLoginState } from './db';

/**
 * Shared helpers for FR-02 specs (login.spec.ts + lockout.bva.spec.ts).
 * Arrange (DB seed) + act (POM, captures /api/login response) + assert
 * across all 3 patterns: UI (#1), network/response (#2), DB state (#3).
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
    submitVia?: 'click' | 'enter' | 'none';
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
    api?: {
      status?: number;
      hasToken?: boolean;
      requestSent?: boolean;
    };
    db?: {
      login_attempts?: number;
      locked_until?: string | null;
      locked_untilNotNull?: boolean;
    };
  };
  note?: string;
  knownDefect: string | null;
}

export interface ApiCapture {
  requestSent: boolean;
  status?: number;
  body?: Record<string, unknown>;
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

/**
 * Fills + submits the login form and captures the /api/login network
 * response (assertion pattern #2). TC-02/TC-03 block submission via HTML5
 * validation before any request fires — for those, the response wait times
 * out and this resolves to `{ requestSent: false }` instead of hanging.
 *
 * `submitVia: 'none'` stops after filling — for TCs asserting a static DOM
 * property (e.g. TC-UI-01 password masking) that submitting would destroy by
 * navigating away on a successful login.
 */
export async function actLogin(
  page: Page,
  loginPage: LoginPage,
  act: LoginCase['act'],
): Promise<ApiCapture> {
  await loginPage.goto();
  await loginPage.fillCredentials(act.email, act.password);
  if (act.submitVia === 'none') return { requestSent: false };

  const responsePromise = page
    .waitForResponse(
      (res) => res.url().includes('/api/login') && res.request().method() === 'POST',
      { timeout: 2000 },
    )
    .catch(() => null);

  if (act.submitVia === 'enter') {
    await loginPage.passwordInput.press('Enter');
  } else {
    await loginPage.submit();
  }

  const response = await responsePromise;
  if (!response) return { requestSent: false };
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  return { requestSent: true, status: response.status(), body };
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

/** Assertion pattern #2 — network/response (status + body from actLogin's capture). */
export function assertApi(capture: ApiCapture, api: LoginCase['assert']['api']): void {
  if (!api) return;

  if (api.requestSent !== undefined) {
    expect(capture.requestSent).toBe(api.requestSent);
  }
  if (!capture.requestSent) return;

  if (api.status !== undefined) {
    expect(capture.status).toBe(api.status);
  }
  if (api.hasToken !== undefined) {
    expect(Boolean(capture.body?.token)).toBe(api.hasToken);
  }
}

/**
 * Assertion pattern #3 — DB state (`users.login_attempts` / `locked_until`).
 *
 * `server.js`'s /api/login handler fires `db.run(UPDATE ...)` without
 * awaiting its callback before responding — the HTTP response can arrive
 * before the write lands on disk. `expect.poll()` retries the read (same
 * web-first-retry idea as UI assertions), which absorbs that race without a
 * fixed sleep.
 */
export async function assertDb(email: string, db: LoginCase['assert']['db']): Promise<void> {
  if (!db) return;

  if (db.login_attempts !== undefined) {
    await expect
      .poll(() => getUserLoginState(email).login_attempts, {
        message: `login_attempts for ${email}`,
      })
      .toBe(db.login_attempts);
  }
  if (db.locked_until !== undefined) {
    await expect
      .poll(() => getUserLoginState(email).locked_until, {
        message: `locked_until for ${email}`,
      })
      .toBe(db.locked_until);
  }
  if (db.locked_untilNotNull) {
    await expect
      .poll(() => getUserLoginState(email).locked_until, {
        message: `locked_until for ${email}`,
      })
      .not.toBeNull();
  }
}
