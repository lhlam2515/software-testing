# AI Audit Report

## Declaration
- AI used: Yes
- Scope: HW03 GUI usability testing materials in this repository
- Source basis: saved AI-assisted artifacts in `HW03-report.md`, the existing HW03 audit draft, the checklist and compatibility matrix, and the HW03 report

## Tool Log

| Date & Time | AI Tool | Prompt | Generated Output | Human Modifications | Validation | Limitations |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-08-01 15:45:58 +07:00 | ChatGPT (GPT-5.5) | Asked how to complete Task 3 (Cross-Browser / Cross-Platform Testing) and requested detailed steps. | Explained the workflow for choosing three screens, building a compatibility matrix, using BrowserStack or similar tools, testing OS/browser/device combinations, recording Pass/Fail results, capturing screenshots, and documenting evidence. | The workflow was narrowed to the actual EMS screens and file structure used in HW03. | Manually checked the final matrix and screenshots against the submitted report. | The AI provided planning guidance only and did not execute any tests. |
| 2026-08-01 15:35:12 +07:00 | ChatGPT (GPT-5.5) | Asked whether the compatibility matrix should be created before testing. | Recommended creating the matrix, report template, folder structure, and screenshot placeholders before running the real tests. | The advice was used to organize the documentation first. | Verified that the matrix and report were completed before final submission. | This was workflow advice, not a test result. |
| 2026-08-01 15:27:34 +07:00 | ChatGPT (GPT-5.5) | Requested a prompt to generate the compatibility matrix and folder structure. | Produced a prompt for `compatibility-matrix.md`, testing folders, and report placeholders covering Windows, macOS, Android, Chrome, Firefox, Edge, Safari, Opera/Samsung Internet, Desktop, Tablet, and Phone. | The prompt was adapted to the specific HW03 folder structure. | Compared the resulting matrix with the evidence folder and report. | The output was generic and needed project-specific adjustment. |
| 2026-07-31 08:45:23 +07:00 | ChatGPT (GPT-5.5) | Asked which online tools should be used for compatibility testing. | Recommended BrowserStack Live first, then LambdaTest, Sauce Labs, and real devices if needed. | BrowserStack was selected as the practical evidence source. | The report references BrowserStack-oriented evidence handling. | Tool availability and trial behavior can change over time. |
| 2026-07-31 08:26:25 +07:00 | ChatGPT (GPT-5.5) | Asked how many compatibility combinations are required. | Explained that the assignment does not require every possible OS/browser/device combination, only enough coverage so each category is represented at least once per screen. | The matrix was reduced to representative coverage instead of exhaustive coverage. | Checked that each category was represented in the final matrix. | The recommendation was interpretive, not an official grading rule. |
| 2026-07-31 08:12:14 +07:00 | ChatGPT (GPT-5.5) | Asked what should be tested on each screen. | Suggested checking layout, fonts, buttons, tables, forms, pagination, search, navigation, scrolling, responsiveness, modal dialogs, hover states, and click behavior. | The final checklist focused on the EMS screens and behaviors already documented in the report. | Reviewed the checklist against the tested EMS screens. | The list was broad and required trimming to match the assignment scope. |
| 2026-07-31 07:57:49 +07:00 | ChatGPT (GPT-5.5) | Asked how screenshots should be prepared. | Recommended taking screenshots first, overlaying the university email, renaming files consistently, then inserting them into the report. | The workflow was followed where screenshots were used. | Checked screenshot naming and placement in the submission package. | The advice did not account for every possible reporting format. |
| 2026-07-31 07:38:43 +07:00 | ChatGPT (GPT-5.5) | Asked whether screenshots should be inserted after overlaying the email. | Confirmed the capture -> overlay -> rename -> insert workflow. | The sequence was accepted for the submission package. | Confirmed that the final evidence followed that order. | This was a confirmation step rather than new analysis. |
| 2026-07-30 10:58:09 +07:00 | ChatGPT (GPT-5.5) | Asked how to show operating system, browser, and device information when using real devices. | Explained that real-device screenshots may not show complete device details and suggested BrowserStack Live because it shows OS, browser, and device together. | The matrix labels were written to reflect the evidence available in the screenshots. | Checked that OS, browser, and device labels were recorded consistently. | Real-device screenshots can vary by account type and platform. |
| 2026-07-30 10:42:15 +07:00 | ChatGPT (GPT-5.5) | Asked how long BrowserStack Free/Trial lasts. | Said the trial availability can change and recommended completing testing within one session if possible. | Treated as planning guidance only. | No direct validation was possible from the repo alone. | Trial length is time-sensitive and may have changed since the interaction. |
| 2026-07-30 10:31:28 +07:00 | ChatGPT (GPT-5.5) | Asked why BrowserStack did not display device information. | Explained the difference between Desktop Live and Real Device sessions, and that Desktop sessions identify the device category as Desktop rather than a hardware model. | Desktop was recorded as the device type when using desktop sessions. | Checked consistency between the matrix and the screenshot labels. | The explanation depends on BrowserStack session type. |
| 2026-07-30 10:17:48 +07:00 | ChatGPT (GPT-5.5) | Uploaded a BrowserStack screenshot asking where the device information was located. | Confirmed that BrowserStack Desktop Live does not show a desktop hardware model and advised recording Device = Desktop in the compatibility matrix while using BrowserStack for OS and browser information. | That interpretation was used in the report and matrix. | Verified the matrix terminology against the screenshot evidence. | The result depends on how BrowserStack renders each session type. |
| 2026-07-30 09:57:41 +07:00 | ChatGPT (GPT-5.5) | Requested an AI Audit Report using the provided template. | Generated a sample AI Audit Report covering Task 3 interactions. | The sample was replaced with content aligned to the actual HW03 files and interaction records in this repo. | Compared the final audit against the task files and existing HW03 report. | The original sample was generic and needed substantial editing. |

## Summary
- Main AI-assisted tasks:
  - Planning the GUI checklist and compatibility testing workflow
  - Choosing representative browser and device coverage
  - Interpreting BrowserStack desktop vs. real-device evidence
  - Organizing screenshot and report preparation
- Main corrections made by the human reviewer:
  - Narrowed generic AI guidance to the actual EMS scenario
  - Replaced sample audit content with HW03-specific records
  - Confirmed which outputs were planning guidance versus validated evidence
  - Added explicit limitations where the repository did not contain raw transcript history

## Limitations
- The repository does not contain a complete raw prompt/response transcript for every AI exchange.
- Some dates, prompts, and outputs are reconstructed from the saved HW03 audit draft and related notes.
- AI did not execute any tests or independently validate the EMS application.
- BrowserStack behavior, trial availability, and UI details may vary over time.
