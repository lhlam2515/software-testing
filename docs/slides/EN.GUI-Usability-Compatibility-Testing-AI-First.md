> This document is a structured Markdown transcription of the 63-page source PDF. The reading order has been normalized from slide coordinates into ordinary document flow. Text recovered from diagrams and screenshots is retained in dedicated subsections.

# GUI, Usability & Compatibility Testing

**Software Testing · UI Quality**

Three parts, one deck — how the interface looks, whether users can use it, and whether it works everywhere.

> Rebuilt from the FIT GUI & Usability Testing deck and reference checklists (Waghmare, Gerrard, Guru99, WalkMe; Rubin & Chisnell). All GUI/usability screenshots are from the original course material; the tool survey was verified for 2024–2026.

---

## What’s inside

One combined deck covering three areas of interface testing.

| Part | Coverage |
| --- | --- |
| **Part 1 · GUI Testing** | Testable elements; Nielsen, Norman and Shneiderman design heuristics; per-control checklists for text boxes, dropdowns, buttons, checkboxes, links, grids, dates and validation; real screens; difficulty; error taxonomy; strategy; AI. |
| **Part 2 · Usability Testing** | Six required components; test types and environments; the nine-part test plan; task and evaluator selection; performance and preference metrics; questionnaires; analysis; tool survey with screenshots. |
| **Part 3 · Compatibility** | Browser × OS × device matrix; emulator vs simulator vs real device; offline visual regression; local emulation; online screenshot generation; cloud real-device simulation; AI. |

---

## Part 1 — GUI Testing

What to test, per-control checklists, design heuristics, real examples and AI. Sources include Waghmare (2009), Gerrard/EuroSTAR, Guru99 and WalkMe.

---

### What is GUI testing?

Verifying the graphical interface behaves and looks as specified.

Checking every visible component — buttons, icons, checkboxes, colors, menus, windows, dialogs — against the specification.

#### The GUI decomposes into testable elements:

colors · fonts · alignment · orthography · inputs · buttons · links · symbols · pictures · videos · tables.

GUI Testing Tools — the element taxonomy

### Văn bản trong sơ đồ/hình ảnh

Sơ đồ **GUI Testing Tools** phân loại các phần tử có thể kiểm thử:

- Colors
- Fonts
- Alignments
- Orthography
- Inputs
- Buttons
- Links
- Symbols
- Pictures
- Videos
- Table

---

### “Think as a user, not as a tester”

If the interface confuses users, they never come back — so the GUI must be right first.

#### A button behind an overlay

A z-index regression hides “Sign in” — logins silently blocked.

#### NaN in a price field

An unhandled state renders “NaN ₫” — instant loss of trust.

#### Double-submit on double-click

No debounce → duplicate orders in the backend.

#### Broken layout on resize

Elements overlap/crop at another resolution.

---

### Where checklists come from 1 — Nielsen’s 10 heuristics

The most-cited usability yardstick.

Nielsen’s 10 usability heuristics (course diagram)

### Văn bản trong sơ đồ/hình ảnh

**Nielsen’s 10 usability heuristics:**

1. Visibility of system status
2. Match between system and the real world
3. User control and freedom
4. Consistency and standards
5. Error prevention
6. Recognition rather than recall
7. Flexibility and efficiency of use
8. Aesthetic and minimalist design
9. Help users recognize, diagnose, and recover from errors
10. Help and documentation

---

### Where checklists come from 2 — Norman’s 6 principles

Each principle is a question the user silently asks the interface.

#### Visibility

“Can I see it?”

#### Feedback

“What is it doing now?”

#### Affordance

“How do I use it?”

#### Mapping / Constraints / Consistency

Norman’s 6 principles

“Where can I go? Why can’t I? Seen this before?”

---

### Where checklists come from 3 — Shneiderman’s 8 Golden Rules

1. Strive for consistency
2. Enable frequent users to use shortcuts
3. Offer informative feedback
4. Design dialogues to yield closure
5. Offer simple error handling
6. Permit easy reversal of actions
7. Support internal locus of control
8. Reduce short-term memory load

Shneiderman’s 8 Golden Rules of dialogue design

---

### From heuristics to a review checklist

Turn the principles into a concrete, gradable GUI review sheet. Inputs to a good GUI checklist:

- Requirements & UI design specs
- Nielsen 10 · Norman 6 · Shneiderman 8
- Platform guidelines & W3C WCAG
- Per-control checklists (next section)

#### Score each item Yes / No / N/A with a priority & severity — Mandatory vs Optional.

A GUI Review Checklist (course example)

### Văn bản trong hình ảnh — GUI Review Checklist

Các trường đầu biểu mẫu:

- Project Code
- Version of the work product
- Reviewer(s)
- Review date
- Work product size
- Effort spent on review (man-hour)
- Cột đánh giá: Question · Yes · No · N/A · Note · Priority · Severity

Các mục nhìn thấy trong ảnh:

- Is graphical design of GUI reviewed or accepted by customer? If not, has the waiver been stated?
- Is one button set to be default (Microsoft style)?
- Are the controls ordered according to normal behavior?
- Are all labels aligned uniformly?
- Are text areas aligned uniformly?
- Are there any spelling mistakes?
- Are all non-enterable text areas of the same color (gray)?
- Is the tab sequence correct?
- Does the cursor become an hourglass when doing background processing?
- Does the cursor return to pointer after the task?
- Do all fields match data length?
- Do enterable fields accept entry only for the given string length, e.g. `char(30)`?
- Are abbreviations used? If yes, are they understandable for end users and consistently used across all screens?

---

### Test every control

Each widget has its own checklist: text boxes, dropdowns, buttons, checkboxes, links, grids and dates (Waghmare, 2009).

---

### Checklist — Text Box

The most-used input; test state, limits, and every input class.

#### State & Content

- Enable/disable per spec; disabled = greyed, no cursor, not editable
- Correct pre-population or blank; blinking cursor on focus
- Red asterisk on mandatory fields
- Stops at max width (test with capital W’s); width per spec
- Rejects spaces-only; test spaces + chars

#### Input Classes & Behavior

