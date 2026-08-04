# Main Report — HW03

**GUI & Usability Testing on EMS (Event Management System)**

---

## 1. Student Information

| Field | Value |
| ----- | ----- |
| Student name | Lê Hoàng Lâm |
| Student ID | 23127216 |
| Group | 02 |
| Class / Cohort | 23KTPM1 |
| SUT | EMS — <https://prod-dev.ems-fitus.cloud/> |
| Test account(s) used | _TBD (self-registered student/lecturer/guest account — do not share with other members)_ |
| Report date | _TBD_ |

---

## 2. Selected Scenario & Screens

**Scenario B — User registers for an event.**

### 2.1 Why this scenario

_TBD_

### 2.2 Screens under test

| Screen ID | Screen | URL / Path | Reason for selection |
| --------- | ------ | ---------- | -------------------- |
| B1 | Home / event listing | _TBD_ | _TBD_ |
| B2 | Event detail | _TBD_ | _TBD_ |
| B4 | My Registrations / ticket | _TBD_ | _TBD_ |

> **TODO:** ≥ 3 screens required. Justify any screen chosen outside the suggested list in §5 of the assignment.
> **B3 (Registration form) excluded (decided 2026-08-03):** no dedicated route — it is an in-page panel on `/events/{id}` (B2) — and was never executed in Task 1B. Task 1B/2/3 run on B1, B2, B4 only.

### 2.3 Non-overlap declaration (§5)

| Member | Scenario | Screens |
| ------ | -------- | ------- |
| Lê Hoàng Lâm (me) | B | _TBD_ |
|  |  |  |

---

## 3. Task 1A — Shared GUI Checklist (Group Deliverable)

### 3.1 How the checklist was built

_TBD — describe the process: heuristic sources reviewed → AI draft → critical review → human-added items._

| Deliverable | Location |
| ----------- | -------- |
| Checklist (> 40 items, IA-01…IA-04) | [group/gui-checklist.md](group/gui-checklist.md) |
| Reference list | [group/references.md](group/references.md) |
| AI prompts used to build it | [group/checklist-prompts.md](group/checklist-prompts.md) |
| Why AI missed the human-added items | [group/ai-gap-notes.md](group/ai-gap-notes.md) |

### 3.2 Coverage across interface aspects

| Interface aspect | Items | AI-generated | Human-added |
| ---------------- | ----- | ------------ | ----------- |
| IA-01 — General UI standards |  |  |  |
| IA-02 — Forms |  |  |  |
| IA-03 — Navigation |  |  |  |
| IA-04 — Feedback / state |  |  |  |
| **Total** |  |  |  |

### 3.3 Summary of AI gaps

_TBD — summarize `group/ai-gap-notes.md`: what AI systematically missed and why._

---

## 4. Task 1B — Checklist Execution per Screen

> Full per-screen runs live in `artifacts/screens/<screen>/checklist-run.md`. Screenshots are attached for **Failed** items only.

### 4.1 B1 — Home / event listing

| Field | Value |
| ----- | ----- |
| URL | _TBD_ |
| Run date / build | _TBD_ |
| Items run / Passed / Failed | _TBD_ |
| Detailed run | [artifacts/screens/B1-home-event-list/checklist-run.md](artifacts/screens/B1-home-event-list/checklist-run.md) |

**Failed items summary**

| Checklist ID | Item | Why it failed | Finding ID | Screenshot |
| ------------ | ---- | ------------- | ---------- | ---------- |
|  |  |  |  |  |

### 4.2 B2 — Event detail

| Field | Value |
| ----- | ----- |
| URL | _TBD_ |
| Run date / build | _TBD_ |
| Items run / Passed / Failed | _TBD_ |
| Detailed run | [artifacts/screens/B2-event-detail/checklist-run.md](artifacts/screens/B2-event-detail/checklist-run.md) |

**Failed items summary**

| Checklist ID | Item | Why it failed | Finding ID | Screenshot |
| ------------ | ---- | ------------- | ---------- | ---------- |
|  |  |  |  |  |

### 4.3 B4 — My Registrations / ticket

| Field | Value |
| ----- | ----- |
| URL | _TBD_ |
| Run date / build | _TBD_ |
| Items run / Passed / Failed | _TBD_ |
| Detailed run | [artifacts/screens/B4-my-registrations-ticket/checklist-run.md](artifacts/screens/B4-my-registrations-ticket/checklist-run.md) |

**Failed items summary**

| Checklist ID | Item | Why it failed | Finding ID | Screenshot |
| ------------ | ---- | ------------- | ---------- | ---------- |
|  |  |  |  |  |

### 4.4 Bugs found in Task 1B

> Each bug: screen · repro steps · expected vs actual · severity · screenshot. Full entries in [FINDINGS_LOG.md](FINDINGS_LOG.md).

| Finding ID | Screen | Description | Severity | Form submitted |
| ---------- | ------ | ----------- | -------- | -------------- |
|  |  |  |  |  |

---

