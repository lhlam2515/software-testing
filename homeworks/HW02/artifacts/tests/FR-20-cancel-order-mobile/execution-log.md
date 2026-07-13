# FR-20 - Execution Log

**Feature:** FR-20 - Cancel Order (Mobile)
**Tester:** Le Hoang Lam (23127216)
**SUT:** EShop mobile web `http://localhost:8081` and API `http://localhost:3000`
**DB:** `apps/backend/database.sqlite`
**Started:** 2026-07-02

Screenshots: `homeworks/HW02/artifacts/tests/FR-20-cancel-order-mobile/screenshots/`

---

## Domain Testing (EP) - TC-01 to TC-09

### TC-01 - Cancel order from `pending` status

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | `test@eshop.com` logged in on mobile. Order `#1` created through the mobile checkout flow and confirmed via `GET /api/orders/my-orders` as `status=pending` before the tap. |
| **Executed at** | 2026-07-02 16:53 |
| **Actual result** | UI: on the Hồ sơ screen, tapping `Hủy đơn` on order `#1` changed `Trạng thái: Chờ xác nhận` to `Trạng thái: Đã hủy` immediately and the button disappeared. API cross-check: `PUT /api/orders/1/cancel` -> HTTP 200. `GET /api/orders/my-orders` then returned order `#1` with `status=\"canceled\"`. |
| **Screenshot** | `artifacts/tests/FR-20-cancel-order-mobile/screenshots/TC-01-pending-cancel-success.png` |
| **Bug ID** | - |
| **Notes** | EC01, EC06, EC08, EC10, EC14 confirmed. Response body captured on request #33, `{\"message\":\"Order canceled successfully\"}`. |

### TC-02 - Cancel order from `confirmed` status

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Order `#2` created for `test@eshop.com`, then moved through the Admin API to `status=confirmed` via `PUT /api/admin/orders/2/status` before opening the mobile Hồ sơ screen. |
| **Executed at** | 2026-07-02 16:54 |
| **Actual result** | UI: on order `#2`, tapping `Hủy đơn` changed `Trạng thái: Đã xác nhận` to `Trạng thái: Đã hủy` immediately and the button disappeared. API cross-check: `PUT /api/orders/2/cancel` -> HTTP 200. `GET /api/orders/my-orders` then returned order `#2` with `status=\"canceled\"`. |
| **Screenshot** | `artifacts/tests/FR-20-cancel-order-mobile/screenshots/TC-02-confirmed-cancel-success.png` |
| **Bug ID** | - |
| **Notes** | EC02, EC06, EC08, EC10, EC14 confirmed. Response body captured on request #35, `{\"message\":\"Order canceled successfully\"}`. |

### TC-03 - Cancel order already `delivered`

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Order `#3` created for `test@eshop.com`, then advanced sequentially through the Admin API to `confirmed -> shipping -> delivered` before the mobile check. |
| **Executed at** | 2026-07-02 16:54 |
| **Actual result** | UI: order `#3` showed `Trạng thái: Đã giao` and no `Hủy đơn` button was present. API cross-check: direct `PUT /api/orders/3/cancel` returned HTTP 400 with `{\"error\":\"Cannot cancel this order.\"}`. |
| **Screenshot** | `artifacts/tests/FR-20-cancel-order-mobile/screenshots/TC-03-delivered-no-cancel-button.png` |
| **Bug ID** | - |
| **Notes** | EC04, EC06, EC08, EC10, EC15 confirmed. Server-side enforcement exists for `delivered`. |

### TC-04 - Cancel order already `canceled`

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Reused order `#1` after TC-01, already confirmed as `status=canceled` via `GET /api/orders/my-orders`. |
| **Executed at** | 2026-07-02 16:55 |
| **Actual result** | UI: order `#1` showed `Trạng thái: Đã hủy` and no `Hủy đơn` button. API cross-check: direct `PUT /api/orders/1/cancel` returned HTTP 400 with `{\"error\":\"Cannot cancel this order.\"}`. |
| **Screenshot** | `artifacts/tests/FR-20-cancel-order-mobile/screenshots/TC-04-canceled-no-button.png` |
| **Bug ID** | - |
| **Notes** | EC05, EC06, EC08, EC10, EC15 confirmed. Re-cancel is blocked server-side. |

### TC-05 - Cancel without valid authentication

Fallback Reason: the mobile UI stores JWT only in memory and exposes `Hủy đơn` only after login, so the no-token and invalid-token branches cannot be reached through visible UI controls. Executed through direct API calls against a valid pending order (`#4`).

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Order `#4` confirmed as `status=pending` before the test. Direct call 1 sent no `Authorization` header. Direct call 2 sent `Authorization: Bearer invalid.token.value`. |
| **Executed at** | 2026-07-02 16:55 |
| **Actual result** | API cross-check: no-header request returned HTTP 401 with `{\"error\":\"Unauthorized\"}`. Invalid-token request returned HTTP 403 with `{\"error\":\"Forbidden\"}`. A follow-up `GET /api/orders/my-orders` still showed order `#4` as `status=\"pending\"`. |
| **Screenshot** | `-` |
| **Bug ID** | - |
| **Notes** | EC07, EC16 confirmed. Actual invalid-token branch is `403` rather than `401`, but the required 4xx rejection behavior is correct. |

