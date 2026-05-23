---
title: "S07 — Test Case"
source: "Slides/S07_Test Case.pdf"
course: CSC13003 Software Testing
slides: 10
tags: [software-testing, slides, test-case]
---

## Slide 1 — Title

Software Testing — CSC13003

**Test Case**

---

## Slide 2 — Test Case (Definition)

- A test that (ideally) executes a single well defined test objective (Testing Computer Software — Kaner, Faulk, Nguyen)
- A specific set of test data and associated procedures developed for a particular objectives (IEEE 729-1983)

---

## Slide 3 — Why Write Test Cases?

- Accountability
- Reproducibility
- Tracking
- Automation
- To find bugs
- To verify that tests are being executed correctly
- To measure test coverage

---

## Slide 4 — Test Case Essentials (Overview)

- Tracking information
- Test case ID
- Test case description
  - Objective/Title
  - Steps
  - Test data: input/output/default
  - Expected results
  - Observed results
  - Status: Pass/Fail/Blocked/Skipped
- Test environment
- Script
- Bug ID
- Comments
- …

---

## Slide 5 — Test Case Essentials: Objective/Title

- **Test case Objective/Title**
  - The most important essential
  - Gives reader a description and idea of the test
  - A good test name makes review easier
  - Easier to pass to another person, automation team
  - In many cases, may be the only part of the test case documented

---

## Slide 6 — Test Case Essentials: Title Syntax

- **Test case Objective/Title Syntax**

  **Action + Function + Operating Condition**

  - Action: Verify, Test, Validate, Execute, Run, Print…
  - Function: function, feature, validation point
  - Operating Condition: data, specific condition

| Action | Function | Operating Condition |
|---|---|---|
| Run | annual report | from standard data (file location) |
| Run | annual report | on Day 1 of fiscal year |
| Run | annual report | from empty spreadsheet |
| Run | annual report | on last day of fiscal year |

---

## Slide 7 — Test Case Essentials: Validation Point

- **Validation Point**
  - This is the expected result
  - Write it as a step
  - Define clearly state: what behavior, result or point that you are attempting to validate

---

## Slide 8 — Test Case Template

| TC ID | Description | Steps | Expected Result | Observed result | Status |
|---|---|---|---|---|---|
| TC001 | /\*Test objective\*/ | /\*Very clear and specific steps\*/ Pre-condition: Steps: 1. Action 1 2. Action 2 ………………… | /\*you need to pre determine what your program is supposed to do\*/ | /\* write down the result that you get when execute the test case\*/ | Passed/ Failed |

---

## Slide 9 — What is a Good Test Case?

- Accurate — tests what it is designed to test
- Economical — no unnecessary steps
- Repeatable, reusable — keep going on
- Traceable — to a requirement
- Appropriate — for test environment
- Self standing — independent of the writer
- Self cleaning — picks up after itself

---

## Slide 10 — Q&A

End of lecture — Q&A slide featuring overlapping speech bubbles with "Q" and "A" icons.
