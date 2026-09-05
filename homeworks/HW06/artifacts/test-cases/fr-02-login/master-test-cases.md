# FR-02 `POST /api/login` — Master Test Case Suite

Continuous `TC-01..TC-35` sequence merging `domain-partition-catalog.md` (EP + BVA),
`state-model.md` (State), `security-cases.md` (Security), and `schema-cases.md` (Schema).
Test accounts referenced: `test@eshop.com` / `Test1234!` (registered user),
`admin@eshop.com` / `Admin123!` (registered admin, per srs.md section 1).

Where a documented status code, error body shape, or exact boundary behavior does not
exist in either source, the Expected result / Oracle column says UNSPECIFIED and states
what to record instead of asserting an invented value.

| TC ID | Technique | Precondition | Input / action | Expected result | Oracle | Trace |
| --- | --- | --- | --- | --- | --- | --- |
| TC-01 | EP | Account `test@eshop.com` exists, unlocked, counter=0 | `POST /api/login` with `email="test@eshop.com"`, `password="Test1234!"` | `200 OK`; body has `token` (string) and `user` (object); `user` must not contain a password field | Response status + body shape/fields | EC-01, EC-08, TR-04, SC-01..SC-07; api_specification.md 1.2 |
| TC-02 | EP | Account `test@eshop.com` exists | `POST /api/login` with `email="TEST@ESHOP.COM"`, `password="Test1234!"` | UNSPECIFIED — record whether match succeeds (case-insensitive) or fails (case-sensitive); do not treat either as a defect by itself | Response status + presence/absence of `token` | EC-02; srs.md FR-02 (silent) |
| TC-03 | EP | No account registered as `nobody-xyz@eshop.com` | `POST /api/login` with that email, `password="Anything1!"` | An "appropriate error," cause not leaked (srs.md line 42); exact status/body UNSPECIFIED | Response status + body content compared later against TC-08 in TC-29 | EC-03; srs.md FR-02 line 42 |
| TC-04 | EP | — | `POST /api/login` with `email="not-an-email"`, `password="Test1234!"` | UNSPECIFIED — HTML5 `type="email"` is documented as client-side only; record actual server behavior | Response status | EC-04; srs.md FR-02 line 44 |
| TC-05 | EP | — | `POST /api/login` with `email=""`, `password="Test1234!"` | Required-field violation; exact status/body UNSPECIFIED | Response status + body | EC-05; api_specification.md 1.2 |
| TC-06 | EP | — | `POST /api/login` with the `email` key omitted from the JSON body, `password="Test1234!"` | Required-field violation; exact status/body UNSPECIFIED | Response status + body | EC-06; api_specification.md 1.2 |
| TC-07 | EP | Account `test@eshop.com` exists | `POST /api/login` with `email=" test@eshop.com "` (leading/trailing space), `password="Test1234!"` | UNSPECIFIED — record whether the server trims before lookup | Response status + presence/absence of `token` | EC-07; srs.md FR-02 (silent) |
| TC-08 | EP | Account `test@eshop.com` exists, counter=0 | `POST /api/login` with `email="test@eshop.com"`, `password="WrongPass1!"` | Counter +1 (srs.md line 41); appropriate error, cause not leaked; exact status/body UNSPECIFIED | Response status + body content compared later against TC-03 in TC-29 | EC-09, TR-01; srs.md FR-02 lines 41-42 |
| TC-09 | EP | Account `test@eshop.com` exists | `POST /api/login` with `email="test@eshop.com"`, `password=""` | Required-field violation; exact status/body UNSPECIFIED | Response status + body | EC-10; api_specification.md 1.2 |
| TC-10 | EP | Account `test@eshop.com` exists | `POST /api/login` with `email="test@eshop.com"`, the `password` key omitted | Required-field violation; exact status/body UNSPECIFIED | Response status + body | EC-11; api_specification.md 1.2 |
| TC-11 | EP | Account `test@eshop.com` exists | `POST /api/login` with `email="test@eshop.com"`, `password=" Test1234! "` (padded) | UNSPECIFIED — record whether the server trims before comparison | Response status + presence/absence of `token` | EC-12; srs.md FR-02 (silent) |
| TC-12 | EP (combination) | — | `POST /api/login` with `email=""`, `password=""` (both required fields empty simultaneously) | Required-field violation for a combination of causes; still an "appropriate," non-leaking error per FR-02's general error rule — must not reveal more diagnostic detail than a single-field violation | Response status + body, compared for shape against TC-05/TC-09 | EC-05, EC-10 (combination); srs.md FR-02 line 42 |
| TC-13 | BVA | Lock triggered at T=0 (via a fresh 3-failure sequence on a disposable/reset test account) | `POST /api/login` with correct credentials at T=29s after lock start | Still inside the documented 30s window; rejected, cause not leaked | Response status + absence of `token` | BVA-01 (state-model.md S-10); srs.md FR-02 line 42 |
| TC-14 | BVA | Lock triggered at T=0 (fresh 3-failure sequence) | `POST /api/login` with correct credentials at exactly T=30s after lock start | UNSPECIFIED — record whether still locked (inclusive boundary) or already unlocked (exclusive boundary); do not treat either outcome as a defect by itself | Response status + presence/absence of `token` | BVA-02 (state-model.md S-11); srs.md FR-02 line 42 (silent on inclusivity) |
| TC-15 | BVA | Lock triggered at T=0 (fresh 3-failure sequence) | `POST /api/login` with correct credentials at T=31s after lock start | Documented: lock has expired; attempt evaluated normally — with correct credentials this should reach the success path (`200`, `token`) | Response status + presence of `token` | BVA-03 (state-model.md S-12), TR-09; srs.md FR-02 line 42 |
| TC-16 | State | Account `test@eshop.com`, counter=0, unlocked (fresh/reset test account) | Submit 3 consecutive `POST /api/login` with wrong password | Attempts 1-2: counter +1 each, same error class as EC-09 (TR-01, TR-02). Attempt 3: counter reaches 3, account transitions to LOCKED for 30s (TR-03) | Response status/body per attempt; and indirectly, that TC-17/TC-18 (immediately after) observe a locked state | TR-01, TR-02, TR-03; srs.md FR-02 lines 41-42 |
| TC-17 | State | Account is LOCKED (immediately after TC-16), still inside the 30s window | `POST /api/login` with `email="test@eshop.com"`, wrong password | Rejected; error, cause not leaked | Response status + body | TR-07; srs.md FR-02 line 42 |
| TC-18 | State | Account is LOCKED (immediately after TC-16), still inside the 30s window | `POST /api/login` with `email="test@eshop.com"`, CORRECT password (`Test1234!`) | Rejected even though credentials are correct — fail-closed; no `token` issued | Response status + absence of `token` | TR-08, SEC-C-05; srs.md FR-02 line 42; srs.md SEC-02 (line 279) |
| TC-19 | State | Account `test@eshop.com`, counter=1 (one prior wrong-password attempt, e.g. from a fresh setup mirroring TC-08) | Submit a successful login (`Test1234!`), then immediately submit one more wrong-password attempt | Success step: documented `200`+`token`. Follow-up failure step: UNSPECIFIED whether this now behaves as a fresh "1st failure" (counter reset to 0 on success) or as a cumulative "2nd failure" (counter not reset) — record the observed class of error/behavior, do not assert either | Response status/body of both steps; compare follow-up failure's error class against TC-08's (1st-failure) vs. a would-be 2nd-failure signature | TR-05, TR-06; srs.md FR-02 (silent on reset) |
| TC-20 | State | Account was previously locked and has since fully unlocked (>30s elapsed since a prior 3-failure sequence) | Submit 3 more consecutive wrong-password attempts | Lock mechanism must trigger again (not a one-shot/consumed guard) — terminal-state re-entry into LOCKED | Response status/body of the 3rd attempt in this second cycle; confirms lock re-arms | TR-03 (2nd cycle, re-entry), TR-09; srs.md FR-02 line 42 |
| TC-21 | Security | Account `test@eshop.com` exists | `POST /api/login` with correct credentials; inspect every field of the response, top-level and nested | `user` object (and the response as a whole) must not contain a `password`/`passwordHash` field or value | Full response body field-by-field inspection | SEC-C-01; SEC-01 (srs.md line 278) |
| TC-22 | Security | Account `test@eshop.com` exists | `POST /api/login` with `email="test@eshop.com"`, wrong password; inspect the full error response body | Error body must not contain `password`/`passwordHash` or echo the submitted/stored password | Full response body field-by-field inspection | SEC-C-02; SEC-01 (srs.md line 278) |
| TC-23 | Security | Account `test@eshop.com` exists | `POST /api/login` with correct credentials; parse the `token` field | `token` is a syntactically valid JWT — 3 `.`-separated base64url segments, decodable header with an `alg` claim | Structural parse of `token` | SEC-C-03; SEC-02 (srs.md line 279) |
| TC-24 | Security | Account `test@eshop.com` exists | `POST /api/login` with `email="test@eshop.com"`, wrong password | Response must not contain a `token` field | Presence/absence of `token` key | SEC-C-04; SEC-02 (srs.md line 279) |
| TC-25 | Security | — | `POST /api/login` with `email="' OR '1'='1' -- "`, `password="x"` | Parameterized query treats payload as a literal string; login fails, no `token`; no raw SQL error/stack trace in the response | Response status/body; absence of `token`; absence of SQL error text | SEC-C-06; SEC-05 (srs.md line 282) |
| TC-26 | Security | Account `test@eshop.com` exists | `POST /api/login` with `email="test@eshop.com"`, `password="' OR '1'='1"` | Parameterized query treats payload as a literal string; login fails, no `token`; no raw SQL error/stack trace | Response status/body; absence of `token`; absence of SQL error text | SEC-C-07; SEC-05 (srs.md line 282) |
| TC-27 | Security | Admin account `admin@eshop.com` exists | `POST /api/login` with `email="admin@eshop.com'-- "`, `password="anything"` | Parameterized query treats the whole string as a literal email (no row match, no comment-stripped bypass); login fails, no `token`; no raw SQL error | Response status/body; absence of `token`; absence of SQL error text | SEC-C-08; SEC-05 (srs.md line 282) |
| TC-28 | Schema | Five prior conditions available: TC-05 (empty email), TC-09 (empty password), TC-08 (wrong password), TC-03 (unknown email), TC-17 (locked) | Collect and compare the 5 error response bodies | All 5 share the same top-level key set (internal envelope consistency) | Structural diff of the 5 bodies' key sets | SC-08; srs.md FR-02 line 42 |
| TC-29 | Schema | TC-03 (unknown email) and TC-08 (wrong password, known email) results available | Compare the two error bodies/messages | Content must not let the client distinguish "email doesn't exist" from "wrong password" — this is the enumeration-resistance requirement | Content/message diff between TC-03 and TC-08 responses | SC-09; srs.md FR-02 line 42 ("không để lộ chi tiết nguyên nhân") |
| TC-30 | Schema | TC-17 result available (locked, wrong creds) | Inspect the locked-account error body | Must not contain `password`/`passwordHash` either | Full response body field-by-field inspection | SC-10; composite with SEC-01 |
| TC-31 | Schema | TC-03, TC-05, TC-08, TC-09, TC-17 results available | Check the status code of each | All are non-`2xx` (exact code UNSPECIFIED, not asserted) | Response status code per condition | SC-11; srs.md FR-02 line 42 |
| TC-32 | Schema | — | `POST /api/login` with `email=12345` (JSON number, not string), `password="Test1234!"` | Structured JSON error, not a `500` with a raw stack trace; exact status/shape UNSPECIFIED | Response status + Content-Type + body parseability | SC-12; api_specification.md 1.2 (type implied) |
| TC-33 | Schema | — | `POST /api/login` with `email="test@eshop.com"`, `password=["a","b"]` (JSON array, not string) | Structured JSON error, not a `500` with a raw stack trace; exact status/shape UNSPECIFIED | Response status + Content-Type + body parseability | SC-13; api_specification.md 1.2 (type implied) |
| TC-34 | Schema | — | `POST /api/login` with a syntactically broken JSON body (e.g. trailing comma / unclosed brace) | Structured error, not a raw stack trace/HTML error page; exact status/shape UNSPECIFIED | Response status + Content-Type + body parseability | SC-14; general JSON-API robustness (inferred minimum, not invented status code) |
| TC-35 | Schema | — | `POST /api/login` with a valid JSON body but no `Content-Type: application/json` header | UNSPECIFIED — neither source states server behavior for this case; record actual status/body | Response status + Content-Type + body | SC-15; api_specification.md 1.2 (silent) |

