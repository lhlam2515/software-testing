---
title: "S01 — Software Testing Introduction & Software Testing Life Cycle"
source: "Slides/S01_Software Testing Introduction & Software Testing Life Cycle.pdf"
course: CSC13003 Software Testing
slides: 82
tags: [software-testing, slides, introduction, stlc]
---

## Slide 1 — Title Slide

**Software Testing**
CSC13003

Software Testing Introduction

## Slide 2 — Content (Overview)

- What is Software Testing?
- Why must we test?
- What does a Software Tester do?
- Potentials of Software Testing Career?
- Tester is a "low-level" job?
- How is a good tester?

## Slide 3 — Section Divider: What is Software Testing?

- **What is Software Testing?**
- Why must we test?
- What does a Software Tester do?
- Potentials of Software Testing Career?
- Tester is a "low-level" job?
- How is a good tester?

## Slide 4 — Software Testing (Definition)

> Testing is the process consisting of all lifecycle activities, both static and dynamic, concerned with planning, preparation and evaluation of software products and related work products to determine that they satisfy specified requirements, to demonstrate that they are fit for purpose and to detect defects.

Source: Glossary of Software Testing Terms

## Slide 5 — Static Testing vs. Dynamic Testing

- Static Testing
  - Examine the code
  - NOT Execute it
  - Code analysis, Code inspection, Code review…
- Dynamic Testing
  - Execute the code
  - Without, necessarily, examine it

## Slide 6 — Validation Testing vs. Verification Testing (Validation)

A triangle diagram with three vertices: Software (top), User Requirements (bottom-left), and Requirements Specification (bottom-right). An arrow from User Requirements points up to Software, labeled "Validation — Are we building the correct system?"

## Slide 7 — Validation Testing vs. Verification Testing (Verification)

The same triangle diagram. An arrow from Software points down to Requirements Specification, labeled "Verification — Are we building the system correctly?"

## Slide 8 — Test Oracle

A diagram showing two side-by-side boxes labeled "Expected" and "Actual" connected by circular arrows indicating comparison.

- **Test Oracle**: a source of information about whether the output of a program (or function or method) is correct or not

## Slide 9 — Error – Fault – Failure

A flow diagram: a person makes an **error** → that creates a **fault** in the software (also called Fault / Defect / Bug) → that can cause a **failure** in operation.

## Slide 10 — Testing vs. Debug

- Testing: finding input that cause the program to fail
- Debug: the process of finding a fault given by a failure

A process flow diagram: Software Configuration and Test Configuration feed into a Testing node → Test Results go to Evaluation → Evaluation branches to Debug (producing Corrections) and to Reliability Model (producing Predicted Reliability via Error Rate Data). Expected Results also feed into Evaluation.

## Slide 11 — Test Bed

- The test execution environment configured for testing
  - Hardware
  - Software
  - Operating system
  - Network configuration
  - The product/application under test (AUT)
  - Other system/application
  - …

## Slide 12 — Section Divider: Why must we test?

- What is Software Testing?
- **Why must we test?**
- What does a Software Tester do?
- Potentials of Software Testing Career?
- Tester is a "low-level" job?
- How is a good tester?

## Slide 13 — Why We Test (Tree Swing Comic)

A classic comic strip showing 10 panels of a tree swing, each labeled with a different stakeholder's perspective: how the customer explained it, how the Project Leader understood it, how the Analyst designed it, how the Programmer wrote it, how the Business Consultant described it, how the project was documented, what operations installed, how the customer was billed, how it was supported, and what the customer really needed. Each panel shows a different (often dysfunctional) version of the swing, illustrating miscommunication in software projects.

## Slide 14 — Why must we test?

> "A clever person solves a problem. A wise person avoids it" — Albert Einstein

**Software bugs could be expensive and even dangerous**

Examples: Korean Air Flight 801 crashed in 1997 (254 people dead & injured); Ariane 5 rocket exploded in 1996 ($500 million lost).

## Slide 15 — Cost of fixing defects

A line chart showing the cost to repair a defect rising steeply across phases. 85% of defects are introduced during coding. Cost per defect: $25 at Coding, $100 at Unit Test, $250 at Function Test, $1,000 at System Test, $16,000 After Release. The percentage of defects found peaks at Function Test / System Test phases.

