---
title: "S13 — GUI Testing & Usability Testing"
source: "Slides/S13_GUI Testing & Usability Testing.pdf"
course: CSC13003 Software Testing
slides: 55
tags: [software-testing, slides, gui-testing, usability-testing]
---

## Slide 1 — Title Slide

Software Testing CSC13003 — GUI Testing & Usability Testing.

## Slide 2 — Content

- GUI testing
- Usability testing

## Slide 3 — What is GUI Testing?

- GUI is the abbreviation of Graphic User Interface.
- GUI testing examines the visual elements of software applications: buttons, menus, input fields, and the overall visual design.
- Testers interact with the software's visual components to verify they function as intended and appear correctly.

## Slide 4 — GUI Testing — Purpose

- Identify and rectify any UI issues.
- Ensure the interface is visually appealing, user-friendly, and responsive.

## Slide 5 — GUI Testing — Functional Validation

- Functional Validation
  - GUI testing checks the functionality tied to visual elements.
  - It verifies that user interactions with visual components lead to the expected outcomes.

## Slide 6 — GUI Testing — Common Elements

- Common elements tested:
  - Buttons
  - Checkboxes
  - Radio buttons
  - Dropdown menus
  - Text fields
  - Error messages

## Slide 7 — Why is GUI Testing Necessary? (Part 1)

- User-Centric Focus
  - The GUI is the primary interface between the user and the software. It must be intuitive, accessible, and functional.
- Visual Consistency
  - Ensures the GUI appears consistently across different devices, screen sizes, and resolutions.
  - Prevents issues such as text overflow, misaligned elements, or missing components.

## Slide 8 — Why is GUI Testing Necessary? (Part 2)

- Functional Verification
  - Ensures that all interactive elements — buttons, forms, menus — work correctly in different scenarios.
- Usability and Accessibility
  - A well-tested GUI ensures that all users, including those with disabilities, can navigate and use the software effectively.

## Slide 9 — Why is GUI Testing Necessary? (Part 3)

- Brand Reputation
  - A visually appealing and functional GUI contributes to a positive user experience, enhancing brand reputation.
- Bug Detection
  - Many bugs in software manifest themselves in the GUI layer; early detection leads to faster resolution.
- Compliance
  - Certain industries require software to comply with specific GUI standards and accessibility guidelines.

## Slide 10 — GUI Testing Process

The GUI testing process follows this flow:

```
Test Design
    ↓
Prepare Tests
    ├── Prepare Manual Scripts
    ├── Record Automated Scripts
    └── Code Automated Scripts
    ↓
Execute Tests
    ├── Manual Execution
    └── Automated Execution
```

## Slide 11 — Common GUI Bugs (Part 1)

- Data validation
- Incorrect field default
- Mishandling server process failures
- Mandatory fields not marked as mandatory
- Wrong fields retrieved by queries

## Slide 12 — Common GUI Bugs (Part 2)

- Incorrect search criteria
- Field order issues
- Multiple DB rows returned when a single row is expected
- Currency (freshness) of data on screens
- Window object / DB field correspondence

## Slide 13 — Common GUI Bugs (Part 3)

- Correct window modality?
- Window system commands not available or don't work
- Control state alignment with the state of data in the window
- Focus on objects that need it?

## Slide 14 — Common GUI Bugs (Part 4)

- Menu options align with state of data or application mode
- Action of menu commands aligns with state of data
- Synchronization of window object content
- State of controls aligns with state of data

## Slide 15 — Types in GUI Testing

| Level | Testing Types |
| --- | --- |
| Low Level | Checklist testing, Navigation |
| Application | Equivalence Partitioning, Boundary Values, Decision Tables, State Transition Testing |
| Integration | Desktop Integration, C/S Communications, Synchronisation |
| Non-Functional | Soak testing, Compatibility testing, Platform/environment |

## Slide 16 — Low Level — Checklist Testing

