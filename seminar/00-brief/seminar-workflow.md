# Seminar Track Workflow Briefing

**FIT @ HCMUS · 2026 AI-First Edition**
**CS423 / CSC15003 — Software Testing**
**Department of Software Engineering**

> How to run a Seminar — from first tool survey to AI Audit

Lecturer: Dr. Lâm Quang Vũ · <lqvu@fit.hcmus.edu.vn>

---

## Why this Seminar Track exists

Testing tools evolve faster than textbooks. The Seminar Track turns each team into the class expert on one modern testing tool — and trains everyone to evaluate AI-augmented alternatives critically rather than enthusiastically.

| Pillar | Description |
|---|---|
| **Self-directed** | You choose the tool. We approve scope, not the verdict. |
| **Hands-on** | Demo runs on EShop. Slides are NOT the centrepiece. |
| **AI-augmented** | Mandatory traditional + AI-tool pairing in every demo. |
| **Peer-taught** | You will run a 20-min activity for your classmates. |

---

## Workflow at a glance — 8 stages from claim to audit

```
S1 Tool Survey & Proposal
  → S2 Instructor Approval
    → S3 Deep Study + EShop
      → S4 User-Guide + Screencast
        → S5 Pre-share (3 days early)
          → S6 Live Seminar (45 min)
            → S7 Audience Feedback
              → S8 AI Audit + Reflect
```

> **Rule of pairing** — every live demo must show one TRADITIONAL feature AND one AI feature.

---

## Stage S1 — Tool Survey & Proposal

**Due: W6 Saturday · Max 1 page**

### Required contents

- Topic code + name (e.g., T6 API Testing)
- ≥ 3 candidate tools: 1 traditional, 1+ AI-augmented, 1 backup
- Comparison matrix — 5 criteria: cost, learning curve, EShop fit, AI ability, community
- Pick + 3-bullet rationale
- AI Disclosure: which AI you used + what you cross-checked

### Example excerpt — Team Alpha · T6 API Testing

| Field | Content |
|---|---|
| **Candidates** | Postman (traditional) · Karate (traditional, BDD) · Postbot AI (AI inside Postman) |
| **Comparison** | Postman: free, GUI, weak BDD. Karate: free, Gherkin, harder onboarding. Postbot: free w/ acct, AI assertion suggestions. |
| **Pick** | Postman + Postbot |
| **Reasons** | (1) lowest onboarding cost, (2) EShop spec is small enough, (3) AI angle is visible end-to-end. |
| **AI Disclosure** | Used Claude to draft the comparison; cross-checked Karate pricing on its own docs. |

---

## Stage S2 — Instructor Approval

**Response time: ≤ 2 working days**

| Verdict | Meaning |
|---|---|
| **APPROVED** | Proceed to S3 immediately. Lock the scope. |
| **MINOR-CHANGE** | Refine the proposal (≤ 24h); proceed without re-review. |
| **RECLAIM** | Scope mismatch — pick a different angle / tool. |

---

## Stage S3 — Deep Study Milestones

**Duration: 1–2 weeks**

| Milestone | Task |
|---|---|
| M1 | Install the tool; pass its official 'hello world'. |
| M2 | Run one end-to-end scenario against EShop. |
| M3 | Document 3 real failure modes you observed. |
| M4 | Reproduce the same scenario with the AI variant. |
| M5 | Capture metrics: setup time, run time, flake rate. |

> Pair-programming is encouraged — but every team member must be able to demo the tool unaided.

---

## Stage S4 — User-Guide + Screencast

### User_Guide.md — required Markdown sections

| # | Section | Content |
|---|---|---|
| 1 | Introduction | Problem space + who the tool is for |
| 2 | Installation | Exact commands; OS notes; ≥ 1 screenshot |
| 3 | First Test | End-to-end on EShop in ≤ 15 steps |
| 4 | Advanced Usage | Configuration, plugins, parallel runs |
| 5 | Troubleshooting | ≥ 3 real errors + the fix |
| 6 | **Failure Modes (NEW)** | ≥ 3 ways the tool can mislead you |
| 7 | References | Docs, blog posts, papers — cite the source |

### Demo_Screencast.mp4 — specs

| Spec | Requirement |
|---|---|
| Duration | 5–8 minutes (firm) |
| Resolution | 1080p preferred · 720p minimum |
| Size | ≤ 100 MB (split-zip if larger) |
| Language | English narration |
| Audio | No background music |
| Subtitles | Optional but recommended |
| Content | Real terminal/IDE — no pre-recorded fakes |

---