## Slide 16 — Objective of Testing

- Detect Faults
- Establish confidence in the software
- Evaluate properties of the software
  - Reliability
  - Performance
  - Memory usage
  - Security
  - Usability
  - …

## Slide 17 — Objectives of Testing (What it Should NOT Be)

- Should NOT be to verify that the program works correctly
  - If you can't test the program completely, you can't verify that it works correctly
  - "Testing can show the presence of bugs, but not the absence" - Dijkstra

> If you set your mind to show that a program works correctly, you'll be more likely to miss problems than if you want and expect the program to fail.

## Slide 18 — Objectives of Testing (Finding Problems)

**The Objective of Testing a Program is to Find Problems**

Finding problems is the core of your work. You should want to find as many problems as possible. The more serious testers find, the better tester is.

A test that reveals a problem is a success. A test that did not reveal a problem is (often) a waste of time.

## Slide 19 — Objectives of Testing (Getting Bugs Fixed)

**The Purpose of Finding Problems is to Get Them Fixed**

The point of the exercise is quality improvement!

- The best tester is not the one who finds the most bugs or who embarrasses the most programmers.
- The best tester is the one who gets the most bugs fixed.

## Slide 20 — Section Divider: What does a Software Tester do?

- What is Software Testing?
- Why must we test?
- **What does a Software Tester do?**
- Potentials of Software Testing Career?
- Tester is a "low-level" job?
- How is a good tester?

## Slide 21 — Comparison between QA, QC and Testing

A nested diagram showing Quality Assurance as the outermost layer, Quality Control as a subset of QA, and Testing as a subset of QC.

| | Quality Assurance | Quality Control | Testing |
|---|---|---|---|
| Scope | Subset of SDLC | Subset of QA | Subset of QC |
| Orientation | Process oriented | Product oriented | Product oriented |
| Focus | Ensure that processes and procedures are in place to achieve quality; focus on process to achieve required quality | Activities to ensure the product quality; focus on product to check for the required quality | Validate the product against specifications; focus on actual testing of the product |

## Slide 22 — QC vs. QA

An illustration of a manufacturing assembly line where workers inspect boxes moving along a conveyor belt, representing the concept of Quality Control checking products versus Quality Assurance overseeing the production process.

## Slide 23 — Section Divider: Potentials & Tester is a "low-level" job?

- What is Software Testing?
- Why must we test?
- What does a Software Tester do?
- **Potentials of Software Testing Career?**
- **Tester is a "low-level" job?**
- How is a good tester?

## Slide 24 — Software Testing Career Ladder

A staircase diagram showing the progression of a software testing career with certifications:

- Manual Tester (0-2 yrs) — ISTQB Certifications / Software Testing Certification Course
- Automation Tester (2-5 yrs) — CP-SAT
- Test Analyst / Test Lead (4-6 yrs) — Certified Agile Tester
- Test Manager (6-10 yrs)
- Director/Head of Unit

## Slide 25 — Software Testing Career Path

A career development model diagram (ellipse/arrow shape) showing progression across roles:

- **Tester**: An entry level position that focuses heavily on test execution
- **Test Analyst**: Focuses on full lifecycle testing — planning, designing and executing tests
- **Senior Test Analyst**: Displays subject matter and/or technical expertise playing a major role within the test team
- **Team Lead**: Leads a test team to ensure strategies are implemented and undertaken appropriately at client sites
- **Test Consultant**: Manages test teams, authors and implements test strategies, monitors and reports on progress
- **Senior Test Consultant**: Manages multiple teams and projects, preparing realistic and achievable project plans and strategies
- **Principal Consultant**: Leads complex projects, defining and implementing test strategies, playing a pivotal role in client and staff support and development

## Slide 26 — Section Divider: How is a good tester?

- What is Software Testing?
- Why must we test?
- What does a Software Tester do?
- Potentials of Software Testing Career?
- Tester is a "low-level" job?
- **How is a good tester?**

## Slide 27 — Good Tester Skill Pyramid

A three-layer pyramid diagram showing the competencies of a good tester (from base to top):

1. Testing Skills & Aptitude (base — largest)
2. Technical Skills (middle)
3. Domain Knowledge (top — smallest)

## Slide 28 — Domain Knowledge (BFSI Example)

