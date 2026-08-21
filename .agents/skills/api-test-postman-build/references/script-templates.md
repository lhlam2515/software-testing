# Script templates per shape

Placeholders in `<ANGLE_BRACKETS>` are resolved from the current FR's actual CSV
column names and `request-template.md` mapping table : never copy a placeholder name
from another FR's suite. `data` below always means `pm.iterationData.toObject()`.

## Sandbox behavior constraints (read before writing any script)

Confirmed against this project's actual Newman/postman-sandbox build via a real
build-to-execute cycle (FR-02) — not merely against Postman's published docs, which
disagree with this build on point 4. Every template below already applies these;
violating any of them produces a script that passes JSON/schema validation and still
fails only once Newman actually runs it — see the matching `## Static validation`
bullets in `SKILL.md`.

1. **No top-level `const`/`let`.** Collection-level and request-level scripts of the
   same event type (`prerequest`/`test`) share a top-level-identifier namespace, and
   the same script re-runs every iteration against a persistent context: a
   script-body-level `const`/`let` throws `SyntaxError: Identifier '<x>' has already
   been declared` the 2nd time it's declared into that namespace (another script in
   the same phase declaring the same name, or this script's own 2nd+ iteration). Use
   `var` for every script-body-level binding. `const`/`let` nested inside a
   function/`if`/`for` block are unaffected — keep those as-is.
2. **No bare top-level `await`.** Pre-request/Test scripts parse as plain top-level
   code, not a module — a literal top-level `await` is a `SyntaxError` here. Wrap any
   code needing `await` in `(async () => { ... })();`; the sandbox still waits for it
   before sending the real request / finishing the Test phase.
3. **A script cannot call a function or read a var declared only in a different
   script.** Collection-level and request-level scripts do not share function/var
   *values*, even though (1) proves they share a namespace for redeclaration
   purposes — confirmed against Postman's own docs, which state directly that
   attaching custom properties to `pm` is unsupported too. Declare every helper
   **locally, inside the one script that calls it** — duplicate the few lines rather
   than share. `pm.environment` / `pm.collectionVariables` / `pm.globals` and
   `pm.request` mutations remain the reliable way to pass *data* (not functions)
   across this boundary.
4. **`pm.sendRequest(config)` with no callback did not resolve to a usable
   response** in this build (`.text()` was not a function, `.code` was `undefined`)
   despite matching Postman's documented promise pattern exactly. Always use the
   callback form, wrapped in an explicit `Promise`, declared locally per constraint 3:
   ```js
   function send(config) {
     return new Promise((resolve, reject) => {
       pm.sendRequest(config, (error, response) => {
         if (error) { reject(error); return; }
         resolve(response);
       });
     });
   }
   ```
   Every template below uses `send(config)`, not `pm.sendRequest(config)` directly.
5. **`pm.execution.skipRequest()` drops that iteration's `pm.test()` results from the
   Newman report entirely if no real HTTP call happened first in that same script** —
   confirmed against Postman's own docs ("no response and no tests found"), not just
   this build. §3/§6/§8 fire real `send()` traffic before their own
   `skipRequest()`, so their `pm.test()` calls are recorded — safe. §4 (cross-
   response analysis) previously called `skipRequest()` with zero real traffic first
   and silently lost every assertion; it no longer does — see §4 below.

## §0 : Trace and student header (mandatory foundation)

Every real request in the collection must run this. Place it in the **collection's**
`event` array (`listen: "test"`), not on the individual request, so shape 4/7/8 rows
always have something to read regardless of which request produced it.

```js
var data = pm.iterationData ? pm.iterationData.toObject() : {};
if (data.tc_id) {
  pm.environment.set(`captured_${data.tc_id}`, JSON.stringify({
    status: pm.response.code,
    headers: pm.response.headers.toObject(),
    body: pm.response.text(),
  }));
}
```

Collection-level pre-request script (mandatory, every FR). Refuse to send traffic
when the runtime value is absent:

```js
var studentId = pm.environment.get('studentId');
if (!studentId || !String(studentId).trim()) {
  throw new Error('studentId is required; request not sent');
}
pm.request.headers.upsert({ key: 'X-Student-Id', value: String(studentId) });
```

