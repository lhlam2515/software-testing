# AI Use Disclosure Form — HW02

---

## 1. Course & Student Info

| Field                  | Value                                          |
| ---------------------- | ---------------------------------------------- |
| Course:                | CS423 / CSC13003 – Software Testing            |
| Assignment ID:         | HW#02                                          |
| Assignment Title:      | Domain Testing on EShop                        |
| AI Use Category (1–5): | Category 4 — AI-Assisted Production            |
| Date:                  | 07/07/2026                                     |
| Student name:          | Lê Hoàng Lâm                                   |
| Student ID:            | 23127216                                       |

---

## 2. Disclosure Questions

### 1. AI tool(s) used

> Claude Code (test design, defect triage, skill authoring), Codex (test execution via the `fr-execution` skill)

---

### 2. Stage(s) of the assignment where AI was used

- [ ] brainstorming
- [ ] outlining
- [x] drafting (test case generation)
- [x] feedback
- [x] revision (AI Gap Analysis)
- [x] coding (test case tables, EC analysis)
- [ ] data analysis
- [ ] visual design
- [x] other: test execution (`fr-execution` skill, all 70 TCs, run by Codex) and defect triage (BUG_REPORT.md synthesis + GitHub Issues, by Claude Code)

---

### 3. Main prompts or tasks given to the AI

_Paste the 2–3 most impactful prompts verbatim. Full transcript: see [Prompt Log](prompt_log.md)._

> **Prompt 1 — FR-02 Domain Testing, Step 1:** Claude Code, 09:41 24/06/2026
>
> ```
> ## STEP 1: IDENTIFY INPUT/OUTPUT VARIABLES & CONSTRAINTS
>
> ### 1. Objective
>
> Analyze the requirement text to extract all controllable inputs, system-driven state variables, and output tokens, along with their business rules.
>
> ### 2. Execution Guidelines
>
> - Collect information from functional specs, UI designs, and database/API schemas.
> - Do not make assumptions about missing boundaries. Identify implicit gaps (e.g., if a minimum is stated, look for the maximum).
> - Classify variables into: Input, System State, or Output.
> - Identify the "Resolution" (the smallest measurable unit, e.g., 1 integer, 0.01 decimal, 1 character).
>
> ### 3. Output Format
>
> Return a Markdown table with the exact following headers:
>
> | Variable | Type | Description | Valid Domain / Boundaries | Dependencies & Constraints | Expected Error / Behavior |
> | :--- | :--- | :--- | :--- | :--- | :--- |
>
> ---
>
> Yêu cầu cần phân tích: FR-02 được đặc tả trong tài liệu eshop-sut/srs.md (liên hệ trực tiếp với FR-01 để biết về format, ràng buộc của các trường trong FR-02)
> ```
>
> **Prompt 2 — FR-09 Coupon, `/domain-testing` skill:** Claude Code, 21:17 25/06/2026
>
> ```
> Hãy áp dụng kỹ thuật /domain-testing để thực hiện thiết kế test case cho FR-09 - Coupon đã được document bên trong eshop-sut/srs.md và eshop-sut/api-specification.md.
> ```
>
> **Prompt 3 — FR-16 CSV Import, `/domain-testing` skill:** Claude Code, 21:31 27/06/2026
>
> ```
> Hãy áp dụng kỹ thuật /domain-testing để thực hiện thiết kế test case chi tiết cho FR-16 - CSV Import đã được document bên trong eshop-sut/srs.md và eshop-sut/api-specification.md
> ```

---

### 4. Specific parts of the work AI contributed to

