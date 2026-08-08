# Mutation Testing & Test Effectiveness — 30-Minute Cut (29 screens + Live Demo)

> **This is the delivery cut, not the master.** Source of truth stays `Seminar_Slides_content.md` (45 screens, ~38 min). This file drops 7 screens, merges 9 pairs into 9 screens, and compresses the live demo from 4:00 to 3:00.
> Nothing here is rewritten for its own sake: every unchanged screen is byte-identical to its master screen, and every merged screen states what it kept and what it cut.
> Every e-Shop number is a measured value from the repository, not an estimate.
> Language level: B1/B2 (IELTS ~6.5). Sentences are kept short so they are easy to say out loud.

---

## Timing

| | Master | This cut |
| --- | --- | --- |
| Screens | 45 | **29** |
| Slide script | 33:55 | **23:35** |
| Live demo | ~4:00 | **3:00** |
| **Total script** | **~38:00** | **26:35** |
| Realistic wall-clock (+10–15% for transitions and speaker handover) | 43–45 min | **29–30 min** |

### Section budget

| Section | Screens | Time |
| --- | --- | --- |
| opening + agenda | 1–2 | 1:30 |
| why | 3–6 | 3:10 |
| what | 7–10 | 3:20 |
| diagnose | 11–13 | 2:25 |
| constraints | 14–18 | 4:10 |
| how | 19–22 | 3:25 |
| AI direction A (grading agent tests) | 23–25 | 2:25 |
| AI direction B (AI writing tests) | 26–27 | 1:40 |
| AI limits | 28 | 0:40 |
| demo setup + live demo | 29 + terminal | 3:50 |

### Checkpoints for the timekeeper

Call these out loud in rehearsal. If you are more than 45 seconds late at any mark, apply the drop list below.

| At the end of | Elapsed should be |
| --- | --- |
| Screen 10 (`M03`, three numbers) | **08:00** |
| Screen 18 (`S28`, control pair) | **14:35** |
| Screen 23 (`M08`, 80.2%) | **18:55** |
| Screen 29 (`S45`, demo setup) | **23:35** |
| Demo ends | **26:35** |

### Drop list — if you are behind at a checkpoint

Cut in this order. Each one is self-contained; nothing later in the deck refers back to it.

1. **Screen 13** (`S17`, ambiguous requirement) — −0:45. The same idea reappears live at HG-2 in the demo.
2. **Screen 20** (`S30`, six fixes at step 6) — −0:50. Screen 12 already showed the fix table.
3. **Screen 28** (`S44`, what AI does not remove) — −0:40. Fold its one-line takeaway into the demo close.

Maximum recovery: **2:15**. Do not cut Screen 5 (mutant 355) — the demo depends on it.

---

## What changed from the master deck

### Dropped entirely (7 screens, −5:05)

| Master | Title | Why it is safe to drop |
| --- | --- | --- |
| `S22` | Flaky tests and small samples | Caveat, not argument → backup slide for Q&A |
| `S25` | Case one: killed | Screen 18 (`S28`) keeps the control pair that carries all three verdicts |
| `S26` | Case two: survived, a real gap | Same — and this mutant is the live demo anyway |
| `S27` | Case three: an equivalent candidate | Same — keep mutants 535/536/537 for Q&A |
| `S34` | Google runs this at scale | External validation → Q&A answer to "does anyone do this for real?" |
| `S42` `S43` | Where AI plugs in, points 1–3 | Walked the same three insertion points `S40` had already listed |

### Merged (9 pairs → 9 screens, −5:15)

| New | From | Merged screen title |
| --- | --- | --- |
| Screen 06 · `M01` | `S06` + `S07` | Coverage measures execution, not verification |
| Screen 09 · `M02` | `S10` + `S11` | Five states, and the one distinction that changes the fix |
| Screen 10 · `M03` | `S12` + `S13` | Two formulas, three numbers, one suite |
| Screen 12 · `M04` | `S15` + `S16` | Four broken links, four different fixes |
| Screen 15 · `M05` | `S19` + `S20` | Where it pays, and why unit is only the first layer |
| Screen 17 · `M06` | `S23` + `S24` | Equivalent mutants: three clauses, and nobody decides it for you |
| Screen 21 · `M07` | `S31` + `S32` | Four levers, and why diff-scoping is permanent |
| Screen 23 · `M08` | `S35` + `S36` | The agent pipeline merges on 80.2% weak oracles |
| Screen 27 · `M09` | `S40` + `S41` | The same seven steps, and the gate is one command |

### Kept byte-identical (20 screens)

`S01` `S02` `S03` `S04` `S05` `S08` `S09` `S14` `S17` `S18` `S21` `S28` `S29` `S30` `S33` `S37` `S38` `S39` `S44` `S45`

### Screen map (delivery order)

| # | ID | # | ID | # | ID |
| --- | --- | --- | --- | --- | --- |
| 01 | `S01` | 11 | `S14` | 21 | `M07` |
| 02 | `S02` | 12 | `M04` | 22 | `S33` |
| 03 | `S03` | 13 | `S17` | 23 | `M08` |
| 04 | `S04` | 14 | `S18` | 24 | `S37` |
| 05 | `S05` | 15 | `M05` | 25 | `S38` |
| 06 | `M01` | 16 | `S21` | 26 | `S39` |
| 07 | `S08` | 17 | `M06` | 27 | `M09` |
| 08 | `S09` | 18 | `S28` | 28 | `S44` |
| 09 | `M02` | 19 | `S29` | 29 | `S45` |
| 10 | `M03` | 20 | `S30` | — | Live Demo |

---

## Two things to check before you deliver this

1. **Cross-references.** Every `Sxx` ID inside an **Evidence** block points at the **master** deck, not at this cut. They were left untouched on purpose so the two files stay traceable to each other. Three Evidence blocks name screens that no longer exist here — `S30` cites `S15`/`S16` (now Screen 12), `S37` and `S39` cite `S40`/`S41` (now Screen 27), and `S44` cites `S42`/`S43` and `S34` (dropped). None of this is spoken; it only matters if a reviewer reads the file.
2. **Course budget.** `seminar-workflow.md` §S6 allocates **10 minutes to the pitch** (45 min total = pitch 10 + demo 10 + activity 20 + Q&A 5), and `topic-t10.md` §8 caps the deck at **≤ 15 slides**. This 29-screen cut fits a 25–30 minute slot, but it does **not** fit that official split. If the slot turns out to be the standard one, the 15-screen selection is: `S01` `S03` `S04` `S05` `M01` `S08`+`S09` `M02` `M03` `S14` `S28` `S33` `S38` `M09` `S44` `S45` — everything else becomes appendix and Q&A material.

---

## Screen 01 — Mutation Testing & Test Effectiveness

> **Unchanged from master `S01`.**

**Purpose:** Position the talk: this technique grades the *test suite*, not the production code.

**Outline Content:**

```xml
<slide id="S01" section="opening" time="0:45" script-words="110">
  <layout template="title-hero" grid="12col" safe-margin="72px"/>

  <zone name="header" area="row1 col1-12" class="stack-center">
    <title class="h1 weight-800 tracking-tight">MUTATION TESTING &amp; TEST EFFECTIVENESS</title>
    <hook class="h2 muted italic">If this line were wrong, would your tests complain?</hook>
  </zone>

  <zone name="stage" area="row2 col3-10" class="code-panel elevated center">
    <example type="code-diff" language="js" caption="e-Shop · POST /api/apply-coupon · server.js">
      if (total_amount &gt; coupon.min_order_amount)
    </example>
    <emphasis target="&gt;" class="highlight-underline"/>
    <emphasis target="&gt;=" class="arrow-from:&gt; label:'or this?'"/>
  </zone>

  <zone name="footer" area="row3 col1-12" class="meta-strip micro muted split-3">
    <meta class="cell">CSC13003 · Seminar T10 · Group 02</meta>
    <meta class="cell">SUT: e-Shop backend</meta>
    <meta class="cell">StrykerJS 9.6.1 + Jest 30</meta>
  </zone>

  <build order="1:header → 2:stage → 3:footer" trigger="auto"/>
  <design-note render-only="true">No DNA or virus icon. The biological metaphor wrongly suggests
    mutants are random; they are generated by rules.</design-note>
</slide>
```

**Speaker Script:**
"Good morning, everyone. Today our group will talk about Mutation Testing and Test Effectiveness.

Please look at the line of code on the screen. It is a real line from e-Shop. Now imagine the greater-than sign was written as greater-or-equal by mistake. Would any of our tests fail? Keep that question in mind.

I also want to remove one common misunderstanding early. This is **not** a technique for finding bugs in your production code. It is a technique for grading your **test suite**. The thing we judge today is the `expect` lines that you wrote.

And every number you will see comes from e-Shop, measured with StrykerJS and Jest."

**Evidence:**

- Real config: `apps/backend/package.json` — `@stryker-mutator/core ^9.6.1`, `@stryker-mutator/jest-runner ^9.6.1`, `jest ^30.4.2`, `supertest ^7.2.2`.
- Stryker config file: `apps/backend/stryker.config.mjs`.
- The opening question restates the "governing question" from `seminar_content.md` §Introduction.
- Deliberate visual choice: no biology metaphor, because mutants are generated by rules, not randomly.

---

## Screen 02 — What We Will Go Through

> **Unchanged from master `S02`.**

**Purpose:** Set expectations: one continuous argument, six stages, ending in a live terminal demo.

**Outline Content:**

```xml
<slide id="S02" section="agenda" time="0:45" script-words="110">
  <layout template="split-60-40" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">What we will go through</title>
  </zone>

  <zone name="agenda" area="row2 col1-7" class="ladder numbered">
    <item n="1" class="pill accent-1"><label>WHY</label>High coverage can still mean a weak suite</item>
    <item n="2" class="pill accent-2"><label>WHAT</label>Mutants, scores, and the RIPR model</item>
    <item n="3" class="pill accent-3"><label>WHERE</label>Where it pays, and where it stops being cheap</item>
    <item n="4" class="pill accent-4"><label>HOW</label>The seven-step loop and CI/CD</item>
    <item n="5" class="pill accent-5"><label>AI</label>Grading agent-written tests, and AI helping back</item>
    <item n="6" class="pill accent-6"><label>DEMO</label>One surviving mutant, fixed live</item>
  </zone>

  <zone name="rail" area="row2 col8-12" class="support-rail">
    <example type="meta-note" class="callout-accent">
      We never define a term before the argument needs it.
      The word "mutant" does not appear until the WHAT section.
    </example>
    <note class="micro muted">Stage 5 has TWO directions. They are easy to confuse,
      so they are announced now.</note>
  </zone>

  <zone name="footer" area="row3 col1-12" class="progress-bar">
    <navigation render-only="true">Six segments, current one highlighted. Appears on every following screen.
      The screen count is never spoken.</navigation>
  </zone>

  <build order="1:title → 2:agenda items 1-6 → 3:rail" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"There are six stages, and the bar at the bottom of every screen will show you which one we are in.

You will notice that we do not start with definitions. A definition without a problem attached is hard to remember, so we start with a number we measured, and each new term arrives when the argument needs it.

Let me warn you about stage five now, because it has two directions and people often mix them up. One is using mutation testing to **grade** tests written by an AI agent. The other is using AI to **write** tests that kill mutants.

And the last part is a live demo in the terminal, about three minutes."

**Evidence:**

- The ordering follows the 5W1H frame required by the course brief; it is a presentation decision, not a claim from a source.
- The progress bar is a navigation tool, not decoration — the audience should always know where they are in the argument.
- Design principle for the whole deck: never teach a term before the argument needs it. In this refactor the word "mutant" first appears on **S08**, not slide 5 as in the original — the WHY section now runs three screens deeper (S03–S05) before the term is needed.

---

## Screen 03 — 40/40 Pass. 97% Coverage. Everyone Signs Off

> **Unchanged from master `S03`.**

**Purpose:** Establish the "looks fine" state — and nothing else. The paradox arrives on the next screen.

**Outline Content:**

```xml
<slide id="S03" section="why" time="0:45" script-words="110">
  <layout template="stage-rail" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">40 out of 40 pass. 97% line coverage. Everyone signs off.</title>
    <scope-rule class="badge accent-blue">Same 4 routes for every number on this screen</scope-rule>
  </zone>

  <zone name="stage" area="row2 col1-8" class="terminal-panel dark-panel mono">
    <example type="terminal" caption="what a sprint review actually sees">
      $ npm test
      Tests:  40 passed, 40 total

      $ node scripts/coverage-by-route.js
      FR-02  POST /api/login                  100% line   92% branch
      FR-09  POST /api/apply-coupon            93% line   85% branch
      FR-08  POST /api/cart + /api/checkout   100% line   75% branch
      FR-10  PUT  /api/admin/orders/:id/status 100% line   95% branch
      ── total ──────────────────────────────  97% line   90% branch
    </example>
    <emphasis target="97% line" class="glow"/>
  </zone>

  <zone name="rail" area="row2 col9-12" class="support-rail">
    <question class="callout-accent h2">Put this in a sprint review.
      Who asks a second question?</question>
  </zone>

  <zone name="footer" area="row3 col1-12" class="meta-strip micro muted">
    <provenance render-only="true">coverage-by-route.js · recomputed 2026-07-31 · commit f99c760 · Node v24.11.1</provenance>
  </zone>

  <build order="1:title+badge → 2:terminal → 3:question" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"These are our real numbers, on the four routes our group was assigned in e-Shop.