`sleep`/`base64url`/`decodeBase64url`/`send` (needed by §5, §6, §9) are **not**
declared here : per constraint 3 above, a request-level or Test-phase script cannot
see a function declared in this collection-level script. Declare a local copy inside
whichever script actually calls it — every template below does this.

Name every assertion `[${data.tc_id}][${data.trace}] <assertion>`. Every
`send()`/`pm.sendRequest()` call must explicitly include
`'X-Student-Id': pm.environment.get('studentId')` — collection-level pre-request
headers are not applied to it automatically.

## §1 : Independent single request (baseline)

```js
var data = pm.iterationData.toObject();
if (!data.<METHOD_COL> && !data.<ENDPOINT_COL>) {
  // no HTTP call for this row : shape 4, handled separately, do not fall through
  pm.execution.skipRequest();
} else {
  pm.request.method = data.<ENDPOINT_OVERRIDE_COL> ? data.<ENDPOINT_OVERRIDE_COL>.split(' ')[0] : data.<METHOD_COL>;
  const path = data.<ENDPOINT_OVERRIDE_COL> ? data.<ENDPOINT_OVERRIDE_COL>.split(' ')[1] : data.<ENDPOINT_COL>;
  pm.request.url = pm.environment.get('baseUrl') + path; // already-resolved {{VAR}} tokens in `path` are substituted by Postman's own templating before this runs
  // headers/body: see §9 for sentinel-driven construction
}
```

Note: when `path` already contains `{{P1_ID}}`-style tokens (shape 2), do not
re-implement variable substitution manually : Postman resolves `{{...}}` inside the
final `pm.request.url` string against environment variables automatically, as long as
the referenced variable was set by the fixture-setup request (§2) before this row
runs.

## §2 : Fixture-dependent (one-time setup request)

Add a request **before** the data-driven runner. Newman applies iteration data to the
whole collection, so guard its pre-request script to send it only on iteration 0:

```js
if (pm.info.iteration > 0) pm.execution.skipRequest();
```

Its Test script captures the id(s) the CSV rows reference:

```js
var body = pm.response.json();
pm.environment.set('<FIXTURE_VAR_NAME>', body.id);
```

If more than one fixture is needed (e.g. two independent products, or a category plus
a product), either chain multiple setup requests in folder order, or fold them into
one setup request's script using §3's `send()` pattern.

## §3 : Multi-step sequence in one row

```js
function send(config) {
  return new Promise((resolve, reject) => {
    pm.sendRequest(config, (error, response) => {
      if (error) { reject(error); return; }
      resolve(response);
    });
  });
}

var data = pm.iterationData.toObject();
(async () => {
  const step1 = await send({
    url: pm.environment.get('baseUrl') + '<STEP1_PATH>',
    method: '<STEP1_METHOD>',
    header: {
      Authorization: `Bearer ${pm.environment.get('<TOKEN_VAR>')}`,
      'X-Student-Id': pm.environment.get('studentId'),
    },
    body: { mode: 'raw', raw: JSON.stringify(<STEP1_BODY_FROM_ROW>) },
  });
  pm.test(`[${data.tc_id}][${data.trace}] <sequence step 1 assertion>`, () => {
    pm.expect(step1.code).to.be.oneOf([200, 201]); // replace with the documented/UNSPECIFIED-record behavior for this row
  });
  const capturedId = step1.json().id;

  const step2 = await send({
    url: pm.environment.get('baseUrl') + `<STEP2_PATH_TEMPLATE>`.replace('<PLACEHOLDER>', capturedId),
    method: '<STEP2_METHOD>',
    header: { 'X-Student-Id': pm.environment.get('studentId') },
  });
  pm.test(`[${data.tc_id}][${data.trace}] <sequence step 2 assertion>`, () => {
    // assert per this row's expected_side_effect_note / expected_body_note
  });
  pm.execution.skipRequest(); // the visible Postman request fires nothing itself; all traffic went through send() — safe per constraint 5, real traffic already happened above
})();
```

Every `pm.test()` call inside a `send()` callback still registers with Newman's
assertion count and appears in the HTML/JSON report : only the top-level "requests
executed" summary metric under-counts sequence/concurrency traffic. Record this in
the handoff so the report explains the discrepancy.

## §4 : Cross-response analysis, no new request

