---
title: "S10 — Test Management"
source: "Slides/S10_Test Management.pdf"
course: CSC13003 Software Testing
slides: 111
tags: [software-testing, slides, test-management, risk-analysis, test-planning, test-estimation]
---

## Slide 1 — Title Slide

Software Testing CSC13003 — Test Management.

## Slide 2 — Content

- Independent testing
- Test roles and their tasks
- Test management
- Planning
  - Risk Analysis
  - Test Estimation
  - Test Planning
  - Test Organization
- Execution
  - Test Monitoring and Control
  - Issue Management
  - Test Report and Evaluation

## Slide 3 — What is Independent Testing?

- Independent testing is testing conducted by a person or group who are not directly involved in the development of the software under test.
- The degree of independence can vary, from tests written and executed by the developers themselves, up to tests performed by a completely external body.

## Slide 4 — Independent Testing — 5 Degrees

Five degrees of independence (increasing level):

1. Tests designed and executed by the developer who wrote the code (no independence).
2. Tests designed and executed by another developer in the same team.
3. Tests designed and executed by a dedicated tester within the development project.
4. Tests designed and executed by an independent test team or group within the organization.
5. Tests designed and executed by testers from outside the organization (e.g., outsourced or certification bodies).

## Slide 5 — Independent Testing — Benefits

- Independent testing finds different defects than the developers (different perspective and assumptions).
- Independent testers can verify and challenge assumptions made during specification and implementation.
- Testers are not subject to the organizational or schedule pressures that may cause developers to skip testing.
- Provides an objective and unbiased view of software quality.

## Slide 6 — Independent Testing — Drawbacks

- Can develop an adversarial relationship between testers and developers.
- Developers may lose a sense of responsibility for quality if testing is fully delegated.
- Independent testers may be isolated from the development team, causing information gaps.
- Requires additional cost and time for handoff and communication.

## Slide 7 — Test Roles — Test Manager (Part 1)

- The Test Manager is responsible for:
  - Defining the test policy and test strategy for the project.
  - Planning the testing activities, resources, and schedule.
  - Coordinating between the development team and test team.

## Slide 8 — Test Manager — Tasks (Policy & Strategy)

- Define test policy: the general principles and goals of testing in the organization.
- Define test strategy: the approach taken for testing this specific project (levels, techniques, tools).
- Ensure the test strategy is aligned with business risk and project objectives.

## Slide 9 — Test Manager — Tasks (Planning & Monitoring)

- Create and maintain the test plan document.
- Monitor test progress against the plan.
- Report status to project stakeholders.
- Take corrective actions when the project deviates from the plan.

## Slide 10 — Test Manager — Tasks (Tools & Career)

- Select and manage test tools and test environments.
- Support the career development of testers on the team.
- Facilitate knowledge sharing and continuous improvement in testing practices.

## Slide 11 — Test Roles — Tester

- The Tester is responsible for:
  - Analyzing requirements and specifications to identify what to test.
  - Designing and implementing test cases and test scripts.
  - Setting up and maintaining the test environment (together with the Test Administrator).
  - Executing tests and recording results.
  - Reporting defects and tracking their resolution.

## Slide 12 — Tester — Tasks (Part 1)

- Review and analyze test basis documents (requirements, designs).
- Design test scenarios and test cases based on testing techniques.
- Prepare test data.
- Implement and automate test scripts where applicable.

## Slide 13 — Tester — Tasks (Part 2)

- Execute manual and automated test cases.
- Log test results accurately.
- Report defects using the defect tracking system.
- Participate in defect triage meetings and re-test fixed defects.

## Slide 14 — What is Test Management?

- Test Management is the process of planning, monitoring, and controlling testing activities.
- It encompasses all activities that are needed to plan, organize, execute, and control the testing effort.
- Test Management ensures that testing is conducted systematically and that the results are reported to all stakeholders.

## Slide 15 — Test Management — 2 Main Parts

Two main parts of Test Management:

1. **Planning** — Activities performed before and during test execution to define how testing will be conducted:
   - Risk Analysis
   - Test Estimation
   - Test Planning
   - Test Organization

2. **Execution** — Activities performed during and after test execution to ensure quality:
   - Test Monitoring and Control
   - Issue Management
   - Test Report and Evaluation

## Slide 16 — Test Management — Overview

