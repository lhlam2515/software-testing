---
name: domain-testing
description: >
  Apply the complete Domain Testing + Boundary Value Analysis (BVA) test design
  framework to any Functional Requirement (FR) of the EShop SUT, following the
  4-step process from S04_domain_testing.md: (1) Identify input/output variables
  and constraints, (2) Define equivalence classes, (3) Select minimum optimized
  test cases with Error Isolation, (4) Enhance with BVA at numeric boundaries.
  After each step, waits for user approval via AskUserQuestion — incorporates
  feedback and loops until accepted. Writes Steps 1–3 to domain-testing.md and
  Step 4 to bva.md in the FR's test artifacts folder.

  Trigger whenever user says: "apply domain testing", "thiết kế test case",
  "phân tích FR", "/domain-testing FR-XX", "domain testing on FR", "BVA cho FR",
  "equivalence partitioning", "EP cho FR", "test design FR", or any request to
  systematically design test cases for a specific EShop functional requirement.
  Also trigger when user provides a FR number alongside words like "test", "case",
  "phân tích", "kỹ thuật", or "kiểm thử".
---

# Domain Testing + BVA — 4-Step Test Design Skill

**Course:** CSC13003 Software Testing / EShop SUT
**Theory reference:** `docs/slides/S04_domain_testing.md` — read this if you need to review
the 4-step framework, EC guidelines, or the 9-point BVA model before proceeding.

---

## Phase 0 — Setup

Before starting, collect three things:

1. **FR to analyze:** If not already known, ask the user which FR to analyze (FR-01 through FR-20).

2. **Read the SRS:** Always read `docs/eshop-sut/srs.md` for the full FR specification. If the FR
   references another FR for constraints (e.g., FR-02 references FR-01 for password format, FR-22
   for form rules), read those too. Don't skip this — constraints in cross-referenced FRs are test
   targets, not background noise.

3. **Locate output folder:** Check `homeworks/HW02/artifacts/tests/` for an existing folder named
   `FR-XX-<slug>/`. If it doesn't exist, create it. If `domain-testing.md` or `bva.md` already
   exist, ask the user: "Files đã tồn tại — ghi đè hoàn toàn hay cập nhật?" before writing.

Announce which FR you are analyzing and which SRS sections you've read.

---

## STEP 1 — Xác định Biến & Ràng buộc

**Goal:** Extract every testable variable from the FR. Miss one here and the whole EC table has a hole.

**Classify each variable as:**
- `Input` — user-entered or caller-provided
- `System State` — server-side state that determines system behavior (counters, timers, flags)
- `Output` — what the system returns or displays

**For each variable, capture:**
- Its type and resolution (e.g., integer, string, boolean; 1 unit)
- Valid domain and boundaries (be specific: `[0, 2]`, `30s`, `user@domain.com`)
- Dependencies and constraints (including cross-FR constraints)
- Expected error/behavior when the constraint is violated

**Flag Implicit Gaps** — places where the SRS specifies one boundary but is silent on the other,
or where behavior is ambiguous (e.g., "what happens to the counter after lockout expires?").
These are real test targets: undefined behavior is a defect risk.

**Present as a Markdown table:**
```
| Variable | Type | Mô tả | Valid Domain / Boundaries | Dependencies & Constraints | Expected Error / Behavior |
```

If there are Implicit Gaps, add a separate `### Implicit Gaps` table after the main table.

**→ Use AskUserQuestion (see Protocol section) before proceeding to Step 2.**

---

## STEP 2 — Phân hoạch Equivalence Classes

**Goal:** Partition every variable's domain into classes where the system behaves identically.
Testing one member of a class is sufficient — testing more is redundant.

**Apply these four rules from S04:**

| Rule | When to Apply | Classes Created |
| :--- | :--- | :--- |
| **Range Rule** | Input is a numeric range [Min, Max] | 1 valid `[Min, Max]` + 2 invalid (`< Min`, `> Max`) |
| **Set Rule** | Input is a discrete set with distinct handling per value | 1 valid class per value + 1 invalid for "none of the above" |
| **Must-Be Rule** | A condition must be true for processing to succeed | 1 valid (condition True) + 1 invalid (condition False) |
| **Splitting Rule** | Elements within a class are handled differently | Split into finer subclasses — don't lump what the system distinguishes |

