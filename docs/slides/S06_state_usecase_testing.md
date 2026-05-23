---
title: "S06 — State Transition Testing & Use Case Testing"
source: "Slides/S06.1_State Transition Testing.pdf + Slides/S06.2_Use Cases Testing.pdf"
course: CSC13003 Software Testing
merged_from: [S06.1_state-transition-testing.md, S06.2_use-cases-testing.md]
slides: 30
tags: [software-testing, slides, state-transition, use-case]
---

<!-- ============================================================ -->
<!-- PART 1: State Transition Testing (S06.1 — 20 slides)         -->
<!-- ============================================================ -->

## Slide 1 — Title: State Transition Testing

**Software Testing**
CSC13003

State Transition Testing

---

## Slide 2 — State Transition Testing (Overview)

- Helpful to **test different system transitions**
- General approach
  - Describe the System Under Test as a "finite state machine" or "state transition diagram"
  - Derive test cases based on **State Transition Coverage**
  - Create State Table based on the diagram to evaluate **Invalid Transitions**

---

## Slide 3 — State Transition Diagram

Key elements of a state transition diagram:

- **State** — A state is a distinguishable situation of a system. A system can only be in one state at any point in time. A system can transition from one state to another.
- **Transition** — A transition is a change from one state to another. A transition may also be to the same state (a "transition-to-self").
- **Event** — An event is an occurrence inside or outside a system that can result in a transition.
- **Action** — An action is behavior executed at a particular point in the system. It can also be a string of actions.

---

## Slide 4 — State Diagram for Login

The login system has 6 states: **Start**, **1st Try**, **2nd Try**, **3rd Try**, **Access Granted**, and **Account Blocked**.

**Transitions:**

- Start → 1st Try (automatically on entering the login flow)
- 1st Try → 2nd Try (Incorrect PIN)
- 1st Try → Access Granted (Correct PIN)
- 2nd Try → 3rd Try (Incorrect PIN)
- 2nd Try → Access Granted (Correct PIN)
- 3rd Try → Account Blocked (Incorrect PIN)
- 3rd Try → Access Granted (Correct PIN)

**Transition Table:**

| State | Correct PIN | Incorrect PIN |
|---|---|---|
| S1. Start | — | — |
| S2. 1st Try | S5 (Access Granted) | S3 (2nd Try) |
| S3. 2nd Try | S5 (Access Granted) | S4 (3rd Try) |
| S4. 3rd Try | S5 (Access Granted) | S6 (Account Blocked) |
| S5. Access Granted | — | — |
| S6. Account Blocked | — | — |

> Ref: <https://www.guru99.com/state-transition-testing.html>

---

## Slide 5 — State Transition Table (Login Example)

The state transition table lists the next state for each state/event combination. Cells marked `—` indicate no valid transition (terminal states).

| State | Correct PIN | Incorrect PIN |
|---|---|---|
| S1. Start | — | — |
| S2. 1st Try | S5 | S2 |
| S3. 2nd Try | S5 | S4 |
| S4. 3rd Try | S5 | S6 |
| S5. Access Granted | — | — |
| S6. Account Blocked | — | — |

> Note: In the original table, S2 (1st Try) on Incorrect PIN loops back to S2 (prompts again), whereas S3 (2nd Try) on Incorrect PIN advances to S4 (3rd Try), and S4 (3rd Try) on Incorrect PIN goes to S6 (Account Blocked).

---

## Slide 6 — State Transition Coverage

- State Transition Coverage % = Number of identified states or transitions tested / The total number of states or transitions in the test object.
- → **All States Coverage**
- → **All Transitions Coverage**

---

## Slide 7 — State Transition Coverage (Login Diagram)

This slide shows the same Login state diagram used to illustrate how to measure coverage.

**Transitions to cover for All Transitions Coverage (7 valid transitions):**

1. 1st Try → Access Granted (Correct PIN)
2. 1st Try → 2nd Try (Incorrect PIN)
3. 2nd Try → Access Granted (Correct PIN)
4. 2nd Try → 3rd Try (Incorrect PIN)
5. 3rd Try → Access Granted (Correct PIN)
6. 3rd Try → Account Blocked (Incorrect PIN)
7. Start → 1st Try

