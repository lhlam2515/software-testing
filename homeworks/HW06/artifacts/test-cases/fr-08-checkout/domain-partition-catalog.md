# FR-08 `POST /api/checkout` — Domain Partition Catalog (EP + BVA)

Source: `docs/eshop-sut/api_specification.md` section 4.3 (lines 151-161) and section 4
header (line 131); `docs/eshop-sut/srs.md` FR-08 (lines 102-108), FR-07 (lines 93-100).

## BVA model

No numeric range or string-length boundary is documented anywhere for this endpoint's
request body (`total_amount`, `shipping_address`) — no source states a maximum
`shipping_address` length or a valid `total_amount` range, so no length/numeric BVA is
applied to either field (per the generator's own method reference
`.agents/skills/api-test-generator/references/equivalence-partitioning-and-bva.md`:
"Do not invent a maximum length or precision"). That file is a **methodology
reference, not an oracle** — cite `api_specification.md` 4.3 lines 156-161 as the
Trace for these classes, never the method document.

A boundary does exist at the resource-precondition level, but not for the reason
originally recorded here. Cart item count is an ordered integer domain with a natural
minimum at 0 because a cart either holds lines or holds none — **not** because of
FR-07 line 100, which only requires the cart *screen* to render an illustration and
message when empty and says nothing about API behavior. **2-value BVA** is applied to
the count: boundary (`LB = 0`, empty cart) and the nearest value across the boundary
(`LB+1 = 1`, smallest non-empty cart), using 1 item as the domain's real smallest step.

Reachability constraint for `LB = 0`: section 4 documents no cart-clear or item-delete
endpoint (only `GET /api/cart` 4.1 line 135 and `POST /api/cart` 4.2 line 139), so an
empty cart is reachable only via a never-populated account or immediately after a
successful checkout. Any case using this boundary must name which path it takes.
The *outcome* of checking out an empty cart is undefined in every source — the
boundary is testable, the expected result is not.

## Catalog

| Row ID | Variable | Location | Coverage ID | Class / boundary position | Concrete value or rule | Expected behavior | Trace |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P-01 | `shipping_address` | body | EC-01 | Valid non-empty string, typical length | `"123 Le Loi, TP.HCM"` | Accepted — documented example value | api_specification.md 4.3 lines 158-160 |
| P-02 | `shipping_address` | body | EC-02 | Empty string | `""` | UNSPECIFIED — no source states whether an empty address is rejected | Mandatory coverage group; unspecified per `specs/requirements.md` |
| P-03 | `shipping_address` | body | EC-03 | Missing (key absent from body) | field omitted | UNSPECIFIED — required/optional status not documented | `specs/requirements.md` |
| P-04 | `shipping_address` | body | EC-04 | Null | `null` | UNSPECIFIED | `specs/requirements.md` |
| P-05 | `shipping_address` | body | EC-05 | Atypically long string (no documented max) | e.g. 5,000-character string | UNSPECIFIED — no documented maximum length exists to violate; class exists to observe undocumented behavior, not to assert a boundary | Mandatory coverage group; `equivalence-partitioning-and-bva.md` ("do not invent a maximum length") |
| P-06 | `shipping_address` | body | EC-06 | Wrong type | number, e.g. `12345` | UNSPECIFIED — malformed/wrong-type class; contract's example shows a string | api_specification.md 4.3 |
| P-07 | `total_amount` | body | EC-07 | Valid number matching the real cart total | e.g. `200000` | Documented: server recomputes the total itself regardless of this value (client value is not authoritative) | srs.md FR-08 line 107 |
| P-08 | `total_amount` | body | EC-08 | Valid number NOT matching the real cart total (tampered/lower) | e.g. `1` | Documented: ignored — server-recomputed real cart total is used, not the submitted value | srs.md FR-08 line 107; cross-referenced as SEC-02-extended(b) in `security-cases.md` |
| P-09 | `total_amount` | body | EC-09 | Missing (key absent) | field omitted | UNSPECIFIED whether request is rejected for a missing field before recompute, or simply proceeds since the value is documented as ignored | `specs/requirements.md` |
| P-10 | `total_amount` | body | EC-10 | Negative or zero | `-1`, `0` | UNSPECIFIED whether rejected by a validation layer, or silently ignored per the recompute rule | srs.md FR-08 line 107; `specs/requirements.md` |
| P-11 | `total_amount` | body | EC-11 | Wrong type | string, e.g. `"abc"` | UNSPECIFIED | `specs/requirements.md` |
| P-12 | `Authorization` header | header | EC-12 | Valid token belonging to the requesting user | `Bearer <valid-token>` | Accepted — request may proceed to cart/order logic | api_specification.md line 131; srs.md FR-08 line 104 |
| P-13 | `Authorization` header | header | EC-13 | Missing header | header absent | Rejected — auth required (exact status code UNSPECIFIED) | api_specification.md line 131; srs.md FR-08 line 104 |
| P-14 | `Authorization` header | header | EC-14 | Malformed/invalid token | garbage string, expired-shaped, or wrong-scheme value | Rejected — auth required (exact status code UNSPECIFIED) | api_specification.md line 131; srs.md FR-08 line 104 |
| P-15 | Cart state (server-side precondition, no request parameter) | precondition | BVA-01 (LB = 0) | Empty cart | 0 items in the authenticated user's cart | UNSPECIFIED — no source states whether checkout on an empty cart is rejected (e.g. an "empty cart" error) or otherwise handled | Mandatory coverage group; reachability via `GET /api/cart` (api_specification.md 4.1 line 135) and `POST /api/cart` (4.2 line 139) — section 4 documents no cart-clear endpoint, so a 0-item cart is reachable only via a never-populated account or immediately after a successful checkout; `srs.md` FR-08 lines 102-108 silent on the outcome. Do **not** cite FR-07 line 100 here: it governs the cart screen's empty-state display, not API behavior |
| P-16 | Cart state (server-side precondition, no request parameter) | precondition | BVA-02 (LB+1 = 1) | Smallest non-empty cart | 1 item, quantity 1, in the authenticated user's cart | Documented: checkout may proceed; order created from cart contents; cart cleared on success | srs.md FR-08 lines 104-108; FR-07 lines 93-100 |

## Notes

- `total_amount` (P-07..P-11) is unusual: the specification's rule is that the client
  value is never authoritative for the final total (srs.md FR-08 line 107), regardless
  of class. The EP classes above still isolate distinct *submitted* shapes (valid,
  tampered, missing, out-of-range, wrong-type) because it is undocumented whether a
  malformed/missing `total_amount` causes a request-level rejection *before* the
  server reaches the "ignore and recompute" step, versus being silently absorbed. Both
  outcomes are consistent with the documented text; recorded as unspecified rather than
  asserted.
- Cart *contents* (item mix, quantities > 1, multiple distinct products) are not
  separately partitioned here because FR-08 does not document any checkout behavior
  that varies by cart composition beyond "non-empty" vs "empty" — the total is always
  server-recomputed regardless of composition (srs.md FR-08 line 107).

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
