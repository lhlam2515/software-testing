---
name: api-test-generator
description: Generate a traceable, data-driven API test-case suite for one e-Shop endpoint using EP, BVA, state or lifecycle analysis, security requirements, and schema validation. Use when asked to design or seed API test cases; stop before audit or execution.
---

# API Test Generator

Generate test-design artifacts for one endpoint. Follow the output contract in
[`references/templates.md`](references/templates.md); read it before writing files.
For Stages 2 through 5, read the stage-specific reference linked below immediately before
performing that stage. Do not load references for stages already complete.

## Inputs

Resolve:

- the FR id, HTTP method, and endpoint path; ask if the endpoint is not identifiable;
- the relevant contract in `docs/eshop-sut/api_specification.md` and requirement in
  `docs/eshop-sut/srs.md`;
- the output base, defaulting to `homeworks/HW06/artifacts/test-cases/` unless the caller
  specifies another location;
- `<api-slug>` as kebab-case `<fr-id>-<short-name>`, reusing an existing project slug when
  available.

Use only documented behavior as the oracle. Record missing constraints as unspecified;
do not invent values, status codes, schemas, or business rules.

## Workflow

Write each stage under `<output-base>/<api-slug>/`. Complete upstream artifacts before
using them downstream.

### 1. Extract the contract

Create:

- `specs/openapi.yaml`: a minimal fragment for the endpoint, including parameters,
  request body, and documented responses;
- `specs/requirements.md`: functional behavior, business rules, and source locations;
- `specs/security-requirement.md`: applicability of SEC-01 through SEC-07, with a reason
  for every Yes or No.

Mark `openapi.yaml` as AI-generated and requiring human audit.

### 2. Catalog EP and BVA coverage

Read [`references/equivalence-partitioning-and-bva.md`](references/equivalence-partitioning-and-bva.md).

Create `domain-partition-catalog.md` with every body, query, path, and header parameter
from the extracted contract.

- Build complete, non-overlapping partitions for each input and relevant output.
- Give every equivalence class and selected boundary point a stable coverage id.
- Record the selected BVA model and why it applies.

The catalog lists one coverage obligation per row. Test selection may combine compatible
valid classes, but each invalid test must isolate one invalid class unless the specification
requires a combination.

### 3. Model state or resource lifecycle

Read [`references/state-transition-testing.md`](references/state-transition-testing.md).

Create `state-model.md` and state one classification with justification:

- **Explicit state:** model documented states, guards, and transitions.
- **Implicit state:** model counter-, attempt-, or expiry-driven behavior as state.
- **No meaningful state:** substitute resource-lifecycle cases and label the adaptation.

For a state model, create the state table before deriving cases. Target all-transitions
coverage and calculate the achieved design coverage from explicit coverage ids. Include
invalid transitions and terminal-state re-entry when those concepts exist. For lifecycle
coverage, test ordering, missing or deleted resources, and isolation between resources;
never report those cases as state-transition coverage.

### 4. Design security cases

Read [`references/security-testing.md`](references/security-testing.md).

Create `security-cases.md`. Generate cases only for SEC ids marked applicable in
`specs/security-requirement.md`. Each case must contain a concrete payload or condition,
the protected asset or invariant, the attacker or principal, the expected control, and an
observable oracle. Do not use only a vulnerability label.

Use the SRS requirement as the oracle. Typical mappings are:

| ID | Test focus |
| --- | --- |
| SEC-01 | password or hash absent from responses |
| SEC-02 | missing, malformed, expired, or inappropriate JWT |
| SEC-03 | valid non-admin token on an admin endpoint |
| SEC-04 | rendering/escaping only when observable at API scope |
| SEC-05 | concrete SQL injection payloads on reachable string inputs |
| SEC-06 | protected-field or role mass assignment |
| SEC-07 | OTP length, expiry, and single use |

### 5. Design schema cases

Read [`references/schema-validation.md`](references/schema-validation.md).

Create `schema-cases.md` from `specs/openapi.yaml`. Cover documented status codes,
required and forbidden fields, types, nested shapes, and error envelopes. Mark overlaps
with security coverage instead of treating them as unrelated cases. Treat this as
specification-based contract checking, not as a separate ISTQB technique, and cross-check
the generated OpenAPI fragment against the original API specification before using it.

### 6. Consolidate and check coverage

Create `master-test-cases.md` by merging the prior catalogs into one `TC ID` sequence.
Preserve composite coverage and trace every row to a real FR, SEC id, or specification
location.

Report:

- total cases against the caller's target, defaulting to 35 per endpoint;
- counts by technique;
- parameters with no EP/BVA row;
- applicable SEC ids with no security case;
- uncovered valid transitions and documented response variants;
- the specific thin coverage group when below target.

Do not pad the suite with reworded duplicates.

### 7. Prepare data-driven execution inputs

Create:

- `data/test-data.csv`: one row per master case, joined by `TC ID`, with request variables
  and expected-result fields;
- `data/request-template.md`: one parameterized request and generic assertions that read
  expectations from the data row.

Design for one Postman request and test script driven by Collection Runner or Newman. Do
not create or run a live collection unless separately requested.

## Boundaries

This skill performs test-case generation only. Do not:

- audit or label cases VALID, INVALID, or INCOMPLETE;
- send requests to the SUT or report observed pass/fail results;
- create execution evidence, screenshots, bug reports, or anti-cheat proof;
- silently convert an undocumented assumption into an expected result.

Before finishing, verify that every extracted parameter and applicable SEC id is covered,
every trace points to an actual source, every master case has a CSV row, and every reported
shortfall names the missing coverage.
