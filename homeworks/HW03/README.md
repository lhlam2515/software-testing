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
| [REPORT.md](./REPORT.md) | Main report — selected scenario, per-screen checklist run, Usability Report, cross-platform report, AI Critique |
| [FINDINGS_LOG.md](./FINDINGS_LOG.md) | Consolidated Bug & Usability Findings Log, consistent with the Google Form submissions |
| [prompt_log.md](./prompt_log.md) | Full AI prompt log with timestamps |
| [[AI-02]_AI_Audit_Report.md](./%5BAI-02%5D_AI_Audit_Report.md) | Per-artifact AI audit (prompt, output, verdict, reasoning, student fix) |
| [[AI-03]_AI_Disclosure_Form.md](./%5BAI-03%5D_AI_Disclosure_Form.md) | Mandatory AI usage disclosure |
| [[AI-05]_AI_Privacy_Checklist.md](./%5BAI-05%5D_AI_Privacy_Checklist.md) | AI privacy and responsible-use checklist |
| [group/](./group/) | Group deliverable — shared GUI checklist, references, checklist prompts, AI gap notes |
| [artifacts/screens/](./artifacts/screens/) | Task 1B — per-screen checklist run + screenshots of failed items |
| [artifacts/usability/](./artifacts/usability/) | Task 2 — task scenario, participants, session notes, SUS scores, metrics, findings |
| [artifacts/compatibility/](./artifacts/compatibility/) | Task 3 — per-screen compatibility matrix + cross-platform screenshots |
| [assets/](./assets/) | Signature image and commit log |
| [refs/](./refs/) | Original assignment handouts (PDF/DOCX) and the EMS admin E2E flow document |

---

## Selected Scenario

**Scenario B — User registers for an event** (public discovery + participant registration flow).

### Screens Under Test (≥ 3 required)

| Screen ID | Screen | URL / Path | Why this screen |
| --------- | ------ | ---------- | --------------- |
| B1 | Home / event listing — featured carousel, category, search & filter | `/dashboard` (behind login) | _TBD_ |
| B2 | Event detail — banner, schedule, register button, waitlist notice | `/events/{id}` | _TBD_ |
| B3 | Registration form — role selection, additional role, confirmation | _TBD — no separate route found; "Select Participant" / "Register (Student/Lecturer)" is an in-page panel on `/events/{id}` (B2), not a distinct screen. Confirm before Task 1B whether B3 stays a separate row or folds into B2._ | _TBD_ |
| B4 | My Registrations / ticket — status and barcode/QR | _TBD — not in the top nav (Events / Calendar / Saved Events / User guide); likely under the user-menu dropdown (top-right avatar), not yet surveyed_ | _TBD_ |

> **TODO:** keep at least 3 rows; drop or replace a row only with a stated reason (§5 allows other screens within the same pool if justified).
> **Note (2026-07-28):** the whole app now sits behind a login wall — root `/` and every route redirect to `/login` when unauthenticated. This differs from the "public discovery" premise this scenario was originally framed around; confirm with the group/TA whether that still holds for the redeployed build before finalizing screen descriptions.

---

## Test Summary

### Task 1 — GUI Checklist

| Metric | Count |
| ------ | ----- |
| Checklist items designed (group, IA-01…IA-04) |  |
| — IA-01 General UI standards |  |
| — IA-02 Forms |  |
| — IA-03 Navigation |  |
| — IA-04 Feedback / state |  |
| Items originating from AI |  |
| Items added by student (human) |  |
| Screens under test |  |
| Checklist checks executed (items × screens) |  |
| Passed |  |
| Failed |  |
| Bugs reported |  |

### Per-Screen Breakdown

| Screen | Items Run | Passed | Failed | Bugs |
| ------ | --------- | ------ | ------ | ---- |
| B1 — Home / event listing |  |  |  |  |
| B2 — Event detail |  |  |  |  |
| B3 — Registration form |  |  |  |  |
| B4 — My Registrations / ticket |  |  |  |  |
| **Total** |  |  |  |  |

### Task 2 — User Testing (5 real participants)

| Metric | Value |
| ------ | ----- |
| Participants recruited (target: 5) |  |
| Pilot sessions run |  |
| Task success rate (complete / partial / fail) |  |
| Average time on task |  |
| Total errors / hesitations observed |  |
| Average SUS (or UEQ-S) score |  |

| Usability findings by severity | Count |
| ------------------------------ | ----- |
| 4 — Usability catastrophe |  |
| 3 — Major |  |
| 2 — Minor |  |
| 1 — Cosmetic |  |
| 0 — Not a usability problem |  |
| **Total** |  |

### Task 3 — Cross-Browser / Cross-Platform

| Metric | Value |
| ------ | ----- |
| Matrix cells covered (total across screens) |  |
| Operating systems covered (≥ 3) |  |
| Browsers covered (≥ 5) |  |
| Device types covered (≥ 3) |  |
| Cells passed |  |
| Cells failed |  |
| Tool(s) used (BrowserStack / LambdaTest / real device) |  |

### Findings Submission (§7)

| Metric | Count |
| ------ | ----- |
| Findings submitted to Google Form |  |
| Rows in [FINDINGS_LOG.md](./FINDINGS_LOG.md) |  |
| Match? (must be equal) |  |

---

## Self-assessment

| **No.** | **Criteria** | **Grade** | **Self-Assessed Grade** |
| --- | --- | --- | --- |
| **1a** | Task 1A — Shared checklist (> 40 items, IA-01…IA-04) + references + AI prompts *(group)* | 15 |  |
| **1b** | Task 1B — Checklist run on ≥ 3 screens + bug report *(individual)* | 15 |  |
| **2** | Task 2 — User testing with 5 real users (scenario + 5 sessions + analysis → Usability Report) | 25 |  |
| **3** | Task 3 — Cross-Browser / Cross-Platform matrix (3 OS × 5 browsers × 3 device types) | 25 |  |
| **4** | Bug & Usability Findings submission (Google Form) + consolidated log | 10 |  |
| **5** | Agent Skills | 10 |  |
|  | **Total** | **100** |  |

---

## Demo Videos

| # | Scope | What is demonstrated | Link |
| - | ----- | -------------------- | ---- |
| 1 | _TBD_ | _TBD_ | _TBD_ |

---

## Submission Checklist (§15)

- [ ] Main report — Markdown + PDF
- [ ] Group deliverable: shared GUI checklist (> 40 items), references list, checklist prompts
- [ ] User-testing evidence: task scenario, participant table (masked), per-session notes, SUS/UEQ-S responses, metrics table, recordings (if any)
- [ ] Bug & Usability Findings Log, consistent with the Google Form
- [ ] Cross-browser / cross-platform screenshots with MSSV overlay
- [ ] AI Critique + AI Audit Report (Markdown + PDF)
- [ ] Git commit log (`assets/commit-log.txt`)
- [ ] Agent Skill + demo video link
- [ ] Zip named `23127216_HW03_AI_GUIUsability_EMS_<SelfAssessedGrade>.zip`
