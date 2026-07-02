# FR-20 — Boundary Value Analysis: Cancel Order (Mobile)

**Feature:** FR-20 — Cancel Order (Mobile App)
**Technique:** Boundary Value Analysis (BVA) — additive to Domain Testing
**Spec source:** `docs/eshop-sut/srs.md` §7 FR-20 + §5 FR-10 (Order State Machine) · `docs/eshop-sut/api_specification.md` §4.6, §6.2
**Author:** Lê Hoàng Lâm — 23127216

---

## 1. Overview

FR-20 has no numeric input (no counters, timers, quantities, or amounts govern the cancel decision), so classic range-based BVA does not apply to most of its variables. The one variable worth a boundary analysis is `order.status`: FR-10 defines it as an **ordered sequence** (`pending → confirmed → shipping → delivered`), and the cancel rule draws a hard line partway through that sequence — allowed for the first two states, forbidden from the third onward.

This is exactly the shape BVA targets: a turning point where an off-by-one or wrong-operator implementation mistake is most likely and most consequential. It is also the exact location of the Spec Conflict flagged in Step 1 (SRS FR-20/FR-10 forbids `shipping`; API spec §4.6 loosely implies it may still be allowed). Domain Testing (TC-01 through TC-09 in `domain-testing.md`) already covers each state as an isolated Equivalence Class; BVA adds value here by testing the **adjacent pair straddling the critical boundary** under matched conditions, and by naming the precise wrong-operator defect each test is designed to catch.

**Target variable:** `order.status` (ordinal, not numeric — boundary applied to sequence position, not a numeric range).

---

## 2. Target Variables & Boundary Map

```
   [pending] ---- [confirmed] || [shipping] ---- [delivered] ---- (canceled, side-branch)
      LB              UB      ||    UB+1            UB+2
    (allowed)      (allowed)  ||  (forbidden)     (forbidden)
                               ^
                     CRITICAL BOUNDARY
              (last allowed state -> first forbidden state)
```

| Boundary Point | `order.status` value | Position | Expected region |
|:---|:---|:---|:---|
| LB | `pending` | First allowed state | Allowed |
| UB | `confirmed` | Last allowed state | Allowed |
| UB+1 | `shipping` | First forbidden state | Forbidden (Spec Conflict target) |
| UB+2 | `delivered` | Second forbidden state, final state | Forbidden |

Parameter Variation does not apply — the boundary is a fixed state-machine transition defined in FR-10, not a configurable threshold. Date/timestamp boundary handling does not apply — FR-20 has no cancel deadline or expiry.

---

## 3. BVA Test Cases

### TC-BVA-01 — `order.status = confirmed` (UB, last allowed state)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-BVA-01 |
| **Test Case Name** | Cancel succeeds at the upper boundary of the allowed region |
| **Target Variable** | `order.status` |
| **Boundary Point Type** | UB |
| **Target Variable State** | `order.status = confirmed` |
| **Pre-conditions** | Order created via mobile checkout for `test@eshop.com`, then moved by Admin to `confirmed` via `PUT /api/admin/orders/:id/status` (`{"status": "confirmed"}`) — shown as "Trạng thái: Đã xác nhận". |
| **Input — `order_id`** | ID of the `confirmed` order |
| **Defect Target** | An off-by-one implementation that wrongly excludes `confirmed` from the allowed set, e.g. code checking `status === 'pending'` only instead of `status in ['pending', 'confirmed']`. |
| **Steps** | 1. Open Hồ sơ, locate the card showing "Trạng thái: Đã xác nhận" · 2. Tap `Hủy đơn` |
| **Expected Result** | ✅ UI: "Trạng thái" transitions to "Đã hủy", `Hủy đơn` button disappears. API cross-check: `PUT /api/orders/:id/cancel` → HTTP 200 + `{"message": "Order canceled successfully"}`. |
| **Verification Points** | 1. UI shows "Trạng thái: Đã hủy" immediately after the tap (this is the state transition being verified — confirms the last allowed value is not mistakenly rejected) · 2. API cross-check: HTTP 200 with the expected body · 3. API cross-check: `GET /api/orders/my-orders` confirms `status = "canceled"` |
| **Status** | ⬜ Not yet executed |