> AI contributed to:
>
> - **FR-02 EC + test cases**: initial EP table (24 ECs) + BVA. Fixed: variable names inferred from SRS prose (renamed `failed_login_count`/`lock_timer` → `login_attempts`/`locked_until`), removed out-of-scope Group 9 (display-position ECs pulled in via FR-22).
> - **FR-09 coupon EC + test cases**: EC table for all 5 conditions + discount calculation TCs. Added TC-12 (zero-amount boundary) and TC-13 (client-manipulated `total_amount`), closing two gaps AI flagged in Step 1 but never converted into tests.
> - **FR-16 CSV import test cases**: file format + atomicity EC classes. Added TC-17, TC-18, TC-19 (response schema, all-invalid rollback, `.csv` extension enforcement), closing gaps AI flagged in Step 1 but left untested in Step 3.
> - **FR-20 cancel order test cases**: state-based EC table grounded in a live UI survey of `apps/frontend-mobile`. Added EC17/TC-10 for the color-distinction half of FR-11's status-label requirement, which AI's EC group only covered for the translation half.
> - **Test execution** (`execution-log.md`, all 4 features): Codex ran all 70 TCs via the `fr-execution` skill (`playwright-cli` for browser, `test-db.cjs` for DB pre-conditions), filled in Actual Result, captured screenshots. I verified every actual-vs-expected comparison and root-caused each discrepancy against server code before accepting a verdict.
> - **`BUG_REPORT.md` + GitHub Issues**: Claude Code synthesized all 18 bug write-ups and created the 18 matching Issues from Codex's execution logs. I reviewed each synthesis against its log and held `SC-09-001` out of the confirmed-bug count until TC-13 later confirmed it.
> - **AI Critique** (`REPORT.md` §6): drafted by Claude Code from the gap-to-test-case pattern documented above, reviewed by me before acceptance.
>
> The above four items (execution recording, bug write-ups, GitHub Issues, AI Critique) deviate from course policy section 11 ("Bug reports: 100% student-written; AI may not draft the description") and the AI-05 prohibited-artifact list, disclosed here rather than left unstated. AI did NOT generate: the AI Gap Analysis tables in `REPORT.md` or this Disclosure Form.

---

### 5. How I reviewed, revised, or verified the AI output

> - **Equivalence classes**: cross-checked every EC against `srs.md` / `api_specification.md`, not AI's assumptions.
> - **BVA test cases**: verified against the 9-point model (S04) and the 3-value BVA rule (ISTQB FL §4.2).
> - **Test execution**: did not re-run the 70 TCs; verified each AI-recorded actual result against real SUT behavior (spot-checked via manual repro on flagged discrepancies), root-caused every FAIL against server code before accepting.
> - **Atomicity (FR-16)**: verified rollback by inspecting the SQLite DB directly after injecting invalid rows, not by trusting response JSON alone.
> - **UI grounding (FR-20)**: surveyed the live mobile UI with `playwright-cli` before design, instead of inferring labels/flow from spec prose.
> - **Bug confirmation**: root-caused every discrepancy against server code before logging as a defect, not inferred from symptoms.

---

### 6. Citation

> Anthropic. (2026). Claude Code [AI coding assistant]. <https://claude.ai/code>
> OpenAI. (2026). Codex [AI coding agent]. <https://openai.com/codex>

---

## 3. Statement of Honesty

By signing below, I confirm that the disclosure above is accurate and complete. I understand that undisclosed or false disclosure of AI use is treated as academic misconduct and may result in a 0 grade for the assignment and disciplinary referral.

---

## 4. Signature

| Field                   | Value                                  |
| ----------------------- | -------------------------------------- |
| Student name (printed): | Lê Hoàng Lâm                           |
| Student ID:             | 23127216                               |
| Class / Cohort:         | 23KTPM1                                |
| Course:                 | CS423 / CSC13003 – Software Testing    |
| Instructor:             | Dr. Lam Quang Vu                       |
| Date:                   | 22/06/2026                             |
| Signature:              | ![Lê Hoàng Lâm](assets/signature.png) |

---

## References

- Kharbach, M. (2026). _AI Use Policy Templates for Higher Education._ CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
- Hardman, P. (2025). _A Post-AI Learning Taxonomy._
- Anthropic (2025). _Building reliable AI test agents_ — engineering blog.