| State | Correct PIN | Incorrect PIN |
|---|---|---|
| S1. Start | — | — |
| S2. 1st Try | S5 (Access Granted) | S3 (2nd Try) |
| S3. 2nd Try | S5 (Access Granted) | S4 (3rd Try) |
| S4. 3rd Try | S5 (Access Granted) | S6 (Account Blocked) |
| S5. Access Granted | — | — |
| S6. Account Blocked | — | — |

> Ref: <https://www.guru99.com/state-transition-testing.html>

---

## Slide 8 — State Diagram for TV

The TV system has 3 states: **TV Off (S1)**, **TV Stand By (S2)**, and **TV Play (S3)**.

**Transitions:**

- S1 (TV Off) → S2 (TV Stand By): event **Power On**
- S2 (TV Stand By) → S1 (TV Off): event **Power Off**
- S2 (TV Stand By) → S3 (TV Play): event **RC On**
- S3 (TV Play) → S2 (TV Stand By): event **RC Off**
- S3 (TV Play) → S1 (TV Off): event **Power Off**

**Transition Table:**

| State | Power On | Power Off | RC On | RC Off |
|---|---|---|---|---|
| S1. TV Off | S2 | — | — | — |
| S2. TV Stand By | — | S1 | S3 | — |
| S3. TV Play | — | S1 | — | S2 |

---

## Slide 9 — N-Switch Testing

- N-switch tests are state transition tests in which the test cases are designed to execute all **valid sequences of N+1 transitions**.
- → **0-switch**: every single (0+1=1) transition is tested
- → **1-switch**: all combinations of two (1+1=2) consecutive transitions are tested

---

## Slide 10 — 0-switch Coverage Test Cases

0-switch coverage requires one test case per valid transition (5 transitions for the TV system).

| | TC1 | TC2 | TC3 | TC4 | TC5 |
|---|---|---|---|---|---|
| **Start state** | TV Off (S1) | TV Stand By (S2) | TV Stand By (S2) | TV Play (S3) | TV Play (S3) |
| **Input (event)** | Power On | Power Off | RC On | Power Off | RC Off |
| **Output (action)** | TV is stand by | TV is (turned) off | TV is playing something | TV is (turned) off | TV is stand by |
| **Finish state** | TV Stand By (S2) | TV Off (S1) | TV Play (S3) | TV Off (S1) | TV Stand By (S2) |

---

## Slide 11 — Quizzes: Battery Charger Coverage

**Question:** Given the following state model of a battery charger software, which of the following sequences of transitions provides the **highest level** of transition coverage for the model?

**State model — Battery Charger (6 states):** OFF, WAIT, TRICKLE, CHARGE, HIGH, LOW

| State | To OFF | To WAIT | To TRICKLE | To CHARGE | To HIGH | To LOW |
|---|---|---|---|---|---|---|
| OFF | — | Y | — | — | — | — |
| WAIT | Y | — | Y | — | — | — |
| TRICKLE | — | Y | — | Y | — | — |
| CHARGE | — | — | Y | — | Y | Y |
| HIGH | — | — | — | Y | — | — |
| LOW | — | — | — | Y | — | — |

**Options:**

- A. OFF → WAIT → OFF → WAIT → TRICKLE → CHARGE → HIGH → CHARGE → LOW
- B. WAIT → TRICKLE → WAIT → OFF → WAIT → TRICKLE → CHARGE → LOW → CHARGE
- C. HIGH → CHARGE → LOW → CHARGE → TRICKLE → WAIT → TRICKLE → WAIT → TRICKLE
- D. WAIT → TRICKLE → CHARGE → HIGH → CHARGE → TRICKLE → WAIT → OFF → WAIT

> Ref: <https://www.testing.vn/state-transition/>

---

## Slide 12 — Quizzes: Invalid Test Case for a Switch

**Question:** Based on the given State Transition Diagram of a switch, which of the following test cases is invalid?

**State model — Switch (3 states):** S1: OFF · S2: ON · S3: FAULT

