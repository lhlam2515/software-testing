# Execution shape taxonomy

A data-driven API test-case suite is never purely "1 CSV row = 1 independent HTTP
call". Classify every row into one or more of the 9 shapes below before writing any
script. Detection is column-driven: FRs name their columns differently
(`endpoint` vs `endpoint_override` vs `path`; `precondition_note` vs `cart_setup`), so
read the actual header of `data/test-data.csv` and the mapping table in
`data/request-template.md` for *this* suite before matching against the heuristics :
never assume a column name from a different FR.

Shapes are not mutually exclusive. Shape 9 (wire-level mutation) is a modifier that
composes with whichever base shape (1-8) the row also belongs to.

| # | Shape | Detection heuristic | Requires |
|---|---|---|---|
| 1 | **Independent single request** | Row has a non-blank method/endpoint-equivalent column and no signal for shapes 2-8 | Baseline mechanism only (see script-templates.md §1) |
| 2 | **Fixture-dependent** | Path or body references a placeholder token (`{{X_ID}}`-shaped, or a bare uppercase token the template's mapping table says "resolves from an earlier row's response") that this row does not itself produce | A one-time setup request run before the data loop; §2 |
| 3 | **Multi-step sequence in one row** | Method/technique column holds a literal enum like `SEQUENCE`, or the template's mapping table describes the row as executing more than one HTTP call in order | `pm.sendRequest()` chain inside the row's own script; §3 |
| 4 | **Cross-response analysis, no new request** | Method/endpoint-equivalent columns are blank AND a `tc_ref`/comparison column names one or more earlier `tc_id`s | Response-cache mechanism (§0) + a harmless placeholder request + Test-script assertions; §4. Do not pair `pm.test()` with `pm.execution.skipRequest()` here — see script-templates.md's sandbox constraint 5. |
| 5 | **Timing/boundary wait** | Precondition/note column names an elapsed-time condition relative to another row (`T=Ns`, "Xs after", "elapsed since") | Timestamp captured by the triggering row + `await sleep()`; §5. Flag the Newman timeout requirement in the handoff report. |
| 6 | **Concurrency / race** | Precondition/note column says "concurrently", "simultaneously", "without waiting for the first response", "back-to-back" | `Promise.all()` of `pm.sendRequest()`; §6 |
| 7 | **Cross-actor isolation** | Precondition/note names two distinct actors/accounts and asserts one's state must be unaffected by the other's action | Shape 2 extended: capture both actors' tokens/snapshots; §7 |
| 8 | **Dynamically-resolved reference value** | A column value is documented in the template's mapping table as "resolved at request time" (not a literal), e.g. a computed total, a live-fetched id | `pm.sendRequest()` fetch-then-substitute, cached once if template says it is stable across rows, re-resolved per row otherwise; §8 |
| 9 | **Wire-level payload mutation (modifier)** | A `*_raw`/sentinel-style column holds a documented token (`OMIT_KEY`, `RAW_TYPE_*`, `LEN_n`, `LONG_STRING_*`, `body_raw_override`, `OMIT_HEADER`, `extra_field=INJECT_*`, a named forged/expired/tampered auth-token class) | Plain JS body/header construction, no external library; §9 |

## Row classification procedure

1. Parse the CSV header; for every non-generic column (i.e. not `tc_id`, `technique`,
   `trace`, `expected_status`, `expected_status_note`, `expected_token_present`,
   `expected_body_note`, `expected_side_effect_note`) look up its behavior in the
   template's "Pre-request variable mapping" table.
2. For each row, walk shapes 2 through 9 in order and record every shape that
   matches. A row with no match beyond shape 1 is shape 1 only.
3. If a row's mapping-table entry does not clearly resolve to any shape (a genuinely
   new column/sentinel this taxonomy has not seen), stop and report it rather than
   guessing a mechanism : do not invent behavior the template does not document.
4. Two rows sharing the same shape set should use the same generated script branch;
   do not hand-special-case a row that already fits an existing shape.
