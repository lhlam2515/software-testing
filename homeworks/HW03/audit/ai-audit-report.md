# AI Audit Report

## 1. Summary

- Assignment: HW03 GUI & Usability Testing on EMS
- Task: Task 3 - Cross-Browser / Cross-Platform Testing
- Date / Time: 2026-08-01 15:45:58 +07:00
- AI tool(s) used: ChatGPT (GPT-5.5)
- Purpose:
  - Understand the assignment requirements.
  - Design a compatibility testing workflow.
  - Plan a compatibility matrix.
  - Recommend cloud testing tools.
  - Explain screenshot evidence requirements.
  - Clarify BrowserStack Desktop vs. Real Device behavior.
  - Prepare documentation guidance.
- Human review completed:
  - The generated workflow and compatibility matrix were manually reviewed.
  - Compatibility tests were executed manually.
  - Screenshots and Pass/Fail results were verified by the student before submission.

---

# 2. AI Interaction Log

| Date / Time | AI Tool | Prompt | AI Response | Human Modifications |
|-------------|---------|--------|-------------|---------------------|
| 2026-08-01 15:45:58 +07:00 | ChatGPT (GPT-5.5) | Asked how to complete Task 3 (Cross-Browser / Cross-Platform Testing) and requested detailed steps. | Explained the workflow for selecting three screens, building a compatibility matrix, using BrowserStack or similar tools, testing OS/browser/device combinations, recording Pass/Fail results, capturing screenshots, and documenting evidence. | I selected the actual EMS screens and adjusted the workflow to match the files already in the project. |
| 2026-08-01 15:35:12 +07:00 | ChatGPT (GPT-5.5) | Asked whether Codex should generate the compatibility matrix before testing. | Recommended creating the matrix, report template, folder structure, and screenshot placeholders before running the real tests. | I used that guidance to organize the documentation first. |
| 2026-08-01 15:27:34 +07:00 | ChatGPT (GPT-5.5) | Requested a Codex prompt to generate the compatibility matrix and folder structure. | Produced a prompt for compatibility-matrix.md, testing folders, and report placeholders covering Windows, macOS, Android, Chrome, Firefox, Edge, Safari, Opera/Samsung Internet, Desktop, Tablet, and Phone. | I adapted the prompt to the specific HW03 folder structure. |
| 2026-07-31 08:45:23 +07:00 | ChatGPT (GPT-5.5) | Asked which online tools should be used for compatibility testing. | Recommended BrowserStack Live first, then LambdaTest, Sauce Labs, and real devices if needed. | I planned to use BrowserStack for evidence collection. |
| 2026-07-31 08:26:25 +07:00 | ChatGPT (GPT-5.5) | Asked how many compatibility combinations are required. | Explained that the assignment does not require every possible OS/browser/device combination, only enough coverage so each category is represented at least once per screen. | I used this to plan a smaller matrix with representative coverage. |
| 2026-07-31 08:12:14 +07:00 | ChatGPT (GPT-5.5) | Asked what should be tested on each screen. | Suggested checking layout, fonts, buttons, tables, forms, pagination, search, navigation, scrolling, responsiveness, modal dialogs, hover states, and click behavior. | I limited the final checks to the EMS screens and conditions already documented in the report. |
| 2026-07-31 07:57:49 +07:00 | ChatGPT (GPT-5.5) | Asked how screenshots should be prepared. | Recommended taking screenshots first, overlaying the university email, renaming files consistently, then inserting them into the report. | I followed that workflow where screenshots were used. |
| 2026-07-31 07:38:43 +07:00 | ChatGPT (GPT-5.5) | Asked whether screenshots should be inserted into the report after overlaying the email. | Confirmed the capture → overlay → rename → insert workflow. | I accepted that sequence for the submission package. |
| 2026-07-30 10:58:09 +07:00 | ChatGPT (GPT-5.5) | Asked how to show operating system, browser, and device information when using real devices. | Explained that real-device screenshots may not show complete device details and suggested BrowserStack Live because it shows OS, browser, and device together. | I used this to decide how to label the compatibility matrix evidence. |
| 2026-07-30 10:42:15 +07:00 | ChatGPT (GPT-5.5) | Asked how long BrowserStack Free/Trial lasts. | Said the trial availability can change and recommended completing testing within one session if possible. | I treated this as planning guidance, not a fixed rule. |
| 2026-07-30 10:31:28 +07:00 | ChatGPT (GPT-5.5) | Asked why BrowserStack did not display device information. | Explained the difference between Desktop Live and Real Device sessions, and that Desktop sessions identify the device category as Desktop rather than a hardware model. | I recorded Desktop as the device type in the matrix when using desktop sessions. |
| 2026-07-30 10:17:48 +07:00 | ChatGPT (GPT-5.5) | Uploaded a BrowserStack screenshot asking where the device information was located. | Confirmed that BrowserStack Desktop Live does not show a desktop hardware model and advised recording Device = Desktop in the compatibility matrix while using BrowserStack for OS and browser information. | I used that interpretation in the report and matrix. |
| 2026-07-30 09:57:41 +07:00 | ChatGPT (GPT-5.5) | Requested an AI Audit Report using the provided template. | Generated a sample AI Audit Report covering Task 3 interactions. | I replaced the sample with a version aligned to the actual HW03 files and conversation. |

---

# 3. Notes on Limitations

- AI did not execute any compatibility tests.
- AI did not verify application behavior.
- BrowserStack availability and trial limitations may change over time.
- BrowserStack UI may differ depending on account type and software updates.
- Compatibility matrix recommendations were planning guidance only.
- All Pass/Fail results required manual execution.
- All screenshots, browser information, operating system information, and compatibility observations had to be manually validated before submission.

---

# 4. Evidence and Validation

The following items were checked manually by the student:

## Compatibility Matrix

- Three application screens were selected.
- Required operating systems and browsers were represented.
- Desktop testing was recorded.
- Tablet testing was recorded.
- Phone testing was recorded.

## Functional Verification

For every tested configuration, I verified:

- Layout rendered correctly.
- Navigation worked.
- Forms worked correctly.
- Buttons responded correctly.
- Search functioned correctly.
- Tables displayed correctly.
- Pagination worked.
- Responsive behavior was acceptable.
- Dialogs and modals displayed correctly.
- No overlapping or unreadable UI components appeared in the documented desktop results.

## Screenshot Evidence

Every screenshot was checked for:

- EMS application content.
- Browser information.
- Operating system information.
- Device category or device model where available.
- Student university email overlay where required.

## Manual Validation

I manually verified:

- BrowserStack environment.
- Browser version.
- Operating system.
- Device category.
- Pass/Fail status.
- Notes for any failures.
- Final compatibility matrix.
- Final report screenshots.