- GUI standards
- Application standards
- Color scheme
- Typography
- Layout and alignment
- Labels
- Error messages

## Slide 17 — Low Level — Navigation Testing (Part 1)

- Main Menu Navigation
  - Verify that users can access all sections of the application from the main menu.
- Breadcrumb Navigation
  - Ensure breadcrumbs accurately reflect the user's path and allow for backtracking.

## Slide 18 — Low Level — Navigation Testing (Part 2)

- Links and Buttons
  - Verify that all links and buttons lead to the expected screens or perform the expected actions.
- Form Navigation
  - Check that users can navigate through form fields in a logical order and that validation messages appear in the correct locations.

## Slide 19 — Application Level Testing

| Testing Type | When to Use |
| --- | --- |
| Equivalence Partitioning + Boundary Values | Input validation / Simple rule-based logic |
| Decision Tables | Complex logic with multiple conditions |
| State Transition Testing | Applications with modes / Windows with dependencies |

## Slide 20 — Integration Level

- Desktop integration testing
  - Verify that the application integrates correctly with the desktop environment (file associations, clipboard, drag-and-drop).
- Client/Server communication testing
  - Ensure that the GUI correctly communicates with backend servers and handles network issues gracefully.
- Synchronization testing
  - Test that the GUI remains synchronized with the underlying data, especially in multi-user environments.

## Slide 21 — Non-functional Level

- Soak testing
- Compatibility testing
- Platform/Environment testing

## Slide 22 — Challenges in GUI Testing — Diverse Platforms and Devices

- Diverse Platforms and Devices:
  - Challenge: Ensuring consistent GUI performance and appearance across various operating systems, browsers, and devices.
  - Solution: Comprehensive cross-browser and cross-device testing, along with responsive design practices.

## Slide 23 — Challenges in GUI Testing — Frequent UI Changes

- Frequent UI Changes:
  - Challenge: Rapid iterations and updates in the UI can lead to test script maintenance challenges.
  - Solution: Implement a robust test automation framework, and use Page Object Model to decouple UI changes from test scripts.

## Slide 24 — Challenges in GUI Testing — Test Coverage

- Test Coverage:
  - Challenge: Ensuring complete coverage of all GUI elements and user workflows.
  - Solution: Develop a comprehensive test strategy that covers critical paths and edge cases.

## Slide 25 — Challenges in GUI Testing — Test Data and Environment Setup

- Test Data and Environment Setup:
  - Challenge: Creating and managing test data and test environments can be time-consuming.
  - Solution: Use data provisioning tools and containerization for efficient environment setup.

## Slide 26 — Challenges in GUI Testing — Localization and Internationalization

- Localization and Internationalization:
  - Challenge: Testing GUI for different languages, cultures, and regions.
  - Solution: Utilize localization testing tools and collaborate with native speakers.

## Slide 27 — Challenges in GUI Testing — Integration with Backend

- Integration with Backend:
  - Challenge: Coordinating GUI tests with backend systems and APIs.
  - Solution: Implement end-to-end testing strategies and use mocking for backend components.

## Slide 28 — Automation in GUI Testing

| Testing Type | Manual vs Automated |
| --- | --- |
| Checklist testing | Manual: application conventions; Automated: object states, menus, standard features |
| Navigation | Manual |
| Equivalence Partitioning, Boundary Values, Decision Tables, State Transition Testing | Manual: complicated cases; Automated: simple cases |
| Desktop Integration, C/S Communications | Manual: complicated cases; Automated: simple cases |
| Synchronization | Manual |
| Soak testing, Compatibility testing, Platform/environment | Automated |

## Slide 29 — Content (Section Divider)

- GUI testing
- **Usability testing**

## Slide 30 — Usability Testing

- Process that employs representative target population participants to evaluate product usability using specific usability criteria.
- Usability testing is not a guarantee for product success, but it should identify at least the key problems.

## Slide 31 — Basic Components

