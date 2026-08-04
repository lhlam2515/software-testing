# HW03 — GUI & Usability Testing on EMS

## Student Information

- **Student name**: Lê Hoàng Lâm
- **Student ID**: 23127216
- **Group**: 02
- **Class / Cohort**: 23KTPM1
- **Github Repository**: [github.com/lhlam2515/software-testing](https://github.com/lhlam2515/software-testing)
- **SUT (EMS web)**: <https://prod-dev.ems-fitus.cloud/>

---

## Submission Contents

| Document | Description |
| -------- | ------------ |
| [REPORT.md](./REPORT.md) | Main report — selected scenario, per-screen checklist run, AI Critique |
| [FINDINGS_LOG.md](./FINDINGS_LOG.md) | Consolidated Bug & Usability Findings Log, consistent with the Google Form submissions |
| [prompt_log.md](./prompt_log.md) | Full AI prompt log with timestamps |
| [[AI-02]_AI_Audit_Report.md](./%5BAI-02%5D_AI_Audit_Report.md) | Per-artifact AI audit (prompt, output, verdict, reasoning, student fix) |
| [[AI-03]_AI_Disclosure_Form.md](./%5BAI-03%5D_AI_Disclosure_Form.md) | Mandatory AI usage disclosure |
| [[AI-05]_AI_Privacy_Checklist.md](./%5BAI-05%5D_AI_Privacy_Checklist.md) | AI privacy and responsible-use checklist |
| [group/](./group/) | Group deliverable — shared GUI checklist, references, checklist prompts, AI gap notes |
| [artifacts/screens/](./artifacts/screens/) | Task 1B — per-screen checklist run + screenshots of failed items |
| [assets/](./assets/) | Signature image and commit log |
| [refs/](./refs/) | Original assignment handouts (PDF/DOCX) and the EMS admin E2E flow document |

---

## Selected Scenario

**Scenario B — User registers for an event** (public discovery + participant registration flow).

### Screens Under Test (≥ 3 required)

| Screen ID | Screen | URL / Path | Why this screen |
| --------- | ------ | ---------- | --------------- |
| B1 | Home / event listing — featured carousel, category, search & filter | `/dashboard` (behind login) | Entry point of the registration flow; a filterable data-list pattern that exercises IA-01 (layout, i18n) and IA-03 (search, filter, back-navigation). |
| B2 | Event detail — banner, schedule, register button, waitlist notice | `/events/{id}` | Holds the actual registration action; a status-dependent detail page that exercises IA-02 (role selection) and IA-04 (register/cancel/share feedback). |
| B4 | My Registrations / ticket — status and barcode/QR | `/profile` (no dedicated route; reached via hamburger menu, "View profile") | End state of the flow and the participant's own record view; exercises IA-01 (status badges, i18n) and IA-02 (Change Password form, avatar upload) on a pattern the other two screens don't cover. |

> **Decision (2026-08-03):** B3 (Registration form) is **excluded** from the 3 screens under test. It has no dedicated route — the "Select Participant" / "Register (Student/Lecturer)" panel is an in-page section of `/events/{id}` (B2), not a distinct screen — and it was never executed in Task 1B (no findings-log, no captured screenshots). Task 1B/2/3 all run on **B1, B2, B4**. §5 permits choosing screens other than the suggested list when justified; B3 was considered and dropped for the reason above.
> **Resolved (2026-08-04):** the login-wall premise noted below held for the whole build — every screen in this scenario was tested authenticated as the self-registered Student account. B4's location was confirmed at `/profile` via the hamburger menu's "View profile" entry (no dedicated `/my-registrations`-style route exists).

---

## Test Summary

### Task 1 — GUI Checklist

| Metric | Count |
| ------ | ----- |
| Checklist items designed (group, IA-01…IA-04) | 61 |
| — IA-01 General UI standards | 17 |
| — IA-02 Forms | 21 |
| — IA-03 Navigation | 13 |
| — IA-04 Feedback / state | 10 |
| Items originating from AI | 50 |
| Items added by student (human) | 11 |
| Screens under test | 3 (B1, B2, B4) |
| Checklist checks executed (items × screens) | 183 |
| Passed | 89 |
| Failed | 31 |
| Bugs reported (unique findings) | 30 |

### Per-Screen Breakdown

| Screen | Items Run | Passed | Failed | Bugs |
| ------ | --------- | ------ | ------ | ---- |
| B1 — Home / event listing | 37 | 29 | 8 | 8 |
| B2 — Event detail | 36 | 29 | 7 | 6 (1 shared with B1: BUG-B1-005) |
| B4 — My Registrations / ticket | 47 | 31 | 16 | 16 |
| **Total** | 120 | 89 | 31 | 30 |

### Findings Submission (§7)

| Metric | Count |
| ------ | ----- |
| Findings submitted to Google Form | 30 |
| Rows in [FINDINGS_LOG.md](./FINDINGS_LOG.md) | 30 |
| Match? (must be equal) | Yes |

---

## Self-assessment

| **No.** | **Criteria** | **Grade** | **Self-Assessed Grade** |
| --- | --- | --- | --- |
| **1a** | Task 1A — Shared checklist (> 40 items, IA-01…IA-04) + references + AI prompts *(group)* | 15 | 15 |
| **1b** | Task 1B — Checklist run on ≥ 3 screens + bug report *(individual)* | 15 | 15 |
| **2** | Task 2 — User testing with 5 real users (scenario + 5 sessions + analysis → Usability Report) | 25 | 0 (scoped out — see note below) |
| **3** | Task 3 — Cross-Browser / Cross-Platform matrix (3 OS × 5 browsers × 3 device types) | 25 | 0 (scoped out — see note below) |
| **4** | Bug & Usability Findings submission (Google Form) + consolidated log | 10 | 10 |
| **5** | Agent Skills | 10 | 0 (not submitted for this assignment) |
|  | **Total** | **100** | **40** |

> **Note (Task 2/3, Agent Skills):** this submission covers Task 1 only. Task 2 (User Testing) and Task 3 (Cross-Browser/Cross-Platform) were deliberately dropped from scope, and the Agent Skill deliverable was not submitted — self-assessed at 0 for each rather than left blank, since the work genuinely was not attempted.

---

## Demo Videos

Not applicable — no Agent Skill was submitted for this assignment, so there is no demo video to link.

---

## Submission Checklist (§15)

- [ ] Main report — Markdown + PDF (Markdown done, PDF pending)
- [x] Group deliverable: shared GUI checklist (> 40 items), references list, checklist prompts
- [x] Bug & Usability Findings Log, consistent with the Google Form (30/30 submitted)
- [ ] AI Critique + AI Audit Report (Markdown + PDF)
- [x] Git commit log (`assets/commit-log.txt`)
- [ ] Zip named `23127216_HW03_AI_GUIUsability_EMS_040.zip`
