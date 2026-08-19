import fs from 'node:fs';
import path from 'node:path';
import type { APIRequestContext, Page } from '@playwright/test';
import { expect } from './run-meta';
import { CheckoutPage } from './pom/checkout.page';
import { loginViaApi, authHeader, API_BASE_URL } from './api';
import {
  getCouponByCode,
  resetCouponUsage,
  createCoupon,
  deactivateCoupon,
  recordCouponUsage,
  getLatestOrderForUser,
  resetUserLoginState,
} from './db';

/**
 * Shared helpers for FR-09 (`coupon.spec.ts`). Arrange (DB seed via db.ts) +
 * act (UI for hybrid cases via CheckoutPage, direct `request` for the 2
 * api-only cases TC-08/TC-09 — `/api/apply-coupon` has no auth middleware at
 * all, see TEST_PLAN.md P3, so there is no UI path to send a custom/missing
 * Authorization header) + assert across patterns #1 (UI), #2 (network), #3
 * (DB state, TC-13 only).
 */

export const TEST_USER_EMAIL = 'test@eshop.com';
export const TEST_USER_PASSWORD = 'Test1234!';

export interface CouponCase {
  id: string;
  hw02Ref: string;
  title: string;
  layer: 'ui' | 'api' | 'hybrid';
  type: 'positive' | 'negative' | 'edge';
  arrange: {
    loginAs?: string;
    resetUsageFor?: string[];
    createCoupon?: {
      code: string;
      type: string;
      discount_value: number;
      min_order_amount: number;
      expired_at?: string;
      expiredAtOffsetDays?: number;
      max_uses_per_user: number;
    };
    deactivateCoupon?: string;
    consumeUsesViaCheckout?: { code: string; totalAmount: number; times: number };
    cartRealSubtotal?: number;
  };
  act: {
    code: string;
    totalAmount: number;
    authMode: 'valid' | 'none' | 'invalid';
    invalidToken?: string;
    userId?: number;
    confirmCheckout?: boolean;
  };
  assert: {
    api?: {
      status?: number;
      hasError?: boolean;
      hasDiscount?: boolean;
      discount_amount?: number;
      final_amount?: number;
      finalAmountNotNegative?: boolean;
    };
    db?: {
      orderTotalMatchesRealSubtotal?: boolean;
    };
  };
  knownDefect: string | null;
}

export interface ApplyCouponCapture {
  status: number;
  body: Record<string, unknown>;
}

export function loadCases(fixture: 'FR-09'): CouponCase[] {
  const casesPath = path.resolve(process.cwd(), `test-data/${fixture}/cases.json`);
  return JSON.parse(fs.readFileSync(casesPath, 'utf-8'));
}

function resolveExpiredAt(c: NonNullable<CouponCase['arrange']['createCoupon']>): string {
  if (c.expiredAtOffsetDays !== undefined) {
    const d = new Date();
    d.setDate(d.getDate() + c.expiredAtOffsetDays);
    return d.toISOString().slice(0, 10);
  }
  return c.expired_at as string;
}

/**
 * Every FR-09 case shares one account (`test@eshop.com`, arrange.loginAs) —
 * resolve + cache its id once per worker instead of logging in per lookup.
 */
let cachedUserId: number | null = null;
export async function resolveTestUserId(request: APIRequestContext): Promise<number> {
  if (cachedUserId !== null) return cachedUserId;
  // FR-02 shares this same account and deliberately locks it out via wrong
  // passwords. Reset before the first login so a prior FR-02 run in the same
  // suite doesn't 423/401 every FR-09 case (TEST_PLAN.md §8 risk #5).
  resetUserLoginState(TEST_USER_EMAIL);
  const result = await loginViaApi(request, TEST_USER_EMAIL, TEST_USER_PASSWORD);
  cachedUserId = result.user!.id;
  return cachedUserId;
}

/**
 * DB seed phase. Order matters: a case's own `createCoupon` must land before
 * `resetUsageFor`/`consumeUsesViaCheckout` that reference the same code.
 */
export async function applyArrange(request: APIRequestContext, tc: CouponCase): Promise<void> {
  const { arrange } = tc;
  const userId = tc.act.userId ?? (await resolveTestUserId(request));

  if (arrange.createCoupon) {
    createCoupon({
      code: arrange.createCoupon.code,
      type: arrange.createCoupon.type,
      discount_value: arrange.createCoupon.discount_value,
      min_order_amount: arrange.createCoupon.min_order_amount,
      expired_at: resolveExpiredAt(arrange.createCoupon),
      max_uses_per_user: arrange.createCoupon.max_uses_per_user,
    });
  }
  if (arrange.deactivateCoupon) {
    deactivateCoupon(arrange.deactivateCoupon);
  }
  if (arrange.resetUsageFor) {
    for (const code of arrange.resetUsageFor) {
      const coupon = getCouponByCode(code);
      if (coupon) resetCouponUsage(coupon.id, userId);
    }
  }
  if (arrange.consumeUsesViaCheckout) {
    const { code, times } = arrange.consumeUsesViaCheckout;
    const coupon = getCouponByCode(code);
    if (coupon) {
      for (let i = 0; i < times; i++) recordCouponUsage(coupon.id, userId);
    }
  }
}

/** Dispatches to the api-only or UI act path per `tc.layer`. */
export async function act(
  page: Page,
  request: APIRequestContext,
  tc: CouponCase,
): Promise<ApplyCouponCapture> {
  return tc.layer === 'api' ? actApi(request, tc) : actUi(page, request, tc);
}

