# FR-02 `POST /api/login` — Audit Log

Design-time audit of `../master-test-cases.md` (TC-01..TC-35), per `api-test-auditor`
skill. Oracles used: `docs/eshop-sut/srs.md` FR-02 (lines 38-44) and section 9 (SEC-01,
SEC-02, SEC-05, lines 278-282); `docs/eshop-sut/api_specification.md` section 1.2 and
section 2.1. The generator's own supporting catalogs (`domain-partition-catalog.md`,
`state-model.md`, `security-cases.md`, `schema-cases.md`, `specs/requirements.md`,
`specs/security-requirement.md`, `specs/openapi.yaml`) were treated as audit subjects,
not as oracles — cross-checked against the two authoritative sources above wherever a
TC row cited them.

No execution took place. This is a design-time review only.

| TC ID | Label | Source evidence | Reasoning | Student fix |
| --- | --- | --- | --- | --- |
| TC-01 | INCOMPLETE | Trace cites `SC-02` (Content-Type facet); Oracle text never checks it | Trace column cites `SC-01..SC-07`, but Oracle only says "Response status + body shape/fields" — `Content-Type` is never asserted. The Coverage Gate section (`master-test-cases.md` lines 64-68) claims "Documented response variants: 1/1 covered (200, TC-01)" on the assumption TC-01 fully exercises SC-01..07; SC-02 is not actually asserted | Oracle: change to "Response status + `Content-Type: application/json` header + body shape/fields (`token` string, `user` object, no `password` field)" |
| TC-02 | VALID | `domain-partition-catalog.md` P-02; `specs/requirements.md` "Whether email lookup is case-sensitive" | Matches the documented UNSPECIFIED exactly | None |
| TC-03 | VALID | `srs.md` FR-02 line 42; P-03 | "Appropriate error, cause not leaked" is a defensible reading, no invented status/body | None |
| TC-04 | VALID | `srs.md` FR-02 line 44; P-04 | Matches the documented UNSPECIFIED | None |
| TC-05 | VALID | `api_specification.md` 1.2; P-05 | Correct required-field class | None |
| TC-06 | VALID | `api_specification.md` 1.2; P-06 | Correct class, distinct wire condition from TC-05 | None |
| TC-07 | VALID | `srs.md` FR-02 (silent); P-07 | Correct UNSPECIFIED | None |
| TC-08 | VALID | `srs.md` FR-02 line 41; P-09 | Counter+1 claim matches the source | None |
| TC-09 | VALID | `api_specification.md` 1.2; P-10 | Correct class | None |
| TC-10 | VALID | `api_specification.md` 1.2; P-11 | Correct class | None |
| TC-11 | VALID | `srs.md` FR-02 (silent); P-12 | Correct UNSPECIFIED | None |
| TC-12 | INCOMPLETE | `srs.md` FR-02 line 42's "không để lộ chi tiết nguyên nhân" is stated in the context of failed-login/lockout cause disclosure, not required-field validation messages | Expected result invents an unsupported constraint — "must not reveal more diagnostic detail than a single-field violation" — no source requires this; required-field validation normally *should* name the empty field, which is a different concern from credential-enumeration | Expected result: change to "Required-field violation for a combination of both fields empty; exact status/body UNSPECIFIED — record (do not assert) whether the response matches or differs from the single-field violations in TC-05/TC-09" |
| TC-13 | VALID | `state-model.md` S-10 / BVA-01 | Matches | None |
| TC-14 | VALID | `state-model.md` S-11 / BVA-02 | Matches | None |
| TC-15 | VALID | `state-model.md` S-12 / BVA-03 | Matches | None |
| TC-16 | VALID | `state-model.md` S-01..S-03 | Matches | None |
| TC-17 | VALID | `state-model.md` S-07 / TR-07 | Matches | None |
| TC-18 | VALID | `state-model.md` S-08 / TR-08; SEC-C-05 | Matches | None |
| TC-19 | INVALID | `state-model.md` TR-06 requires start state S2 (counter=2); TC-19's own precondition is counter=1 (S1) | Trace cites both TR-05 and TR-06, but TC-19 only reproduces S1 (TR-05). TR-06 (S2→success) cannot be covered by this row under any Oracle correction — it needs a different precondition. The Coverage Gate's "9/9 TR ids covered" claim is therefore false | Trace: drop `TR-06`, keep only `TR-05; srs.md FR-02 (silent on reset)`. TR-06 is covered separately by the new TC-36 |
| TC-20 | INCOMPLETE | `state-model.md` TR-09 explicitly marks the post-unlock counter value as "S? — UNSPECIFIED whether resets to 0 or persists" | Expected result asserts re-lock happens specifically on "attempt 3," which silently assumes the counter resets to 0 after unlock. If the counter instead persists at 3, re-lock could trigger as early as attempt 1 — this contradicts the very UNSPECIFIED-ness state-model.md itself documents for TR-09 | Expected result: change to "Lock must trigger again at some point during these 3 attempts, confirming it is not a one-shot/consumed guard. If the counter reset to 0 on unlock, re-lock is expected on attempt 3; if it persisted, re-lock may occur earlier. Record which attempt number triggers the second lock rather than asserting attempt 3, since the post-unlock counter value is UNSPECIFIED (state-model.md TR-09)" |
| TC-21 | INCOMPLETE | `data/request-template.md` explicitly classifies TC-21 as "stateless, order-free"; TC-13/TC-16 explicitly specify "disposable/reset test account" while TC-21 does not | Precondition only says "Account test@eshop.com exists" — missing "unlocked, counter=0". TC-21 needs a reachable `200` to inspect the success body; TC-20 (the immediately preceding row) leaves the shared account freshly LOCKED, so running TC-21 right after TC-20 would get rejected instead of `200`, defeating the case's purpose | Precondition: change to "Account `test@eshop.com` exists, unlocked, counter=0 (reset, or wait out TC-20's 30s lock, before running this row)" |
| TC-22 | VALID | `srs.md` SEC-01 line 278 | "No password/passwordHash, no token" assertion holds identically whether the account is locked or simply wrong-password-rejected, so it is not broken by the same ordering risk as TC-21/TC-23 | None |
| TC-23 | INCOMPLETE | Same evidence as TC-21 | Requires a reachable `200` to parse the JWT; running right after TC-20 (locked) would yield no `token` to test | Precondition: change to "Account `test@eshop.com` exists, unlocked, counter=0 (reset, or wait out TC-20's 30s lock, before running this row)" |
| TC-24 | VALID | `srs.md` SEC-02 line 279 | "No token field" assertion holds identically under either rejection cause | None |
| TC-25 | VALID | `srs.md` SEC-05 line 282; SEC-C-06 | Matches | None |
| TC-26 | VALID | `srs.md` SEC-05 line 282; SEC-C-07 | Matches | None |
| TC-27 | VALID | `srs.md` SEC-05 line 282; section 1; SEC-C-08 | Matches | None |
| TC-28 | VALID | `schema-cases.md` SC-08 | Matches | None |
| TC-29 | VALID | `schema-cases.md` SC-09; `srs.md` FR-02 line 42 | Matches | None |
| TC-30 | VALID | `schema-cases.md` SC-10 | Matches | None |
| TC-31 | VALID | `schema-cases.md` SC-11 | Matches | None |
| TC-32 | VALID | `schema-cases.md` SC-12 | Matches | None |
| TC-33 | VALID | `schema-cases.md` SC-13 | Matches | None |
| TC-34 | VALID | `schema-cases.md` SC-14 | Matches | None |
| TC-35 | VALID | `schema-cases.md` SC-15 | Matches | None |

**Valid: 29 | Invalid: 1 | Incomplete: 5 | Total: 35**

## Notes on systemic findings

- **TC-19 / TR-06 gap**: the false trace on TC-19 means the suite's own "9/9 TR ids
  covered" claim (Coverage Gate, `master-test-cases.md` lines 59-60) is incorrect —
  actual coverage was 8/9 before this audit. Closed by the new TC-36.
- **TC-21/TC-23 ordering risk**: `data/request-template.md` claims TC-21..TC-27 are
  "stateless, order-free," which is contradicted by TC-20 leaving the shared
  `test@eshop.com` account locked immediately beforehand. TC-13/TC-16 show the
  generator was capable of specifying "disposable/reset test account" explicitly —
  the omission in TC-21/TC-23 is an inconsistency in precondition rigor across
  technique blocks, not evidence the sources allow non-determinism here.