Let me say one thing about scope first, because it will matter in about ten seconds. **Every number on this screen is measured on those same four routes.** We did not average anything with routes we never agreed to test.

So, the tests are green: forty out of forty. Line coverage on those routes is ninety-seven percent, which is seventy-four lines out of seventy-six. Branch coverage is ninety. And as you can see in the table, three of the four routes are at one hundred percent.

If you put this dashboard in a sprint review, honestly, nobody asks a second question."

**Evidence:**

- Coverage scoped to the 4 committed routes (`BASELINE.md` §2, recomputed 2026-07-31 via `apps/backend/scripts/coverage-by-route.js`): **97% line (74/76), 90% branch (52/58)**.
- Per route: FR-02 `POST /api/login` 100%/92% · FR-09 `POST /api/apply-coupon` 93%/85% · FR-08 `POST /api/cart` + `POST /api/checkout` 100%/75% · FR-10 `PUT /api/admin/orders/:id/status` 100%/95%.
- Route boundaries are auto-detected by bracket balancing from each `app.<method>(...)` line, not hand-picked ranges. The earlier 28/06 hand-picked ranges wrongly attributed 3 extra routes to FR-08 (reporting 59%/29% instead of the real 100%/75%) and overran the end of the file for FR-10.
- **Naming decision carried from the original deck:** this slide does not use the word "mutant", in either the visual or the script — that term still waits for S08. Saying "40 tests" and "97% coverage" costs nothing here and lets S04's "215 slightly wrong versions" land as new information.

---

## Screen 04 — Same Code, 215 Slightly Wrong Versions. 43 Went Unnoticed

> **Unchanged from master `S04`.**

**Purpose:** Deliver the paradox as a single number, and pre-empt the "you just need more tests" explanation.

**Outline Content:**

```xml
<slide id="S04" section="why" time="0:50" script-words="120">
  <layout template="stack" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Same code, 215 slightly wrong versions. 43 went unnoticed.</title>
    <what-we-did class="body muted">One operator, one constant, or one line changed in each version.
      Then all 40 tests re-run against every version, one at a time.</what-we-did>
  </zone>

  <zone name="stage" area="row2 col1-12" class="strip-visual center">
    <example type="strip-visual" caption="199 squares · one square = one concrete wrong behaviour">
      ███████████████████████████████████████  156 grey — a test failed
      ▓▓▓▓▓▓▓▓▓▓▓                              43 red  — all 40 tests still green
    </example>
    <emphasis target="43 red" class="glow pulse-once"/>
  </zone>

  <zone name="reasoning" area="row3 col1-6" class="equation-panel mono">
    <equation>215 = 199 the tests DO execute + 16 no test ever reaches</equation>
  </zone>

  <zone name="verdict" area="row3 col7-12" class="callout-danger">
    <blocker>Only 16 were unreachable, so this is NOT a coverage problem.
      The lines are covered. The branches are covered. Ninety-seven percent.</blocker>
  </zone>

  <build order="1:title → 2:strip (grey first, then red) → 3:equation → 4:verdict" trigger="on-click"/>
  <naming-rule render-only="true">The word "mutant" is deliberately not used yet.</naming-rule>
  <provenance render-only="true">StrykerJS 9.6.1 · run 2026-07-11 · scope recomputed 2026-07-31 · mutation-by-route.js</provenance>
</slide>
```

**Speaker Script:**
"Then we did something else, on exactly the same four routes.

We generated **two hundred and fifteen slightly wrong versions** of that code. Each one changes only one thing: one operator, one constant, or one line. Then we ran the whole suite again against every version.

Sixteen are never reached, so one hundred and ninety-nine run inside code our tests **do** execute. Look at the strip. The grey part is one hundred and fifty-six versions that were caught. The red part is **forty-three that were missed**, where all forty tests still reported green.

And notice what you cannot say now. You cannot say we did not write enough tests, because the lines are covered. The gap is not what we executed. It is what we **checked** afterwards."

**Evidence:**

- `BASELINE.md` §3b, recomputed 2026-07-31 via `mutation-by-route.js` (same route-boundary detector as S03): 215 mutants, 156 Killed, 43 Survived, **16 NoCoverage** → covered = 199.
- **Why the whole-file numbers are deliberately not on this screen:** `server.js` overall is 52% line / 46% branch, with 293 of 541 mutants NoCoverage — but that gap belongs to routes outside our assignment (register, forgot-password, admin products/categories). Showing it next to the 43 survivors invites the wrong conclusion, that the survivors are a coverage gap. At this scope only 16 of 215 mutants are NoCoverage, so they are not.
- Whole-file contrast is deliberately withheld until **S13**, where the full six-condition comparison rule makes it safe to show: whole-file mutation score is 32.35% versus 78.39% scoped — same suite, same run, different denominator.
- The 43 survivors are enumerable: each has a mutant ID, file, and line in the Stryker report — this is what S05 makes concrete with mutant 355.

---

## Screen 05 — One of the Forty-Three, Up Close

> **Unchanged from master `S05`.**

**Purpose:** Turn an aggregate into something the audience can point at. This screen exists purely to make "43" concrete — and to plant the mutant the live demo will fix.

**Outline Content:**

```xml
<slide id="S05" section="why" time="0:40" script-words="100">
  <layout template="stage-rail" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Forty-three is not a percentage. Here is number 355.</title>
  </zone>

  <zone name="stage" area="row2 col1-8" class="code-panel diff">
    <example type="report-row" caption="one row from our Stryker report">
      server.js:382 · POST /api/apply-coupon

      -  if (expiry &lt;  now)  return res.status(400).json({ msg: 'Coupon has expired' });
      +  if (expiry &lt;= now)  return res.status(400).json({ msg: 'Coupon has expired' });
    </example>
    <emphasis target="&lt;=" class="highlight-underline"/>
  </zone>

  <zone name="rail" area="row2 col9-12" class="stat-stack">
    <stat class="big" label="executed by">11 tests</stat>
    <stat class="big danger" label="tests failed">0</stat>
  </zone>

  <zone name="footer" area="row3 col1-12" class="callout-accent center">
    <thread>We fix this exact one, live, at the end of the talk.</thread>
  </zone>

  <build order="1:title → 2:diff → 3:stats → 4:thread" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"Let me stop at that number forty-three for a second, because it is not forty-three percent. It is forty-three **specific wrong behaviours**, and each one has a file name and a line number. So here is one of them.

This is line three hundred and eighty-two in the coupon route. The original checks `expiry` less than `now`. The wrong version checks `expiry` less than **or equal to** `now`. One character.

Now look at the numbers on the right. **Eleven** of our tests execute that line. And zero of them fail.

Please remember this one, because at the end of the talk we will fix it live in the terminal."

**Evidence:** `seminar/01-research/survivors.json`, run 2026-07-11 — `id: "355"`, `mutatorName: "EqualityOperator"`, line 382, `status: "Survived"`, `coveredBy`: 11 tests, `killedBy: []`.

**Refactor note:** new screen. The original deck never showed a single instance of the 43 — the audience was asked to accept an aggregate. This is the highest-value example addition in the WHY section.

---

## Screen 06 — Coverage Measures Execution, Not Verification

> **Merged screen** — combines master `S06` + `S07`. Kept: the `createOrder` example, the **oracle** definition, the **incidental coverage** definition, the two-question contrast, the MUTGEN 4% external evidence. Cut: the EXECUTED/VERIFIED two-row breakdown is compressed into one annotation line.

**Purpose:** Show the mechanism behind the 43 survivors, define **oracle** and **incidental coverage** at the moment they are first spoken, and state the one contrast the rest of the talk runs on.

**Outline Content:**

```xml
<slide id="M01" from="S06+S07" section="why" time="0:55" script-words="140">
  <layout template="split-50-50" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Coverage measures execution. It does not measure verification.</title>
  </zone>

  <zone name="stage" area="row2 col1-6" class="code-panel">
    <example type="code" language="js" caption="this test reaches 100% coverage on createOrder()">
      it('creates order', async () => {
        expect(await service.createOrder(req)).not.toBeNull();
      });
    </example>
    <annotation class="micro danger">EXECUTED: map → calculateTotal → save → publish — 5/5 lines.
      VERIFIED: "not null" only. Delete publish() → still green.</annotation>
  </zone>

  <zone name="contrast" area="row2 col7-12" class="question-cards stacked">
    <question tool="COVERAGE" class="card muted">Was this line executed?</question>
    <question tool="MUTATION" class="card accent-strong">If this line were wrong, would a test fail?</question>
    <emphasis target="card.accent-strong" class="elevated"/>
  </zone>

  <zone name="definitions" area="row3 col1-7" class="definition-bar accent-blue split-2">
    <definition term="oracle" class="cell">Whatever a test uses to decide pass or fail.
      Here the oracle is one single thing: "not null".</definition>
    <definition term="incidental coverage" class="cell">Code executed as a side effect of another test,
      while its behaviour is not part of that test's oracle.</definition>
  </zone>

  <zone name="evidence" area="row3 col8-12" class="stat-panel dark-panel mono">
    <example type="external-evidence" caption="not only us — measured externally">
      MUTGEN · subject id_81 · HumanEval-Java · Llama-3.3
        line coverage 100% · branch 100% · mutation score 4%
    </example>
    <emphasis target="4%" class="glow danger"/>
    <source class="micro muted">Wang et al., IEEE TSE — one subject, a motivating example, not an average</source>
  </zone>

  <build order="1:title → 2:code+annotation → 3:both question cards → 4:definitions → 5:external panel" trigger="on-click"/>
  <design-note render-only="true">Both definitions must be on screen the first time each word is spoken.
    The oracle definition carries the rest of the deck.</design-note>
</slide>
```

**Speaker Script:**
"So this is the mechanism behind those forty-three.

The test on the left calls `createOrder` and asserts that the result is not null. A coverage tool reports one hundred percent, because all five lines ran. But look at what it actually **verifies**. Not the total. Not the save. Not the event. Delete the `publish` line completely, and this test still passes.

There is a word for what is missing, and it is the most important word today: the **oracle**. The oracle is whatever a test uses to decide pass or fail. Here it is one thing only, 'not null'. And the pattern has a name too: **incidental coverage**. The code runs as a side effect of a wider test, but its behaviour is not part of that test's oracle.

That is why the two tools on the right reach opposite conclusions. They ask two different questions.

And this is not only our problem. In an external study, generated tests reached one hundred percent line **and** branch coverage on one subject, with a mutation score of **four percent**."

**Evidence:**

- `mutation_testing_and_test_effectiveness.md` §2.2; `seminar_content.md` §Coverage vs Detection. The `oracle` term carries S14, M02, M08 and the AI section — it must be rendered, never a spoken aside.
- Wang, Xu, Briand & Liu, IEEE TSE (accepted), arXiv:2506.02954 — MUTGEN, subject `id_81`. **This is a motivating example in §II-A, one subject, NOT a benchmark average** — never pair "4%" with "89.5%". Removed claim (do not use): the "banking microservice 96%/34%" case, no traceable source.

---

## Screen 07 — A Mutant Is a Rule Applied to One Location

> **Unchanged from master `S08`.**

**Purpose:** Introduce **mutant** and **mutation operator** — and show that operators are a small, known catalogue, not randomness.

**Outline Content:**

```xml
<slide id="S08" section="what" time="0:45" script-words="110">
  <layout template="split-40-60" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">A mutant is a rule applied at one location, not a random bug</title>
  </zone>

  <zone name="transformation" area="row2 col1-5" class="transform-card">
    <original class="code-panel">if (expiry &lt; now)</original>
    <arrow class="down-arrow" label="EqualityOperator"/>
    <mutant class="code-panel accent-strong">if (expiry &lt;= now)</mutant>
    <term class="pill">MUTANT</term>
  </zone>

  <zone name="catalogue" area="row2 col6-12" class="table-panel mono compact">
    <example type="catalogue" caption="the operator family — StrykerJS, abbreviated">
      EqualityOperator      &lt;  → &lt;=      &gt;= → &gt;       == → !=
      ArithmeticOperator    +  → -       *  → /
      ConditionalExpression if (x) → if (true) / if (false)
      BooleanLiteral        true → false
      StringLiteral         "abc" → ""
      BlockStatement        { …body… } → { }        ← statement removal
    </example>
    <note class="micro muted">A small, fixed catalogue. Not a random generator.</note>
  </zone>

  <zone name="footer" area="row3 col1-12" class="safety-strip accent-green">
    <safety-note>Generated in an isolated sandbox, executed, then thrown away.
      Nothing ever reaches production.</safety-note>
  </zone>

  <build order="1:title → 2:transformation → 3:catalogue → 4:safety strip" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"The mechanism itself is almost crude, and that is why it works.

The tool takes your original code and applies one transformation rule at one location. That rule is called a **mutation operator**. On the left, the operator turns less-than into less-than-or-equal. The modified program is called a **mutant**, and that is what we generated two hundred and fifteen of.