A hexagonal cluster diagram showing the BFSI (Banking, Financial Services, Insurance) domain at the center, surrounded by sub-domains: Retail Banking, Investment Banking, Forex Management & Trading, Infrastructure Management Services, Cards, Core Banking, Risk & Compliance, Corporate Banking, and Wealth Management.

## Slide 29 — Good Software Tester

A light-bulb diagram with rays labeled with the qualities of a Good Software Tester:

- Attitude
- Analytical skills
- Productivity
- Verbal & Written Communications
- Technical skills
- Passion

## Slide 30 — Tester vs. Developer

A cartoon showing two computer users at opposite desks. The Developer thinks "HOW CAN I MAKE IT?" and the Tester thinks "HOW CAN I BREAK IT?"

Caption: They are not so much different, but they have different path for the same goal, to improve quality!!

## Slide 31 — Q&A Slide (Part 1)

A Q&A divider slide showing speech-bubble icons with "Q" and "A" on a decorative background.

## Slide 32 — Title Slide: Software Testing Life Cycle

**Software Testing**
CSC13003

Software Testing Life Cycle

## Slide 33 — Content (STLC Overview)

- Software testing life cycle
- 7 principles of software testing
- Levels of software testing
- Types of software testing

## Slide 34 — Section Divider: Software Testing Life Cycle

- **Software testing life cycle**
- 7 principles of software testing
- Levels of software testing
- Types of software testing

## Slide 35 — What is STLC?

> The software testing life cycle is the process of executing different activities during testing

## Slide 36 — Phases of STLC

A flowchart showing six sequential phases in a loop pattern:

1. Requirement Analysis → 2. Test Planning → 3. Test Case Design → 4. Environment Setup → 5. Test Execution → 6. Test Cycle Closure → (back to start)

## Slide 37 — 1. Requirement Analysis (Activities)

- Analyze requirements to understand scope of testing
- May consult with stakeholders to clarify requirements
- Identify any potential challenges or risks
- Create Requirements Traceability Matrix
- Evaluate the ability to automate testing

## Slide 38 — 1. Requirement Analysis (Entry/Deliverables)

- Entry criteria
  - Requirement Specification
  - Application Architecture
- Deliverables
  - Requirements Traceability Matrix
  - Automation Feasibility Report

## Slide 39 — 2. Test Planning (Activities)

- Define test objectives and scope
- Develop a test strategy including test methods
- Identify the test environment and resources
- Estimate the time and cost required for testing
- Identify the test deliverables and milestones
- Assign test team roles and responsibilities

## Slide 40 — 2. Test Planning (Entry/Deliverables)

- Entry criteria
  - Project Plan
  - Acceptance Criteria
  - Requirement Specification
- Deliverables
  - Test Plan

## Slide 41 — 3. Test Case Design (Activities)

- Design test cases and generate test data
- Create automation scripts, if applicable
- Update the Requirements Traceability Matrix
- Test cases
  - Inputs
  - Test steps
  - Expected result

## Slide 42 — 3. Test Case Design (Entry/Deliverables)

- Entry criteria
  - Test Plan
  - Requirement Specification
- Deliverables
  - Test Cases
  - Test Data
  - Automation Scripts

## Slide 43 — 4. Environment Setup (Activities)

- Prepare hardware and software list
- Configure and deploy test environments
- Perform smoke tests to verify readiness

## Slide 44 — 4. Environment Setup (Entry/Deliverables)

- Entry criteria
  - Test Plan
  - Test Cases
  - System Architecture
- Deliverables
  - Fully functional test environment
  - Smoke Test Results

## Slide 45 — 5. Test Execution (Activities)

- Run test cases in the deployed environment
- Collect and analyze test results
- Compare actual results with expected results
- Report defects found during test execution

## Slide 46 — 5. Test Execution (Entry/Deliverables)

- Entry criteria
  - Test Cases
  - Test Data
  - Automation Script
- Deliverables
  - Test Results
  - Defect Reports

## Slide 47 — 6. Test Cycle Closure (Activities)

- Ensure that all testing activities have been completed
- Document the testing process and any lessons learned
- Prepare Test Summary Report
- Prepare Test Closure Report

## Slide 48 — 6. Test Cycle Closure (Entry/Deliverables)

- Entry criteria
  - Test Cases
  - Test Results
  - Defect Reports