**Assign unique IDs:** EC01, EC02, EC03, … (sequential across all groups, never reuse).

**Group by variable** in the output. Each EC must have a concrete expected output so that
test case design in Step 3 has something to verify.

**Present as a Markdown table, grouped by variable:**
```
| Variable / Condition | EC ID | Mô tả | Loại (Valid/Invalid) | Expected System Output |
```

**Output ECs matter too** — partition what the system returns (JWT vs no-JWT, generic error vs
specific error, error position) as separate EC groups. These become the "verified absent" checks
in Step 3.

**→ Use AskUserQuestion before proceeding to Step 3.**

---

## STEP 3 — Minimum Test Cases (EC Coverage)

**Goal:** Cover 100% of ECs with the smallest possible test suite.

**Two rules, one firm:**

1. **Happy Path (Valid ECs):** Combine as many valid ECs as possible into a single test case.
   Use nominal midpoint values as representatives. Keep combining until all valid ECs are covered.

2. **Error Isolation (Invalid ECs):** Each negative test case contains **exactly one** invalid EC.
   All other variables sit at nominal valid values. This is non-negotiable — multiple invalid ECs
   in one test create "Error Masking" where one failure hides another, and you learn nothing.

**Every TC must be executable.** Pre-conditions must specify the system state precisely (not
"the account exists" but "account `test@eshop.com` exists, `failed_login_count = 1`"). Input
values must be literal. Verification points must name what to check and how.

**Format — each TC is its own vertical table:**

```markdown
### TC-XX — [Short descriptive title]

| Trường | Nội dung |
| :--- | :--- |
| **TC ID** | TC-XX |
| **Tên Test Case** | [What behavior this test exercises] |
| **EC Phủ** | EC01, EC05, EC08, ... |
| **EC Verified Absent** | EC14, EC19, ... (invalid output ECs ruled out by observing their valid counterparts) |
| **Pre-conditions** | [Exact system state — account, counter value, lock status, DB state] |
| **Input — `field_name`** | `value` |
| **Input — `field_name`** | `value` |
| **Bước thực hiện** | 1. [step] · 2. [step] · 3. [step] |
| **Kết quả kỳ vọng** | ✅/❌ [what should happen — be specific] |
| **Điểm xác minh** | 1. [what to check and how] · 2. ... |
| **Trạng thái** | ⬜ Chưa thực thi |
```

After all TCs, add an **EC Coverage Matrix** — a Markdown table mapping each EC ID to the TC
that covers it, with a "Cơ chế" column (Trigger trực tiếp / Input nominal valid / Observed /
Verified absent).

**→ Use AskUserQuestion before writing files.**
**→ When accepted: Write Steps 1–3 content to `domain-testing.md`** (see File Format below).

---

## STEP 4 — Boundary Value Analysis (BVA)

**Goal:** Add high-value test cases that catch off-by-one defects at the exact turning points.
These are additive — don't duplicate Step 3's midpoint cases.

**Only target numeric/range variables with a defined boundary.** String format conditions
(email pattern, etc.) are nominal — BVA doesn't apply. Timer values, counters, quantities,
and amounts are BVA targets.

**For each boundary, apply the 3-point model:**
- `UB-1`: one unit before the upper boundary (should be in the valid/active state)
- `UB`: the upper boundary itself (the turning point — this is where `>` vs `>=` is exposed)
- `UB+1`: one unit past the boundary (should be in the invalid/expired state)
- Mirror for lower boundary: `LB-1`, `LB`, `LB+1`

**For each BVA test case, name the specific defect it targets.** "Off-by-one" is too vague.
Write the actual wrong operator: "Catches bug where system uses `count > 3` instead of
`count >= 3`, meaning lock triggers on the 4th fail instead of the 3rd."

**Start with an ASCII Boundary Map** for each target variable before the TCs. It gives the
reader (and you) an immediate mental model of what's being tested.

**Format — each BVA TC is its own vertical table:**