Now look at the table on the right, because this is the part people get wrong. The operators are a small, fixed catalogue. Swap a comparison, swap an arithmetic sign, force a condition, or empty a block. That is most of it.

And these mutants never leave the test run. Sandbox, execute, throw away."

**Evidence:** Definitions from `NOTES.md` §3–4, §7–8; `seminar_content.md` §Operating Mechanism. Operator names as reported by StrykerJS 9.6.1 in `apps/backend/reports/mutation/mutation_baseline.html`.

**Refactor note:** the operator catalogue is a new example. The original showed one operator and asked the audience to generalise from n=1 — which is exactly what invited the "random bug" misreading the next screen has to fight.

---

## Screen 08 — Killed or Survived — and Why "Survived" Is the Bad One

> **Unchanged from master `S09`.**

**Purpose:** Give the two outcomes and the assumption underneath them.

**Outline Content:**

```xml
<slide id="S09" section="what" time="0:45" script-words="110">
  <layout template="split-60-40" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Killed or survived — and "survived" is the bad one</title>
  </zone>

  <zone name="tree" area="row2 col1-7" class="outcome-tree">
    <run class="node root">Run only the tests that execute this line</run>
    <branch class="node ok" condition="a test FAILS">
      <label class="badge green">KILLED</label> the suite detected the fault
    </branch>
    <branch class="node danger" condition="all tests PASS">
      <label class="badge red">SURVIVED</label> the suite is blind to it
    </branch>
    <emphasis target="node.danger" class="glow"/>
  </zone>

  <zone name="analogy" area="row2 col8-12" class="callout-accent illustrated">
    <example type="analogy" caption="the smoke-detector test">
      Holding a lit match under a smoke detector is not arson.
      It is the only way to know the alarm works.

      The mutant is the match.
      "Survived" means the alarm stayed silent.
    </example>
  </zone>

  <zone name="footer" area="row3 col1-12" class="two-col micro">
    <key-idea class="cell">A mutant is a CONTROLLED FAULT HYPOTHESIS:
      "if a developer wrote &lt;= instead of &lt;, would this suite catch it?"</key-idea>
    <assumption class="cell muted">Rests on the competent programmer hypothesis:
      real faults are small deviations, not rewritten functions.</assumption>
  </zone>

  <build order="1:title → 2:tree root → 3:KILLED → 4:SURVIVED → 5:analogy → 6:footer" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"The tool then runs only the tests that execute that line. If any test fails, the mutant is **killed**, and that is good news. If all the tests still pass, the mutant **survived**. That is the bad outcome, even though the word 'pass' normally sounds good. We broke the code, and nobody complained.

The comparison on the right helps me remember it. Holding a lit match under a smoke detector is not arson. It is the only way to know the alarm works. The mutant is the match, and 'survived' means the alarm stayed silent.

And a mutant is not a random bug. It is a **controlled fault hypothesis**, which assumes real faults are small mistakes, not rewritten functions."

**Evidence:** Competent programmer hypothesis: `NOTES.md` §14.1. The smoke-detector analogy is presentational `[I]`, not from a source.

---

## Screen 09 — Five States, and the One Distinction That Changes the Fix

> **Merged screen** — combines master `S10` + `S11`. Kept: the real report extract, all five states, the Survived / NoCoverage opposite-fix contrast, the Equivalent warning. Cut: the standalone side-by-side card pair (the contrast now rides on the report rows themselves).

**Purpose:** Let the audience read a mutation report, then give them the one distinction that changes what a developer does next.

**Outline Content:**

```xml
<slide id="M02" from="S10+S11" section="what" time="0:55" script-words="140">
  <layout template="table-hero" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Five states — and two of them look the same but need opposite fixes</title>
  </zone>

  <zone name="stage" area="row2 col1-12" class="report-table mono">
    <example type="report-extract" caption="StrykerJS output · real rows from our run">
      #368  L391  EqualityOperator   &gt;= → &gt;     KILLED       killedBy: [4]
      #355  L382  EqualityOperator   &lt;  → &lt;=    SURVIVED     coveredBy: 11
      #512  L487  BooleanLiteral     true→false  NO COVERAGE  coveredBy: 0
      ————  ————  ————               ————        TIMEOUT      counted as detected
      ————  ————  ————               ————        INVALID      excluded from denominator
    </example>
    <row-annotation class="micro muted" anchor="TIMEOUT">an infinite loop would redden CI anyway</row-annotation>
    <row-annotation class="micro muted" anchor="INVALID">never a runnable program</row-annotation>
  </zone>

  <zone name="compare" area="row3 col1-7" class="split-50-50 compare-cards compact">
    <example type="side-by-side" caption="both rows read 'not detected' — the fix is opposite">
      SURVIVED · coveredBy 11        NO COVERAGE · coveredBy 0
      the tests are there            the tests are not there
      FIX: stronger assertion        FIX: a new test case
           or better test data
    </example>
    <emphasis target="FIX:" class="highlight-underline both-cards"/>
    <rule class="micro danger">Dashboards merge these into one bucket, "not killed". Do not.
      Merge them and you throw away the diagnosis.</rule>
  </zone>

  <zone name="warning" area="row3 col8-12" class="callout-accent boxed-outside">
    <warning>EQUIVALENT is NOT a sixth run status. It is a MANUAL REVIEW LABEL
      on a subset of SURVIVED, and until a human signs it,
      the mutant STAYS IN THE DENOMINATOR.</warning>
    <eshop-note class="micro">Our baseline run: RuntimeError / Timeout / CompileError = 0 / 0 / 0.
      No noise in today's numbers.</eshop-note>
  </zone>

  <build order="1:title → 2:rows 1-3 → 3:rows 4-5 → 4:compare cards → 5:equivalent warning" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"There are five states, and instead of a definition list, this is what they look like in a real report.

Killed is clear: at least one test failed. Survived means the tests ran, but none of them failed. No Coverage means nothing touched that line at all. The last two rows are less common — Timeout counts as detected, because an infinite loop would turn CI red anyway, and Invalid never compiled, so it leaves the denominator.

Now the distinction that actually changes what you do next, at the bottom left. Both Survived and No Coverage read as 'not detected', so dashboards merge them into one bucket. Please do not. Same symptom, **opposite fix**. One needs a new test. The other needs a stronger assertion on a test you already have.

And one warning on the right. **Equivalent is not a sixth state.** It is a manual review label, and until a human signs it off, that mutant stays in your denominator."

**Evidence:**

- Stryker state definitions: stryker-mutator.io, "Mutant states and metrics" (via `mutation-testing-reference.md` §2.4). Mutant IDs 368 and 355 are real; the NoCoverage row (id 512) is a representative row from the same report.
- Run stability: RuntimeError / Timeout / CompileError = 0 / 0 / 0 in our baseline run.
- Cut and not restored: the undecidability argument — it is made once, on `M06`, where the examples are (Budd & Angluin 1982 kept for Q&A).

---

## Screen 10 — Two Formulas, Three Numbers, One Suite

> **Merged screen** — combines master `S12` + `S13`. Kept: both formulas, the hand-computed arithmetic, the three-bar contrast, the RAW label, the six-condition comparison rule. Cut: nothing load-bearing — the arithmetic and the bars now share one screen instead of being built twice.

**Purpose:** Make the difference between mutation score and test strength arithmetic rather than vocabulary — then make a bare mutation score unusable, with our own data.

**Outline Content:**

```xml
<slide id="M03" from="S12+S13" section="what" time="0:55" script-words="145">
  <layout template="stack" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Two formulas. Same suite, same run, same day — three different numbers.</title>
  </zone>

  <zone name="formulas" area="row2 col1-5" class="formula-cards mono stacked">
    <formula name="Mutation Score" class="card">Killed / (Total − Equivalent − Invalid)</formula>
    <formula name="Test Strength" class="card accent-strong">Killed / (Killed + Survived)
      <note class="micro">NoCoverage excluded</note></formula>
    <example type="arithmetic" caption="our 4 routes · 156 K · 43 S · 16 NC · 215 total">
      156 / 215 = 72.56%      156 / 199 = 78.39%
    </example>
    <emphasis target="16" class="glow" note="the 16 NoCoverage mutants are the entire difference"/>
  </zone>

  <zone name="stage" area="row2 col6-12" class="bar-chart shared-axis">
    <example type="bar-comparison" caption="denominators drawn underneath as differently sized boxes">
      whole server.js  · Mutation Score  ███░░░░░░░  32.35%   541 mutants · 293 NoCoverage
      the 4 routes     · Mutation Score  ███████░░░  72.56%   215 mutants ·  16 NoCoverage
      the 4 routes     · Test Strength   ███████▓░░  78.39%   199 mutants ·   0 NoCoverage
    </example>
    <delta class="annotation" anchor="row1→row2">same formula, only the SCOPE changed</delta>
    <delta class="annotation" anchor="row2→row3">same scope, only the FORMULA changed</delta>
  </zone>

  <zone name="status" area="row3 col1-4" class="badge-strip danger">
    <status-label>All three are RAW. Zero equivalent candidates removed.
      These are floors, not final figures.</status-label>
  </zone>

  <zone name="rule" area="row3 col5-12" class="callout-accent">
    <rule>Never compare two mutation scores unless tool, version, operator set,
      file scope, exclusion rules AND formula all match. Six conditions, not one.</rule>
  </zone>

  <zone name="footer" area="row4 col1-12" class="meta-strip micro muted">
    <provenance render-only="true">BASELINE.md §3 / §3b · StrykerJS 9.6.1 · run 2026-07-11 · scope recomputed 2026-07-31</provenance>
  </zone>

  <build order="1:title → 2:both formulas → 3:arithmetic → 4:bar 1 → 5:bar 2 + delta → 6:bar 3 + delta → 7:rule" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"There are two formulas, and I want to compute them in front of you.

Mutation score is killed divided by all the valid mutants: one fifty-six over two fifteen, seventy-two point five six percent. Test strength drops NoCoverage from the denominator: one fifty-six over one ninety-nine, seventy-eight point three nine. Those sixteen unreachable mutants are the entire difference.

Now look at the bars, because this is why you need both. The first bar measures the whole of `server.js`: thirty-two percent. The second measures only our four routes with exactly the same formula, and it rises to seventy-two. Same suite, same run, same day — only the **scope** changed, because that first bar carries almost three hundred mutants from routes nobody in our group was assigned. The third bar keeps the scope and changes the **formula** instead.

All three are correct, and all three are **raw** — we removed no equivalent candidates, because ours are still waiting for sign-off. And none of them means anything until you state the scope and the formula. Six conditions have to match before you compare two scores."

**Evidence:**

- `BASELINE.md` §3: full `server.js` = 541 mutants, 175 Killed, 73 Survived, 293 NoCoverage → 32.35%.
- `BASELINE.md` §3b (recomputed 2026-07-31): 4 routes = 215 mutants, 156 Killed, 43 Survived, 16 NoCoverage → 72.56% / 78.39%.
- S03/S04 deliberately withheld this contrast and promised it here; the scope statement on S03 is the setup, this screen is the payoff.

---

## Screen 11 — RIPR: Four Links a Test Must Complete

> **Unchanged from master `S14`.**

**Purpose:** Introduce the diagnostic model. The chain only — no diagnosis table.

**Outline Content:**

```xml
<slide id="S14" section="diagnose" time="0:45" script-words="110">
  <layout template="stack" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">To kill a mutant, a test must complete four links</title>
  </zone>

  <zone name="chain" area="row2 col1-12" class="chain-horizontal connected">
    <link n="1" name="Reachability" class="node">Does a test reach that line?</link>
    <link n="2" name="Infection" class="node">Does the state actually change?</link>
    <link n="3" name="Propagation" class="node">Does the difference reach an observable output?</link>
    <link n="4" name="Revealability" class="node">Is the assertion strict enough to tell them apart?</link>
  </zone>

  <zone name="stage" area="row3 col1-9" class="trace-panel mono">
    <example type="trace" caption="mutant 368 — all four links complete">
      R  TC-BVA-05 calls POST /api/apply-coupon           ✅ line 391 executed
      I  usage_count = 1, max = 1 → &gt;= true, &gt; false      ✅ state differs
      P  the branch decides the HTTP status               ✅ 400 vs 200
      R  expect(res.status).toBe(400)                     ✅ distinguishes them
                                                          → KILLED
    </example>
    <emphasis target="each ✅" class="sync-with-chain-node"/>
  </zone>

  <zone name="point" area="row3 col10-12" class="callout-danger">
    <point>Break ANY one link and the mutant survives.</point>
  </zone>

  <build order="1:title → 2:link 1..4 one by one → 3:trace rows synced to links → 4:point" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"To kill a mutant, a test has to complete four links in a chain.

**Reachability**: does any test reach that line? **Infection**: does the mutation really change the program state, with the data you are using? **Propagation**: does that difference travel somewhere we can observe? And **Revealability**: is the assertion strict enough to tell the two versions apart?

Below the chain, you can see one mutant that completes all four. The test reaches line three hundred and ninety-one. The data sits exactly on the boundary, so the condition flips. That branch decides the HTTP status. And the assertion checks the status. So the mutant dies.

The important part is on the right. If you break any one of those four links, the mutant survives."