Test Management covers the full testing lifecycle: from identifying risks and estimating effort, to planning and organizing the team, executing tests, monitoring progress, and reporting results at the end of the project.

## Slide 17 — Planning — Risk Analysis

- **What is Risk Analysis?**
  - Risk Analysis is the process of identifying risks and their potential impacts on the project, and then prioritizing testing efforts accordingly.
  - A risk is any factor that could potentially cause failure or negative consequences to the project.

## Slide 18 — Risk Analysis — Benefits

- Allows the test team to focus testing effort on the most critical and risky areas of the system.
- Helps prioritize test cases and decide on testing depth.
- Enables proactive mitigation of risks before they become issues.
- Provides a basis for reporting and communicating quality to stakeholders.

## Slide 19 — Risk Analysis — 3-Step Process

Three steps of Risk Analysis:

1. **Identify Risks** — list all potential risks to the project and product.
2. **Analyze Risks** — assess the probability and impact of each identified risk.
3. **Countermeasures** — define responses to each risk (respond, register, and monitor).

## Slide 20 — Risk Analysis — Process Overview

The Risk Analysis process flows sequentially:

```
Step 1: Identify Risk
      ↓
Step 2: Analyze Risk
      ↓
Step 3: Countermeasures (Risk Response → Risk Register → Monitor & Control)
```

## Slide 21 — Step 1: Identify Risk — Types of Risk

Two major categories:

- **Project Risk** — risks that affect the project schedule, resources, or budget:
  - Organizational Risk
  - Technical Risk
  - Business Risk

- **Product Risk** — risks that affect the quality or correctness of the product itself.

## Slide 22 — Project Risk — Organizational Risk

- Organizational risks are related to team structure, skills, and management:
  - Lack of skilled testers
  - Poor communication between teams
  - Inadequate training or experience
  - High staff turnover

## Slide 23 — Project Risk — Organizational Risk (Roles & Questions)

Key questions to identify organizational risks:

- Do team members have the required skills and experience?
- Are roles and responsibilities clearly defined?
- Is there sufficient communication between the test team and development team?
- Is management supportive of the testing effort?

## Slide 24 — Project Risk — Organizational Risk (Examples)

- Insufficient budget allocated for testing activities.
- Test team does not have authority to stop or delay releases.
- Testers are reassigned to development tasks during critical test phases.
- No formal process for reporting defects and tracking resolution.

## Slide 25 — Project Risk — Transition to Technical Risk

- After identifying organizational risks, the team must also consider technical risks — risks arising from the technology, tools, and technical complexity of the system being built.

## Slide 26 — Project Risk — Technical Risk (Introduction)

- Technical risks arise from complexity of the system, use of new or unfamiliar technology, or technical dependencies:
  - Complex system architecture
  - Integration with third-party systems
  - Unreliable or unfamiliar tools
  - Insufficient test environment setup

## Slide 27 — Project Risk — Technical Risk (Examples & Solutions)

- **Risk**: The test environment may not be set up properly like the real business environment.
  - **Solution**: Ask the development team to help build up the test environment; prepare all required equipment (server, database, PC).

## Slide 28 — Project Risk — Technical Risk (More Solutions)

- **Risk**: New or untested technology used in the system may behave unexpectedly.
  - **Solution**: Allocate time for technology spike testing; involve domain experts early.
- **Risk**: Integration points with third-party systems fail.
  - **Solution**: Create stub/mock environments; plan integration testing early.

## Slide 29 — Project Risk — Business Risk (Definition & Examples)

- Business risks are risks related to the commercial or strategic context of the project:
  - The project may be cut or reduced due to changing business priorities.
  - Customer requirements change frequently.
  - Budget constraints force scope reduction.

## Slide 30 — Project Risk — Business Risk (Solutions)

- **Risk**: Project may be cut by half because of business situation.
  - **This is a critical risk** — it may prevent the whole project from proceeding.
  - Re-define the project scope; identify what will be tested and what will be ignored.
  - Negotiate with the customer about project terms to fit the budget.
  - Improve productivity of each phase (testing, making test specs) to save time and cost.

## Slide 31 — Product Risk — Definition

- Product risks are risks related to the quality or correctness of the product:
  - Functional failures (features do not work as specified)
  - Security vulnerabilities
  - Performance issues
  - Usability problems

## Slide 32 — Product Risk — Examples

- **Risk**: This website may lack security features.
  - This risk is considered Medium priority because it doesn't affect the whole project and could be avoided.
  - Solution: Request the development team to check and add security functions to the website.

