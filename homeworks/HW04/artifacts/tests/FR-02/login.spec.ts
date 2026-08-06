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
 * FR-02 — EP cases (TC-01..07) + UI-layer extension cases (TC-UI-01..03).
 * BVA cases (TC-BVA-*) live in lockout.bva.spec.ts — see TEST_PLAN.md §3.
 */

const cases = loadCases('FR-02').filter((tc) => !tc.id.startsWith('TC-BVA'));

test.describe('FR-02 — Login (EP + UI-layer)', () => {
  for (const tc of cases) {
    test(`${tc.id} — ${tc.title}`, async ({ page }, testInfo) => {
      testInfo.annotations.push(
        { type: 'hw02Ref', description: tc.hw02Ref },
        { type: 'layer', description: tc.layer },
      );
      if (tc.knownDefect) {
        testInfo.annotations.push({ type: 'knownDefect', description: tc.knownDefect });
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
