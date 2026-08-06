import { test } from '../_fixtures/run-meta';
import { LoginPage } from '../_fixtures/pom/login.page';
import {
  loadCases,
  applyArrange,
  actLogin,
  assertUi,
  assertApi,
  assertDb,
} from '../_fixtures/fr02-helpers';

/**
 * FR-02 — BVA cases (TC-BVA-01..05) around the login_attempts / locked_until boundary.
 * EP + UI-layer cases live in login.spec.ts — see TEST_PLAN.md §3.
 *
 * locked_until is seeded directly via db.ts (never `waitForTimeout`) — see
 * TEST_PLAN.md §8 risk #4 (real lockout duration is ~180s, BUG-02-004).
 */

const cases = loadCases('FR-02').filter((tc) => tc.id.startsWith('TC-BVA'));

test.describe('FR-02 — Lockout boundary (BVA)', () => {
  for (const tc of cases) {
    test(`${tc.id} — ${tc.title}`, async ({ page }, testInfo) => {
      testInfo.annotations.push(
        { type: 'hw02Ref', description: tc.hw02Ref },
        { type: 'layer', description: tc.layer },
      );
      if (tc.knownDefect) {
        testInfo.annotations.push({ type: 'knownDefect', description: tc.knownDefect });
      }
      if (!tc.assert.ui) {
        testInfo.annotations.push({
          type: 'note',
          description: 'No UI-observable assertion for this TC — covered by api/db assertions',
        });
      }

      // Arrange
      applyArrange(tc.arrange);

      // Act — captures the /api/login network response for pattern #2.
      const loginPage = new LoginPage(page);
      const apiCapture = await actLogin(page, loginPage, tc.act);

      // Assert — pattern #1 (UI), #2 (network/response), #3 (DB state).
      await assertUi(page, loginPage, tc.assert.ui);
      assertApi(apiCapture, tc.assert.api);
      await assertDb(tc.act.email, tc.assert.db);
    });
  }
});