## 5. Task 2 — Usability Report (5 real users)

### 5.1 Phase 1 — Design & preparation

| Item | Location / Value |
| ---- | ---------------- |
| Task scenario (goal-oriented) | [artifacts/usability/task-scenario.md](artifacts/usability/task-scenario.md) |
| Metrics collected | task success · time on task · errors/hesitations · SUS or UEQ-S |
| Participant table (masked contacts) | [artifacts/usability/participants.md](artifacts/usability/participants.md) |
| Pilot run + refinements | [artifacts/usability/pilot-session.md](artifacts/usability/pilot-session.md) |

_TBD — summarize the scenario and what changed after the pilot._

### 5.2 Phase 2 — Sessions

| # | Participant | Profile | Date | Session notes |
| - | ----------- | ------- | ---- | ------------- |
| 1 | P1 |  |  | [P1-notes.md](artifacts/usability/sessions/P1-notes.md) |
| 2 | P2 |  |  | [P2-notes.md](artifacts/usability/sessions/P2-notes.md) |
| 3 | P3 |  |  | [P3-notes.md](artifacts/usability/sessions/P3-notes.md) |
| 4 | P4 |  |  | [P4-notes.md](artifacts/usability/sessions/P4-notes.md) |
| 5 | P5 |  |  | [P5-notes.md](artifacts/usability/sessions/P5-notes.md) |

### 5.3 Phase 3 — Metrics

| Participant | Task success | Time on task | Errors | Hesitations | SUS / UEQ-S |
| ----------- | ------------ | ------------ | ------ | ----------- | ----------- |
| P1 |  |  |  |  |  |
| P2 |  |  |  |  |  |
| P3 |  |  |  |  |  |
| P4 |  |  |  |  |  |
| P5 |  |  |  |  |  |
| **Average / total** |  |  |  |  |  |

Raw scoring: [artifacts/usability/sus-scores.md](artifacts/usability/sus-scores.md) · [artifacts/usability/metrics.md](artifacts/usability/metrics.md)

### 5.4 Ranked findings (severity 0–4)

> Group similar pain points; separate one-off slips from systemic design problems. Full analysis: [artifacts/usability/findings.md](artifacts/usability/findings.md)

| ID | Screen | Finding | Participants affected | Severity (0–4) | Evidence |
| -- | ------ | ------- | --------------------- | -------------- | -------- |
|  |  |  |  |  |  |

### 5.5 Prioritized recommendations

| Priority | Recommendation | Addresses finding(s) | Expected effect |
| -------- | -------------- | -------------------- | --------------- |
|  |  |  |  |

---

## 6. Task 3 — Cross-Browser / Cross-Platform

### 6.1 Coverage summary

| Requirement | Target | Covered |
| ----------- | ------ | ------- |
| Operating systems | ≥ 3 |  |
| Browsers | ≥ 5 |  |
| Device types | ≥ 3 (desktop, tablet, phone) |  |
| Screens tested | 3 (B1, B2, B4 — B3 excluded, §2.2) |  |
| Tool(s) | BrowserStack / LambdaTest / real device |  |

> Every Task 3 screenshot must overlay `23127216@student.hcmus.edu.vn` next to the EMS URL and identify browser / OS / device. This overlay requirement is scoped to Task 3 cross-platform evidence only — it does not apply to the Task 1B per-screen checklist screenshots.
> **TODO:** confirm the exact MSSV email format required by the course before capturing screenshots.

### 6.2 Per-screen matrices

| Screen | Matrix | Cells | Pass | Fail |
| ------ | ------ | ----- | ---- | ---- |
| B1 | [matrix-B1.md](artifacts/compatibility/matrix-B1.md) |  |  |  |
| B2 | [matrix-B2.md](artifacts/compatibility/matrix-B2.md) |  |  |  |
| B4 | [matrix-B4.md](artifacts/compatibility/matrix-B4.md) |  |  |  |

### 6.3 Compatibility defects

| ID | Screen | OS / Browser / Device | Defect (overflow, overlap, broken layout, unreadable text, unresponsive control…) | Severity | Screenshot |
| -- | ------ | --------------------- | -------------------------------------------------------------------------------- | -------- | ---------- |
|  |  |  |  |  |  |

---

## 7. AI Critique (200–300 words)

> **Must be written entirely by the student.** Where was AI wrong, biased, or incomplete? Why did it miss the issue? What principle about collaborating with AI did this assignment teach?

_TBD_

---

## 8. References

- ISTQB Foundation Level Syllabus (latest edition).
- Nielsen, J. *10 Usability Heuristics for User Interface Design.*
- Norman, D. *The Design of Everyday Things* (6 principles).
- Shneiderman, B. *Eight Golden Rules of Interface Design.*
- Course slides: *GUI + Usability + Compatibility Testing (AI-First, Combined).*
- BrowserStack / LambdaTest documentation — cross-browser & cross-platform testing.
- Hardman, P. (2025). *A Post-AI Learning Taxonomy.*
