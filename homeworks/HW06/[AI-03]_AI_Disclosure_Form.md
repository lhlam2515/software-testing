# AI Use Disclosure Form - HW06

## 1. Course & Student Info

| Field | Value |
| --- | --- |
| Course | CS423 / CSC13003 - Software Testing |
| Assignment ID | HW#06 |
| Assignment Title | API Testing on EShop |
| AI Use Category (1-5) | 4 - AI-Assisted Production (AI generates parts of the work; the student designs, audits, and integrates) |
| Date | 2026-08-29 |
| Student name | Le Hoang Lam |
| Student ID | 23127216 |

## 2. Disclosure Questions

### 1. AI Tool(s) Used

Claude Code (Anthropic), used as a CLI coding agent inside the course repository. Two models:

| Model | Where it was used |
| --- | --- |
| Claude Sonnet 5 | Pass 1 (20/08): generated the three test-case suites and produced the first audit of them |
| Claude Opus 5 | Pass 2 (29/08): re-audited all three suites, rebuilt the Postman packages, ran Newman, drafted the bug entries, built the CI/CD pipeline and the Excel workbook, and rendered the generator diagram and pseudocode |

Effort level was set per pipeline stage: high for generation and re-audit, medium for the Postman build, low for sync and execution.

Tools driven by the agent rather than AI systems in their own right: Newman, the Postman CLI, `gh` for filing issues, `agent-browser` for the full-page issue screenshots, and the Mermaid CLI for rendering the diagram PNGs.

No other AI service was used. No ChatGPT, Gemini, Copilot, or Cursor session contributed to this submission.

### 2. Stage(s) of the Assignment Where AI Was Used

- [x] test-case generation
- [x] test-case audit support
- [x] test-case extension
- [x] Postman or Newman implementation
- [x] debugging
- [x] CI/CD configuration
- [x] report drafting
- [x] coding
- [x] data analysis
- [x] other: authoring the five agent skills that drive the pipeline; capturing execution evidence (GitHub issues and screenshots); rendering the generator diagram and pseudocode from the student's design

Not used for: the 200 to 300 word AI Critique in `REPORT.md` section 10, and the design decisions behind the test generator (stage split, permission boundaries, evidence rules).

### 3. Main Prompts or Tasks Given to the AI

Reference the exact step-by-step interactions in [prompt_log.md](prompt_log.md). Do not replace the verbatim prompt log with a reconstructed summary.

| API / Artifact | Prompt log entries | Task given to AI |
| --- | --- | --- |
| API 1 [Pool A], FR-02 Login | 1, 2, 8, 9, 11 | Generate the suite stage by stage from `srs.md` and `api_specification.md`; audit it; re-audit it against the oracles with a different model; rebuild the Postman package from the re-audited suite; run Newman and trace every failure back to a case |
| API 2 [Pool B], FR-08 Checkout | 3, 4, 12 | Same seven-stage generation, Pass 1 audit, and Pass 2 re-audit, including the backward correction of the two false citations in the generator documents |
| API 3 [Pool C], FR-15 Product CRUD | 5, 6, 13 | Same generation and audit sequence across the three CRUD verbs, with access control from FR-12 |
| Agent skills and generator design | 7, 10, 16 | Add the Pass 2 re-audit workflow to `api-test-auditor` and the re-run workflow to `api-test-execute`; draw the pipeline and boundary diagrams and write the pseudocode from the pipeline the student had already built and run |
| CI/CD pipeline | 14 | Build the GitHub Actions pipeline and collect both sample runs required by REQUIREMENTS.md section 6 |
| Excel workbook | 15 | Write a Python script that rebuilds the submission workbook from the audited suites, the execution results, and the bug report |

The sync, build, and execute stages for FR-08 and FR-15 ran the same two skills as FR-02 with only the FR id changed, so only the FR-02 instances are logged. Approval turns, commit turns, and follow-up questions inside the same sessions are not logged either.

### 4. Specific Parts of the Work AI Contributed To

Separate the AI-generated portion from the student's review, corrections, and additions for each deliverable.

| Deliverable | AI generated | Student reviewed, corrected, or added |
| --- | --- | --- |
| API 1 test cases | 35 cases (EP 12, BVA 3, State 5, Security 7, Schema 8), the Pass 1 labels, TC-36 to TC-41, the Pass 2 labels, and TC-42 to TC-46 | Accepted or rejected every label at two approval gates; 20 of the 41 rows required correction before execution; evidence re-derived where Pass 1 had cited generator catalogs; the unlocked, counter=0 precondition extended to TC-02, TC-07, TC-11, TC-26; the non-disclosure clause on TC-28 narrowed back to what `srs.md` line 42 states |
| API 2 test cases | 35 cases, the Pass 1 labels, TC-36 to TC-41, the Pass 2 labels, and TC-42 to TC-47 | Approved the INVALID rule for false traces before it was applied; approved the backward correction of `specs/requirements.md`, which overwrites Pass 1 evidence and was therefore not done silently; approved the refusal to write out-of-stock cases, which would have required inventing a data field |
| API 3 test cases | 43 cases, the Pass 1 labels, TC-44 to TC-48, the Pass 2 labels, and TC-49 to TC-56 | Accepted the reclassification of the coverage gate from contract coverage to input coverage; required the residual expired-token gap to stay recorded rather than quietly closed |
| Postman / Newman artifacts | Collections, environments, iteration data, `RUN.md`, the Newman runs, `test-execution.md`, and the first draft of the `BUG_REPORT.md` entries | Decided to keep the `REAL_CART_TOTAL` sentinel in FR-08; narrowed the FR-02 stack-trace assertion from every row to TC-25 to TC-27, the only rows SEC-05 supports; required Pass 1 runs to be archived instead of overwritten; re-anchored the argument behind BUG-FR02-04 after its supporting rows were downgraded to characterization |
| CI/CD artifacts | The workflow file, the quarantine manifest, the CI data generator, the local runner, the summariser, and the CI/CD report | Decided that the gate runs a quarantined regression subset, since the full suites cannot go green while real bugs are open, and that a green run states "no new regression" rather than "no bugs" |
| Report and documentation | Drafts of `REPORT.md`, the artifact READMEs, `BUG_REPORT.md`, the AI Audit Report, and this form | Verdicts, counts, and citations checked against the audit logs and the Newman output; stale aggregates corrected (130 rows re-derived, 55 not upheld, replacing an earlier 124 and 41); the AI Critique in `REPORT.md` section 10 is reserved for the student and was not drafted by AI |
| Agent Skill, if implemented | Five `SKILL.md` files and their reference documents, the Mermaid source, the rendered PNGs, and the pseudocode | The architecture is the student's: the five-stage split, what each stage may and must not do, the rule that a generated artifact is never evidence, and the ban on the auditor sending requests. AI wrote those decisions into skill files and drew them; it did not choose them |

