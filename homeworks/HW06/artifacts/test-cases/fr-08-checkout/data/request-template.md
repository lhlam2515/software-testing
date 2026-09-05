# FR-08 `POST /api/checkout` — Parameterized Request Template

This is a design artifact for a data-driven Postman Collection Runner / Newman run
against `data/test-data.csv`. It is not proof of execution — no collection has been
created or run, and no request has been sent to the SUT.

Synced against `audit/audited-master-test-cases-v2.md` (47 cases, `TC-01..TC-47`,
Pass 2) and `audit/extended-test-cases-v2.md`. The CSV carries 50 rows: 47 audited
cases with three of them split one row per request. Rows `TC-36a`/`TC-36b` split the
audited TC-36's two auth sub-cases; `TC-42a`/`TC-42b` split apply-coupon from the
checkout that follows it; `TC-47a`/`TC-47b` split the price-injected `POST /api/cart`
from the checkout that follows it. Rows `TC-29..TC-32`, `TC-35`, `TC-37`, `TC-40` are
analysis-only (no new request). Rows `TC-38`, `TC-39`, `TC-42a`, `TC-43`, `TC-44`,
`TC-45`, `TC-46`, `TC-47a` fire a request to a *different* endpoint than
`POST /api/checkout` — see `endpoint_override` below.

## 1. Request

```
Method: POST
URL: {{baseUrl}}/api/checkout
```

When the current row's `endpoint_override` is non-empty, replace both `Method` and `URL`
with that literal value (e.g. `GET {{baseUrl}}/api/orders/my-orders`) and skip the
`shipping_address`/`total_amount` body build in this section entirely — only the
`Authorization` header logic below still applies, keyed off the same row's `auth_token`.
If such a row also has a non-empty `body_raw_override`, send that string as the request
body after resolving the runtime placeholders listed in section 2 (`USER_A_ID`,
`REAL_CART_TOTAL`); rows with an empty `body_raw_override` send no body.

Headers:

```
Content-Type: {{content_type}}
Authorization: {{auth_header}}
```

`auth_header` is derived from the `auth_token` CSV column by a pre-request script (see
mapping below) — it is not a literal CSV column, since each value requires different
token material (a live login, a hand-crafted invalid string, or a hand-crafted forged
JWT). When `content_type` is `OMIT_HEADER`, the pre-request script must remove the
`Content-Type` header entirely (TC-34) rather than send an empty string.

Body (raw JSON), built by a pre-request script from the current data row, or sent
verbatim from `body_raw_override` when that column is non-empty (TC-33's intentionally
malformed JSON):

```json
{
  "shipping_address": "{{shipping_address}}",
  "total_amount": {{total_amount}}
}
```

## 2. Pre-request variable mapping

