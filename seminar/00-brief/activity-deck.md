# T10 — Seminar In-Class Activity Deck

**Mutation Testing & Test Effectiveness**
**2026 AI-First · CS423/CSC15003**
**FIT @ HCMUS · Department of Software Engineering**

> Coverage lies. Mutation testing tells you if your tests can actually catch bugs.

**ACTIVITY: Kill the Mutant**
Duration: ~25 minutes · For audience teams (3–4 SV)

---

## Slide 2 — Why this matters

Code coverage proves test execution; mutation testing proves test sensitivity. You introduce small code defects (mutants) — change `>` to `<`, remove a `return`, flip a Boolean — then ask: does any test fail? The mutation score (`killed / total`) is the metric.

This topic puts EShop's own test suite under the microscope using **PIT** (Java), **Stryker** (JS/TS), or **mutmut** (Python) — and explores AI-assisted assertion generation and equivalent-mutant detection.

### Ground Rules for Today's Activity

- Work in your team of 3–4. One designated note-taker per team.
- Read the worksheet first; ask the facilitator before guessing.
- AI tools are allowed — but every output must be cross-checked manually.
- At the end, each team submits ONE minute-paper for audience attendance credit.

---

## Slide 3 — What you will leave with

### Learning outcomes

- Set up Stryker on the EShop Node.js backend; produce a baseline mutation report.
- Identify three surviving mutants; explain why each survived.
- Add tests that kill those mutants without inflating coverage artificially.

### Expected takeaways

- ✓ A mutation score of 70–80% is a strong target; 100% is usually unrealistic.
- ✓ Equivalent mutants are unavoidable noise — manual review is still required.
- ✓ AI assertion generators are useful as drafts; validation against the mutation report is mandatory.

---

## Slide 4 — Tool snapshot: Traditional vs AI-augmented

### Traditional

| Tool | Description |
|---|---|
| **Stryker** | Mutation testing for JS/TS/C#/Scala. JSON + HTML reports. |
| **PIT (PITest)** | Java/Kotlin standard; integrates with Maven, Gradle, JUnit. |
| **mutmut / Cosmic Ray** | Python mutation testing. |
| **mull** | C/C++ via LLVM. |

### AI-augmented

| Tool | Description |
|---|---|
| **DiffBlue Cover** | AI-generated JUnit tests targeting un-killed mutants. |
| **ChatGPT / Claude for assertion synthesis** | Given a function + missing assertion, propose extra asserts; verify against mutation report. |
| **Pynguin + LLM helpers** | Combine search-based test generation with LLM assertion repair. |

---

## Slide 5 — Activity: Kill the Mutant

Audience teams look at five surviving mutants and write one assertion each, then race to kill the most.

### What you will need on your laptop

- EShop running locally (frontend + backend) OR ability to connect to the lecturer's stage env.
- Your favourite text editor + a terminal.
- An AI tool of your choice (ChatGPT/Claude/Gemini/Copilot/Cursor — free tier OK).
- The `Activity_Worksheet.md` provided 3 days before this seminar.

---

## Slide 6 — Activity steps

**Keep tight to the clock.**

| Time | Step |
|---|---|
| 0:00–0:03 | Facilitator shows 5 mutant diffs from EShop checkout module. |
| 0:03–0:13 | Each team writes 5 candidate assertions (in Jest or pytest pseudocode). |
| 0:13–0:18 | Pair teams swap and review — would these actually kill the mutants? |
| 0:18–0:22 | Facilitator runs the assertions on a prepared sandbox; tally kills. |
| 0:22–0:25 | Winning team explains the assertion design. |

---

## Slide 7 — Debrief prompts

**Discuss in 5 minutes.**

| # | Prompt |
|---|---|
| Q1 | What surprised you the most? |
| Q2 | Where did the AI tool save you time vs add work? |
| Q3 | Identify ONE failure mode you would prevent next time. |
| Q4 | If you had 1 more hour, what would you investigate next? |

> Each team writes ONE answer per prompt on the minute paper (handed in at end of class).

---

## Slide 8 — Takeaways + Further reading

### 3 things to remember

- ✓ A mutation score of 70–80% is a strong target; 100% is usually unrealistic.
- ✓ Equivalent mutants are unavoidable noise — manual review is still required.
- ✓ AI assertion generators are useful as drafts; validation against the mutation report is mandatory.

### Further reading

- Jia & Harman — *'An Analysis and Survey of Mutation Testing'* (2011).
- Stryker.NET / Stryker JS — *'Getting started'* guides.
- GoogleResearch — *'State of Mutation Testing at Google'* (2018).

---

> Submit minute-paper now · Thank you!