1. Development of specific problems statements and test plans and objectives
2. Use of representative sample of end users
3. Representation of the actual work environment
4. Observation of end users during product use or review
5. Collection of quantitative and qualitative measurements
6. Analysis of results and recommendations

## Slide 32 — Types of Usability Tests — Exploratory

- Early in the process
- Can be based on any form of the GUI (sketch, wire diagrams etc.)
- Evaluate preliminary, basic design concept
- Perform representative tasks in a "shallow" mode
- Informal test methodology, a lot of interaction
- Discuss high level concepts

## Slide 33 — Types of Usability Tests — Assessment

- Done after fundamental concepts are done
- Evaluates usability of lower level operations
- The users actually perform a set of well defined tasks
- Less interaction with test monitor
- Quantitative measurements are collected

## Slide 34 — Types of Usability Tests — Validation

- Done late in development cycle, close to release
- Goal is to certify product usability, "disaster insurance" against launching a poor product
- Often the first time when the whole product is tested (including help and docs)
- Evaluate with respect to some predetermined usability standard or benchmark
- Standards come from previous testing, competitive information, marketing, etc.
- Very specific quantitative tests
- Can establish standards for future products
- Can be also done by beta customers

## Slide 35 — Types of Usability Tests — Comparison

- Can be done at any point in the development cycle
- Compare alternatives using objective measures
- Can be informal or formal, depending on when it is done
- Often, best of alternative designs is combined

## Slide 36 — Test Environments

- Simple single room setups
  - Observer/monitor close to evaluator
  - Observer removed from evaluator
- Electronic observation room
- Classic elaborate usability lab
- Mobile lab

## Slide 37 — Example — Usability Lab Layout

A three-room usability lab layout divided into Observation, Evaluation, and Control zones:

- **Observation room** (left): Observers seated at monitors watching through one-way glass.
- **Evaluation room** (center): The user sits at a workstation with a laptop. Three cameras are positioned: ceiling camera on keyboard, floor camera on screen, ceiling camera on user. A meeting area for focus groups and prototyping is also present.
- **Control room** (right): Analyst, Videographer, Video Controller, and Audio Board with a recording laptop.

## Slide 38 — Typical Test Plan Format

- Purpose: what is the main purpose of the test
- Problem statement: specific questions you want resolved
- Test plan and objectives: tasks the user will do
- User profile: who will be the users
- Method and test design: how will you observe it, how will you collect the data, etc.
- Test environment and equipment
- Test monitor role
- Evaluation measures and data to be collected: how will you collect the feedback and how will you evaluate it
- Report: what will the final report contain

## Slide 39 — Task Selection for Evaluation

- Tasks to be evaluated are functions users want to do with the product. Focus is on the user view of the tasks and NOT at the components and details that you used to implement it. Examples:
  - Create and file document
  - Import several images
  - Find the right document
- Objective is to indirectly expose usability flaws by asking the user to perform typical tasks and NOT telling them exactly how to do it.
- Choose key and most frequently done tasks.
- The task has to be specific and measurable (quantitatively or qualitatively).

## Slide 40 — Task Components (Example 1)

| TASK | DESCRIPTION |
| --- | --- |
| Task | Load paper into copier |
| Machine state | Paper tray empty |
| Successful completion criteria | Paper properly loaded |
| Benchmark | Completed in 1 minute |

## Slide 41 — Selection of Evaluators and Test Groups

- Evaluators should be representative of the targeted users.
- Independent groups or within-subject design (but be careful to avoid exposing users to same tests since this will bias the results).
- Adequate numbers of testers.
- Offer motivation and rewards.

## Slide 42 — Measurements and Questionnaires

- Performance data: measures of user behavior such as error rates, number of accesses to help, time to perform the task, etc.
  - Usually can and should be objectively and automatically measured.
- Preference data: measures of user opinion, thought process such as rankings, answers to questions, comments, etc.
  - Use questionnaires.

