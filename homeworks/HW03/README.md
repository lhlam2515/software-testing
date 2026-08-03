# HW03 - GUI Usability Testing Report

## 1. Self-Assessment Table

| Criteria | Status | Evidence / Notes |
|---|---|---|
| Shared GUI checklist | Completed | Summarized in `HW03-report.md` with 61 total items across IA-01 to IA-04. |
| Reference sources and AI prompts | Completed | Documented through the HW03 submission materials and summarized in `HW03-report.md`. |
| Checklist execution on 3+ screens | Completed | Summarized in `HW03-report.md`; the checklist contains 61 items with 51 passed and 10 failed. |
| Bug reports | Completed | `HW03-report.md` reports 0 confirmed bugs: Critical 0, Major 0, Minor 0. |
| Usability testing | Not completed | `HW03-report.md` records that five participants were required, but no participant data was collected or fabricated. |
| Cross-browser / cross-platform testing | Completed | Summarized in `HW03-report.md` with 9 compatibility cells covered. |
| Bug & usability findings log | Completed | Findings are consolidated in `HW03-report.md`; no separate findings summary is needed here. |
| AI audit report and critique | Completed | Documented in the HW03 submission package and summarized in `HW03-report.md`. |
| Git commit log | Partial | A placeholder commit log exists, but it still needs the actual commit history. |
| Agent skills | Completed | Agent skill files are present in the HW03 submission package. |

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
| High | 1 |
| Medium | 4 |
| Low | 3 |
| Total | 8 |

The findings log records 8 bug findings and 4 usability findings. The bug findings are summarized above, and the usability findings are recorded separately in the findings log.

### User Testing Summary

At the time of submission, I was unable to recruit five participants, so no usability test participant data is included.


### Compatibility Testing Summary

Source: `HW03-report.md`

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

## 3. Consolidated Findings

### GUI / Usability Findings

- GUI checklist items executed: 61
- Passed items: 51
- Failed items: 10
- Main issue areas:
  - Button hierarchy and visual affordance
  - Locale and time-zone labeling
  - Required-field indicators and form validation cues
  - Async feedback and progress indication

### Cross-Browser Findings

- Desktop coverage was stable across Chrome, Firefox, Safari, and Opera.
- Phone-sized layouts showed the main compatibility risk.
- The matrix includes 9 tested combinations in total.

### Overall Summary

- Confirmed bugs: 8
- Critical bugs: 0
- High bugs: 1
- Medium bugs: 4
- Low bugs: 3
- Usability findings: 4
- Usability participant data: not collected
- Final submission source of truth: `HW03-report.md`

## 4. Demo Videos

### Video 1 - GUI Checklist Demo
Link: https://youtu.be/Tvzos4XgSRE

### Video 2 - Cross-Browser Demo
Link: https://youtu.be/y_gyjVCS5yA

### Video 3 - Agent Skill Demo
Link: https://youtu.be/6E8WdVNF8dA
