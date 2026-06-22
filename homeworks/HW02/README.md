# HW02 — Domain Testing on EShop

## Student Information

- **Student name**: Lê Hoàng Lâm
- **Student ID**: 23127216
- **Group**: 02
- **Class / Cohort**: 23KTPM1
- **Github Repository**: [github.com/lhlam2515/software-testing](https://github.com/lhlam2515/software-testing)

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
| Total test cases designed | — |
| Total test cases executed | — |
| Passed | — |
| Failed | — |
| Not yet executed | — |
| Bugs found | — |

### Per-Feature Breakdown

| Feature | TC Designed | TC Executed | Passed | Failed | Not Run | Bugs |
| ------- | ----------- | ----------- | ------ | ------ | ------- | ---- |
| FR-02 — Login and account lockout | — | — | — | — | — | — |
| FR-09 — Discount coupons | — | — | — | — | — | — |
| FR-16 — Product import from CSV | — | — | — | — | — | — |
| FR-20 — Cancel order (Mobile) | — | — | — | — | — | — |
| **Total** | — | — | — | — | — | — |

### Requirements Traceability Matrix (RTM)

| Requirement | TC IDs | Status |
| ----------- | ------ | ------ |
| FR-02: Login success (valid credentials) | TC-02-xx | — |
| FR-02: Login failure counter (< 3 attempts) | TC-02-xx | — |
| FR-02: Account lockout (≥ 3 failures) | TC-02-xx | — |
| FR-02: Lockout release after 30s | TC-02-xx | — |
| FR-09: Valid coupon — percent type | TC-09-xx | — |
| FR-09: Valid coupon — fixed type | TC-09-xx | — |
| FR-09: Coupon not found / inactive | TC-09-xx | — |
| FR-09: Coupon expired | TC-09-xx | — |
| FR-09: Below min_order_amount | TC-09-xx | — |
| FR-09: Unauthenticated user | TC-09-xx | — |
| FR-09: Exceeded max_uses_per_user | TC-09-xx | — |
| FR-16: Valid CSV — all rows succeed | TC-16-xx | — |
| FR-16: Invalid file extension | TC-16-xx | — |
| FR-16: Missing / wrong header | TC-16-xx | — |
| FR-16: Row with empty name → full rollback | TC-16-xx | — |
| FR-16: Row with invalid price → full rollback | TC-16-xx | — |
| FR-20: Cancel when `pending` | TC-20-xx | — |
| FR-20: Cancel when `confirmed` | TC-20-xx | — |
| FR-20: Cancel attempt when `shipping` | TC-20-xx | — |
| FR-20: Cancel attempt when `delivered` | TC-20-xx | — |
| FR-20: Cancel attempt when `canceled` | TC-20-xx | — |

---

## Self-assessment

| **No.** | **Criteria** | **Grade** | **Self-Assessed Grade** |
| --- | --- | --- | --- |
| **1** | FR-02 — Login and account lockout (Domain + Boundary) | 25 |  |
| **2** | FR-09 — Discount coupons (Domain + Boundary) | 25 |  |
| **3** | FR-16 — Product import from CSV (Domain + Boundary) | 25 |  |
| **4** | FR-20 — Cancel order (Mobile) (Domain + Boundary) | 15 |  |
| **5** | Agent Skills | 10 |  |
|  | **Total** | **100** |  |

---

## Demo Videos

| # | Feature | Skill Demonstrated | Link |
| - | ------- | ------------------ | ---- |
| 1 | FR-02 / FR-09 / FR-16 / FR-20 | Domain Testing & BVA Agent Skill | — |
