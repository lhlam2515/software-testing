---
name: api-test-sync
description: Synchronize one FR's data-driven API execution artifacts with its audited test-case suite. Use after api-test-auditor when test-data.csv or request-template.md may still represent the pre-audit suite. Trigger for requests to resync audited cases, CSV rows, request variables, sentinels, or the per-FR execution schema. Do not use for initial test generation, auditing, or test execution.
---

# API Test Sync

Synchronize one FR suite at a time. Treat the audited test-case table as the target state and
the current CSV plus request template as that FR's encoding contract.

## Inputs

Resolve one `<suite-dir>` and require:

- `audit/audited-master-test-cases.md`
- `data/test-data.csv`
- `data/request-template.md`

Stop if any required file is missing or the audited table is not execution-ready. Do not use
another FR's files as a fallback.

A change summary or audit log may help locate edits, but it is optional. The audited table
remains authoritative when summaries are absent or incomplete.

## Scope

Write only:

- `data/test-data.csv`
- `data/request-template.md`, and only when the CSV encoding contract changes

Do not modify the audited suite, generator artifacts, source specifications, or execution
evidence. Do not run the SUT.

## Procedure

### 1. Inventory the FR contract

- Parse the audited table and list its base TC IDs.
- Parse the CSV with a CSV-aware parser. Record its header, row count, base TC IDs, split-row
  suffixes, and values used as sentinels or enums.
- Read the request template's variable mappings and generic assertions.
- Derive all column names and encoding rules from this FR only.

### 2. Build the sync map

For every audited TC, map:

`audited TC -> CSV row(s) -> request/template variables -> expected assertions`

Mark each mapping as:

- `KEEP`: already lossless and executable
- `UPDATE`: existing row does not match the audited case
- `ADD`: audited case has no CSV row
- `SCHEMA`: current columns or mappings cannot encode the case without losing meaning

Use a change summary when available to check the map, not as a prerequisite.

### 3. Apply the smallest valid delta

- Update only fields implicated by the audited case.
- Add one row per distinct HTTP request or explicit sequence step.
- Preserve the base TC ID. Use the FR's existing suffix convention for split rows; otherwise
  use stable lowercase suffixes such as `TC-48a`, `TC-48b`.
- Reuse existing columns, sentinels, enums, and note fields before extending the schema.
- Preserve unspecified expectations as unspecified. Never invent a status, body, or side effect.
- Preserve free text and Vietnamese diacritics verbatim.

### 4. Synchronize the schema

Change the schema only for a `SCHEMA` mapping:

- Add the narrowest column or enum value that preserves the audited meaning.
- Give every existing row an explicit neutral value for a new column.
- Add the matching request-variable mapping and assertion behavior to
  `request-template.md` in the same change.
- Confirm that every CSV sentinel or enum value has executable template semantics.

For multi-request cases or genuinely new encodings, consult
[`references/resync-heuristics.md`](references/resync-heuristics.md). Do not load it for a
straight row update.

## Completion checklist

- [ ] One FR only; no convention copied from another suite.
- [ ] Every audited base TC ID maps to at least one CSV row.
- [ ] Every CSV row maps back to exactly one audited base TC ID.
- [ ] Split rows equal the number of distinct requests or sequence steps they encode.
- [ ] CSV parses successfully; every row has exactly the header's field count.
- [ ] Existing TC IDs were not renamed, renumbered, or silently removed.
- [ ] Every audited input, expected result, oracle, and trace is preserved without invention.
- [ ] Every sentinel, enum, and added column is defined by the request template.
- [ ] Row arithmetic is reported: previous rows + added rows - removed obsolete split rows =
      final rows.
- [ ] The final diff changes only the two allowed data artifacts.

## Handoff

Report the FR, files changed, row arithmetic, TC IDs updated or added, schema/template changes,
and any unresolved mapping. Do not claim execution results.
