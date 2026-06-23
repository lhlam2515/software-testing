# FR-02 — Login & Account Lockout: Boundary Value Analysis

## 1. Identified Boundaries

### Boundary 1: `fail_counter` — lockout threshold

| Partition | Range | Boundary |
| --------- | ----- | -------- |
| No lockout | 0 ≤ counter ≤ 2 | LB = 0, UB = 2 |
| Lockout | counter ≥ 3 | LB = 3 |

**Critical boundary: counter = 2 (last allowed) vs counter = 3 (lockout triggered)**

### Boundary 2: `lockout_timer` — 30-second release

| Partition | Range | Boundary |
| --------- | ----- | -------- |
| Still locked | 0 ≤ timer < 30s | UB = 29s |
| Unlocked | timer ≥ 30s | LB = 30s |

**Critical boundary: timer = 29s (still locked) vs timer = 30s (released)**

---

## 2. BVA Test Cases

### Boundary 1: fail_counter (3-value BVA)

| TC ID | counter value | Point | Login Attempt | Expected Result |
| ----- | ------------- | ----- | ------------- | --------------- |
| TC-02-BVA-01 | 0 | Nominal valid | Sai password lần 1 | counter → 1; error message |
| TC-02-BVA-02 | 1 | LB+1 | Sai password lần 2 | counter → 2; error message |
| TC-02-BVA-03 | 2 | UB (no-lock) | Sai password lần 3 (trigger) | counter → 3; **tài khoản bị khóa** |
| TC-02-BVA-04 | 3 | LB (lock) | Thử đăng nhập khi bị khóa | Error: tài khoản bị khóa (30s) |
| TC-02-BVA-05 | 3 | LB (lock) | Thử với đúng password khi bị khóa | Error: tài khoản vẫn bị khóa |

### Boundary 2: lockout_timer (2-value BVA)

| TC ID | timer | Point | Expected Result |
| ----- | ----- | ----- | --------------- |
| TC-02-BVA-06 | 29s | UB−1 (before release) | Error: tài khoản đang bị khóa |
| TC-02-BVA-07 | 30s | UB / LB release | Đăng nhập thành công được (nếu đúng credentials) |
| TC-02-BVA-08 | 31s | UB+1 (after release) | Đăng nhập thành công được |

---

## 3. Execution Log

| TC ID | Executed? | Actual Result | Pass/Fail | Bug ID |
| ----- | --------- | ------------- | --------- | ------ |
| TC-02-BVA-01 | | | | |
| TC-02-BVA-02 | | | | |
| TC-02-BVA-03 | | | | |
| TC-02-BVA-04 | | | | |
| TC-02-BVA-05 | | | | |
| TC-02-BVA-06 | | | | |
| TC-02-BVA-07 | | | | |
| TC-02-BVA-08 | | | | |
