# FR-02 Login & Account Lockout - Requirements Extract

Source: `docs/eshop-sut/api_specification.md` section 1.2 (Đăng nhập); `docs/eshop-sut/srs.md` FR-02 (lines ~38-44)

## Functional behavior

- User submits `email` and `password` to `POST /api/login` (api_specification.md 1.2).
- On success, the response is `200 OK` and returns a JWT `token` and `user` info
  (api_specification.md 1.2). Exact `user` shape and token format/expiry are not
  documented anywhere in the contract — recorded as unspecified.
- On every failed login attempt, the system increments a failed-attempt counter by
  exactly 1 (srs.md FR-02, line 41).
- If the failed-attempt count reaches 3 or more consecutive failures, the account is
  temporarily locked for 30 seconds (demo environment) (srs.md FR-02, line 42).
- While locked, or on invalid credentials, the system must return "an appropriate error
  message" and must not leak the underlying cause (srs.md FR-02, line 42). Neither the
  status code nor the response body shape for this error is documented.
- The `email` field must use HTML5 `type="email"` client-side validation (srs.md FR-02,
  line 44). This is a documented UI-layer constraint; whether the backend independently
  enforces email format is not stated — recorded as unspecified for API-level testing.
- Successful login returns a JWT that must be sent as `Authorization: Bearer <token>`
  on subsequent authenticated requests (srs.md FR-02, line 43).

## Business rules

- Failed-attempt counter: +1 per failed attempt (srs.md FR-02, line 41).
- Lockout trigger: >= 3 consecutive failed attempts (srs.md FR-02, line 42).
- Lockout duration: 30 seconds, demo environment only (srs.md FR-02, line 42).
- Counter reset on successful login: not explicitly stated in either source. The
  existence of a "consecutive failures" concept implies a successful login must reset
  the counter to 0 for the lockout logic to make sense, but no source states this
  explicitly — recorded as an inferred behavior requiring confirmation, not an
  invented value. Flagged in state-model.md.
- No password complexity rule is documented for the login endpoint itself (complexity
  in FR-01 governs registration, not login credential comparison).
- Email uniqueness/format enforcement at login time: not documented — login only
  compares submitted credentials against a stored account, per FR-02's plain reading.

## Unspecified constraints (do not invent)

- HTTP status codes for: invalid credentials, missing/empty fields, locked account.
- Error response body shape/field names (e.g. `error`, `message`, `code`).
- JWT expiry duration and exact claims.
- Whether email lookup is case-sensitive or case-insensitive.
- Whether the failed-attempt counter is scoped per email, per IP, or both.
- Exact wording of the lockout message (only the constraint "must not leak cause" is
  documented).
- Whether the counter resets on successful login (see Business rules above).

## State classification

Implicit state — the failed-attempt counter and lockout window described in srs.md
FR-02 constitute counter-/expiry-driven behavior without named states in the source
documents. See `../state-model.md`.
