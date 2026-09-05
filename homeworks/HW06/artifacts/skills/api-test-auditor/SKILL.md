---
name: api-test-auditor
description: Audit an AI-generated API test-case suite after api-test-generator. Label every original case VALID, INVALID, or INCOMPLETE with source evidence; correct defective cases; add at least five source-backed cases the AI missed; and preserve a transparent audit trail. Use for design-time review before test execution.
---

# API Test Auditor

Audit and extend an AI-generated API test suite. Keep the generated suite unchanged as the
baseline, and write all reviewed artifacts to a separate `audit/` directory.

Read [`references/audit-heuristics.md`](references/audit-heuristics.md) before auditing.

## Required inputs

Resolve the test-suite directory and verify that it contains:

- `master-test-cases.md`, the original generated suite;
- the generator's supporting catalogs and models, when available;
- the authoritative API specification, SRS, and security requirements used as oracles.

If the original suite or authoritative sources are missing, stop and ask for them. Do not
generate a replacement suite or treat generated artifacts as authoritative evidence.

## Mode select

Inspect the target `audit/` directory before starting.

- No `audit-log.md` present: run **Pass 1**, workflow steps 1-5 below.
- `audit-log.md` already present: run **[Pass 2](#pass-2-re-audit)** instead. A prior audit is a
  reviewable artifact, not a settled result. Do not repeat Pass 1 and do not overwrite its files.

## Workflow (Pass 1)

### 1. Establish the evidence base

List the authoritative sources and the generated supporting artifacts separately. For each
original TC, open every cited source before accepting its `Trace`, expected result, or oracle.

### 2. Audit every original TC

Apply the per-case checklist and label rules in `references/audit-heuristics.md`. Record one
row per original TC using:

`TC ID | Label | Source evidence | Reasoning | Student fix`

Requirements:

- assign exactly one label: `VALID`, `INVALID`, or `INCOMPLETE`;
- cite a precise source location in `Source evidence`;
- state the decisive defect or confirmation in one concise reasoning entry;
- for `INVALID` and `INCOMPLETE`, provide the exact replacement text for every affected
  field in `Student fix`;
- use `None` for `Student fix` only when the label is `VALID`.

Audit the original row as written. Do not silently judge a corrected version of it. A source
that is silent on a behavior does not make the case `INVALID`: apply the spec-silence rule in
`references/audit-heuristics.md`, and keep the original TC IDs intact so downstream execution
artifacts stay traceable.

### 3. Confirm the audit

Present the complete provisional label table and the counts for all three labels in one
review pass. Ask the user to accept it or name TC IDs to revise. Re-present only revised rows
until accepted. Do not write final artifacts before confirmation.

### 4. Add missed cases

Use the gap checklist and miss taxonomy in `references/audit-heuristics.md`. Add at least five
cases that are absent from the original suite and materially expand its coverage. Prioritize
source-backed security and state-transition gaps; do not invent behavior that the sources do
not define.

Write each case with nine columns:

`TC ID | Technique | Precondition | Input / action | Expected result | Oracle | Trace | Miss category | Why the AI missed it`

Continue the `TC-` sequence. `Miss category` must be `prompt quality`, `model limitation`, or
`API characteristic`. The miss reason must identify a specific, checkable cause. Route the
proposed additions through the same confirmation gate before finalizing them.

### 5. Write outputs

Write to `<test-suite>/audit/`:

- `audit-log.md`: the five-column audit table and `Valid: <n> | Invalid: <n> | Incomplete:
<n> | Total: <n>`;
- `extended-test-cases.md`: confirmed additions in the nine-column schema;
- `audited-master-test-cases.md`: corrected original cases followed by confirmed additions,
  using only the original seven test-case columns so the final suite has one consistent
  execution-ready schema.

Preserve the original `master-test-cases.md`. If existing execution data still represents the
pre-audit suite, disclose that mismatch in the handoff instead of regenerating it silently.

## Pass 2: re-audit

Re-audit an existing audit and produce a more accurate suite. The goal is to attack the prior
pass, not to re-confirm it. Read
[`references/audit-heuristics.md`](references/audit-heuristics.md) `Re-audit challenge rules`
before labeling anything.

### 1. Fix the authority order

Authoritative oracles > the original `master-test-cases.md` > `audit/audit-log.md`,
`audit/extended-test-cases.md`, `audit/audited-master-test-cases.md`. All three audit files are
under review and are never evidence for themselves or for each other.

### 2. Re-derive every label

Derive each label from the oracles first, then compare it against the prior label. Never carry a
label forward because it reads reasonably. An upheld row still needs its own re-derived evidence
and must name the deciding check; agreeing by silence is not a finding.

Attack in both directions, per the challenge rules: false negatives among `VALID` rows, false
positives among `INVALID` / `INCOMPLETE` rows, and defective `Student fix` text on any row.

### 3. Re-audit the Pass 1 additions

Label every added case with the same three labels. An addition with no oracle backing, one that
duplicates an original case, or one resting on the prior auditor's reasoning instead of a source
is `INVALID` and must be rewritten or dropped.

### 4. Check cross-row consistency

Check what a per-case pass cannot see: identical conditions labeled differently, preconditions
that conflict under the documented run order, fixes that contradict each other, and coverage
claims the revised labels now falsify.

### 5. Confirm, in two gates

Present the disagreement table first: every row whose label, evidence, or fix changed, plus the
label-delta counts and the verdict counts. Then present the revised additions. Do not write files
before both are accepted.

### 6. Write Pass 2 outputs

Write alongside the Pass 1 files, never over them:

- `audit/audit-log-v2.md`: one row per original TC and per Pass 1 addition, using
  `TC ID | Prev label | New label | Verdict | Source evidence | Reasoning | Student fix`, where
  `Verdict` is `upheld`, `overturned`, `fix-corrected`, or `dropped`. End with the new label
  counts and the verdict counts.
- `audit/extended-test-cases-v2.md`: surviving Pass 1 additions plus any gap found in this pass,
  in the nine-column schema.
- `audit/audited-master-test-cases-v2.md`: the corrected suite in the seven original test-case
  columns.

Preserve `master-test-cases.md` and every Pass 1 artifact unchanged. A further pass continues the
same versioning (`-v3`) rather than editing `-v2` in place.

## Completion checklist

- [ ] Every original TC ID appears exactly once in `audit-log.md`.
- [ ] Label counts add up to the number of original cases.
- [ ] Every row has verified source evidence and concise reasoning.
- [ ] Every `INVALID` or `INCOMPLETE` row has an exact, source-backed student fix.
- [ ] Every `VALID` row passes every mandatory per-case check, with reasoning that names the
      deciding check rather than asserting a match.
- [ ] Silent-source rows follow the spec-silence rule and are not counted as contract coverage.
- [ ] Corrections preserve the original TC IDs and test intent.
- [ ] The auditor self-checks in `references/audit-heuristics.md` were run before the review pass.
- [ ] At least five non-duplicate additions have specific miss categories and reasons.
- [ ] Corrections and additions appear in the final suite with no lost or silent changes.
- [ ] Final TC IDs are unique and ordered; an explicitly rejected case leaves a documented gap
      in the sequence rather than triggering a renumber.
- [ ] The original generated suite remains unchanged.
- [ ] No execution result or runtime claim appears in the audit artifacts.

Pass 2 adds:

- [ ] Every original TC and every Pass 1 addition appears exactly once in `audit-log-v2.md`.
- [ ] Every row carries a verdict, and upheld rows cite re-derived evidence rather than the
      prior pass's reasoning.
- [ ] Both label counts and verdict counts are stated and add up.
- [ ] Overturned rows name the specific defect in the prior label, evidence, or fix.
- [ ] Pass 1 artifacts and `master-test-cases.md` are unchanged.

## Boundaries

This skill performs design-time audit and extension only. Do not execute requests, diagnose
the SUT implementation, report runtime bugs, modify generator outputs in place, or update
homework-specific reports unless the user separately requests that work.
