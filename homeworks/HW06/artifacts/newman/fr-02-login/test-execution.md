# FR-02 Test Execution

- Source: `newman-report.json`
- Newman exit: `1`
- Requests: 89/89 passed
- Assertions: 247/267 passed
- Newman failures: 20
- Data note: raw Newman JSON may contain response bodies; review it before sharing.

## Test cases

| Test case | Trace | Result | Assertions | Evidence |
|---|---|---:|---:|---|
| TC-01 | EC-01,EC-08,TR-04,SC-01..07 | FAIL | 4 pass / 1 fail | expected '{"message":"login successful","token"…' to not include '"password"' |
| TC-02 | EC-02 | PASS | 5 pass / 0 fail |  |
| TC-03 | EC-03 | PASS | 5 pass / 0 fail |  |
| TC-04 | EC-04 | PASS | 5 pass / 0 fail |  |
| TC-05 | EC-05 | PASS | 5 pass / 0 fail |  |
| TC-06 | EC-06 | PASS | 5 pass / 0 fail |  |
| TC-07 | EC-07 | FAIL | 4 pass / 1 fail | expected '{"message":"login successful","token"…' to not include '"password"' |
| TC-08 | EC-09,TR-01 | PASS | 5 pass / 0 fail |  |
| TC-09 | EC-10 | PASS | 5 pass / 0 fail |  |
| TC-10 | EC-11 | PASS | 5 pass / 0 fail |  |
| TC-11 | EC-12 | PASS | 5 pass / 0 fail |  |
| TC-12 | EC-05,EC-10 | PASS | 5 pass / 0 fail |  |
| TC-13 | BVA-01 | PASS | 20 pass / 0 fail |  |
| TC-14 | BVA-02 | PASS | 20 pass / 0 fail |  |
| TC-15 | BVA-03,TR-09 | FAIL | 12 pass / 8 fail | expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true |
| TC-16 | TR-01,TR-02,TR-03 | PASS | 9 pass / 0 fail |  |
| TC-17 | TR-07 | PASS | 5 pass / 0 fail |  |
| TC-18 | TR-08,SEC-C-05 | PASS | 5 pass / 0 fail |  |
| TC-19 | TR-05 | FAIL | 3 pass / 3 fail | expected 403 to deeply equal 200; expected 403 to deeply equal 200; expected 403 to deeply equal 200 |
| TC-20 | TR-03,TR-09 | PASS | 9 pass / 0 fail |  |
| TC-21 | SEC-C-01 | FAIL | 3 pass / 2 fail | expected 403 to deeply equal 200; expected false to be true |
| TC-22 | SEC-C-02 | PASS | 5 pass / 0 fail |  |
| TC-23 | SEC-C-03 | FAIL | 3 pass / 2 fail | expected 403 to deeply equal 200; expected false to be true |
| TC-24 | SEC-C-04 | PASS | 5 pass / 0 fail |  |
| TC-25 | SEC-C-06 | PASS | 5 pass / 0 fail |  |
| TC-26 | SEC-C-07 | PASS | 5 pass / 0 fail |  |
| TC-27 | SEC-C-08 | PASS | 5 pass / 0 fail |  |
| TC-28 | SC-08 | PASS | 6 pass / 0 fail |  |
| TC-29 | SC-09 | PASS | 6 pass / 0 fail |  |
| TC-30 | SC-10 | PASS | 6 pass / 0 fail |  |
| TC-31 | SC-11 | PASS | 6 pass / 0 fail |  |
| TC-32 | SC-12 | PASS | 6 pass / 0 fail |  |
| TC-33 | SC-13 | PASS | 6 pass / 0 fail |  |
| TC-34 | SC-14 | PASS | 6 pass / 0 fail |  |
| TC-35 | SC-15 | PASS | 5 pass / 0 fail |  |
| TC-36 | TR-06 | FAIL | 9 pass / 6 fail | expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true |
| TC-37 | SEC-01 (admin variant) | FAIL | 4 pass / 1 fail | expected '{"message":"login successful","token"…' to not include '"password"' |
| TC-38a | srs.md FR-02 line 43 | FAIL | 3 pass / 2 fail | expected 403 to deeply equal 200; expected false to be true |
| TC-38b | srs.md FR-02 line 43; api_specification.md section 2.1 | FAIL | 5 pass / 1 fail | expected 401 to not be one of [ 401, 403 ] |
| TC-39 | srs.md FR-02 line 42; specs/requirements.md Unspecified constraints (counter scope); state-model.md Notes (cross-ref) | FAIL | 16 pass / 4 fail | expected '{"message":"login successful","token"…' to not include '"password"'; expected '{"message":"login successful","token"…' to not include '"password"'; expected '{"message":"login successful","token"…' to not include '"password"'; expected '{"message":"login successful","token"…' to not include '"password"' |
| TC-40 | srs.md FR-02 lines 41-42 (concurrency) | PASS | 16 pass / 0 fail |  |
| TC-41 | api_specification.md 1.2 (type implied by example); SC-12/SC-13 (cross-ref) | PASS | 6 pass / 0 fail |  |
| TC-42 | srs.md FR-02 line 42 | PASS | 6 pass / 0 fail |  |
| TC-43a | srs.md FR-02 lines 41-42; specs/requirements.md Unspecified constraints (counter scope) | PASS | 5 pass / 0 fail |  |
| TC-43b | srs.md FR-02 lines 41-42; specs/requirements.md Unspecified constraints (counter scope) | PASS | 5 pass / 0 fail |  |
| TC-43c | srs.md FR-02 lines 41-42; specs/requirements.md Unspecified constraints (counter scope) | PASS | 5 pass / 0 fail |  |
| TC-43d | srs.md FR-02 lines 41-42; specs/requirements.md Unspecified constraints (counter scope) | PASS | 5 pass / 0 fail |  |
| TC-43e | srs.md FR-02 lines 41-42; specs/requirements.md Unspecified constraints (counter scope) | PASS | 5 pass / 0 fail |  |
| TC-43f | srs.md FR-02 lines 41-42; specs/requirements.md Unspecified constraints (counter scope) | PASS | 5 pass / 0 fail |  |
| TC-43g | srs.md FR-02 lines 41-42; specs/requirements.md Unspecified constraints (counter scope) | PASS | 5 pass / 0 fail |  |
| TC-44 | srs.md FR-02 line 42 (lien tiep), line 43 | FAIL | 18 pass / 12 fail | expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true |
| TC-45 | srs.md FR-02 lines 42-43 | FAIL | 18 pass / 12 fail | expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true; expected 403 to deeply equal 200; expected false to be true |
| TC-46 | srs.md FR-02 lines 41-42; depends on TC-02's recorded case-sensitivity observation | PASS | 20 pass / 0 fail |  |