## Coverage Gate

- Total: 35/35
- By technique: EP=12, BVA=3, State/Lifecycle=5, Security=7, Schema=8
- Parameters without EP/BVA coverage: none — `email` (EC-01..07) and `password`
  (EC-08..12) each have every catalog class represented in TC-01..TC-12; the lock TTL
  boundary (BVA-01..03) is covered in TC-13..TC-15
- Applicable SEC ids without cases: none — SEC-01 (TC-21, TC-22, TC-30 composite),
  SEC-02 (TC-23, TC-24, TC-18 composite via SEC-C-05), SEC-05 (TC-25, TC-26, TC-27)
- Valid transitions: 9/9 TR ids covered (TR-01 TC-16; TR-02 TC-16; TR-03 TC-16 and TC-20;
  TR-04 TC-01; TR-05 TC-19; TR-06 TC-19; TR-07 TC-17; TR-08 TC-18; TR-09 TC-15 and TC-20).
  Three of these (TR-04's reset caveat is not applicable since it has no prior failure;
  TR-05, TR-06, TR-09) resolve to an UNSPECIFIED finish-state per state-model.md — the
  test cases still execute and record the actual observed behavior; missing: none
- Documented response variants: 1/1 covered (`200`, TC-01). No other status code is
  documented in either source; the `400`/`401`/`423` placeholders exercised in TC-03..12,
  TC-16..20, TC-24..35 are undocumented-shape checks (internal consistency / non-2xx /
  non-crash), not coverage of a second documented variant — reported separately above,
  not folded into this ratio to avoid overstating documented-variant coverage
- Shortfall: none. All 12 EC ids, all 3 BVA ids (TTL boundary), all 9 TR ids, all 8
  applicable SEC-C ids, and all 15 SC ids trace to at least one TC row. No reworded
  duplicates were added to reach the 35 target — TC-12, TC-20, and TC-28/29/31 are the
  only combination/cross-referencing rows, and each asserts a distinct oracle not covered
  by any single-condition row.