- Deliverables
  - Test Summary Report
  - Test Closure Report

## Slide 49 — Section Divider: 7 Principles of Software Testing

- Software testing life cycle
- **7 principles of software testing**
- Levels of software testing
- Types of software testing

## Slide 50 — 7 Principles of Software Testing (1–3)

- #1: Testing shows the presence of defects
  - Don't talk about the absence of defects
  - Reduces the probability of undiscovered defects
- #2: Exhaustive testing is not possible
  - Need the optimal amount of testing
  - Based on the risk assessment
- #3: Early testing
  - Testing should start as early as possible
  - Much cheaper to fix a defect in the early stages of testing

## Slide 51 — 7 Principles of Software Testing (4–5)

- #4: Defect clustering
  - A small number of modules contain most of the defects detected
  - Pareto Principle: 80% of the defects are found in 20% of the modules
- #5: Pesticide paradox
  - If the same set of repetitive tests are conducted, the method will be useless for discovering new defects
  - The test cases need to be regularly reviewed & revised, adding new & different test cases

## Slide 52 — 7 Principles of Software Testing (6–7)

- #6: Testing is context dependent
  - The way you test an e-commerce site will be different from the way you test a commercial off the shelf application
  - Use a different approach, methodologies, techniques, and types of testing depending upon the application type
- #7: Absence of error – fallacy
  - It is possible that software which is 99% bug-free is still unusable
  - Software testing is not mere finding defects, but also to check that software addresses the business needs

## Slide 53 — Section Divider: Levels of Software Testing

- Software testing life cycle
- 7 principles of software testing
- **Levels of software testing**
- Types of software testing

## Slide 54 — Four Levels of Testing

A diagram showing four progressive levels of testing represented by icons (parts to assembled bicycle to person riding):

- **Unit Test** — Test individual component
- **Integration Test** — Test components work together
- **System Test** — Test the entire system
- **Acceptance Test** — Test the final system

## Slide 55 — Unit Testing

- Component/Module/Program testing
- Each unit is independently tested
- Performed by developers
- Bugs are fixed immediately, no need to report

## Slide 56 — Unit Testing (Stubs and Drivers)

- Stubs and Driver are simulator units
- Return value
  - Static value
  - Input value

Three diagrams illustrating: (1) Normal call: A calls B. (2) Using a Stub: A calls Stubs (replacing B). (3) Using a Driver: Driver calls B (replacing A).

## Slide 57 — Unit Testing (Stubs Example)

- Unit A calls Units B and C
- Test Unit A independently
  - Replace Units B and C with simulator units (Stubs)

Diagram: Unit A (blue) calls down to Units B and C (both green, inside a dashed box labeled "Stubs").

## Slide 58 — Unit Testing (Testing Tools)

- Testing tools
  - Write source code directly
  - Unit testing framework
  - Mocking framework
  - Dependency injection and IoC container

## Slide 59 — Integration Testing

- Test two or more units/sub-systems
- Test the interface/interaction between units
- Performed by developer and tester
- Integration approaches
  - Big-bang integration
  - Incremental integration

## Slide 60 — Integration Testing (Big-bang Integration)

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

Diagram: A tree with root A and children B and C (all blue).

## Slide 61 — Integration Testing (Incremental Integration)

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

## Slide 62 — Integration Testing (Top-down Diagram)

- Top-down Integration
  - Test high-level units first, then gradually integrate lower-level units

Two tree diagrams showing incremental top-down integration: Depth-first integration (A → B tested first, C is a stub, then D added under B while E is a stub) and Breadth-first integration (A → B and C tested together first, then D and E added as stubs).

## Slide 63 — Integration Testing (Top-down Advantages/Disadvantages)

- Top-down Integration
  - Advantages
    - Easier to identify defects and isolate their sources
    - Check important units first, more likely to find critical design flaws
    - Possible to create an early prototype
  - Disadvantages
    - The examination of lower-level modules can take a lot of time
    - When too many testing stubs are involved, the testing process can become complicated

## Slide 64 — Integration Testing (Bottom-up Diagram)

- Bottom-up Integration
  - The lowest level units are integrated into groups that represent a function of the software

Diagram: Tree with A (green, stub) at top, B (blue) and C (green, stub) in middle, D and E (blue) at bottom. Testing starts from leaves upward.

