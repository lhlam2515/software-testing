# FR-02 `POST /api/login` — Parameterized Request Template

This is a design artifact for a data-driven Postman Collection Runner / Newman run
against `data/test-data.csv`. It is not proof of execution — no collection has been
created or run.

## 1. Request

```
Method: {{method}}
URL: {{baseUrl}}{{endpoint}}
```

`method` and `endpoint` read from the CSV columns of the same name. Every row except
TC-38b uses `POST` / `/api/login` (the default this suite was originally built
around). TC-38b sets `method=GET`, `endpoint=/api/users/me` to exercise the
protected endpoint with the token issued by TC-38a (see `auth_bearer_from` below).
Analysis-only rows (TC-28, TC-29, TC-30, TC-31) leave both columns blank — they fire
no request.

When `auth_bearer_from` is non-empty, the pre-request script sets an
`Authorization: Bearer <token>` header using the `token` value captured from the
response of the referenced `tc_id` (e.g. TC-38b's `auth_bearer_from=TC-38a` reuses
the token TC-38a's response returned). Rows with GET `method` and a non-empty
`auth_bearer_from` skip the request-body step entirely — `email`/`password`/
`content_type` are not applicable and are left blank.

Headers:

```
Content-Type: {{content_type}}
```

`content_type` reads from the CSV column of the same name. When the CSV row value is
`OMIT_HEADER`, the pre-request script must remove the `Content-Type` header entirely
(TC-35) rather than send an empty string.

Body (raw JSON), built by a pre-request script from the current data row (see mapping
below), or sent verbatim from `body_raw_override` when that column is non-empty
(TC-34's intentionally malformed JSON):

```json
{
  "email": "{{email}}",
  "password": "{{password}}"
}
```

## 2. Pre-request variable mapping

| CSV column | Behavior |
| --- | --- |
| `email`, `password` | Substituted directly into the JSON body as strings. |
| `email_raw_json` / `password_raw_json` = `OMIT_KEY` | Remove that key entirely from the outgoing JSON body (TC-06, TC-10). |
| `email_raw_json` = `RAW_TYPE_NUMBER` | Send the `email` value as a JSON number, not a quoted string (TC-32) — read the numeric literal from the `email` column. |
| `email_raw_json` = `RAW_TYPE_NULL` | Send `"email": null` as a JSON `null` literal, not a quoted empty string (TC-41) — distinct wire condition from `OMIT_KEY` (TC-06, key absent) and an empty-string `email` (TC-05). The `email` column is ignored when this sentinel is set. |
| `password_raw_json` = `RAW_TYPE_ARRAY` | Send the `password` value as a JSON array, not a quoted string (TC-33) — parse the `password` column as a JSON array literal. |
| `body_raw_override` non-empty | Send this literal string as the raw request body instead of building JSON from `email`/`password` (TC-34: deliberately malformed JSON). |
| `auth_bearer_from` | Not sent as a body field — when non-empty, the pre-request script sets `Authorization: Bearer <token>` from the referenced `tc_id`'s captured response (TC-38b only). |
| `precondition_note` | Not sent on the wire — instructs the runner what state/timing setup (lock cycles, elapsed seconds, prior requests, concurrent firing) must exist before firing this row. Rows referencing another `tc_id`'s result (TC-28, TC-29, TC-30, TC-31) are analysis-only rows: they do not fire a new HTTP request, they diff previously captured responses. |
| `trace` | Not sent on the wire — carries the coverage id(s) back to `master-test-cases.md` for audit traceability. |

Timing-dependent rows (TC-13, TC-14, TC-15, TC-16, TC-17, TC-18, TC-20, TC-39, TC-40)
require the runner to sequence (or fire concurrently, for TC-40) requests per
`precondition_note`; they cannot be parameterized as independent, order-free CSV rows
the way the stateless rows (TC-01..TC-12, TC-21..TC-27, TC-32..TC-35, TC-37, TC-41)
can. TC-38a/TC-38b are a fixed two-step sequence (login, then use the captured token)
rather than a timing dependency — TC-38b must run immediately after TC-38a.

## 3. Generic assertions (read from the current data row)

```
pm.test("status matches expected_status when documented", () => {
  if (data.expected_status) {
    pm.expect(pm.response.code).to.eql(Number(data.expected_status));
  } else {
    // expected_status is blank -> UNSPECIFIED by contract; record the
    // observed code instead of asserting one. See expected_status_note.
    pm.environment.set(`observed_status_${data.tc_id}`, pm.response.code);
  }
});

pm.test("token presence matches expected_token_present", () => {
  const body = pm.response.json ? safeJson(pm.response) : null;
  const hasToken = !!(body && typeof body.token !== "undefined");
  if (data.expected_token_present === "true") {
    pm.expect(hasToken).to.be.true;
  } else if (data.expected_token_present === "false") {
    pm.expect(hasToken).to.be.false;
  } else {
    // UNSPECIFIED -> record only, do not assert
    pm.environment.set(`observed_token_present_${data.tc_id}`, hasToken);
  }
});

pm.test("response never leaks a password field (all rows)", () => {
  const raw = pm.response.text();
  pm.expect(raw.toLowerCase()).to.not.include('"password"');
  pm.expect(raw.toLowerCase()).to.not.include('"passwordhash"');
});

pm.test("non-2xx rows never return a raw stack trace / HTML error page", () => {
  if (pm.response.code >= 400) {
    const raw = pm.response.text();
    pm.expect(raw).to.not.match(/<html/i);
    pm.expect(raw).to.not.match(/at\s+\S+\s+\(.*:\d+:\d+\)/); // stack-trace-like line
  }
});

pm.test("2xx responses declare Content-Type: application/json", () => {
  if (pm.response.code >= 200 && pm.response.code < 300) {
    pm.expect(pm.response.headers.get("Content-Type") || "").to.include("application/json");
  }
});
```

The Content-Type check closes the audited gap on TC-01 (`audit-log.md`: trace cited
`SC-02` but the original oracle text never asserted it). It is written as a blanket
2xx rule rather than a TC-01-only column because every documented-success row
(TC-01, TC-15, TC-19, TC-21, TC-23, TC-36, TC-37, TC-38a, TC-39) shares the same
`Content-Type: application/json` expectation from `api_specification.md` 1.2 — a
per-row column would duplicate a constant value on every success row for no added
meaning.

`safeJson()` wraps `pm.response.json()` in a try/catch so a non-JSON body (TC-34) fails
the specific facet assertion for that row instead of throwing and aborting the run.

Rows TC-28, TC-29, TC-30, TC-31 (cross-response comparison / consistency checks) are
not sent as new requests by this template — they are a post-run analysis step over
the responses already captured for the `tc_id`s they reference, executed once the
full data file has run.

TC-40's precondition_note instructs the runner to fire 3 requests concurrently from
this single row (same convention as TC-16's 3-consecutive-attempt sequencing, applied
without the wait) and then send one additional correct-credential verification
request; the generic assertions above apply to each fired attempt individually.
