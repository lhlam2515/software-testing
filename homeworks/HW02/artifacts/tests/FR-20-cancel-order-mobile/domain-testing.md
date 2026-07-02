# FR-20 — Domain Testing: Cancel Order (Mobile)

**Feature:** FR-20 — Cancel Order (Mobile App)
**Technique:** Domain Testing (Equivalence Partitioning)
**Spec source:** `docs/eshop-sut/srs.md` §7 FR-20 + §5 FR-10 (Order State Machine) + §9 SEC-02 · `docs/eshop-sut/api_specification.md` §4.6 (`PUT /api/orders/:id/cancel`)
**Author:** Lê Hoàng Lâm — 23127216

---

## 1. Feature Overview

FR-20 lets a user cancel their own order from the mobile app. Per FR-10 (Order State Machine), cancellation is only allowed while the order is `pending` or `confirmed`. Once an order reaches `shipping`, only an Admin can cancel it; `delivered` and `canceled` are final states with no outgoing transitions.

Cross-feature note: FR-11 states a user may only *view* their own orders, but is silent on whether the same ownership check applies to *cancel*. SEC-02 requires all security-sensitive APIs to enforce a valid JWT; API spec §4 confirms `Authorization: Bearer <token>` is required for all Cart & Orders endpoints, including cancel.

**Methodology note:** the UI survey and test design in this document were carried out against `apps/frontend-mobile` running in Expo's **web build** (`npx expo start --web`, served at `http://localhost:8081`), not against a physical device or an emulator/simulator. This was the only rendering target `playwright-cli` could drive directly. Layout, gesture handling, and platform-specific behavior differences on a real device or emulator (iOS/Android) are out of scope for this design and should be re-verified separately if device-specific testing is required.

---

## 2. Step 1 — Variables & Constraints

| Variable | Type | Description | Valid Domain / Boundaries | Dependencies & Constraints | Expected Error / Behavior |
|:---|:---|:---|:---|:---|:---|
| `order.status` | System State | Current status of the target order | `{pending, confirmed, shipping, delivered, canceled}` | FR-20 + FR-10: cancel only allowed when `pending` or `confirmed`; `shipping`/`delivered`/`canceled` are forbidden (final state, or Admin-only for `shipping`) | Rejected - order status does not allow cancellation |
| `auth_token` | Input | JWT of the acting mobile session | Valid, non-expired JWT | Required per SEC-02 and API spec §4 (`Authorization: Bearer <token>` for all Cart & Orders APIs) | Rejected - authentication required or invalid |
| `order_owner_match` | System State | Whether the target order belongs to the authenticated user | `True` / `False` | FR-11 restricts *viewing* orders to their owner; spec does not state whether the same restriction applies to *cancel* | (Implicit Gap) Undefined - see gap table |
| `order_id` | Input | Identifier of the order targeted for cancellation | Must reference an existing order | Selected via the mobile Order History screen, never free-typed by the user | Rejected - order not found |
| `cancel_action` | Input | User taps the mobile app's cancel-order control | Triggered / not triggered | Only reachable when the UI shows the control (depends on `order.status`, confirmed via Step 3.0 survey) | Initiates the cancel API call when the UI permits it |
| `confirm_dialog_response` | Input | User's response to a confirmation prompt shown before canceling, if any | `{Confirm, Dismiss}` (if a dialog exists) | FR-24 mandates a confirm dialog for destructive cart-item deletion; spec is silent on whether order cancellation (an equally destructive, irreversible action) needs the same UX pattern | (Implicit Gap) Undefined - see gap table |
| `result` (order.status after) | Output | Final order status and UI feedback after the cancel attempt | `canceled` (success) or unchanged (failure) + message | Must reflect the FR-10 state machine | Success: transitions to `canceled` with confirmation. Failure: status unchanged with an appropriate error message |

### Implicit Gaps & Spec Conflicts