/**
 * TC-08/TC-09 — direct `request.post`, bypassing the UI entirely, so a
 * missing/invalid Authorization header can actually be sent (the app itself
 * never sends one on this call, see checkout.page.ts / Checkout.jsx).
 */
async function actApi(request: APIRequestContext, tc: CouponCase): Promise<ApplyCouponCapture> {
  const headers: Record<string, string> =
    tc.act.authMode === 'invalid' ? authHeader(tc.act.invalidToken ?? 'invalid') : {};

  const res = await request.post(`${API_BASE_URL}/api/apply-coupon`, {
    headers,
    data: { code: tc.act.code, total_amount: tc.act.totalAmount, user_id: tc.act.userId },
  });
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { status: res.status(), body };
}

/**
 * Hybrid/UI cases — every one of them logs in first (`arrange.loginAs` is
 * present on all 19 non-api cases), so auth is seeded via localStorage
 * (`page.addInitScript`, must run before `goto` triggers the app's own
 * `useState(localStorage.getItem('token'))` read) rather than through the
 * `/login` form, which is FR-02's concern, not FR-09's.
 */
async function actUi(
  page: Page,
  request: APIRequestContext,
  tc: CouponCase,
): Promise<ApplyCouponCapture> {
  const checkoutPage = new CheckoutPage(page);

  if (tc.arrange.loginAs) {
    const { token } = await loginViaApi(request, tc.arrange.loginAs, TEST_USER_PASSWORD);
    await page.addInitScript((t: string) => {
      window.localStorage.setItem('token', t);
    }, token as string);
  }

  await checkoutPage.goto();

  if (tc.arrange.loginAs) {
    // Waits for AuthContext's /api/users/me round trip to resolve, so the
    // coupon request that follows actually carries user_id (see
    // Checkout.jsx handleApplyCoupon: `user_id: user?.id || null`).
    await expect(page.getByText(/Chào,/)).toBeVisible();
  }

  await checkoutPage.setTotalAmount(tc.act.totalAmount);

  const responsePromise = page.waitForResponse(
    (res) => res.url().includes('/api/apply-coupon') && res.request().method() === 'POST',
  );
  await checkoutPage.applyCoupon(tc.act.code);
  const response = await responsePromise;
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  const capture: ApplyCouponCapture = { status: response.status(), body };

  // Pattern #1 — UI reflects the network result. Beyond visibility, the
  // rendered discount/final amounts must match the response body: two
  // different `discount_amount` values (e.g. correct vs BUG-09-001-corrupted)
  // both render as "success", so a visibility-only check can't tell them
  // apart — reading the actual displayed numbers can.
  if (capture.status === 200 && capture.body.success) {
    await expect(checkoutPage.successMessage).toBeVisible();
    const savedText = (await checkoutPage.savedAmount.textContent()) ?? '';
    expect(Number(savedText.replace(/[^\d-]/g, ''))).toBe(capture.body.discount_amount);
    const totalText = (await checkoutPage.finalTotal.textContent()) ?? '';
    expect(Number(totalText.replace(/[^\d-]/g, ''))).toBe(capture.body.final_amount);
  } else {
    await expect(checkoutPage.errorMessage).toBeVisible();
  }

  if (tc.act.confirmCheckout) {
    const checkoutResponsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/checkout') && res.request().method() === 'POST',
    );
    await checkoutPage.confirmButton.click();
    await checkoutResponsePromise;
  }

  return capture;
}

/** Assertion pattern #2 — network/response (status + body from act's capture). */
export function assertApi(capture: ApplyCouponCapture, api: CouponCase['assert']['api']): void {
  if (!api) return;

  if (api.status !== undefined) {
    expect(capture.status).toBe(api.status);
  }
  if (api.hasError !== undefined) {
    expect('error' in capture.body).toBe(api.hasError);
  }
  if (api.hasDiscount !== undefined) {
    expect('discount_amount' in capture.body).toBe(api.hasDiscount);
  }
  if (api.discount_amount !== undefined) {
    expect(capture.body.discount_amount).toBe(api.discount_amount);
  }
  if (api.final_amount !== undefined) {
    expect(capture.body.final_amount).toBe(api.final_amount);
  }
  if (api.finalAmountNotNegative) {
    expect(capture.body.final_amount as number).toBeGreaterThanOrEqual(0);
  }
}

/**
 * Assertion pattern #3 — DB state (TC-13 only). `arrange.cartRealSubtotal` is
 * the case's own ground truth for "what the cart should really total" — the
 * spec-correct expectation is that `/api/checkout` recomputes the order total
 * from the cart server-side instead of trusting the client-supplied
 * `total_amount` (BUG-09-007). `/api/checkout` writes its INSERT inside the
 * same callback that sends the response, so there is no read-before-write
 * race here — `expect.poll()` is kept anyway for consistency with the other
 * DB assertions in this suite, not because this one is known to be racy.
 */
export async function assertDb(tc: CouponCase, userId: number): Promise<void> {
  const { db } = tc.assert;
  if (!db) return;

  if (db.orderTotalMatchesRealSubtotal) {
    const expected = tc.arrange.cartRealSubtotal;
    if (expected === undefined) {
      throw new Error(`${tc.id}: assert.db.orderTotalMatchesRealSubtotal needs arrange.cartRealSubtotal`);
    }
    await expect
      .poll(() => getLatestOrderForUser(userId)?.total_amount, {
        message: 'orders.total_amount vs arrange.cartRealSubtotal',
        timeout: 2000,
      })
      .toBe(expected);
  }
}