### TC-06 - Cancel a non-existent order

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Valid token for `test@eshop.com`. Target `order_id=999999`, absent from the current order list. |
| **Executed at** | 2026-07-02 16:55 |
| **Actual result** | API cross-check: direct `PUT /api/orders/999999/cancel` returned HTTP 404 with `{\"error\":\"Order not found\"}`. |
| **Screenshot** | `-` |
| **Bug ID** | - |
| **Notes** | EC11, EC15 confirmed. |

### TC-07 - Cancel order in `shipping` status (Gap-Probe)

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-20-001 |
| **Pre-condition setup** | Order `#5` created for `test@eshop.com`, then advanced sequentially through the Admin API to `confirmed -> shipping`. Mobile Hồ sơ screen showed `Trạng thái: Đang giao` and no `Hủy đơn` button before the direct API probe. |
| **Executed at** | 2026-07-02 16:55 |
| **Actual result** | UI: no `Hủy đơn` button on the `shipping` order, consistent with FR-20/FR-10. API cross-check: direct `PUT /api/orders/5/cancel` returned HTTP 200 with `{\"message\":\"Order canceled successfully\"}`. Follow-up `GET /api/orders/my-orders` showed order `#5` changed to `status=\"canceled\"`. |
| **Screenshot** | `artifacts/tests/FR-20-cancel-order-mobile/screenshots/BUG-20-001-07-shipping-cancel-accepted.png` |
| **Bug ID** | BUG-20-001 |
| **Notes** | EC03 failed. The restriction exists only in the mobile UI; backend state-machine enforcement for `shipping` is missing. |

### TC-08 - Cancel another user's order (Gap-Probe)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Secondary account `test2@eshop.com` was created during setup and authenticated successfully. Target order `#4` remained owned by `test@eshop.com` and was still `status=pending` before the probe. |
| **Executed at** | 2026-07-02 16:58 |
| **Actual result** | API cross-check: using `test2@eshop.com`'s token, direct `PUT /api/orders/4/cancel` returned HTTP 404 with `{\"error\":\"Order not found\"}`. Follow-up `GET /api/orders/my-orders` using `test@eshop.com`'s token confirmed order `#4` stayed `status=\"pending\"` at that point. |
| **Screenshot** | `artifacts/tests/FR-20-cancel-order-mobile/screenshots/TC-08-cross-user-order-unchanged.png` |
| **Bug ID** | - |
| **Notes** | EC09 resolved safely. The backend denies cross-user cancel attempts by hiding the foreign order behind a `404`. |

### TC-09 - Confirmation step before cancel (Gap-Probe)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS (with deviation) |
| **Pre-condition setup** | Re-logged into the mobile UI as `test@eshop.com`. Order `#4` was still `status=pending` with a visible `Hủy đơn` button. |
| **Executed at** | 2026-07-02 16:59 |
| **Actual result** | UI: one tap on `Hủy đơn` for order `#4` canceled the order immediately. No confirmation dialog appeared, and the status changed directly to `Trạng thái: Đã hủy`. API cross-check: exactly one cancel request was emitted, request #49 `PUT /api/orders/4/cancel` -> HTTP 200. |
| **Screenshot** | `artifacts/tests/FR-20-cancel-order-mobile/screenshots/TC-09-one-tap-cancel-no-dialog.png` |
| **Bug ID** | - |
| **Notes** | EC12/EC13 gap resolved empirically: no confirm step exists. Recorded as a UX finding because FR-20 is silent, even though FR-24 uses confirmation for another destructive action. |

### TC-10 - Status label color distinction across states (FR-11 cross-feature check)

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-20-002 |
| **Pre-condition setup** | `test@eshop.com` logged in on mobile with multiple orders visible under "Lịch sử đơn hàng" spanning `pending` ("Chờ xác nhận"), `confirmed` ("Đã xác nhận"), `shipping` ("Đang giao"), `delivered` ("Đã giao"), and `canceled` ("Đã hủy"). |
| **Executed at** | 2026-07-02 (post-execution follow-up) |
| **Actual result** | Used `getComputedStyle()` on the "Trạng thái: ..." text node for each status. All five statuses returned identical styling: `color: rgb(0, 0, 0)`, `background-color: rgba(0, 0, 0, 0)`, `font-weight: 400`. The parent order-card `<div>` also showed no distinguishing `border-width`/`background-color` per status (`border-width: 0px` in all cases). No color, background, or border differentiates any status from another. |
| **Screenshot** | `artifacts/tests/FR-20-cancel-order-mobile/screenshots/BUG-20-002-status-labels-same-color.png` |
| **Bug ID** | BUG-20-002 |
| **Notes** | EC17 failed. FR-11 explicitly requires "Trạng thái phải được dịch sang tiếng Việt rõ ràng và phân biệt màu sắc" - the Vietnamese-translation half is satisfied, but the color-distinction half is not implemented at all. This is a direct spec violation, not a gap (FR-11 is not silent on this point). |

