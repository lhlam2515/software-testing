# HW04 Bug Report

## Summary

The current Playwright evidence contains 17 failed test executions.

- Confirmed application bugs: 0
- Automation/test issues: 16
- Environment/infrastructure issues: 0
- Other/unclassified: 1

## Confirmed Application Bugs

No confirmed application defects were identified from the available Playwright evidence.

The failures observed in the report are attributable to automation assumptions, assertion timing, test-data mismatch, or navigation/state problems rather than proven SUT defects.

## Automation/Test Issues

### 1. FR-04 Personal profile management

#### 1.1 `updates profile with valid data: Nguyen Van A` - Chromium

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> updates profile with valid data: Nguyen Van A`
- Browser/project: Chromium
- Failure message: `expect(received).toBe(expected) // Object.is equality` with expected `"Cập nhật thành công!"` and received `""`
- Classification: Synchronization issue
- Evidence: `test-results/e2e-tests-profile-FR-04-Pe-d0442-ith-valid-data-Nguyen-Van-A-Chromium/error-context.md`
- Status: open

#### 1.2 `updates profile with valid data: Nguyen Van A` - Firefox

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> updates profile with valid data: Nguyen Van A`
- Browser/project: Firefox
- Failure message: same empty-dialog assertion failure
- Classification: Synchronization issue
- Evidence: `playwright-report/data/c60687b0bd570d22d71fe879abe3ec1e2d2d21a3.md`
- Status: open

#### 1.3 `updates profile with valid data: Nguyen Van A` - WebKit

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> updates profile with valid data: Nguyen Van A`
- Browser/project: WebKit
- Failure message: same empty-dialog assertion failure
- Classification: Synchronization issue
- Evidence: `playwright-report/data/0896e90409340155829177a5fb8b2db450217c9b.md`
- Status: open

#### 1.4 `updates profile with valid data: Tran Thi B` - Chromium

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> updates profile with valid data: Tran Thi B`
- Browser/project: Chromium
- Failure message: same empty-dialog assertion failure
- Classification: Synchronization issue
- Evidence: `test-results/e2e-tests-profile-FR-04-Pe-e7344--with-vali...-Chromium/error-context.md`
- Status: open

#### 1.5 `updates profile with valid data: Tran Thi B` - Firefox

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> updates profile with valid data: Tran Thi B`
- Browser/project: Firefox
- Failure message: same empty-dialog assertion failure
- Classification: Synchronization issue
- Evidence: `playwright-report/data/a4307809e99293550b41dfb3b9e348e59b1b0cc7.md`
- Status: open

#### 1.6 `updates profile with valid data: Tran Thi B` - WebKit

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> updates profile with valid data: Tran Thi B`
- Browser/project: WebKit
- Failure message: same empty-dialog assertion failure
- Classification: Synchronization issue
- Evidence: `playwright-report/data/3ae180d6ac7ce187de2d9918fa4d6efcc74b8350.md`
- Status: open

### 2. FR-04 Personal profile management

#### 2.1 `allows saving shipping address changes` - Chromium

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> allows saving shipping address changes`
- Browser/project: Chromium
- Failure message: expected success dialog text, but the profile page showed phone-number validation behavior instead
- Classification: Test-data issue
- Evidence: `playwright-report/data/f9b10c508c727673ad05c79aabe7744ff18b5bfc.md`
- Status: open