## Slide 43 — Some Performance Measures

- Time to complete each task
- Number and percentage of tasks completed successfully/unsuccessfully
- Time required to access information
- Count of incorrect selections
- Count errors
- Time for system to respond
- ….

Data should be collected automatically or manually in an objective way.

## Slide 44 — Questionnaires — Likert Scale and Semantic Differentials

*Likert scale*

- I found GUI easy to use (check one)
  - __Strongly disagree__ Disagree
  - __ Neither agree or disagree
  - __Agree__ Strongly agree
  - (can also assign numbers from −2 to 2)

*Semantic differentials*

- I found File Open menu (circle one)
  - Simple   3  2  1  0  1  2  3   Complex

## Slide 45 — Questionnaires — Fill in Questions

*Fill in questions*

- I found the following aspects of GUI particularly easy to use (list 0–4 aspects):
  - _________________________
  - _________________________
  - _________________________
  - _________________________

## Slide 46 — Questionnaires — Check-box

*Check-box*

- Please check the statement that best describes your usage of spell check:
  - --- I always use spell check
  - --- I use spell check only when I have to
  - --- I never use spell check

## Slide 47 — Questionnaires — Branching Questions

*Branching questions*

- Would you rather use advanced search?
  - --- NO (skip to question 19)
  - --- YES (continue)
- What kind of advanced search would you like? (check one)
  - --- Boolean
  - --- Relevance

## Slide 48 — Summarizing Performance Results

- Performance data
  - Mean time to complete
  - Median time to complete
  - Range (high and low)
  - Standard deviation of completion times
  - System response time statistics
- Task accuracy
  - % of users completing the task within specified time
  - % of users completing the task regardless of time
  - Same as above, with assistance
  - Average error rate

## Slide 49 — Summarizing Preference Results

- For limited choice questions
  - Count how many participants selected each choice (number and %)
  - For Likert scale or semantic differentials provide average scores if there are enough evaluators
- For free form questions
  - List questions and group answers into categories, also into positive and negative answers
- For free comments
  - List and group them at the end of the report

## Slide 50 — Analyzing Data

- Identify and focus on tasks that did not pass the test or showed significant problems.
- Identify user errors and difficulties.
- Identify sources of errors.
- Prioritize problems by criticality = severity AND probability of occurrence.
- Analyze differences between groups (if applicable).
- Provide recommendations at the end.

## Slide 51 — Problem Statements and Performance Data to Collect

| Problem Statement | Performance Data Collected |
| --- | --- |
| How effective is the tutorial | Compare error rates of users who used and not used this |
| How easy is it to perform task X | Error rate OR Number of steps needed |

Note: this is Performance data measurement only. You also need to assess user Preference data (see next slide).

## Slide 52 — Problem Statements and Preference Data to Collect

| Problem Statement | Preference Data Collected |
| --- | --- |
| How effective is the tutorial | Ask user to rate it from very ineffective to very effective (Likert scale or semantic differentials) + free comments |
| How easy is it to perform task X | Ask user to rate it from very easy to very difficult (Likert scale or semantic differentials) + free comments |

## Slide 53 — Relate Problem Statements with Tasks

| Problem Statement | Task |
| --- | --- |
| How effective is the tutorial | GroupA: Import image w/o using tutorial; GroupB: Same but use tutorial first |
| How easy is it to Create Virtual Machine | Create Virtual machine with "this" properties using New VM Wizard |

## Slide 54 — Task Components (Example 2)

| TASK | DESCRIPTION |
| --- | --- |
| Task | Create VM using New VM Wizard |
| Machine state | VMware WS SW just loaded |
| Successful completion criteria | Working VM created |
| Benchmark | Completed in 30 sec. |

## Slide 55 — Q&A

Q&A slide. Two overlapping speech bubbles showing "Q" (blue) and "A" (dark grey) — open for questions and answers.
