# Main Report — HW02

---

## 1. Student Information

| Field                   | Value                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| Student name (printed): | Lê Hoàng Lâm                                                                              |
| Student ID:             | 23127216                                                                                  |
| Class / Cohort:         | 23KTPM1                                                                                   |
| Assignment ID:          | HW#02                                                                                     |
| Assignment date:        | 22/06/2026                                                                                |
| AI tool(s) used:        | Claude Code                                                                               |
| AI Disclosure Form:     | [[AI-03] AI Disclosure Form — HW02]([AI-03]_AI_Disclosure_Form.md)                       |
| GitHub Repository:      | [github.com/lhlam2515/software-testing](https://github.com/lhlam2515/software-testing)   |

---

## 2. Feature A - FR-02: Login and Account Lockout

> **Technique:** Domain Testing (Equivalence Partitioning) + Boundary Value Analysis
> **Artifacts:** [`artifacts/tests/FR-02-login-lockout/`](artifacts/tests/FR-02-login-lockout/)

### 2.1 Domain Testing

#### Step 1 - Identify Input/Output Variables

FR-02 governs two behaviors: authenticating email and password to issue a JWT, and locking the account for 30 seconds after 3 consecutive failures. Seven variables were identified across three categories: two user inputs (`email`, `password`), three server-side system states (`login_attempts`, `account_locked`, `locked_until`), and two outputs (`jwt_token`, `error_message`).

`login_attempts` (an INTEGER counter that triggers lockout at 3) and `locked_until` (a DATETIME checked against `datetime('now')` on every request) drive most of the behavior. Both carry implicit gaps the SRS never answers:

- **G1:** does `login_attempts` reset once the lock expires?
- **G2:** does it keep incrementing while the account is locked?
- **G3:** is lockout scope per-account or per-IP?
- **G4:** is there any length limit on email or password at login?

G1 and G2 are resolved empirically by the BVA boundary probes in §2.2 (TC-BVA-03 to TC-BVA-05). G3 and G4 are descoped with a documented rationale in `domain-testing.md`: the schema ties lockout to the account row only, and both fields are unbounded TEXT columns with no maximum to target.

Full variable table: [`domain-testing.md` - Step 1](artifacts/tests/FR-02-login-lockout/domain-testing.md)

#### Step 2 - Identify Equivalence Classes

Equivalence partitioning was applied across 8 functional groups using the Range, Must-Be, and Splitting rules, producing 21 ECs total: 10 valid, 11 invalid.

**Splitting Rule on `email`.** EC01 (empty string) and EC02 (non-empty but invalid format) stay in separate classes because they test two distinct mechanisms: a missing `required` attribute versus HTML5 `type="email"` format validation. The two can fail independently, so collapsing them into one class would let one defect mask the other.

**EC10 and EC12 coupling.** `login_attempts >= 3` (EC10) and `locked_until > datetime('now')` (EC12) cannot be triggered independently in practice; they always coexist once an account is locked. Both are assigned to TC-07 as a single composite system state. This does not violate Error Isolation, since the coupling is a physical constraint of the SUT, not a test design choice.

**Output-space invalid ECs (EC14, EC16, EC19, EC21).** These describe behavior the system must not exhibit: counter increments by something other than 1, counter fails to reset, JWT returned on failure, error message reveals the specific reason. None of them can be triggered by the tester directly; they are verified absent within the existing TCs. Error Isolation governs the input domain, not the output domain.

Full EC table (all 8 groups, all 21 ECs): [`domain-testing.md` - Step 2](artifacts/tests/FR-02-login-lockout/domain-testing.md)

#### Step 3 - Minimum Test Case Set

Seven test cases were derived using Error Isolation: one happy-path TC covering all 7 valid ECs, plus six negative TCs each isolating a single triggerable invalid EC group.

TC-01 sets `login_attempts = 1` as a pre-condition rather than 0, so a single execution verifies both EC09 (counter below threshold) and EC15 (counter resets to 0 on success) without a separate reset check.

TC-07 covers the coupled EC10/EC12 state using correct credentials as input: submitting the right password while locked is what proves the lockout mechanism overrides authentication, the core behavioral invariant of FR-02.

Full TC specifications (TC-01 to TC-07, all fields): [`domain-testing.md` - Step 3](artifacts/tests/FR-02-login-lockout/domain-testing.md)

### 2.2 Boundary Value Analysis

Two numeric variables qualify for BVA: each sits at a discrete behavioral turning point, one integer threshold and one time window.

**`login_attempts` at the lock threshold (3).** The SRS states "3 or more consecutive failures." The turning point sits between the last non-locked state (`login_attempts = 2`, the OFF point) and the first locked state (`login_attempts = 3`, the ON point). A defect that implements `> 3` instead of `>= 3` would delay the lockout by one attempt.

**`locked_until` at the 30-second lockout window.** The expiry condition is `locked_until <= datetime('now')`. Three points are tested around it: UB-1 (NOW+1s, one second remaining, must still reject), UB (NOW, exact expiry, must allow), and UB+1 (NOW-1s, one second past expiry, must allow). A defect that implements strict less-than (`locked_until < datetime('now')`) would keep the account locked exactly at expiry.

TC-BVA-03 to TC-BVA-05, which walk `locked_until` through UB-1, UB, and UB+1, double as gap probes for G1 and G2: TC-BVA-03 records whether `login_attempts` keeps incrementing while the account is locked (G2), and TC-BVA-04 / TC-BVA-05 record whether the counter resets once the account unlocks (G1). Branch-by-branch outcomes are in `bva.md`.

Full BVA specifications and DB setup protocol (TC-BVA-01 to TC-BVA-05, all fields): [`bva.md`](artifacts/tests/FR-02-login-lockout/bva.md)

### 2.3 AI Gap Analysis

| # | Missed item | Root cause |
| - | ----------- | ---------- |
| 1 | AI merged two distinguishable failure states, wrong credentials and an active lockout, into a single equivalence class (EC20, generic error). | SRS FR-02 describes both failure outputs in identical wording, so EP had no textual basis to split the class further. |

---

## 3. Feature B - FR-09: Discount Coupons

> **Technique applied:** Domain Testing (Equivalence Partitioning) + Boundary Value Analysis
> **Detailed test cases:** [`artifacts/tests/FR-09-coupon/`](artifacts/tests/FR-09-coupon/)

### 3.1 Domain Testing

#### Step 1 - Identify Input/Output Variables

FR-09 governs coupon application at checkout, enforcing five conditions simultaneously (C1 through C5): the code exists and is active, has not expired, the order total meets the minimum threshold, the user holds a valid JWT, and the user has not exhausted their per-user usage allowance. Twelve variables were identified across three categories: three user inputs (`code`, `total_amount`, `user_id`), seven system-state fields read from the database (`is_active`, `expired_at`, `min_order_amount`, `uses_by_user`, `max_uses_per_user`, `type`, `discount_value`), and two outputs (`discount_amount`, `final_amount`).

Five implicit gaps were flagged where the SRS is silent:

- **G1:** is coupon code matching case-sensitive?
- **G2:** the API accepts a client-supplied `total_amount`, but FR-08 mandates the backend recompute the order total independently. Which one governs?
- **G3:** what happens when a fixed `discount_value` exceeds `total_amount` and `final_amount` goes negative?
- **G4:** is `uses_by_user` rolled back when an order is cancelled?
- **G5:** is the `expired_at` comparison day-level or time-level, and in which time zone?

G1 and G3 are resolved by dedicated gap-probe TCs in Step 3 (TC-05 and TC-11). G2 is resolved the same way by TC-13. G5 is partially resolved: BVA in section 3.2 confirms the spec's day-level semantics (TC-BVA-07/08), while time zone is descoped as an environment-level concern, not an input-parameter boundary. G4 is deferred entirely with a documented rationale in `domain-testing.md`: rollback on cancellation is a cross-feature integration flow (web checkout + Admin order-cancel), not a Domain Testing boundary of FR-09's own variables.

Full variable table: [`domain-testing.md` - Step 1](artifacts/tests/FR-09-coupon/domain-testing.md)

#### Step 2 - Identify Equivalence Classes

Equivalence partitioning was applied across eight functional groups using three rules, producing 18 ECs total: 8 valid, 10 invalid.

**Must-Be Rule for C1, C2, C4.** Code existence and active status, expiry, and authentication are binary gates with no numeric range to partition: each condition either holds or fails outright.

**Range Rule for C3 and C5.** Both conditions are numeric comparisons (`total_amount >= min_order_amount`, `uses_by_user < max_uses_per_user`), each producing exactly two classes. These two groups are the primary BVA targets in §3.2.

**Splitting Rule for `type`.** `percent` and `fixed` trigger entirely different formula paths (`discount = total * value / 100` vs. `discount = value`). Collapsing them into one valid EC would exercise only one formula path and leave the other untested.

**Gap-driven ECs (EC04, EC18).** Wrong-case code input and a fixed discount exceeding the total cannot be derived from SRS text alone. Both are labeled gap ECs and assigned dedicated TCs to discover actual behavior rather than verify a known expected outcome.

Full EC table: [`domain-testing.md` - Step 2](artifacts/tests/FR-09-coupon/domain-testing.md)

#### Step 3 - Minimum Test Case Set

Thirteen test cases were derived using Error Isolation: two happy-path TCs, seven negative TCs each isolating one triggerable invalid EC, and four gap-probe TCs.

TC-01 and TC-02 both represent all-five-conditions-valid scenarios but must stay separate: the Splitting Rule requires one TC per `type` value. TC-01 uses `SAVE10` (`type=percent`), TC-02 uses `BIGBUY` (`type=fixed`); collapsing them would leave one formula path uncovered.

The four gap-probe TCs map directly to the Step 1 gaps: TC-05 (`code` submitted in the wrong case) probes G1, TC-11 (`discount_value > total_amount`) probes G3, and TC-13 (a client-manipulated `total_amount` far below the real cart subtotal) probes G2. TC-12 sits outside G1-G5: it targets a degenerate `total_amount = 0` / `min_order_amount = 0` intersection that AI Gap Analysis (§3.3) missed and added only after human review.

Full TC specifications (TC-01 to TC-13, all fields): [`domain-testing.md` - Step 3](artifacts/tests/FR-09-coupon/domain-testing.md)

### 3.2 Boundary Value Analysis

Three variables qualify for BVA: two continuous numeric quantities and one discrete counter, each sitting at a condition boundary from §3.1's Range Rule groups.

**`total_amount` against the minimum order threshold.** Using `SAVE10` (`min_order_amount = 300,000 VND`), three points are tested: UB-1 at 299,999 VND (must be rejected), UB at 300,000 VND (must be accepted per `>=`), and UB+1 at 300,001 VND (confirms the valid range starts exactly at the threshold). A defect implementing strict `>` instead of `>=` would reject the UB case outright, exactly the pattern BUG-09-005 exhibits.

**`uses_by_user` against the per-user usage limit.** This is a discrete counter, so the turning point is described as OFF/ON rather than UB-x: the OFF point is the last valid use (`uses = max - 1`, tested with `VIP100` at max=2), and the ON point is where `uses < max` first turns false (`uses = max`, tested at both max=1 with `SAVE10` and max=2 with `VIP100`). Testing two different max values rules out a hardcoded comparison rather than a genuine `<` check.

**`expired_at` against the current date.** The spec requires strict `<` ("before"), so a coupon expiring today must be rejected. Two points are tested: UB at today's date (must be rejected: `today < today` is false) and UB+1 at tomorrow (must be accepted). A UB-1 point (expiry yesterday) is skipped here since EC06 in Domain Testing already covers the general expired condition; BVA only needs to add value at the untested exact-boundary and day-after points. A defect implementing `<=` instead of `<` would incorrectly accept the UB case.

Full BVA specifications and setup protocol (TC-BVA-01 to TC-BVA-08, all fields): [`bva.md`](artifacts/tests/FR-09-coupon/bva.md)

### 3.3 AI Gap Analysis

| # | Missed item | Root cause |
| - | ----------- | ---------- |
| 1 | No test case covers concurrent coupon redemption by the same user: two simultaneous requests could each pass the usage-limit check before either increments the counter. | Domain Testing and BVA assume a stable, single-user system state at the time each test case runs. Neither technique has a construct for modeling concurrent state transitions. |
| 2 | AI recorded `min_order_amount >= 0` as a valid boundary in Step 1 but never derived a test case for the degenerate state where `total_amount` and `min_order_amount` are both zero. | The gap sits at the intersection of two variables' boundaries. EP evaluates each variable's range on its own and has no step that cross-multiplies boundary-valid values across variables. |
| 3 | AI flagged the FR-08/FR-09 conflict over which `total_amount` governs, client-supplied or backend-recomputed, as an implicit gap, then never converted it into a test case. | EP derives test cases from stated spec conditions. Testing whether the backend trusts manipulated client input is a security probe, a category outside what EP/BVA generates. |

---

## 4. Feature C: FR-16 - Import Sản phẩm từ CSV

> **Technique applied:** Domain Testing (Equivalence Partitioning) + Boundary Value Analysis  
> **Detailed test cases:** [`artifacts/tests/FR-16-csv-import/`](artifacts/tests/FR-16-csv-import/)  
> **Test data files:** [`artifacts/tests/FR-16-csv-import/test-data/`](artifacts/tests/FR-16-csv-import/test-data/)

### 4.1 Domain Testing

#### Step 1 - Identify Input/Output Variables

FR-16 lets Admin import multiple products in one request. The SRS describes uploading a CSV file (`.csv` extension, RFC 4180 header row), but the API spec accepts a JSON body `{"products": [...]}` instead: CSV parsing happens at the frontend, and the backend only ever sees JSON. Ten variables were identified: three tester-controlled inputs (`products` array, `name`, `price`), three optional per-row inputs (`description`, `imageUrl`, `category_id`), one system-state precondition (category existence in the DB), and three outputs (Authorization gate, atomic rollback behavior, import report).

Seven implicit gaps were flagged where the SRS is silent or conflicts with the API spec:

- **G1:** the SRS says upload a `.csv` file, the API spec says send JSON. Does the Admin UI actually enforce the `.csv` extension before converting to JSON?
- **G2:** FR-15 requires `category_id` to reference an existing category, but FR-16 does not repeat this constraint. Does the import endpoint validate it?
- **G3:** FR-15 caps `name` at 255 characters; FR-16 is silent. Does the import endpoint enforce this cross-reference limit?
- **G4:** what happens when `products: []` (an empty array) is submitted?
- **G5:** does the backend coerce a CSV-parsed, string-typed `price` (e.g. `"10000"`) to a number, or reject it?
- **G6:** the API spec gives no example response body for this endpoint. What fields does the import report actually return?
- **G7:** when every row in a batch fails, does the report list a reason for each row, or only the first?

All seven gaps are resolved by dedicated gap-probe TCs in Step 3: G1 by TC-19, G2 by TC-15, G3 by TC-14 (plus the BVA boundary probes in §4.2), G4 by TC-13, G5 by TC-16, G6 by TC-17, G7 by TC-18.

Full variable table: [`domain-testing.md` - Step 1](artifacts/tests/FR-16-csv-import/domain-testing.md)

#### Step 2 - Identify Equivalence Classes

Equivalence partitioning was applied across eight functional groups, producing 23 ECs total: 7 valid, 16 invalid.

**Must-Be Rule for Authorization, `products` key, and `name` presence.** These are binary gates with no range to partition: a JWT is present or not, the `products` key exists or not, `name` is empty or absent or not.

**Range Rule for `price`.** The constraint `price > 0` splits cleanly into a valid region (positive numbers) and an invalid region (zero, negative, non-numeric, absent), five invalid ECs against one valid EC, each isolated to its own TC.

**Gap Rule for `category_id`, `name` length, and file extension.** Whether a non-existent `category_id` is rejected, whether the FR-15 255-char cap is enforced, and whether the `.csv` extension is enforced client-side cannot be derived from FR-16's text alone. Each is a Gap EC (EC17, EC10, EC23) with a dedicated gap-probe TC and a multi-branch expected result rather than one definitive assertion.

**Splitting Rule for Atomic Rollback and Import Report.** EC18/EC19 (all-valid commit vs. any-invalid full rollback) and EC20/EC21 (success report vs. failure report with per-row reasons) are each split into two ECs, since collapsing either pair would leave one branch of the system's output behavior unverified.

Full EC table: [`domain-testing.md` - Step 2](artifacts/tests/FR-16-csv-import/domain-testing.md)

#### Step 3 - Minimum Test Case Set

Nineteen test cases were derived: twelve base EP TCs using Error Isolation, four AI-generated gap-probe TCs, and three student-added gap-probe TCs.

TC-01 and TC-02 both cover the all-valid happy path but stay separate: TC-01 imports a single product, TC-02 imports a batch of three, confirming the commit behavior holds at both batch sizes rather than only the trivial one-row case. TC-12 is the atomicity check: a mixed batch of [valid, invalid, valid] rows must commit zero products, proving the SUT rolls back the whole transaction rather than committing row by row.

The seven gap-probe TCs map one to one with the Step 1 gaps: TC-13 (`products: []`) probes G4, TC-14 (`name` at 256 chars) probes G3, TC-15 (non-existent `category_id`) probes G2, TC-16 (`price` as a numeric string) probes G5, TC-17 (raw response schema recording) probes G6, TC-18 (all-rows-invalid batch) probes G7, and TC-19 (wrong file extension with JSON network inspection) probes G1.

Full TC specifications (TC-01 to TC-19, all fields): [`domain-testing.md` - Step 3](artifacts/tests/FR-16-csv-import/domain-testing.md)

### 4.2 Boundary Value Analysis

Two variables qualify for BVA: one discrete integer boundary and one cross-reference length boundary.

**`price` at the zero/positive turning point.** The constraint is `price > 0`, so the turning point sits directly between 0 and 1: the OFF point is `price = 0` (must be rejected, still invalid) and the ON point is `price = 1` (must be accepted, the smallest valid value). A defect implementing `price >= 0` would let a zero-priced product through silently.

**`name` length at the FR-15 255-character cross-reference cap.** Three points are tested: UB-1 at 254 characters (must always be accepted, regardless of enforcement), UB at 255 characters (must be accepted if the cap is implemented as `<= 255`), and UB+1 at 256 characters, the diagnostic point: acceptance here confirms FR-16 does not enforce the FR-15 constraint at all, since G3 in Step 1 left this unresolved.

Full BVA specifications and setup protocol (TC-BVA-01 to TC-BVA-05, all fields): [`bva.md`](artifacts/tests/FR-16-csv-import/bva.md)

### 4.3 AI Gap Analysis

| # | Missed item | Root cause |
| - | ----------- | ---------- |
| 1 | AI noted the API spec gives no example response body for the import endpoint, but never derived a test case to record the actual schema before writing assertions against report fields. | Step 3 applies Error Isolation to invalid inputs. An observational schema probe uses a valid input with no error to isolate, so it falls outside that generation pattern. |
| 2 | AI covered a mixed valid/invalid batch for rollback but never tested an all-invalid batch, leaving early-exit vs. full-row-scan behavior unverified. | The mixed-batch case already satisfied EC coverage for "any invalid row triggers rollback." Minimizing by EC coverage suppressed a behaviorally distinct case sharing the same EC. |
| 3 | AI recorded the SRS/API-spec conflict over file format, `.csv` upload vs. JSON body, as an implicit gap, but never tested whether the Admin UI enforces the `.csv` extension. | Same pattern as items 1 and 2: Step 1's gap list and Step 3's test-case set were produced independently, with no step cross-checking one against the other. |

---

## 5. Feature D - FR-20: Hủy Đơn Hàng (Mobile)

> **Technique applied:** Domain Testing (Equivalence Partitioning) + Boundary Value Analysis  
> **Detailed test cases:** [`artifacts/tests/FR-20-cancel-order-mobile/`](artifacts/tests/FR-20-cancel-order-mobile/)

### 5.1 Domain Testing

Unlike FR-02/FR-09/FR-16 (spec-only design), FR-20's design was grounded in a real UI survey performed with `playwright-cli` against `apps/frontend-mobile`'s Expo web build (`http://localhost:8081`), because the mobile app's `Hủy đơn` control, its conditional visibility per status, and the absence of any confirmation step could not be reliably inferred from `srs.md` prose alone.

#### Step 1 - Identify Input/Output Variables

FR-20 lets a user cancel their own order from the mobile app. Per FR-10, cancellation is only allowed while `order.status` is `pending` or `confirmed`. Seven variables were identified: three inputs (`auth_token`, `order_id`, `cancel_action`), two system states (`order.status`, `order_owner_match`), one conditional input (`confirm_dialog_response`, present only if a confirm UI exists), and one output (`result`, the post-attempt status plus UI feedback).

Three implicit gaps were flagged:

- **G1:** the spec does not state whether `PUT /api/orders/:id/cancel` checks order ownership. FR-11 restricts *viewing* orders to the owner but is silent on *cancel*, an IDOR risk if unchecked.
- **G2:** a Spec Conflict at `order.status = shipping`. SRS FR-20/FR-10 forbids user-cancel here ("only Admin can act"), but API spec section 4.6 describes the endpoint as usable "while not yet delivered," which implicitly permits `shipping` too.
- **G3:** whether a confirmation dialog exists before cancel. FR-24 mandates one for cart-item deletion, an equally destructive action, but FR-20 is silent.

All three gaps are resolved by dedicated gap-probe TCs in Step 3: G1 by TC-08, G2 by TC-07 (plus the matched-boundary BVA probe in §5.2), G3 by TC-09.

Full variable table: [`domain-testing.md` - Step 1](artifacts/tests/FR-20-cancel-order-mobile/domain-testing.md)

#### Step 2 - Identify Equivalence Classes

Equivalence partitioning was applied across six functional groups, producing 17 ECs total: 8 valid, 8 invalid, plus one dual-outcome assertion.

**Splitting Rule isolates `shipping` (EC03) from the general non-cancelable group.** `shipping`, `delivered`, and `canceled` all produce a "cannot cancel" outcome, but `shipping` is split into its own class because it is the exact Spec Conflict target from G2. Collapsing it into a general invalid-state class would mask the SRS-vs-API-spec disagreement behind an ordinary assertion.

**Must-Be Rule for `auth_token`, `order_owner_match`, and `order_id`.** Each is a binary gate with no numeric range, producing one valid and one invalid class per group. EC09 (order not owned by the caller) is a Gap-type EC alongside EC03, since neither has a spec-stated expected outcome.

**Gap Rule for `confirm_dialog_response` (EC12, EC13).** The spec is silent on whether a confirm dialog exists at all, so both branches are provisional classes pending empirical discovery rather than classes derived from a documented rule.

**Output group for `result` (EC14-EC16), separate Must-Be Rule for EC17.** EC14-EC16 partition the output by response shape (success, business-rule error, auth error) and are verified present or absent within the TCs that trigger the corresponding input EC. EC17 stands apart from that group: it is a single Must-Be assertion with two possible outcomes, status labels color-distinguished or all rendering identically, not an output-shape split, since only one test action exists, a visual comparison across existing orders, not two independently triggerable inputs. It comes directly from FR-11's explicit "phân biệt màu sắc" requirement on the same `result` variable, not an invented rule.

Full EC table: [`domain-testing.md` - Step 2](artifacts/tests/FR-20-cancel-order-mobile/domain-testing.md)

#### Step 3 - Minimum Test Case Set

Ten test cases were derived: two happy-path TCs (`pending`, `confirmed`), four negative TCs each isolating one triggerable invalid EC, three gap-probe TCs discovering actual behavior at each Step 1 gap, and one cross-feature check added after gap analysis (EC17, FR-11 color distinction).

TC-05, TC-06, TC-07, and TC-08 all carry a UI Fallback Note: the mobile app stores its JWT only in memory (confirmed empty in `localStorage`/`sessionStorage` during the UI survey) and never exposes a free-typed `order_id` or another user's order in the UI, so these scenarios have no reachable UI path and run as direct API calls instead. TC-07 and TC-BVA-02 (§5.2) target the same `shipping` Spec Conflict from two angles: an isolated EC assertion versus a matched-boundary comparison against `confirmed`.

Full TC specifications (TC-01 to TC-10, all fields): [`domain-testing.md` - Step 3](artifacts/tests/FR-20-cancel-order-mobile/domain-testing.md)

### 5.2 Boundary Value Analysis

FR-20 has no numeric input: no counters, timers, or amounts govern the cancel decision, so classic range-based BVA does not apply to most variables. The one variable worth a boundary analysis is `order.status`, and applying BVA to it is itself an extension of the technique: FR-10 defines `order.status` as an ordered sequence (`pending → confirmed → shipping → delivered`) rather than a numeric range, so this is BVA generalized to an ordinal variable, closer in spirit to State Transition Testing than to classic numeric BVA. The turning-point framing still earns its place here because the cancel rule draws a hard line partway through that sequence, allowed for the first two states, forbidden from the third onward, exactly the shape BVA targets: the point where an off-by-one or wrong-operator mistake is most likely and most consequential. It also sits at the same Spec Conflict flagged in G2.

Domain Testing already covers each state as an isolated EC. BVA adds value here by testing the adjacent pair straddling the critical boundary (`confirmed` vs. `shipping`) under matched conditions, naming the precise wrong-operator defect each TC targets.

**`confirmed`/`shipping` at the critical boundary.** UB is `confirmed`, the last allowed state: an off-by-one implementation could wrongly exclude it from the allowed set. UB+1 is `shipping`, the first forbidden state and the exact Spec Conflict target: a wrong-operator deny-list (`status !== 'delivered'`) would silently permit it instead of the correct allow-list (`status in ['pending', 'confirmed']`).

**`pending`/`delivered` at the outer ends.** LB is `pending`, the first allowed state, subject to the same off-by-one risk from the other direction. UB+2 is `delivered`, the second forbidden state: this catches a fix for the UB+1 case that is too narrow, for example a deny check that special-cases only `shipping` and fails to generalize further along the chain.

Full BVA specifications and setup protocol (TC-BVA-01 to TC-BVA-04, all fields): [`bva.md`](artifacts/tests/FR-20-cancel-order-mobile/bva.md)

### 5.3 AI Gap Analysis

| # | Missed item | Root cause |
| - | ----------- | ---------- |
| 1 | AI extended FR-11's status-label requirement to the Vietnamese-translation half but not the color-distinction half specified in the same sentence. | FR-11 bundles two sub-requirements, text content and visual styling, into one line of spec text. The Must-Be Rule captured only the clause it was applied to. |

---

## 6. AI Critique (200–300 words)

_Điền sau khi hoàn thành quá trình dùng AI._

> **Hướng dẫn:** Viết 200–300 từ trả lời:
>
> - AI sai, thiên lệch, hoặc bỏ sót ở đâu?
> - Tại sao AI không bắt được vấn đề đó?
> - Nguyên tắc nào về cộng tác với AI bạn rút ra được?

---

## References

- ISTQB Foundation Level Syllabus (latest edition).
- Hardman, P. (2025). _A Post-AI Learning Taxonomy._
- Fuster Rabella, M. (2025). _OECD Education Working Paper No. 338._
- Anthropic (2025). _Building Reliable AI Test Agents_ — engineering blog.
- Kharbach, M. (2026). _AI Use Policy Templates for Higher Education._ CC BY-NC-SA 4.0.
- DeepEval & Promptfoo documentation — LLM testing frameworks.
