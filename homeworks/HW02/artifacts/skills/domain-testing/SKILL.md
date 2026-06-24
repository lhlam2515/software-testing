---
name: domain-testing
description: >
  Apply the complete Domain Testing + Boundary Value Analysis (BVA) test design
  framework to any functional requirement of any software system, following a
  4-step process: (1) Identify input/output variables and constraints, (2) Define
  equivalence classes, (3) Select minimum optimized test cases with Error Isolation,
  (4) Enhance with BVA at numeric boundaries. After each step, waits for user
  approval via AskUserQuestion — incorporates feedback and loops until accepted.
  Writes Steps 1–3 to domain-testing.md and Step 4 to bva.md in the feature's
  output folder.

  Trigger whenever user says: "apply domain testing", "design test cases",
  "equivalence partitioning", "EP analysis", "BVA", "boundary value analysis",
  "test design for [feature]", "analyze [feature] for testing", or any request
  to systematically design test cases for a specific functional requirement.
  Also trigger when the user names a feature/requirement alongside words like
  "test", "cases", "analyze", "technique", or "testing".
---

# Domain Testing + BVA — 4-Step Test Design Skill

**Methodology:** Domain Testing (Equivalence Partitioning) + Boundary Value Analysis
**Theory reference:** Read the team's test design reference doc if you need to review
the 4-step framework, EC guidelines, or the BVA model before proceeding.

---

## Phase 0 — Setup

Before starting, collect three things:

1. **Feature to analyze:** If not already known, ask the user which feature/requirement
   to analyze. The user should provide a spec section, ticket, or written description.

2. **Read the feature spec:** Always read the full requirement specification for the
   target feature. If the spec references other features for constraints (e.g., shared
   password rules, form validation policies), read those cross-references too. Don't
   skip this — constraints in cross-referenced specs are test targets, not background noise.

3. **Locate output folder:** Check the agreed output directory for an existing folder
   named after the feature. If it doesn't exist, create it. If `domain-testing.md` or
   `bva.md` already exist, ask the user: "Files already exist — overwrite completely or
   update existing content?" before writing.

Announce which feature you are analyzing and which spec sections you have read.

---

## STEP 1 — Identify Variables & Constraints

**Goal:** Extract every testable variable from the requirement. Miss one here and the
whole EC table has a hole.

**Classify each variable as:**
- `Input` — user-entered or caller-provided
- `System State` — server-side state that determines system behavior (counters, timers, flags)
- `Output` — what the system returns or displays

**For each variable, capture:**
- Its type and resolution (e.g., integer, string, boolean; 1 unit)
- Valid domain and boundaries (be specific: `[0, 2]`, `30s`, `user@domain.com`)
- Dependencies and constraints (including cross-feature constraints)
- Expected error/behavior when the constraint is violated

**Flag Implicit Gaps** — places where the spec specifies one boundary but is silent on
the other, or where behavior is ambiguous. These are real test targets: undefined
behavior is a defect risk.

**Present as a Markdown table:**
```
| Variable | Type | Description | Valid Domain / Boundaries | Dependencies & Constraints | Expected Error / Behavior |
```

If there are Implicit Gaps, add a separate `### Implicit Gaps` table after the main table.

**→ Use AskUserQuestion (see Protocol section) before proceeding to Step 2.**

---

## STEP 2 — Define Equivalence Classes

**Goal:** Partition every variable's domain into classes where the system behaves
identically. Testing one member of a class is sufficient — testing more is redundant.

**Apply these four rules:**

| Rule | When to Apply | Classes Created |
| :--- | :--- | :--- |
| **Range Rule** | Input is a numeric range [Min, Max] | 1 valid `[Min, Max]` + 2 invalid (`< Min`, `> Max`) |
| **Set Rule** | Input is a discrete set with distinct handling per value | 1 valid class per value + 1 invalid for "none of the above" |
| **Must-Be Rule** | A condition must be true for processing to succeed | 1 valid (condition True) + 1 invalid (condition False) |
| **Splitting Rule** | Elements within a class are handled differently | Split into finer subclasses — don't lump what the system distinguishes |