## Slide 33 — Product Risk — Steps

Steps to manage product risks:

1. Identify all quality characteristics at risk (functionality, security, performance, usability, etc.).
2. Assess the likelihood of failure in each area.
3. Prioritize testing effort based on risk level.
4. Define specific test cases to address the highest risks.

## Slide 34 — Step 2: Analyze Risk — Introduction

- After identifying risks, the next step is to analyze each risk by assessing:
  - **Probability**: how likely is it that this risk will occur?
  - **Impact**: how severe would the consequences be if it occurs?
- The combination of probability and impact determines the **risk priority**.

## Slide 35 — Step 2: Analyze Risk — Probability Table

Probability levels:

| Level | Description |
| --- | --- |
| High | Likely to occur in most circumstances |
| Medium | Might occur in some circumstances |
| Low | Unlikely to occur |

## Slide 36 — Step 2: Analyze Risk — Impact Table

Impact levels:

| Level | Description |
| --- | --- |
| High | Would have a severe effect on project or product quality |
| Medium | Would have a moderate effect; manageable with effort |
| Low | Would have a minor effect; easily remedied |

## Slide 37 — Step 2: Analyze Risk — Priority Table

Risk Priority matrix combining Probability × Impact:

| | High Impact | Medium Impact | Low Impact |
| --- | --- | --- | --- |
| **High Probability** | Critical | High | Medium |
| **Medium Probability** | High | Medium | Low |
| **Low Probability** | Medium | Low | Negligible |

Higher priority risks receive more intensive testing effort and earlier attention.

## Slide 38 — Step 3: Countermeasures — Overview

Three activities in Step 3:

1. **Risk Response** — decide how to handle each risk.
2. **Risk Register** — document all risks, their analysis, and planned responses.
3. **Monitor and Control Risk** — continuously track risks throughout the project.

## Slide 39 — Step 3: Risk Response — 4 Types

Four types of risk response:

| Type | Description |
| --- | --- |
| **Accept** | Acknowledge the risk and accept its consequences if it occurs; suitable for low-impact risks |
| **Avoid** | Change the plan to eliminate the risk entirely |
| **Transfer** | Shift the impact to a third party (e.g., insurance, outsourcing) |
| **Mitigate** | Take action to reduce the probability or impact of the risk |

## Slide 40 — Step 3: Risk Response — Example

- **Risk**: The testing environment may not be set up properly like the real business environment.
  - **Response type**: Mitigate
  - Ask the development team for their help to build up the test environment.
  - Prepare all the equipment or materials (Server, database, PC…) needed for setting up the environment.

## Slide 41 — Risk Response — Example (cont.)

- **Risk**: Your project may be cut by half because of business situation.
  - This risk is critical; it may prevent the whole project from proceeding. In that case, you should:
    - Re-define the project scope; identify what will be tested and what will be ignored.
    - Negotiate with the customer about the term of project to fit the project budget.
    - Improve the productivity of each project phase such as testing, making test specs… If you can save time, you can save cost.

## Slide 42 — Risk Response — Example (cont.)

- **Risk**: This website may lack security features.
  - This risk is considered as Medium priority, because it doesn't affect the whole project and could be avoided.
  - You can request the development team to check and add these functions to the website.

## Slide 43 — Register Risk

- All the risk must be recorded, documented and acknowledged by project managers, stakeholders and the project members.
- The risk register should be freely accessible to all the members of the project team.
- There are some useful tools to register risk such as Redmine, MITRE… etc.

## Slide 44 — Monitor and Control Risk

- Risks can be monitored on a continuous basis to check if any changes are made.
- New risks can be identified through the constant monitoring and assessing mechanisms.

## Slide 45 — Planning — Test Estimation

- Test Estimation is approximately determining how long a task would take to complete.
- Benefits of correct estimation:
  - Accurate test estimates lead to better planning, execution, and monitoring of tasks under a test manager's attention.
  - Allow for more accurate scheduling and help realize results more confidently.

## Slide 46 — What to Estimate?

Four dimensions to estimate:

- **Resources** — tools, hardware, software needed
- **Times** — duration of each task
- **Human Skill** — expertise required
- **Cost** — financial budget

## Slide 47 — How to Estimate?

Estimation methods:

- Work Breakdown Structure
- 3-Point Software Testing Estimation Technique
- Wideband Delphi technique
- Function Point / Testing Point Analysis
- Use Case Point Method
- Percentage distribution
- Ad-hoc method

## Slide 48 — How to Estimate? — Three Key Methods

- **Work Breakdown Structure (WBS)** — Breaking down the test project into small pieces.
- **Three Point Estimation** — Estimation method based on statistical data.
- **Functional Point Method** — Measure the size and give weightage to each function point.

## Slide 49 — How to Estimate? — 4 Steps

1. Divide the whole project into the smallest tasks.
2. Allocate each task to team members.
3. Estimate the effort required to complete each task.
4. Validate the estimation.

## Slide 50 — Step 1 — Divide the Whole Project Task into Subtasks

- To do this, you can use the Work Breakdown Structure technique.
- WBS hierarchy: Project → Modules → Sub-modules → Functionalities.

## Slide 51 — Step 1 — Divide the Whole Project Task into Subtasks (Table)

| Task | Sub task |
| --- | --- |
| Analyze software requirement specification | Investigate the software requirement specs |
| Analyze software requirement specification | Interview with the developer & other stakeholders to know more about the website |
| Create the Test Specification | Design test scenarios |
| Create the Test Specification | Create test cases |
| Create the Test Specification | Review and revise test cases |
| Execute the test cases | Build up the test environment |
| Execute the test cases | Execute the test cases |
| Execute the test cases | Review test execution results |
| Report the defects | Create the Defect reports |
| Report the defects | Report the defects |

## Slide 52 — Step 2 — Allocate Each Task to Team Member

| Task | Members |
| --- | --- |
| Analyze software requirement specification | All the members |
| Create the test specification | Tester / Test Analyst |
| Build up the test environment | Test Administrator |
| Execute the test cases | Tester, Test Administrator |
| Report defects | Tester |

## Slide 53 — Step 3 — Effort Estimation For Tasks

Two methods for effort estimation:

- Functional Point Method
- Three Point Estimation

## Slide 54 — Method 1 — Function Point Method

Three steps:

- **Step A) Size** — estimate the size of each function point.
- **Step B) Duration** — calculate total effort based on function point total and estimate per point.
- **Step C) Cost** — calculate total cost based on effort and team salary rate.

## Slide 55 — Step A — Estimate Size for the Task

Complexity classification:

| Group | Weightage |
| --- | --- |
| Complex — systems comprising multiple components that interact with each other | 5 |
| Medium — systems with a limited number of components | 3 |
| Simple — simple systems composed of small components | 1 |

## Slide 56 — Step A — Estimate Size for the Task (Example Table, Rows 1–3)

| No. | Module Name | Applicable Roles | Description | Weightage |
| --- | --- | --- | --- | --- |
| 1 | Balance Enquiry | Manager, Customer | Customer: view balance of own accounts only. Manager: view balance of all customers under supervision. | 3 |
| 2 | Fund Transfer | Manager, Customer | Customer: transfer funds from own account to any destination. Manager: transfer funds from any source to destination. | 5 |
| 3 | Mini Statement | Manager, Customer | Shows last 5 transactions. Customer: see mini-statement of own accounts. Manager: see mini-statement of any account. | 3 |

## Slide 57 — Step A — Estimate Size for the Task (Rows 4–6)

| No. | Module Name | Applicable Roles | Description | Weightage |
| --- | --- | --- | --- | --- |
| 4 | Customized Statement | Manager, Customer | Filter/display transactions by date and value. Customer: own accounts. Manager: any account. | 5 |
| 5 | Change Password | Manager, Customer | Customer: change password of own account. Manager: change own account password only; cannot change customers' passwords. | 1 |
| 6 | New Customer | Manager | Add a new customer; edit details (address, email, telephone). | 3 |

## Slide 58 — Step A — Estimate Size for the Task (Rows 7–9)

| No. | Module Name | Applicable Roles | Description | Weightage |
| --- | --- | --- | --- | --- |
| 7 | New Account | Manager | 2 account types: Saving, Current. Customer can have multiple accounts (individual or joint names). Manager: add new account for existing customer. | 5 |
| 8 | Edit Account | Manager | Manager can edit account details for an existing account. | 1 |
| 9 | Delete Account | Manager | Manager can delete an account for a customer. | 1 |

## Slide 59 — Step A — Estimate Size for the Task (Rows 10–12)

