# Main Report — HW04

**Automation Testing on EShop (Playwright, Multi-browser)**

---

## 1. Student Information

| Field | Value |
| ----- | ----- |
| Student name | Lê Hoàng Lâm |
| Student ID | 23127216 |
| Group | 02 |
| Class / Cohort | 23KTPM1 |
| Assignment | HW04-AI — Automation Testing |
| SUT | EShop — `http://localhost:5173` (repo: [github.com/ttbhanh/eshop-sut](https://github.com/ttbhanh/eshop-sut)) |
| Public GitHub repository | [github.com/lhlam2515/software-testing](https://github.com/lhlam2515/software-testing) |
| Report date | 2026-08-10 |

---

## 2. System Under Test

The SUT was run from the local `apps/` monorepo, not the standalone `eshop-sut` repo — `apps/run-servers.sh` starts the backend, the customer storefront, and the admin dashboard together. FR-02 and FR-09 exercise the storefront; FR-16 exercises the admin dashboard, since CSV import is an admin-only route. Both test accounts below are the SUT's own seeded demo data (shared fixture, not a personal credential), so they can be published here.

| Item | Value |
| ---- | ----- |
| Frontend URL | `http://localhost:5173` (customer storefront — FR-02, FR-09) · `http://localhost:5174` (admin dashboard — FR-16) |
| Backend URL | `http://localhost:3000` |
| Test account(s) | `test@eshop.com` / `Test1234!` (regular user, FR-02/FR-09) · `admin@eshop.com` / `Admin123!` (admin, FR-16) — both are the SUT's seeded demo accounts |
| Build / commit under test | `f513325` — "feat: init softwares under test, docs and AI templates" (2026-05-23), unchanged since |

---

## 3. Feature Selection

Same three web features selected in HW02 — one each from Pools A, B, C. See §5 of `REQUIREMENTS.md`.

### 3.1 FR-02 — Login & Account Lockout (Pool A)

| Field | Value |
| ----- | ----- |
| HW02 reference | [domain-testing.md](reference/FR-02-login-lockout/domain-testing.md) · [bva.md](reference/FR-02-login-lockout/bva.md) |
| Why this feature | Has the clearest state machine of the three (`login_attempts`/`locked_until`), and the highest defect density relative to its test-case count — a good fit for demonstrating DB-state assertions. |
| Test cases carried over from HW02 | 12 (7 EP `TC-01`–`TC-07` + 5 BVA `TC-BVA-01`–`TC-BVA-05`), extended to 18 for automation: +3 EP sub-cases (`TC-03b`/`TC-03c`/`TC-03d`, splitting the invalid-email EC further) and +3 new UI-layer cases (`TC-UI-01`–`TC-UI-03`, see `TEST_PLAN.md §1.1`) |

### 3.2 FR-09 — Discount Coupons (Pool B)

| Field | Value |
| ----- | ----- |
| HW02 reference | [domain-testing.md](reference/FR-09-coupon/domain-testing.md) · [bva.md](reference/FR-09-coupon/bva.md) |
| Why this feature | Has the densest business-rule surface of the three (5 simultaneous conditions, C1–C5), which surfaced the widest variety of defect types — calculation errors, auth bypass, and boundary-check mistakes — making it the best fit for assertion pattern #2 (network/API). |
| Test cases carried over from HW02 | 21 (13 EP `TC-01`–`TC-13` + 8 BVA `TC-BVA-01`–`TC-BVA-08`), all reused as-is with no additions |

### 3.3 FR-16 — CSV Import (Pool C)

| Field | Value |
| ----- | ----- |
| HW02 reference | [domain-testing.md](reference/FR-16-csv-import/domain-testing.md) · [bva.md](reference/FR-16-csv-import/bva.md) |
| Why this feature | Carries the largest test-case budget (24) and is the only one of the three with an admin CRUD flow, file upload, and an atomic-rollback invariant — the best case for exercising assertion pattern #3 (DB state) at its most demanding. |
| Test cases carried over from HW02 | 24 (19 EP `TC-01`–`TC-19` + 5 BVA `TC-BVA-01`–`TC-BVA-05`), all reused as-is with no additions |

### 3.4 Non-overlap declaration (§5)

| Member | Pool A | Pool B | Pool C |
| ------ | ------ | ------ | ------ |
| Lê Hoàng Lâm (me) | FR-02 | FR-09 | FR-16 |
|  |  |  |  |

---

## 4. Automation Approach

### 4.1 Tooling and Environment

| Item | Value |
| ---- | ----- |
| Automation framework | Playwright `1.62.1` |
| Language | TypeScript |
| AI tool(s) used to generate scripts | Claude Code (Sonnet 5) |
| Report format | Playwright HTML reporter |

### 4.2 Data-driven Design

Each spec reads its feature's `cases.json` with `fs.readFileSync` + `JSON.parse`, then runs one `test()` per case inside a single `test.describe` loop and one spec file per feature. No case data is hardcoded inline; every case's `arrange`/`act`/`assert` fields live in the JSON file. FR-16 additionally generates temporary CSV fixtures from `cases.json` at runtime (`_fixtures/csv.ts`) so the upload payload itself stays data-driven instead of a checked-in binary file.

| Feature | Data file | Format | Rows |
| ------- | --------- | ------ | ---: |
| FR-02 | [artifacts/test-data/FR-02/cases.json](artifacts/test-data/FR-02/cases.json) | JSON | 18 |
| FR-09 | [artifacts/test-data/FR-09/cases.json](artifacts/test-data/FR-09/cases.json) | JSON | 21 |
| FR-16 | [artifacts/test-data/FR-16/cases.json](artifacts/test-data/FR-16/cases.json) + [fixtures/](artifacts/test-data/FR-16/fixtures/) | JSON + CSV fixtures | 24 |

### 4.3 Assertion Patterns

> At least 3 distinct assertion patterns are required across the suite (e.g., UI state assertion, network/response assertion, DB/state assertion).

| # | Pattern | Example use | Feature(s) |
| - | ------- | ------------ | ---------- |
| 1 | **Web-first UI assertion** — `expect(locator).toHaveText/toBeVisible/toHaveURL`, auto-retry, no manual sleep | `expect(passwordInput).toHaveAttribute('type', 'password')` catching BUG-02-005 (`fr02-helpers.ts:125`) | FR-02, FR-09, FR-16 |
| 2 | **Network/API response assertion** — `page.waitForResponse()` capturing status + body, or direct `request.post()` for API-only cases | `expect(capture.status).toBe(401)` catching BUG-02-006 (`assertApi`, `fr02-helpers.ts:160`); same pattern for `/api/apply-coupon` (`fr09-helpers.ts:239`) and `/api/admin/import-products` (`fr16-helpers.ts:324`) | FR-02, FR-09, FR-16 |
| 3 | **Database-state assertion** — queries `database.sqlite` via `_fixtures/db.ts`, wrapped in `expect.poll()` for auto-retry instead of a fixed wait | `login_attempts` increase-by-1 check catching BUG-02-003 (`assertDb`, `fr02-helpers.ts:185`); atomic-rollback and dangling-FK checks for FR-16 (`fr16-helpers.ts:404`) | FR-02, FR-09, FR-16 |

### 4.4 Browser Matrix and Run Metadata

> Each feature must run on all 3 browsers — at least 9 browser runs total. Every HTML report must visibly show `Run by: {StudentID}` and an ISO timestamp (§11 anti-cheat constraint).

WebKit could not launch on this host (Fedora 44 is unsupported by `playwright install-deps`); Edge (flatpak, Chromium engine) fills the 3rd-browser slot per `REQUIREMENTS.md` line 83's allowed "Chrome / Edge / Firefox" substitution — see `bugs/BUG_REPORT.md` for the full rationale. All 9 runs (3 features × 3 browsers) produced **identical pass/fail sets** — 0 browser-diff bugs, a negative finding worth recording (`bugs/BUG_REPORT.md` "Bug Triage Method").

| Feature | Chromium | Firefox | Edge |
| ------- | :------: | :-----: | :----: |
| FR-02 | 10/18 pass | 10/18 pass | 10/18 pass |
| FR-09 | 11/21 pass | 11/21 pass | 11/21 pass |
| FR-16 | 12/24 pass | 12/24 pass | 12/24 pass |

---

## 5. Automation Results

> Full specs live under `artifacts/tests/<feature>/`. Full HTML reports live under `artifacts/html-reports/<feature>/<browser>/`.

### 5.1 FR-02 — Login & Account Lockout

| Metric | Value |
| ------ | ----- |
| Test cases automated | 18 |
| Executed / Passed / Failed | 18 / 10 / 8 (identical on all 3 browsers) |
| Browser runs | 3 (Chromium, Firefox, Edge) |
| Spec location | [artifacts/tests/FR-02/](artifacts/tests/FR-02/) |
| HTML reports | [artifacts/html-reports/FR-02/](artifacts/html-reports/FR-02/) |

### 5.2 FR-09 — Discount Coupons

| Metric | Value |
| ------ | ----- |
| Test cases automated | 21 |
| Executed / Passed / Failed | 21 / 11 / 10 (identical on all 3 browsers) |
| Browser runs | 3 (Chromium, Firefox, Edge) |
| Spec location | [artifacts/tests/FR-09/](artifacts/tests/FR-09/) |
| HTML reports | [artifacts/html-reports/FR-09/](artifacts/html-reports/FR-09/) |

### 5.3 FR-16 — CSV Import

| Metric | Value |
| ------ | ----- |
| Test cases automated | 24 |
| Executed / Passed / Failed | 24 / 12 / 12 (identical on all 3 browsers) |
| Browser runs | 3 (Chromium, Firefox, Edge) |
| Spec location | [artifacts/tests/FR-16/](artifacts/tests/FR-16/) |
| HTML reports | [artifacts/html-reports/FR-16/](artifacts/html-reports/FR-16/) |

### 5.4 Consolidated Test Summary

> "Executed / Passed / Failed" here are summed across all 3 browser runs per feature (single-run counts × 3, since all 3 browsers produced identical results — see §4.4).

| Feature | Automated | Executed | Passed | Failed | Browser runs | Bugs |
| ------- | --------: | -------: | -----: | -----: | ------------: | ---: |
| FR-02 | 18 | 54 | 30 | 24 | 3 | 4 |
| FR-09 | 21 | 63 | 33 | 30 | 3 | 7 |
| FR-16 | 24 | 72 | 36 | 36 | 3 | 5 |
| **Total** | **63** | **189** | **99** | **90** | **9** | **16** |

---

## 6. Human Review and AI Gap Analysis

> Critical review of the AI-generated scripts (§6, Task 1 — "Review and fix"). Full per-artifact audit lives in [AI_Audit_Report.md](%5BAI-02%5D_AI_Audit_Report.md).

### 6.1 Fragile Selectors

| # | Feature | AI-generated selector | Issue | Fix |
| - | ------- | ---------------------- | ----- | --- |
| 1 | FR-02 | `errorMessage`: `.bg-red-100.text-red-700` in `login.page.ts`, a Tailwind utility class pair used as the only hook | SUT has no `data-testid` or accessible role on the error banner (ui-survey.md finding R1), so styling changes would silently break this locator | Accepted risk, no better hook exists in the SUT. Logged as a UI accessibility gap worth reporting, not a test defect. |
| 2 | FR-02 | `usernameInput`/`passwordInput`: `form > div.filter({ hasText: 'Username' / 'Mat khau' }).locator('input')` | Coupled to exact label text and sibling DOM position, since the `<label>` has no `for`/`id` binding to its input (ui-survey.md finding R2). Any copy or markup change breaks it silently | Accepted risk, same root cause as row 1. Decided during the pre-automation UI survey, before any locator was generated — a deliberate tradeoff, not an AI guess. |

### 6.2 Weak or Missing Assertions

| # | Feature | AI-generated assertion | Issue | Fix |
| - | ------- | ------------------------ | ----- | --- |
| 1 | FR-02 | The initial spec draft asserted UI state only, with no network or DB check | TC-06's real defect (BUG-02-003, counter increments by 2 instead of 1) would have gone undetected, because the UI shows the same generic error either way | Added `assertApi` and `assertDb` (patterns 2 and 3) in a follow-up pass |
| 2 | FR-02 | TC-BVA-03/04/05 assert UI plus `hasToken` only, no `db.login_attempts`/`locked_until` check | The DB-level state transition at the lockout boundary (counter reset on success, `server.js` lines 47 to 50) is inferred from login outcome, not verified directly | Added `db: { login_attempts: 0, locked_until: null }` to TC-BVA-04/05 (successful logins). TC-BVA-03 stays UI/API only, since it never reaches the reset branch |
| 3 | FR-02 | `assertApi`'s `hasToken` check compares `Boolean(capture.body?.token)` | When `requestSent` is false, `capture.body` is undefined, so `Boolean(undefined)` also equals false. A case setting `hasToken: false` without also setting `requestSent` cannot distinguish "no request sent" from "request returned no token" | Not an issue for the current FR-02 cases, every `hasToken: false` case also pins `ui` or `requestSent`. Noted as a schema gap to watch when writing FR-09/FR-16 cases |
| 4 | FR-02 | TC-05 (empty password) had no `db` assertion at all; `ui.staysOnLoginPage: true` is true in both Branch A (HTML5 blocks submit) and Branch B (server returns an error), so the case could not tell which branch actually fired | Left `domain-testing.md#tc-05`'s explicit gap unanswered ("API cross-check: if Branch B, does `login_attempts` increment?") — the case passed regardless of which branch the SUT actually took | Ran TC-05 live against the SUT to observe the real branch: the password field carries `required` (`Login.jsx`), so the form never reaches the server — Branch A. Added `api.requestSent: false` and `db.login_attempts: 0` matching the observed branch, with a `note` recording that this was confirmed by execution, not assumption |
| 5 | FR-16 | TC-13/14/15/16 (Gap Probe cases) each hard-code one fixed expected value out of the multiple valid branches `domain-testing.md` explicitly lists for these ("spec does not define this — record actual result"), with no `note` explaining why that particular branch was chosen | Inconsistent with TC-12/TC-18 in the same file, which do carry a rationale note for a similar situation. Without the note, a future re-run that lands on a different (also-valid) branch reads as "test broke" instead of "chosen interpretation no longer matches observed behavior" | Added a `note` to all 4 cases citing the specific branch chosen and the HW02-observed status (PASS vs FAIL — BUG-16-003/004) that justified picking it as the fixed expected value |
| 6 | FR-02 | `errorRevealsReason: false` in `assertUi` (`fr02-helpers.ts`) checks the error text against a blacklist regex `/khóa\|không tồn tại\|not found\|locked/i` | A blacklist is not equivalent to "generic error" — if the SUT later ships a different information-leaking phrase (e.g. "tài khoản bị tạm ngưng"), the assertion still passes while the underlying enumeration bug slips through undetected | Flagged during this review, not fixed in this pass — would need a whitelist against the single expected generic message instead of a blacklist of known-bad ones |
| 7 | FR-09 | `checkout.page.ts`'s `errorMessage` locator ORs 5 distinct error substrings (`thất bại\|hết hạn\|không tồn tại\|chưa đủ\|đã sử dụng`) into one regex | If the SUT shows a generic error that matches none of the 5 substrings, the locator itself fails to resolve — the test then reports "element not found" instead of surfacing the real content mismatch, the same misleading-failure pattern as row 2 in §6.4 | Flagged, not fixed — acceptable for now because the specific-error assertions are pushed down to the API layer, but worth tightening if FR-09 error copy changes |
| 8 | FR-09 | TC-11 (`finalAmountNotNegative`) only lower-bounds `final_amount`, never cross-checks `discount_amount` itself | A case can pass even when `discount_amount` is computed incorrectly, as long as the resulting `final_amount` stays non-negative | Flagged, not fixed — would need an additional bound assertion on `discount_amount` |
| 9 | FR-09 | TC-13 (client-manipulated `total_amount`) always runs against an empty real cart (`cartRealSubtotal: 0`), because add-to-cart could not be automated | The original HW02 intent was to prove a user can pay a small fraction of a real order's value (e.g. a real 4,000,000₫ cart charged against a fabricated 500,000₫ total). The automated case still proves the server ignores the client-sent `total_amount` (BUG-09-007), but no longer demonstrates the financial severity of the exploit | Documented honestly in the case's `note`, not fixed — called out here so graders don't assume the full exploit scenario was reproduced |

### 6.3 Missing Edge Cases

| # | Feature | Edge case AI missed | Why it matters | Added TC |
| - | ------- | --------------------- | --------------- | -------- |
| 1 | FR-02 | None found for this feature. TC-BVA-04 (exact expiry boundary, `locked_until = now`) was already present, seeded via `setLockedUntilOffsetSeconds: 0` | TEST_PLAN.md section 4.1 predicted the AI would likely skip this exact case since it needs DB seeding to set up. That predicted risk did not materialize for FR-02 | N/A |
| 2 | FR-02 | TC-03 (invalid email format) only covered 1 of the 3 variants `domain-testing.md#tc-03` explicitly lists (`test@`, `@domain.com`, `test @domain.com`); the original AI draft substituted its own `invalid_no_at_sign` value and stopped there | 2 of 3 explicitly-required EP sub-cases were silently dropped, so most of the intended coverage for this equivalence class never ran. Initial fix also mis-attributed the reason ("browser-diff on email-format parsing") before checking `Login.jsx` — the field is `type="text"`, not `type="email"`, so no HTML5 format validation runs at all and there is no browser-diff to find | Added TC-03b/TC-03c/TC-03d, one per missing variant. All 4 (TC-03/03b/03c/03d) fail for the same confirmed root cause, BUG-02-001 |

### 6.4 Flaky Waits and Execution Stability

| # | Feature | AI-generated wait/timing | Issue | Fix |
| - | ------- | -------------------------- | ----- | --- |
| 1 | FR-02 | The initial DB-assertion draft read `login_attempts`/`locked_until` once, immediately after the network response resolved | `server.js`'s `/api/login` handler calls `db.run(UPDATE ...)` without awaiting its callback before responding, so the HTTP response can arrive before the write lands on disk. Observed as sporadic stale reads, and, before WAL was enabled on the test's own connection, as outright "database is locked" errors | Enabled WAL journal mode plus `busy_timeout` on `db.ts`'s connection, and switched `assertDb` to `expect.poll()`, the same auto-retry idea already used for UI assertions, instead of a fixed sleep |
| 2 | FR-02 | TC-UI-01 reused the shared `actLogin` helper, which always submits the form | Valid credentials were used to test password masking, so a successful submit navigated away from `/login` before the assertion ran, producing a misleading "element not found" failure instead of the real `type=text` defect | Added `submitVia: 'none'` so static DOM-property checks stop after filling, without submitting |

### 6.5 Test Cases Not Automated

| # | Feature | TC ID | Reason not automated |
| - | ------- | ----- | ---------------------- |
| — | — | — | None. All 63 test cases (60 carried over from HW02's `domain-testing.md`/`bva.md` + 3 EP sub-cases + 3 new UI-layer cases for FR-02) were automated. |

### 6.6 Why the AI missed these (summary)

Three recurring patterns explain most of §6.2/§6.3's findings:

1. **Trusting the design doc's field name over the SUT's actual markup.** TC-03's original case (and the first fix attempt for TC-03d's `note`) assumed the Username input was `type="email"` because `domain-testing.md` calls it "HTML5 `type=email` validation" — nobody had actually read `Login.jsx:30` to confirm. The field is `type="text"`; the whole premise of a browser-diff on email-format parsing was invented from the design doc's wording, not from the SUT. Reading source before writing an assertion or a rationale note would have caught this immediately.
2. **Copying an assertion shape without checking whether the field is reachable.** TC-05 shipped with no `db` check and a dead `api.hasToken` field survived one review pass — both come from pattern-matching against sibling cases (TC-06's shape) without tracing `assertApi`'s early-return-on-`requestSent:false` or `domain-testing.md#tc-05`'s explicit two-branch requirement. The fix required actually running the case against the SUT to observe which branch fires, not just re-reading the spec.
3. **Treating "record actual behavior, no fixed expected value" as license to skip explaining the choice.** FR-16's Gap Probe cases (TC-13/14/15/16) hard-code one branch out of several valid ones from the design doc, which is a legitimate and necessary step to make DDT work — but three of the four didn't carry a `note` justifying the choice, unlike the sibling TC-12/TC-18 in the same file that do. This is a documentation-discipline gap, not a logic error: the assert values were defensible, they just weren't explained.

None of these are model-capability limits — all three are review gaps (accepting a plausible-looking case without independently verifying it against the SUT or the full design doc). Feed this into §7 of [_AI_Audit_Report.md](%5BAI-02%5D_AI_Audit_Report.md) and into §12 (AI Critique) below.

---

## 7. Defects Found

> Genuine defects revealed by failing assertions. Full entries (repro, expected/actual, screenshot) in [bugs/BUG_REPORT.md](bugs/BUG_REPORT.md), cross-linked to GitHub Issues.

| Bug ID | Feature | Title | Severity | GitHub Issue |
| ------ | ------- | ----- | -------- | ------------- |
| BUG-02-001 | FR-02 | Invalid email format is not rejected client-side | Medium | [#13](https://github.com/lhlam2515/software-testing/issues/13) |
| BUG-02-003 | FR-02 | Failed login attempts counter increments by 2 instead of 1 | High | [#15](https://github.com/lhlam2515/software-testing/issues/15) |
| BUG-02-005 | FR-02 | Password field is not masked (`type="text"` instead of `type="password"`) | Medium | [#35](https://github.com/lhlam2515/software-testing/issues/35) |
| BUG-02-006 | FR-02 | Locked-account rejection leaks a distinct HTTP status/message vs. wrong-password rejection | Medium | [#36](https://github.com/lhlam2515/software-testing/issues/36) |
| BUG-09-001 | FR-09 | Percent coupon formula produces a negative discount instead of a percentage discount | High | [#17](https://github.com/lhlam2515/software-testing/issues/17) |
| BUG-09-002 | FR-09 | `/api/apply-coupon` accepts requests with no authentication token at all | High | [#18](https://github.com/lhlam2515/software-testing/issues/18) |
| BUG-09-003 | FR-09 | `/api/apply-coupon` accepts an invalid/malformed JWT | High | [#19](https://github.com/lhlam2515/software-testing/issues/19) |
| BUG-09-004 | FR-09 | Fixed-amount coupon discount is not capped at the order total, producing a negative final amount | High | [#20](https://github.com/lhlam2515/software-testing/issues/20) |
| BUG-09-005 | FR-09 | Minimum order amount check uses strict greater-than instead of greater-than-or-equal | Medium | [#21](https://github.com/lhlam2515/software-testing/issues/21) |
| BUG-09-006 | FR-09 | Coupon code lookup is case-insensitive | Medium | [#22](https://github.com/lhlam2515/software-testing/issues/22) |
| BUG-09-007 | FR-09 | Checkout trusts a client-derived `total_amount` instead of recomputing it from the cart | High | [#30](https://github.com/lhlam2515/software-testing/issues/30) |
| BUG-16-001 | FR-16 | Admin-only CSV import route accepts a regular user's token | High | [#23](https://github.com/lhlam2515/software-testing/issues/23) |
| BUG-16-002 | FR-16 | `price > 0` is not validated during CSV import | High | [#24](https://github.com/lhlam2515/software-testing/issues/24) |
| BUG-16-003 | FR-16 | Import accepts a non-existent `category_id` | High | [#25](https://github.com/lhlam2515/software-testing/issues/25) |
| BUG-16-004 | FR-16 | Import does not enforce the 255-character `name` limit shared with FR-15 | Medium | [#26](https://github.com/lhlam2515/software-testing/issues/26) |
| BUG-16-005 | FR-16 | Admin UI does not enforce the `.csv` file extension | Low | [#27](https://github.com/lhlam2515/software-testing/issues/27) |

---

## 8. Multi-browser HTML Reports

| Feature | Chromium | Firefox | Edge |
| ------- | -------- | ------- | ------ |
| FR-02 | [report](artifacts/html-reports/FR-02/chromium/) | [report](artifacts/html-reports/FR-02/firefox/) | [report](artifacts/html-reports/FR-02/edge/) |
| FR-09 | [report](artifacts/html-reports/FR-09/chromium/) | [report](artifacts/html-reports/FR-09/firefox/) | [report](artifacts/html-reports/FR-09/edge/) |
| FR-16 | [report](artifacts/html-reports/FR-16/chromium/) | [report](artifacts/html-reports/FR-16/firefox/) | [report](artifacts/html-reports/FR-16/edge/) |

> Every report must show `Run by: 23127216` and an ISO timestamp — see [artifacts/html-reports/README.md](artifacts/html-reports/README.md).

---

## 9. Demo Video

| Field | Value |
| ----- | ----- |
| Link (unlisted YouTube, ≥ 5 min) | _TBD_ |
| Feature demonstrated end to end | _TBD_ |
| Fix narrated during the review | _TBD_ |
| Authorship evidence | `<Face-cam or terminal running whoami/hostname>` |

---

## 10. Agent Skill

> §7 — reusable Agent Skill for the data-driven, multi-browser automation workflow (script generation and maintenance). Source lives in [artifacts/skills/playwright-spec-generator/](artifacts/skills/playwright-spec-generator/).

| Field | Value |
| ----- | ----- |
| Skill name | `playwright-spec-generator` |
| What it automates | 9-phase pipeline that turns an existing test-case design (`domain-testing.md`/`bva.md`, or designed on the spot via the `domain-testing` skill) into a running Playwright + TypeScript suite: data-driven case file → reusable fixtures/Page Objects → UI-only spec skeleton → layered network + DB assertions → independent subagent review → fixes → final multi-browser run with a pass/fail/data-driven/reusable/DRY checklist. |
| Iteration | v0.1 was generalized directly from the FR-02 automation workflow run manually first in this homework (under the name `playwright-automation-pipeline`), then v0.2–v0.4 were each driven by a real gap found running the skill for real on FR-09. Renamed twice afterward as the name kept drifting from the scope: `automation-workflow` in v0.5, then `playwright-spec-generator` in v0.6 once "workflow" over-promised ownership of the whole test-automation lifecycle instead of just the code-generation step (see [artifacts/skills/playwright-spec-generator/CHANGELOG.md](artifacts/skills/playwright-spec-generator/CHANGELOG.md)) |
| Demo video (skill applied to a full feature) | _TBD_ |

---

## 11. Repository and Git History

| Field | Value |
| ----- | ----- |
| Public GitHub repository | [github.com/lhlam2515/software-testing](https://github.com/lhlam2515/software-testing) |
| Commits touching test-script files | _TBD (≥ 8 required; 4-day span requirement removed per TA update, 2026-08-10)_ |
| Git commit log | [assets/git-commit-log.txt](assets/git-commit-log.txt) |

---

## 12. AI Critique (200–300 words, Mandatory)

> Assignment §10. Must be written entirely by the student. Where was the AI wrong, biased,
> or incomplete? Why did it fail to catch the issue? What principle did you learn about
> collaborating with AI during this assignment?

_TBD_

---

## 13. AI Audit Report & Prompt Log

| Document | Location |
| -------- | -------- |
| AI Audit Report (mandatory appendix, §9) | [AI_Audit_Report.md](%5BAI-02%5D_AI_Audit_Report.md) |
| AI Use Disclosure Form | [AI_Disclosure_Form.md](%5BAI-03%5D_AI_Disclosure_Form.md) |
| Privacy & Responsible AI Use Checklist | [AI_Privacy_Checklist.md](%5BAI-05%5D_AI_Privacy_Checklist.md) |
| Full prompt log | [prompt_log.md](prompt_log.md) |

---

## 14. References

- ISTQB Foundation Level Syllabus (latest edition).
- Playwright documentation — Test Generator, Assertions, HTML Reporter, Multi-browser projects.
- Course slides: _Automation & Regression Testing (AI-First)_.
- Hardman, P. (2025). _A Post-AI Learning Taxonomy._
- Fuster Rabella, M. (2025). _OECD Education Working Paper No. 338._
- Anthropic (2025). _Building Reliable AI Test Agents_ — engineering blog.
