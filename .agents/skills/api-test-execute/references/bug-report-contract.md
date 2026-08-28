# Bug report contract

Applies after Inspect classifies one or more failures as an SUT bug candidate (not a test
artifact or environment defect). Do not report an SUT bug from a test-artifact or
environment/transport failure — fix or flag the artifact instead.

## Triage into bug entries

Group failing assertions by root cause, not one row per failing assertion. Several `tc_id`s
often share one underlying defect (see the fr-15 pattern: 15 failing assertions collapsed
into 3 SUT bug candidates plus 1 artifact defect). One bug entry per distinct root cause.

For each bug candidate, pull concrete evidence straight from `newman-report.json` (request
method/path, request body, response status, response body) rather than paraphrasing the
Newman assertion message. "Expected" and "Actual" must be the real values observed, not the
oracle's abstract description.

`BUG_REPORT.md` follows the format used since HW02/HW04/HW05: a **Bug Summary** table (one
row per bug, for a fast scan) followed by a **Detailed Findings** section (one `### BUG-ID -
<title>` subsection per bug, with Description / Steps to Reproduce / Root Cause (optional) /
Expected vs Actual Result / Screenshot). The script below writes both halves from the same
JSON bug object.

Keep **Steps to Reproduce** to concrete reproduction actions only (request, response,
tc_id/iteration used as evidence for *that step*) — never fold in "why it fails". Diagnosis
(source file/line, the mechanism behind the defect, cross-references to other failing
`tc_id`s reproducing the same root cause) belongs in the separate `rootCause` field, which
renders as its own `#### Root Cause` section between Steps and Expected vs Actual Result.
Omit `rootCause` only when the defect is a pure black-box observation with no code-level
explanation available.

## Required fields

| Field | Rule |
|---|---|
| `id` | Stable, unique, e.g. `BUG-FR15-01`. Reuse the FR slug so ids stay traceable across packages. |
| `api` | `METHOD /path` of the endpoint that misbehaved. |
| `severity` | One of `Critical`, `High`, `Medium`, `Low`. Critical = auth/authz bypass, data corruption, or security payload persisted unsanitized. High = missing validation that lets invalid state persist. Medium = wrong status code or response shape with no data-integrity impact. Low = cosmetic or non-blocking deviation. |
| `foundBy` | `AI` when the failing case traces to an AI-generated `tc_id`; `Beyond AI` when it traces to a human-added case (audit extension) or was only surfaced by agent SUT-source inspection during triage, not by any test oracle. Check the case's origin in the audited test suite (`audit/` folder) before labeling. |
| `title` | Short one-line headline for the `### BUG-ID - <title>` heading (e.g. "PUT /api/products/:id has no authentication/authorization middleware"). |
| `description` | One or two sentences naming the defect class. |
| `steps` | Concrete, reproducible steps: exact method, path, headers/body that matter, and iteration/tc_id used as evidence. Either a single string or a JSON array of steps (each array item becomes one numbered step). No diagnosis here — see `rootCause`. |
| `rootCause` | Optional. Source-level explanation of the defect (file:line, mechanism) plus cross-references to other `tc_id`s that reproduce the same root cause. Omit when there is no code-level explanation to give. |
| `expected` | What the SRS/API spec says should happen. |
| `actual` | What the live response/DB state actually showed. |

`status` defaults to `Open`. `githubIssue` (a.k.a. `githubIssueLink`/`issueLink`) and
`screenshot` are optional at triage time and default to `Pending` — see below.

## Recording

Write bug objects to a JSON array file (see `scripts/append-bug-report.mjs --help` usage in
`SKILL.md`) and run the script against the target `BUG_REPORT.md`. The script:

- appends one row to the **Bug Summary** table and one `### BUG-ID - <title>` block under
  **Detailed Findings**, from the same bug object, in the same run;
- matches the summary table's columns by header text, so it works against the current table
  shape;
- validates `severity` and `foundBy` against their enums and rejects unknown values;
- skips ids already present in the summary table (idempotent re-runs);
- drops the `_TBD_` placeholder row automatically once real rows exist.

Never hand-edit the summary table or a detail section for entries the script can generate —
hand edits are for the `GitHub Issue` cell/line and the `#### Screenshot` line after the issue
exists (see below), or for prose outside the table/sections.

## Re-run synchronization

Applies when the package was executed before and the suite changed since (see
[`rerun-contract.md`](rerun-contract.md)). The existing `BUG_REPORT.md` is the record of
record; the re-run updates it, it does not replace it.

| Situation | Action |
|---|---|
| New root cause with no existing entry | Append a new bug through the script, using the next unused id in that FR's `BUG-FR<NN>-NN` sequence. Never reuse a retired id. |
| Existing open bug still reproduced, evidence moved (different `tc_id`, iteration, request body, or response) | Hand-edit that entry's Steps to Reproduce / Root Cause / Expected / Actual to the newly observed values. Keep the id, the `GitHub Issue` cell, and the `#### Screenshot` line. |
| Existing open bug whose only evidence `tc_id` was deleted or rewritten by the audit | Re-point it at a current case that still reproduces the defect. If no current case does, keep the entry, note in its body that the current suite no longer covers it, and say so in the run report. A bug is not resolved because a test case disappeared. |
| Existing open bug no longer reproduced | Do not close it on one run. Re-run that specific `tc_id` once to confirm, then report it as a fix candidate and ask the user before changing `status` away from `Open`. |
| Failure the audit reclassified as a test-artifact or environment defect | Flag it for the user's decision. Do not silently drop the bug row. |

Ids already present are skipped by the script by design, so content updates to existing
entries are always hand edits. New entries always go through the script.

## GitHub Issue and screenshot

REQUIREMENTS.md section 6 item 5 requires each genuine bug to also exist as a GitHub Issue
with an attached screenshot. This skill does not open issues automatically — creating a
GitHub Issue is a visible, hard-to-fully-reverse action on shared state and needs explicit
user confirmation each time, matching this workspace's execution-care policy.

Workflow once the user confirms:

1. Capture a screenshot showing the bug (Postman/Newman response, or the SUT UI reproducing
   the same defect) with the `playwright-cli` skill, or reuse an existing evidence
   screenshot if one already shows the defect.
2. Open the issue with `gh issue create --title "<Bug ID>: <short description>" --body
   "<steps, expected, actual>"` in the SUT's repository, attaching the screenshot.
3. Update the bug's `GitHub Issue` cell in the Bug Summary table, plus its `**GitHub Issue:**`
   line and `#### Screenshot` line in the Detailed Findings section, directly in
   `BUG_REPORT.md` (the script only appends new rows/sections and skips ids already present,
   so it cannot backfill these fields on an existing bug).

Never call `gh issue create` without the user's explicit go-ahead for that specific batch of
bugs.