| Prior State | Next State | Valid? |
|---|---|---|
| OFF (S1) | ON (S2) | Y |
| ON (S2) | OFF (S1) | Y |
| FAULT (S3) | ON (S2) | N (no such transition) |
| ON (S2) | FAULT (S3) | Y |

**Options:** 1. OFF to ON · 2. ON to OFF · 3. FAULT to ON · 4. ON to FAULT

---

## Slide 13 — Quizzes: 0-Switch Coverage for State Chain

**Question:** Given the following state transition, which series of state transitions provides 100% 0-switch coverage?

**State model:** SS → S1 (A) · S1 → S2 (B) · S2 → S3 (C) · S3 → ES (D) · S2 → S1 (E) · S3 → S3 (F)

| Transition | From | To |
|---|---|---|
| A | SS | S1 |
| B | S1 | S2 |
| C | S2 | S3 |
| D | S3 | ES |
| E | S2 | S1 |
| F | S3 | S3 |

**Options:** 1. A,B,E,B,C,F,D · 2. A,B,E,B,C,F,F · 3. A,B,E,B,C,D · 4. A,B,C,F,F,D

---

## Slide 14 — State Diagram for a Bank Account

The bank account system has 4 states: **(1) Initial**, **(2) Account In Credit**, **(3) Account Overdrawn**, **(4) Closed**.

| State | Open Account | Deposit (≥0) | Deposit (<0) | Withdraw (≤bal) | Withdraw (>bal) | Close (bal=0) | Write Off |
|---|---|---|---|---|---|---|---|
| (1) Initial | (2) | — | — | — | — | — | — |
| (2) In Credit | — | (2) | — | (2) | (3) | (4) | — |
| (3) Overdrawn | — | (2) | (3) | — | — | — | (4) |
| (4) Closed | — | — | — | — | — | — | — |

---

## Slide 15 — State Transition Table (Overview)

- List **all possible state-transition combinations**, not just the valid ones
  - Advantage: Help detect defects in implementation that enable invalid paths
  - Disadvantage: state tables become very large very quickly

---

## Slide 16 — State Table for Bank Account

| Prior State | New State | Valid Transition | Comment |
|---|---|---|---|
| 1 | 1 | N | |
| 1 | 2 | Y | New account |
| 1 | 3 | N | Possible negative test case |
| 1 | 4 | N | |
| 2 | 1 | N | |
| 2 | 2 | Y | Deposit and withdraw [≤ balance] |
| 2 | 3 | Y | Withdraw [> balance] |
| 2 | 4 | Y | Closed account [balance = 0] |
| 3 | 1 | N | |
| 3 | 2 | Y | Deposit [balance + D ≥ 0] |
| 3 | 3 | Y | Deposit [balance + D < 0] |
| 3 | 4 | Y | Write Off Bad Debt |
| 4 | 1 | N | |
| 4 | 2 | N | Possible negative test case |
| 4 | 3 | N | Possible negative test case |
| 4 | 4 | N | Possible negative test case |

---

## Slide 17 — Test Cases from State Table (TC1–TC5)

| #TC | Precondition (State) | Condition (Event) | Expected Result | Note |
|---|---|---|---|---|
| TC1 | No account | Open account | Account created with balance ≥ 0 | S1 → S2 |
| TC2 | No account | Withdraw | Message: Account does not exist | S1 → S3 |
| TC3 | No account | Close account | Message: Account does not exist | S1 → S4 |
| TC4 | Account with balance ≥ 0 | Deposit D | Balance = balance + D | S2 → S2 |
| TC5 | Account with balance ≥ 0 | Withdraw W ≤ balance | Balance = balance – W ≥ 0 | S2 → S2 |

> TC2 and TC3 are negative test cases targeting invalid transitions.

---

## Slide 18 — Test Cases from State Table (TC6–TC10)

