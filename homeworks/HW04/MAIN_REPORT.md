# HW04 Main Report

## A. Assignment / Project Overview

This HW04 submission automates three web features from the EShop SUT:

- FR-04 Personal profile management
- FR-08 Checkout
- FR-18 Order management (admin)

The automation uses Playwright with data-driven tests. The repository contains:

- `e2e-tests/profile.spec.ts`
- `e2e-tests/checkout.spec.ts`
- `e2e-tests/admin-orders.spec.ts`
- `e2e-tests/test-data/profile.json`
- `e2e-tests/test-data/checkout.json`
- `e2e-tests/test-data/admin-orders.json`

Playwright configuration is present in:

- `playwright.config.js`
- `playwright.config.ts`

Relevant run commands from `package.json`:

- `npm run test:e2e`
- `npm run test:e2e:chromium`
- `npm run test:e2e:firefox`
- `npm run test:e2e:webkit`

## B. Automation Report

### Automated features

| Feature | Spec file | Data file |
| --- | --- | --- |
| FR-04 Personal profile management | `e2e-tests/profile.spec.ts` | `e2e-tests/test-data/profile.json` |
| FR-08 Checkout | `e2e-tests/checkout.spec.ts` | `e2e-tests/test-data/checkout.json` |
| FR-18 Order management (admin) | `e2e-tests/admin-orders.spec.ts` | `e2e-tests/test-data/admin-orders.json` |

### Test cases automated

| Feature | Automated cases |
| --- | ---: |
| FR-04 Personal profile management | 15 |
| FR-08 Checkout | 14 |
| FR-18 Order management (admin) | 12 |
| Total | 41 |

### Execution evidence

The Playwright HTML report is available at `playwright-report/index.html`. The latest execution artifacts show:

- 41 test cases defined across 3 suites
- 126 browser-executions inferred from 41 tests across 3 browser projects
- 114 passed
- 12 failed
- 0 skipped seen in the available artifacts

The browser projects configured in `playwright.config.js` are:

- Chromium
- Firefox
- WebKit

The browser projects configured in `playwright.config.ts` are the same three browsers, though the main run evidence in this workspace is the HTML report under `playwright-report/`.

### Test data and assertion patterns

Test data files:

- `e2e-tests/test-data/profile.json`
- `e2e-tests/test-data/checkout.json`
- `e2e-tests/test-data/admin-orders.json`

Assertion patterns visible in the tests:

- `toBeVisible()`
- `toHaveURL()`
- `toHaveValue()`
- `toBeDisabled()`
- `toBeEditable()`
- `not.toHaveValue()`
- `toContain()`

### Browser/project coverage

The repository configuration covers 3 browsers and 9 feature-browser combinations in the assignment sense:

- 3 features x 3 browsers = 9 browser runs

The failure artifacts explicitly show executions on Chromium, Firefox, and WebKit.

## C. AI-Generated Script Review

The three spec files look like AI-assisted first drafts that were then adapted into a working suite structure: each feature is organized with helper functions, data files, loops over test data, and multiple assertion styles. That is a good starting point, but the execution evidence shows several assumptions that a human reviewer still needs to challenge.

### FR-04 Personal profile management

What AI did well:

- It produced a data-driven profile suite with separate test data in `profile.json`.
- It covered more than the minimum number of cases: valid updates, invalid phone inputs, order history, and field-state checks.
- It reused helpers for registration/login, order seeding, and locating profile inputs, which keeps the test body readable.

Gaps and problems:

- The valid profile-update tests rely on `page.once('dialog', ...)` and then immediately assert `dialogMessage`. The report shows the message stayed empty in the two visible valid-profile failures.
- The same suite mixes backend setup with UI actions, but the failure evidence shows the UI state after update is not being verified in a stable way.
- The selectors are functional, but several are fragile because they depend on translated label text and `xpath=following-sibling::...` chains instead of a more stable locator strategy.

Human review/correction needed:

- A tester should replace the immediate dialog-string assertion with a wait for the actual confirmation behavior, or verify the persisted profile state after save.
- The current failures are inconclusive for the product behavior because the test stops at the assertion capture problem rather than proving the update flow is broken.

### FR-08 Checkout

What AI did well:

- It created a reusable checkout flow with a login helper, cart navigation helper, and a small data set for coupon scenarios.
- It exercises positive and negative coupon cases and checks several checkout UI states.
- It uses data-driven iteration over `checkout.json`, which is aligned with the assignment requirement.

Gaps and problems:

- `goToCheckout()` assumes that clicking the checkout button will always land on `/checkout`, but the failure evidence shows the page remains on `/login`.
- Because the suite starts from a login helper, the tests appear to expect authentication to persist. The report indicates that assumption is not holding during execution.
- At least one test, `updates total amount field`, fails before it reaches the intended field assertion because the checkout navigation never completes. That makes the result inconclusive for the field itself.

Human review/correction needed:

- The setup should be checked for session persistence and the navigation should wait for the actual authenticated checkout state before asserting route changes.
- The current failure pattern suggests the test is validating the wrong precondition first, so the checkout assertions are not yet trustworthy as feature verification.