| No. | Module Name | Applicable Roles | Description | Weightage |
| --- | --- | --- | --- | --- |
| 10 | Delete Customer | Manager | A customer can be deleted only if they have no active current or saving accounts. Manager: delete a customer. | 1 |
| 11 | Deposit | Manager | Manager can deposit money into any account; usually done when cash is deposited at a bank branch. | 3 |
| 12 | Withdrawal | Manager | Manager can withdraw money from any account; usually done when cash is withdrawn at a bank branch. | 3 |

## Slide 60 — Step B — Estimate Duration for the Task

Formula: **Total Effort = Total Function Points × Estimate defined per Function Points**

| | Weightage | # of Function Points | Total |
| --- | --- | --- | --- |
| Complex | 5 | 3 | 15 |
| Medium | 3 | 5 | 15 |
| Simple | 1 | 4 | 4 |
| **Function Total Points** | | | **34** |
| **Estimate define per point** | | | **5** |
| **Total Estimated Effort (Person Hours)** | | | **170 man-hours** |

## Slide 61 — Step C — Estimate the Cost for the Tasks

- Suppose the average team salary is $5 per hour.
- The time required for "Create Test Specs" task is 170 hours.
- Accordingly, the cost for the task is 5 × 170 = **$850**.
- Calculate budget for other WBS activities to arrive at overall project budget.
- As a project manager, decide how to get the most return for the company's investment.
- The more accurate your estimate, the better you can manage the project's budget.

## Slide 62 — Method 2 — Three Point Estimation

- In three-point estimation, three values are produced initially for every task based on prior experience or best-guesses:
  - **a** — The best-case estimate
  - **m** — The most likely estimate
  - **b** — The worst-case estimate

## Slide 63 — Step 4 — Validate the Estimation

- Once you create an aggregate estimate for all tasks in the WBS, forward it to the management board for review and approval.
- The management board could comprise the CEO, Project Manager, and other stakeholders.
- Explain your estimation logically and reasonably so that the board can approve the plan.

## Slide 64 — Test Estimation Best Practices

- Add some buffer time.
- Account for resource planning in estimation — e.g., what if some team members take long leaves?
- Use past experience as a reference.
- Stick to your estimation.

## Slide 65 — Software Test Estimation Template

- Download the Software Test Estimation Excel template on Guru99.

## Slide 66 — Planning — Test Planning

- A Test Plan can be defined as a document describing the scope, approach, resources, and schedule of intended testing activities.
- In software testing, a test plan gives detailed testing information regarding an upcoming testing effort, including:
  - Test Strategy
  - Test Objective
  - Exit / Suspension Criteria
  - Resource Planning
  - Test Deliverables

## Slide 67 — What is the Importance of Test Plan?

- Helps people outside the test team (developers, business managers, customers) understand the details of testing.
- Test Plan guides our thinking — it is like a rule book which needs to be followed.
- Important aspects like test estimation, test scope, and Test Strategy are documented in the Test Plan, so it can be reviewed by Management Team and re-used for other projects.

## Slide 68 — How to Write a Test Plan

Based on IEEE 829, 8 steps:

```
1. Analyze the product
        ↓
2. Design Test Strategy
        ↓
3. Define Test Objectives
        ↓
4. Define Test Criteria
        ↓
5. Resource Planning
        ↓
6. Plan Test Environment
        ↓
7. Schedule & Estimation
        ↓
8. Determine Test Deliverables
```

## Slide 69 — Step 1 — Analyze the Product

Key questions:

- Who will use the website?
- What is it used for?
- How will it work?
- What are the software/hardware the product uses?

## Slide 70 — Step 1 — Analyze the Product (Methods)

Three activities form a cycle:

- **Interview** client, designer, and developer.
- **Review** product and project documentation.
- **Perform** product walkthrough.

## Slide 71 — Step 2 — Develop Test Strategy

- The project's testing objectives and the means to achieve them.
- Determines testing effort and costs.
- Four sub-steps:
  - Step 2.1 — Define scope of Testing
  - Step 2.2 — Identify Testing Type
  - Step 2.3 — Document Risks & Issues
  - Step 2.4 — Create Test Logistics

## Slide 72 — Step 2.1 — Define Scope of Testing (Part 1)

- Before the start of any test activity, the scope of testing should be known.
  - Components of the system to be tested (hardware, software, middleware, etc.) are defined as **"in scope"**.
  - Components that will not be tested must be clearly defined as **"out of scope."**

