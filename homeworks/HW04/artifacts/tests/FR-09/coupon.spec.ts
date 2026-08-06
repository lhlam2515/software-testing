import { test } from '../_fixtures/run-meta';
import {
  loadCases,
  applyArrange,
  act,
  assertApi,
  assertDb,
  resolveTestUserId,
} from '../_fixtures/fr09-helpers';

/**
 * FR-09 — all 21 cases in one data-driven loop: EP (TC-01..13) and BVA
 * (TC-BVA-01..08) around min_order_amount / max_uses_per_user / expired_at —
 * see TEST_PLAN.md §11 "Single-loop spec" (same convention as FR-02).
 *
 * TC-08/TC-09 (`layer: "api"`) call `/api/apply-coupon` directly via the
 * `request` fixture instead of through the UI — the app never sends an
 * Authorization header on this call, so a missing/invalid one can only be
 * exercised at the HTTP layer (TEST_PLAN.md R3).
 */

const cases = loadCases('FR-09');

test.describe('FR-09 — Apply Coupon (EP + BVA)', () => {
  for (const tc of cases) {
    test(`${tc.id} — ${tc.title}`, async ({ page, request }, testInfo) => {
      testInfo.annotations.push(
        { type: 'hw02Ref', description: tc.hw02Ref },
        { type: 'layer', description: tc.layer },
      );
      if (tc.knownDefect) {
        testInfo.annotations.push({ type: 'knownDefect', description: tc.knownDefect });
      }

      // Arrange
      await applyArrange(request, tc);

      // Act — pattern #1 (UI) is asserted inline for hybrid/UI cases; captures
      // the /api/apply-coupon network response for pattern #2.
      const capture = await act(page, request, tc);

      // Assert — pattern #2 (network/response), #3 (DB state, TC-13 only).
      assertApi(capture, tc.assert.api);
      if (tc.assert.db) {
        const userId = await resolveTestUserId(request);
        await assertDb(tc, userId);
      }
    });
  }
});
