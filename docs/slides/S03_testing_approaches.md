---
title: "S03 — Testing Approaches"
source: "Slides/S03_Testing Approaches.pdf"
course: CSC13003 Software Testing
slides: 11
tags: [software-testing, slides, testing-approaches, black-box, white-box]
---

## Slide 1 — Title Slide

**Software Testing**
CSC13003

**Software Testing Approaches**

---

## Slide 2 — Exercise 1

- The program's specification
  - This program is designed to add 2 numbers, which you will enter
  - Each number should be one or two digits

*Figure 1.2 — How the screen looks after the first test:* A terminal screen showing two prompts (`? 2`, `? 3`) with result `5`, and a cursor at the bottom. Caption: "The cursor (beside the question mark at the bottom of the screen) shows you where the next number will be displayed."

---

## Slide 3 — Possible Test Cases

- Valid Cases: 199 x 199 = 39,601
  - -99 → -1
  - 0 → 99
- Invalid Cases: INFINITE
  - <= -100
  - >= 100
  - Not a number

---

## Slide 4 — The Problem

**very large or infinite number of test scenarios**

**+**

**finite amount of time**

**=**

**impossible to test everything**

---

## Slide 5 — The Solution

**Software testing strategies and methods (techniques) exist to**

**reduce the number of tests to be run**
**whilst still providing sufficient coverage**
**of the system under test**

---

## Slide 6 — Testing Approaches

Three testing approaches illustrated as boxes of different shades:

- **Black-Box Testing** — opaque box (internals hidden)
- **Gray-Box Testing** — semi-transparent box (partial knowledge)
- **White-Box Testing** — transparent/outline box (internals fully visible)

---

## Slide 7 — Black Box Testing Approach

Diagram: Input → **Black Box** → Output

The tester provides inputs and observes outputs without any knowledge of the internal implementation. The black box represents the system under test whose internals are unknown.

---

## Slide 8 — White Box Testing Approach

Diagram: **Test Case Input** → [Application Code with internal control-flow graph showing nodes and edges] → **Test Case Output**

The tester has full visibility into the application's source code and internal logic. Tests are designed based on control flow, branches, and paths through the code.

---

## Slide 9 — The Two Basic Testing Strategies

| Test Strategy | Tester's View | Knowledge Sources | Methods |
|---|---|---|---|
| Black box | Input/Output only (opaque box) | Requirements document, Specifications, Domain knowledge, Defect analysis data | Equivalence class partitioning, Boundary value analysis, State transition testing, Cause and effect graphing, Error guessing |
| White box | Internal code structure visible (transparent box with control-flow graph) | High-level design, Detailed design, Control flow graphs, Cyclomatic complexity | Statement testing, Branch testing, Path testing, Data flow testing, Mutation testing, Loop testing |

---

## Slide 10 — Grey Box Testing

Grey Box Testing = Black Box + White Box

Diagram: A solid black cube (Black Box) **+** a white cube containing a flowchart (White Box) **=** a grey cube (Gray Box)

Grey-box testing combines external behavioural testing with partial knowledge of the internal structure, allowing the tester to design more informed test cases while still testing as a user.

---

## Slide 11 — Black – Grey – White Box Testing

Comparison of the three approaches shown as three side-by-side boxes:

| | Black Box | Grey Box | White Box |
|---|---|---|---|
| Internal knowledge | Internals Not Known | Internals Relevant to Testing Known | Internals Fully Known |
| Tester perspective | Testing As User | Testing As User with Access to Internals | Testing As Developer |
