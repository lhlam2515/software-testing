# FR-08 `POST /api/checkout` — Security Requirement Applicability

Source: `docs/eshop-sut/srs.md` section 9 "Yêu cầu Bảo mật" (SEC-01 through SEC-07,
lines 274-284); `docs/eshop-sut/srs.md` FR-08 (lines 102-108).

| SEC-ID | Requirement | Applies? | Reason / attack surface |
| --- | --- | --- | --- |
| SEC-01 | Password must not be stored/exposed as plaintext (srs.md line 278) | No | The checkout request/response involves order and cart data, not a user/credential object. Neither the documented request body (`total_amount`, `shipping_address`) nor any documented response field touches a password. |
| SEC-02 | Secured APIs must require a valid JWT (srs.md line 279) | Yes | Direct match: section 4 header (api_specification.md line 131) requires `Authorization: Bearer <token>` for all Cart & Orders endpoints, and srs.md FR-08 line 104 independently states only a logged-in user may check out. Missing/malformed/expired-shaped token cases are in scope. |
| SEC-02 (extended, FR-08-derived) | Two FR-08-specific rules do not map to a numbered SEC-01..07 id but are session/authorization concerns in the same family as SEC-02, so they are grouped and tagged under SEC-02 in `../security-cases.md`: (a) a valid token for user A must not be able to check out or act on user B's cart (IDOR / broken object-level authorization); (b) the server must recompute `total_amount` itself and ignore any client-supplied value (srs.md FR-08 line 107). | Yes | (a) is a direct authorization-boundary requirement implied by "chỉ người dùng đã đăng nhập mới thanh toán được" combined with cart being a per-user resource (FR-07); no source states carts are shared, so cross-user access is out of bounds by the only documented reading. (b) is explicitly stated in srs.md FR-08 line 107 as a mandatory server-side control. |
| SEC-03 | Admin APIs must check `role = 'admin'` in the token, not just token presence (srs.md line 280) | No | `/api/checkout` is not documented as an admin-gated endpoint (it is listed under section 4 "Cart & Orders", not section 6 "API Dành cho Admin"). No role check is described for it. |
| SEC-04 | User input displayed in the UI must be escaped, no raw `innerHTML` (srs.md line 281) | No | `/api/checkout` returns JSON, not rendered HTML. Whether `shipping_address` is later rendered unescaped somewhere (e.g. an order-detail screen) is a rendering-layer concern of that other screen, not observable at this endpoint's API scope. |
| SEC-05 | DB queries must use parameterized queries, not string concatenation (srs.md line 282) | Yes | `shipping_address` is a reachable free-text string input that is persisted (implied by FR-08's checkout-creates-an-order behavior). Concrete SQL injection payloads on `shipping_address` are in scope. |
| SEC-06 | Profile-update API must not allow client to change `role` (srs.md line 283) | No | `/api/checkout` is not a profile-update endpoint and has no `role` field in its documented body. This requirement targets `PUT /api/users/me` (FR-04). |
| SEC-07 | Password-reset OTP must have entropy, expiry, and single use (srs.md line 284) | No | OTP behavior belongs to FR-03 (`/api/forgot-password`, `/api/reset-password`); unrelated to checkout. |

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
