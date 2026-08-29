# FR-08 Checkout - Requirements Extract

Source: `docs/eshop-sut/api_specification.md` section 4.3 (Đặt hàng / Checkout, lines
151-161), plus the section 4 header (line 131: `Authorization: Bearer <token>` required
for all of section 4); `docs/eshop-sut/srs.md` FR-08 (lines 102-108); FR-07 (lines 93-100,
cart context); FR-10 (lines 141-162, order state machine, for the post-checkout order
state).

## Functional behavior

- User submits a JSON body to `POST /api/checkout` (api_specification.md 4.3). The
  documented example body has two fields: `total_amount` and `shipping_address`
  (api_specification.md 4.3, lines 156-161).
- Only a logged-in user may check out (srs.md FR-08, line 104). The endpoint is also
  covered by the section-4 blanket rule requiring `Authorization: Bearer <token>`
  (api_specification.md line 131).
- The payment total is computed automatically from the cart and is not directly
  editable by the user in the UI (srs.md FR-08, line 105).
- The UI must display the full list of purchased products (srs.md FR-08, line 106).
  This is a UI-layer requirement; whether the API response echoes the item list is not
  documented — recorded as unspecified for API-level testing.
- The backend must recompute the total itself; it must not accept a client-submitted
  `total_amount` (srs.md FR-08, line 107). This is the authoritative rule for the
  `total_amount` field: any client value is documented as not authoritative for the
  resulting order total, regardless of whether it is valid, missing, zero, negative, or
  of the wrong type.
- After a successful checkout, the cart is cleared (srs.md FR-08, line 108).
- FR-07 (Shopping Cart, srs.md lines 93-100) describes the cart *screen*: product
  lines with quantity, the delete-confirmation dialog, the "Tổng cộng" total label, and
  an illustration/message for the empty state (line 100). These are UI-layer
  requirements. FR-07 does **not** state that a cart belongs to a single user, and
  line 100 does **not** govern how `POST /api/checkout` handles an empty cart — it must
  not be cited as a Trace for API behavior. An empty cart is still a legitimate
  precondition, but its reachability comes from the documented cart endpoints
  (`GET /api/cart`, api_specification.md 4.1 line 135; `POST /api/cart`, 4.2 line 139):
  section 4 documents no cart-clear or item-delete endpoint, so a 0-item cart is
  reachable only via a never-populated account or immediately after a successful
  checkout. No source defines the outcome of checking out an empty cart.
- FR-10 (srs.md lines 141-162) documents a 5-state order lifecycle
  (`pending -> confirmed -> shipping -> delivered`, with `canceled` reachable from
  `pending`/`confirmed`). The diagram's first node, `pending`, has no incoming
  transition from any other order state, which is the only documented anchor for where
  a newly created order lands; no source explicitly states "checkout creates an order
  with status = pending."

## Business rules

- Auth required to check out (srs.md FR-08 line 104; api_specification.md line 131).
- `total_amount` is server-recomputed; client value is ignored for the resulting total
  (srs.md FR-08 line 107).
- Cart is cleared after a successful checkout (srs.md FR-08 line 108).

## Unspecified constraints (do not invent)

- HTTP status code and body shape for a successful checkout (no example given in
  api_specification.md 4.3, unlike sections 1.1/1.2 which document example success
  bodies).
- HTTP status code and error-body shape for: missing/invalid auth, empty cart,
  malformed/over-length `shipping_address`, missing `shipping_address`.
- Whether `shipping_address` is required on this endpoint, and its maximum length.
- Whether `total_amount` is required in the request schema, and whether a
  malformed/wrong-type value (e.g. negative, non-numeric, absent) is rejected before
  the server-side recompute happens or is simply ignored and overwritten.
- Whether the created order object is returned in the checkout response, and if so, its
  field names (id, status, items, computed total, timestamps).
- Whether `pending` is literally the initial status assigned at checkout (inferred only
  from FR-10's diagram topology, not asserted by any FR-08 text).
- Whether a repeated checkout call against an already-emptied cart is rejected (e.g.
  "cart is empty" error) or is a no-op that still returns 200 with an empty order —
  FR-08 only documents the clear-on-success rule, not the behavior of calling checkout
  again afterward.
- No error envelope (field names, structure) is documented anywhere in
  api_specification.md for any endpoint.

## State classification

No meaningful state at the request-parameter level for a state-transition model in the
sense of `references/state-transition-testing.md` (no named status field is accepted or
returned by this endpoint itself). However, this endpoint is the trigger for a
documented resource-lifecycle transition — cart contents -> order — and a repeat-call
scenario against an already-emptied cart. Per the skill's Stage 3 rule, this is modeled
as a **lifecycle adaptation**, not an explicit/implicit state machine, because the
cart-to-order transition has only one directed edge documented (no cart states, guards,
or reverse transitions are described — only a single before/after side effect). See
`../state-model.md`.

---

## Corrections applied (Pass 2 audit, `audit/audit-log-v2.md`)

- `api_specification.md` **line 141 -> line 131**. Line 141 is a blank line inside the
  section 4.2 body block; the section 4 header requiring `Authorization: Bearer <token>`
  is at line 131. The original error originated in `specs/requirements.md` and propagated
  into `domain-partition-catalog.md`, `specs/security-requirement.md`, and eight rows of
  `master-test-cases.md`.
- `srs.md` **FR-07 line 100 re-scoped**. That line ("Giỏ hàng trống phải có hình minh họa
  và thông báo rõ ràng") is a cart-screen display requirement. It does not govern
  `POST /api/checkout` behavior and must not be cited as a Trace for API expectations.

`master-test-cases.md` and the Pass 1 artifacts under `audit/` are deliberately left
unchanged: they are the audited baseline and the evidence the Pass 2 findings point at.
Corrected test-case text lives in `audit/audited-master-test-cases-v2.md`.