**Evidence:** RIPR model — Li, N. & Offutt, J. (2017), *Test Oracle Strategies for Model-Based Testing*, IEEE TSE 43(4), 372–395 (verified via abstract and secondary citation, full text not read). Mutant 368 trace from `mutation_baseline.html`.

---

## Screen 12 — Four Broken Links, Four Different Fixes

> **Merged screen** — combines master `S15` + `S16`. Kept: the `add(0,0)` infection example, the `calculateDiscount()` dead-code example, the full fix table for all four links, the green/red "can a test fix it?" colour key, the one-link-one-likely-fix caveat. Cut: the second infection code block (passing variant is now an inline annotation).

**Purpose:** Turn the RIPR chain into a diagnosis table — including the one row where the fix is **not** in the test.

**Outline Content:**

```xml
<slide id="M04" from="S15+S16" section="diagnose" time="0:55" script-words="145">
  <layout template="split-55-45" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Four links, four fixes — and one of them is not a test at all</title>
    <colour-key class="badge green">GREEN = a test can fix it · RED = it cannot</colour-key>
  </zone>

  <zone name="stage" area="row2 col1-6" class="code-panel stacked-pair">
    <example type="code-pair" caption="INFECTION — the data is wrong, not the assertion">
      // mutant:  return a + b;   →   return a - b;

      expect(add(0, 0)).toBe(0);   ❌ 0+0 === 0-0  → SURVIVES
      expect(add(2, 3)).toBe(5);   ✅ 5 !== -1     → KILLED
    </example>
    <emphasis target="add(0, 0) / add(2, 3)" class="highlight-underline"/>
    <annotation class="micro">The assertion is identical in both. Only the inputs moved.</annotation>

    <example type="code" language="js" caption="PROPAGATION (a) — e-Shop · calculateDiscount() · real dead logic">
      if (order.total &gt; 500000) discount = 10;
      if (order.isVip)          discount = 15;
      return 20;
    </example>
    <emphasis target="return 20;" class="glow danger" note="every mutation above this line survives"/>
  </zone>

  <zone name="fixes" area="row2 col7-12" class="fix-table mixed-rows">
    <row class="green" break="Reachability" symptom="NoCoverage" fix="add a test case or a precondition"/>
    <row class="green" break="Infection" symptom="Survived" fix="change the test DATA, not the assertion"/>
    <row class="red" break="Propagation (a) dead or redundant code" fix="FIX THE PRODUCTION CODE"/>
    <row class="green" break="Propagation (b) masked by clamp, rounding, validation" fix="move the test data out of the masked range"/>
    <row class="green" break="Revealability" fix="a precise assertion — assertEquals, not result &gt;= 0"/>
  </zone>

  <zone name="footer" area="row3 col1-12" class="callout-accent split-2">
    <point class="cell">A survivor on the red row is not a test smell. It is a CODE smell.</point>
    <caveat class="cell micro muted">One broken link points to ONE LIKELY fix, not a guaranteed one.
      A real diagnosis can need more than one action.</caveat>
  </zone>

  <build order="1:title+key → 2:infection pair → 3:fix rows 1-2 → 4:dead-code example → 5:fix rows 3-5 → 6:footer" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"Four links means four different fixes, and the colours answer one question only: can a test fix it? Green means yes.

Reachability is the easy one — you are missing a test case, and the report shows No Coverage.

Infection is the classic. The mutant turns `a plus b` into `a minus b`. The first test passes zero and zero, so both versions return zero, the state never differs, and the mutant lives. Pass two and three and it dies immediately. Notice what did **not** change: the assertion. Only the data moved.

Propagation breaks for two different reasons, and this is where people fix the wrong thing. First reason: the value gets overwritten. This function from our own code computes a discount through two conditions, then returns a hard-coded twenty. Mutate either condition and the mutant always survives. That is the red row — no test can fix it, the fix belongs in the **production code**. Second reason is masking, where a clamp or rounding erases the difference for the data you happen to use.

And Revealability breaks when the assertion is too loose. `assertTrue(result >= 0)` is the classic."

**Evidence:**

- `a+b` with `a=b=0` is the canonical illustration `[I]`, standard in the mutation-testing literature.
- RIPR model source: Li, N. & Offutt, J. (2017), *Test Oracle Strategies for Model-Based Testing*, IEEE TSE 43(4), 372–395 (verified via abstract and secondary citation, full text not read) — same source as S11.
- Propagation (a), dead code, from source: `calculateDiscount()` computes `discount` through two conditions then returns a hard-coded 20.
- Propagation (b), masking: illustrative only, marked `[I]` — no natural masking case was found among the current 43 survivors. Kept as one table row, not a paragraph; expand only if asked.

---

## Screen 13 — Two Rows Where "Write More Tests" Is the Wrong Reflex

> **Unchanged from master `S17`.**

**Purpose:** The message of the diagnosis section: not every survivor is a test problem.

**Outline Content:**

```xml
<slide id="S17" section="diagnose" time="0:45" script-words="115">
  <layout template="split-50-50" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Two cases where writing more tests is simply wrong</title>
    <rule-line class="thick" note="load-bearing: these two rows sit BELOW the RIPR links, not among them"/>
  </zone>

  <zone name="rows" area="row2 col1-5" class="fix-table red-rows">
    <row break="Equivalent mutant" fix="cannot be killed — document the reason, suppress narrowly" fixable-by-test="NO"/>
    <row break="Ambiguous requirement" fix="STOP. Ask the BA before touching the test." fixable-by-test="NO"/>
  </zone>

  <zone name="stage" area="row2 col6-12" class="code-panel conflict">
    <example type="requirement-conflict" caption="the ambiguous-requirement smell">
      SPEC : "a late fee applies after 7 days overdue"

      CODE : if (daysOverdue &gt;  7) applyLateFee();
      MUT  : if (daysOverdue &gt;= 7) applyLateFee();

      On day 7 exactly, which one is correct?
    </example>
    <emphasis target="day 7" class="glow"/>
  </zone>

  <zone name="footer" area="row3 col1-12" class="callout-danger center">
    <point>The mutant did not find a bug in the code. It found a hole in the spec.</point>
  </zone>

  <build order="1:title+rule-line → 2:two red rows → 3:spec/code/mutant → 4:question → 5:footer" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"Now two cases where the normal reflex, 'write more tests', is simply wrong. That is why these rows sit below the line, separate from the four RIPR links.

The first is the equivalent mutant. No test can kill it, because there is no behavioural difference for an assertion to attach to.

The second is on the right. Our spec says a late fee applies 'after seven days overdue'. The code uses greater-than, the mutant uses greater-or-equal. So on day seven exactly, which is correct? The spec does not say.

That mutant did not find a bug in the code. It found a hole in the **specification**. So you stop and ask the business analyst. You do not quietly bend the test to match whatever the code does today."

**Evidence:**

- Measured taxonomy on e-Shop: `BASELINE.md` §5 — BOUNDARY_CONDITION_MISSED (355) · RETURN_VALUE_UNCHECKED (396, 405) · TRANSITION_PATH_UNTESTED (515, 510) · SEQUENTIAL_STATE_ASSUMPTION (268, 264).
- Ambiguous requirement example: late fee "after seven days overdue" — is it `>= 7` or `> 7`? A survivor here signals an unclear spec, not a missing test.

---

## Screen 14 — Put It at the Lowest Level Where the Behaviour Is Still Observable

> **Unchanged from master `S18`.**

**Purpose:** The placement rule and why it follows from RIPR.

**Outline Content:**

```xml
<slide id="S18" section="constraints" time="0:45" script-words="115">
  <layout template="split-50-50" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Put it at the lowest level where the behaviour is still observable</title>
    <definition term="observable" class="badge accent-blue">a result or side effect the test can really
      distinguish, not just a line that ran</definition>
  </zone>

  <zone name="levels" area="row2 col1-6" class="pyramid bottom-highlighted">
    <level name="API / E2E" class="tier" targets="public contracts, authorization, idempotency" policy="selective"/>
    <level name="Integration" class="tier" targets="transactions, locking, messaging" policy="selective"/>
    <level name="Component" class="tier" targets="workflows, state transitions, failure paths" policy="selective"/>
    <level name="Unit" class="tier accent-strong" targets="business rules, calculations, boundaries" policy="DEFAULT"/>
  </zone>

  <zone name="stage" area="row2 col7-12" class="cost-panel mono">
    <example type="chain-cost" caption="why the rule follows from RIPR">
      unit test        : mutation → assertion             2 hops · ~5 ms
      API test         : mutation → HTTP → JSON → assert  4 hops · ~120 ms
      E2E through a UI : mutation → … → DOM → assert      7 hops · ~4 s
    </example>
    <annotation class="micro muted">Every extra hop is one more place the difference can be swallowed.</annotation>
  </zone>

  <zone name="footer" area="row3 col1-12" class="rationale-strip">
    <rationale>Fewer intermediate systems → the RIPR chain completes more easily → a clean signal,
      and each survivor maps to exactly one fault hypothesis.</rationale>
  </zone>

  <build order="1:title+definition → 2:pyramid top-down → 3:cost rows → 4:rationale" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"So where should we apply this? Our rule is the **lowest level where the behaviour you care about is still observable**. By observable I mean a result or side effect the test can really distinguish, not just a line that ran.

This follows directly from RIPR. A mutant only dies when the difference completes all four links, so look at the panel on the right. In a unit test the difference travels two hops. Through an API, four. Through a browser, seven. Every extra hop is one more place where it can be swallowed, and one more order of magnitude on the clock.

That is why unit is our default. Not because it is easy, but because it gives the best signal for the cost."

**Evidence:** `seminar_content.md` §Placement Principle, §Unit-Level as Default. The hop-count and timing figures are illustrative `[I]` orders of magnitude, not measured on e-Shop.

---

## Screen 15 — Where It Pays, and Why Unit Is Only the First Layer

> **Merged screen** — combines master `S19` + `S20`. Kept: the FR-09 code shape with 81 mutants / 69.3%, the API-level honesty note, the over-mocking blind spot, the money/permissions/compliance exception, the closing operating rule. Cut: the full five-guard listing is compressed to three guards plus a count.

**Purpose:** One concrete route as the textbook case, then close the placement argument — unit is the first layer, not the whole strategy.

**Outline Content:**

```xml
<slide id="M05" from="S19+S20" section="constraints" time="0:55" script-words="145">
  <layout template="split-55-45" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">High logic density is where this pays — but unit is only the first layer</title>
  </zone>

  <zone name="stage" area="row2 col1-6" class="code-panel annotated-gutter">
    <example type="code-shape" language="js" caption="FR-09 · POST /api/apply-coupon · server.js:363-443">
      if (!coupon.is_active)                 return 400;  // guard 1
      if (total &lt; coupon.min_order_amount)   return 400;  // guard 2
      if (expiry &lt; now)                      return 400;  // guard 3  ← mutant 355
      …two more guards…
      discount = type === 'percent' ? total * pct / 100 : coupon.value;
    </example>
    <emphasis target="guard 3" class="arrow-from-gutter label:'mutant 355 lives here'"/>

    <example type="code" language="js" caption="the blind spot: over-mocking">
      jest.mock('./paymentGateway');
      expect(paymentGateway.charge).toHaveBeenCalled();
    </example>
    <emphasis target="toHaveBeenCalled()" class="glow danger" note="an INTERACTION, not a RESULT"/>
    <annotation class="micro danger">Mutate the amount passed to charge() and this test still passes.</annotation>
  </zone>

  <zone name="rail" area="row2 col7-12" class="stat-stack">
    <stat class="big" label="mutants in ONE route">81</stat>
    <stat class="big danger" label="kill rate">69.3%</stat>
    <note class="micro">the LOWEST of our four routes</note>
    <exception class="callout-accent" scope="money · permissions · compliance · tenant isolation">
      Defence in depth across ALL levels.
      One survivor in authorization outweighs hundreds in formatting code.
    </exception>
  </zone>

  <zone name="footer" area="row3 col1-12" class="split-2">
    <honesty-note class="cell callout-accent micro">Measured TODAY at the API route via supertest.
      Extracting this rule into a real unit is the NEXT step — we should not call today's
      measurement a unit test.</honesty-note>
    <operating-rule class="cell h2 center">Risk decides the number of defence layers,
      not the number of lines of code.</operating-rule>
  </zone>

  <build order="1:title → 2:code shape → 3:stats → 4:honesty note → 5:mock example → 6:exception → 7:operating rule" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"Our own coupon route is the textbook case. Look at the shape: five guards one after another, then two calculation branches, all in a single endpoint. That density shows up on the right — **eighty-one mutants in one route**, kill rate sixty-nine percent, the lowest of our four. And guard three is where mutant three hundred and fifty-five lives, the one from the beginning of the talk.

One honest note. Today we measure this route at the API level with supertest, not as an isolated unit. Extracting the rule is the next step, and we should not claim we already did it.

But unit testing has a known blind spot, in the second code block. If you mock too much, you hide the real behaviour. Here we check that the payment gateway **was called** — an interaction, not a result. Mutate the amount we pass to it, and this test still passes happily.