**Assign unique IDs:** EC01, EC02, EC03, … (sequential across all groups, never reuse).

**Group by variable** in the output. Each EC must have a concrete expected output so
that test case design in Step 3 has something to verify.

**Present as a Markdown table, grouped by variable:**
```
| Variable / Condition | EC ID | Description | Type (Valid/Invalid) | Expected System Output |
```

**Output ECs matter too** — partition what the system returns (token vs no-token, generic
error vs specific error, error position) as separate EC groups. These become the "verified
absent" checks in Step 3.

**→ Use AskUserQuestion before proceeding to Step 3.**

---

## STEP 3 — Minimum Test Cases (EC Coverage)

**Goal:** Cover 100% of ECs with the smallest possible test suite.

**Two rules, one firm:**

1. **Happy Path (Valid ECs):** Combine as many valid ECs as possible into a single test
   case. Use nominal midpoint values as representatives. Keep combining until all valid
   ECs are covered.

2. **Error Isolation (Invalid ECs):** Each negative test case contains **exactly one**
   invalid EC. All other variables sit at nominal valid values. This is non-negotiable —
   multiple invalid ECs in one test create "Error Masking" where one failure hides another,
   and you learn nothing.

**Every TC must be executable.** Pre-conditions must specify the system state precisely
(not "the account exists" but "account `user@example.com` exists, `failed_login_count = 1`").
Input values must be literal. Verification points must name what to check and how.

**Format — each TC is its own vertical table:**

```markdown
### TC-XX — [Short descriptive title]

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-XX |
| **Test Case Name** | [What behavior this test exercises] |
| **ECs Covered** | EC01, EC05, EC08, ... |
| **ECs Verified Absent** | EC14, EC19, ... (invalid output ECs ruled out by observing their valid counterparts) |
| **Pre-conditions** | [Exact system state — account, counter value, lock status, DB state] |
| **Input — `field_name`** | `value` |
| **Input — `field_name`** | `value` |
| **Steps** | 1. [step] · 2. [step] · 3. [step] |
| **Expected Result** | ✅/❌ [what should happen — be specific] |
| **Verification Points** | 1. [what to check and how] · 2. ... |
| **Status** | ⬜ Not yet executed |
```

After all TCs, add an **EC Coverage Matrix** — a Markdown table mapping each EC ID to the
TC that covers it, with a "Mechanism" column (Direct trigger / Nominal valid input /
Observed / Verified absent).

**→ Use AskUserQuestion before writing files.**
**→ When accepted: Write Steps 1–3 content to `domain-testing.md`** (see File Format below).

---

## STEP 4 — Boundary Value Analysis (BVA)

**Goal:** Add high-value test cases that catch off-by-one defects at the exact turning
points. These are additive — don't duplicate Step 3's midpoint cases.

**Only target numeric/range variables with a defined boundary.** String format conditions
(email pattern, etc.) are nominal — BVA doesn't apply. Timer values, counters, quantities,
and amounts are BVA targets.

**For each boundary, apply the 3-point model:**
- `UB-1`: one unit before the upper boundary (should be in the valid/active state)
- `UB`: the upper boundary itself (the turning point — this is where `>` vs `>=` is exposed)
- `UB+1`: one unit past the boundary (should be in the invalid/expired state)
- Mirror for lower boundary: `LB-1`, `LB`, `LB+1`

**For each BVA test case, name the specific defect it targets.** "Off-by-one" is too
vague. Write the actual wrong operator: "Catches bug where system uses `count > 3` instead
of `count >= 3`, meaning lock triggers on the 4th fail instead of the 3rd."

**Start with an ASCII Boundary Map** for each target variable before the TCs. It gives
the reader (and you) an immediate mental model of what's being tested.

**Format — each BVA TC is its own vertical table:**