## Slide 73 — Step 2.1 — Define Scope of Testing (Part 2)

- Defining the scope is very important for all stakeholders. A precise scope helps you:
  - Give everyone confidence and accurate information about the testing you are doing.
  - Ensure all project members have a clear understanding about what is tested and what is not.

## Slide 74 — Step 2.1 — Define Scope: How to Determine

How do you determine scope for your project?

- Precise customer requirement
- Project Budget
- Product Specification
- Skills & talent of your test team

## Slide 75 — Step 2.1 — Define Scope (Example — Guru99 Bank)

- As per the software requirement specs, the project Guru99 Bank only focuses on:
  - **In scope**: Testing all the functions and external interface of website Guru99 Bank.
  - **Out of scope**: Nonfunctional testing such as stress, performance, or logical database testing.

## Slide 76 — Step 2.1 — Define Scope (Problem Scenario)

- **Problem Scenario**: The customer wants you to test their API. But the project budget does not permit.
  - In such a case you need to convince the customer that API Testing is extra work and will consume significant resources.
  - Give supporting data.
  - If API Testing is included in-scope, the budget will increase by XYZ amount.

## Slide 77 — Step 2.2 — Identify Testing Type

| Testing Type | Description |
| --- | --- |
| Unit Test | Test the smallest piece of verifiable software in the application |
| API Testing | Test the APIs created for the application |
| Integration Test | Individual software modules are combined and tested as a group |
| System Test | Conducted on a complete, integrated system to evaluate the system's compliance with specified requirements |
| Install/Uninstall Testing | Focuses on what customers will need to do to install/uninstall and set up/remove the new software successfully |
| Agile Testing | Testing the system using Agile methodology |

## Slide 78 — Step 2.3 — Document Risk & Issues

| Risk | Mitigation |
| --- | --- |
| Team member lacks the required skills for website testing | Plan **training course** to skill up your members |
| The project schedule is too tight; hard to complete on time | Set **Test Priority** for each test activity |
| Test Manager has poor management skill | Plan **leadership training** for manager |
| Lack of cooperation negatively affects employee productivity | **Encourage** each team member in their task, **inspire** them to greater efforts |
| Wrong budget estimate and cost overruns | Establish **scope** before beginning work, pay attention to planning, constantly track and measure progress |

## Slide 79 — Step 2.4 — Create Test Logistics (Who Will Test?)

- Who will test?
- Person having the following skills is most ideal for performing software testing:
  - Ability to understand customers' point of view
  - Strong desire for quality
  - Attention to detail
  - Good cooperation

## Slide 80 — Step 2.4 — Create Test Logistics (When Will the Test Occur?)

- When will the test occur?
- Testing can begin when all three prerequisites are ready:
  - **Test specs and Requirement documents**
  - **Human resources**
  - **Test environment**
  
  → Ready to Test

## Slide 81 — Step 3 — Define Test Objective

- Test Objective is the overall goal and achievement of the test execution.
- The objective of testing is finding as many software defects as possible; ensure that the software under test is bug-free before release.
- To define test objectives, perform 2 steps:
  - List all the software features (functionality, performance, GUI…) that may need to be tested.
  - Define the target or goal of the test based on the above features.

## Slide 82 — Step 3 — Define Test Objective (Feature Map)

Mind map of Guru99 Bank features to test:

- **Functionality**: Account, Deposit, Withdrawal, Balance, Enquiry, Fund Transfer, Login, Logout, Change Password, New
- **Hardware**: Web server, Database server, Mail server
- **UI**: Web elements (Button, Menu, Text, Image, HTML/CSS, Links), Website Layout
- **Performance**: Load Test, Stress Test
- **Security**: Account protection, Authorize access
- **Usability**: User friendly, Clear contents
- **Compatibility**

## Slide 83 — Step 3 — Define Test Objective (Example)

Based on the Guru99 Bank feature map, test objectives are:

- Check that website Guru99 functionality (Account, Deposit…) is working as expected without any error or bugs in a real business environment.
- Check that the external interface of the website (UI) is working as expected and meets customer needs.
- Verify the usability of the website — are the functionalities convenient for users?

## Slide 84 — Step 4 — Define Test Criteria (Suspension Criteria)