| Variable | Gap / Conflict | Risk |
|:---|:---|:---|
| `order_owner_match` | **Implicit Gap** - the spec does not state whether `PUT /api/orders/:id/cancel` checks order ownership (unlike FR-11, which explicitly restricts order *viewing* to the owner) | If unchecked, user A could cancel user B's order by guessing/supplying `order_id` (IDOR) |
| `order.status = shipping` | **Spec Conflict** - SRS FR-20/FR-10 explicitly forbids user-initiated cancel from `shipping` ("only Admin can act"); API spec §4.6 describes the same endpoint as usable "only while the order has not been delivered," which implicitly permits `shipping` too (since `shipping` ≠ `delivered`) | Unclear whether the backend actually blocks cancel at `shipping` through the same user-facing endpoint - requires a behavioral test |
| `confirm_dialog_response` | **Implicit Gap** - FR-24 only mandates a confirm dialog for cart-item deletion, and is silent on order cancellation (an equally destructive, irreversible action) | If no confirm dialog exists, a single accidental tap permanently cancels an order with no recovery path |

---

## 3. Step 2 — Equivalence Classes

**Variable: `order.status`** (Set Rule - distinct handling per value; Splitting Rule isolates `shipping` as its own class because it is the Spec Conflict target)

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `order.status` | EC01 | `pending` | Valid | Cancel succeeds - order transitions to `canceled` |
| `order.status` | EC02 | `confirmed` | Valid | Cancel succeeds - order transitions to `canceled` |
| `order.status` | EC03 | `shipping` | Invalid/Gap | Spec Conflict - see gap-probe TC, no outcome assumed in advance |
| `order.status` | EC04 | `delivered` | Invalid | Rejected - order already delivered, cannot be canceled (final state) |
| `order.status` | EC05 | `canceled` | Invalid | Rejected - order already in a final state, cannot be canceled again |

**Variable: `auth_token`** (Must-Be Rule - a valid token is required to proceed)

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `auth_token` | EC06 | Valid, non-expired token | Valid | Allowed to proceed to the remaining checks |
| `auth_token` | EC07 | Not logged in / missing or expired token | Invalid | Rejected - authentication required |

**Variable: `order_owner_match`** (Must-Be Rule - the acting user must be the order owner)

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `order_owner_match` | EC08 | Authenticated user is the order owner | Valid | Allowed to proceed to the `order.status` check |
| `order_owner_match` | EC09 | Authenticated user is not the order owner | Invalid/Gap | Undefined - see gap-probe TC (IDOR risk) |

**Variable: `order_id`** (Must-Be Rule - the order must exist)

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `order_id` | EC10 | References an existing order | Valid | Allowed to proceed |
| `order_id` | EC11 | References a non-existent order | Invalid | Rejected - order not found |

**Variable: `confirm_dialog_response`** (Gap Rule - spec is silent on whether the dialog exists)

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `confirm_dialog_response` | EC12 | UI shows a confirm dialog and user taps Confirm | Invalid/Gap | Undefined - see gap-probe TC |
| `confirm_dialog_response` | EC13 | UI shows a confirm dialog and user taps Dismiss/Cancel | Invalid/Gap | Undefined - see gap-probe TC (order must remain unchanged) |

**Variable / Condition: `result` (Output - UI feedback)** - partitioned by the shape of the system's response

| Variable / Condition | EC ID | Description | Type | Expected System Output |
|:---|:---|:---|:---|:---|
| `result` | EC14 | Successful response (order transitions to `canceled`) | Valid (Output) | UI shows the success state, order list updates |
| `result` | EC15 | Business-rule error response (wrong status, not the owner, not found) | Valid (Output) | UI shows the corresponding error message, order status unchanged |
| `result` | EC16 | Authentication error response (not logged in / invalid token) | Valid (Output) | UI blocks the action / shows an authentication error |

---

## 4. Step 3 — Minimum Test Cases

### Step 3.0 — Real UI Survey (playwright-cli, mobile web build)

