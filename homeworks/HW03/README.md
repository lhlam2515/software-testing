# HW03 - GUI Usability Testing Report

## 1. Self-Assessment Table

| STT | Tiêu chí­ | Điểm | Tự đánh giá |
|-----|----------|------:|-------------|
| 1a | **Task 1A — Checklist dùng chung (> 40 mục, IA-01…IA-04) + nguồn tham khảo + prompt AI (nhóm)** | 15 | 15 |
| 1b | **Task 1B — Chạy checklist trên ≥ 3 màn hình + bug report (cá nhân)** | 15 | 15 |
| 2 | **Task 2 — User testing với 5 người dùng thật (kịch bản + 5 phiên + 25 phân tích → Usability Report)** | 25 | 0 |
| 3 | **Task 3 — Ma trận Cross-Browser / Cross-Platform (3 OS × 5 browser × 3 loại thiếtbị)** | 25 | 25 |
| 4 | **Nộp Bug & Usability Findings (Google Form) + log tổng hợp** | 10 | 10 |
| 5 | **Agent Skills** | 10 | 10 |
|  | **Tổng** | **100** | **75** |
## 2. Test Summary

### Scenario Chosen

- Application name: EMS, the Event Management System for the Faculty of Information Technology.
- Selected scenario: Admin user administration, based on Scenario C.
- Objective: evaluate the Users Management screens for GUI quality, form behavior, navigation, and feedback/state behavior.
- Why this scenario was chosen:
  - It covers multiple core admin interactions in EMS.
  - It includes list views, editing dialogs, and export feedback.
  - It provides good coverage for both GUI checklist execution and cross-browser compatibility testing.

### Screens Tested

- Screens tested:
  - Users List
  - Edit User Dialog
  - Export to Excel Flow
- Users List purpose: main administrative list view for searching and managing users.
- Edit User Dialog purpose: modal form for editing user details and role assignment.
- Export to Excel Flow purpose: export action for administrative data output.

### GUI Checklist Summary

| Metric | Value |
|---|---:|
| Checklist items designed | 61 |
| Checklist items executed | 61 |
| Pass items | 51 |
| Fail items | 10 |

### Bug Summary

| Metric | Value |
|---|---:|
| Total bugs / usability findings identified | 12 |
| Confirmed bugs | 8 |
| Usability findings | 4 |
| Critical | 0 |
| High | 1 |
| Medium | 4 |
| Low | 3 |

The findings log records 8 bug findings and 4 usability findings.

### User Testing Summary

| Metric | Value |
|---|---:|
| Participants | Not available |

The report explicitly states that five participants were required, but no usability test participant data is included.

### Cross-Browser / Cross-Platform Summary

| Metric | Value |
|---|---:|
| Compatibility matrix cells covered | 9 |

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

Brief summary:
- Screens tested: Users Management list, Edit User dialog, and Export to Excel flow.
- OS covered: Windows, iOS, Android, and macOS.
- Browsers covered: Chrome, Safari, Firefox, and Opera.
- Device types covered: Desktop, Tablet, and Phone.

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