Do **not** put `pm.test()` in the pre-request script paired with
`pm.execution.skipRequest()` — confirmed (constraint 5 above) to drop the whole
iteration's assertions from the Newman report, not just skip the Test script.
Instead send a harmless, state-free placeholder request (a method/path combination
guaranteed not to match any real route on this FR's own base path, so it 4xxs
without mutating SUT state) and put the real assertions in the **Test** script,
keyed off `captured_*` — never off this placeholder's own response.

Pre-request script:

```js
var data = pm.iterationData.toObject();
pm.request.method = '<HARMLESS_METHOD>'; // e.g. GET on a POST-only route of this FR
pm.request.url = pm.environment.get('baseUrl') + '<HARMLESS_PATH>';
pm.request.body.mode = 'raw';
pm.request.body.raw = '';
pm.request.headers.remove('Content-Type');
```

Test script:

```js
var data = pm.iterationData.toObject();
function captured(tcId) {
  const raw = pm.environment.get(`captured_${tcId}`);
  return raw ? JSON.parse(raw) : null;
}

var refs = data.<TC_REF_COL>.split(',').map((s) => s.trim());
var rows = refs.map((id) => captured(id));

pm.test(`[${data.tc_id}][${data.trace}] <assertion described in expected_body_note>`, () => {
  rows.forEach((c, i) => pm.expect(c, `missing captured response for ${refs[i]}`).to.not.eql(null));
  // e.g. same top-level key set across all `rows` entries:
  const keySets = rows.map((c) => Object.keys(JSON.parse(c.body || '{}')).sort().join(','));
  pm.expect(new Set(keySets).size).to.eql(1);
});
```

## §5 : Timing/boundary wait

The row that *triggers* the timed condition must record a timestamp in its Test
script:

```js
pm.environment.set('<TIMER_VAR>', Date.now());
```

The waiting row's pre-request script:

```js
var data = pm.iterationData.toObject();
(async () => {
  const start = Number(pm.environment.get('<TIMER_VAR>'));
  const targetMs = <TARGET_OFFSET_MS_FOR_THIS_ROW>;
  const wait = targetMs - (Date.now() - start);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
})();
```

Handoff must state the required Newman flags for this FR when its configured timeout
would otherwise be too short:
`--timeout-script <max_wait_ms + margin> --timeout-request <max_wait_ms + margin>`

## §6 : Concurrency / race

```js
function send(config) {
  return new Promise((resolve, reject) => {
    pm.sendRequest(config, (error, response) => {
      if (error) { reject(error); return; }
      resolve(response);
    });
  });
}

var data = pm.iterationData.toObject();
(async () => {
  const fire = () => send({
    url: pm.environment.get('baseUrl') + data.<ENDPOINT_COL>,
    method: data.<METHOD_COL>,
    header: { 'X-Student-Id': pm.environment.get('studentId') },
    body: { mode: 'raw', raw: JSON.stringify(<BODY_FROM_ROW>) },
  });

  const results = await Promise.all([fire(), fire(), fire()]); // count = what the row's precondition_note specifies
  results.forEach((res, i) => {
    pm.test(`[${data.tc_id}][${data.trace}] concurrent attempt ${i + 1} <assertion>`, () => {
      // per-attempt assertion from expected_body_note
    });
  });
  // then the follow-up verification call the row's precondition_note describes, awaited normally
  pm.execution.skipRequest(); // safe per constraint 5 — real traffic (fire() x N) already happened above
})();
```

## §7 : Cross-actor isolation

Extends §2: the fixture-setup request (or a second one) must capture a second
actor's token/snapshot:

```js
pm.environment.set('<ACTOR_B_TOKEN_VAR>', loginResponse.json().token);
pm.environment.set('<ACTOR_B_SNAPSHOT_VAR>', JSON.stringify(beforeStateResponse.json()));
```

The tested row's Test script (or, for an analysis row, its own Test script per §4)
diffs the snapshot against a fresh read of actor B's state after actor A's action.

## §8 : Dynamically-resolved reference value

```js
function send(config) {
  return new Promise((resolve, reject) => {
    pm.sendRequest(config, (error, response) => {
      if (error) { reject(error); return; }
      resolve(response);
    });
  });
}

(async () => {
  const resolved = await send({
    url: pm.environment.get('baseUrl') + '<RESOLVE_ENDPOINT>',
    method: 'GET',
    header: {
      Authorization: `Bearer ${pm.environment.get('<TOKEN_VAR>')}`,
      'X-Student-Id': pm.environment.get('studentId'),
    },
  });
  const value = <EXTRACT_FROM_RESOLVED_RESPONSE>;
})();
```