#### 2.2 `allows saving shipping address changes` - Firefox

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> allows saving shipping address changes`
- Browser/project: Firefox
- Failure message: same validation-related mismatch
- Classification: Test-data issue
- Evidence: `playwright-report/data/49a19c7021d2526db7c853fc300e97a19a95e40e.md`
- Status: open

#### 2.3 `allows saving shipping address changes` - WebKit

- Test: `e2e-tests/profile.spec.ts >> FR-04 Personal profile management >> allows saving shipping address changes`
- Browser/project: WebKit
- Failure message: same validation-related mismatch
- Classification: Test-data issue
- Evidence: `playwright-report/data/b29851b98aac0291cd82003fecd5119e08bfa866.md`
- Status: open

## Other / Unclassified

### 3. FR-08 Checkout

#### 3.1 `shows cart item iPhone 15 Pro Max` - WebKit

- Test: `e2e-tests/checkout.spec.ts >> FR-08 Checkout >> shows cart item iPhone 15 Pro Max`
- Browser/project: WebKit
- Failure message: `expect(locator).toBeVisible() failed` for the `Giỏ Hàng` heading
- Classification: Authentication/setup issue
- Evidence: `test-results/e2e-tests-checkout-FR-08-C-78002-cart-item-iPhone-15-Pro-Max-WebKit/error-context.md`
- Status: open

#### 3.2 `shows cart item Samsung Galaxy S24 Ultra` - WebKit

- Test: `e2e-tests/checkout.spec.ts >> FR-08 Checkout >> shows cart item Samsung Galaxy S24 Ultra`
- Browser/project: WebKit
- Failure message: `expect(page).toHaveURL(expected) failed`, expected `/checkout`, received `/login`
- Classification: Authentication/setup issue
- Evidence: `test-results/e2e-tests-checkout-FR-08-C-856e0-em-Samsung-Galaxy-S24-Ultra-WebKit/error-context.md`
- Status: open

#### 3.3 `applies coupon scenario INVALIDCODE` - WebKit

- Test: `e2e-tests/checkout.spec.ts >> FR-08 Checkout >> applies coupon scenario INVALIDCODE`
- Browser/project: WebKit
- Failure message: `expect(page).toHaveURL(expected) failed`, expected `/checkout`, received `/login`
- Classification: Authentication/setup issue
- Evidence: `test-results/e2e-tests-checkout-FR-08-C-101dd-coupon-scenario-INVALIDCODE-WebKit/error-context.md`
- Status: open

#### 3.4 `shows coupon error for invalid code` - WebKit

- Test: `e2e-tests/checkout.spec.ts >> FR-08 Checkout >> shows coupon error for invalid code`
- Browser/project: WebKit
- Failure message: `expect(page).toHaveURL(expected) failed`, expected `/checkout`, received `/login`
- Classification: Authentication/setup issue
- Evidence: `test-results/e2e-tests-checkout-FR-08-C-39a28-upon-error-for-invalid-code-WebKit/error-context.md`
- Status: open

#### 3.5 `shows coupon result area for valid code` - WebKit

- Test: `e2e-tests/checkout.spec.ts >> FR-08 Checkout >> shows coupon result area for valid code`
- Browser/project: WebKit
- Failure message: `expect(page).toHaveURL(expected) failed`, expected `/checkout`, received `/login`
- Classification: Authentication/setup issue
- Evidence: `test-results/e2e-tests-checkout-FR-08-C-6f41b--result-area-for-valid-code-WebKit/error-context.md`
- Status: open

#### 3.6 `shows checkout button` - WebKit

- Test: `e2e-tests/checkout.spec.ts >> FR-08 Checkout >> shows checkout button`
- Browser/project: WebKit
- Failure message: `expect(page).toHaveURL(expected) failed`, expected `/checkout`, received `/login`
- Classification: Authentication/setup issue
- Evidence: `test-results/e2e-tests-checkout-FR-08-Checkout-shows-checkout-button-WebKit/error-context.md`
- Status: open

#### 3.7 `updates total amount field` - WebKit

- Test: `e2e-tests/checkout.spec.ts >> FR-08 Checkout >> updates total amount field`
- Browser/project: WebKit
- Failure message: `expect(page).toHaveURL(expected) failed`, expected `/checkout`, received `/login`
- Classification: Authentication/setup issue
- Evidence: `test-results/e2e-tests-checkout-FR-08-Checkout-updates-total-amount-field-WebKit/error-context.md`
- Status: open

#### 3.8 `supports coupon application button state` - WebKit

- Test: `e2e-tests/checkout.spec.ts >> FR-08 Checkout >> supports coupon application button state`
- Browser/project: WebKit
- Failure message: `expect(page).toHaveURL(expected) failed`, expected `/checkout`, received `/login`
- Classification: Authentication/setup issue
- Evidence: `test-results/e2e-tests-checkout-FR-08-C-51694-on-application-button-state-WebKit/error-context.md`
- Status: open

## Environment / Infrastructure Issues

No environment or infrastructure issues were confirmed from the available evidence.

## Failure Classification Summary

| Category | Number |
| --- | ---: |
| Confirmed application bugs | 0 |
| Automation/test issues | 16 |
| Environment/infrastructure issues | 0 |
| Other/unclassified | 1 |
| Total failed tests | 17 |

## Repro Notes

The failures can be reproduced by running the existing Playwright suites in `homeworks/HW04` against the current application state and test data. The evidence files in `playwright-report/data/` and `test-results/` show the failure messages and the test locations for each issue listed above.
