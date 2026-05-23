---
title: "S08 — Test Report"
source: "Slides/S08_Test Report.pdf"
course: CSC13003 Software Testing
slides: 22
tags: [software-testing, slides, test-report]
---

## Slide 1 — Title

Software Testing — CSC13003

**Test Report**

---

## Slide 2 — Content

- Bug/Defect Life Cycle
- Bug/Defect Report
- Test Summary Report

---

## Slide 3 — Bug Life Cycle

A flowchart illustrating the complete bug life cycle with numbered steps:

1. **Tester Finds a Defect** → Status = NEW
2. **Development Project Manager will analyze the Defect**
3. Decision: **Is it a Valid Defect?**
   - NO → Status = REJECTED (step 5)
   - YES → Decision: **Is it in Scope?**
     - NO → Status = DEFFERED (step 6)
     - YES → Decision: **Is it already raised?**
       - YES → Status = DUPLICATE (step 7)
       - NO → **Developer Starts fixing the code** → Status = IN-PROGRESS (step 8)
4. **Code Fixed** → Status = FIXED (step 9)
5. **Tester retests the code** → Decision: **Test PASS?**
   - YES → Status = CLOSED (step 10)
   - NO → Status = RE-OPEN (step 11)

Source: <https://www.guru99.com/defect-life-cycle.html>

---

## Slide 4 — Bug Report (Definition)

- A detailed document about how the bug was found
- *"The point of writing a problem report (bug report) is to get bugs fixed"*
  - By Cem Kaner.

---

## Slide 5 — Bug Report Essentials

1. Bug ID
2. Function name
3. Problem summary
4. How to reproduce it
5. Reported by
6. Date
7. Assign to
8. Status
9. Priority
10. Severity

---

## Slide 6 — 1. Bug ID

- Unique identification number for the bug
- Bug ID is different from Test case ID

---

## Slide 7 — 2. Function Name

- The function in which the bug was found
- Example:
  - Login
  - Logout
  - Account list
  - Add account
  - Delete account

---

## Slide 8 — 3. Problem Summary

- Summary about the problem
  - **Test Objective + Actual result (vs. Expected result)**
- Example:
  - There is no error message when account exists
  - The room price is wrong when check-in date is equal to check-out date

---

## Slide 9 — 4. How to Reproduce It

- Detailed steps along with screenshots with which the developer can reproduce the defects
  - **Test steps + Expected result + Actual result**
- Example:

  **Description**

  Environment: iPhone 6s / Chrome Web Browser version 52.0

  Steps to Reproduce:
  1. Open Chrome
  2. Navigate to "<https://www.google.com>"
  3. In the top right, click Gmail
  4. In the top right, click Sign In

  Expected Behavior: User is directed to the Sign In screen

  Actual Behavior: User receives a 521 error (screenshot attached)

---

## Slide 10 — 5–8. Reported By, Date, Assign To, Status

**5. Reported by**

- Name/ID of the tester who report the defect

**6. Date**

- Date when the defect is reported

**7. Assign to**

- Name/ID of the developer who will fix the defect

**8. Status**

- New / Closed / Reopened
- Rejected / Deffered / Duplicate / In-progress / Fixed

---

## Slide 11 — 9. Priority

- Priority is related to defect fixing urgency

| Defect Priority | Description |
|---|---|
| Immediate (Critical) | The defect need to be fixed **immediately** or in **01 day** because it may cause great damage to the product |
| High | The defect should be fixed within **02-04 days** because it impacts the product's **main features** |
| Medium | The defect should be fixed within **05-08 days** because it causes **minimal** deviation from the product requirement |
| Low | The defect will be fixed later because it has very **minor** affect the product operation |

---

## Slide 12 — 10. Severity

- Describe the impact of the defect on the application

| Defect Severity | Description |
|---|---|
| Fatal | The defect cause **great damage** to the product. Ex: system crash, lost data |
| Serious | The defect impacts the product's **main features**. Ex: User can delete comment without login |
| Medium | The defect causes **minimal** deviation from the product requirement. Ex: The GUI of the website does not display correctly on mobile devices |
| Cosmetic | The defect has very **minor** affect the product operation. Ex: Incorrect tab order, no default focus, missing short key… |

