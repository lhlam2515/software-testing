# FR-15 `POST/PUT/DELETE /api/products(/:id)` — Security Requirement Applicability

Source: `docs/eshop-sut/srs.md` section 9 "Yêu cầu Bảo mật" (SEC-01 through SEC-07, lines
274-284); `docs/eshop-sut/srs.md` FR-12 (lines 174-179) and FR-15 (lines 191-198).

| SEC-ID | Requirement | Applies? | Reason / attack surface |
| --- | --- | --- | --- |
| SEC-01 | Password must not be stored/exposed as plaintext (srs.md line 278) | No | Neither the documented request body (`name`, `price`, `description`, `imageUrl`, `category_id`, api_specification.md lines 108-118) nor any documented response for these operations contains a password or credential field. |
| SEC-02 | Secured APIs must require a valid JWT (srs.md line 279) | Yes | Direct match: srs.md FR-12 line 177 explicitly names `POST/PUT/DELETE /api/products` as requiring a valid JWT. Missing/malformed/expired-shaped token cases are in scope on all three operations. |
| SEC-03 | Admin APIs must check `role = 'admin'` in the token, not just token presence (srs.md line 280) | Yes | Direct match: srs.md FR-12 line 179 explicitly states this endpoint group needs `role = 'admin'` in the token, not merely token existence. A valid non-admin (customer) JWT presented to any of the three operations is the canonical test — token is well-formed and unexpired, but the role claim fails the check. |
| SEC-04 | User input displayed in the UI must be escaped, no raw `innerHTML` (srs.md line 281) | No | These three operations return JSON, not rendered HTML (same reasoning as the FR-08 checkout suite). Whether `name`/`description` are later rendered unescaped on a storefront product page is a rendering-layer concern of that other screen (`GET /api/products`, section 3.1/3.2), not observable at this endpoint's API scope. |
| SEC-05 | DB queries must use parameterized queries, not string concatenation (srs.md line 282) | Yes | `name`, `description`, and `imageUrl` are reachable free-text string inputs that are persisted (create/update explicitly stores them per FR-15). Concrete SQL injection payloads on these fields are in scope for POST and PUT. |
| SEC-06 | Profile-update API must not allow client to change `role` (srs.md line 283, literal text names `PUT /api/users/me`) | Yes (extended) | The literal SRS text names the profile-update endpoint (FR-04) specifically, so this row is a generalized reading of the mass-assignment principle, not a direct textual match — flagged the same way the FR-08 suite extended SEC-02 to an FR-08-specific rule. No `role`/admin field is documented in the FR-15 request body (api_specification.md lines 108-118), so the assertable claim is narrower than SEC-06's literal wording: an injected `role`/`is_admin`/`isAdmin` field in the POST/PUT body must not be persisted or influence the caller's own privileges. This is included per explicit task scope even though it is not directly stated for this endpoint by either source; the expected-behavior oracle in `security-cases.md` is worded to reflect that it is an extension, not an asserted fact. |
| SEC-07 | Password-reset OTP must have entropy, expiry, and single use (srs.md line 284) | No | OTP behavior belongs to FR-03 (`/api/forgot-password`, `/api/reset-password`); unrelated to product CRUD. |

## Additional access-control coverage beyond SEC-01..07 (explicit task scope)

IDOR / role-escalation via a non-admin token attempting `POST`, `PUT`, or `DELETE` on
`/api/products` is the same underlying control as SEC-03 (role check must actually be
enforced per-request, not just present in the token issuance flow) — grouped under SEC-03
in `../security-cases.md` rather than treated as a separate SEC id, since srs.md defines
no distinct SEC id for object-level authorization and this endpoint group has no
per-resource ownership concept (products are not user-owned, unlike carts/orders in the
FR-08 suite) — the escalation surface here is role-only, not object-ownership.
