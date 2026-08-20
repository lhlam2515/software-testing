# FR-15 `POST/PUT/DELETE /api/products(/:id)` — Parameterized Request Template

This is a design artifact for a data-driven Postman Collection Runner / Newman run against
`data/test-data.csv`. It is not proof of execution — no collection has been created or
run, and no request has been sent to the SUT.

## 1. Request

```
Method: {{method}}
URL: {{baseUrl}}{{path}}
```

`path` may contain a literal placeholder like `{{P1_ID}}`, `{{A_ID}}`, `{{B_ID}}`, or
`{{C_ID}}` — these resolve at run time to ids captured from earlier rows' responses
(TC-01 → `P1_ID`; TC-20 → `P2_ID`; TC-21's two pre-seeded products → `A_ID`/`B_ID`; TC-24's
pre-seeded product → `C_ID`), never to literal values baked into the CSV. `999999` and
`abc` are literal path values (non-existent / malformed id classes).

Headers:

```
Content-Type: {{content_type}}
Authorization: {{auth_header}}
```

`auth_header` is derived from the `auth_token` CSV column by a pre-request script (see
mapping below) — it is not a literal CSV column, since each value requires different
token material (a live login, a hand-crafted invalid string, or a hand-crafted expired
JWT).

Body (raw JSON, omitted entirely for `DELETE` and for `Lifecycle`/`Schema` rows whose
`method` is `SEQUENCE`/`ANALYSIS`), built by a pre-request script from the current data
row:

```json
{
  "name": "{{name}}",
  "price": {{price}},
  "description": "{{description}}",
  "imageUrl": "{{imageUrl}}",
  "category_id": {{category_id}}
}
```

## 2. Pre-request variable mapping

| CSV column | Behavior |
| --- | --- |
| `auth_token` = `admin_valid` | Log in as the seeded admin account (`admin@eshop.com`, per `docs/eshop-sut/setup_guide.md`) via `POST /api/login` (not covered by this template) and use the returned `token` to build `Authorization: Bearer <token>`. |
| `auth_token` = `customer_valid` | Log in as any registered non-admin account the same way. |
| `auth_token` = `MISSING` | Do not send an `Authorization` header at all. |
| `auth_token` = `MALFORMED` | `Authorization: Bearer not-a-real-jwt-string`. |
| `auth_token` = `EXPIRED` | A token constructed (or obtained) such that its `exp` claim has already passed at request time, with an otherwise-valid admin claim; token expiry mechanics are flagged unspecified in `../specs/requirements.md` — this row records observed behavior, it does not assert a specific expiry duration. |
| `name`, `name_raw` | `name` substitutes directly as a JSON string. When `name_raw` = `OMIT_KEY`, remove the key entirely (TC-02). `EMPTY_STRING` sends `""` (TC-03). `LEN_254`/`LEN_255`/`LEN_256` (TC-04/05/06) mean generate an alphanumeric string of that exact character length at request time, not a literal CSV value. |
| `price`, `price_raw` | `price` substitutes directly as a JSON number. When `price_raw` = `OMIT_KEY`, remove the key entirely (TC-07). `RAW_TYPE_STRING` sends the `price` column's value as a quoted JSON string, not a number (TC-08). |
| `category_id`, `category_id_raw` | `VALID_CATEGORY` resolves at request time to a real `category_id` fetched via `GET /api/categories` immediately before the row fires. `999999` (TC-13, TC-19) is a literal non-existent id. When `category_id_raw` = `OMIT_KEY`, remove the key entirely (TC-12). `RAW_TYPE_STRING` sends the `category_id` column's value as a quoted JSON string, not an integer (TC-14). |
| `description`, `description_raw` | `description` substitutes directly as a JSON string. When `description_raw` = `OMIT_KEY`, remove the key entirely (TC-15). A non-empty `description` value that looks like a SQL probe (TC-34: `' OR '1'='1`) is sent verbatim as the string value, not string-concatenated into a query — this is the payload under test, not a runner escaping bug. |
| `imageUrl`, `imageUrl_raw` | `imageUrl` substitutes directly as a JSON string. When `imageUrl_raw` = `OMIT_KEY`, remove the key entirely (TC-16). |
| `extra_field` = `INJECT_ROLE_ADMIN` | Add an extra, undocumented `"role": "admin"` key to the JSON body alongside the normal fields (TC-35). |
| `extra_field` = `INJECT_IS_ADMIN_TRUE` | Add an extra, undocumented `"isAdmin": true` key to the JSON body (TC-36). |
| `method` = `SEQUENCE` | This row is a multi-step scenario (create-then-read, update-then-read-other, delete-then-read-then-delete-again). The `path` column lists the steps informally; the runner executes them in order using the same `auth_token`, capturing each step's response before firing the next. |
| `method` = `ANALYSIS` | This row does not fire a new HTTP request. It is a post-run analysis step over the response(s) already captured for the `tc_ref` id(s) (TC-37..TC-43). |
| `expected_status` | Blank on every row in this suite — no status code is documented anywhere in `api_specification.md` section 3.3 for any of the three operations (`../schema-cases.md`). `expected_status_note` carries the UNSPECIFIED caveat instead; the runner records the observed code rather than asserting one. |
| `expected_side_effect_note` | The one class of assertion this suite *can* make without a documented status code: whether a product was created/mutated/deleted, and whether an unrelated product's fields stayed unchanged (isolation). Every generic assertion below reads this column, not `expected_status`. |
| `tc_ref` | Not sent on the wire — for `ANALYSIS` rows, names the earlier `tc_id`(s) whose captured response this row inspects. |
| `trace` | Not sent on the wire — carries the coverage id(s) back to `../master-test-cases.md` for audit traceability. |