| CSV column | Behavior |
| --- | --- |
| `auth_token` = `valid_userA` / `valid_userB` / `valid_userC` | Log in as the named test account first (via `POST /api/login`, not covered by this template) and use the returned `token` to build `Authorization: Bearer <token>`. |
| `auth_token` = `MISSING` | Do not send an `Authorization` header at all. |
| `auth_token` = `MALFORMED` | `Authorization: Bearer not-a-real-token`. |
| `auth_token` = `FORGED_BAD_SIG` | A hand-crafted three-segment JWT with a valid-looking header/payload but a corrupted signature segment. |
| `auth_token` = `EXPIRED` | A token constructed (or obtained) such that its expiry has already passed at request time; token expiry mechanics are themselves flagged unspecified in `../specs/requirements.md` — this row records observed behavior, it does not assert a specific expiry duration. |
| `auth_token` = `NO_SCHEME` | Log in as User A first, then send `Authorization: <raw-token>` — the token value itself with no `Bearer ` (or any) scheme prefix (TC-36a). |
| `auth_token` = `WRONG_SCHEME_BASIC` | `Authorization: Basic dXNlcjpwYXNz` — a syntactically valid but wrong-scheme header, unrelated to the acting user's real credentials (TC-36b). |
| `cart_setup` | Not sent on the wire — instructs the runner what cart precondition must exist before firing this row (item count, known total, which test account, whether the cart was just emptied by a prior row). Rows describing two accounts (e.g. `userA:nonempty + userB:nonempty_separate`) require seeding both carts independently before the request fires. |
| `shipping_address`, `shipping_address_raw` | `shipping_address` substitutes directly as a JSON string. When `shipping_address_raw` = `OMIT_KEY`, remove the key entirely (TC-03). When `RAW_TYPE_NULL`, send `null` unquoted (TC-04). When `RAW_TYPE_NUMBER`, send the `shipping_address` column's value as a JSON number, not a quoted string (TC-06). `LONG_STRING_5000_CHARS` (TC-05) means generate a 5,000-character string at request time, not a literal CSV value. |
| `total_amount`, `total_amount_raw` | `total_amount` substitutes directly as a JSON number. `REAL_CART_TOTAL` and `ITEM_PRICE` are placeholders resolved at request time from the seeded cart's actual computed total / single item price, not literal values. When `total_amount_raw` = `OMIT_KEY`, remove the key entirely (TC-08, TC-13). When `RAW_TYPE_STRING`, send the `total_amount` column's value as a quoted JSON string, not a number (TC-10). |
| `extra_field` = `DOUBLE_SUBMIT` | Fire the built request twice, back-to-back, without waiting for the first response before sending the second (TC-19). |
| `extra_field` = `INJECT_USER_ID_B` | Add an extra, undocumented `"user_id"` (or `"cart_id"`, whichever the implementation might read) key to the JSON body, set to User B's id/cart id, alongside User A's valid token (TC-25). |
| `case_kind` = `contract` | A source defines the expected outcome; the row's `expected_side_effect_note` is decidable and counts toward requirement coverage. |
| `case_kind` = `characterization` | No source defines the outcome. The row records actual behavior to expose the specification gap and counts toward input coverage only. The runner must record, never assert, on these rows — a characterization row that "passes" proves nothing about the requirement. Per `audit/audited-master-test-cases-v2.md`: TC-02, TC-03, TC-04, TC-05, TC-08, TC-10, TC-13, TC-14, TC-17, TC-18, TC-19, TC-31, TC-33, TC-34, TC-35, TC-37, TC-41, TC-46, plus the checkout halves TC-42b and TC-47b. |
| `body_raw_override` non-empty | Send this literal string as the raw request body instead of building JSON from `shipping_address`/`total_amount` (TC-33: deliberately malformed JSON; TC-42a, TC-43, TC-44: the `apply-coupon` body; TC-47a: the price-injected cart line). |
| `USER_A_ID` inside `body_raw_override` | Resolved at request time to User A's id, obtained during setup via `GET /api/users/me` (2.1 line 74) while authenticated as User A. Not a literal value. |
| `total_amount` = `REAL_CART_TOTAL` on TC-42b, TC-47b | An encoding choice, not a value taken from the audited suite. `audit/audited-master-test-cases-v2.md` describes the checkout half of TC-42 and TC-47 as "with a valid `shipping_address`" and is silent on `total_amount`; these rows therefore send the suite's default valid body shape rather than omitting the key, which would collide with TC-08's class. |
| `REAL_CART_TOTAL` inside `body_raw_override` | Same placeholder as the `total_amount` column: resolved at request time from the seeded cart's actual computed total. |
| `ORDER_ID_TC16` inside `endpoint_override` | Resolved at request time to the order id created by TC-16's successful checkout, read from `GET /api/orders/my-orders` as User A (TC-45, TC-46). |
| `endpoint_override` non-empty | Instead of building `POST {{baseUrl}}/api/checkout`, fire a request to this literal method+path, authenticated as the account named in `auth_token` for that row (TC-38, TC-39, TC-42a, TC-43, TC-44, TC-45, TC-46, TC-47a). All other rows leave this column blank and use the default `POST /api/checkout` build above. |
| `tc_ref` non-empty, `endpoint_override` empty, no request columns set | This row does not fire a new HTTP request. It is an analysis-only row that inspects or diffs the response(s) already captured for the referenced `tc_id`(s) (TC-29, TC-30, TC-31, TC-32, TC-35, TC-37, TC-40). |
| `tc_ref` non-empty, `endpoint_override` empty, request columns set | This row fires the default `POST /api/checkout` build, but only after every referenced `tc_id` has completed (TC-42b, TC-47b — the checkout half of a two-request case). |
| `tc_ref` non-empty, `endpoint_override` non-empty | This row fires the `endpoint_override` request, but only after every referenced `tc_id`'s request/response has already completed — `tc_ref` fixes the ordering/timing, it does not mean "no request" here (TC-38, TC-39, TC-44, TC-45, TC-46). |
| `expected_status` | Blank on every row in this suite — no status code is documented anywhere for this endpoint (`../schema-cases.md` SC-01/SC-06). `expected_status_note` carries the UNSPECIFIED caveat instead; the runner records the observed code rather than asserting one. |
| `expected_side_effect_note` | The one class of assertion this suite *can* make without a documented status code: whether an order was created and/or the target cart was cleared. Every generic assertion below reads this column, not `expected_status`. |
| `trace` | Not sent on the wire — carries the audited Pass 2 trace verbatim from `audit/audited-master-test-cases-v2.md`: the coverage id cross-reference(s) back to `../master-test-cases.md` plus the source citation(s) that establish (or fail to establish) the expected result. The generic assertions below key off substrings of the coverage ids, so those ids must stay intact. TC-36's id changed in Pass 2 from `EC-14` to `P-14` (an EC-14 sub-variant); TC-38, TC-39, TC-40 and TC-42..TC-47 carry source citations only, having no coverage id in the generator catalog. |