That is why unit is the first layer, not the whole strategy. For money, permissions, compliance or tenant isolation, we use defence in depth across all four levels. One sentence to remember: **risk decides the number of defence layers, not the number of lines of code.**"

**Evidence:**

- 5 guards (`is_active`, `min_order_amount`, `expired_at`, `user_id`, `max_uses_per_user`) + 2 calculation branches. `BASELINE.md` §3b: 81 mutants, 52 killed, 23 survived, 6 NoCoverage, kill rate 69.3% (vs FR-08 88.2%, FR-10 86.2%, FR-02 78.6%).
- The mock example is illustrative `[I]`.
- Module priority ranking for where to apply defence-in-depth: `mutation-testing-reference.md` §4.2.

---

## Screen 16 — Cost Is a Product, Not a Sum

> **Unchanged from master `S21`.**

**Purpose:** The cost constraint, made arithmetic.

**Outline Content:**

```xml
<slide id="S21" section="constraints" time="0:45" script-words="115">
  <layout template="stack" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Cost is a product, not a sum</title>
    <formula class="mono h2" label="naive upper bound — selection and early exit reduce this in practice">
      ≈ N_mutants × N_tests_per_mutant × time_per_test
    </formula>
  </zone>

  <zone name="stage" area="row2 col1-7" class="arithmetic-panel mono">
    <example type="arithmetic" caption="e-Shop, a tiny system">
      541 mutants × ~40 tests × ~24 ms   ≈  8 min 30 s   (concurrency 1)

      scale the codebase 20×, all else equal:
      10,800 mutants                     ≈  2 h 50 min per full run
    </example>
    <emphasis target="2 h 50 min" class="glow danger"/>
    <conclusion class="micro danger">There is no version of this that runs on every commit.</conclusion>
  </zone>

  <zone name="pointer" area="row2 col8-12" class="callout-accent forward">
    <pointer>The biggest constraint is not cost at all. It is the EQUIVALENT MUTANT:
      cannot be killed, no tool decides it soundly, reported rates 4% to 39%.</pointer>
    <forward-pointer class="micro muted">It gets the next three screens.</forward-pointer>
  </zone>

  <build order="1:title+formula → 2:e-Shop line → 3:scaled line → 4:conclusion → 5:pointer" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"Now cost, because this is where people get surprised.

As a **naive upper bound**, cost is the number of mutants, times the tests per mutant, times the time per test. Multiplication, not addition. Selection and early exit, which come shortly, pull the real figure below this.

But look at our numbers. e-Shop has five hundred and forty-one mutants and forty tests. A tiny system, and it already took eight and a half minutes. Scale the codebase twenty times and we are at nearly three hours per run. So there is no version of this that runs on every commit.

And on the right, the constraint that is bigger than cost: the **equivalent mutant**. It gets the next three screens."

**Evidence:** measured cost — `npm run stryker` on `server.js` (541 mutants, 40 tests, concurrency 1, Node v24.11.1) ≈ **8 min 30 s** wall-clock; report timestamp 2026-07-11 10:56:29 +07. Concurrency 1 is a deliberate reproducibility choice (SQLite shares one file), not a performance ceiling. The 20× extrapolation is illustrative `[I]`. Equivalent rate 4–39%: Madeyski et al. 2013, cited in Tian et al., ISSTA 2024 (arXiv:2408.01760).

---

## Screen 17 — Equivalent Mutants: Three Clauses, and Nobody Decides It For You

> **Merged screen** — combines master `S23` + `S24`. Kept: the three-clause definition (marked *never cut*), the `i < n` / `i != n` instance, undecidability, the "valid domain is a human decision" example, the one-question collapse. Cut: the standalone observation box is folded into the footer.
>
> Master screens `S25`–`S27` (three worked verdicts, one per case) are dropped from the 30-minute cut — `S28` keeps the control pair, and the audience meets real survivors hands-on in the *Kill the Mutant* activity instead.

**Purpose:** Define the concept precisely with an instance, then show why no tool can settle it and what question a human actually answers.

**Outline Content:**

```xml
<slide id="M06" from="S23+S24" section="constraints" time="0:55" script-words="145">
  <layout template="split-50-50" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Equivalent mutants: undecidable by tool, decided by a human</title>
  </zone>

  <zone name="definition" area="row2 col1-6" class="clause-stack numbered">
    <clause n="1" class="card">SYNTAX differs from the original. The source really changed.</clause>
    <clause n="2" class="card">BEHAVIOUR is identical for EVERY VALID INPUT —
      the same outputs AND the same side effects.</clause>
    <clause n="3" class="card accent-strong">⇒ NO test case, however strong, can kill it.</clause>
    <example type="code-pair" caption="textbook instance">
      original:  for (let i = 0; i &lt;  n; i++)
      mutant  :  for (let i = 0; i != n; i++)
    </example>
    <annotation class="micro">i starts at 0 and increases by 1, so it can never step over n.
      Different source. Identical behaviour. Forever.</annotation>
  </zone>

  <zone name="why" area="row2 col7-12" class="callout-danger">
    <why-no-tool>Detecting equivalence reduces to program equivalence, which is UNDECIDABLE.
      Static analysis or AI can only propose CANDIDATES.
      In the report it looks EXACTLY like a weak test: both rows say SURVIVED.</why-no-tool>
    <source class="micro muted">Budd &amp; Angluin, 1982</source>
    <example type="domain-shift" caption="'valid' is a human decision, not a tool setting">
      login_attempts ∈ {0, 2, 4, 6, …}  →  a mutant diverging at 3 is EQUIVALENT
      widen to {0, 1, 2, 3, …}          →  the SAME mutant becomes KILLABLE
    </example>
  </zone>

  <zone name="footer" area="row3 col1-12" class="callout-accent center h2">
    <observation>A relational-operator mutant differs from the original at EXACTLY ONE POINT:
      where both sides are equal. → The whole question collapses to:
      CAN THE PROGRAM REACH THAT POINT?</observation>
    <point class="micro danger">Writing more tests here is not hard. It is pointless.</point>
  </zone>

  <build order="1:title → 2:clause 1-3 → 3:code + annotation → 4:undecidability → 5:domain example → 6:the one question" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"So what exactly is an equivalent mutant? Three clauses, and all three matter. First, the **syntax differs** — the source really changed, so this is not the tool missing something. Second, the **behaviour is identical for every valid input**, same outputs and same side effects. Third, the consequence: **no test case can kill it**.

The example below is the textbook one. A loop with `i` less than `n` becomes `i` not equal to `n`. But `i` starts at zero and increases by one, so it can never step over `n`. Different source, identical behaviour, forever. Writing more tests here is not difficult — it is pointless.

Can a tool decide this for us? No, and not because tools are immature. Deciding whether two programs behave the same is **undecidable**. So static analysis, or AI, can only propose candidates. In the report, an equivalent mutant and a weak test look identical: both say Survived.

Then one word: **valid**. It means the domain your real system can produce. Widen that domain, and an equivalent mutant becomes killable. The tool does not know your domain. A human decides it.

And the question a human actually answers is at the bottom: **can the program reach the point where both sides are equal?**"

**Evidence:**

- The three-clause definition is marked **never cut** in the original cut plan. The `i < n` / `i != n` loop is the canonical textbook instance `[I]`.
- Undecidability of mutant equivalence — Budd & Angluin 1982. This is the one place in the deck where the argument is made in full.
- Worked verdicts kept in the master deck for Q&A: mutant 47 (Killed control case), mutant 355 (real gap, the demo mutant), mutants 535/536/537 at `server.js:L570` (`require.main === module` guard — equivalent candidate). Reach for these only if challenged.

---

## Screen 18 — Same Line, Same Tests, Two Different Verdicts

> **Unchanged from master `S28`.**

**Purpose:** The control pair — the single most important guard against misreading a report — plus the two caveats that keep the label honest.

**Outline Content:**

```xml
<slide id="S28" section="constraints" time="0:50" script-words="125">
  <layout template="stack" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Same line. Same four tests. One dies, one survives.</title>
  </zone>

  <zone name="stage" area="row2 col1-12" class="control-pair mono center">
    <example type="control-pair" caption="server.js:56 · both EqualityOperator · both coveredBy 4">
      #46   newAttempts &gt;= 3  →  &gt; 3     SURVIVED   (equivalent candidate)
      #47   newAttempts &gt;= 3  →  &lt; 3     KILLED
    </example>
    <emphasis target="#47 … KILLED" class="glow"/>
    <conclusion class="callout-danger">Reading "#46 Survived" as "this line needs more tests" is WRONG.
      This line HAS tests, and they are strong enough to kill a different mutant on it.</conclusion>
  </zone>

  <zone name="caveats" area="row3 col1-8" class="caveat-stack">
    <caveat n="1" class="card">Seed login_attempts = 1 straight into SQLite and #46 becomes killable.
      That is exactly why the claim was scoped to valid application state.
      The label stays "equivalent CANDIDATE, awaiting sign-off", never "equivalent, closed".</caveat>
    <caveat n="2" class="card accent-strong">Dataflow says "equivalent".
      Only the SPEC says whether locking on the 2nd failure is a bug.</caveat>
  </zone>

  <zone name="denominator" area="row3 col9-12" class="badge-strip danger">
    <denominator-note>No reviewer has signed #46, so it is STILL COUNTED against us
      in every score on this deck. Our numbers are floors.</denominator-note>
  </zone>

  <build order="1:title → 2:#46 row → 3:#47 row → 4:conclusion → 5:caveat 1 → 6:caveat 2 → 7:denominator" trigger="on-click"/>
  <design-note render-only="true">Never cut: the control pair, and caveat 2. Caveat 2 is the handoff
    into the AI section.</design-note>
</slide>
```

**Speaker Script:**
"Here is the line I would really like you to remember. Line fifty-six, in the login route, counts failed attempts. Mutant forty-six turns greater-or-equal three into greater-than three, and it **survives**. Mutant forty-seven changes the same comparison in the other direction, and it **gets killed**. Same line, same four covering tests, yet one dies and one survives.

So if you read 'Survived' on number forty-six and conclude that this line needs more tests, you are **wrong**.

Two honest caveats. First, seed the counter to one directly in SQLite and forty-six becomes killable. That is why I scoped the claim to valid application state. And since nobody has signed it off, forty-six is still counted against us in every number today.

The second matters more. Everything I just did was pure dataflow, and a machine can do that. What a machine cannot do is ask **what does the number three actually mean?** If the spec says lock after three failures, this code locks on the second, and the mutant has found a real bug."

**Evidence:** mutant 47 — line 56, `>= 3 → < 3`, **Killed**, coveredBy 4 — the control case. See also mutants 535/536/537 in `BASELINE.md` §4. **Never cut** (from the original cut plan): the 46/47 control pair and the closing "what does 3 mean" paragraph — it is the handoff into the AI section.

---

## Screen 19 — The Loop: One Human Gate, Then the Machine

> **Unchanged from master `S29`.**

**Purpose:** Steps 1–5, with step 1 as an absolute precondition.

**Outline Content:**

