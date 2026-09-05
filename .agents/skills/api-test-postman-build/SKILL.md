---
name: api-test-postman-build
description: Build, statically validate, and dry-run one local Postman FR package from an audited, synchronized API test suite. Use after api-test-sync when the user asks to generate or refresh a Postman collection, environment, iteration-data snapshot, or RUN.md. Do not send requests to the SUT or report execution results.
---

# API Test Postman Build

Build one independently runnable local package for one FR. Keep the audited suite and its
source data read-only; generated package files are disposable build outputs.

## Inputs

Resolve one suite directory and require:

- `audit/audited-master-test-cases.md` for traceability;
- `data/test-data.csv` as the iteration source;
- `data/request-template.md` as the request and assertion contract;
- target package directory, normally `homeworks/HW06/artifacts/postman/<fr-slug>/`.

Stop for a missing input, an undocumented CSV value, or disagreement between the CSV and
request template. Use `api-test-sync` for the latter; do not repair design sources here.

## Build

1. Parse the CSV with a CSV-aware parser. Inventory every `tc_id`, trace, request mapping,
   expected result, precondition, and cleanup need.
2. Classify non-trivial rows with
   [`references/execution-shapes.md`](references/execution-shapes.md). Read only the matching
   sections of [`references/script-templates.md`](references/script-templates.md).
3. Generate or replace only this FR package:
   - `collection.postman_collection.json` using Collection schema v2.1;
   - `environment.postman_environment.json` with placeholders, not credentials;
   - `test-data.csv` as an exact build-time snapshot of the synchronized source;
   - `RUN.md` with a relative, copy-pasteable Newman command and reporter paths;
   - empty `reports/` only when the repository tracks empty directories explicitly.
4. Apply these invariants to every HTTP-producing path, including `pm.sendRequest()`:
   - refuse traffic when `studentId` is blank;
   - send `X-Student-Id: {{studentId}}`;
   - name assertions `[<tc_id>][<trace>] <assertion>`;
   - derive requests and oracles only from the CSV and request template;
   - preserve unspecified outcomes as unspecified, never as passes.

Regenerate the collection rather than preserving hand edits. Do not change another FR's
package or overwrite shared environment values.

## Static validation

Before handoff, verify:

- both JSON files parse and collection schema is v2.1;
- the package CSV exactly matches its source snapshot;
- every CSV `tc_id` is represented and no extra `tc_id` appears;
- every assertion name is reversible to `tc_id` and trace;
- every normal request and scripted request carries `X-Student-Id`;
- every referenced environment variable is declared;
- `RUN.md` names the local collection, environment, data, JSON report, and HTML report;
- no script-body-level (non-nested) `const`/`let` in any generated script — every
  top-level binding is `var` (script-templates.md sandbox constraint 1);
- no bare top-level `await` — every `await` is nested inside a function, normally an
  immediately-invoked `(async () => { ... })();` (constraint 2);
- no script references, by bare identifier, a function or var declared only in a
  different script (collection-level vs. request-level, prerequest vs. test) —
  extract each script's locally-`function`-declared names and its called
  identifiers; every called identifier not locally declared must be a `pm.*` call or
  a JS builtin (constraint 3);
- every `pm.sendRequest(` call passes a 2-argument callback, never the bare
  1-argument form (constraint 4);
- every branch containing `pm.execution.skipRequest()` has at least one
  `pm.sendRequest(`/`send(` call earlier in that same branch — a branch that skips
  with zero prior real traffic must instead build a harmless placeholder request and
  move its assertions to the Test script (constraint 5, see script-templates.md §4).

These five are genuinely checkable by reading the generated script text — no
execution required. A generated collection that violates any of them must be fixed
before the dry-run below, not handed to it to catch.

## Dry-run validation

Static validation cannot observe runtime behavior. The response-object API shape and
`pm.execution.skipRequest()`'s report-omission behavior (constraints 4 and 5 above)
were only discovered by an actual Newman run — the exact gap this step exists to
close before handoff, not after.

Execute the generated scripts once against a target that is not the real SUT:

1. Prefer a Postman mock: `mcp__plugin_postman_postman__createCollection` (or
   `putCollection`) to stage the generated collection, then
   `mcp__plugin_postman_postman__createMock` bound to it, backed by response
   examples derived from each row's `expected_status`/`expected_body_note` columns.
   This creates real cloud resources under the caller's own Postman account — tell
   the user before the first call in a session; do not create them silently. Point a
   throwaway environment's `baseUrl` at the mock's public URL and run Newman
   locally against 1 representative row per distinct dispatcher branch (every
   execution shape actually used, not the full CSV).
2. If no Postman account/quota is available, run the same Newman command against a
   small local `http` stub script instead (canned per-path responses, no
   credentials, no cloud resource) — same verification value, zero account
   dependency. Flag which path was used in the handoff.
3. A non-zero Newman exit code, a thrown `SyntaxError`/`ReferenceError`/`TypeError`
   in the run, or any exercised branch recording zero `pm.test()` results is
   build-blocking: return to Build step 3, fix the script, repeat static validation
   and this step. Do not hand off a package that failed its own dry-run.

The mock/stub target is never `apps/backend` and this step's output is never written
into the package's `reports/` directory — that directory is `api-test-execute`'s
alone, reserved for the real observed run. Discard the dry-run's own request/response
data once it passes; it is scaffolding, not submission evidence.

## Handoff

Report the FR, source suite, generated files, case count, static validation result, the
dry-run's verdict and which target it ran against (mock or local stub), and any
unresolved mapping. State explicitly that runtime behavior against the real SUT remains
unverified.