- **Suspension Criteria**
  - Specify the critical suspension criteria for a test. If the suspension criteria are met during testing, the active test cycle will be suspended until the criteria are resolved.
- **Example**: If your team members report that 40% of test cases have failed, you should suspend testing until the development team fixes all the failed cases.

## Slide 85 — Step 4 — Define Test Criteria (Suspension Flowchart)

Suspension criteria flowchart:

```
Define suspension criteria
        ↓
Execute test cases
        ↓
Suspension criteria met?
   NO → Finish the testing
   YES → Suspend the testing
             ↓
        Developer fix the fail cases?
           YES → back to Execute test cases
           NO  → remain suspended
```

## Slide 86 — Step 4 — Define Test Criteria (Exit Criteria)

- **Exit Criteria**
  - Specifies the criteria that denote a successful completion of a test phase.
  - The exit criteria are the targeted results of the test and are necessary before proceeding to the next phase of development.
- **Example**: 95% of all critical test cases must pass.

## Slide 87 — Step 4 — Define Test Criteria (Exit Criteria — Rates)

- **Exit Criteria — Run Rate and Pass Rate**
  - **Run rate** = number of test cases executed / total test cases in test specification.
    - Example: 120 TCs total, 100 executed → run rate = 100/120 = 0.83 (83%)
  - **Pass rate** = number of test cases passed / test cases executed.
    - Example: 100 TCs executed, 80 passed → pass rate = 80/100 = 0.8 (80%)

## Slide 88 — Step 4 — Define Test Criteria (Exit Criteria — Standards)

- Run rate is mandatory to be 100% unless a clear reason is given.
- Pass rate is dependent on project scope, but achieving a high pass rate is a goal.

## Slide 89 — Step 5 — Resource Planning — Human Resource

| No. | Member | Tasks |
| --- | --- | --- |
| 1. | Test Manager | Manage the whole project; Define project directions; Acquire appropriate resources |
| 2. | Tester | Identify and describe appropriate test techniques/tools/automation architecture; Verify and assess the Test Approach; Execute tests, Log results, Report defects; May be in-sourced or outsourced; Outsourced recommended for low-skill tasks to save project cost |
| 3. | Developer in Test | Implement the test cases, test programs, test suites etc. |
| 4. | Test Administrator | Builds up and ensures Test Environment and assets are managed and maintained; Supports Tester in using the test environment |
| 5. | SQA members | Take in charge of quality assurance; Confirm whether the testing process is meeting specified requirements |

## Slide 90 — Step 5 — Resource Planning — System Resource

| No. | Resources | Descriptions |
| --- | --- | --- |
| 1. | Server | Install the web application under test; includes web server, database server, and application server if applicable |
| 2. | Test tool | Automate testing, simulate user operations, generate test results; examples: Selenium, QTP |
| 3. | Network | LAN and Internet to simulate the real business and user environment |
| 4. | Computer | The PC users use to connect to the web server |

## Slide 91 — Step 6 — Plan Test Environment

- A testing environment is a setup of software and hardware on which the testing team is going to execute test cases.
- The test environment consists of real business and user environment, as well as physical environments such as server, front-end running environment.

## Slide 92 — Step 6 — Plan Test Environment (Questions)

Key questions when planning the test environment:

- What is the maximum user connection which this website can handle at the same time?
- What are hardware/software requirements to install this website?
- Does the user's computer need any particular setting to browse the website?

## Slide 93 — Step 7 — Schedule & Estimation

- Consider three factors for scheduling:
  - Employee and project deadline
  - Project estimation
  - Project Risk

- Example Gantt chart (Guru99 Bank project):

| Task Name | Start Date | End Date |
| --- | --- | --- |
| Making Test specification | 02/03/14 | 02/07/14 |
| Perform Test Execution | 02/10/14 | 02/19/14 |
| Test Report | 02/20/14 | 02/25/14 |
| Test Delivery | 02/26/14 | 02/27/14 |

## Slide 94 — Step 8 — Test Deliverables (Before Testing)

- **Before testing**:
  - Test plans document
  - Test cases documents
  - Test Design specifications

Three phases: Before Testing → During Testing → After the Testing

## Slide 95 — Step 8 — Test Deliverables (During Testing)

- **During testing**:
  - Test Scripts
  - Simulators
  - Test Data
  - Test Traceability Matrix
  - Error logs and execution logs

## Slide 96 — Step 8 — Test Deliverables (After Testing)