### FR-18 Order management (admin)

What AI did well:

- It produced a more complete admin suite with login, order seeding, state transitions, and visibility checks.
- It uses request-based setup to create orders in known states, which is a sensible pattern for admin workflow testing.
- It includes several coverage points for order rows and buttons, not just a single happy path.

Gaps and problems:

- No failure evidence is present for this suite in the current report bundle, so the repository does not prove that all admin scenarios are stable.
- The quality of the admin suite is still only partially verifiable because the current report evidence does not show a completed pass/fail matrix for each test.
- Some assertions check table text and button visibility, which is useful, but they do not always prove a state transition occurred unless combined with stronger state verification.

Human review/correction needed:

- A reviewer should confirm whether the admin transition assertions are sufficient to prove the state machine behavior, or whether extra state checks are needed after each action.
- Because there are no visible failures here, this feature is the strongest of the three, but the absence of failures is not proof that the tests are perfect.

### Gap Analysis Table

| Area | AI-generated approach | Evidence/problem | Impact | Human review/correction | Status |
| --- | --- | --- | --- | --- | --- |
| Selectors | Relies on translated labels and `xpath=following-sibling::...` lookups in profile and checkout helpers | Fragile locator strategy visible in `profile.spec.ts` and `checkout.spec.ts` | Higher maintenance risk and possible selector breakage when the UI changes | Prefer role-, label-, or test-id-based locators where possible | Partial |
| Authentication | Uses helper-based login and assumes the session survives through checkout and profile flows | Checkout failures stay on `/login` after checkout click | Checkout assertions become inconclusive because the intended page is never reached | Verify authenticated state before asserting navigation, and wait for the real post-login route | Gap |
| Test data | Uses separate JSON files for profile, checkout, and admin cases | Profile data includes a phone value that triggers validation instead of a success path in one test | The saving shipping address case fails for data/setup reasons rather than proving the feature | Align test inputs with validation rules before asserting success | Partial |
| Assertions | Uses dialog-message equality checks and text-visibility checks | Profile success assertions capture an empty dialog message in the report | Weak synchronization makes the test fail before validating the intended behavior | Assert the actual UI confirmation or persisted state instead of a fragile captured string | Gap |
| Synchronization | Uses immediate assertions after click actions | Visible profile and checkout failures fail at the assertion boundary | Tests can fail before reaching the intended feature behavior | Add waits for the real application state change or confirmation element | Gap |
| Navigation/state | Assumes checkout flow reaches `/checkout` after clicking the payment button | Report shows `/login` instead of `/checkout` for checkout failures | The tests do not validate checkout behavior reliably | Check session/state setup and wait for the correct route transition | Gap |
| Data-driven testing | Uses loops over JSON data to generate multiple cases | Present and working in all three suites | Good coverage and readability | Keep the pattern, but pair it with stronger state assertions | Complete |
| Browser coverage | Configured for Chromium, Firefox, and WebKit in both Playwright configs | Report artifacts show failures across multiple browsers for profile and checkout | Cross-browser support exists, but reliability still varies by feature | Re-run and verify each feature-browser combination after fixing the setup issues | Complete |
| Error handling | Minimal explicit error handling; tests rely on direct Playwright assertions | Failures surface as assertion errors rather than clear feature-state checks | Harder to tell whether the feature or the test failed first | Add explicit precondition checks and clearer wait conditions | Partial |

Overall assessment:

- The AI-generated scripts provide useful initial coverage and are clearly better than a single generic ?one test per feature? draft.
- They are not trustworthy without human review.
- The most important AI errors are the fragile dialog assertion in FR-04, the incorrect navigation assumption in FR-08, and the data/setup mismatch that turns the shipping-address case into a validation failure instead of a save confirmation.
- The current failures mean parts of FR-04 and FR-08 are still not reliably validated end to end.
- Human review is necessary because the current suite structure is reasonable, but the execution evidence shows that several tests fail before proving the intended requirement.
## D. Test Results

| Metric | Result |
| -------------------- | -----: |
| Features | 3 |
| Test cases automated | 41 |
| Test cases executed | 126 |
| Passed | 114 |
| Failed | 12 |
| Skipped | 0 |
| Browser runs | 9 |
| Bugs | 0 confirmed application bugs |

## E. Bugs and Failures

The current evidence does not confirm an application defect.

Observed failures:

- FR-04 valid profile update assertions fail because the expected dialog message is empty.
- FR-08 checkout navigation assertions fail because the flow remains on `/login` instead of reaching `/checkout`.

These failures are best classified as:

- test synchronization / assertion issues
- test setup or application-state issues
- potentially incorrect assumptions about the UI flow

## F. Conclusion

The repository contains a substantial Playwright automation submission for three web features with separate JSON data and HTML report evidence. The strongest parts are the feature coverage, data-driven structure, and browser configuration. The biggest human-review need is in the profile and checkout flows, where the current tests make assumptions about dialogs and navigation that the report evidence does not support.

The submission still needs manual completion for the AI audit appendix, AI critique, demo video link, student ID banner evidence, and commit log.