```xml
<slide id="S29" section="how" time="0:50" script-words="120">
  <layout template="stack" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Step 1 is a gate. Steps 2 to 5 are the tool.</title>
  </zone>

  <zone name="gate" area="row2 col1-5" class="gate-card danger-border">
    <step n="1" actor="human" type="gate" class="big">GREEN BASELINE
      <detail>100% pass first. Not green → stop.</detail></step>
  </zone>

  <zone name="stage" area="row2 col6-12" class="terminal-panel dark-panel mono">
    <example type="terminal" caption="why step 1 is absolute">
      baseline RED (39/40):
      $ stryker run
        mutant #212  →  1 test failed  →  reported KILLED

      but that test was ALREADY failing before the mutation.
    </example>
    <annotation class="micro danger">You cannot tell a detection from a pre-existing failure.
      Every number after this is noise.</annotation>
  </zone>

  <zone name="tool-block" area="row3 col1-8" class="boxed-group" label="THE TOOL DOES THIS">
    <step n="2">GENERATE mutants</step>
    <step n="3">DRY RUN — confirm green, record which test covers which mutant, set the timeout</step>
    <step n="4" class="accent-strong">SELECTIVE RUN — per mutant, run ONLY its covering tests
      <detail class="micro">naive = N × M, which does not scale</detail></step>
    <step n="5">CLASSIFY — Killed / Survived / NoCoverage / Timeout / Invalid</step>
  </zone>

  <zone name="scope-note" area="row3 col9-12" class="callout-accent">
    <scope-note>StrykerJS, PIT and MutPy all AUTOMATE generation, execution and reporting.
      Their OPTIMISATION details differ. AST instrumentation, mutation switching and
      coverageAnalysis:perTest are StrykerJS specifics. That is what we measured,
      and that is all we claim.</scope-note>
  </zone>

  <build order="1:title → 2:gate card → 3:terminal → 4:steps 2-5 → 5:scope note" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"Seven steps in the loop, and I will show which ones are the machine and which ones are you.

Step one is an absolute gate. **Your suite must be one hundred percent green on the original code first.** The terminal on the right shows why. If your baseline is red, the run reports a kill, but the test that failed was already failing before the mutation. You cannot separate a detection from a pre-existing failure, so every number after that is noise.

The next four go into one box, because the tool does them for you. StrykerJS, PIT and MutPy all **automate** generation, execution and reporting, but their optimisations differ, so I will describe only the one we measured. Stryker instruments the code once, runs a dry run, then for each mutant runs only the tests that cover it. That step is what makes this feasible at all."

**Evidence:**

- Our real config (`apps/backend/stryker.config.mjs`): `coverageAnalysis: "perTest"`, `timeoutMS: 60000`, `timeoutFactor: 2`, `concurrency: 1` (required because SQLite uses one shared file).
- Step 1 confirmed: the full suite was 40/40 before the mutation run.
- Tool comparison, kept as Q&A material rather than spoken (three engine architectures with no visual anchor was the densest unanchored passage in the original deck, and it does not serve this screen's message): **StrykerJS** — AST (Babel) + mutation switching via `__STRYKER_ACTIVE_MUTANT__`; perTest coverage default since v5. **PIT** — bytecode (ASM, Gregor engine) + hot-swap into a running JVM; per-test block coverage, fast tests prioritised, early exit on kill; `allTestsGreen()` gate. **MutPy** — AST (`ast` module); `--coverage` only limits the mutated region — public docs do not state whether it has mutation switching or per-mutant test selection, so we claim only what is verifiable.
- Grouping steps 2–5 into one "TOOL" box is our own presentation choice, not any tool's own phase model.

---

## Screen 20 — Step 6 Is the Only Step That Creates Value

> **Unchanged from master `S30`.**

**Purpose:** Six possible fixes, not one — and only two of them are "write a test".

**Outline Content:**

```xml
<slide id="S30" section="how" time="0:50" script-words="115">
  <layout template="stack" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Step 6: six directions, and only two are "write a test"</title>
    <actor-badge class="badge amber">HUMAN — this is the only step that creates value</actor-badge>
  </zone>

  <zone name="stage" area="row2 col1-12" class="decision-table three-col">
    <example type="decision-list" caption="one survivor, six possible responses — pick with RIPR">
      Revealability broke   →  tighten the assertion       expect(res.body.total).toBe(450000)
      Infection broke       →  change the test DATA        add(2,3) instead of add(0,0)
      Reachability broke    →  add a test case             a request that hits guard 4
      Propagation (a)       →  REFACTOR PRODUCTION CODE    delete the dead `return 20`
      Ambiguous spec        →  ASK THE BA                  "day 7: fee or no fee?"
      Equivalent            →  RECORD IT + sign off        // Stryker disable next-line
    </example>
    <emphasis target="rows 1-3" class="tint-green" note="test-side fixes"/>
    <emphasis target="rows 4-6" class="tint-red" note="NOT test-side"/>
  </zone>

  <zone name="step7" area="row3 col1-8" class="step-card">
    <step n="7" actor="human">RE-RUN AND CONFIRM that the target mutant moved to Killed</step>
  </zone>

  <zone name="loop" area="row3 col9-12" class="loop-arrow" from="7" to="4">
    <loop-back>Re-run execution only. No need to regenerate the mutants.</loop-back>
  </zone>

  <build order="1:title → 2:six rows one by one → 3:colour tint → 4:step 7 → 5:loop arrow" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"Step six is the only place where value is actually created, and it is also the only place that really needs a human.

You read the survivor list and you choose one of six directions. And please notice the colours: only the first three are test-side fixes. You can tighten an assertion, change the test data, or add a test case. But you can also refactor the production code, stop and ask the business analyst, or record an equivalent and sign it off.

You choose using the RIPR diagnosis we saw earlier. So seeing a survivor does not automatically mean writing another test.

Then step seven: re-run, and confirm that this specific mutant is now killed. You only re-run the execution. The mutants do not need to be generated again."

**Evidence:** each example maps to a real case shown earlier in this deck (S15, S16, S17, S28) — this screen isolates step 6 from the tool comparison that used to share its slide in the original deck (see S29 Evidence).

---

## Screen 21 — Four Levers, and Why Diff-Scoping Is Permanent

> **Merged screen** — combines master `S31` + `S32`. Kept: all four levers, the sleep-amplification arithmetic, the incremental-mode runner condition, the PROPOSED badge, the tier ladder, the cost asymmetry. Cut: the tier list is compressed from five labelled steps to three bands.

**Purpose:** Answer the cost constraint with mechanisms, then give the one economic fact that makes diff-scoping permanent rather than a stopgap.

**Outline Content:**

```xml
<slide id="M07" from="S31+S32" section="how" time="0:55" script-words="145">
  <layout template="split-55-45" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Four levers — and the cost asymmetry that makes diff-scoping permanent</title>
    <status-badge class="badge red top-right sticky">TIERING IS PROPOSED — not implemented in e-Shop</status-badge>
  </zone>

  <zone name="levers" area="row2 col1-6" class="lever-stack numbered compact">
    <lever n="1" name="fewer mutants" class="card">diff scope · module rotation · a stable operator set</lever>
    <lever n="2" name="fewer tests per mutant" class="card">coverage-based selection · bail on first kill</lever>
    <lever n="3" name="cheaper tests" class="card">remove sleeps · inject the clock · deterministic fakes</lever>
    <lever n="4" name="incremental" class="card accent-strong">reuse previous results · run only what the diff affects</lever>
    <example type="amplification" caption="why lever 3 matters more than people expect">
      one await sleep(2000) in a shared setup
        normal run           :  2 s
        81 mutants           :  2 min 42 s
    </example>
    <emphasis target="2 min 42 s" class="glow danger" note="from ONE sleep"/>
  </zone>

  <zone name="tiers" area="row2 col7-12" class="ladder-steps compact">
    <tier n="0-1" class="step accent-strong" trigger="commit · every PR" scope="changed code, unit, incremental"/>
    <tier n="2" class="step" trigger="PR touches payment / auth / tenant" scope="+ component + selected integration"/>
    <tier n="3-4" class="step" trigger="nightly · before release" scope="module rotation · critical services + survivor review"/>
    <example type="asymmetry" caption="why more workers do not solve this">
      full repo   : cost grows with the SIZE OF THE CODEBASE  →  grows forever
      diff-scoped : cost bounded by the SIZE OF THE CHANGE    →  stable forever
    </example>
    <eshop-anchor class="micro">Our tier-1 unit = the coupon route, 81 mutants.
      Same cost next year, whatever the repo has grown to.</eshop-anchor>
  </zone>

  <zone name="footer" area="row3 col1-12" class="condition-strip">
    <incremental-condition>Incremental needs precise change detection.
      Jest matches per TEST · Vitest and Mocha match per FILE. Your runner choice caps lever 4.</incremental-condition>
  </zone>

  <build order="1:title+badge → 2:levers 1-3 → 3:amplification → 4:lever 4 + condition → 5:tiers → 6:asymmetry" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"So how do we make this affordable? Four levers. Generate fewer mutants, by mutating only the diff. Run fewer tests per mutant, using coverage-based selection. And make the tests themselves cheaper.

That third one matters more than people expect. **Mutation testing amplifies everything slow in your suite.** One sleep of two seconds is fine in a normal run. Across eighty-one mutants it becomes almost three minutes, from a single line.

The fourth lever is what makes CI possible: **incremental mode**. Store the previous run, re-run only what the diff affects. One condition, at the bottom: it must know exactly which tests changed. Jest matches per test, while Vitest and Mocha only match per file.

On the right, one label first — **this tiering is a proposal**, e-Shop has no CI pipeline running mutation testing today. The shape is the message: scope grows as the trigger gets rarer. Every pull request runs changed code only; payment and authentication escalate; the full baseline waits for nightly.

Somebody always says: just add more workers. But full-repo cost grows with the codebase. Diff-scoped cost is bounded by the size of the change. More workers only buy time on the first one."

**Evidence:**

- StrykerJS incremental (checked 01/08/2026): available since v6.2; stores `reports/stryker-incremental.json`. Granularity — Jest = Full (per test) · Vitest/Mocha/Tap = per file · Jasmine/Karma = test name only · Command runner = none. e-Shop uses Jest.
- The sleep-amplification arithmetic is illustrative `[I]` over our measured 81-mutant route.
- Diff-scoped unit for tier 1: the coupon route `server.js:363-443`, 81 mutants — cost bounded by diff size, not repo size.
- External validation dropped from this cut (kept in master `S34`): Google runs diff-scoped mutation testing with operator filtering across its monorepo. Use it in Q&A if asked "does anyone actually do this at scale?"

---

## Screen 22 — Gate on Risk, Not on a Percentage

> **Unchanged from master `S33`.**

**Purpose:** The one gating rule that matters, and what a healthy policy asks instead.

**Outline Content:**

```xml
<slide id="S33" section="how" time="0:50" script-words="120">
  <layout template="stack" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">One repo-wide percentage teaches the team to optimise the number</title>
    <status-badge class="badge red top-right sticky">PROPOSED — not implemented in e-Shop</status-badge>
  </zone>

  <zone name="stage" area="row2 col1-8" class="ci-policy-panel two-band">
    <example type="ci-policy" caption="what the gate should say, and who owns each part">
      BLOCK the merge when:                              owner
        survivor on authorization or money logic         QA reviewer
        critical code changed, new mutants NoCoverage    QA reviewer
        a new survivor nobody can explain                module owner, 1 working day

      WARN, do not block, when:
        the score dropped slightly
        equivalent candidates awaiting review            reviewer named in the record
        fewer than 10 mutants in the diff
    </example>
    <band class="band-red" anchor="BLOCK"/>
    <band class="band-amber" anchor="WARN"/>
  </zone>

  <zone name="governance" area="row2 col9-12" class="governance-card">
    <artefact>mutation.json + mutation.html attached to the PR</artefact>
    <record>every equivalent exclusion carries a reason AND a signature</record>
    <wrong class="micro danger">A single threshold invites: exclude the hard packages,
      disable the strong operators, add assertions purely to kill mutants.</wrong>
  </zone>

  <zone name="footer" area="row3 col1-12" class="closing-question center h2">
    <closing-question>Which wrong behaviour is going undetected, where, how risky,
      and who owns fixing it? — NOT: what is the score?</closing-question>
  </zone>

  <build order="1:title+badge → 2:BLOCK band → 3:WARN band → 4:governance → 5:closing question" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"Same label here: a proposal, not our practice.

My main point is that you should not set one repo-wide percentage. That does not reduce risk. It teaches the team to optimise the number instead: exclude the hard packages, disable the strong operators, add assertions purely to kill mutants.

Gate on risk. The red band **blocks** the merge: a survivor in authorization or money logic, critical code changed with nothing covering it, or a new survivor nobody can explain. The amber band only **warns**.

And on the right, a policy is not enforceable without three things. Every rule needs an **owner**, the report must be attached to the pull request, and every equivalent exclusion needs a reason and a signature.

So the question a healthy policy asks is at the bottom: which wrong behaviour is undetected, where, how risky, and who owns it."

**Evidence:**

- Dropped in the original deck's scope decision, and recoverable as a backup slide if asked: the per-tier threshold table (critical 90 / high 80 / medium must-not-drop).
- Scope rationale carried from the original deck: mutation testing only means something once the audience knows *where* to apply it, so the placement discussion (S18–S20) carries weight a raw gating threshold table does not — that is why the table stayed cut rather than being restored here.
- What survived that original cut and is kept on this screen: the "one repo-wide percentage makes teams optimise the number" warning, the block/warn split, and the closing question into the demo.

---

## Screen 23 — The Agent Pipeline Merges on 80.2% Weak Oracles

> **Merged screen** — combines master `S35` + `S36`. Kept: the acceptance-criteria pipeline, the link back to the WHY section, the labelled INTERPRETATION box, the 80.2% figure, the unit-of-measure warning, the quotable finding, the full footnote. Cut: 80.2% loses its dedicated full-screen treatment — it now shares the screen with the pipeline that produced it.

**Purpose:** Show that the criteria we disproved in the first section are exactly the criteria being applied to AI output — and put the measured consequence next to it.

**Outline Content:**