## Failure triage

- **UNRESOLVED** : Login / Data-Driven Request: expected '{"message":"login successful","token"…' to not include '"password"'
- **UNRESOLVED** : Login / Data-Driven Request: expected '{"message":"login successful","token"…' to not include '"password"'
- **UNRESOLVED** : Login / Data-Driven Request: expected 403 to deeply equal 200
- **UNRESOLVED** : Login / Data-Driven Request: expected false to be true
- **UNRESOLVED** : Login / Data-Driven Request: expected 403 to deeply equal 200
- **UNRESOLVED** : Login / Data-Driven Request: expected 403 to deeply equal 200
- **UNRESOLVED** : Login / Data-Driven Request: expected false to be true
- **UNRESOLVED** : Login / Data-Driven Request: expected 403 to deeply equal 200
- **UNRESOLVED** : Login / Data-Driven Request: expected false to be true
- **UNRESOLVED** : Login / Data-Driven Request: expected 403 to deeply equal 200
- **UNRESOLVED** : Login / Data-Driven Request: expected false to be true
- **UNRESOLVED** : Login / Data-Driven Request: expected '{"message":"login successful","token"…' to not include '"password"'
- **UNRESOLVED** : Login / Data-Driven Request: expected 403 to deeply equal 200
- **UNRESOLVED** : Login / Data-Driven Request: expected false to be true
- **UNRESOLVED** : Login / Data-Driven Request: expected 401 to not be one of [ 401, 403 ]
- **UNRESOLVED** : Login / Data-Driven Request: expected '{"message":"login successful","token"…' to not include '"password"'
- **UNRESOLVED** : Login / Data-Driven Request: expected 403 to deeply equal 200
- **UNRESOLVED** : Login / Data-Driven Request: expected false to be true
- **UNRESOLVED** : Login / Data-Driven Request: expected 403 to deeply equal 200
- **UNRESOLVED** : Login / Data-Driven Request: expected false to be true