Backend at `:3000`, frontend-mobile (Expo web export) at `:8081`. The app is hardcoded to call `http://192.168.10.13:3000` (a stale LAN IP, not the current machine's `192.168.1.172`); all API calls silently failed until a `page.route()` override redirected them to `localhost:3000`. This environment quirk must be reproduced (or the Expo API base URL fixed) before real execution.

**Confirmed UI structure** (SPA, the URL always stays `http://localhost:8081/`, no per-screen route):
- Nav bar: `Đăng nhập` (logged out) or `Chào, {Name}` (logged in) · `Giỏ (N)`
- Tapping `Chào, {Name}` opens the "Hồ sơ" screen, which combines the profile form and the **"Lịch sử đơn hàng"** section on one screen - there is no separate order-detail page.
- Each order card shows: `Đơn #N`, `Ngày đặt: ...`, `Tổng tiền: ... ₫`, `Trạng thái: <label>`, and conditionally a `Hủy đơn` button.

**Status label mapping** (confirmed by creating 4 real orders via checkout and transitioning them through the Admin API):

| `order.status` | UI label | `Hủy đơn` button |
|---|---|---|
| `pending` | Chờ xác nhận | Present |
| `confirmed` | Đã xác nhận | Present |
| `shipping` | Đang giao | Absent |
| `delivered` | Đã giao | Absent |
| `canceled` | Đã hủy | Absent |

**Key findings from tapping `Hủy đơn`:**
1. **No confirmation dialog exists** - a single tap cancels immediately, firing `PUT /api/orders/:id/cancel` directly. This resolves the `confirm_dialog_response` gap with empirical evidence rather than assumption.
2. **No success toast/message** - the only feedback is the `Trạng thái` label updating in place to "Đã hủy" and the button disappearing.
3. Actual success response: `HTTP 200 + {"message": "Order canceled successfully"}`.
4. The app **stores the JWT only in memory** - both `localStorage` and `sessionStorage` were confirmed empty. There is no way to tamper with a logged-in session's token from outside; any missing/invalid-token test has no UI path and must call the API directly.
5. The UI **hides the `Hủy đơn` button entirely** for `shipping`/`delivered`/`canceled`, consistent with SRS FR-20/FR-10 - but this only proves UI-level enforcement, not backend enforcement (the actual Spec Conflict target).

---

### TC-01 — Cancel order from `pending` status (happy path)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-01 |
| **Test Case Name** | Cancel succeeds when order status is `pending` |
| **ECs Covered** | EC01, EC06, EC08, EC10, EC14 |
| **ECs Verified Absent** | EC15, EC16 |
| **Pre-conditions** | Account `test@eshop.com` / `Test1234!` is logged in on the mobile app. An order was created via checkout (e.g. "Tai nghe AirPods Pro 2", 6,000,000 ₫) and is `pending` - shown as "Trạng thái: Chờ xác nhận" under "Lịch sử đơn hàng". |
| **Input — `order_id`** | ID of the newly created `pending` order |
| **Steps** | 1. Tap `Chào, Test User` on the nav bar to open the Hồ sơ screen · 2. Under "Lịch sử đơn hàng", locate the card showing "Trạng thái: Chờ xác nhận" · 3. Tap `Hủy đơn` on that card |
| **Expected Result** | ✅ UI: the card's "Trạng thái" line updates in place to "Đã hủy", the `Hủy đơn` button disappears, no other toast/message appears. API cross-check: `PUT /api/orders/:id/cancel` → HTTP 200 + `{"message": "Order canceled successfully"}`. |
| **Verification Points** | 1. UI shows "Trạng thái: Đã hủy" immediately, no reload needed · 2. UI: `Hủy đơn` button no longer present on this card · 3. API cross-check: response is HTTP 200 with body exactly `{"message": "Order canceled successfully"}` · 4. API cross-check: subsequent `GET /api/orders/my-orders` returns `status = "canceled"` for this order |
| **Status** | ⬜ Not yet executed |

### TC-02 — Cancel order from `confirmed` status (happy path)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-02 |
| **Test Case Name** | Cancel succeeds when order status is `confirmed` |
| **ECs Covered** | EC02, EC06, EC08, EC10, EC14 |
| **ECs Verified Absent** | EC15, EC16 |
| **Pre-conditions** | Account `test@eshop.com` is logged in. An order exists and was moved to `confirmed` by Admin via `PUT /api/admin/orders/:id/status` (`{"status": "confirmed"}`, Admin login `admin@eshop.com` / `Admin123!`) - shown as "Trạng thái: Đã xác nhận". |
| **Input — `order_id`** | ID of the `confirmed` order |
| **Steps** | 1. Tap `Chào, Test User` to open Hồ sơ · 2. Locate the card showing "Trạng thái: Đã xác nhận" · 3. Tap `Hủy đơn` |
| **Expected Result** | ✅ UI: "Trạng thái" updates to "Đã hủy", `Hủy đơn` button disappears. API cross-check: HTTP 200 + `{"message": "Order canceled successfully"}`. |
| **Verification Points** | 1. UI shows "Trạng thái: Đã hủy" immediately · 2. `Hủy đơn` button disappears · 3. API cross-check: HTTP 200 with the expected body · 4. API cross-check: `GET /api/orders/my-orders` confirms `status = "canceled"` |
| **Status** | ⬜ Not yet executed |

### TC-03 — Cancel order already `delivered`

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-03 |
| **Test Case Name** | Cancel is rejected when order status is `delivered` |
| **ECs Covered** | EC04, EC06, EC08, EC10 |
| **ECs Verified Absent** | EC14 |
| **Pre-conditions** | An order was moved by Admin through `pending → confirmed → shipping → delivered` (each step via `PUT /api/admin/orders/:id/status`) - shown as "Trạng thái: Đã giao" on `test@eshop.com`'s Hồ sơ. |
| **Input — `order_id`** | ID of the `delivered` order |
| **Steps** | 1. Tap `Chào, Test User` to open Hồ sơ · 2. Locate the card showing "Trạng thái: Đã giao" · 3. Observe that no `Hủy đơn` button is present on this card (matches the Step 3.0 survey) |
| **UI Fallback Note** | The API cross-check verification point requires calling `PUT /api/orders/:id/cancel` directly, since there is no button to tap at this status - this confirms server-side enforcement, not just UI hiding. |
| **Expected Result** | ❌ UI: no `Hủy đơn` button shown on the "Đã giao" order. API cross-check: a direct call to `PUT /api/orders/:id/cancel` is expected to return HTTP 4xx + an error (order already delivered, cannot be canceled). |
| **Verification Points** | 1. UI: no `Hủy đơn` button exists on the "Đã giao" card · 2. API cross-check: record the actual HTTP status of the direct call · 3. API cross-check: if not 4xx, this is a BUG (backend does not enforce it, only the UI hides it) |
| **Status** | ⬜ Not yet executed |

### TC-04 — Cancel order already `canceled`

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-04 |
| **Test Case Name** | Cancel is rejected when order status is already `canceled` |
| **ECs Covered** | EC05, EC06, EC08, EC10 |
| **ECs Verified Absent** | EC14 |
| **Pre-conditions** | An order was already canceled successfully (e.g. the result of TC-01), shown as "Trạng thái: Đã hủy". |
| **Input — `order_id`** | ID of the already-`canceled` order |
| **Steps** | 1. Tap `Chào, Test User` to open Hồ sơ · 2. Locate the card showing "Trạng thái: Đã hủy" · 3. Observe that no `Hủy đơn` button is present |
| **UI Fallback Note** | The API cross-check verification point requires calling `PUT /api/orders/:id/cancel` directly, since there is no button to tap - confirms the backend rejects re-canceling a final-state order, not just the UI. |
| **Expected Result** | ❌ UI: no `Hủy đơn` button on the "Đã hủy" order. API cross-check: a direct call is expected to return HTTP 4xx + an error (order already canceled). |
| **Verification Points** | 1. UI: no `Hủy đơn` button exists · 2. API cross-check: record the actual HTTP status of the direct call · 3. If 200: BUG - an already-canceled order can be re-canceled |
| **Status** | ⬜ Not yet executed |

### TC-05 — Cancel without valid authentication

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-05 |
| **Test Case Name** | Cancel is rejected without a valid token |
| **ECs Covered** | EC07 |
| **ECs Verified Absent** | EC14 |
| **Pre-conditions** | An order exists in `pending` or `confirmed` status, owned by `test@eshop.com`. |
| **Input — `auth_token`** | (empty - no `Authorization` header) and separately: `Bearer invalid.token.value` |
| **UI Fallback Note** | The mobile UI only exposes "Lịch sử đơn hàng" / `Hủy đơn` after login; there is no UI path to reach the button while logged out or with an invalid token. The app also never persists the token to `localStorage`/`sessionStorage` (confirmed empty in Step 3.0), so a logged-in session's token cannot be tampered with either. Steps therefore call the API directly. |
| **Steps** | 1. Call `PUT /api/orders/:id/cancel` (id of a valid `pending`/`confirmed` order) with no `Authorization` header · 2. Repeat with `Authorization: Bearer invalid.token.value` |
| **Expected Result** | ❌ API cross-check: both cases return HTTP 401 (or equivalent 4xx) + an error requiring login / rejecting the invalid token; the order's status is unchanged. |
| **Verification Points** | 1. API cross-check: HTTP status = 401 (or 4xx) for both cases · 2. API cross-check: `GET /api/orders/my-orders` (with a different, valid token) confirms the status did not change |
| **Status** | ⬜ Not yet executed |

### TC-06 — Cancel a non-existent order

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-06 |
| **Test Case Name** | Cancel is rejected when `order_id` does not exist |
| **ECs Covered** | EC11 |
| **ECs Verified Absent** | EC14 |
| **Pre-conditions** | Valid token for `test@eshop.com`. `order_id = 999999` does not exist in the DB. |
| **UI Fallback Note** | The user cannot type an `order_id` through the UI (only selects from their own order list), so there is no UI path to target a non-existent `order_id`. |
| **Steps** | 1. Call `PUT /api/orders/999999/cancel` with a valid token for `test@eshop.com` |
| **Expected Result** | ❌ API cross-check: HTTP 4xx (404 expected) + an error indicating the order was not found. |
| **Verification Points** | 1. API cross-check: HTTP status is in the 4xx range · 2. API cross-check: body contains a "not found"-type error message |
| **Status** | ⬜ Not yet executed |

### TC-07 — Cancel order in `shipping` status (Gap-Probe — Spec Conflict)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-07 |
| **Test Case Name** | Determine the backend's actual behavior when canceling a `shipping` order |
| **ECs Covered** | EC03 |
| **ECs Verified Absent** | N/A — gap test, discover actual behavior |
| **Pre-conditions** | An order was moved by Admin through `pending → confirmed → shipping` - shown as "Trạng thái: Đang giao" on `test@eshop.com`'s Hồ sơ. (Confirmed in Step 3.0: the `Hủy đơn` button is NOT shown at this status.) |
| **Input — `order_id`** | ID of the `shipping` order |
| **Steps** | 1. Open Hồ sơ, re-confirm the UI shows no `Hủy đơn` button for the "Đang giao" order (re-verify the Step 3.0 finding as reproducible evidence) · 2. Call `PUT /api/orders/:id/cancel` directly with a valid token for `test@eshop.com` |
| **UI Fallback Note** | Step 2 must use a direct API call since the UI has no button to tap at this status - this is precisely the gap being probed: SRS FR-20/FR-10 forbids user-cancel from `shipping`, while API spec §4.6 describes the endpoint loosely as usable "while not yet delivered" (which would implicitly include `shipping`). |
| **Expected Result** | Multiple plausible branches (no outcome assumed in advance): · If the API returns HTTP 4xx + an error refusing the cancel → confirms the backend follows SRS FR-20/FR-10 (blocks `shipping`), consistent with the UI; the gap closes in favor of SRS over the API spec wording. · If the API returns HTTP 200 and the order transitions to `canceled` → **serious BUG**: the backend allows canceling a `shipping` order in violation of SRS FR-20/FR-10; the restriction only exists client-side and can be bypassed via direct API calls - a state-machine invariant violation. |
| **Verification Points** | 1. UI: no `Hủy đơn` button on the "Đang giao" order · 2. API cross-check: record the actual HTTP status of the direct call · 3. API cross-check: if 200, re-check `order.status` via `GET /api/orders/my-orders` · 4. Compare any returned error message against FR-10's "only Admin can act" wording |
| **Status** | ⬜ Not yet executed |

### TC-08 — Cancel another user's order (Gap-Probe — Ownership/IDOR)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-08 |
| **Test Case Name** | Determine whether the system enforces order ownership on cancel |
| **ECs Covered** | EC09 |
| **ECs Verified Absent** | N/A — gap test, discover actual behavior |
| **Pre-conditions** | Two accounts: `test@eshop.com` / `Test1234!` (order owner) and `test2@eshop.com` / `Test1234!` (register via "Chưa có tài khoản? Đăng ký ngay" on mobile if not already present). An order owned by `test@eshop.com` is `pending` or `confirmed`. |
| **Input — `order_id`** | ID of the order owned by `test@eshop.com` |
| **Steps** | 1. Log in to obtain a token for `test2@eshop.com` · 2. Call `PUT /api/orders/:id/cancel` directly with `:id` set to an order owned by `test@eshop.com`, using `test2@eshop.com`'s token |
| **UI Fallback Note** | `test2@eshop.com`'s UI only lists `test2`'s own orders, with no way to see or enter another user's `order_id` - there is no UI path to reproduce this scenario. |
| **Expected Result** | Multiple plausible branches (no outcome assumed in advance): · If the API returns HTTP 403/404 + an error denying access → the system checks ownership, safe. · If the API returns HTTP 200 and `test@eshop.com`'s order is canceled → **serious security BUG (IDOR)**: any user can cancel another user's order just by knowing the `order_id`. |
| **Verification Points** | 1. API cross-check: record the actual HTTP status · 2. If 200: confirm via `GET /api/orders/my-orders` (using `test@eshop.com`'s token) that the order was unexpectedly moved to `canceled` · 3. Compare against FR-11 (view restricted to owner) to assess severity if the cancel permission is looser than the view permission |
| **Status** | ⬜ Not yet executed |

### TC-09 — Confirmation step before cancel (Gap-Probe — UX)

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-09 |
| **Test Case Name** | Confirm the actual behavior: is there a confirmation dialog before cancel |
| **ECs Covered** | EC12, EC13 |
| **ECs Verified Absent** | N/A — gap test, discover actual behavior |
| **Pre-conditions** | `test@eshop.com` is logged in, with an order in `pending` or `confirmed` status (the `Hủy đơn` button is showing). |
| **Steps** | 1. Open Hồ sơ, locate the card with a `Hủy đơn` button · 2. Tap `Hủy đơn` exactly once and observe immediately, with no further action |
| **Expected Result** | Empirical evidence already exists from the Step 3.0 survey (re-verify at execution time): · **[Observed in Step 3.0]** No confirmation dialog appears - the order is canceled immediately, "Trạng thái" jumps straight to "Đã hủy" after exactly one tap. This is a UX gap relative to the FR-24 convention (a confirm dialog is mandatory for cart-item deletion, an equally destructive action) - record as a **UX finding** to report (a single accidental tap permanently cancels an order with no way back). · If the official execution run finds a dialog does appear (behavior changed since the survey) → use `dialog-accept`/`dialog-dismiss` to test both branches, confirming the order only changes state on Confirm. |
| **Verification Points** | 1. Observe immediately after the tap: dialog present or absent · 2. If absent: status changes after exactly one tap · 3. API cross-check: exactly one `PUT /api/orders/:id/cancel` request was sent (not two, from a double-submit) |
| **Status** | ⬜ Not yet executed |

---

## 5. EC Coverage Matrix

| EC ID | TC ID | Mechanism |
|:---|:---|:---|
| EC01 | TC-01 | Direct trigger |
| EC02 | TC-02 | Direct trigger |
| EC03 | TC-07 | Direct trigger (gap-probe) |
| EC04 | TC-03 | Direct trigger |
| EC05 | TC-04 | Direct trigger |
| EC06 | TC-01, TC-02, TC-03, TC-04 | Nominal valid input |
| EC07 | TC-05 | Direct trigger |
| EC08 | TC-01, TC-02 | Nominal valid input |
| EC09 | TC-08 | Direct trigger (gap-probe) |
| EC10 | TC-01, TC-02 | Nominal valid input |
| EC11 | TC-06 | Direct trigger |
| EC12 | TC-09 | Direct trigger (gap-probe) |
| EC13 | TC-09 | Direct trigger (gap-probe - unreachable branch, no dialog exists) |
| EC14 | TC-01, TC-02 | Observed |
| EC15 | TC-03, TC-04, TC-07 (branch), TC-08 (branch) | Verified absent / Observed |
| EC16 | TC-05 | Observed |

**Gap Completeness Cross-Check:** `order_owner_match` → TC-08 ✓ · `order.status = shipping` Spec Conflict → TC-07 ✓ · `confirm_dialog_response` → TC-09 ✓ (all 3 Step 1 gaps each map to a dedicated gap-probe TC).
