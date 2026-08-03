# HW03 - GUI Usability Testing Report

This submission package documents GUI checklist execution and cross-browser / cross-platform testing for EMS, the Event Management System for the Faculty of Information Technology. It includes the shared GUI checklist, the main consolidated report, the cross-browser matrix, screenshots and evidence, and placeholders for any remaining submission metadata that must be completed manually.

## 1. Self-Assessment Table

| Criteria | Status | Evidence / Notes |
|---|---|---|
| Shared GUI checklist | Completed | Available in `task1/gui-checklist.md` with 61 total items across IA-01 to IA-04. |
| Reference sources and AI prompts | Completed | Available in `task1/reference-sources.md`, `task1/ai-prompts.md`, and `task1/ai-gap-notes.md`. |
| Checklist execution on 3+ screens | Completed | Summarized in `HW03-report.md`; the checklist contains 61 items with 51 passed and 10 failed. |
| Bug reports | Partial | Checklist failures are recorded, but no separate confirmed bug log was completed in this package. |
| Usability testing | Not completed | Task 2 was skipped; no real participant data or SUS / UEQ-S results are included. |
| Cross-browser / cross-platform testing | Completed | Available in `task3/cross-browser-matrix.md` and summarized in `HW03-report.md`. |
| Bug & usability findings log | Partial | A findings log file exists, but it still requires manual completion with real entries if any are available. |
| AI audit report and critique | Partial | Draft files are present in `audit/`, but they still require final manual review and completion. |
| Git commit log | Partial | A placeholder commit log exists, but it still needs the actual commit history. |
| Agent skills | Completed | Agent skill files are present under `agent-skills/`. |

## 2. Test Summary

### Scenario Chosen

- Selected scenario: Scenario C, admin user administration.
- Application flow tested: Users Management list, Edit User dialog, and Export to Excel flow.
- Purpose: evaluate GUI quality, form behavior, navigation, feedback/state behavior, and browser compatibility for the EMS user administration flow.

### Screens Tested

| Screen Name | Purpose | Why It Was Selected |
|---|---|---|
| Users List | Main administrative list view for searching and managing users. | It is the primary entry point for the scenario and exercises table, filter, and navigation behavior. |
| Edit User Dialog | Modal form for editing user details and role assignment. | It tests form controls, validation cues, and dialog interaction. |
| Export to Excel Flow | Export action for administrative data output. | It tests asynchronous feedback and page behavior after an export action. |

### GUI Checklist Execution

| Metric | Value |
|---|---:|
| Checklist items designed | 61 |
| Checklist items executed | 61 |
| Passed items | 51 |
| Failed items | 10 |

### Bugs Found

| Severity | Count |
|---|---:|
| Critical | 0 |
| Major | 0 |
| Minor | 0 |
| Total | 0 |

No confirmed bugs were identified from the performed evaluation.

### User Testing Summary

At the time of submission, I was unable to recruit five participants.


### Compatibility Testing Summary

Source: `task3/cross-browser-matrix.md`

| Browser | OS / Device | Result |
|---|---|---|
| Chrome | Windows / Desktop | Pass |
| Safari | iOS / Tablet | Pass |
| Chrome | Android / Phone | Minor Issue |
| Chrome | Windows / Desktop | Pass |
| Firefox | macOS / Desktop | Pass |
| Chrome | Android / Phone | Fail |
| Chrome | Windows / Desktop | Pass |
| Safari | macOS / Desktop | Pass |
| Opera | Windows / Desktop | Pass |

Total compatibility cells covered: 9

## 3. Demo Videos

### Video 1 - Task 1 Demo
Link: https://youtu.be/Tvzos4XgSRE

### Video 2 - Task 3 Demo
Link: https://youtu.be/y_gyjVCS5yA

## 4. Submission Contents

- Main report: `HW03-report.md`
- GUI checklist: `task1/gui-checklist.md`
- Cross-browser matrix: `task3/cross-browser-matrix.md`
- Screenshots and evidence: `screenshots/` and `task3/`
- Demo videos: placeholders in this README
- Supporting documents: `task1/`, `audit/`, `findings/`, `report/`, `agent-skills/`