> Classification and bug conclusions require agent review of the test contract and relevant SUT handler.

## Re-run delta

Baseline: `reports/archive/20260828T194022Z/newman-report.json` (previous run, 42 `tc_id`s,
207 assertions, 22 failed). This run: 53 `tc_id`s, 267 assertions, 20 failed.

### Suite update

- **Added (11):** TC-42, TC-43a, TC-43b, TC-43c, TC-43d, TC-43e, TC-43f, TC-43g, TC-44,
  TC-45, TC-46 — all from the Pass 2 audit's `extended-test-cases-v2.md`.
- **Removed:** none.
- **Renamed:** none.

### Result movement (41 `tc_id`s common to both runs)

| Bucket | Count | `tc_id`s |
|---|---:|---|
| Newly failing | 0 | — |
| Newly passing | 6 | TC-28, TC-29, TC-30, TC-31, TC-34, TC-35 |
| Still failing | 11 | TC-01, TC-07, TC-15, TC-19, TC-21, TC-23, TC-36, TC-37, TC-38a, TC-38b, TC-39 |
| Still passing | 24 | — |

New `tc_id`s: TC-44 and TC-45 fail; TC-42, TC-43a–TC-43g and TC-46 pass.

The six newly passing cases are Shape 4 cross-response rows (TC-28..TC-31) and the
wire-mutation characterization rows (TC-34, TC-35). The Pass 2 audit demoted their
UNSPECIFIED facets from hard assertions to recorded observations, so the movement is an
oracle change in the suite, not observed behaviour change in the SUT.

### Failure attribution

Every failing assertion in this run maps to a root cause already recorded in
`homeworks/HW06/BUG_REPORT.md`. No new root cause surfaced.

| Root cause | `BUG_REPORT.md` id | Failing `tc_id`s |
|---|---|---|
| `server.js:54` `login_attempts + 2` — counter increments by 2, so the account locks on the 2nd consecutive failure, not the documented 3rd (`srs.md` FR-02 lines 41-42) | BUG-FR02-01 | TC-36, TC-44 |
| `server.js:57` `Date.now() + 180000` — lock lasts 180s, not the documented 30s (`srs.md` FR-02 line 42) | BUG-FR02-02 | TC-15, TC-19, TC-21, TC-23, TC-38a, TC-38b (cascade: no token to reuse), TC-45 |
| `server.js:52` `res.json({..., user})` returns the whole user row including plaintext `password` (`srs.md` SEC-01) | BUG-FR02-03 | TC-01, TC-07, TC-37, TC-39 |

Attribution follows each row's documented precondition in `test-data.csv`, not the shape of
its failure — every row in both lockout families fails with the same `403`.

- **BUG-FR02-01** covers rows whose precondition already puts the counter at 2, where the
  `+2` increment locks the account before the row's own request is sent: TC-36
  (`counter=2 (two prior consecutive wrong-password attempts)`) and TC-44, whose 6-step
  sequence never reaches the successful 3rd request that would exercise the "liên tiếp"
  semantics.
- **BUG-FR02-02** covers rows that expect the lock to have expired after the documented
  30-second window. TC-21 and TC-23 are documented as "wait out TC-20's 30s lock"; TC-19
  (`counter=1`) and TC-38a (`counter=0, unlocked`) carry no lock of their own. All four call
  the collection's `waitOutTestLock()` helper, which is built around 30s and is outlasted by
  the real 180s lock — the same defect as TC-15 and TC-45, not a separate one. TC-38b then
  receives no token from TC-38a and gets `401` from the protected endpoint.

BUG-FR02-04 (malformed JSON / missing `Content-Type` stack trace) produces no failing
assertion in this run because the Pass 2 audit demoted TC-32/TC-33/TC-34/TC-41 to
characterization rows that record `observed_stack_or_html_*` instead of asserting on it. The
defect itself still reproduces here: TC-34 (iteration 33) returns `400` with a
`<!DOCTYPE html>…<pre>SyntaxError…` page and TC-35 (iteration 34) returns `500` with a
`<pre>TypeError…` page. The entry stays open and unchanged; its failing-assertion evidence
is preserved in `reports/archive/20260828T194022Z/newman-report.json`.
