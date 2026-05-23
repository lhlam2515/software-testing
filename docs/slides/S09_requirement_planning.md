---
title: "S09 — Requirement Analysis & Test Planning"
source: "Slides/S09.1_Requirement Analysis.pdf + Slides/S09.2_Test Planning.pdf"
course: CSC13003 Software Testing
merged_from: [S09.1_requirement-analysis.md, S09.2_test-planning.md]
slides: 23
tags: [software-testing, slides, requirement-analysis, test-planning]
---

<!-- ============================================================ -->
<!-- PART 1: Requirement Analysis (S09.1 — 10 slides)             -->
<!-- ============================================================ -->

## Slide 1 — Title: Requirement Analysis

Software Testing — CSC13003

Topic: Requirement Analysis

## Slide 2 — Software Testing Life Cycle

Six-phase cycle (sequential, wrapping around):

```
[1 Requirement Analysis] --> [2 Test Planning] --> [3 Test Case Design]
                                                            |
[6 Test Cycle Closure]  <-- [5 Test Execution]  <-- [4 Environment Setup]
```

## Slide 3 — Requirement Analysis Overview

- Test team
  - studies the requirements
  - from a testing point of view
  - identify testable requirements
- Interact with stakeholder
  - to better understand
- Requirements
  - functional
  - non-functional

## Slide 4 — Requirement Analysis Activities

- Activities
  - Identify types of tests to be performed
  - Gather details about testing priorities and focus
  - Prepare Requirement Traceability Matrix
  - Identify test environment details
  - Automation feasibility analysis (if required)

## Slide 5 — Requirement Analysis Deliverables

- Deliverables
  - Requirement Traceability Matrix
  - Automation Feasibility Report

## Slide 6 — Requirements Traceability Matrix

- Map and trace user requirement with test cases
- Ensure that all requirements are tested (via test cases)
- Parameters
  - Requirement ID
  - Requirement description
  - Test case ID
  - Test case status

## Slide 7 — Requirements Traceability Matrix: Example

| Req. ID | Req. description | Test case ID | Status |
| --- | --- | --- | --- |
| BR01 | Login | TC01, TC02 | TC01 – Passed; TC02 – Passed |
| BR02 | Search product | TC03, TC04, TC05 | TC03 – Passed; TC04 – Passed; TC05 – Failed |
| BR03 | Place an order | TC06, TC07, TC08, TC09 | TC06 – Passed; TC07 – Passed; TC08 – Failed; TC09 – No run |
| … | … | … | … |

## Slide 8 — Traceability Test Matrix

- Types of Traceability Test Matrix
  - Forward traceability
    - Map requirements to test cases
    - Make sure each requirement is tested
  - Backward or reverse traceability
    - Maps test cases to requirements
    - Make sure the scope is not expanded
  - Bi-directional traceability

## Slide 9 — Automation Feasibility Report

- Automation feasibility analysis
  - Can the application be automated or not?
  - What type of tool / test automation framework can be used?
  - How much automation is possible?
  - In spite of high efforts, what's the value add in automating?
- Automation feasibility checklist

## Slide 10 — Q&A (Requirement Analysis)

Question and Answer session.

---

<!-- ============================================================ -->
<!-- PART 2: Test Planning (S09.2 — 13 slides)                    -->
<!-- ============================================================ -->

## Slide 11 — Title: Test Planning

Software Testing — CSC13003

Topic: Test Planning

## Slide 12 — Software Testing Life Cycle

Six-phase cycle (sequential, wrapping around):

```
[1 Requirement Analysis] --> [2 Test Planning] --> [3 Test Case Design]
                                                            |
[6 Test Cycle Closure]  <-- [5 Test Execution]  <-- [4 Environment Setup]
```

## Slide 13 — Step 1) Analyze the Product

- Who will use the website?
- What is it used for?
- How will it work?
- What are software/hardware the product uses?
  - User manual
  - Documents
  - Forum?

## Slide 14 — Step 2) Develop Test Strategy

- Step 2.1) Define Scope of Testing
- Step 2.2) Identify Testing Type
- Step 2.3) Document Risk & Issues
- Step 2.4) Create Test Logistics

## Slide 15 — Step 3) Define Test Objective

- List all the software features (functionality, performance, GUI…) which may need to test
- Define the target or the goal of the test based on above features

## Slide 16 — Step 4) Define Test Criteria

- Suspension Criteria
- Exit Criteria

## Slide 17 — Step 5) Resource Planning

- Human Resources
- Roles
  - System Resources

## Slide 18 — Step 6) Plan Test Environment

- How to setup

## Slide 19 — Step 7) Schedule & Estimation

- Task estimation
- Project schedule
  - Gantt chart

## Slide 20 — Step 8) Test Deliverables (Before Testing)

- Test deliverables are provided before testing phase
  - Test plans document
  - Test cases documents
  - Test Design specifications

## Slide 21 — Step 8) Test Deliverables (During Testing)

- Test deliverables are provided during the testing
  - Test Scripts
  - Simulators
  - Test Data
  - Test Traceability Matrix
  - Error logs and execution logs

## Slide 22 — Step 8) Test Deliverables (After Testing)

- Test deliverables are provided after the testing cycles is over
  - Test Results/reports
  - Defect Report
  - Installation/Test procedures guidelines
  - Release notes

## Slide 23 — Q&A (Test Planning)

Question and Answer session.
