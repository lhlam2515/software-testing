---
title: "S02 — Software Testing Life Cycle"
source: "Slides/S02_Software Testing Life Cycle.pdf"
course: CSC13003 Software Testing
slides: 51
tags: [software-testing, slides, stlc]
---

## Slide 1 — Title Slide

**Software Testing**
CSC13003

**Software Testing Life Cycle**

---

## Slide 2 — Content

- Software testing life cycle
- 7 principles of software testing
- Levels of software testing
- Types of software testing

---

## Slide 3 — Content (Section Highlight: STLC)

- Software testing life cycle *(active section)*
- 7 principles of software testing
- Levels of software testing
- Types of software testing

---

## Slide 4 — What is STLC?

> The software testing life cycle is the **process** of executing different **activities** during testing

---

## Slide 5 — Phases of STLC

The STLC consists of six sequential phases:

```
1. Requirement Analysis  -->  2. Test Planning  -->  3. Test Case Design
                                                              |
6. Test Cycle Closure    <--  5. Test Execution  <--  4. Environment Setup
```

| Phase | Name |
|-------|------|
| 1 | Requirement Analysis |
| 2 | Test Planning |
| 3 | Test Case Design |
| 4 | Environment Setup |
| 5 | Test Execution |
| 6 | Test Cycle Closure |

---

## Slide 6 — 1. Requirement Analysis (Activities)

- Analyze requirements to understand scope of testing
- May consult with stakeholders to clarify requirements
- Identify any potential challenges or risks
- Create Requirements Traceability Matrix
- Evaluate the ability to automate testing

---

## Slide 7 — 1. Requirement Analysis (Entry Criteria and Deliverables)

- Entry criteria
  - Requirement Specification
  - Application Architecture
- Deliverables
  - Requirements Traceability Matrix
  - Automation Feasibility Report

---

## Slide 8 — 2. Test Planning (Activities)

- Define test objectives and scope
- Develop a test strategy including test methods
- Identify the test environment and resources
- Estimate the time and cost required for testing
- Identify the test deliverables and milestones
- Assign test team roles and responsibilities

---

## Slide 9 — 2. Test Planning (Entry Criteria and Deliverables)

- Entry criteria
  - Project Plan
  - Acceptance Criteria
  - Requirement Specification
- Deliverables
  - Test Plan

---

## Slide 10 — 3. Test Case Design (Activities)

- Design test cases and generate test data
- Create automation scripts, if applicable
- Update the Requirements Traceability Matrix
- Test cases
  - Inputs
  - Test steps
  - Expected result

---

## Slide 11 — 3. Test Case Design (Entry Criteria and Deliverables)

- Entry criteria
  - Test Plan
  - Requirement Specification
- Deliverables
  - Test Cases
  - Test Data
  - Automation Scripts

---

## Slide 12 — 4. Environment Setup (Activities)

- Prepare hardware and software list
- Configure and deploy test environments
- Perform smoke tests to verify readiness

---

## Slide 13 — 4. Environment Setup (Entry Criteria and Deliverables)

- Entry criteria
  - Test Plan
  - Test Cases
  - System Architecture
- Deliverables
  - Fully functional test environment
  - Smoke Test Results

---

## Slide 14 — 5. Test Execution (Activities)

- Run test cases in the deployed environment
- Collect and analyze test results
- Compare actual results with expected results
- Report defects found during test execution

---

## Slide 15 — 5. Test Execution (Entry Criteria and Deliverables)

- Entry criteria
  - Test Cases
  - Test Data
  - Automation Script
- Deliverables
  - Test Results
  - Defect Reports

---

## Slide 16 — 6. Test Cycle Closure (Activities)

- Ensure that all testing activities have been completed
- Document the testing process and any lessons learned
- Prepare Test Summary Report
- Prepare Test Closure Report

---

## Slide 17 — 6. Test Cycle Closure (Entry Criteria and Deliverables)

- Entry criteria
  - Test Cases
  - Test Results
  - Defect Reports
- Deliverables
  - Test Summary Report
  - Test Closure Report

---

## Slide 18 — Content (Section Highlight: 7 Principles)

- Software testing life cycle
- **7 principles of software testing** *(active section)*
- Levels of software testing
- Types of software testing

---

## Slide 19 — 7 Principles of Software Testing (1–3)

- #1: Testing shows the presence of defects
  - Don't talk about the absence of defects
  - Reduces the probability of undiscovered defects
- #2: Exhaustive testing is not possible
  - Need the optimal amount of testing
  - Based on the risk assessment
- #3: Early testing
  - Testing should start as early as possible
  - Much cheaper to fix a defect in the early stages of testing

---