## Slide 65 — Integration Testing (Bottom-up Advantages/Disadvantages)

- Bottom-up Integration
  - Advantages
    - Easier to find and localize faults
    - Don't have to wait for all units to be available for testing
  - Disadvantages
    - Testing all units can take a lot of time
    - Critical units are tested only in the final stages
    - Testing can be complicated if consisting of multiple low-level units
    - Not possible to create an early prototype

## Slide 66 — Integration Testing (Sandwich Testing)

- Sandwich testing
  - Combine Top-down and Bottom-up

Diagram: A module hierarchy A → B, C with D and E under B. The upper part (A, B, C) uses Top-down integration; the lower part (D, E under B) uses Bottom-up integration by functionality.

## Slide 67 — System Testing

- The final step of integration testing
- Test the complete and fully integrated system
- Perform by tester and business analyst
- Include both functional and non-functional testing

## Slide 68 — Acceptance Testing

- Final step of validation
- Ensure that the system meets user expectations
- Performed by end-user

## Slide 69 — Acceptance Testing (Alpha and Beta)

- Alpha testing and Beta testing
  - Similarity
    - When the software is stable
    - Get feedback on bugs, expectations, suggestions
  - Difference
    - Alpha testing is done in a development environment
    - Beta testing is done in a real-world environment

## Slide 70 — Section Divider: Types of Software Testing

- Software testing life cycle
- 7 principles of software testing
- **Levels of software testing**
- Types of software testing

## Slide 71 — Types of Software Testing

- Functional testing
- Non-functional testing
- Structural testing
- Change-related testing

## Slide 72 — Functional Testing

- Functional testing = Black-box testing
- Based on functional requirements
- Detect functional defects
- Don't care how to implement

## Slide 73 — Functional Testing (Black-box Design Techniques)

- Black-box design techniques
  - Equivalence Partitioning
  - Boundary Value Analysis
  - State Transition Diagrams
  - Decision Tables
  - Cause-Effect Graph
  - Use Case Testing

## Slide 74 — Non-functional Testing (Overview)

- Performance testing
- Usability testing
- Security testing
- Configuration/Installation testing
- Back-up/Recovery testing

## Slide 75 — Non-functional Testing (Performance Testing)

- Performance testing
  - Speed – Whether the application responds quickly
  - Scalability – The maximum user load the software application can handle
  - Stability – If the application is stable under varying loads

## Slide 76 — Non-functional Testing (Usability Testing)

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

## Slide 77 — Non-functional Testing (Security Testing)

- Security testing
  - Confidentiality – limiting access to sensitive access managed by a system
  - Integrity – ensuring that data is consistent, accurate, and trustworthy throughout its lifecycle and cannot be modified by unauthorized entities
  - Authentication – ensuring sensitive systems or data are protected by a mechanism that verifies the identity of the individual accessing them
  - Authorization – ensuring sensitive systems or data properly control access for authenticated users according to their roles or permissions
  - Availability – ensuring that critical systems or data are available for their users when they are needed
  - Non-repudiation – ensures that data sent or received cannot be denied, by exchanging authentication information with a provable time stamp

## Slide 78 — Non-functional Testing (Configuration/Installation Testing)

- Configuration/Installation testing
  - Configuration testing
    - Different hardware, environments
    - Software configuration
    - Version upgrade conflict
  - Installation testing
    - Install packages
    - Uninstall

## Slide 79 — Non-functional Testing (Back-up/Recovery Testing)

- Back-up/Recovery testing
  - Verifies software's ability to recover from failures like software/hardware crashes, network failures

## Slide 80 — Structural Testing

- Structural testing = White-box testing
- Design test cases based on source code
- Code coverage
  - Statement coverage
  - Decision coverage
  - Condition coverage
  - Path coverage
  - Loop coverage

## Slide 81 — Change-related Testing

- Test after bugs are fixed
- Re-testing/Confirmation testing
  - Execute the exact test cases that found the bugs
  - Confirm the bugs have been fixed
  - No guarantee that new bugs have not occurred
- Regression testing
  - Execute all previously passed test cases
  - Find new bugs that occur

## Slide 82 — Q&A Slide (Part 2)

A Q&A divider slide showing speech-bubble icons with "Q" and "A" on a decorative background.