| #TC | Precondition | Condition | Expected Result | Note |
|---|---|---|---|---|
| TC6 | Balance ≥ 0 | Withdraw W > balance | Balance = (balance – W) < 0 | S2 → S3 |
| TC7 | Balance ≥ 0 | Close account | Account closed, Balance = 0 | S2 → S4 |
| TC8 | Balance < 0 | Deposit D + Balance ≥ 0 | Balance = Balance + D ≥ 0 | S3 → S2 |
| TC9 | Balance < 0 | Deposit D + Balance < 0 | Balance = Balance + D < 0 | S3 → S3 |
| TC10 | Balance < 0 | Write bad debit | Account in bad debit | S3 → S4 |

---

## Slide 19 — Test Cases from State Table (TC11–TC17)

| #TC | Precondition | Condition | Expected Result | Note |
|---|---|---|---|---|
| TC11 | Account in bad debit | Deposit D + Balance ≥ 0 | Balance = Balance + D ≥ 0 | S4 → S2 |
| TC12 | Account in bad debit | Deposit D + Balance < 0 | Balance = Balance + D < 0 | S4 → S3 |
| TC13 | Account closed | Deposit | Message: Account already closed | S4 → S2 |
| TC14 | Account in bad debit | Withdraw | Message: Account in bad debit | S4 → S3 |
| TC15 | Account closed | Withdraw | Message: Account already closed | S4 → S3 |
| TC16 | Account in bad debit | Close | Message: Account in bad debit | S4 → S4 |
| TC17 | Account closed | Close | Message: Account already closed | S4 → S4 |

> TC11–TC17 are negative test cases for invalid transitions out of state S4.

---

## Slide 20 — Q&A (State Transition Testing)

Questions and Answers session.

---

<!-- ============================================================ -->
<!-- PART 2: Use Case Testing (S06.2 — 10 slides)                 -->
<!-- ============================================================ -->

## Slide 21 — Title: Use Case Testing

Software Testing — CSC13003

**Use Case Testing**

---

## Slide 22 — What is Use Case Testing?

Use case testing is a **black-box test design technique** in which test cases are designed to execute **use-case scenarios**.

---

## Slide 23 — Use Case (Definition)

A list of **actions or event steps** defining interactions between an **actor** and a **system** to achieve a **goal**.

---

## Slide 24 — Use Case Characteristics

- Only one goal
- A single starting point
- A single ending point
- Multiple paths for getting from start to finish

---

## Slide 25 — Use Case Structure

**Use case diagram:** A UML use case diagram showing an actor connected to a use case ellipse (e.g., "Registered User" → "Edit an article").

**Use case specification:**

- Description
- Preconditions
- Postconditions
- Flows of events
  - Basic flow
  - Alternate flows

---

## Slide 26 — Basic Flow and Alternate Flows

**Basic flow** — Covers what "normally" happens when the use case is performed.

**Alternate flows** — Covers behavior of an optional or exceptional character relative to normal behavior.

A flow diagram: Basic Flow runs from "Start Use Case" to "End Use Case". Alternate Flows 1–4 branch off and rejoin at various points (some terminate at separate "End Use Case" nodes).

---

## Slide 27 — Use Case Example: Login Use Case

| Flow of event | Step | Description |
|---|---|---|
| Main flow | 1 | Enter username & password |
| Main flow | 2 | Validate password |
| Main flow | 3 | Allow account access |
| Alternate flows | 2a | Password not valid — Display message and ask for re-try 4 times |
| Alternate flows | 2b | Password not valid 4 times — Close application |

---

## Slide 28 — Use-Case Scenario (Definition)

- A complete "**path**" through the use case
- Beginning with the **basic flow**
- Combining the **basic flow** with **alternate flows**

---

## Slide 29 — Use-Case Scenario: Example

| ID | Scenario |
|---|---|
| S1 | Basic flow |
| S2 | Basic flow + Alternate flow 1 |
| S3 | Basic flow + Alternate flow 1 + Alternate flow 2 |
| S4 | Basic flow + Alternate flow 3 |
| S5 | Basic flow + Alternate flow 3 + Alternate flow 1 |
| S6 | Basic flow + Alternate flow 3 + Alternate flow 1 + Alternate flow 2 |
| S7 | Basic flow + Alternate flow 3 + Alternate flow 4 |
| S8 | Basic flow + Alternate flow 4 |

---

## Slide 30 — Q&A (Use Case Testing)

End of lecture — Q&A session.