## Stage S5 — Pre-share

**≥ 3 working days before your live seminar**, push to Moodle:

- `User_Guide.md`
- `Demo_Screencast.mp4`
- `Activity_Worksheet.md`
- `Seminar_Slides.pptx`

> Audience teams that don't skim the materials lose 1 attendance credit on the day.

---

## Stage S6 — Live Seminar (45 min)

### Time breakdown

| Segment | Duration |
|---|---|
| Pitch | 10 min |
| Live demo | 10 min |
| Audience activity | 20 min |
| Q&A | 5 min |

### Tips

- Slides ≤ 15 — the activity is the centrepiece, not the slides.
- Demo on a real terminal/IDE; have a backup recording ready in case the network dies.
- Print the Activity_Worksheet for audience teams without a laptop.
- Assign roles within your team: 1 presenter, 1 demoer, 1 facilitator, 1 timekeeper.
- Hand out a 1-page cheat-sheet — your audience will thank you.

---

## Stage S7 — Audience Feedback

**Minute paper template** (1 per team, end of session)

| Field | Example |
|---|---|
| Seminar code · Date | T6 · 2026-03-10 |
| Team & members | Team β · An, Bình, Châu, Dũng |
| (a) Most useful thing I learned | "Postbot can suggest assertions but it suggested an assertion on a non-existent field — humans must verify." |
| (b) One thing still unclear | "When is Karate strictly better than Postman?" |
| (c) Usefulness rating (1–5) | 4 / 5 |

---

## Stage S8 — AI Audit Pack

**Due: within 5 working days**

| Document | Description |
|---|---|
| **[AI-02]** AI Audit Report | 5 sections · ≥ 600 words |
| **[AI-03]** AI Disclosure | Signed PDF per member |
| **[AI-04]** Reflective Statement | 300 words English |

Templates live in: `Homeworks/AI Templates/_En/`

> Fill them in directly — do not paraphrase. Sign your real name.

---

## AI Prompt Templates

Copy, paste, adapt. Replace `[BRACKETED]` tokens and **ALWAYS audit the output**.

### Template 1 — Tool comparison matrix

```
I am preparing a seminar on [topic]. Build a comparison matrix for [Tool A],
[Tool B], [Tool AI] on these 5 axes:
licence cost, learning curve, fit with [SUT name], AI capability, community size.
Cite sources after each row.
Flag any claim you are NOT 90% sure about.
```

### Template 2 — User guide draft (Failure Modes section)

```
Given this tool [tool name], list 5 plausible 'failure modes' — situations where
the tool returns a wrong or misleading result.
For each: (1) trigger, (2) symptom, (3) detection, (4) mitigation.
Do not invent — only list modes documented in official docs, GH issues, or papers.
```

### Template 3 — Worksheet draft for audience activity

```
Design a 25-minute classroom activity that lets a team of 3–4 students try [feature]
of [tool] on the EShop [scenario].
Output: Time-boxed steps, the worksheet, and an answer key.
Activity must be feasible without internet access AFTER initial setup.
```

### Template 4 — Critical audit of an AI-generated artefact

```
Below is an AI-generated [test script / report / fix].
Audit it for: (a) factual errors, (b) missing edge cases,
(c) silent assumptions, (d) over-confident statements.
Output a numbered list with line references.
Do not rewrite the artefact — only audit it.
```

---

## Rubric

**Seminar = 20% of course**

| Component | Weight |
|---|---|
| Tool survey + proposal | 10% |
| Depth of study | 15% |
| User-guide document | 20% |
| Live demo on EShop | 15% |
| In-class hands-on activity | 20% |
| Q&A + facilitation | 10% |
| AI Audit + Disclosure + Reflect | 10% |

---

## Top 6 Pitfalls — Auto-penalty

1. Copy-pasting AI output into the user guide unedited.
2. Demo'ing only the traditional tool OR only the AI tool — **both required**.
3. Skipping the 'Failure Modes' section in the user guide.
4. Pre-recording the 'live' demo (TAs check).
5. Activity worksheet that cannot finish in 25 min.
6. Missing AI Disclosure or empty [AI-02] sections.

> **Audience attendance** — miss > 2 of the 10 live seminars and your team's seminar grade is capped at 70%.

---

## Resources

- `Seminar_Guide.docx` — Full workflow + rubric
- `Topic-Descriptions/` — 10 ready-to-use topic briefs
- `InClass-Activities/` — 8-slide audience activity decks

Questions: Moodle Forum (first) · Dr. Vũ — <lqvu@fit.hcmus.edu.vn>