Sequenced/stateful rows (TC-16, TC-17, TC-18, TC-19, TC-20, TC-25) require the runner to
seed specific cart states and, for TC-17, to run strictly after TC-16 in the same test
account's session. Rows referencing `tc_ref` (TC-29..TC-32, TC-35, TC-37, TC-38, TC-39,
TC-40, TC-42b, TC-44, TC-45, TC-46, TC-47b) must run after every `tc_id` they reference
has already produced a captured response. TC-39 additionally requires User A's checkout
(e.g. TC-16) to have fully completed, with User B's own cart seeded independently
beforehand. TC-44 requires TC-42a and TC-42b both to have completed, since it probes
SAVE10's second use.

Section 4 of `api_specification.md` documents no cart-clear and no cart-item-delete
endpoint, so a cart can be emptied only by a successful checkout and refilled only by
`POST /api/cart`. Every row whose `cart_setup` says the cart is non-empty must repopulate
it via `POST /api/cart` and confirm via `GET /api/cart` before firing — TC-16, TC-17,
TC-42b and TC-47b each leave the cart empty on success.

## 3. Generic assertions (read from the current data row)

```
pm.test("characterization rows record, contract rows may assert", () => {
  // case_kind = characterization means no source defines the outcome. The runner
  // records the observed status/body/side effect and must not fail the row on it.
  pm.environment.set(`case_kind_${data.tc_id}`, data.case_kind);
});

pm.test("status is recorded, not asserted against an undocumented value", () => {
  // expected_status is blank on every row in this suite (no documented status
  // code exists for this endpoint) — record the observed code instead of
  // asserting one.
  pm.environment.set(`observed_status_${data.tc_id}`, pm.response.code);
});

pm.test("side effect matches expected_side_effect_note where it asserts one", () => {
  const note = (data.expected_side_effect_note || "").toLowerCase();
  if (note.includes("no order created")) {
    // Runner must query GET /api/orders/my-orders for the acting account
    // before and after this row and assert the order count is unchanged.
    pm.environment.set(`assert_no_new_order_${data.tc_id}`, true);
  }
  if (note.includes("cart unchanged") || note.includes("cart unaffected")) {
    pm.environment.set(`assert_cart_unchanged_${data.tc_id}`, true);
  }
  if (note.includes("cart cleared") || note.includes("return empty cart")) {
    pm.environment.set(`assert_cart_cleared_${data.tc_id}`, true);
  }
});

pm.test("total_amount tamper rows never charge the submitted value", () => {
  if (data.trace && (data.trace.includes("SEC-C-06") || data.trace.includes("EC-08"))) {
    // Runner must resolve the resulting order's recorded total (response body,
    // GET /api/orders/my-orders, or GET /api/orders/:id) and assert it equals
    // the real cart total captured at cart-seed time, never the submitted `1`.
    pm.environment.set(`assert_total_not_tampered_${data.tc_id}`, true);
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

Rows TC-29, TC-30, TC-31, TC-32, TC-35, TC-37, TC-40 (cross-response inspection /
comparison) are not sent as new requests by this template — they are a post-run analysis
step over the responses already captured for the `tc_id`(s) named in their `tc_ref`
column, executed once the full data file has run.

Rows TC-38, TC-39, TC-42a, TC-43, TC-44, TC-45, TC-46, TC-47a fire a genuine new request
via `endpoint_override` (`GET /api/orders/my-orders`, `POST /api/apply-coupon`,
`GET /api/orders/:id`, `POST /api/cart`) rather than a `POST /api/checkout` request; those
carrying a `tc_ref` are timed after their referenced row(s) complete — see the
`endpoint_override` mapping in section 2.
