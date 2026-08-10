# HW04 Bug Report

## Summary

The current Playwright evidence contains 12 failed test executions.

- Confirmed application bugs: 0
- Automation/test issues: 12
- Environment/infrastructure issues: 0
- Other/unclassified: 0

## Confirmed Application Bugs

No confirmed application defects were identified from the available Playwright evidence.

The failures observed in the report are attributable to automation assumptions, assertion timing, or test-state/setup problems rather than proven SUT defects.

## Automation/Test Issues

### 1. FR-04 Personal profile management

#### 1.1 `updates profile with valid data: Nguyen Van A` - Chromium

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> updates profile with valid data: Nguyen Van A`
- Browser: Chromium
- Failure: expected success dialog text, but `dialogMessage` was empty
- Root cause: assertion depends on a dialog event that did not fire or was not captured
- Evidence: `test-results/e2e-tests-profile-FR-04-Pe-d0442-ith-valid-data-Nguyen-Van-A-Chromium/error-context.md`
- Recommended correction: wait for the actual UI confirmation mechanism, or assert the saved profile state instead of a synchronous dialog string
- Status: open

#### 1.2 `updates profile with valid data: Nguyen Van A` - Firefox

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> updates profile with valid data: Nguyen Van A`
- Browser: Firefox
- Failure: same empty-dialog-message assertion failure
- Root cause: same test synchronization issue as Chromium
- Evidence: `playwright-report/data/cc7ab69d5bd7134feb35394dbfc31bf8fef65a9b.md`
- Recommended correction: same as above
- Status: open

#### 1.3 `updates profile with valid data: Nguyen Van A` - WebKit

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> updates profile with valid data: Nguyen Van A`
- Browser: WebKit
- Failure: same empty-dialog-message assertion failure
- Root cause: same test synchronization issue as Chromium
- Evidence: `playwright-report/data/4c155e2de585269a821d846c1eda6ab4c91e7f7b.md`
- Recommended correction: same as above
- Status: open

#### 1.4 `updates profile with valid data: Tran Thi B` - Chromium

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> updates profile with valid data: Tran Thi B`
- Browser: Chromium
- Failure: expected success dialog text, but `dialogMessage` was empty
- Root cause: assertion depends on a dialog event that did not fire or was not captured
- Evidence: `test-results/e2e-tests-profile-FR-04-Pe-e7344--with-valid-data-Tran-Thi-B-Chromium/error-context.md`
- Recommended correction: wait for the actual UI confirmation mechanism, or assert the saved profile state instead of a synchronous dialog string
- Status: open

#### 1.5 `updates profile with valid data: Tran Thi B` - Firefox

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> updates profile with valid data: Tran Thi B`
- Browser: Firefox
- Failure: same empty-dialog-message assertion failure
- Root cause: same test synchronization issue as Chromium
- Evidence: `playwright-report/data/3b25bacd65a406e291e313b7cd02b4cbc14a670c.md`
- Recommended correction: same as above
- Status: open

#### 1.6 `updates profile with valid data: Tran Thi B` - WebKit

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> updates profile with valid data: Tran Thi B`
- Browser: WebKit
- Failure: same empty-dialog-message assertion failure
- Root cause: same test synchronization issue as Chromium
- Evidence: `playwright-report/data/860f6f45a5eda915d4536e2800c648e6ad6ddce4.md`
- Recommended correction: same as above
- Status: open

#### 1.7 `allows saving shipping address changes` - Chromium

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> allows saving shipping address changes`
- Browser: Chromium
- Failure: expected success dialog text, but received a phone-number validation error
- Root cause: test data/setup issue; the test clicked update with an invalid phone value (`0912345678`), but the UI expects 9-10 digits and the current value produced validation failure
- Evidence: `playwright-report/data/dff74902cfab97162371842dc5e12bccfe7252cd.md`
- Recommended correction: use a phone value that satisfies the application's validation rules before asserting success
- Status: open

#### 1.8 `allows saving shipping address changes` - Firefox

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> allows saving shipping address changes`
- Browser: Firefox
- Failure: same validation-message mismatch
- Root cause: same test data/setup issue as Chromium
- Evidence: `playwright-report/data/8dd2dc502dd8e50755718be275c92b4ce0842cfa.md`
- Recommended correction: same as above
- Status: open

#### 1.9 `allows saving shipping address changes` - WebKit

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> allows saving shipping address changes`
- Browser: WebKit
- Failure: same validation-message mismatch
- Root cause: same test data/setup issue as Chromium
- Evidence: `playwright-report/data/8c26f05c48f409d49326316b6a5d2a0838dd52c2.md`
- Recommended correction: same as above
- Status: open

### 2. FR-08 Checkout

#### 2.1 `updates total amount field`

- Test: `e2e-tests/checkout.spec.ts >> FR-08 Checkout >> updates total amount field`
- Browser: not explicitly identified in the file name, but the failure artifact is tied to the checkout suite run
- Failure: expected navigation to `/checkout`, but the page stayed on `/login`
- Root cause: authentication/navigation setup issue; the test assumes the flow is already authenticated and on the checkout path, but the report shows the app redirected to login
- Evidence: `playwright-report/data/0dca452f73205681f39bf32ecfdc4161de788941.md`
- Recommended correction: stabilize login/session setup and wait for the correct authenticated state before asserting the checkout route
- Status: open

#### 2.2 `applies coupon scenario SAVE10`

- Test: `e2e-tests/checkout.spec.ts >> FR-08 Checkout >> applies coupon scenario SAVE10`
- Browser: WebKit
- Failure: expected navigation to `/checkout`, but the page stayed on `/login`
- Root cause: authentication/navigation setup issue
- Evidence: `test-results/e2e-tests-checkout-FR-08-C-8447e-lies-coupon-scenario-SAVE10-WebKit/error-context.md`
- Recommended correction: same as above
- Status: open

#### 2.3 `applies coupon scenario BIGBUY`

- Test: `e2e-tests/checkout.spec.ts >> FR-08 Checkout >> applies coupon scenario BIGBUY`
- Browser: WebKit
- Failure: expected navigation to `/checkout`, but the page stayed on `/login`
- Root cause: authentication/navigation setup issue
- Evidence: `test-results/e2e-tests-checkout-FR-08-C-03db6-lies-coupon-scenario-BIGBUY-WebKit/error-context.md`
- Recommended correction: same as above
- Status: open

## Environment / Infrastructure Issues

No environment or infrastructure issues were confirmed from the available evidence.

## Failure Classification Summary

| Category | Number |
| --- | ---: |
| Confirmed application bugs | 0 |
| Automation/test issues | 12 |
| Environment/infrastructure issues | 0 |
| Other/unclassified | 0 |
| Total failed tests | 12 |

## Repro Notes

The failures can be reproduced by running the existing Playwright suites in `homeworks/HW04` against the current application state and test data. The evidence files in `playwright-report/data/` and `test-results/` show the failure messages and the test locations for each issue listed above.
