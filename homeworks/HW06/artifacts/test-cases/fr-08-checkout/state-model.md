# FR-08 `POST /api/checkout` — State / Lifecycle Model

## Classification

No meaningful state — lifecycle adaptation.

Justification: per `references/state-transition-testing.md`, "a state model is valid
only when the same event can produce different behavior depending on current state,"
with documented actions and guards for each cell. srs.md FR-08 (lines 102-108) documents
exactly one directed transition for this endpoint: a non-empty cart plus a successful
`POST /api/checkout` call produces an order and clears the cart (lines 104-108). It does
**not** document a second, distinguishable behavior for the complementary case
(`POST /api/checkout` against an already-empty cart) — that outcome is entirely
unstated, not asserted to differ. This is unlike FR-02's login lockout, where SRS
explicitly names three distinct counter-driven states with explicit guards and actions
("tăng bộ đếm lên đúng 1 đơn vị", "tạm khóa 30 giây"). Here there is only one documented
transition and one unspecified cell, which is a single lifecycle side-effect (cart
contents -> order, with a clearing side effect), not a validated multi-state machine.
Per the skill's Stage 3 rule, this is modeled as a lifecycle adaptation rather than an
explicit/implicit state table; empty and unspecified cells are not invented as valid
next states (`references/state-transition-testing.md`).

## Lifecycle cases

| Row ID | Scenario | Expected behavior | Trace |
| --- | --- | --- | --- |
| S-01 | Checkout a fresh non-empty cart (>=1 item) with a valid token | Order created from cart contents; cart cleared on success | srs.md FR-08 lines 104-108 |
| S-02 | Immediately repeat `POST /api/checkout` against the same cart right after S-01's success (cart is now empty as a direct result of the prior call) | UNSPECIFIED — srs.md documents the clear-on-success rule but is silent on the outcome of a subsequent call against an already-emptied cart (reject with an error, silently no-op, or create an empty order) | Mandatory coverage group; srs.md FR-08 silent on repeat-call behavior |
| S-03 | Call `POST /api/checkout` on a cart that has never held any items (brand-new user, first-ever call — empty state reached without a prior successful checkout) | UNSPECIFIED — same undocumented outcome class as S-02; included to check whether behavior is consistent regardless of *how* the empty state was reached (post-clear vs. never-populated) | srs.md FR-08 silent; srs.md FR-07 line 100 (documented empty-cart state exists as a reachable UI state, supporting that this precondition is real, not synthetic) |
| S-04 | Ordering / race: issue two `POST /api/checkout` calls back-to-back against the same non-empty cart before either response is observed (double-submit) | UNSPECIFIED — no source documents idempotency, locking, or double-submit handling for checkout; at most one call plausibly succeeds if the clear step is atomic, but this is an inference from the single documented S-01 transition, not an asserted rule. Recorded as a design-time race scenario, not a confirmed requirement | srs.md FR-08 lines 104-108 (single documented transition only) |
| S-05 | Isolation: User A checks out; verify User B's separate cart and any of User B's prior orders are unaffected (plain business-flow isolation, no adversarial token substitution) | Documented: each user has their own cart (FR-07 frames the cart as belonging to "người dùng"); User A's checkout must not alter User B's cart/order state | srs.md FR-07 lines 93-100; FR-08 lines 104-108. Adversarial/cross-token variant of this same isolation property is covered separately in `security-cases.md` (SEC-02-extended(a), IDOR) |

## Notes

- State-transition coverage (`TR-*`, all-transitions) is **not applicable** — no
  explicit/implicit state table was built. Coverage for this endpoint is reported under
  lifecycle scenarios (S-01..S-05) in the master suite's coverage gate, not under
  `TR` ids.
- S-02/S-03 intentionally do not assert an expected status code or body; the master
  suite carries the "UNSPECIFIED — record actual behavior, do not assume" caveat into
  the oracle column for both, matching the login FR-02 precedent for unresolved finish
  states.
