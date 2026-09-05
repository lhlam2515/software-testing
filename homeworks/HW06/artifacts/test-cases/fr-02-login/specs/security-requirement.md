# FR-02 `POST /api/login` — Security Requirement Applicability

Source: `docs/eshop-sut/srs.md` section 9 "Yêu cầu Bảo mật" (SEC-01 through SEC-07,
lines 273-284).

| SEC-ID | Requirement | Applies? | Reason / attack surface |
| --- | --- | --- | --- |
| SEC-01 | Password must not be stored/exposed as plaintext (srs.md line 278) | Yes | Login is the endpoint where the `user` object is returned to the client. The password (or its hash) must not appear anywhere in the `200` response body. A prior manual spot-check already flagged a candidate violation (`homeworks/HW06/assets/w3-risk-triage-note.md`) — the `user` object appeared to include a plaintext `password` field. Must be formally re-tested here. |
| SEC-02 | Secured APIs must require a valid JWT (srs.md line 279) | Yes (issuance-side, not access-side) | `/api/login` is the token *issuance* point, not a token-gated resource — it is called without a token by design, so "requires valid JWT" does not apply to *calling* it. It does apply to the JWT it *produces*: the issued token must be structurally well-formed (three-segment JWT) so that downstream SEC-02 enforcement on protected endpoints is possible. Token expiry/claims content is undocumented (see `../specs/requirements.md`), so those aspects are flagged unspecified rather than asserted. |
| SEC-03 | Admin APIs must check `role = 'admin'` in the token, not just token presence (srs.md line 280) | No | `/api/login` is not an admin-gated resource; there is no role check to bypass on this endpoint. |
| SEC-04 | User input displayed in the UI must be escaped, no raw `innerHTML` (srs.md line 281) | No | This is a browser-rendering-layer concern. `/api/login` returns JSON, not rendered HTML; whatever the frontend does with `email`/error text after receiving JSON is outside the scope of an API-level test case for this endpoint. |
| SEC-05 | DB queries must use parameterized queries, not string concatenation (srs.md line 282) | Yes | `email` and `password` are both reachable string inputs that are used in a credential-lookup query. Concrete SQL injection payloads on both fields are in scope (e.g. classic auth-bypass injection). |
| SEC-06 | Profile-update API must not allow client to change `role` (srs.md line 283) | No | `/api/login` has no `role` field and is not a profile-update endpoint; this requirement targets `PUT /api/users/me` (FR-04), not FR-02. |
| SEC-07 | Password-reset OTP must have entropy, expiry, and single use (srs.md line 284) | No | OTP behavior belongs to FR-03 (`/api/forgot-password`, `/api/reset-password`), not FR-02 login. |