- **After testing**:
  - Test Results / reports
  - Defect Report
  - Installation / Test procedures guidelines
  - Release notes

## Slide 97 — Planning — Test Organization

- Test Organization in Software Testing is a procedure of defining roles in the testing process.
- It defines who is responsible for which activities in the testing process.
- Now you have a Plan, but how will you stick to the plan and execute it? To answer that question, you have the Test Organization phase.

## Slide 98 — How to Create a Highly Effective Team?

Four pillars of an Effective Team:

- **Strong Cooperation** — team members work together and support each other
- **Commitment** — each member is dedicated to the shared goals
- **Effective Communication** — clear and open information exchange
- **Sharing** — sharing knowledge, workload, and credit

## Slide 99 — Test Organization — Step 1: Develop Human Resource Plan

| Designation | Responsibilities |
| --- | --- |
| Test Manager | Manage the whole project; Defines the project direction |
| Tester | Builds up Test Cases; Generate Test Suites; Execute tests, Log results, Report defects |
| Developer in Test | Creates programs to test (code created by developers); Creates test automation scripts |
| Test Administrator | Builds up and ensures Test Environment and assets are managed and maintained; Supports the team |
| SQA Members | Take in Charge of Quality Assurance |

## Slide 100 — Test Organization — Step 1: Develop Human Resource Plan (Sub-steps)

Three sub-steps:

- Step 1.1 — Demand Forecasting
- Step 1.2 — Competency Evaluation
- Step 1.3 — Skill up planning

## Slide 101 — Test Organization — Step 2: Build the Project Team

Building the project team involves defining four elements in sequence:

- **Team Mission** — why does the team exist and what are its goals?
- **Team Responsibility** — what is each member accountable for?
- **Team Rules** — agreed working norms and standards
- **Team Motivation** — how to keep the team engaged and performing

## Slide 102 — Test Organization — Step 3: Manage Project Team

Managing a project team involves three activities:

- **Setting Team Targets** — define performance goals for the team and individuals
- **Observation** — monitor team performance and progress
- **Conflict Management** — resolve disputes and disagreements within the team

A manager must turn a group of individual members into a cohesive, high-performing unit.

## Slide 103 — Content — Execution Phase

The **Execution** phase covers:

- **Test Monitoring and Control**
- **Issue Management**
- **Test Report and Evaluation**

## Slide 104 — Execution — Test Monitoring and Control

- What will you do when your project runs out of resources or exceeds the time schedule?
  - You need to Monitor and Control Test activities to bring it back on schedule.
- **Test Monitoring and Control** is the process of overseeing all the metrics necessary to ensure that the project is running well, on schedule, and not out of budget.

## Slide 105 — Test Monitoring

- Monitoring is a process of collecting, recording, and reporting information about the project activity that the project manager and stakeholders need to know.
- To Monitor, Test Manager does the following activities:
  - Define the project goal or project performance standard.
  - Observe the project performance, and compare the actual and the planned performance expectations.
  - Record and report any detected problem which happens to the project.

## Slide 106 — Test Controlling

- Project Controlling is a process of using data from monitoring activity to bring actual performance to planned performance.
- In this step, the Test Manager takes action to correct the deviations from the plan.
- In some cases, the plan has to be adjusted according to the project situation.

## Slide 107 — Execution — Issue Management

Issue Management is the process of identifying, tracking, and resolving issues that arise during test execution and that may impact the testing process or project objectives.

(Slide content not shown — title only.)

## Slide 108 — Execution — Test Report & Evaluation

- The project has already been completed. It's now time to look back at what you have done.
- **"Test Evaluation Report"** describes the results of the testing in terms of Test coverage and exit criteria.
- The data used in Test Evaluation are based on the test results data and test result summary.

## Slide 109 — Content — Full Outline Recap

- Independent testing
- Test roles and their tasks
- Test management
- Planning:
  - Risk Analysis
  - Test Estimation
  - Test Planning
  - Test Organization
- **Execution**:
  - Test Monitoring and Control
  - Issue Management
  - Test Report and Evaluation

## Slide 110 — Q&A

Q&A slide. Two overlapping speech bubbles showing "Q" (blue) and "A" (dark grey) — open for questions and answers.

## Slide 111 — Q&A (Final)

Q&A slide. Two overlapping speech bubbles showing "Q" (blue) and "A" (dark grey) on an abstract world map background — session close.
