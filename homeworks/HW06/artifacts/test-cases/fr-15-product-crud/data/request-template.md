# FR-15 `POST/PUT/DELETE /api/products(/:id)` — Parameterized Request Template

This is a design artifact for a data-driven Postman Collection Runner / Newman run against
`data/test-data.csv`. It is not proof of execution — no collection has been created or
run, and no request has been sent to the SUT.

## 1. Request

```
Method: {{method}}
URL: {{baseUrl}}{{path}}
```

`path` may contain a literal placeholder like `{{P1_ID}}`, `{{A_ID}}`, `{{B_ID}}`,
`{{C_ID}}`, `{{CX_ID}}`, or `{{PRODUCT_CX_ID}}` — these resolve at run time to ids captured
from earlier rows' responses (TC-01 → `P1_ID`; TC-20 → `P2_ID`; TC-21's two pre-seeded
products → `A_ID`/`B_ID`; TC-24's pre-seeded product → `C_ID`; TC-46's own sequence steps →
`CX_ID`/`PRODUCT_CX_ID`, captured within the same row, not from an earlier row), never to
literal values baked into the CSV. `{{O1_ID}}` resolves to the order id created by TC-51's out-of-band checkout precondition.
`999999`, `abc`, `0`, `-1`, and the URL-encoded
`1%20OR%201%3D1` are literal path values (non-existent / malformed / boundary / injection
id classes).

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
| `auth_token` = `MALFORMED` | `Authorization: Bearer not-a-real-jwt-string`. Used on all three verbs: TC-28 (`POST`), TC-53 (`PUT`), TC-54 (`DELETE`). |
| `auth_token` = `EXPIRED` | A JWT carrying `role='admin'` and an `exp` claim already in the past, **signed with the local SUT backend's JWT signing secret** (the SUT runs locally from `apps/backend/`, so the secret is available to the tester). If the secret cannot be obtained, TC-29 is not executable as written and must **not** be substituted with an arbitrarily-signed token — that is `TAMPERED_SIG_ADMIN_CLAIM`'s condition and would stop isolating expiry from signature failure. Token expiry duration is unspecified in `../specs/requirements.md`; the row records observed behavior. |
| `auth_token` = `TAMPERED_SIG_ADMIN_CLAIM` | Log in as any registered non-admin (customer) account to obtain a genuine, correctly-signed JWT, then edit the decoded payload's `role` claim to `admin` while **retaining the original signature** — no signing secret is required; use `Authorization: Bearer <tampered token>`. Distinct from `MALFORMED` (not a real JWT shape at all) and `EXPIRED` (valid signature, expired `exp`) — this token is well-formed and decodable but fails signature verification (TC-44). |
| `secondary_auth_token` | Blank on every row except `SEQUENCE` rows whose later steps run under a different principal. `customer_valid` on TC-50 and TC-51: the `DELETE /api/products/:id` step uses `auth_token` (`admin_valid`), while the follow-up `GET /api/cart` / `GET /api/orders/:id` step uses this second principal's token. Resolved by the same login flow as `auth_token`. |
| `name`, `name_raw` | `name` substitutes directly as a JSON string. When `name_raw` = `OMIT_KEY`, remove the key entirely (TC-02). `EMPTY_STRING` sends `""` (TC-03). `LEN_254`/`LEN_255`/`LEN_256` (TC-04/05/06) mean generate an alphanumeric string of that exact character length at request time, not a literal CSV value. TC-49 sets `OMIT_KEY` on `name_raw`, `category_id_raw`, `description_raw`, and `imageUrl_raw` together, so the body carries `price` alone — that partial body is the condition under test, not a builder defect. |
| `price`, `price_raw` | `price` substitutes directly as a JSON number. When `price_raw` = `OMIT_KEY`, remove the key entirely (TC-07). `RAW_TYPE_STRING` sends the `price` column's value as a quoted JSON string, not a number (TC-08). |
| `category_id`, `category_id_raw` | `VALID_CATEGORY` resolves at request time to a real `category_id` fetched via `GET /api/categories` immediately before the row fires. `999999` (TC-13, TC-19) is a literal non-existent id. When `category_id_raw` = `OMIT_KEY`, remove the key entirely (TC-12). `RAW_TYPE_STRING` sends the `category_id` column's value as a quoted JSON string, not an integer (TC-14). |
| `description`, `description_raw` | `description` substitutes directly as a JSON string. When `description_raw` = `OMIT_KEY`, remove the key entirely (TC-15). A non-empty `description` value that looks like a SQL probe (TC-34: `' OR '1'='1`) is sent verbatim as the string value, not string-concatenated into a query — this is the payload under test, not a runner escaping bug. |
| `imageUrl`, `imageUrl_raw` | `imageUrl` substitutes directly as a JSON string. When `imageUrl_raw` = `OMIT_KEY`, remove the key entirely (TC-16). |
| `extra_field` = `INJECT_ROLE_ADMIN` | Add an extra, undocumented `"role": "admin"` key to the JSON body alongside the normal fields (TC-35). |
| `extra_field` = `INJECT_IS_ADMIN_TRUE` | Add an extra, undocumented `"isAdmin": true` key to the JSON body (TC-36). |
| `body_raw_override` | When present on a `SEQUENCE` row, holds the raw JSON body for that row's first (setup) request, which is not a `/api/products` request and so cannot be built from the `name`/`price`/`category_id`/etc. columns. Currently used only by TC-46: `{"name": "Danh mục CX test"}` for the `POST /api/categories` setup step that creates category `CX`. The row's `name`/`price`/`description`/`imageUrl`/`category_id` columns still build the body for that same row's `POST /api/products` step (with `category_id` = the just-captured `{{CX_ID}}`), exactly as for any other row. |
| `precondition_note` | Not sent on the wire. Names state the runner must establish **before** the row fires and that no column of this row can build: TC-49 (P1 populated on all five documented fields), TC-50 (the customer's cart already holds P1 via `POST /api/cart`), TC-51 (the customer has an order `O1` containing P1), TC-53/TC-54 (P1 exists; no session needed for the request itself). Blank elsewhere. |
| `method` = `SEQUENCE` | This row is a multi-step scenario (create-then-read, update-then-read-other, delete-then-read-then-delete-again, cross-resource setup-then-delete-then-read). The `path` column lists the steps informally; the runner executes them in order using the same `auth_token`, capturing each step's response before firing the next. |
| `method` = `ANALYSIS` | This row does not fire a new HTTP request. It is a post-run analysis step over the response(s) already captured for the `tc_ref` id(s) (TC-37..TC-43). |
| `expected_status` | Blank on every row in this suite — no status code is documented anywhere in `api_specification.md` section 3.3 for any of the three operations (`../schema-cases.md`). `expected_status_note` carries the UNSPECIFIED caveat instead; the runner records the observed code rather than asserting one. |
| `expected_side_effect_note` | The one class of assertion this suite *can* make without a documented status code: whether a product was created/mutated/deleted, and whether an unrelated product's fields stayed unchanged (isolation). Every generic assertion below reads this column, not `expected_status`. |
| `tc_ref` | Not sent on the wire — for `ANALYSIS` rows, names the earlier `tc_id`(s) whose captured response this row inspects. |
| `trace` | Not sent on the wire — carries the coverage id(s) back to `../master-test-cases.md` for audit traceability. |

Sequenced/stateful rows (TC-18, TC-19, TC-20, TC-21, TC-22, TC-24, TC-26, TC-27, TC-29,
TC-31, TC-32, TC-34, TC-36, TC-48, TC-49, TC-50, TC-51, TC-53, TC-54, TC-55) require the runner to have already captured the
referenced product id (`P1_ID`, `A_ID`, `B_ID`, `C_ID`) from an earlier row's response before
firing. TC-46 is self-contained: its own `SEQUENCE` steps create category `CX` and the
product referencing it, capture `CX_ID`/`PRODUCT_CX_ID` from those steps' responses, then use
them in the same row's later steps. Rows referencing `tc_ref` (TC-37..TC-43, TC-52) must run after
every `tc_id` they reference has already produced a captured response.

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

pm.test("mass-assignment rows record whether an undocumented field is persisted", () => {
  if (data.extra_field === "INJECT_ROLE_ADMIN" || data.extra_field === "INJECT_IS_ADMIN_TRUE") {
    // Characterization only (TC-35/TC-36): no source governs an undocumented body
    // key for FR-15 — SEC-06 (srs.md L283) is scoped to PUT /api/users/me. Runner
    // inspects the created/updated product via GET /api/products/:id for a
    // persisted or echoed `role`/`isAdmin` field and RECORDS it. No privilege
    // probe is run here; re-testing a non-admin token is TC-30's condition and
    // cannot serve as evidence for these rows.
    pm.environment.set(`record_undocumented_field_${data.tc_id}`, true);
  }
});

pm.test("SQL injection rows never surface a raw DB error or destroy data", () => {
  if (data.trace && (data.trace.includes("SEC-C-09") || data.trace.includes("SEC-C-10") || data.trace.includes("SEC-05"))) {
    // SEC-C-09/SEC-C-10 cover the body-field injection rows (TC-33, TC-34);
    // SEC-05 also matches TC-45's path-parameter injection row, which has no
    // security-cases.md catalog id of its own.
    const raw = pm.response.text();
    pm.expect(raw).to.not.match(/SQLITE_ERROR|syntax error|SQL error/i);
    // Runner must additionally confirm GET /api/products still lists every
    // product that existed before this row fired.
  }
});

pm.test("error responses are inspected for internal detail (recorded, not asserted)", () => {
  if (pm.response.code >= 400) {
    // srs.md section 9 (L278-284) defines no information-disclosure requirement,
    // so no SEC id supports asserting this as a must (TC-43). Record the
    // observation; a leak is a characterization finding to report.
    const raw = pm.response.text();
    const leaks = /<html/i.test(raw) || /at\s+\S+\s+\(.*:\d+:\d+\)/.test(raw);
    pm.environment.set(`observed_internal_detail_${data.tc_id}`, leaks);
  }
});
```

Rows TC-37..TC-43 and TC-52 (cross-response inspection/comparison) are not sent as new requests by
this template — they are a post-run analysis step over the responses already captured for
the `tc_id`(s) named in their `tc_ref` column, executed once the full data file has run.