```xml
<slide id="M08" from="S35+S36" section="ai-direction-A" time="0:55" script-words="145">
  <layout template="split-50-50" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">The agent workflow uses exactly the criteria we just disproved</title>
  </zone>

  <zone name="pipeline" area="row2 col1-6" class="pipeline-flow center">
    <example type="pipeline" caption="what most teams merge on today">
      agent writes tests → tests pass → coverage rises → MERGE
    </example>
    <callout class="badge red">that is the entire acceptance criteria</callout>
    <link-back class="callout-accent micro">"It runs" and "coverage went up" are the two signals
      the first section proved insufficient — now applied to HUNDREDS of tests generated in
      SECONDS, instead of a few dozen written by hand over days.</link-back>
    <why class="interpretation-card micro">
      <label class="badge amber">INTERPRETATION — our inference, not a study result</label>
      A model optimises what is MEASURED and REWARDED. Coverage is measurable and easy —
      you only have to call the function. A strong oracle has no signal rewarding it.
    </why>
  </zone>

  <zone name="stage" area="row2 col7-12" class="single-number center">
    <number class="display-xxl">80.2%</number>
    <title class="h2">of sampled agent-authored test patches: weak oracle, or no explicit oracle</title>
    <clarify class="callout-accent micro">There IS a test file. There IS a test function.
      The code IS called. CI is green. No strong signal ties the assertion to expected behaviour.</clarify>
    <unit-of-measure class="callout-danger micro">The unit is a PATCH classified by the study,
      not a test case audited by us. A RISK SIGNAL, not proof that every one of those tests
      has zero value.</unit-of-measure>
    <example type="quotable-finding" class="quote">
      "Coding agents generate test STRUCTURE far more reliably
       than they generate ORACLE LOGIC."
    </example>
  </zone>

  <zone name="footer" area="row3 col1-12" class="meta-strip micro muted">
    <footnote>Banik, Chowdhury &amp; Shamim, "All Smoke, No Alarm", arXiv:2606.18168 —
      86,156 test-file patches · 5 tools (Codex · Copilot · Devin · Cursor · Claude Code)</footnote>
  </zone>

  <content-budget render-only="true">Exactly ONE number spoken from the right zone. Sample sizes stay
    in the footnote and in Q&amp;A.</content-budget>
  <build order="1:title → 2:pipeline → 3:acceptance callout → 4:link-back → 5:the number → 6:unit warning → 7:interpretation" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"Now the part that connects most directly to how everyone here is working right now.

Look at the pipeline on the left. The agent writes tests, they pass, coverage goes up, and we merge. For many teams that is the *entire* acceptance criteria — and those are exactly the two signals we disproved in the first section, now applied to hundreds of tests generated in seconds.

Somebody measured the consequence at scale. A study this year scanned agent-authored **test-file patches** across five tools and classified **eighty point two percent** of them as weak-oracle, or no explicit oracle at all.

Let me be precise. The unit is a patch, classified by their scheme, not a test case we audited. So it is a **risk signal**, not proof that every one of those tests is worthless. But look at what it means in practice: there is a test file, a test function, the code is called, CI is green — and nothing strong connects the assertion to the expected behaviour. Agents generate test **structure** far more reliably than **oracle logic**.

Why? The amber box is **our interpretation, not a study result**. A model optimises whatever is measured and rewarded. Coverage is easy to measure. A strong oracle has nothing rewarding it."

**Evidence:**

- Current-practice framing carried from the original deck's slide 13.
- Banik, Chowdhury & Shamim, arXiv:2606.18168, full text verified 01/08/2026. 86,156 patches, 33,596 agent PRs, 2,807 repos, Dec 2024 – Jul 2025. Strong value assertions (S1) 11.3%; multi-signal strong oracles (S3) 5.7%; per-tool strong-oracle rate on new files 18% (Codex) → 67% (Claude Code), χ² = 810.2, p < 0.001; Cohen's κ = 0.77.
- Three caveats if challenged: (a) the unit is a **patch**, not a test case; (b) repos filtered to 100+ stars; (c) Codex is 65% of the sample.
- Hardest expected challenge: Yoshimoto et al., arXiv:2603.13724 (AI tests show higher assertion density) — answer: counting assertions is not evaluating what they verify; that paper's own future work calls for mutation testing to settle it.

---

## Screen 24 — Two Ways the Oracle Breaks — in Code

> **Unchanged from master `S37`.**

**Purpose:** Make the failure modes recognisable, not describable. Both look reasonable when read.

**Outline Content:**

```xml
<slide id="S37" section="ai-direction-A" time="0:45" script-words="110">
  <layout template="split-50-50" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Both of these pass review. Neither kills a mutant.</title>
  </zone>

  <zone name="type1" area="row2 col1-6" class="code-panel numbered">
    <example type="code" language="js" caption="1 — SELF-CONFIRMING">
      const result = calculateTotal(cart);
      expect(result).toBe(calculateTotal(cart));
    </example>
    <annotation class="micro danger">passes on the original · passes on EVERY mutant</annotation>
    <verdict class="pill">asserts the implementation against itself</verdict>
  </zone>

  <zone name="type2" area="row2 col7-12" class="code-panel numbered">
    <example type="code" language="js" caption="2 — IMPLEMENTATION-BOUND">
      expect(Object.keys(res.body)).toEqual(['id', 'total', 'status']);
    </example>
    <annotation class="micro danger">breaks on a harmless field reorder ·
      detects no behavioural fault at all</annotation>
    <verdict class="pill">asserts structure, not behaviour</verdict>
  </zone>

  <zone name="footer" area="row3 col1-12" class="progress-dots">
    <dot n="1" class="active">self-confirming</dot>
    <dot n="2" class="active">implementation-bound</dot>
    <dot n="3">wrong oracle → next screen</dot>
  </zone>

  <build order="1:title → 2:type 1 code → 3:type 1 annotation → 4:type 2 code → 5:type 2 annotation" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"There are three ways the oracle breaks, and I want to show you two of them as real code. Notice that both of these look perfectly reasonable when you read them.

The first one is **self-confirming**. The test asserts that the result equals what the implementation just produced. So it passes on the original, and it also passes on every single mutant. It kills nothing.

The second one is **implementation-bound**. Here we assert the exact set of keys in the response. If somebody reorders a field in a harmless refactor, this test goes red. But if somebody breaks the actual calculation, it stays green. It is checking structure, not behaviour."

**Evidence:** this screen is the canonical home for the three broken-oracle types, carried from the original deck's slide 13 — the later gate screen (S41) calls back in one clause instead of re-enumerating them, since the original deck repeated the full list in the same order twice. Code instances are illustrative `[I]`, written to match the paper's W1–W5 weak-oracle categories (see S36 for the source paper).

---

## Screen 25 — The Third Way: The Model Asserts a Bug Is Correct

> **Unchanged from master `S38`.**

**Purpose:** The failure mode a human reviewer cannot catch by reading — which forces the behavioural gate.

**Outline Content:**

```xml
<slide id="S38" section="ai-direction-A" time="0:45" script-words="120">
  <layout template="split-60-40" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">3 — WRONG ORACLE: the model recalls buggy logic and asserts it is right</title>
  </zone>

  <zone name="stage" area="row2 col1-7" class="code-panel">
    <example type="code" language="js" caption="from our own repo — BUG-09-001 pinned as the expected value">
      // server.js applies a percentage discount with the wrong sign
      expect(res.body.discount).toBe(-4500000);
    </example>
    <emphasis target="-4500000" class="glow danger" note="pins the BUG as if it were the spec"/>
    <outcome-list class="micro">
      <li class="ok">the test is green</li>
      <li class="ok">the mutant is killed</li>
      <li class="danger">the oracle is wrong</li>
    </outcome-list>
  </zone>

  <zone name="shared" area="row2 col8-12" class="callout-accent">
    <shared-weakness>All three: code review MAY catch them, but not reliably.
      Reading establishes suspicion. It does not establish detection power.</shared-weakness>
  </zone>

  <zone name="conclusion" area="row3 col1-8" class="conclusion-strip accent-strong">
    <conclusion>Give the suite a KNOWN behavioural deviation and see if it catches THAT deviation.
      That is mutation testing, unchanged. What changed is the ROLE:
      from nice-to-have to ACCEPTANCE CRITERION.</conclusion>
  </zone>

  <zone name="scope-limit" area="row3 col9-12" class="badge-strip amber">
    <scope-limit>It proves detection of the deviations you injected.
      It does not prove the oracle is complete, or business-correct.</scope-limit>
  </zone>

  <build order="1:title → 2:code → 3:three outcomes → 4:shared weakness → 5:conclusion → 6:scope limit" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"The third way is the **wrong oracle**. The model recalls logic that looks plausible, sometimes buggy logic from its training data, and asserts that it is correct.

We have a real one in our own repository. This assertion pins the exact value of a known bug. So the test is green, the mutant is even killed, and the oracle is still wrong.

What all three share is on the right. Code review **may** catch them, but not reliably. Reading gives you suspicion. It does not give you detection power.

So what is left? Give the suite a deviation you **already know about**, and see whether it catches that deviation. That is mutation testing, unchanged. What changed is its role, from nice-to-have to acceptance criterion.

And keep the scope honest. It proves detection of the faults you injected. Nothing more."

**Evidence:** mutant 397 (`ArithmeticOperator`, `server.js:L420`) and BUG-09-001 — `BASELINE.md` §6. Meta TestGen-LLM (Alshahwan et al., FSE 2024, arXiv:2402.09171: 75% build, 57% pass reliably, 25% raise coverage, 73% accepted) stays Q&A backup. **Correction to an earlier draft:** Meta's "assured improvement" signal **is** coverage; the lesson is "you need a mandatory automated gate", not "industry already gates on mutation score". Replacing coverage with mutation score is our proposal `[I]`. Honest limitation if asked: we have **not** measured mutation score on a fully AI-generated suite.

---

## Screen 26 — One Prompt Is Checkable. The Other Is Not

> **Unchanged from master `S39`.**

**Purpose:** The process fix, shown as two real prompts.

**Outline Content:**

```xml
<slide id="S39" section="ai-direction-B" time="0:45" script-words="115">
  <layout template="stack" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">The difference is one attachment: a concrete deviation</title>
  </zone>

  <zone name="weak" area="row2 col1-6" class="prompt-card red-border">
    <label class="badge red">WEAK</label>
    <example type="prompt" caption="what most people type">
      "Write tests for the applyCoupon function."
    </example>
    <annotation class="micro danger">No correctness criterion.
      Nothing to check the answer against.</annotation>
  </zone>

  <zone name="strong" area="row2 col7-12" class="prompt-card green-border">
    <label class="badge green">STRONG</label>
    <example type="prompt" caption="paste-ready — nothing custom, nothing built">
      "Here is server.js:382 and mutant 355:
         -  if (expiry &lt;  now)
         +  if (expiry &lt;= now)
       Write ONE test that PASSES on the original
       and FAILS on this mutant."
    </example>
    <annotation class="micro ok">BINARY criterion. MACHINE-CHECKABLE.</annotation>
  </zone>

  <zone name="footer" area="row3 col1-12" class="callout-accent center h2">
    <difference>The only difference: the second one ships a concrete deviation with it.</difference>
  </zone>

  <build order="1:title → 2:weak prompt → 3:strong prompt → 4:difference" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"Let me start with the process problem.

If you tell a model 'write tests for this function', like the card on the left, you have no way of knowing whether what comes back is worth anything. There is no correctness criterion attached.

Now look at the card on the right. You say instead: here is the mutant, write a test that **passes on the original and fails on this mutant**. Suddenly a vague task has a binary criterion, and that criterion is **machine-checkable**.

The only real difference is that the second prompt ships a concrete deviation with it. No plugin, no script, no custom model. A command-line tool you already have, plus a chat window."

**Evidence:** the prompt text is our own working formulation, used in weeks T6–T7 — carried from the original deck's slide 14, which combined this contrast, the seven-step loop, and the gate example into one screen; those two are now separate (S40, S41).

---

## Screen 27 — The Same Seven Steps, and the Gate Is One Command

> **Merged screen** — combines master `S40` + `S41`. Kept: the actor-coded seven-step loop, the "why a gate at all" callback, the gate definition, the real mutant 397 terminal output, the PROVES / DOES NOT PROVE pair, the dual-role note and our n=5 count. Cut: the standalone reject/accept decision block is folded into the terminal caption.
>
> This screen also absorbs the job of master `S42`–`S43`, which walked the same three AI insertion points a second time in more detail. Those are dropped from the 30-minute cut.

**Purpose:** Show that nothing new was invented — the deterministic core is untouched — and make the Validation Gate concrete, including its green-but-wrong outcome.

**Outline Content:**