## Slide 20 — 7 Principles of Software Testing (4–5)

- #4: Defect clustering
  - A small number of modules contain most of the defects detected
  - Pareto Principle: 80% of the defects are found in 20% of the modules
- #5: Pesticide paradox
  - If the same set of repetitive tests are conducted, the method will be useless for discovering new defects
  - The test cases need to be regularly reviewed & revised, adding new & different test cases

---

## Slide 21 — 7 Principles of Software Testing (6–7)

- #6: Testing is context dependent
  - The way you test an e-commerce site will be different from the way you test a commercial off the shelf application
  - Use a different approach, methodologies, techniques, and types of testing depending upon the application type
- #7: Absence of error – fallacy
  - It is possible that software which is 99% bug-free is still unusable
  - Software testing is not mere finding defects, but also to check that software addresses the business needs

---

## Slide 22 — Content (Section Highlight: Levels)

- Software testing life cycle
- 7 principles of software testing
- **Levels of software testing** *(active section)*
- Types of software testing

---

## Slide 23 — Four Levels of Testing

The four levels of testing progress from smallest to largest scope:

```
Unit Test              Integration Test        System Test          Acceptance Test
(Test individual  -->  (Test components   -->  (Test the entire --> (Test the final
 component)             work together)          system)              system)
```

| Level | Scope |
|-------|-------|
| Unit Test | Test individual component |
| Integration Test | Test components work together |
| System Test | Test the entire system |
| Acceptance Test | Test the final system |

---

## Slide 24 — Unit Testing (Overview)

- Component/Module/Program testing
- Each unit is independently tested
- Performed by developers
- Bugs are fixed immediately, no need to report

---

## Slide 25 — Unit Testing (Stubs and Drivers)

- Stubs and Driver are simulator units
- Return value
  - Static value
  - Input value

Three scenarios illustrated:

- **A → B**: A calls real unit B (normal call)
- **A → Stubs**: A calls a stub replacing B (testing A independently)
- **Driver → B**: A driver replaces A to test unit B independently

---

## Slide 26 — Unit Testing (Stubs Example)

- Unit A calls Units B and C
- Test Unit A independently
  - Replace Units B and C with simulator units (Stubs)

Diagram: Unit A (blue) calls down to Units B and C (green stubs, inside dashed box labelled "Stubs")

---

## Slide 27 — Unit Testing (Testing Tools)

- Testing tools
  - Write source code directly
  - Unit testing framework
  - Mocking framework
  - Dependency injection and IoC container

---

## Slide 28 — Integration Testing (Overview)

- Test two or more units/sub-systems
- Test the interface/interaction between units
- Performed by developer and tester
- Integration approaches
  - Big-bang integration
  - Incremental integration

---

## Slide 29 — Integration Testing (Big-Bang Integration)

- Big-bang integration
  - Integrate all units at once
  - Test them all as one unit
  - Advantages
    - Its suitability for testing small systems
    - Saving time and speeding up application deployment
  - Disadvantages
    - Locating the source of defects can be difficult
    - Could miss some interface links or bugs
    - Must wait until all units are available
    - High-risk critical units are not prioritized for testing

Diagram: Tree with root A, children B and C — all integrated at once.

---

## Slide 30 — Integration Testing (Incremental Integration)

- Incremental integration
  - Start with one unit, add each unit incrementally, and test along a baseline
  - Advantage
    - Bugs are easy to find and fix
    - Can start early
  - Disadvantage
    - Difficult to simulate complex units
  - Approaches
    - Top-down
    - Bottom-up
    - Sandwich

---

## Slide 31 — Integration Testing (Top-Down Integration)

- Top-down Integration
  - Test high-level units first, then gradually integrate lower-level units

Two traversal strategies shown:

**Depth-first integration**: A → B → D, then back up and integrate E, then C (stubs shown in green)

**Breadth-first integration**: A → B and C (level 2), then D and E (level 3) (stubs in green)

---

## Slide 32 — Integration Testing (Top-Down Advantages/Disadvantages)

- Top-down Integration
  - Advantages
    - Easier to identify defects and isolate their sources
    - Check important units first, more likely to find critical design flaws
    - Possible to create an early prototype
  - Disadvantages
    - The examination of lower-level modules can take a lot of time
    - When too many testing stubs are involved, the testing process can become complicated

---

## Slide 33 — Integration Testing (Bottom-Up Integration)

- Bottom-up Integration
  - The lowest level units are integrated into groups that represent a function of the software

Diagram: Tree A → B, C; B → D, E. Integration starts from D and E (blue), progresses up; A and C (green) are stubs/drivers at the top level.

---

## Slide 34 — Integration Testing (Bottom-Up Advantages/Disadvantages)

