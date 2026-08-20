# FR-02 `POST /api/login` — Parameterized Request Template

This is a design artifact for a data-driven Postman Collection Runner / Newman run
against `data/test-data.csv`. It is not proof of execution — no collection has been
created or run.

## 1. Request

```
Method: POST
URL: {{baseUrl}}/api/login
```

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
| `password_raw_json` = `RAW_TYPE_ARRAY` | Send the `password` value as a JSON array, not a quoted string (TC-33) — parse the `password` column as a JSON array literal. |
| `body_raw_override` non-empty | Send this literal string as the raw request body instead of building JSON from `email`/`password` (TC-34: deliberately malformed JSON). |
| `precondition_note` | Not sent on the wire — instructs the runner what state/timing setup (lock cycles, elapsed seconds, prior requests) must exist before firing this row. Rows referencing another `tc_id`'s result (TC-28, TC-29, TC-31) are analysis-only rows: they do not fire a new HTTP request, they diff previously captured responses. |
| `trace` | Not sent on the wire — carries the coverage id(s) back to `master-test-cases.md` for audit traceability. |

Timing-dependent rows (TC-13, TC-14, TC-15, TC-16, TC-17, TC-18, TC-20) require the
runner to sequence requests with real elapsed-time waits per `precondition_note`; they
cannot be parameterized as independent, order-free CSV rows the way the stateless rows
(TC-01..TC-12, TC-21..TC-27, TC-32..TC-35) can.

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
```

`safeJson()` wraps `pm.response.json()` in a try/catch so a non-JSON body (TC-34) fails
the specific facet assertion for that row instead of throwing and aborting the run.

Rows TC-28, TC-29, TC-31 (cross-response comparison / consistency checks) are not sent
as new requests by this template — they are a post-run analysis step over the responses
already captured for the `tc_id`s they reference, executed once the full data file has
run.
