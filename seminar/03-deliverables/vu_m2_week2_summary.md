# Vũ (M2) - Week 2 Deliverables Summary

## 1. Overview

Week 2 covers P1 Mutation + AI for Vũ's Cluster B ownership: `order-status` (FR-10) and `cart/checkout` (FR-08). The confirmed tasks are T5b, T6b, T7b, T8, one Cluster B failure-mode contribution, and review of Lam's T4/T5a/T7a evidence.

## 2. Completed Tasks

| Task ID | Task | Output File | Source Planning File | Notes |
|---|---|---|---|---|
| T5b | Classified Cluster B survivor candidates and selected 1-2 mutants. | `vu_m2_week2_cluster_b_mutation_ai_pack.md` | `02-planning/weekly-checklist.md`; `02-planning/task-assignment.md` | Selected M2B-01 and M2B-02 from the order-status state machine. |
| T6b | Prepared kill assertions for selected Cluster B survivors. | `vu_m2_week2_cluster_b_mutation_ai_pack.md` | `02-planning/weekly-checklist.md`; `02-planning/test-convention.md` | Assertions are ready to add to `order-status.test.js`; mutation-score confirmation is pending real Stryker execution. |
| T7b | Prepared AI synthesis prompt and validation-gate record for Cluster B. | `vu_m2_week2_cluster_b_mutation_ai_pack.md` | `02-planning/weekly-checklist.md`; `02-planning/content-outline.md` | Validation gate is documented; execution results are pending. |
| T8 | Created metrics and equivalent-mutant triage log. | `vu_m2_week2_metrics_and_review_log.md` | `02-planning/weekly-checklist.md`; `02-planning/prep-plan.md` | Numeric metrics were not invented because baseline evidence is missing. |
| FM-B | Added at least one Cluster B Stryker failure mode for F4. | `vu_m2_week2_cluster_b_mutation_ai_pack.md` | `02-planning/weekly-checklist.md`; `02-planning/task-assignment.md` | Failure mode: untested valid state-machine transitions can survive. |
| R-W2 | Reviewed available Lam Week 2 inputs. | `vu_m2_week2_metrics_and_review_log.md` | `02-planning/weekly-checklist.md` | `BASELINE.md` exists but remains placeholder; no T5a/T7a files found in deliverables. |

## 3. Deliverables Created

| File | Purpose |
|---|---|
| `vu_m2_week2_task_traceability.md` | Required traceability table for all confirmed Vũ/M2 Week 2 tasks and unclear items. |
| `vu_m2_week2_cluster_b_mutation_ai_pack.md` | Main Week 2 technical pack for T5b, T6b, T7b, and Cluster B failure-mode contribution. |
| `vu_m2_week2_metrics_and_review_log.md` | T8 metrics/equivalent-mutant triage template and review log for Lam's T4/T5a/T7a inputs. |
| `vu_m2_week2_summary.md` | Required Week 2 summary of tasks, outputs, dependencies, assumptions, and next steps. |

## 4. Dependencies from Week 1

| Week 1 File / Task | How It Was Used | Notes |
|---|---|---|
| `apps/backend/__tests__/order-status.test.js` / T3b | Used as existing baseline context for FR-10 coverage and missing transition cases. | Read only; not modified. |
| `apps/backend/__tests__/cart.test.js` / T3b | Used as existing baseline context for FR-08 cart/checkout coverage. | Read only; not modified. |
| `apps/backend/jest.config.js` and `apps/backend/stryker.config.mjs` / T2 | Used to understand the test and mutation setup Vũ depends on. | Read only; not modified. |
| `seminar/01-research/BASELINE.md` / T4 | Checked for coverage and mutation metrics needed by T8. | It is a placeholder, so metrics remain pending. |

## 5. Assumptions and Questions

| Item | Description | Impact |
|---|---|---|
| A1 | Real Stryker HTML/clear-text output was not available. | Survivor IDs are candidate selections based on source and tests, not confirmed report IDs. |
| A2 | Because the user restricted updates to `03-deliverables/`, proposed test assertions were documented instead of inserted into backend test files. | T6b is ready for implementation but not applied to source tests in this turn. |
| Q1 | Should `canceled -> delivered` be rejected for FR-10? | Determines whether current source has a state-machine defect and whether a future assertion should target it. |
| Q2 | What validation should checkout enforce for missing/negative totals and missing shipping address? | Determines whether FR-08 validation mutants are real gaps or out of scope. |
| Q3 | Where are Lam's T5a/T7a survivor and AI validation artifacts stored? | Needed for Vũ's review item to move from dependency review to full review sign-off. |

## 6. Next Steps

1. Add the two proposed T6b tests to `apps/backend/__tests__/order-status.test.js` when code changes are allowed.
2. Run `npm test`, `npm run test:coverage`, and `npm run stryker` from `apps/backend/`.
3. Replace pending values in the metrics table with real coverage, mutation score, run time, and MS delta.
4. Decide the FR-10 `canceled -> delivered` rule and the FR-08 checkout validation oracle before adding more assertions.
5. Link Lam's T5a/T7a files when available and complete Vũ's cross-review sign-off.