### 5. How I Reviewed, Revised, or Verified the AI Output

| Artifact | Verification source or method | Changes made by the student |
| --- | --- | --- |
| API 1 [Pool A] | `srs.md` FR-02 lines 38 to 44, `api_specification.md` section 1.2, and `security-requirement.md` SEC-01, SEC-02, SEC-05, each opened at the cited line; then a Newman run against the locally deployed SUT | Verdict changed from VALID to INCOMPLETE in the audit report; rows without an authoritative source reclassified as characterization; five cases added |
| API 2 [Pool B] | The same two sources opened at every cited line number, which is how the two false citations were found: `api_specification.md` line 141 is blank and `srs.md` line 164 is the FR-11 heading | Four rows labelled INVALID, four corrected and kept; the false citations fixed backwards in the generator documents (commit `106ac14`); six cases added, including the client-supplied cart `price` that defeats the recompute rule |
| API 3 [Pool C] | `srs.md` lines 177 to 179 and 193 to 198, `api_specification.md` section 3.3, and the row structure of the master table checked by counting cells | Seven schema rows given a separate observable Oracle; the lifecycle scope widened to inbound references from cart and order; eight cases added |
| Execution and bugs | Newman reports with 0 failed requests on all three suites, meaning every failure is an assertion failure and not a harness defect; each bug reproduced and filed as GitHub issue #44 to #58 with a full-page screenshot | The FR-02 request template corrected; Pass 1 runs archived under `archive/<timestamp>/`; BUG-FR02-04 rewritten to state where it still reproduces and which rows no longer support it |
| CI/CD | Green run 33260661696 with 403 assertions passing, and red run 33261095283 failing exactly one case (FR-15 TC-17) after a regression was seeded into `PUT /api/products/:id` and then reverted | Gate scope reduced to the quarantined subset; FR-15 TC-32 quarantined after the pipeline showed it passed only because an earlier row had deleted its target product |
| Excel workbook | The script reads only submitted Markdown sources and warns on column mismatches; its totals reconcile with `REPORT.md` section 6.6 | Sub-cases TC-38a and TC-38b collapsed into TC-38; `FIXTURE` rows excluded from case counts |

### 6. Citation

Anthropic. (2026). *Claude Code* (Claude Sonnet 5 and Claude Opus 5) [Large language model]. <https://claude.com/claude-code>

Every AI interaction that produced a graded artifact is recorded verbatim in [prompt_log.md](prompt_log.md), with tool, model, ISO timestamp, prompt, output, and the artifact it produced. Pass 2 prompts and outputs were copied out of the session logs by script rather than retyped. Each artifact is audited in the [AI Audit Report](<[AI-02]_AI_Audit_Report.md>) under the five-part template.

No AI-generated text appears in this submission as if it were the student's own writing, and no source, citation, defect reference, or execution number is reproduced from AI output without being checked against the artifact it came from.

## 3. Statement of Honesty

- [x] I have disclosed every AI tool and substantial AI-generated artifact used in this assignment.
- [x] I reviewed and take responsibility for the final submission.
- [x] I did not present unverified or fabricated AI output as execution evidence.
- [x] I followed the assignment's anti-AI-cheat constraints.

On the third point: every number reported here comes from a Newman run against a locally deployed SUT, with the reports attached under `artifacts/newman/` and `artifacts/cicd/evidence/`. On the fourth: the `X-Student-Id: 23127216` header is evidenced by a console screenshot, the runs execute against `localhost`, and the test-generator diagram encodes design decisions the student made while building the pipeline, with AI limited to rendering them.

## 4. Signature

| Field | Value |
| --- | --- |
| Student name (printed) | Le Hoang Lam |
| Student ID | 23127216 |
| Class / Cohort | 23KTPM1 |
| Course | CS423 / CSC13003 - Software Testing |
| Instructor | Dr. Lam Quang Vu |
| Date | 2026-08-29 |
| Signature | ![Le Hoang Lam](assets/signature.png) |

## References

- [AI Use Agreement](../../context/ai_use_agreement.md)
- [HW06 Requirements](REQUIREMENTS.md)
- [AI Audit Report](<[AI-02]_AI_Audit_Report.md>)
- [Prompt Log](prompt_log.md)