If the template's mapping table says the value is stable across the whole run (e.g. a
category id), cache it once in the fixture-setup request (§2) instead of re-resolving
every row.

## §9 : Wire-level payload mutation (compose into whichever base shape applies)

```js
function buildBody(data, fieldSpecs) {
  // fieldSpecs: [{ key, valueCol, rawCol }, ...] : the FR-specific field list from
  // the template's "Body (raw JSON)" section.
  const obj = {};
  for (const { key, valueCol, rawCol } of fieldSpecs) {
    const raw = data[rawCol];
    if (raw === 'OMIT_KEY') continue;
    if (raw === 'RAW_TYPE_NULL') { obj[key] = null; continue; }
    if (raw === 'RAW_TYPE_NUMBER') { obj[key] = Number(data[valueCol]); continue; }
    if (raw === 'RAW_TYPE_STRING') { obj[key] = String(data[valueCol]); continue; }
    if (raw === 'RAW_TYPE_ARRAY') { obj[key] = JSON.parse(data[valueCol]); continue; }
    if (raw && raw.startsWith('LEN_')) { obj[key] = 'a'.repeat(Number(raw.slice(4))); continue; }
    if (raw === 'LONG_STRING_5000_CHARS') { obj[key] = 'a'.repeat(5000); continue; }
    if (raw === 'EMPTY_STRING') { obj[key] = ''; continue; }
    obj[key] = data[valueCol];
  }
  return obj;
}

var data = pm.iterationData.toObject();
if (data.body_raw_override) {
  pm.request.body = { mode: 'raw', raw: data.body_raw_override }; // deliberately malformed JSON : send verbatim
} else {
  pm.request.body = { mode: 'raw', raw: JSON.stringify(buildBody(data, [/* FR-specific field list */])) };
}

if (data.extra_field === '<INJECT_ROLE_ADMIN_TOKEN>') {
  const body = JSON.parse(pm.request.body.raw);
  body.role = 'admin';
  pm.request.body.raw = JSON.stringify(body);
}

if (data.content_type === 'OMIT_HEADER') {
  pm.request.headers.remove('Content-Type');
} else if (data.content_type) {
  pm.request.headers.upsert({ key: 'Content-Type', value: data.content_type });
}
```

Forged/tampered/expired auth tokens (no external JWT library available or needed in
the Postman sandbox). `base64url`/`decodeBase64url` are declared locally alongside
`forgeJwt`/`tamperRealToken` in whichever script calls them — per constraint 3, do
not assume they exist just because another FR's script declared them:

```js
function base64url(input) {
  return btoa(unescape(encodeURIComponent(input)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeBase64url(input) {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(input.length + (4 - (input.length % 4 || 4)) % 4, '=');
  return decodeURIComponent(escape(atob(padded)));
}

function forgeJwt(payloadOverrides) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({ sub: 'forged', ...payloadOverrides }));
  return `${header}.${payload}.invalidsignature`;
}

function tamperRealToken(realJwt, payloadOverrides) {
  const [header, payload, signature] = realJwt.split('.');
  const decoded = JSON.parse(decodeBase64url(payload));
  const tampered = base64url(JSON.stringify({ ...decoded, ...payloadOverrides }));
  return `${header}.${tampered}.${signature}`; // signature now invalid for the mutated payload
}
```

Path-parameter injection/URL-encoded literals (e.g. a raw `%20`/`%3D` segment): assign
`pm.request.url` as a plain already-encoded string, not through
`pm.request.url.query.add(...)` or a path-segment array : the latter re-encodes and
turns `%20` into `%2520`. Verify this specific case with a one-request spike before
trusting it across the whole suite.

Fetch the caller's field list, sentinel set, and auth-token class names from that
FR's own `request-template.md` mapping table : the examples above (`OMIT_KEY`,
`RAW_TYPE_*`, `INJECT_ROLE_ADMIN`, ...) are illustrative conventions this project's
suites already share, not a fixed enum to assume blindly for an unseen FR.