```markdown
### TC-BVA-XX — [Short title]

| Field | Content |
| :--- | :--- |
| **TC ID** | TC-BVA-XX |
| **Test Case Name** | [What boundary moment this captures] |
| **Target Variable** | `variable_name` |
| **Boundary Point Type** | [UB / UB-1 / UB+1 / ON Point / OFF Point / Transition] |
| **Target Variable State** | [Exact value at boundary — e.g., `count = 3`, `time_since_lock = 30s`] |
| **Pre-conditions** | [How to set up this exact state] |
| **Input — `field_name`** | `value` |
| **Input — `field_name`** | `value` |
| **Defect Target** | [Specific wrong operator this test exposes — be precise] |
| **Expected Result** | ✅/❌ [what should happen at this exact boundary] |
| **Verification Points** | [What to observe — especially the state transition] |
| **Status** | ⬜ Not yet executed |
```

End with a **Defect Coverage Matrix** and a **Setup Protocol** for any BVA case requiring
precise timing or state manipulation (e.g., database direct manipulation to set timestamps).

**→ Use AskUserQuestion before writing files.**
**→ When accepted: Write Step 4 content to `bva.md`** (see File Format below).

---

## AskUserQuestion Protocol

After presenting each step's output, call `AskUserQuestion` with:

```
Question: "Is the output of [Step N — step name] complete and correct?"
Options:
  - label: "✅ Accept — proceed to [next step or write file]"
  - label: "✏️ Needs revision"
    description: "Enter feedback in the 'Other' box — I will revise and ask again"
```

**If user selects "Needs revision" or provides "Other" text:**
- Read their feedback carefully
- Revise the output to address the feedback precisely
- Re-present the revised section
- Ask again with `AskUserQuestion`
- Repeat until accepted

**If user selects "Accept":**
- Steps 1–3: proceed to next step (write files only after Step 3 is accepted)
- Step 3 accepted → write `domain-testing.md`
- Step 4 accepted → write `bva.md`

---

## File Format

### `domain-testing.md`

```
# {FEATURE-ID} — Domain Testing: {Feature Name}

**Feature:** {FEATURE-ID} — {Feature Name}
**Technique:** Domain Testing (Equivalence Partitioning)
**Spec source:** [path or section reference]
**Author:** [name — ID]

---

## 1. Feature Overview
[2–3 sentences describing the feature and any cross-feature constraints]

---

## 2. Step 1 — Variables & Constraints
[Step 1 table]

### Implicit Gaps
[Gap table — omit section if no gaps]

---

## 3. Step 2 — Equivalence Classes
[EC tables grouped by variable, all groups]

---

## 4. Step 3 — Minimum Test Cases
[One vertical table per TC]

---

## 5. EC Coverage Matrix
[EC → TC mapping table with Mechanism column]
```

### `bva.md`

```
# {FEATURE-ID} — Boundary Value Analysis: {Feature Name}

**Feature:** {FEATURE-ID} — {Feature Name}
**Technique:** Boundary Value Analysis (BVA) — additive to Domain Testing
**Spec source:** [path or section reference]
**Author:** [name — ID]

---

## 1. Overview
[Why BVA adds value beyond EP; which variables are targeted and why]

---

## 2. Target Variables & Boundary Map
[ASCII diagram for each target variable + table of BVA points]

---

## 3. BVA Test Cases
[One vertical table per TC-BVA]

---

## 4. Defect Coverage Matrix
[TC-BVA → specific defect/operator table]

---

## 5. Setup Protocol (if needed)
[Instructions for precision timing, DB manipulation, or state setup]

---

## 6. Test Suite Summary
[Summary table: EP TCs + BVA TCs = total]
```

---

## Quality Checklist (self-verify before each AskUserQuestion)

- [ ] Every variable in the feature spec has at least one EC — nothing was missed
- [ ] Every invalid EC is isolated in its own TC (no Error Masking)
- [ ] Every TC has concrete, literal input values (not "some valid email")
- [ ] Pre-conditions are precise enough to reproduce without guessing
- [ ] Verification points say HOW to check, not just WHAT to check
- [ ] BVA cases name a specific wrong operator, not just "off-by-one"
- [ ] Implicit Gaps are flagged with their risk — not silently assumed away
- [ ] Output ECs are partitioned and tracked via "Verified Absent" in relevant TCs