---

## Slide 13 — Bug Report Characteristics

- Written
- Numbered
- Simple
- Understandable
- Reproducible
- Legible
- Non-judgmental

---

## Slide 14 — How to Reproduce the Defect

- Record all test steps
  - Keyboards and mouse activities
  - Screen capture

---

## Slide 15 — Bad Bug Report

- Isn't filed at all
- Is filed via email
- Contains no specific information
  - **"It does not work!"** → "Error 404: Access denied"
- Just reports the symptom
  - **"I just clicked and it crashes"** → "Error 404: Page not found when clicking the Export button"

---

## Slide 16 — Bad Bug Report (cont.)

- Unknown or unclear environment/platform
  - **"Windows"** → "Windows 7, Google Chrome 20.0.1132.47m"
- Uses adjectives instead of numbers
  - **"System is really slow"** → "System does not response after 3s but 5m"
- Uses judgment
  - **"Error message is stupid"** → "Error message is unclear"

---

## Slide 17 — Test Summary Report (Definition)

- Summarize test activities and results
  - Summary
  - Test Case result report
  - Defect Report
  - Open point

---

## Slide 18 — Test Summary Report: Statistics by Function

- Statistics bug/defect by functions

A sample TEST REPORT form shows header fields for Project name, Reviewer, Creator, and Approver, plus a Note field. Below the header, metrics show Test Coverage: 46% and Successful Test Coverage: 33%, with a Date field.

| No | Items | Tested | Passed | Failed | Blocked | Skipped | Not Yet Tested | Total | Tested Coverage |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Function 1 | 23 | 15 | 5 | 3 | 7 | 18 | 48 | 48% |
| 2 | Function 2 | 26 | 20 | 4 | 2 | 10 | 22 | 58 | 45% |
| 3 | | | | | | | | | |
| 4 | | | | | | | | | |
| 5 | | | | | | | | | |
| **Total** | | **49** | **35** | **9** | **5** | **17** | **40** | **106** | |

---

## Slide 19 — Test Summary Report: Statistics by Defect Type

- Statistics by Defect Type

| Defect Type | Fatal | Serious | Medium | Cosmetic | Total (W.def) | % |
|---|---|---|---|---|---|---|
| Business logic | 1 | 9 | 332 | 31 | 1082 | 58.7 |
| Coding logic | 1 | 2 | 112 | | | |
| Coding standard | | | 4 | | | |
| Data - Database integrity | | | 3 | | | |
| Design issue | | | 1 | | | |
| Feature missing | | | | | | |
| Functionality (Other) | | | 18 | | | |
| Other | | | 5 | 2 | 17 | 0.9 |
| Performance | | 2 | 3 | 1 | 20 | 1.1 |
| Req misunderstanding | | | 2 | | 6 | 0.3 |
| Security - Access Control | | | 1 | | 3 | 0.2 |
| User Interface | | | 30 | 152 | 242 | 13.1 |
| **Total** | **2** | **13** | **517** | **206** | **1842** | **100** |

An annotation callout on the table notes prevention methods for the high-volume defect types: Requirement workshop, Review code, Prototype designer, Coding convention.

---

## Slide 20 — Test Summary Report: Defect Type Chart

- Statistics by Defect Type

A Pareto chart titled "Defect Type Report" with two axes: Defect Weight (left, 0–1100) and Percentage (right, 0–105). Pink bars show defect weight per category; a blue line shows cumulative percentage. Business logic dominates with 1,082 W.def, followed by Coding logic (368), User Interface (242), Functionality/Other (68), Feature missing (22), Performance (20), Other (17), Coding standard (12), Data-Database integrity (9), Req misunderstanding (6), Security-Access Control (3), Design issue (3).

---

## Slide 21 — Test Summary Report: Statistics by Defect Severity

- Statistics by Defect Severity

A pie chart titled "Ratio of Defect Severity" shows the distribution of defects across four severity levels:

- Cosmetic: 83.3%
- Medium: 8.3%
- Serious: 6.7%
- Fatal: 1.7%

---

## Slide 22 — Q&A

End of lecture — Q&A slide featuring overlapping speech bubbles with "Q" and "A" icons.