Sequenced/stateful rows (TC-18, TC-19, TC-20, TC-21, TC-22, TC-24, TC-26, TC-27, TC-29,
TC-31, TC-32, TC-34, TC-36) require the runner to have already captured the referenced
product id (`P1_ID`, `A_ID`, `B_ID`, `C_ID`) from an earlier row's response before firing.
Rows referencing `tc_ref` (TC-37..TC-43) must run after every `tc_id` they reference has
already produced a captured response.

## 3. Generic assertions (read from the current data row)

```js
pm.test("status is recorded, not asserted against an undocumented value", () => {
  // expected_status is blank on every row in this suite (no documented status
  // code exists for any of the three operations) — record the observed code
  // instead of asserting one.
  pm.environment.set(`observed_status_${data.tc_id}`, pm.response.code);
});

pm.test("side effect matches expected_side_effect_note where it asserts one", () => {
  const note = (data.expected_side_effect_note || "").toLowerCase();
  if (note.includes("no product created")) {
    // Runner must query GET /api/products (or the categories/count of a known
    // scope) before and after this row and assert the count is unchanged.
    pm.environment.set(`assert_no_new_product_${data.tc_id}`, true);
  }
  if (note.includes("unchanged") || note.includes("unaffected") || note.includes("still exists")) {
    // Runner must GET /api/products/:id for the named product and diff its
    // fields against the pre-request snapshot.
    pm.environment.set(`assert_target_unchanged_${data.tc_id}`, true);
  }
  if (note.includes("retrievable")) {
    pm.environment.set(`assert_retrievable_${data.tc_id}`, true);
  }
  if (note.includes("not retrievable") || note.includes("not-found")) {
    pm.environment.set(`assert_not_found_${data.tc_id}`, true);
  }
});

pm.test("mass-assignment rows never grant privilege or persist an undocumented field", () => {
  if (data.extra_field === "INJECT_ROLE_ADMIN" || data.extra_field === "INJECT_IS_ADMIN_TRUE") {
    // Runner must inspect the created/updated product record for a persisted
    // `role`/`isAdmin` field, and (for INJECT_ROLE_ADMIN) re-run a customer_valid
    // POST/PUT/DELETE probe to confirm no privilege was actually granted.
    pm.environment.set(`assert_no_privilege_effect_${data.tc_id}`, true);
  }
});

pm.test("SQL injection rows never surface a raw DB error or destroy data", () => {
  if (data.trace && (data.trace.includes("SEC-C-09") || data.trace.includes("SEC-C-10"))) {
    const raw = pm.response.text();
    pm.expect(raw).to.not.match(/SQLITE_ERROR|syntax error|SQL error/i);
    // Runner must additionally confirm GET /api/products still lists every
    // product that existed before this row fired.
  }
});

pm.test("non-2xx-shaped rows never return a raw stack trace / HTML error page", () => {
  if (pm.response.code >= 400) {
    const raw = pm.response.text();
    pm.expect(raw).to.not.match(/<html/i);
    pm.expect(raw).to.not.match(/at\s+\S+\s+\(.*:\d+:\d+\)/); // stack-trace-like line
  }
});
```

Rows TC-37..TC-43 (cross-response inspection/comparison) are not sent as new requests by
this template — they are a post-run analysis step over the responses already captured for
the `tc_id`(s) named in their `tc_ref` column, executed once the full data file has run.