```markdown
### TC-BVA-XX — [Short title]

| Trường | Nội dung |
| :--- | :--- |
| **TC ID** | TC-BVA-XX |
| **Tên Test Case** | [What boundary moment this captures] |
| **Biến mục tiêu** | `variable_name` |
| **Loại điểm biên** | [UB / UB-1 / UB+1 / ON Point / OFF Point / Transition] |
| **Target Variable State** | [Exact value at boundary — e.g., `count = 3`, `time_since_lock = 30s`] |
| **Pre-conditions** | [How to set up this exact state] |
| **Input — `field_name`** | `value` |
| **Input — `field_name`** | `value` |
| **Mục tiêu Defect** | [Specific wrong operator this test exposes — be precise] |
| **Kết quả kỳ vọng** | ✅/❌ [what should happen at this exact boundary] |
| **Điểm xác minh** | [What to observe — especially the state transition] |
| **Trạng thái** | ⬜ Chưa thực thi |
```

End with a **Defect Coverage Matrix** and a **Setup Protocol** for any BVA case requiring
precise timing or state manipulation (e.g., database direct manipulation to set timestamps).

**→ Use AskUserQuestion before writing files.**
**→ When accepted: Write Step 4 content to `bva.md`** (see File Format below).

---

## AskUserQuestion Protocol

After presenting each step's output, call `AskUserQuestion` with:

```
Question: "Output của [Bước N — tên bước] đã đầy đủ và chính xác chưa?"
Options:
  - label: "✅ Chấp nhận — tiếp tục [bước tiếp theo hoặc Write file]"
  - label: "✏️ Cần chỉnh sửa"
    description: "Nhập feedback vào ô 'Other' — tôi sẽ sửa và hỏi lại"
```

**If user selects "Cần chỉnh sửa" or provides "Other" text:**
- Read their feedback carefully
- Revise the output to address the feedback precisely
- Re-present the revised section
- Ask again with `AskUserQuestion`
- Repeat until accepted

**If user selects "Chấp nhận":**
- Steps 1–3: proceed to next step (write files only after Step 3 is accepted)
- Step 3 accepted → write `domain-testing.md`
- Step 4 accepted → write `bva.md`

---

## File Format

### `domain-testing.md`

```
# FR-XX — Domain Testing: [Tên Feature]

**Feature:** FR-XX — [Tên]
**Kỹ thuật:** Domain Testing (Equivalence Partitioning)
**Nguồn SRS:** `docs/eshop-sut/srs.md` — [Section]
**Người thực hiện:** [Student name — ID]

---

## 1. Tổng quan Feature
[2–3 câu mô tả FR và các FR cross-reference liên quan]

---

## 2. Bước 1 — Xác định Biến & Ràng buộc
[Step 1 table]

### Implicit Gaps
[Gap table — omit section if no gaps]

---

## 3. Bước 2 — Phân hoạch Equivalence Classes
[EC tables grouped by variable, all groups]

---

## 4. Bước 3 — Minimum Test Cases
[One vertical table per TC]

---

## 5. EC Coverage Matrix
[EC → TC mapping table with Cơ chế column]
```

### `bva.md`

```
# FR-XX — Boundary Value Analysis: [Tên Feature]

**Feature:** FR-XX — [Tên]
**Kỹ thuật:** Boundary Value Analysis (BVA) — bổ sung cho Domain Testing
**Nguồn SRS:** `docs/eshop-sut/srs.md` — [Section]
**Người thực hiện:** [Student name — ID]

---

## 1. Tổng quan
[Why BVA adds value beyond EP; which variables are targeted and why]

---

## 2. Biến Mục tiêu & Boundary Map
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

## 6. Tổng hợp Test Suite
[Summary table: EP TCs + BVA TCs = total]
```

---

## Quality Checklist (self-verify before each AskUserQuestion)

- [ ] Every variable in the FR has at least one EC — nothing was missed
- [ ] Every invalid EC is isolated in its own TC (no Error Masking)
- [ ] Every TC has concrete, literal input values (not "some valid email")
- [ ] Pre-conditions are precise enough to reproduce without guessing
- [ ] Verification points say HOW to check, not just WHAT to check
- [ ] BVA cases name a specific wrong operator, not just "off-by-one"
- [ ] Implicit Gaps are flagged with their risk — not silently assumed away
- [ ] Output language: Vietnamese prose, English identifiers/tech terms