- Test numbers, special chars (1 $ # + −), alphanumeric + sign
- Formatted mask shown (SSN XXX-XX-XXXX); rejects short input
- Correct label; alignment consistent with siblings
- Scrollbar when content exceeds the box
- Double-click selects all; cursor changes over editable box

---

### Checklist — Dropdown / Combo Box

#### Select -Only

- Arrow shown; default or blank value; can mandatory accept blank?
- Rejects values outside the list
- List non-empty; scrollbar for long lists
- Typing first letter selects the item
- Sorted (alphabetical default); names not truncated
- Selected item shows on top when reopened

#### Editable Combo

- Editable combo also: enter alphanumeric/special text
- Can delete selection; switch between text and list
- A typed value equal to a list value is not treated as different
- Pure dropdown: cannot type free text
- Alt-Down / Ctrl-F4 opens the list
- Blank/none sits at top or bottom consistently

---

### Checklist — Button

Test the mouse path, the keyboard path, and the label.

#### Behavior & Keyboard

- Enable/disable; Tab reaches it in order; image changes on click
- Single / double / multi-click behave correctly
- Hover highlights + shows tooltip
- One default button (thick border) fires on Enter; Cancel on Esc
- Label meaningful, not abbreviated; “…” if it opens another screen

#### Labels & Conventions

- Alt + underlined letter activates; Space activates focused button
- No duplicate hot-key letters on a screen
- Uncorrectable action → Yes/No confirmation
- All buttons similar size/shape, same font
- Cancel acts as Close when changes can’t be undone

> **Consistency:** Search/Reset and Add/Delete must share size, font and spacing — colour signals intent (green = go, red = destructive).

---

### Checklist — Checkbox & Radio button

#### Checkbox

- Enable/disable; correct default checked/unchecked
- Appropriate label; Tab selects in series
- Mouse, Space, Enter, Alt+letter all toggle; clicking text toggles
- Correct events fire on change; alignment proper

#### Radio / Options

- Correct default; only ONE selectable per group
- Arrow keys move the selection within the group
- Mouse, Space, Enter, Alt+letter change selection
- Handle a blank value from the DB for a fixed set

Checkbox group — labels, defaults & alignment (course example)

---

### Checklist — Hyperlink, Image, Grid, List, Date

#### Hyperlink

Standard color; underlined across every char; opens on click / Enter / Ctrl+click; Tab counts it; goes to the correct page.

#### List box

Single select by mouse/arrows; letter jumps to match; double-click = select + open; scrollbar when needed.

#### Image

Not blurred; correct size; rotate/zoom if applicable; no broken images; properly aligned.

#### Date field

Leap years; reject month 00/13, day 00/32, Feb 30; century change; correct entry format.

#### Grid control

Column + grid headings; header click sorts asc/desc with triangle; scroll via keys/wheel/buttons; double-click fires row event.

#### Browser button

Fills the linked textbox; hover colour change; Space/Enter/Alt trigger; disabled not clickable.

---

### Checklist — input-field validation

Where most GUI defects actually live.

#### Numeric & Alpha

- Numbers: lowest / highest / just-in-range / max / min / out-of-range above & below
- Handle blank in first & last position; both + and −; no division by zero
- Decide if negatives are allowed; include zero
- Alpha: blank/non-blank; invalid chars & symbols; valid chars

#### Rules & Messages

- Every failed rule → sensible message; user must fix before proceeding
- Mandatory where the DB column is NOT NULL; asterisk shown
- Char limit = DB column size; pop-up “limited to N chars” at max
- No error for optional blank fields; test every field with special chars

> **Golden Rule:** On error, return focus to the offending field and highlight it — even if the user clicked OK without tabbing off.

---

### Examples from real apps

Apply the same checklist to production interfaces and identify the issues.

---

### Example — consistency & layout (OrangeHRM)

Fonts, alignment, button grouping, and control state on a real admin screen.

OrangeHRM — System Users (annotations mark checklist points)

#### Check here

Consistent header font & color; table columns aligned; Search/Reset grouped and equal-sized; disabled rows greyed; pagination present.

#### Then ask

Does the layout hold at 1366×768 and 1920×1080? Are actions reachable by keyboard?

### Văn bản trong ảnh chụp giao diện

Ảnh OrangeHRM hiển thị các mục điều hướng: **Admin, PIM, Leave, Time, Recruitment, My Info, Performance, Dashboard, Directory, Maintenance, Buzz**. Các mục con/nhãn nhìn thấy gồm **Configuration, Employee, Add Employee, Reports, Report Name, PIM Sample Report, Edit**.

---

### Example — buttons, links & error pages

Evo Mobile — “Xem thử” (primary) vs “Chi tiết” (secondary)

503 error — is the message clear & recoverable?

> **What To Verify:** Primary vs secondary buttons are visually distinct · links styled & working · error pages are human-readable, on-brand, and offer a way back — not a raw server dump.

### Văn bản trong ảnh chụp giao diện

- Evo Mobile: “Giao diện website”, giá `1,500,000 đ`, các hành động “Xem thử” và “Chi tiết”.
- Trang lỗi: `503 Service Unavailable` — `No server is available to handle this request.`

---

### Why GUI testing is hard

The GUI is an event-driven world — the input domain is practically infinite. (Gerrard)

#### Event-driven

The user can click any pixel, in any order — no single control flow.

#### “Infinite” input domain

Field-entry order alone gives n! sequences; clicks, shortcuts, devices.

#### Unsolicited events

OS events (battery, network, notifications) interrupt anywhere.

#### Many ways in / out

Menu, toolbar, shortcut, context menu — all must behave the same.

#### Hidden dependencies

Behind one click sit many rules and object/window state.

#### Window management

Move, resize, maximize, minimize, close — each can corrupt layout/state.

---

### GUI error taxonomy + four-stage strategy

#### Common Gui Error Types

- Data validation; wrong field defaults
- Mandatory fields not enforced
- Queries retrieve wrong fields / multiple rows
- Stale on-screen data; window-object

DB mismatch

- Wrong window modality; broken system commands
- Control/menu state not aligned with data state

#### Four Test Stages

- 1 · Low level — checklist & navigation testing
- 2 · Application — EP, boundary values, decision tables, state-transition
- 3 · Integration — desktop, client/server, synchronization
- 4 · Non-functional — soak, compatibility, platform

---

### Automation — automate the right things

Pareto: ~80% of the benefit comes from ~20% of the tests.

#### Automate

Navigation & checklist testing · high-volume EP/BVA/decision-table cases · soak, compatibility, platform runs.

#### Coded > recorded

Hand-coded scripts (Page Object Model) survive UI change; recorded scripts are fragile.

#### Keep manual

Synchronization and complex-interaction tests; anything highly sensitive to UI change.

#### Hybrid is normal

Mix automated regression with exploratory manual testing — neither alone is enough.

---

### GUI across browsers & devices

The same GUI must render on every browser × OS × device.

Compatibility testing dimensions (course diagram)

BrowserStack

LambdaTest

> **How:** Build the matrix from real analytics; test P1 combos every release. Cloud device farms (BrowserStack, LambdaTest, CrossBrowserTesting) run one test across thousands of real browsers.

### Văn bản trong sơ đồ/hình ảnh

Các chiều tương thích trong sơ đồ: **Hardware, Operating Systems, Software, Network, Browser, Devices, Mobile, Versions**. Hai nền tảng minh họa: **BrowserStack** và **LambdaTest**.

---

### AI in GUI testing

Visual AI, browser agents and self-healing show how GUI testing changed during 2024–2026.

---

### AI 1 — Visual AI & self-healing locators

#### Visual AI (Applitools / Percy)

ML compares rendered screens, ignoring acceptable render noise while catching real layout drift — far fewer false positives than pixel diff.

#### Natural-language tests

testRigor / mabl author tests in plain English — resilient because there are no hard-coded locators.

#### Self-healing locators

When the primary selector breaks, the tool re-resolves the element (rule-based ~40–70%, LLM intent-based 75–90%+). Log every heal.

#### Watch out

Self-healing can mask a real regression; keep deterministic assertions on critical flows.

---

### AI 2 — browser agents & AI-generated UIs

#### Browser agents (Playwright MCP)

An LLM drives a real browser via the accessibility tree (roles + names, not pixels) — explores the GUI from high-level intent. Free & official.

#### Non-deterministic output

For LLM-backed screens, assert on structure/schema, not exact text; add accessibility scans (axe-core) every regeneration.

#### Testing AI-generated UIs

v0, Lovable, Bolt, Cursor churn the DOM and vary between runs. Use role/label locators + visual-AI baselines; treat generated code as untrusted.

#### Keep humans in the loop

AI agents are non-deterministic — great for exploration, weak as a regression gate. Review generated components.

---

### Tools and free stack for GUI testing

| Need | Tools | Free? |
| --- | --- | --- |
| E2E GUI automation | Playwright · Selenium · Cypress | Free, open source |
| Visual regression AI | Applitools Eyes · Percy · BackstopJS | Free tier / OSS |
| Cross-browser device farm | BrowserStack · LambdaTest · CrossBrowserTesting | Free trials |
| Accessibility | axe DevTools · WAVE · Lighthouse | Free |
| Agentic GUI testing | Playwright MCP + an LLM client | Free, open source |
| Natural-language tests | testRigor · mabl | Commercial / trial |

---

### EXERCISE

Your turn: run a real GUI review

#### Per-control audit

Take the OrangeHRM / MentorUS login & a form. Apply the text-box, button, dropdown & validation checklists — log every deviation with priority & severity.

#### Heuristics + a11y

Do a heuristic walkthrough (Nielsen 10) and run axe-core / Lighthouse. Compare what the checklist caught vs what the tool caught.

#### AI vs manual

Drive the same screen with Playwright MCP + an LLM; add one Applitools/Percy visual checkpoint. What did AI find that your checklist missed — and vice versa?

Deliverable: a filled GUI review sheet + a one-page note comparing manual, checklist and AI findings.

---

## Part 2 — Usability Testing

Method, planning, tasks, metrics and tools, based on Rubin and Chisnell’s *Handbook of Usability Testing*.

---

### What is usability testing?

A process that employs representative users to evaluate a product against usability criteria.

It does not guarantee success, but a well-run test should surface the key problems before users encounter them.

1. **Functionally correct ≠ usable.** Every button can work while users still cannot complete their task.
2. **Real users, real tasks.** Watch representative users attempt genuine goals; do not ask only your teammates.
3. **Observe, don’t just measure.** The “why” behind a failure matters as much as the success rate.
4. **Findings → change.** It is not a test until the evidence changes the product.

> **Reference:** Jeffrey Rubin and Dana Chisnell, *Handbook of Usability Testing* (Wiley). The method below follows this classic.

---

### Six required components

Rubin: it is not a usability test unless all six components are present.

1. **Specific objectives:** Written problem statements and a test plan — what questions must the study answer?
2. **Representative users:** A real sample of the target population, recruited to a profile.
3. **Real environment:** Conditions that represent actual use, not an idealized default.
4. **Observation:** Watch users work and review the product as they proceed.
5. **Quantitative + qualitative data:** Collect measurements and impressions together.
6. **Analysis and recommendations:** Turn observations into prioritized fixes.

---

### Ways to run a usability test

Choose along three axes to fit the budget, product stage and research question.

| Approach | Description |
| --- | --- |
| **Moderated** | A facilitator is present and can probe “why?” Rich qualitative insight, but slower and costlier. |
| **Unmoderated** | Self-paced and remote. Cheap and scalable, but follow-up questions are unavailable. |
| **Qualitative** | Think-aloud, interviews and observation explain behaviour. |
| **Quantitative** | Task metrics, benchmarks and SUS measure behaviour. |

> **Location:** In-lab · remote synchronous · remote asynchronous · guerrilla/hallway. Each option trades control for reach.

---

### Four types across the lifecycle

Rubin’s test types apply at different moments:

1. **Exploratory — early:** Use sketches and wireframes to evaluate the basic concept with shallow tasks. The study is informal and involves substantial participant interaction.
2. **Assessment — mid:** Once concepts are fixed, use well-defined tasks, less moderator interaction and quantitative measures.
3. **Validation — late:** Near release, use the whole product, including help and documentation, against predetermined benchmarks as “disaster insurance.”
4. **Comparison — any time:** Compare alternative designs using objective measures, then combine the best features.

---

### Test environments

From a single room to a purpose-built lab — separate observers from the user.

#### Simple single room

Observer sits near or removed from the evaluator — cheapest setup.

#### Electronic observation room

One-way glass / cameras feed a separate observation room.

#### Classic usability lab

Dedicated test + observation + control rooms with recording rigs.

#### Mobile lab

Portable kit taken to the users’ real environment.

Observation · Evaluation · Control zones

A usability session in progress

### Văn bản trong hình ảnh

Sơ đồ phòng lab phân chia ba vùng: **Observation · Evaluation · Control**.

---

### The 9-part test plan

Plan before you recruit — the plan is the contract for the study.

1. Purpose
2. Problem statement (specific questions)
3. Test objectives & tasks
4. User profile
5. Method & test design
6. Environment / equipment
7. Test-monitor role
8. Evaluation measures & data to collect
9. Report contents

Tasks come from a user model, not the code

---

### Selecting tasks

Tasks represent what users want to do — the user view, not the implementation view. They must be specific and measurable.

Good tasks:

- Represent real goals, such as “create and file a document” or “find the right document.”
- Do not tell the user how to proceed; expose design flaws indirectly.
- Cover key, frequent journeys.
- Define a success criterion and benchmark.

#### Task-component example

| Component | Value |
| --- | --- |
| Task | Load paper into the copier |
| State | Paper tray empty |
| Success | Paper properly loaded |
| Benchmark | Completed within one minute |

Second example: create a VM with the VMware wizard; initial state = software just loaded; success = working VM; benchmark = 30 seconds.

> **Evaluators:** Select participants representative of target users. Use independent-groups or within-subject designs while avoiding repeat-exposure bias. Recruit adequate numbers and motivate or reward participants.

---

### What to measure — performance vs preference

Collect both, then link each back to a problem statement.

#### Performance Data (Objective)

- Time per task
- % of tasks completed (with / without assistance)
- Time to access information
- Count of incorrect selections
- Number of errors
- Number of help accesses
- System response time

#### Preference Data (Subjective)

- Rankings & opinions via questionnaires
- Likert rating scales
- Semantic differentials
- Fill-in (open) questions
- Check-box questions
- Branching questions
- Free-form comments

---

### Questionnaire formats 1 — rating scales

#### Likert scale

“I found the GUI easy to use.”

| Strongly disagree | Disagree | Neutral | Agree | Strongly agree |
| :---: | :---: | :---: | :---: | :---: |
| −2 | −1 | 0 | +1 | +2 |

#### Semantic differential

“The File → Open menu is…”

`Simple  3  2  1  0  1  2  3  Complex`

> **Scoring:** Anchor scales symmetrically so ratings can be averaged; keep wording neutral to avoid leading participants.

---

### Questionnaire formats 2 — open, check-box and branching

| Format | Example and purpose |
| --- | --- |
| **Fill-in (open)** | “List 0–4 aspects you found particularly easy to use.” Captures unprompted qualitative signals. |
| **Check-box** | “How often do you use spell-check?” — Never · Sometimes · Often · Always. Captures quick categorical data. |
| **Branching** | “Did you use Advanced Search?” If yes: “Boolean or Relevance mode?” Routes users to relevant follow-ups. |

> **Design tip:** Always collect preference data in the context of the concrete task the user just attempted, not in the abstract.

---

### Summarizing the results

#### Performance

- Completion time: mean, median, range, standard deviation
- System response-time statistics
- Task accuracy: % completing within time / regardless of time / with assistance
- Average error rate per task

#### Preference

- Counts & % per answer choice
- Average Likert scores
- Categorize free-form answers (positive / negative)
- Group similar free comments into themes

---

### Analysis — from data to recommendations

1. **Focus on failures:** Start with failed tasks; identify each user error and its source.
2. **Prioritize:** Criticality = severity × probability. Fix high-criticality issues first.
3. **Compare groups:** Analyse differences between user groups or conditions.
4. **Recommend:** End every study with concrete, prioritized recommendations.

#### Linking example — “Is the tutorial effective?”

- **Task:** Group A imports an image without the tutorial; Group B imports it with the tutorial, forming an A/B design.
- **Performance:** Compare the error rates of the two groups.
- **Preference:** Collect a Likert rating and free comments about the tutorial.

---

### What to probe for preference

Always ask these in the context of a concrete task.

#### Layout & information

Does the layout match the task? Is there an adequate amount of information — not too much, not too little?

#### Grouping & navigation

Related info grouped? Do users ever get lost? Is it organized by user tasks?

#### Text & colors

Good headlines, help and warnings? Good, accessible colours?

#### Icons & consistency

Are icons self-explanatory? Is behaviour consistent across screens?

---

### Usability testing tools

This section preserves the tool survey and screenshots from the original course deck. A later mapping relates the course tools to current equivalents.

---

### Remote & unmoderated testing

Recruit participants and collect task metrics without a facilitator.

Loop11 — remote unmoderated tests, quantitative metrics

FiveSecondTest — first-impression testing

### Văn bản trong ảnh chụp công cụ

- **Loop11:** giao diện tạo bài test, chọn mức test theo số phản hồi/tính năng, xem trước URL, quản lý project, task, response, trạng thái, review và analysis.
- **FiveSecondTest:** giao diện tải thiết kế/mockup/screenshot để kiểm tra ấn tượng đầu tiên; ảnh có các nhóm câu hỏi thường gặp và lựa chọn mua test credits.

---

### Recorded user sessions

Watch real users use the product and narrate their thoughts.

UserTesting.com — on-demand recorded user tests

Userfly — records mouse & clicks with one line of code

### Văn bản trong ảnh chụp công cụ

- **UserTesting.com:** quảng bá video người dùng nói suy nghĩ khi sử dụng website và bản tóm tắt bằng văn bản về các vấn đề họ gặp.
- **Userfly:** hiển thị đoạn JavaScript chèn vào thẻ `<head>` để ghi phiên người dùng; ảnh ghi gói miễn phí còn 10 lượt ghi trong tháng và liên kết xem bản ghi đầu tiên.

---

### Behavioural analytics & heatmaps

See where users click, scroll, hesitate and drop off — at scale.

ClickTale — click/scroll recording & heatmaps

Simple Mouse Tracking (open source)

> **What They Reveal:** Scroll & click heatmaps · form analytics (which fields cause abandonment) · session replays of individual visits.

### Văn bản trong ảnh chụp công cụ

- **ClickTale:** Customer Experience Analytics; “Watch actual browsing behavior”, “Optimize website usability”, heatmaps, form analytics và theo dõi khách truy cập.
- **Simple Mouse Tracking:** minh họa các vùng mouse move/attention trên trang.

---

### Moderated capture & the comparison table

Silverback — guerrilla usability recording (screen + webcam)

Course comparison: Hotjar · CrazyEgg · Clarity · Mouseflow · FullStory · Smartlook

### Văn bản trong ảnh chụp công cụ

**Silverback** được mô tả là phần mềm usability testing cho designer/developer, có thể:

- Capture screen activity
- Video the participant’s reactions
- Record the participant’s voice
- Add chapter markers on the fly
- Control recording with the remote
- Export to QuickTime

Bảng so sánh nhìn thấy các công cụ **Hotjar, CrazyEgg, Microsoft Clarity, Mouseflow, FullStory, Smartlook** theo các khả năng như session recordings, heatmaps, surveys, feedback, funnels, analytics/integration, conversions, journey mapping và event tracking.

---

### Accessibility & colour-blindness checks

Part of usability: can everyone perceive the interface?

Colour-blindness simulator (Etre)

Colorblind Web Page Filter (Toptal ColorFilter)

> **Remember:** ≈8% of men have some colour-vision deficiency — never rely on colour alone to convey meaning.

### Văn bản trong ảnh chụp công cụ

- **Colour Blindness Simulator:** so sánh ảnh gốc với mô phỏng **Protanopia**; ảnh giải thích đây là dạng khiếm khuyết thị giác màu phổ biến, ảnh hưởng khoảng 1–6% nam giới tùy chủng tộc và khoảng 0.1% nữ giới.
- **Colorblind Web Page Filter:** nhập URL và chọn bộ lọc màu để xem tài nguyên dưới mô phỏng thị giác màu.

---

### Compatibility and link checking

Two additional web-QA tool families: the GUI must render across environments, and every link must resolve.

---

### Cross-browser & device testing

Run one test across thousands of real browser × OS × device combinations.

BrowserStack — 3000+ real combos

CrossBrowserTesting (SmartBear)

SecureTunnel — test internal builds

### Văn bản trong ảnh chụp công cụ

- **BrowserStack:** lựa chọn tổ hợp trình duyệt, hệ điều hành và thiết bị để kiểm thử chéo.
- **CrossBrowserTesting:** nhấn mạnh hơn 2,050 cấu hình trình duyệt, thiết bị thật, debugging tools, responsive testing, screenshot comparison, local testing, REST API và Selenium.
- **SmartBear SecureTunnel:** ứng dụng desktop/command line để kết nối website nội bộ, file HTML cục bộ hoặc proxy với nền tảng kiểm thử.

---

### Link checkers

Crawl the site and classify every link: working / unverified / broken.

LinkResearchTools — totals: working / unverified / broken

Xenu’s Link Sleuth — desktop crawler

> **Also:** W3C Link Validator (validator.w3.org/checklink) · ahrefs · Dr. Link Check · Sitechecker · SE Ranking · plus HTML & CSS validators.

### Văn bản trong ảnh chụp công cụ

- **LinkResearchTools:** phân loại tổng số liên kết thành working, unverified và broken.
- **Xenu’s Link Sleuth:** desktop crawler dùng để kiểm tra liên kết.

---

### From the course tools to today’s equivalents (2024–2026)

| Job | In the course deck | Use today |
| --- | --- | --- |
| Remote unmoderated testing | Loop11 · FiveSecondTest | Maze · Lyssna · Useberry; Loop11 remains available |
| Recorded sessions | UserTesting · Userfly | UserTesting · Lookback; Userfly retired |
| Heatmaps / replay | ClickTale | Microsoft Clarity (free) · Hotjar · FullStory |
| Comparison set | Hotjar · CrazyEgg · Mouseflow and others | Add Clarity (free) · Contentsquare |
| Accessibility | Etre · Toptal ColorFilter | axe DevTools · WAVE · Lighthouse |
| AI usability (new) | — | Attention Insight · Maze AI · Synthetic Users |

---

### EXERCISE

Your turn: run a small usability study

#### Plan & tasks

Write a mini 9-part test plan for MentorUS. Define 3 real tasks, each with a success criterion and a benchmark time.

#### Run & measure

Do a 3-user think-aloud. Capture performance (time, errors, % complete) and preference (a short Likert + SEQ).

#### Analyse & tool up

Rank issues by severity × probability. Add a free tool (Clarity heatmap or axe-core) — what did it reveal that users didn’t?

Deliverable: a 1-page report — key findings, prioritized recommendations, and one screenshot of evidence.

---

## Part 3 — Browser & Device Compatibility

One application, thousands of browser × OS × device combinations: a tool spectrum from offline screenshots to online real-device simulation.

---

### Why compatibility testing — and the matrix

The same code renders differently according to engine, OS, device, viewport, version and network.

- **Three rendering engines:** Blink (Chrome, Edge and Opera); WebKit (Safari and all iOS browsers); Gecko (Firefox).
- **Mobile Safari diverges most:** iOS forces WebKit, so a WebKit bug cannot necessarily be reproduced on desktop Chrome. Always test it.
- **Build the matrix from analytics:** Test the top 10–15 combinations used by real users rather than attempting to test everything.
- **Interop and Baseline:** Interop 2025 reached approximately 97% cross-browser pass. If a feature is Baseline “Widely available,” ship it without fallbacks.

> **Mindset:** An application may “work on my machine” while failing in a user’s browser because layout, fonts, events and APIs differ.

### Văn bản trong sơ đồ/hình ảnh

Các chiều tương thích: **Hardware, Operating Systems, Software, Network, Browser, Devices, Mobile, Versions**.

---

### Emulator vs Simulator vs Real device

Accuracy rises left → right; cost and effort rise the same way.

#### Emulator

Mimics the device OS AND hardware/CPU at a low level (e.g. Android Emulator). More accurate, heavier to run.

#### Simulator

Mimics the software environment only, on host resources (e.g. iOS Simulator — real WebKit, but no real GPU/sensors/cellular).

#### Real device

The physical phone = ground truth: real GPU, touch, notch, network, thermal throttling. Highest cost, lowest scale.

> **Tradeoff:** Emulators/simulators win on speed & CI scale; real devices win on fidelity. Cloud device farms give real devices without owning them.

---

### The compatibility tool spectrum

Four rungs, from free and offline to real-device and online:

| Rung | Approach | What it does | Example tools |
| ---: | --- | --- | --- |
| 1 | Offline visual regression | Capture and diff screenshots locally or in CI | Playwright `toHaveScreenshot` · BackstopJS · Lost Pixel |
| 2 | Local emulation | Interactive responsive checks on your machine | DevTools · Responsively · Playwright devices |
| 3 | Online screenshot generation | One URL produces screenshots across a large matrix | BrowserStack Screenshots · Percy · SmartUI |
| 4 | Cloud real-device | Interact with or automate real browsers and phones | BrowserStack Live · Sauce Labs · AWS Device Farm |

> **Rule:** Use free and fast tools on the left for every commit; use real-device and paid tools on the right before release. All four rungs catch different bugs.

---

### Rung 1 — offline screenshot capture and visual regression

Runs on a developer machine or in CI without a cloud account. It catches CSS regressions automatically at zero cloud cost.

```javascript
// Playwright — visual assertion across three engines
await expect(page).toHaveScreenshot("home.png", {
  maxDiffPixelRatio: 0.01,
});
// Run on Chromium, Firefox and WebKit.
```

How it works: capture a baseline → capture the current rendering → apply a pixel/AI diff → fail when the mismatch exceeds a threshold.

- **BackstopJS:** Mature OSS full-page visual regression with configuration-driven HTML diff reports.
- **Lost Pixel / reg-suit:** Modern OSS diffing; reg-suit stores baselines in S3 to keep repositories light.
- **Catches / limits:** Detects layout shifts and CSS/font regressions. Pixel noise from anti-aliasing or dynamic dates can cause flakiness; only local engines are covered.

> **Example:** Playwright bundles Chromium, Firefox and WebKit, so one `toHaveScreenshot` suite can diff all three engines in CI for free.

---

### Rung 2 — local emulation

Provides fast, interactive responsive checks at real breakpoints on a developer machine, although the environment is not always a real mobile engine.

```javascript
// Playwright device descriptor
const context = await browser.newContext({
  ...devices["iPhone 14"], // viewport, UA, DPR and touch
});
```

- **Chrome DevTools / Firefox Responsive Design Mode:** Device toolbar, network throttling and touch simulation; free and built in.
- **Responsively App:** Free OSS tool showing multiple synchronized viewports, useful for 360, 768, 1024 and 1440-pixel breakpoints.
- **Android Emulator / iOS Simulator:** A full Android OS or real WebKit Safari; iOS Simulator requires macOS.
- **Limit:** DevTools’ “iPhone” still uses Blink, while emulators lack a real GPU and network.

> **Example:** Responsively App displays four breakpoints side by side; one click updates every pane.

Use this rung for the inner loop, but confirm important findings on a real engine at rung 4.

---

### Rung 3 — online screenshot generation

Point at a URL, pick environments, get screenshots back — fast fan-out, non-interactive.

BrowserStack — select browsers, then Generate screenshots

#### BrowserStack Screenshots

One URL → screenshots across a slice of 3,500+ real browser/OS combos in minutes.

#### Percy (by BrowserStack)

Visual testing in CI across responsive widths & browsers. Free plan: 5,000 screenshots/month.

#### SmartUI (TestMu AI, ex-LambdaTest)

Batch screenshots + visual-diff engine with Layout Comparison (2025).

> **Example:** Paste one URL → tick 20 browsers → Generate → 20 screenshots to eyeball the layout everywhere.

### Văn bản trong ảnh chụp công cụ

Giao diện **BrowserStack Screenshots** cho phép chọn trước nhiều browser, kiểm tra responsive layout trên kích thước thiết bị thực (iOS, Android, OS X và Windows), sau đó tạo ảnh chụp hàng loạt.

---

### Rung 4 — cloud real-device: interact & simulate

Drive a real Safari/Chrome or a real phone — manually or via automation.

#### Interactive / Automated — Web

- BrowserStack Live + Automate
- TestMu AI (ex-LambdaTest) + KaneAI
- Sauce Labs · SmartBear BitBar
- Tunnels: BrowserStack Local, SecureTunnel

Live interactive session (real browser)

#### Real-Device — Mobile Apps

- BrowserStack App Live / App Automate
- AWS Device Farm (parallel real devices)
- Firebase Test Lab (free tier)
- Sauce Labs RDC · Kobiton · pCloudy

> **Examples:** Open a real iPhone 15 Safari and tap through checkout · run an Appium suite across 20 real devices in parallel on AWS Device Farm.

### Văn bản trong ảnh chụp công cụ

Ảnh minh họa một **live interactive session** trên trình duyệt thật; danh sách nền tảng được chia thành web interactive/automated và mobile real-device.

---

### AI and the state of the art (2024–2026)

AI targets two compatibility-testing bottlenecks: authoring tests across *N* configurations and reviewing *N* screenshots.

- **Percy Visual Review Agent (2025):** Boxes only meaningful changes, summarizes them in plain English and filters anti-aliasing noise, making review up to three times faster.
- **Applitools Eyes Visual AI:** Layout Match ignores content while flagging structure; Dynamic Match (2025) automatically suppresses dates, email addresses and card numbers.
- **TestMu AI — KaneAI + SmartUI:** Natural-language/agentic test authoring across thousands of configurations, with SmartUI Layout Comparison.
- **Flaky-test detection:** BrowserStack’s AI identifies flaky tests from execution history; this remains an active research thread.

> **Free student stack:** Playwright (three engines + `toHaveScreenshot`) · BackstopJS / Lost Pixel · Responsively App · Percy free tier · cloud free trials.

---

### Choosing the right rung

Each approach catches different bugs, so layer them.

| Approach | Example tools | Interact? | Real engine? | Best for |
| --- | --- | :---: | --- | --- |
| Offline visual regression | Playwright · BackstopJS | No | Local engines | CSS regressions at zero cloud cost |
| Local emulation | DevTools · Responsively | Yes | Partial | Responsive checks |
| Online screenshot generation | BrowserStack · Percy | No | Yes | One URL across many environments |
| Cloud live web | BrowserStack Live · Sauce Labs | Yes | Yes | Reproducing Safari bugs |
| Real-device mobile | AWS Device Farm · Firebase | Yes + automation | Ground truth | Native-app fidelity |

---