## Boundary Value Analysis (BVA) - TC-BVA-01 to TC-BVA-04

### TC-BVA-01 - `order.status = confirmed` (UB)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Fresh sibling order `#6` created for `test@eshop.com`, then moved through Admin API to `status=confirmed`. Mobile Hồ sơ screen showed `Trạng thái: Đã xác nhận` with a visible `Hủy đơn` button. |
| **Executed at** | 2026-07-02 17:02 |
| **Actual result** | UI: tapping `Hủy đơn` on order `#6` changed the status to `Đã hủy` immediately and removed the button. API cross-check: `PUT /api/orders/6/cancel` -> HTTP 200. `GET /api/orders/my-orders` then returned order `#6` with `status=\"canceled\"`. |
| **Screenshot** | `artifacts/tests/FR-20-cancel-order-mobile/screenshots/TC-BVA-01-confirmed-upper-bound.png` |
| **Bug ID** | - |
| **Notes** | UB (`confirmed`) is accepted correctly. Request #51 returned the standard success body `{\"message\":\"Order canceled successfully\"}`. |

### TC-BVA-02 - `order.status = shipping` (UB+1)

| Field | Value |
| :---- | :---- |
| **Status** | ❌ FAIL - BUG-20-001 |
| **Pre-condition setup** | Fresh sibling order `#8` created for `test@eshop.com`, then moved through Admin API to `confirmed -> shipping`. Mobile Hồ sơ screen showed `Trạng thái: Đang giao` and no `Hủy đơn` button. |
| **Executed at** | 2026-07-02 17:02 |
| **Actual result** | UI: no `Hủy đơn` button at `shipping`, matching the frontend rule. API cross-check: direct `PUT /api/orders/8/cancel` returned HTTP 200 with `{\"message\":\"Order canceled successfully\"}`. `GET /api/orders/my-orders` then showed order `#8` changed to `status=\"canceled\"`. |
| **Screenshot** | `artifacts/tests/FR-20-cancel-order-mobile/screenshots/BUG-20-001-BVA-02-shipping-cancel-accepted.png` |
| **Bug ID** | BUG-20-001 |
| **Notes** | UB+1 is wrongly accepted. This confirms the same wrong-operator / missing-allow-list defect as TC-07. |

### TC-BVA-03 - `order.status = pending` (LB)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Fresh pending order `#9` was created for `test@eshop.com` after TC-BVA-02 and showed a visible `Hủy đơn` button on the mobile Hồ sơ screen. |
| **Executed at** | 2026-07-02 17:02 |
| **Actual result** | UI: tapping `Hủy đơn` on order `#9` changed the status to `Đã hủy` immediately and removed the button. API cross-check: `PUT /api/orders/9/cancel` -> HTTP 200. `GET /api/orders/my-orders` then returned order `#9` with `status=\"canceled\"`. |
| **Screenshot** | `artifacts/tests/FR-20-cancel-order-mobile/screenshots/TC-BVA-03-pending-lower-bound.png` |
| **Bug ID** | - |
| **Notes** | LB (`pending`) is accepted correctly. Request #60 returned the standard success body `{\"message\":\"Order canceled successfully\"}`. |

### TC-BVA-04 - `order.status = delivered` (UB+2)

| Field | Value |
| :---- | :---- |
| **Status** | ✅ PASS |
| **Pre-condition setup** | Reused delivered order `#3`, still shown in the mobile UI as `Trạng thái: Đã giao` with no cancel button. |
| **Executed at** | 2026-07-02 17:03 |
| **Actual result** | UI: no `Hủy đơn` button at `delivered`. API cross-check: direct `PUT /api/orders/3/cancel` returned HTTP 400 with `{\"error\":\"Cannot cancel this order.\"}`. |
| **Screenshot** | `artifacts/tests/FR-20-cancel-order-mobile/screenshots/TC-BVA-04-delivered-forbidden-region.png` |
| **Bug ID** | - |
| **Notes** | UB+2 is rejected correctly, so the defect is specific to the immediate `shipping` boundary rather than all post-`confirmed` states. |

---

## Execution Summary

| Metric | Count |
| :----- | :---- |
| TC Designed (EP) | 10 |
| TC Designed (BVA) | 4 |
| TC Executed | 14 / 14 |
| Passed | 10 |
| Failed | 3 (TC-07, TC-BVA-02, TC-10) |
| Pass with deviation | 1 (TC-09) |
| Bugs found | 2 (BUG-20-001, BUG-20-002) |

## Bugs Discovered

| Bug ID | TC | Description | Severity |
| :----- | :- | :---------- | :------- |
| BUG-20-001 | TC-07, TC-BVA-02 | Backend accepts `PUT /api/orders/:id/cancel` for `shipping` orders, even though the mobile UI hides the action and FR-20/FR-10 allow user cancel only for `pending` and `confirmed` | High |
| BUG-20-002 | TC-10 | All order statuses (`pending`/`confirmed`/`shipping`/`delivered`/`canceled`) render the "Trạng thái" label with identical color (`rgb(0,0,0)`, no distinguishing background/border), violating FR-11's explicit "phân biệt màu sắc" requirement | Low |
