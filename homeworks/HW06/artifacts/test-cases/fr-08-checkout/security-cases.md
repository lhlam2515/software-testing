# FR-08 `POST /api/checkout` — Security Cases

Applicable SEC ids per `specs/security-requirement.md`: SEC-02 (auth required),
SEC-02-extended (IDOR; server-side `total_amount` recompute), SEC-05 (parameterized
queries).

| Row ID | SEC-ID | Asset / invariant | Principal | Vector | Payload / condition | Expected control and observable oracle | Trace |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SEC-C-01 | SEC-02 | Checkout must not execute for an unauthenticated caller | Anonymous (no credentials) | `Authorization` header | Header entirely absent | Request rejected before any cart/order side effect. Observable oracle: no new order is created; the target cart (if any) is not cleared. Exact status code UNSPECIFIED | api_specification.md line 141; srs.md FR-08 line 104 |
| SEC-C-02 | SEC-02 | Checkout must not execute with a syntactically invalid token | Anonymous, presenting a garbage credential | `Authorization` header | `Authorization: Bearer not-a-real-token` | Rejected; no cart/order side effect. Status code UNSPECIFIED | api_specification.md line 141; srs.md FR-08 line 104 |
| SEC-C-03 | SEC-02 | Checkout must not execute with a well-formed but invalid (bad-signature) token | Attacker holding a forged/tampered JWT | `Authorization` header | Three-segment JWT with a valid-looking header/payload but an invalid signature | Rejected; no cart/order side effect. Status code UNSPECIFIED | api_specification.md line 141; srs.md FR-08 line 104 |
| SEC-C-04 | SEC-02 | Checkout must not execute with an expired credential | Previously-authenticated user whose session/token has expired | `Authorization` header | Token issued and then used past its expiry (exact expiry duration UNSPECIFIED per `specs/requirements.md`; construct as an execution-time concern, not a fixed value here) | Rejected; no cart/order side effect. Status code UNSPECIFIED | api_specification.md line 141; srs.md FR-08 line 104; token expiry itself flagged unspecified in `specs/requirements.md` |
| SEC-C-05 | SEC-02-extended(a) — IDOR | Cross-user cart/order isolation: a caller must only be able to check out the cart tied to their own token identity | User A (valid token), targeting User B's cart | Request body | Valid non-empty carts exist for both User A and User B (different item sets). Body additionally includes an undocumented identity-shaped field, e.g. `"user_id": <B's id>` or `"cart_id": <B's cart id>`, alongside User A's valid token | Server must derive the cart/order owner from the JWT identity only, ignoring any client-supplied identity field. Observable oracle: the resulting order (if any) belongs to User A and reflects only User A's cart contents; User B's cart and any of User B's existing orders are byte-for-byte unchanged after the call | srs.md FR-07 lines 93-100 (cart belongs to the user); FR-08 lines 104-108 (no cart/user id parameter is documented for this endpoint, so identity must come from the token) |
| SEC-C-06 | SEC-02-extended(b) — server-side recompute | Integrity of the charged/recorded total: a client must not be able to under-report the amount owed | Authenticated user submitting a tampered total on their own cart | Request body | Non-empty cart with a real, server-computable total (e.g. cart total = 500,000₫); body sets `"total_amount": 1` | Server ignores the submitted `total_amount` and computes the real total from cart contents. Observable oracle: the resulting order's recorded/charged total (however exposed — response body, `GET /api/orders/my-orders`, or `GET /api/orders/:id`) equals the real cart total, never `1` | srs.md FR-08 line 107 |
| SEC-C-07 | SEC-05 | Backend must not be exploitable via unparameterized `shipping_address` handling | Authenticated user submitting a crafted string in a field they legitimately control | Request body — `shipping_address` | Non-empty cart; `shipping_address: "' OR '1'='1"` (boolean-tautology probe, non-destructive) | Parameterized query treats the payload as an inert literal string. Observable oracle: no SQL error is surfaced to the client, no unauthorized rows/data are returned or altered, and either the checkout proceeds with the literal string stored as the address or is rejected by ordinary validation — but never with a raw DB error or data leak | srs.md line 282 (SEC-05); shipping_address is a reachable free-text field per api_specification.md 4.3 |
| SEC-C-08 | SEC-05 | Same as SEC-C-07, comment-truncation variant | Authenticated user submitting a crafted string in a field they legitimately control | Request body — `shipping_address` | Non-empty cart; `shipping_address: "123 Le Loi'; --"` (comment-truncation probe, non-destructive) | Same control and oracle as SEC-C-07 | srs.md line 282 (SEC-05) |

## Notes

- SEC-C-05 and SEC-C-06 are the two FR-08-specific requirements grouped under
  SEC-02-extended in `specs/security-requirement.md` (no numbered SEC-01..07 id covers
  either directly).
- SEC-C-05's plain, non-adversarial counterpart (isolation without an injected identity
  field) is covered as a lifecycle scenario in `state-model.md` (S-05) rather than
  duplicated here.
- SEC-01, SEC-03, SEC-04, SEC-06, SEC-07 have no cases — marked not applicable in
  `specs/security-requirement.md` with a stated reason for each.