- Bottom-up Integration
  - Advantages
    - Easier to find and localize faults
    - Don't have to wait for all units to be available for testing
  - Disadvantages
    - Testing all units can take a lot of time
    - Critical units are tested only in the final stages
    - Testing can be complicated if consisting of multiple low-level units
    - Not possible to create an early prototype

---

## Slide 35 — Integration Testing (Sandwich Testing)

- Sandwich testing
  - Combine Top-down and Bottom-up

Diagram: Upper portion (A, B, C) uses top-down integration (C is a stub); lower portion (D and its children D, E) uses bottom-up integration by functionality. The two layers meet in the middle.

---

## Slide 36 — System Testing

- The final step of integration testing
- Test the complete and fully integrated system
- Perform by tester and business analyst
- Include both functional and non-functional testing

---

## Slide 37 — Acceptance Testing (Overview)

- Final step of validation
- Ensure that the system meets user expectations
- Performed by end-user

---

## Slide 38 — Acceptance Testing (Alpha and Beta)

- Alpha testing and Beta testing
  - Similarity
    - When the software is stable
    - Get feedback on bugs, expectations, suggestions
  - Difference
    - Alpha testing is done in a development environment
    - Beta testing is done in a real-world environment

---

## Slide 39 — Content (Section Highlight: Types)

- Software testing life cycle
- 7 principles of software testing
- **Levels of software testing** *(active section)*
- Types of software testing

---

## Slide 40 — Types of Software Testing (Overview)

- Functional testing
- Non-functional testing
- Structural testing
- Change-related testing

---

## Slide 41 — Functional Testing (Overview)

- Functional testing = Black-box testing
- Based on functional requirements
- Detect functional defects
- Don't care how to implement

---

## Slide 42 — Functional Testing (Black-Box Design Techniques)

- Black-box design techniques
  - Equivalence Partitioning
  - Boundary Value Analysis
  - State Transition Diagrams
  - Decision Tables
  - Cause-Effect Graph
  - Use Case Testing

---

## Slide 43 — Non-Functional Testing (Overview)

- Performance testing
- Usability testing
- Security testing
- Configuration/Installation testing
- Back-up/Recovery testing

---

## Slide 44 — Non-Functional Testing (Performance Testing)

- Performance testing
  - Speed – Whether the application responds quickly
  - Scalability – The maximum user load the software application can handle
  - Stability – If the application is stable under varying loads

---

## Slide 45 — Non-Functional Testing (Usability Testing)

- Usability testing
  - Effectiveness
    - Is the system easy to learn?
  - Efficiency
    - Little navigation should be required to reach the desired screen
    - Uniformity in the format of screen
  - Accuracy
    - No outdated or incorrect data should be present
    - No broken links should be present
  - User Friendliness
    - Controls used should be self-explanatory
    - Help should be provided for the users

---

## Slide 46 — Non-Functional Testing (Security Testing)

- Security testing
  - Confidentiality – limiting access to sensitive access managed by a system
  - Integrity – ensuring that data is consistent, accurate, and trustworthy throughout its lifecycle and cannot be modified by unauthorized entities
  - Authentication – ensuring sensitive systems or data are protected by a mechanism that verifies the identity of the individual accessing them
  - Authorization – ensuring sensitive systems or data properly control access for authenticated users according to their roles or permissions
  - Availability – ensuring that critical systems or data are available for their users when they are needed
  - Non-repudiation – ensures that data sent or received cannot be denied, by exchanging authentication information with a provable time stamp

---

## Slide 47 — Non-Functional Testing (Configuration/Installation Testing)

- Configuration/Installation testing
  - Configuration testing
    - Different hardware, environments
    - Software configuration
    - Version upgrade conflict
  - Installation testing
    - Install packages
    - Uninstall

---

## Slide 48 — Non-Functional Testing (Back-up/Recovery Testing)

- Back-up/Recovery testing
  - Verifies software's ability to recover from failures like software/hardware crashes, network failures

---

## Slide 49 — Structural Testing

- Structural testing = White-box testing
- Design test cases based on source code
- Code coverage
  - Statement coverage
  - Decision coverage
  - Condition coverage
  - Path coverage
  - Loop coverage

---

## Slide 50 — Change-Related Testing

- Test after bugs are fixed
- Re-testing/Confirmation testing
  - Execute the exact test cases that found the bugs
  - Confirm the bugs have been fixed
  - No guarantee that new bugs have not occurred
- Regression testing
  - Execute all previously passed test cases
  - Find new bugs that occur

---

## Slide 51 — Q&A

Question and Answer slide. Two speech bubbles displaying "Q" (blue) and "A" (dark grey) on a decorative background.
