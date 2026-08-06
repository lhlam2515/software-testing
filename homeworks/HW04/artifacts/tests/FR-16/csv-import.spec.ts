import { test } from '../_fixtures/run-meta';
import {
  applyArrange,
  actImport,
  assertApi,
  assertDb,
  assertUiAfterSubmit,
  assertUiBeforeSubmit,
  cleanupCase,
  loadCases,
  prepareUi,
} from '../_fixtures/fr16-helpers';

const cases = loadCases('FR-16');

test.describe('FR-16 — CSV Product Import (EP + BVA)', () => {
  for (const tc of cases) {
    test(`${tc.id} — ${tc.title}`, async ({ page, request }, testInfo) => {
      testInfo.annotations.push(
        { type: 'hw02Ref', description: tc.hw02Ref },
        { type: 'layer', description: tc.layer },
      );
      if (tc.knownDefect) {
        testInfo.annotations.push({ type: 'knownDefect', description: tc.knownDefect });
      }
      if (tc.note) {
        testInfo.annotations.push({ type: 'note', description: tc.note });
      }

      const state = applyArrange(tc);
      let prepared;
      try {
        if (tc.layer !== 'api') {
          prepared = await prepareUi(page, tc);
          await assertUiBeforeSubmit(prepared, tc.assert.ui);
        }

        const capture = await actImport(page, request, tc, prepared);

        // Pattern #1 (UI), #2 (network/response), and #3 (persisted SQLite state).
        await assertUiAfterSubmit(prepared, tc.assert.ui);
        assertApi(capture, tc.assert.api);
        await assertDb(tc, state);
      } finally {
        cleanupCase(state, prepared);
      }
    });
  }
});