```xml
<slide id="M09" from="S40+S41" section="ai-direction-B" time="0:55" script-words="150">
  <layout template="split-50-50" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Not a new process — the same loop, with AI at three points, gated by one command</title>
  </zone>

  <zone name="loop" area="row2 col1-6" class="loop-steps actor-coded">
    <steps range="1-4" actor="CLI" class="band-grey">generate · run · classify
      <detail>DETERMINISTIC. AI does not touch this.</detail></steps>
    <step n="5" actor="LLM" class="band-blue">read the survivor → which RIPR link is broken?</step>
    <step n="6" actor="LLM + human" class="band-blue-amber">suspected equivalent → LLM triages, HUMAN signs.
      Otherwise → LLM writes an assertion targeting that mutant.</step>
    <step n="7" actor="CLI" class="band-grey accent-strong">re-run ← THIS IS THE VALIDATION GATE</step>
    <legend class="micro">grey = deterministic CLI · blue = LLM · amber = human</legend>
    <why class="callout-danger micro">The LLM's assertion fails in the SAME three ways you just saw:
      self-confirming · implementation-bound · wrong oracle. Reading may catch some. Not reliably all.</why>
  </zone>

  <zone name="stage" area="row2 col7-12" class="terminal-panel dark-panel mono">
    <example type="terminal" caption="mutant 397 — a real pass through the gate. Did Survived become Killed?">
      $ npx stryker run --mutate "server.js:363-443" --incremental

        #397  ArithmeticOperator  L420   Survived → KILLED   killedBy: ["1"]
              on the mutant: expected -4500000, received -55556
    </example>
    <decision class="micro">NO → the assertion cannot detect this deviation. REJECT.
      YES → necessary, not sufficient → human review (HG-3).</decision>
    <proves class="proves-card two-band">
      <band class="band-green" label="PROVES">this test distinguishes the original
        from THIS ONE known deviation</band>
      <band class="band-red" label="DOES NOT PROVE">the oracle is complete · the requirement is right ·
        there are no other blind spots · the test is safe to merge</band>
    </proves>
  </zone>

  <zone name="footer" area="row3 col1-12" class="definition-bar amber split-3">
    <what-the-gate-is class="cell">The gate is a TARGETED FAULT-DETECTION CHECK for ONE specified
      deviation. It is not a complete grade of the oracle.</what-the-gate-is>
    <dual-role class="cell">Same gate, two roles: it checks agent-written tests,
      AND the assertion the LLM just wrote.</dual-role>
    <our-data class="cell">Week T6: 5 assertions through the gate — 3 used as-is,
      2 hand-corrected, 0 rejected. <span class="muted">n = 5, our own count</span></our-data>
  </zone>

  <build order="1:title → 2:steps 1-4 → 3:steps 5-7 → 4:why → 5:command → 6:result line → 7:PROVES → 8:DOES NOT PROVE → 9:footer" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"I want to be clear that this is not a new process. It is the same seven-step loop, with AI inserted at three points, and the colours show who does what.

Steps one to four stay on the command line and stay deterministic. At step five we ask the model one question: which RIPR link is broken? At step six, if we suspect an equivalent, the model triages it and a human signs off — otherwise the model writes an assertion aimed at that mutant. And step seven, the re-run, **is** the Validation Gate. We need it because the model's assertion can fail in the same three ways we just saw.

When I say 're-run', I mean it literally. Same file, same command, on the right. Open the report, find that mutant ID, ask one question: did Survived become Killed?

Here is a real one from our repository. Mutant three ninety-seven flipped to Killed, because on the mutant the assertion expected minus four and a half million and received minus fifty-five thousand.

If it does not flip, we reject the assertion. If it does flip, that is necessary but **not sufficient** — it proves the test distinguishes one known deviation. It does not prove the oracle is complete, or safe to merge. Our own numbers are small and honest: five assertions, three used as written, two hand-corrected."

**Evidence:**

- The "one gate, two roles" framing is carried from the original deck's slide 14 — it is the only sentence connecting the two AI directions (grading vs. writing tests).
- Mutant 397 gate example, `BASELINE.md` §6.
- MuTAP (Dakhel et al., *Information & Software Technology* 2024, arXiv:2308.16557, full text verified 30/07/2026): 93.57% vs 65.94% Pynguin on HumanEval; 94.91% vs 67.54% on Refactory — **always name the benchmark**, there are two pairs. Caveat: sensitive to model version, temperature and benchmark contamination. Q&A material in this cut.
- Internal measurement (2026-07-30, `server.js:363-443`, 81 mutants): adding a test without touching source → **0/81 mutant IDs shifted**; `--incremental` gave **0 status differences** vs a full run, in seconds instead of minutes.
- Dropped with `S42`–`S43` but kept for Q&A: the suppression-button control (an equivalent candidate may only be suppressed narrowly, with a documented reason and a named reviewer).

---

## Screen 28 — What AI Does Not Remove

> **Unchanged from master `S44`.**

**Purpose:** The anti-hype close of the AI section.

**Outline Content:**

```xml
<slide id="S44" section="ai-map" time="0:40" script-words="105">
  <layout template="split-50-50" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">What AI does not remove</title>
  </zone>

  <zone name="list" area="row2 col1-6" class="strike-list">
    <item class="row">the equivalent mutant problem — a mathematical property, not a tooling limitation</item>
    <item class="row">flaky tests</item>
    <item class="row">the cost of running mutants</item>
    <item class="row">the oracle problem</item>
    <item class="row">the need for a human to sign off</item>
    <emphasis target="row 1, row 5" class="glow" note="the only two spoken aloud"/>
  </zone>

  <zone name="stage" area="row2 col7-12" class="callout-danger evidence">
    <example type="evidence-gap" caption="the honest state of the field">
      Across every source in this talk — MuTAP, MUTGEN, LLMorpheus,
      TestGen-LLM, UniXCoder EMD — NOT ONE demonstrates a working
      autonomous loop with no human sign-off.
      Every published pipeline keeps a human at the oracle-correctness step.
    </example>
  </zone>

  <zone name="footer" area="row3 col1-12" class="takeaway-band center display-l">
    <takeaway>AI shortens triage TIME. It does not shorten RESPONSIBILITY.</takeaway>
  </zone>

  <build order="1:title → 2:five items → 3:evidence gap → 4:takeaway" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"There are five things on this list, and I will only say two of them out loud.

The first one: AI does not remove the equivalent mutant problem. That is a mathematical property, not a limitation of today's tools.

The last one: it does not remove the human sign-off. And the box on the right is the honest state of the field. Across every source in this talk, not one of them demonstrates a working autonomous loop. Every published pipeline still keeps a human at the oracle-correctness step.

The other three you can read yourselves.

So my takeaway is at the bottom. AI shortens triage **time**. It does not shorten **responsibility**."

**Evidence:** the "usable now?" column on S42/S43 replaces the four-level maturity axis (established / emerging / experimental / speculative) used in the original deck's slide 15 — that axis is retained in appendix §4.8 and backup slide B8 if a more granular view is asked for. The 85% figure referenced by "the same imprecision problem, worse" is the Google evidence already cited on S34.

---

## Screen 29 — Demo: One Surviving Mutant, Audited and Fixed by AI

> **Unchanged from master `S45`.**

**Purpose:** Set up the live demo: the SUT, the baseline that "looks fine", the two tools, and the three steps about to happen.

**Outline Content:**

```xml
<slide id="S45" section="demo" time="0:50" script-words="125">
  <layout template="stage-rail" grid="12col"/>

  <zone name="header" area="row1 col1-12">
    <title class="h1">Demo: one surviving mutant, audited and fixed by AI</title>
    <sut class="eyebrow">POST /api/apply-coupon · FR-09 · server.js:363-443 —
      the density case from earlier, and it is money logic</sut>
  </zone>

  <zone name="stage" area="row2 col1-8" class="terminal-panel dark-panel mono">
    <example type="terminal" caption="the baseline, three commands">
      $ npm test                                     →  40/40 pass
      $ npm run test:coverage                        →  server.js 51.66% lines, 45.8% branches
      $ npx stryker run --mutate "server.js:363-443" →  81 mutants
                                                        52 killed · 23 survived · 6 no-coverage
                                                        kill rate 69.3%
    </example>
    <scope-note class="micro muted">Coverage here is WHOLE-FILE, deliberately a different scope
      from the opening numbers, because the demo scope is one route.</scope-note>
  </zone>

  <zone name="rail" area="row2 col9-12" class="steps-card numbered">
    <coming-up render="live, no slide">
      <step n="1">Claude Code AUDITS mutant 355 — diagnoses it with RIPR</step>
      <step n="2">Claude Code WRITES an assertion targeting that exact mutant</step>
      <step n="3">VALIDATION GATE — same scope, re-run — decides if it merges</step>
    </coming-up>
    <tooling class="micro">StrykerJS 9.6.1 + Claude Code. No new infrastructure.</tooling>
  </zone>

  <zone name="footer" area="row3 col1-12" class="command-band mono accent-strong">
    <exact-gate-command>The literal command that will run live:
      $ npx stryker run --mutate "server.js:363-443" --incremental</exact-gate-command>
    <note class="micro">Same scope as the baseline. --incremental only makes it finish in seconds;
      we verified 0 status differences against a full run on the same state.</note>
  </zone>

  <status render-only="true">Live result: PLANNED. Actual terminal output replaces this after the run.</status>
  <build order="1:title+sut → 2:three commands → 3:three demo steps → 4:exact command" trigger="on-click"/>
</slide>
```

**Speaker Script:**
"This is our system under test. The coupon route, the density case from earlier, and remember it is money logic. That is exactly where one survivor becomes expensive.

Look at the three commands. `npm test` gives forty out of forty. Coverage is about fifty-one percent of lines, and note this is whole-file coverage, a different scope from the opening numbers. Then Stryker, scoped to the coupon route: eighty-one mutants, twenty-three surviving.

So every normal signal reads as passing.

Now we take mutant three hundred and fifty-five and let Claude Code audit it and fix it. Then the gate runs at the same scope. The exact command is at the bottom, so you can check what I type against it. The decision comes from the re-run, not from the model's opinion of its own work."

**Evidence:** `BASELINE.md` §3b (FR-09: 81 total, 52 killed, 23 survived, 6 NoCoverage, kill rate 69.3%); `baseline-completion-evidence-2026-07-11.md` (`server.js` 51.66% lines, 45.8% branches; suite 40/40 in 1.167s). Full runbook for the live demo (specific prompts, per-step timing, three-layer fallback) lives in the design doc §5.9–§5.16.

**Transition:**
"It survives even though eleven tests execute exactly its line. Now let Claude Code open the report itself."

---

## Live Demo (no slide) — Claude Code Audits and Fixes Mutant 355

> **Compressed for the 30-minute cut: 4:00 → 3:00.** STEP 1 (the audit) is **pre-recorded** — play a 40-second asciinema clip of Claude Code's RIPR diagnosis instead of prompting live. STEP 2 and STEP 3 stay live. Both human gates (HG-2, HG-3) are spoken, not cut: they are the point of the demo.
>
> Master file keeps the full 4-minute live version. If the room is running early, switch back to it.

**Purpose:** Close the argument with one real loop, before-numbers and after-numbers — with Claude Code doing the diagnosis and the fix. The human keeps exactly two sign-off points: whether the ambiguous behaviour should be pinned as-is (HG-2), and whether a green gate is business-correct (HG-3).

**Why there is no slide:** this is a terminal activity, meant to be watched, not read off a screen.

```
MUTANT 355 · EqualityOperator · server.js:382 · coveredBy: 11 tests
  -  if (expiry <  now)   return 400 "Coupon has expired";
  +  if (expiry <= now)   return 400 "Coupon has expired";
  → 11 tests execute this line. NONE of them fails.

STEP 1 — AUDIT                                    ⏱ 0:40 · PRE-RECORDED CLIP
  Claude Code was given the report, the source, and mutant 355's diff, and
  asked one question: which RIPR link is broken?
  It answers: Reachability holds (11 tests reach the line) — broken at
  INFECTION, because no test uses expired_at EXACTLY EQUAL to now (only
  "clearly expired" and "clearly still valid" exist, nothing at the ON-point)
  → Mode 1: BOUNDARY_CONDITION_MISSED

  ⚠️ HUMAN STOPS HERE (HG-2) — SPOKEN LIVE, NOT CUT:
     does expiry == now mean the coupon is still valid, or expired? The spec
     does not say → an AMBIGUOUS REQUIREMENT, not a weak test. Claude Code
     does not get to decide this.
     DEMO-ONLY WORKING DECISION, approved by the group reviewer before the
     talk, recorded in BASELINE.md: pin the CURRENT behaviour (still valid)
     as a regression guard. This is NOT a product decision — the requirement
     stays open and goes to the BA.

STEP 2 — FIX                                      ⏱ 1:00 · LIVE
  Prompt Claude Code to write one ON-point test with a frozen clock, pinning
  the "still valid" decision just made. The assertion is pasted live, not
  pre-written.

STEP 3 — VALIDATION GATE                          ⏱ 1:20 · LIVE
  $ npm test -t '<test name>'                     → PASS on the original?
  $ npx stryker run --mutate "server.js:363-443" --incremental
  → mutant 355:  Survived → Killed ?

  ⚠️ HUMAN CLOSES HERE (HG-3): a green gate does NOT prove the oracle is
     business-correct. Real example: mutant 397 — an assertion that pins the
     exact value of a known bug, BUG-09-001, passes the gate, but the oracle
     is wrong. A reviewer still blocks it.
```

**Speaker Script (compressed — full script and per-step timing in the design doc runbook §5.14, §5.16):**
"So, mutant three hundred and fifty-five. Eleven tests execute line three eighty-two, and none of them fails. Instead of diagnosing it ourselves, we handed it to Claude Code — here is what it answered.

[play the 40-second audit clip]

Reachability holds, and it is broken at Infection: no test puts the expiry exactly **on** the boundary. Now I stop, because the next question is not a testing question. Does 'expiry equals now' mean the coupon is still valid, or already expired? Our spec does not say. That is an ambiguous requirement, and Claude Code does not get to decide it. Our group reviewer approved one working decision before this talk: pin today's behaviour as a regression guard, and send the requirement to the BA.

[live: prompt for the ON-point test with a frozen clock, paste the assertion]

And now the gate — the same command from the previous screen.

[live: `npx stryker run --mutate "server.js:363-443" --incremental`]

Survived became Killed. But one last thing, and it is the whole talk in one sentence: a green gate does not prove the oracle is **business-correct**. Mutant three ninety-seven passes this same gate while pinning the exact value of a known bug. A reviewer still blocks it. AI shortens the triage time. It does not shorten the responsibility."

**Backup:** if the network or the model call fails, play the recorded run of all three steps (Demo_Screencast.mp4, 5–8 min version, cut to the 355 segment). Never debug live.
