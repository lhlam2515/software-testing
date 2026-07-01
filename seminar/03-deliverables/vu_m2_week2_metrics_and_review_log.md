# Vũ (M2) - Week 2 Metrics and Review Log

## 1. T8 Metrics

The Week 2 plan requires measuring setup time, run time, mutation-score gain per AI-generated test, and equivalent-mutant triage. The available baseline file is still a placeholder, so the table below is ready for submission traceability but does not invent numeric results.

| Metric | Required By | Evidence Available | Value | Notes |
|---|---|---|---|---|
| Setup time for Stryker/Jest environment | `02-planning/weekly-checklist.md` T8 | `apps/backend/package.json`, `jest.config.js`, `stryker.config.mjs` exist | Pending measured value | Toolchain appears installed, but no timestamped setup log was found. |
| Baseline Stryker run time | `02-planning/weekly-checklist.md` T8 | `seminar/01-research/BASELINE.md` | Pending measured value | Baseline file contains TODO placeholders. |
| Baseline mutation score | `02-planning/prep-plan.md` A/B/C | `seminar/01-research/BASELINE.md` | Pending measured value | Do not use the User Guide example numbers as project results. |
| Mutation-score gain from M2B-01 | `02-planning/weekly-checklist.md` T6b/T8 | Proposed assertion in `vu_m2_week2_cluster_b_mutation_ai_pack.md` | Pending Stryker rerun | Expected to kill mutants that remove `pending -> canceled`. |
| Mutation-score gain from M2B-02 | `02-planning/weekly-checklist.md` T6b/T8 | Proposed assertion in `vu_m2_week2_cluster_b_mutation_ai_pack.md` | Pending Stryker rerun | Expected to kill mutants that remove `confirmed -> canceled`. |
| AI triage equivalent-mutant count | `02-planning/prep-plan.md` AI Augmentation | Source/test review only | Pending real survivor list | M2B-03 is classified as product/spec defect candidate, not equivalent. |

## 2. Equivalent-Mutant Triage Notes

| Candidate | AI Triage Result | Human Decision | Reason |
|---|---|---|---|
| M2B-01 | Not equivalent | Real test gap | Removing a valid cancel transition changes observable API response and persisted order state. |
| M2B-02 | Not equivalent | Real test gap | Removing a valid cancel transition changes observable API response and persisted order state. |
| M2B-03 | Not equivalent | Product/spec question | `canceled -> delivered` is observable behavior; current source likely violates intended state-machine rules. |
| M2B-04 | Not equivalent, but unclear oracle | Open question | Missing checkout input validation is observable, but planning sources do not specify exact validation behavior. |

## 3. Review of Lam's Week 2 Inputs

| Review Item | Required By | Evidence Checked | Finding / Question |
|---|---|---|---|
| T4 `BASELINE.md` review | `02-planning/weekly-checklist.md` Week 2 / Vũ review item | `seminar/01-research/BASELINE.md` | File exists but is still a placeholder; it needs real coverage, mutation score, survivor table, failure modes, and before/after delta before it can support User Guide or slides. |
| T5a Cluster A survivor review | `02-planning/weekly-checklist.md` Week 2 / Vũ review item | `03-deliverables/` scan | No dedicated T5a survivor-analysis deliverable was found. Question: where is Lam's Cluster A survivor list and selected coupon/auth mutants stored? |
| T7a Cluster A AI validation review | `02-planning/weekly-checklist.md` Week 2 / Vũ review item | `03-deliverables/` scan | No dedicated T7a AI validation-gate record was found. Question: where are the PASS-original / FAIL-mutant logs for coupon/auth assertions? |

## 4. Commands to Capture Pending Evidence

Run these from `apps/backend/` when repository changes are allowed and the team is ready to generate reports:

```bash
npm test
npm run test:coverage
npm run stryker
```

Record the following in the baseline and summary after execution:

| Evidence | Destination |
|---|---|
| Jest pass/fail and coverage summary | `BASELINE.md` coverage section |
| Stryker total mutants, killed, survived, timeout, no coverage, mutation score | `BASELINE.md` mutation score section |
| Status of M2B-01 and M2B-02 after adding assertions | `BASELINE.md` survivor table and delta table |
| Any timeout/no-coverage/equivalent cases | User Guide Failure Modes and T8 triage notes |
