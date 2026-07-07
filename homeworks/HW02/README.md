# HW02 — Domain Testing on EShop

## Student Information

- **Student name**: Lê Hoàng Lâm
- **Student ID**: 23127216
- **Group**: 02
- **Class / Cohort**: 23KTPM1
- **Github Repository**: [github.com/lhlam2515/software-testing](https://github.com/lhlam2515/software-testing)

---

## Submission Contents

| Document | Description |
| -------- | ------------ |
| [REPORT.md](./REPORT.md) | Main report — Domain Testing + Boundary Value Analysis + AI Gap Analysis per selected feature |
| [BUG_REPORT.md](./BUG_REPORT.md) | Consolidated bug report, cross-linked to GitHub Issues |
| [prompt_log.md](./prompt_log.md) | Full AI prompt log with timestamps |
| [[AI-02]_AI_Audit_Report.md](./%5BAI-02%5D_AI_Audit_Report.md) | Per-artifact AI audit (prompt, output, verdict, reasoning, student fix) |
| [[AI-03]_AI_Disclosure_Form.md](./%5BAI-03%5D_AI_Disclosure_Form.md) | Mandatory AI usage disclosure |
| [[AI-04]_AI_Reflective_Statement.md](./%5BAI-04%5D_AI_Reflective_Statement.md) | AI critique (200-300 words) and reflective statement |
| [[AI-05]_AI_Privacy_Checklist.md](./%5BAI-05%5D_AI_Privacy_Checklist.md) | AI privacy and responsible-use checklist |
| [[AI-06]_AI_Student_Acknowledgement.md](./%5BAI-06%5D_AI_Student_Acknowledgement.md) | Signed student acknowledgement |
| [artifacts/](./artifacts/) | Domain Testing / BVA skill source, per-feature execution logs, and screenshots |
| [assets/](./assets/) | GitHub Issue screenshots per bug, signature image, and commit log |

---

## Selected Features

| Pool | Feature ID | Feature Name | Description |
| ---- | ---------- | ------------ | ----------- |
| A | **FR-02** | Login and account lockout | Login with email/password; counter-based lockout after 3 consecutive failures (30s); JWT token on success |
| B | **FR-09** | Discount coupons | 5-condition coupon validation (exists, not expired, min amount, logged in, usage limit); percent and fixed discount types |
| C | **FR-16** | Product import from CSV | CSV file upload with format validation (RFC 4180), row-level validation (name, price), atomic all-or-nothing transaction |
| D | **FR-20** | Cancel order (Mobile) | Cancel order on mobile app; only allowed when status is `pending` or `confirmed`; forbidden from `shipping`, `delivered`, `canceled` |

---

## Test Summary

### Overview

| Metric | Count |
| ------ | ----- |
| Features under test | 4 |
| Total test cases designed | 71 |
| Total test cases executed | 71 / 71 |
| Passed | 42 |
| Passed with deviation | 4 |
| Failed | 25 |
| Not yet executed | 0 |
| Bugs found | 18 |

*"Passed with deviation" = PASS on the behavior under test, with an unrelated defect (already logged against a different TC) polluting the observed output.*

### Per-Feature Breakdown

| Feature | TC Designed | TC Executed | Passed | Deviation | Failed | Not Run | Bugs |
| ------- | ----------- | ----------- | ------ | --------- | ------ | ------- | ---- |
| FR-02 — Login and account lockout | 12 | 12 | 10 | 0 | 2 | 0 | 4 |
| FR-09 — Discount coupons | 21 | 21 | 11 | 2 | 8 | 0 | 7 |
| FR-16 — Product import from CSV | 24 | 24 | 11 | 1 | 12 | 0 | 5 |
| FR-20 — Cancel order (Mobile) | 14 | 14 | 10 | 1 | 3 | 0 | 2 |
| **Total** | **71** | **71** | **42** | **4** | **25** | **0** | **18** |

### Requirements Traceability Matrix (RTM)

| Requirement | TC IDs | Status |
| ----------- | ------ | ------ |
| FR-02: Login success (valid credentials) | TC-01, TC-BVA-02, TC-BVA-04, TC-BVA-05 | ✅ Pass |
| FR-02: Client-side required-field validation | TC-02, TC-05 | ✅ Pass |
| FR-02: Invalid email format rejected | TC-03 | ❌ Fail — BUG-02-001 |
| FR-02: Unregistered email (no user enumeration) | TC-04 | ✅ Pass (BUG-02-002 noted, low severity) |
| FR-02: Login failure counter (< 3 attempts) | TC-06 | ❌ Fail — BUG-02-003 |
| FR-02: Account lockout (≥ 3 failures) | TC-07, TC-BVA-01 | ✅ Pass (BUG-02-003/004 noted, does not affect this verdict) |
| FR-02: Lockout release after 30s | TC-BVA-03, TC-BVA-04, TC-BVA-05 | ✅ Pass (BUG-02-004 duration defect noted separately) |
| FR-09: Valid coupon — percent type | TC-01 | ❌ Fail — BUG-09-001 |
| FR-09: Valid coupon — fixed type | TC-02 | ✅ Pass |
| FR-09: Coupon not found / inactive | TC-03, TC-04 | ✅ Pass |
| FR-09: Coupon code matching is case-sensitive | TC-05 | ❌ Fail — BUG-09-006 |
| FR-09: Coupon expired boundary | TC-06, TC-BVA-07 | ✅ Pass |
| FR-09: Coupon not yet expired (upper boundary) | TC-BVA-08 | ✅ Pass (with deviation) |
| FR-09: Below min_order_amount (off-point, correctly rejected) | TC-07, TC-BVA-01 | ✅ Pass |
| FR-09: min_order_amount ON point (strict > instead of >=) | TC-12, TC-BVA-02 | ❌ Fail — BUG-09-005 |
| FR-09: Above min_order_amount (off-point, correctly accepted) | TC-BVA-03 | ✅ Pass (with deviation) |
| FR-09: Unauthenticated / invalid-token user | TC-08, TC-09 | ❌ Fail — BUG-09-002, BUG-09-003 |
| FR-09: Exceeded max_uses_per_user | TC-10, TC-BVA-04, TC-BVA-05, TC-BVA-06 | ✅ Pass |
| FR-09: Fixed discount capped at order total | TC-11 | ❌ Fail — BUG-09-004 |
| FR-09: Server recomputes total_amount from cart (no client trust) | TC-13 | ❌ Fail — BUG-09-007 |
| FR-16: Valid CSV — all rows succeed | TC-01, TC-02 | ✅ Pass |
| FR-16: Authorization (JWT required, Admin role required) | TC-03, TC-04 | TC-03 ✅ Pass; TC-04 ❌ Fail — BUG-16-001 |
| FR-16: Missing `products` key / empty array | TC-05, TC-13 | ✅ Pass |
| FR-16: Row with empty/missing name → full rollback | TC-06, TC-07 | ✅ Pass |
| FR-16: Row with invalid price → full rollback | TC-08, TC-09, TC-10, TC-11, TC-12, TC-18, TC-BVA-01 | ❌ Fail — BUG-16-002 |
| FR-16: Row with valid price boundary (price = 1) | TC-BVA-02 | ✅ Pass |
| FR-16: `name` length boundary (≤ 255 valid) | TC-BVA-03, TC-BVA-04 | ✅ Pass |
| FR-16: `name` length boundary (> 255 rejected) | TC-14, TC-BVA-05 | ❌ Fail — BUG-16-004 |
| FR-16: Invalid `category_id` | TC-15 | ❌ Fail — BUG-16-003 |
| FR-16: `price` as numeric string (Gap-Probe) | TC-16 | ✅ Pass (with deviation) |
| FR-16: Response schema probe | TC-17 | ✅ Pass |
| FR-16: File extension enforcement (Gap-Probe) | TC-19 | ❌ Fail — BUG-16-005 |
| FR-20: Cancel when `pending` | TC-01, TC-BVA-03 | ✅ Pass |
| FR-20: Cancel when `confirmed` | TC-02, TC-BVA-01 | ✅ Pass |
| FR-20: Cancel attempt when `shipping` | TC-07, TC-BVA-02 | ❌ Fail — BUG-20-001 |
| FR-20: Cancel attempt when `delivered` | TC-03, TC-BVA-04 | ✅ Pass |
| FR-20: Cancel attempt when `canceled` | TC-04 | ✅ Pass |
| FR-20: Cancel without valid authentication | TC-05 | ✅ Pass |
| FR-20: Cancel a non-existent order | TC-06 | ✅ Pass |
| FR-20: Cancel another user's order (cross-user isolation, Gap-Probe) | TC-08 | ✅ Pass |
| FR-20: Confirmation step before cancel (Gap-Probe) | TC-09 | ✅ Pass (with deviation) |
| FR-20: Status label color distinction across states (Gap-Probe) | TC-10 | ❌ Fail — BUG-20-002 |

---

## Self-assessment

| **No.** | **Criteria** | **Grade** | **Self-Assessed Grade** |
| --- | --- | --- | --- |
| **1** | FR-02 — Login and account lockout (Domain + Boundary) | 25 | 24 |
| **2** | FR-09 — Discount coupons (Domain + Boundary) | 25 | 24 |
| **3** | FR-16 — Product import from CSV (Domain + Boundary) | 25 | 23 |
| **4** | FR-20 — Cancel order (Mobile) (Domain + Boundary) | 15 | 14 |
| **5** | Agent Skills | 10 | 10 |
|  | **Total** | **100** | **95** |

---

## Demo Videos

*Note: the demo uses FR-01 (Account registration), not one of the four graded features (FR-02/FR-09/FR-16/FR-20). FR-01 had never been run through the skill before recording, so the session shown is a fresh, unedited end-to-end run rather than a re-enactment of already-graded artifacts.*

| # | Feature | Skill Demonstrated | Link |
| - | ------- | ------------------ | ---- |
| 1 | FR-01 | Domain Testing & BVA Agent Skill | [Demo Video](https://youtu.be/qMp9DU0MQMc) |
