# Agent Skills for HW06 API Testing

This folder contains the five agent skills used to produce the HW06 API testing
artifacts for the e-Shop SUT (FR-02 Login, FR-08 Checkout, FR-15 Product CRUD).

A skill is a set of instructions loaded by the AI agent on demand. Each skill
covers one stage of the work and states clearly what it may do and what it must
not do. This README is only an entry point. The full rules live in each
`SKILL.md` and in the `references/` files next to it.

## The five skills

| Skill | Stage | May do | Must not do |
| --- | --- | --- | --- |
| `api-test-generator` | Design | Contract extraction, EP and BVA catalog, state model, security cases, schema cases, master test cases, test data | Audit its own output, send requests |
| `api-test-auditor` | Review | Label each case VALID / INVALID / INCOMPLETE with source evidence, fix broken cases, add missed cases | Send any request to the SUT |
| `api-test-sync` | Encode | Bring `test-data.csv` and `request-template.md` back in line with the audited suite | Design new test cases |
| `api-test-postman-build` | Build | Postman collection, environment, iteration data, `RUN.md`, static checks, dry run | Send requests to the SUT |
| `api-test-execute` | Run | Run Newman, trace failures back to test cases, write `BUG_REPORT.md` | Design cases, edit expected results |

### api-test-generator

Turns one endpoint into a full design package in seven stages: extract the
contract, build the domain partition catalog (EP and BVA), model the state or
resource lifecycle, design security cases (SEC-01 to SEC-07), design schema
cases, consolidate into a master test-case table, and emit the data-driven
execution inputs. Only documented behaviour is used as an oracle. Anything the
specification does not define is recorded as unspecified instead of invented.

### api-test-auditor

Reviews the generated suite against the authoritative sources. It has two modes.
Pass 1 labels every original case, corrects the defective ones, and adds cases the
generator missed. Pass 2 runs when an audit already exists: it treats the previous
audit as a reviewable artifact, fixes the authority order, re-derives every label
from the oracles instead of inheriting old ones, and adds a cross-row consistency
check. The audit never runs a request, so labels come from the specification and
not from observed SUT behaviour.

### api-test-sync

The audited suite and the execution files drift apart as soon as the audit changes
a case. This skill computes the delta per test case (KEEP, UPDATE, ADD, SCHEMA) and
applies the smallest valid change to `data/test-data.csv` and, only when the
encoding contract itself changes, to `data/request-template.md`.

### api-test-postman-build

Builds one self-contained local package per FR: collection (schema v2.1),
environment with placeholders only, a snapshot of the CSV, and `RUN.md`. It then
runs static validation (every `tc_id` present, every assertion name reversible to
its case, every request carrying `X-Student-Id`, Postman sandbox constraints
respected) and a dry run before handing the package over.

### api-test-execute

Runs the package with Newman, keeps the real exit code, and maps each failing
assertion `[<tc_id>][<trace>] <assertion>` back to its CSV row. Failures are
classified as test-artifact defects or as likely SUT bugs, and the latter are
written to `BUG_REPORT.md`. A separate re-run mode syncs an existing bug report
with the results of an updated suite instead of overwriting the old evidence.

## Recommended workflow

The pipeline is linear, and the boundaries between skills are what keep it honest.

```
generator -> auditor -> sync -> postman-build -> execute
```

Repeat it per FR, not per project. Mixing two FRs in one pass makes the audit
trail unusable.

**Before generating**

- Decide how many test cases a human can actually review. In HW06, 35 to 43 cases
  for a single endpoint was already past that limit.
- Write down the authoritative oracles (`srs.md`, `api_specification.md`,
  `security-requirement.md`) and state in the prompt that artifacts produced by the
  agent are never evidence.

**When auditing**

- Use a different model from the one that generated the suite. In Pass 1 of HW06 the
  same model generated and audited, and it certified its own wrong citations as
  correct.
- Require every VALID label to name the deciding check. Reject "Matches" as a reason.
- Run one separate cross-row pass looking for cases that contradict each other, cases
  sharing a precondition state, and run-order conflicts. These defects are invisible
  when reviewing case by case.
- Open each cited line to confirm it says what the case claims.

**After auditing**

- Read the audit's own "Downstream cost" section before moving on. It lists what the
  audit just invalidated.
- Always run `api-test-sync` before a build, even when the audit looks like a small
  change.
- Archive the previous execution results instead of overwriting them.
- Re-check filed bugs against the new labels. A bug anchored to a case that was
  downgraded to characterization no longer has an argument behind it.

**Human checkpoints**

The agent stops and asks at four points, and those stops are worth keeping:

1. Before writing the audit log, and again before writing the extended test cases.
2. Before editing generator documents backwards, since that overwrites earlier evidence.
3. When deciding whether to keep a sentinel value in the CSV.
4. Before every commit, split in the order audit, sync, build, execute, per FR.

**Effort allocation**

Design and audit are the reasoning-heavy stages and deserve the strongest model at
high effort. Sync, build, and execute are light on reasoning but strict on execution
accuracy, so a model that follows instructions well at low effort is the better trade.

## Reading order for a reviewer

1. This file.
2. `api-test-generator/SKILL.md` and `references/templates.md` for the output contract.
3. `api-test-auditor/SKILL.md`, especially the Pass 2 section and
   `references/audit-heuristics.md`.
4. The remaining three skills, which are mechanical and shorter.