### TC-BVA-02 — `order.status = shipping` (UB+1, first forbidden state)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-BVA-02 |
| **Test Case Name** | Cancel is rejected at the exact turning point into the forbidden region |
| **Target Variable** | `order.status` |
| **Boundary Point Type** | UB+1 |
| **Target Variable State** | `order.status = shipping` |
| **Pre-conditions** | A sibling order (same product/account) created and moved by Admin through `pending → confirmed → shipping` — shown as "Trạng thái: Đang giao". Run immediately after TC-BVA-01 for a direct matched comparison at the boundary. |
| **Input — `order_id`** | ID of the `shipping` order |
| **Defect Target** | The precise Spec Conflict bug: a deny-list implementation like `status !== 'delivered' && status !== 'canceled'` (matching the API spec's loose "not yet delivered" wording) instead of the correct allow-list `status in ['pending', 'confirmed']` per SRS FR-20/FR-10. This is the wrong-operator mistake most likely to slip through code review, since it looks reasonable but silently permits one extra state. |
| **UI Fallback Note** | The UI shows no `Hủy đơn` button at `shipping` (confirmed in Step 3.0 survey and re-observed here), so the verification of backend behavior at this exact boundary requires a direct `PUT /api/orders/:id/cancel` call. |
| **Steps** | 1. Open Hồ sơ, confirm the "Đang giao" card shows no `Hủy đơn` button · 2. Call `PUT /api/orders/:id/cancel` directly with a valid token for `test@eshop.com` |
| **Expected Result** | ❌/BUG — two plausible outcomes at this exact turning point: · If HTTP 4xx + an error refusing the cancel → the deny-list/allow-list boundary is implemented correctly per SRS FR-20/FR-10; the UB+1 point correctly falls outside the allowed region. · If HTTP 200 and the order transitions to `canceled` → **confirms the Defect Target bug**: the boundary check treats `shipping` as still allowed, exactly the wrong-operator mistake this TC targets. |
| **Verification Points** | 1. UI: no `Hủy đơn` button at `shipping` · 2. API cross-check: record the actual HTTP status of the direct call — this is the load-bearing check for this boundary · 3. API cross-check: if 200, re-check `order.status` via `GET /api/orders/my-orders` to confirm the unintended transition |
| **Status** | ⬜ Not yet executed |

### TC-BVA-03 — `order.status = pending` (LB, first allowed state)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-BVA-03 |
| **Test Case Name** | Cancel succeeds at the lower boundary of the allowed region |
| **Target Variable** | `order.status` |
| **Boundary Point Type** | LB |
| **Target Variable State** | `order.status = pending` |
| **Pre-conditions** | Order freshly created via mobile checkout for `test@eshop.com`, left untouched at `pending` — shown as "Trạng thái: Chờ xác nhận". |
| **Input — `order_id`** | ID of the `pending` order |
| **Defect Target** | An off-by-one implementation that wrongly excludes `pending` from the allowed set, e.g. code requiring `status === 'confirmed'` only (perhaps assuming cancellation is only meaningful post-confirmation). |
| **Steps** | 1. Open Hồ sơ, locate the card showing "Trạng thái: Chờ xác nhận" · 2. Tap `Hủy đơn` |
| **Expected Result** | ✅ UI: "Trạng thái" transitions to "Đã hủy", `Hủy đơn` button disappears. API cross-check: HTTP 200 + `{"message": "Order canceled successfully"}`. |
| **Verification Points** | 1. UI shows "Trạng thái: Đã hủy" immediately · 2. API cross-check: HTTP 200 with the expected body · 3. API cross-check: `GET /api/orders/my-orders` confirms `status = "canceled"` |
| **Status** | ⬜ Not yet executed |

### TC-BVA-04 — `order.status = delivered` (UB+2, second forbidden state)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-BVA-04 |
| **Test Case Name** | Cancel remains rejected one state further into the forbidden region |
| **Target Variable** | `order.status` |
| **Boundary Point Type** | UB+2 |
| **Target Variable State** | `order.status = delivered` |
| **Pre-conditions** | An order moved by Admin through the full chain `pending → confirmed → shipping → delivered` — shown as "Trạng thái: Đã giao". |
| **Input — `order_id`** | ID of the `delivered` order |
| **Defect Target** | A deny check that special-cases only the immediate next state (`shipping`) and fails to generalize further along the chain, e.g. `if (status === 'shipping') reject` without also covering `delivered`. This TC exists specifically to catch a fix for TC-BVA-02 that is too narrow. |
| **UI Fallback Note** | The UI shows no `Hủy đơn` button at `delivered`, so the API cross-check requires a direct `PUT /api/orders/:id/cancel` call. |
| **Steps** | 1. Open Hồ sơ, confirm the "Đã giao" card shows no `Hủy đơn` button · 2. Call `PUT /api/orders/:id/cancel` directly with a valid token for `test@eshop.com` |
| **Expected Result** | ❌ UI: no `Hủy đơn` button at `delivered`. API cross-check: HTTP 4xx + an error (order already delivered, cannot be canceled). |
| **Verification Points** | 1. UI: no `Hủy đơn` button at `delivered` · 2. API cross-check: record the actual HTTP status of the direct call · 3. If 200: BUG — confirms the narrow-deny-check defect target |
| **Status** | ⬜ Not yet executed |

---

## 4. Defect Coverage Matrix

| TC-BVA ID | Boundary Point | Specific Defect Targeted |
|:---|:---|:---|
| TC-BVA-01 | UB (`confirmed`) | Off-by-one excluding `confirmed` from the allowed set |
| TC-BVA-02 | UB+1 (`shipping`) | Wrong-operator deny-list (`!== 'delivered'`) instead of correct allow-list (`in ['pending','confirmed']`) — the Spec Conflict bug |
| TC-BVA-03 | LB (`pending`) | Off-by-one excluding `pending` from the allowed set |
| TC-BVA-04 | UB+2 (`delivered`) | Deny check too narrow, only special-cases `shipping` and misses states beyond it |

---

## 5. Setup Protocol

`test-db.cjs` only manipulates the `users` table (`login_attempts`, `locked_until`) and has no support for the `orders` table, so all `order.status` boundary states in this file are reached through the documented Admin API rather than direct DB writes:

1. Log in as Admin: `POST /api/login` with `admin@eshop.com` / `Admin123!` → obtain `token`.
2. Create the target order via the mobile app's normal checkout flow as `test@eshop.com` (add a product to cart → `Tiến hành thanh toán` → `Xác Nhận Thanh Toán`).
3. Drive the order to the desired boundary state by calling `PUT /api/admin/orders/:id/status` **sequentially** through each intermediate state (the state machine does not support skipping steps): `{"status": "confirmed"}`, then `{"status": "shipping"}`, then `{"status": "delivered"}` as needed, stopping at the boundary under test.
4. After each `PUT`, reload the Hồ sơ screen on the mobile app and confirm the `Trạng thái` label matches the expected value from the Step 3.0 mapping table before proceeding with the TC's Steps.
5. For TC-BVA-01 and TC-BVA-02, use two separate sibling orders (not the same order sequentially) so both boundary points can be verified independently without one attempt consuming the order needed by the other.

---

## 6. Test Suite Summary

| Category | Count |
|:---|:---|
| EP Test Cases (`domain-testing.md`) | 9 (TC-01 – TC-09, including 3 gap-probe TCs) |
| BVA Test Cases (this file) | 4 (TC-BVA-01 – TC-BVA-04) |
| **Total** | **13** |
