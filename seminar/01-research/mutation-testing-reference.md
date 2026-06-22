# Mutation Testing in the AI-First Era — A Technical Reference for CSC13003 (HCMUS, 2026)

## TL;DR

- **Mutation testing is the only adequacy metric that scores both execution *and* assertion quality.** In industry studies, codebases with 96% line / 93% branch coverage have shown mutation scores as low as 34%, and some LLM-generated suites achieve 100% coverage with only ~4% mutation score (Wang et al., MutGen, arXiv:2506.02954). Treat mutation score — not coverage — as the test-suite quality KPI.
- **For JS/TS, StrykerJS (current v9.6.1, Apache-2.0) is the de-facto standard.** Use Vitest or Jest runners, the TypeScript checker to suppress compile-error mutants, `--incremental` mode in CI, and the `thresholds: { high: 80, low: 60, break: 50 }` pattern. Stryker 7 introduced Vitest + Tap support; v6 introduced native ESM + hot-reload (an exact "70% performance improvement" on Stryker's own core, per the official v6 release post).
- **AI now plugs into mutation testing at three points**: (1) generating tests targeted at surviving mutants (MuTAP achieves 94% mutation score on HumanEval vs 66% for Pynguin; Dakhel et al., IST 2024); (2) generating *better* mutants than fixed-operator engines (LLMorpheus, Tip et al., IEEE TSE 2025); (3) screening equivalent mutants (Tian et al., ISSTA 2024 — best F1-score 86.58% with fine-tuned UniXCoder, a 35.69% F1 improvement over prior techniques). All three carry hallucination risk and require executable verification — never accept an LLM-generated assertion without running it against the original code AND the live mutant.

---

## AREA 1 — Foundational Concepts

### 1.1 Formal definition

Given a program *P* and a test suite *T*, a **mutation operator** *m* is a syntactic transformation rule that, applied at a program location, produces a **mutant** *P′*. *T* **kills** *P′* iff ∃ *t ∈ T* such that *t(P) ≠ t(P′)* in observable behaviour (the *Reachability–Infection–Propagation* — RIP — model). A mutant on which all *t ∈ T* pass is **surviving** (alive). A **first-order mutant (FOM)** is the result of applying exactly one mutation; a **higher-order mutant (HOM)** combines *k > 1* mutations.

The **coupling effect** (DeMillo–Lipton–Sayward 1978; theoretically refined by Wah in *Science of Computer Programming*, 2003) states that test sets killing all FOMs kill the vast majority of HOMs. Offutt's empirical study found ~10% of FOMs are equivalent versus only ~1% of second-order mutants, motivating **strongly subsuming HOMs** (SSHOMs), introduced by Jia & Harman, as a more efficient signal.

Mutation operators are classified by syntactic granularity:

- **Statement-level** — e.g. SDL (Statement Deletion).
- **Operator-level** — replacing `+` with `-`, `&&` with `||`.
- **Value-level** — replacing a literal `0` with `1`, or a variable `v` with `-v`.

### 1.2 Mutation score and industry benchmarks

$$
\text{MutationScore} = \frac{\text{Killed}}{\text{Total Mutants} - \text{Equivalent} - \text{Invalid}} \times 100
$$

StrykerJS reports two variants (per `stryker-mutator.io` "Mutant states and metrics"):

- `MS = detected / valid × 100`
- `MS_covered = detected / covered × 100` (ignores `NoCoverage` mutants — useful when bootstrapping)

**Industry anchors:**

- **Google (Petrović & Ivanković, ICSE 2018; expanded in *Practical Mutation Testing at Scale: A view from Google*, Petrović, Ivanković, Fraser & Just, arXiv:2102.11378):** Google does **not** report a target absolute score. With ~2 billion LOC and >500 M tests/day, they switched to *diff-based* mutation testing on changed lines only, filtering out *arid* mutants and capping mutants/line. Per the same paper, **"developers at Google initially classified 85% of reported mutants as unproductive,"** motivating the targeted-selection pipeline. From the same study: in ~70% of real bugs, a corresponding mutant would have flagged the issue; in >90% of lines, all mutants on a line share the same fate (kill or survive) — so one mutant/line is statistically sufficient.
- **Facebook (Beller et al., 2020, arXiv:2010.13464):** generic-operator survival rates of 15% at Google and <10% in academia; learned, realistic mutation operators raise effective survival to 60–70%.
- **Practical thresholds** (Stryker community guidance; Diffblue 2025 benchmarks on Apache Tika, Halo, and Sentinel showing 60–89% mutation scores): start at `break: 60` for legacy projects, target `≥ 80` for new code, `≥ 90` for payment/security paths.

### 1.3 The Equivalent Mutant Problem (EMP)

A mutant *P′* is **equivalent** to *P* iff ∀ inputs *x*, *P(x) = P′(x)*. Detecting equivalence is **undecidable in the general case** because it reduces to program equivalence, which is Turing-undecidable (Budd & Angluin 1982; Arcaini et al. 2017; surveyed in Tian et al., ISSTA 2024, arXiv:2408.01760). The equivalent-mutant rate ranges from **4% to 39%** in real-world development scenarios (Madeyski et al., 2013, as cited in Tian et al. ISSTA 2024); equivalent mutants inflate the denominator of the mutation score, depressing it artificially.

Practical mitigations:

1. **Manual triaging** of surviving mutants — the historical default, tedious and error-prone (Naeem, *JSEP* 2020).
2. **Subsumption / Trivial Compiler Equivalence (TCE)** — if optimised compilation produces identical bytecode, the mutant is provably equivalent (Kintis, Papadakis et al.). StrykerJS's TypeScript checker performs an analogous filter for compile-error mutants.
3. **Constraint-based detection / Medusa** (Just et al., ICST 2019) — encode FOMs as SMT constraints; sound but partial.
4. **ML classifiers** (Naeem 2020; Springer 2025 review) using reachability/necessity/sufficiency features.
5. **LLM-based EMD** (Tian et al., ISSTA 2024) — fine-tuned UniXCoder reached **F1=86.58%**, a 35.69% F1 improvement over prior techniques, but false negatives (a *killable* mutant labeled equivalent) can hide real bugs.
6. **Impact analysis** — only inspect mutants that change covered-line state (Schuler & Zeller 2013, *Covering and uncovering equivalent mutants*).

### 1.4 Code coverage vs mutation score

Coverage measures **execution**; mutation score measures **execution + assertion strength**. The two diverge sharply:

- Theodo (Diffblue case study, banking microservice): **96% line / 93% branch coverage but only 34% mutation score**.
- Wang et al., MutGen (arXiv:2506.02954, 2025): "Some test suites achieve 100% coverage but only 4% mutation score."
- 100% branch coverage with ~40% mutation score is a textbook outcome when tests execute every branch but assert nothing meaningful — e.g. `expect(typeof result).toBe('number')` covers `add(a,b)` but kills zero arithmetic mutants. This is why MC/DC (DO-178C avionics) augments branch coverage with independence requirements, but even MC/DC does not require *correct* oracles — which mutation alone exposes.

The conceptual gap, formalised by Jain et al., *Mind the Gap* (arXiv:2309.02395), is the **oracle gap** = coverage − mutation score on covered lines; large positive gaps prioritise files for assertion review.

### 1.5 Surviving-mutant taxonomy

| Class | Diagnosis | Action |
|---|---|---|
| **Real test gap** | Mutant changes observable behaviour, no test asserts on it | Add targeted assertion |
| **Equivalent** | Semantically identical to original | Document; subtract from denominator |
| **Trivial / redundant** | Killed by *any* test that runs the line; or subsumed by another killed mutant | Filter at engine level (Stryker's `ignore-plugins`, Google's *arid* mutants) |
| **Timeout** | Caused infinite loop or excessive runtime — **Stryker counts as killed** (a CI build would also break on this in production) | None |

StrykerJS additionally surfaces `CompileError`, `RuntimeError`, `Ignored`, `Pending`, `NoCoverage`. Per Stryker docs: invalid mutants (compile/runtime errors) are **excluded from the mutation score denominator**.

### 1.6 Major operator families (Offutt's sufficient set)

- **AOR** (Arithmetic Operator Replacement): `+ - * / %` swapped pairwise.
- **ROR** (Relational Operator Replacement): `< <= > >= == !=` swapped; sufficient-set variant **RORG** uses only adjacent operators to suppress infeasible mutants.
- **LCR** (Logical Connector Replacement): `&& ↔ ||`, bitwise `& | ^`.
- **ABS** (Absolute Value Insertion): `v → abs(v) | -abs(v) | failOnZero(v)` — forces tests to exercise sign boundaries.
- **SDL** (Statement Deletion): removes statements; subsumes much of branch coverage.
- **UOI** (Unary Operator Insertion): prefixes `-`, `++`, `--`, `!`.
- **CRCR/ICR** (Constant Replacement): `c → 0 | 1 | -1 | c+1 | c-1 | -c`.

Offutt et al. (*Mutation 2000*) proved that **{ABS, AOR, LCR, ROR, UOI}** — the *5 sufficient operators* — recover ~99% of the fault-detection power of the full 22-operator Mothra set at ~10% of the cost. This is the theoretical justification for StrykerJS's compact default mutator set.

---

## AREA 2 — StrykerJS (v7–v9, 2023–2025)

### 2.1 Architecture

StrykerJS executes a four-phase pipeline (per `stryker-mutator/core` `src/process/3-dry-run-executor.ts`):

1. **Project read & sandbox creation** — copies the project (excluding `node_modules`, `.git`, etc.) into `.stryker-tmp/sandbox-xxxxx`, symlinking `node_modules` by default.
2. **Instrumentation** — Babel-based AST traversal places **all** mutants into the code simultaneously using *mutation switching*, gated by the env variable `__STRYKER_ACTIVE_MUTANT__`. One transpile per project, not one per mutant.
3. **Dry run** — executes the unmodified test suite once with no active mutant. Purpose: validate the test setup runs green, collect per-mutant coverage (when `coverageAnalysis: 'perTest'` or `'all'`), and measure baseline timing for the `timeoutFactor` calculation. `--dryRunOnly` runs only this phase, useful in CI smoke tests.
4. **Mutation run** — for each non-`NoCoverage` mutant, set the active-mutant env var, run only the covering tests (per-test coverage), evaluate, advance. Static mutants force a worker-process restart and are sorted last.

Reporters consume the resulting `mutation-report.json` (schema published by `mutation-testing-elements`) to render an interactive HTML report.

### 2.2 Canonical `stryker.config.mjs` (Node.js backend, Jest)

```js
// stryker.config.mjs
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  packageManager: 'npm',
  testRunner: 'jest',
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.js',
    enableFindRelatedTests: true,
  },
  mutate: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/__tests__/**',
    '!src/index.js',
    '!src/db/migrations/**',
  ],
  coverageAnalysis: 'perTest',
  reporters: ['html', 'clear-text', 'progress', 'json', 'dashboard'],
  htmlReporter: { fileName: 'reports/mutation/index.html' },
  thresholds: { high: 80, low: 60, break: 50 },
  timeoutMS: 60000,
  timeoutFactor: 1.5,
  concurrency: 4,
  disableBail: false,
  incremental: true,
  incrementalFile: 'reports/stryker-incremental.json',
  tempDirName: 'stryker-tmp', // non-hidden for Windows + Jest compatibility
};
```

Key options (per `stryker-mutator.io/docs/stryker-js/configuration/`):

- **`mutate`** — globs of files to mutate (defaults to `lib/**`, `src/**`).
- **`testRunner`** — official plugins: `jest`, `vitest` (added v7.0, June 2023), `mocha`, `jasmine`, `karma`, `cucumber`, `tap` (added v7.0), `command` (fallback that runs `npm test`).
- **`coverageAnalysis: 'perTest' | 'all' | 'off'`** — `perTest` is the fastest and lets Stryker distinguish `Survived` from `NoCoverage`. All official runners support it except `command`.
- **`thresholds: { high, low, break }`** — `mutation score ≥ high` → green; `< low` → red; `< break` → exit code 1 (CI failure). Default `{ high: 80, low: 60, break: null }`.
- **`timeoutFactor`** (default 1.5) and **`timeoutMS`** — net timeout = `timeoutFactor × baselineMs + timeoutMS`.
- **`concurrency`** — defaults to CPU cores.
- **`disableBail`** — when `true`, test runners report *all* failing tests per mutant (richer dashboard "Tests" view at a ~12s penalty on Stryker's utils benchmark). Supported by all official runners except `jest` (Jest has its own non-bail behaviour).
- **`incremental` + `--force`** — see §2.5.

### 2.3 JS/TS mutators

Stryker JS mutators (renamed from the legacy javascript-mutator set in v4; per the supported-mutators handbook):

| Mutator | Example |
|---|---|
| `ArithmeticOperator` | `a + b` → `a - b` |
| `BlockStatement` | `{ doX(); }` → `{}` |
| `BooleanLiteral` | `true` → `false`, `!x` → `x` |
| `ConditionalExpression` | `if (x)` → `if (true)` / `if (false)`; covers `for`, `while`, `do`, `switch` |
| `EqualityOperator` | `==` → `!=`, `>=` → `>` / `<` |
| `LogicalOperator` | `&&` → `\|\|` |
| `MethodExpression` | `arr.filter(...)` → `arr` (drops the call); covers `endsWith→startsWith`, etc. |
| `OptionalChaining` | `obj?.x` → `obj.x` |
| `Regex` | mutates char classes, quantifiers, anchors via *weapon-regex* |
| `StringLiteral` | `"x"` → `""`; backtick strings → `` `` |
| `UnaryOperator` | `-a` → `+a` |
| `UpdateOperator` | `i++` → `i--` |
| `ArrayDeclaration` | `[1,2]` → `[]`; `new Array()` → `new Array([])` |
| `ObjectLiteral` | `{a:1}` → `{}` |

Disable via `mutator.excludedMutations: ['StringLiteral', 'ObjectLiteral']`. Stryker 8 (PR #4686) added **mutation levels** (1=fast, 3=thorough) for resource-tuning, based on Info Support's Callisto research.

### 2.4 HTML report statuses (per `mutant-states-and-metrics`)

| Status | Meaning | Counts toward score? |
|---|---|---|
| **Killed** | ≥1 test failed | Yes — *detected* |
| **Survived** | All tests passed; mutant *was* covered | Yes — *undetected* |
| **NoCoverage** | No test executed the mutant location | Yes — *undetected* (denominator) |
| **Timeout** | Tests exceeded `timeoutFactor·baseline + timeoutMS` | Counted as *detected* (a CI build would also break) |
| **CompileError** | TypeScript/Babel rejected the mutant | **Invalid** — excluded from denominator |
| **RuntimeError** | Test runner crashed (e.g., OOM) | **Invalid** — excluded |
| **Ignored** | Filtered via `ignore-plugins` (e.g., the Angular plugin shields `input()`/`output()` statics) | Excluded |
| **Pending** | Not yet executed (interrupted run) | Excluded |

The HTML report (built on the `mutation-testing-elements` web-component library, shared with Stryker.NET, Stryker4s, infection-php, etc.) provides per-file drilldown, source-line annotations showing original-vs-replacement code, a "Tests" view ranking tests by mutants-killed, and trend tracking via Stryker Dashboard (free for OSS).

### 2.5 Performance levers

- **`--incremental`** (`docs/stryker-js/incremental`): persists `reports/stryker-incremental.json`; subsequent runs diff mutants and tests, reusing prior verdicts. Typical effect on the StrykerJS monorepo itself: "3731 of 3965 mutant result(s) reused" → 234 to execute. Combine with PR-scoped `--mutate` for **70–90% CI time reduction**. CI tip: cache `stryker-incremental.json` per branch with a fall-back to `main`. Run a `--force` full pass nightly/weekly to prevent drift.
- **`coverageAnalysis: 'perTest'`** — typically the single biggest speedup.
- **Concurrency** — start at CPU-cores; lower on memory-bound projects.
- **Excluded mutators** — drop `StringLiteral`, `ObjectLiteral`, and `ArrayDeclaration` on noisy codebases; they generate many equivalent / trivial mutants for the assertion benefit they give back.
- **Mutation levels** (Stryker 8+) — `mutationLevel: 1` for PR feedback, default for nightly.
- **Hot reload** (Stryker 6+ for Mocha/Jasmine) — eliminates `require.cache` purges; "a whopping 70% performance improvement" on Stryker's own core, per the official v6 release post (`stryker-mutator.io/blog/stryker-js-v6-expeditious-superior-mutations/`).

### 2.6 Runner integration mechanics

- **Jest** — `@stryker-mutator/jest-runner` calls `runCLI`, injects per-test mutant coverage via a custom Jest environment (`mixinJestEnvironment` from the public API). Caveats: Jest doesn't support multiple `projects` in object form (use a file path), and Jest can't run from a hidden directory on Windows (set `tempDirName: 'stryker-tmp'`). `enableFindRelatedTests: true` is the per-test filter.
- **Vitest** — `@stryker-mutator/vitest-runner`, added in Stryker 7.0. Forces `coverageAnalysis: 'perTest'`. Common gotcha: `vitest.related` may fail to locate test files when tests import via API calls; either disable `related` or import sources directly.
- **Mocha** — `@stryker-mutator/mocha-runner`; supports hot-reload.
- **Command runner** — last-resort `npm test` shell-out; no per-test coverage, slow.

### 2.7 Version history (2023–2025)

- **v6.0** (May 2022, foundational): native ESM support, hot reload for Node-based runners, mutation switching — exactly 70% performance gain on Stryker's own monorepo.
- **v7.0** (June 2023): Vitest runner + Node Tap runner; dropped Node 14; deep imports from `@stryker-mutator/core` no longer permitted.
- **v7.x** (late 2023–2024): real-time HTML report, ignore-plugin API (e.g., Angular plugin for `input()`/`output()` statics), improved TypeScript checker grouping.
- **v8.0** (2024): mutation levels (PR #4686), enhanced `.mts`/`.cts` handling, `create-stryker` initializer, additional ignore patterns (`.next`, `.nuxt`, `.svelte-kit`).
- **v9.x** (2025): server / MCP-style stdio transport (#5520), Vitest v4.1 coverage fix (#5928), TypeScript prerelease support, fix for mutants inside `delete` expressions (#4742).
- **Current latest: v9.6.1** per the npm registry for `@stryker-mutator/core`. (The exact publish date should be verified against the live page at `npmjs.com/package/@stryker-mutator/core` before citing in print.)

---

## AREA 3 — AI Integration into Mutation Testing

### 3.1 AI-assisted assertion generation for surviving mutants

The state-of-the-art is **mutation-feedback prompting**: feed the surviving mutant's diff back to the LLM and ask for a test that fails on the mutant but passes on the original.

- **MuTAP** (Dakhel et al., *Information & Software Technology* 2024 / arXiv:2308.16557; code: `ExpertiseModel/MuTAP`). Pipeline: (1) zero/few-shot prompt for initial unit tests; (2) syntactic repair; (3) oracle correction by comparing actual vs expected return values; (4) run mutation testing; (5) re-prompt with surviving mutants until none remain or budget exhausted. **94% mutation score on HumanEval** (vs 66% for Pynguin); detects **94.9% of buggy submissions on Refactory** (vs 67.5%). The "oracle minimizer" drops assertions that don't increase MS — typically yielding 2–3 high-impact assertions per function.
- **MutGen / MUTGEN** (Wang, Xu, Briand, Liu, arXiv:2506.02954, 2025). Embeds **mutation-report feedback** (line, status, operator) directly in the prompt; adds a fixing step for assertion failures. On 204 subjects, MutGen significantly outperforms EvoSuite and vanilla prompting on mutation score. Headline finding: "Some test suites achieve 100% coverage but only 4% mutation score."
- **AugmenTest** (arXiv:2501.17461, 2025) — extends to oracle generation with Extended Prompts + RAG; **30% success rate** on conservative Java oracle inference vs simple prompts; benchmarked across 142 Java classes.
- **Meta TestGen-LLM / "Automated Unit Test Improvement Using Large Language Models at Meta"** (Alshahwan et al., FSE 2024). Production deployment: LLM-generated test additions ship only after passing build + execution + improving a measurable fault-finding signal.

**Prompt engineering pattern that works in production:**

```
You are an expert in {language} unit testing using {framework}.

Below is the source code under test:
<CODE>
{original_source}
</CODE>

Your existing test currently PASSES on the original code but ALSO PASSES on this mutant:
<MUTANT_DIFF>
- if (total >= threshold) {
+ if (total >  threshold) {
</MUTANT_DIFF>

Generate ONE additional Jest test (no extra imports) that:
1. PASSES on the original code.
2. FAILS on the mutant.
3. Does not duplicate any of the existing tests below.
Existing tests:
<TESTS>
{existing_tests}
</TESTS>

Return only the test code as a fenced ```js block.
```

This pattern (explicit RIP-style instructions; the boundary value implicit in the mutant diff) materially outperforms generic "write a test for this function" prompts.

### 3.2 Equivalent-mutant detection with AI

**Tian et al., ISSTA 2024 — "Large Language Models for Equivalent Mutant Detection: How Far Are We?"** (arXiv:2408.01760). Empirically evaluates LLMs on equivalent-mutant binary classification across MutantBench (van Hijfte & Oprescu, ICSTW 2021). The paper concludes: *"LLM-based techniques significantly outperform existing techniques (i.e., the average improvement of 35.69% in terms of F1-score), with the fine-tuned code embedding strategy being the most effective"*, reaching **F1=86.58%** with fine-tuned UniXCoder.

Important caveats:

- **False negatives are dangerous**: labeling a *killable* mutant as equivalent hides a real test gap.
- ML feature-based classifiers (Naeem 2020, *JSEP*; Springer 2025 review) using reachability/necessity/sufficiency from constraint-based testing theory remain competitive and cheaper.
- Production recommendation: **use LLMs only to triage and explain** equivalence — do not silently drop mutants from the denominator. A human still signs off.

### 3.3 DiffBlue Cover (Java only)

- **Mechanism**: reinforcement learning over Java bytecode pathways, not an LLM. Deterministic: identical inputs → identical tests. Sets up Mockito mocks, writes JUnit assertions.
- **Reported benchmarks (Diffblue 2025)**: 81% line coverage at fleet scale vs ~32% plateau for pure AI-coding-agents; mutation scores 60–89% on Tika/Halo/Sentinel; 94–99% test compile-and-pass rate (vs 65% for GitHub Copilot in a head-to-head). Caveat: these are the vendor's own benchmarks; independent third-party reproductions are limited.
- **Limitations**: Java + (newer) Python only — no JS/TS support; tests describe *current behaviour* (regression-locking), so they pin bugs as features if the code is wrong; not a specification oracle.

### 3.4 AI-driven test amplification (mutation-bounded growth)

The goal is to **raise mutation score without inflating LOC**. MuTAP's oracle minimizer is the canonical pattern: after each LLM-generated test, recompute MS — keep only assertions that newly kill ≥1 mutant. Empirically this caps growth at 2–3 net new assertions per function. Meta's TestGen-LLM (Alshahwan et al., FSE 2024) enforces a similar discipline: every accepted test must (a) compile, (b) pass, (c) improve a measurable quality signal — otherwise discarded.

### 3.5 LLM-suggested mutation operators

- **LLMorpheus** (Tip, Bell, Schäfer — IEEE TSE 2025 / arXiv:2404.09952; code: `githubnext/llmorpheus`). Instead of using a fixed operator set, LLMorpheus inserts `<PLACEHOLDER>` tokens at high-value AST locations (if-conditions, loop headers, call arguments) and asks an LLM to propose realistic replacements. Implemented atop a modified StrykerJS so the same reporting/HTML stack is reused. Across 13 npm packages: **produces mutants that resemble existing bugs that StrykerJS's fixed operator set cannot generate**. Best performer: `codellama-34b-instruct` at T=0. Practical caveats: cost (per-mutation API calls), nondeterminism, and the need to verify mutant validity (a non-trivial fraction are equivalent refactors).
- **μBERT** (Degiovanni et al.) — token-masking with CodeBERT; cheaper, less diverse.
- Selection heuristic at Google: probabilistic, history-based mutant selection — operators that yielded productive mutants in the past get higher weights.

### 3.6 LLM test-generation tools for JS/TS

| Tool | Status (2025/26) | Mutation-score evidence |
|---|---|---|
| **GitHub Copilot** (Chat, Agent mode, GPT-5) | Generally available | Diffblue benchmark Sep 2025: **5–29% line coverage** vs Diffblue's 50–69%; mutation scores not separately reported but consistently lower than deterministic tools. |
| **Qodo Gen** (formerly CodiumAI, rebranded 2024) | GA — VS Code/JetBrains/CLI | Analyzes behaviour, identifies untested paths. Qodo's own benchmark: F1=60.1% on AI-code-review task (Feb 2026 Qodo 2.0). Independent mutation-score data is scarce; community reports place it comparable to Copilot. |
| **Claude Code (Anthropic)** | GA | Diffblue 2025 head-to-head: 60–89% mutation score on small examples but coverage plateau at ~50% on full repos. |
| **CoverUp** (Pizzorno & Berger, FSE 2025) | OSS research tool, Python only | Coverage-driven, not mutation-driven. |
| **Pynguin** | OSS, Python only | Coverage-driven; MuTAP outperforms it on mutation score (94% vs 66% on HumanEval). |
| **MuTAP**, **MutGen**, **LLMorpheus** | Research prototypes | Highest reported mutation scores when explicitly mutation-guided. |

For JS/TS specifically, the practical 2026 stack for an academic project is: **Copilot or Qodo for the first draft of tests, then run StrykerJS, then loop surviving mutants through a Claude/GPT prompt patterned on §3.1**.

### 3.7 Hallucination risk and validation

LLM-generated assertions can be **plausible but wrong** in three failure modes:

1. **Asserts a value that happens to equal the buggy mutant's output** — test passes on both original and mutant: zero mutation-killing power.
2. **Asserts an implementation detail** (e.g., specific iteration order) — test passes on original today, breaks on benign refactors, doesn't kill behavioural mutants.
3. **Wrong oracle** — asserts the mutant's output as "correct" because the LLM regenerated the buggy logic from memory.

**Mandatory validation gate (run automatically in CI):**

```
1. Run new test against ORIGINAL: must PASS.
2. Run new test against the TARGET MUTANT: must FAIL.
3. Run new test against ALL other surviving mutants: report count newly killed.
4. Reject the test if (1)=fail OR (2)=pass OR (3)=0.
```

This is exactly the discipline MuTAP and Meta TestGen-LLM enforce. **Never** ship an AI-generated assertion that has not been validated against both *P* and *P′*.

---

## AREA 4 — Applying Mutation Testing to EShop (`ttbhanh/eshop-sut`)

### 4.1 Repository reality check

Confirmed facts (June 2026): the repo is public, 2 commits, intentionally seeded with bugs as a SUT for the HCMUS testing course. Top-level layout: `/backend` (Node.js/Express/SQLite), `/frontend-web`, `/frontend-admin`, `/frontend-mobile`. Backend entry points are **`backend/server.js`** (Express on :3000) and **`backend/database.js`** (SQLite schema + seeder). Node ≥18. Per the `api_specification.md`, the backend uses Express, sqlite3 (or better-sqlite3), bcrypt(js), jsonwebtoken, multer, cors. **No StrykerJS configuration, no Jest tests, no GitHub Actions workflow exist today** — this is a greenfield setup.

> Note: At the time of writing, the exact internal folder layout under `/backend` (whether `server.js` mounts routes inline or imports from `routes/`, `controllers/`, `services/`) could not be retrieved via the GitHub API due to crawl restrictions. The recommendations below assume the standard Express layered layout; adapt globs to the real tree after `git clone`.

### 4.2 Module-priority ranking for mutation testing

Ranked by business criticality × logic density (highest-value targets first), based on the FRs in `api_specification.md`:

| Rank | Module / likely file | Why it's a top mutation target |
|---|---|---|
| 1 | **Coupon/discount logic** (FR-09) — `services/couponService.js` or inline in checkout handler | 5 conjunctive guard conditions (active, not expired, min-order, authenticated, max-uses); two branches (percent vs fixed). High ROR (`>=` vs `>`), LCR (`&&` vs `\|\|`), boundary mutants. |
| 2 | **Order state machine** (FR-10) — `services/orderService.js` | `pending → confirmed → shipping → delivered`; `pending\|confirmed → canceled`; terminal states. Each guarded transition is a kill-rich relational/equality mutant cluster. |
| 3 | **Auth & login lockout** (FR-02) — `routes/auth.js` / `controllers/authController.js` | `>= 3` failed attempts → 30s lock; bcrypt password compare; JWT signing. ROR boundary (`>=3` vs `>3`), AOR on counter increment, StringLiteral on the JWT secret/algorithm. |
| 4 | **Cart total recompute** (FR-08) — `controllers/cartController.js` | Server-side recomputation that *must not* trust client total. AOR on `price * qty`, ConditionalExpression on stock checks. |
| 5 | **Validators** (FR-01, FR-04) — `utils/validators.js` | Password regex (≥8 + upper + lower + digit + special), phone `^0\d{9,10}$`, email. Regex mutator and BooleanLiteral plays hard here. |
| 6 | **Admin authorization middleware** (FR-12) — `middleware/requireAdmin.js` | `role === 'admin'` check; EqualityOperator + StringLiteral mutants reveal common authz bugs. |
| 7 | **CSV import with rollback** (FR-16) — `controllers/productImportController.js` | RFC-4180 parsing + transaction rollback. ConditionalExpression and BlockStatement (catch/finally) mutants. |

Lowest priority for mutation testing: `database.js` seeders, static `routes` wiring, logging — high noise, low signal.

### 4.3 Concrete `stryker.config.mjs` for EShop backend

```js
// backend/stryker.config.mjs
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  packageManager: 'npm',
  testRunner: 'jest',
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.js',
    enableFindRelatedTests: true,
  },

  // Priority-first mutation scope: business logic only
  mutate: [
    'src/controllers/**/*.js',
    'src/services/**/*.js',
    'src/middleware/**/*.js',
    'src/utils/validators.js',
    'src/utils/discount.js',
    '!src/**/*.test.js',
    '!src/**/__tests__/**',
    '!src/db/migrations/**',
    '!src/db/seed.js',
    '!src/server.js',         // bootstrap only
    '!src/config/**',
  ],

  coverageAnalysis: 'perTest',

  reporters: ['html', 'clear-text', 'progress', 'json', 'dashboard'],
  htmlReporter: { fileName: 'reports/mutation/index.html' },
  jsonReporter: { fileName: 'reports/mutation/report.json' },
  dashboard: {
    project: 'github.com/ttbhanh/eshop-sut',
    version: 'main',
    module: 'backend',
  },

  // Staged thresholds — week 1: break:30; week 4: break:60
  thresholds: { high: 80, low: 60, break: 50 },

  // SQLite I/O + bcrypt are slow — give timeouts headroom
  timeoutMS: 60000,
  timeoutFactor: 2.0,

  concurrency: 4,
  disableBail: false,

  incremental: true,
  incrementalFile: 'reports/stryker-incremental.json',

  // Cut noisy mutators on day-1; re-enable once score stabilises
  mutator: {
    excludedMutations: ['StringLiteral', 'ObjectLiteral', 'ArrayDeclaration'],
  },

  // Required on Windows when using Jest (hidden-dir issue)
  tempDirName: 'stryker-tmp',
};
```

If the backend uses ESM, the `.mjs` extension above is correct and `"type": "module"` must be set in `package.json`. If CommonJS, use `stryker.conf.json` or `stryker.config.cjs`.

### 4.4 Expected mutation results in e-commerce logic

A short worked example on a likely coupon function:

```js
// services/discount.js
function applyCoupon(cart, coupon, user) {
  if (!coupon || !coupon.active) return cart.total;
  if (coupon.expiresAt < Date.now()) return cart.total;
  if (cart.total < coupon.minOrderAmount) return cart.total;
  if (!user) return cart.total;
  if (user.couponUses[coupon.id] >= coupon.maxUsesPerUser) return cart.total;

  const discount = coupon.type === 'percent'
    ? cart.total * coupon.value / 100
    : coupon.value;
  return Math.max(0, cart.total - discount);
}
```

Expected mutants and what each catches:

| Mutator | Mutation | What a strong test must assert |
|---|---|---|
| `LogicalOperator` | `!coupon \|\| !coupon.active` → `!coupon && !coupon.active` | Test with `{active:false}` |
| `EqualityOperator` | `<` → `<=` in `expiresAt < Date.now()` | Test at the exact expiry boundary |
| `EqualityOperator` | `<` → `<=` on `cart.total < minOrderAmount` | Boundary test at min |
| `EqualityOperator` | `>=` → `>` on `maxUsesPerUser` | Test at the *exact* max |
| `StringLiteral` | `'percent'` → `""` | Test percent and fixed paths separately |
| `ArithmeticOperator` | `*` → `/` in percent calc | Test value ≠ 100 |
| `ArithmeticOperator` | `-` → `+` in `total - discount` | Assert numeric result, not just type |
| `BlockStatement` | empty out the entire function body | Any non-trivial behavioural assertion |
| `ConditionalExpression` | `if (!user)` → `if (false)` | Unauthenticated test path |

A weak test that only asserts `typeof apply(...) === 'number'` will cover 100% of branches but kill ≤ 2 of these ~15 mutants — a textbook coverage-vs-mutation divergence.

### 4.5 GitHub Actions baseline workflow

```yaml
# .github/workflows/mutation-testing.yml
name: Mutation Testing
on:
  pull_request:
    branches: [main]
    paths:
      - 'backend/**'
      - '!backend/**/*.md'
  push:
    branches: [main]
  schedule:
    - cron: '0 18 * * 0'   # full --force run weekly (Sunday 18:00 UTC)

jobs:
  stryker:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0   # needed for git diff in PR mode

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - run: npm ci

      # Restore incremental report from prior run on this branch (or main)
      - name: Restore Stryker incremental cache
        uses: actions/cache@v4
        with:
          path: backend/reports/stryker-incremental.json
          key: stryker-${{ github.ref_name }}-${{ github.sha }}
          restore-keys: |
            stryker-${{ github.ref_name }}-
            stryker-main-

      - name: Run mutation testing (PR — scoped + incremental)
        if: github.event_name == 'pull_request'
        run: |
          CHANGED=$(git diff --name-only origin/main...HEAD -- 'backend/src/**/*.js' \
            | sed 's|^backend/||' | grep -v '\.test\.js$' | tr '\n' ',')
          if [ -z "$CHANGED" ]; then
            echo "No backend source changes — skipping mutation testing."
            exit 0
          fi
          npx stryker run --mutate "$CHANGED" --incremental

      - name: Run mutation testing (push to main)
        if: github.event_name == 'push'
        run: npx stryker run --incremental

      - name: Run mutation testing (scheduled full)
        if: github.event_name == 'schedule'
        run: npx stryker run --force

      - name: Upload HTML report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: mutation-report-${{ github.run_id }}
          path: backend/reports/mutation/
          retention-days: 14

      - name: Publish PR comment with mutation score
        if: github.event_name == 'pull_request' && always()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const r = JSON.parse(fs.readFileSync('backend/reports/mutation/report.json'));
            const ms = r.metrics?.mutationScore?.toFixed(2) ?? 'n/a';
            github.rest.issues.createComment({
              owner: context.repo.owner, repo: context.repo.repo,
              issue_number: context.issue.number,
              body: `🧬 **Mutation score (changed files):** ${ms}%`
            });
```

Baseline setup procedure (for the seminar lab):

1. **Week 1 — baseline.** `npm i -D @stryker-mutator/core @stryker-mutator/jest-runner jest @types/jest`. Write 5–10 happy-path Jest tests against `discount.js` / `authController.js`. Run `npx stryker run` with `thresholds.break: null`. Record the baseline mutation score per file in `BASELINE.md`.
2. **Week 2 — kill the low-hanging fruit.** Inspect HTML report; add boundary tests for each surviving `EqualityOperator` and `ConditionalExpression` mutant. Set `thresholds.break: 40`.
3. **Week 3 — AI augmentation.** For remaining survivors, run the §3.1 prompt template through Claude/GPT; **validate every generated test** against the original + the target mutant in CI before merging. Track new MS gain per test.
4. **Week 4 — CI gate.** Raise `thresholds.break` to the previous run's score minus 5. Enable the GH Actions workflow above. Schedule weekly `--force` full runs to catch drift.
5. **Stretch — equivalent-mutant audit.** Manually triage the 5–10 most stubborn survivors per module; document equivalents in code comments with `// stryker-disable next-line` (StrykerJS supports this directive).

---

## Recommendations (decision-ready)

1. **Adopt mutation score, not branch coverage, as the test-quality KPI** for any CSC13003 student submission grading rubric. Coverage targets only confirm test execution; mutation score validates assertion strength.
2. **Use StrykerJS v9.x with the Jest runner** for the EShop SUT. Set `coverageAnalysis: 'perTest'`, `incremental: true`, and `thresholds: { high: 80, low: 60, break: 50 }`. Pin the break threshold low for the first sprint, raise it weekly.
3. **For AI augmentation, mandate the validation gate** (test passes on *P*, fails on *P′*) — without it, LLM-generated assertions inflate coverage but not mutation score, and may even mask bugs. Treat MuTAP / MutGen / Meta TestGen-LLM as reference architectures.
4. **Scope mutation testing to business logic only** (`controllers`, `services`, `middleware`, `utils/discount.js`, `utils/validators.js`) — exclude bootstrap, migrations, seeders. This concentrates compute on high-signal files and keeps PR feedback under ~5 minutes with `--incremental`.
5. **Run two CI lanes**: scoped + incremental on every PR (fast feedback), full `--force` weekly on `main` (drift detection). Cache `stryker-incremental.json` per branch with a `main` fall-back.
6. **Thresholds for grading**: ≥ 80% mutation score on **identified critical modules** (coupon, order state, auth) earns full marks; ≥ 60% on the overall backend. Tying grades to coverage alone is gameable; tying them to mutation score is not.

**Triggers to revisit the plan:**

- Stryker run > 15 min on PRs → enable `mutationLevel: 1`, narrow `mutate`, raise `concurrency`.
- > 20% of mutants reported as equivalent → invest in `ignore-plugins` patterns rather than ML triaging.
- Surviving-mutant count plateaus despite added tests → switch from coverage-driven Copilot/Qodo to MuTAP-style mutation-guided prompting.

---

## Caveats

- **Repository introspection limit.** The exact internal folder layout under `/backend` of `ttbhanh/eshop-sut` could not be retrieved via API tooling on 1 June 2026 (GitHub crawler restrictions). The folder names in §4.2–4.4 (`services/`, `controllers/`, `middleware/`) follow Express conventions and `api_specification.md` semantics, but **adapt globs to the actual tree after `git clone`**. The high-level confirmed facts — `/backend` + `server.js` + `database.js` + SQLite + Node ≥18 + no Stryker/Jest/CI today — are reliable.
- **Vendor benchmarks.** Diffblue's Copilot/Claude comparison numbers (e.g., 5–29% coverage, 65% test pass rate) are from Diffblue's own studies and have not been independently reproduced. Treat as directional, not absolute.
- **LLM nondeterminism and benchmark contamination.** Mutation scores reported in MuTAP/MutGen/LLMorpheus papers are sensitive to model version, temperature, and benchmark contamination (HumanEval is in many LLMs' training sets). Re-validate on the actual EShop codebase before generalising.
- **Equivalent-mutant rate.** The often-cited "4–39%" range comes from Madeyski et al. (2013), measured on Java/C studies; the JS/TS equivalent-mutant rate with StrykerJS's default mutators is less thoroughly measured but anecdotally lower for arithmetic/relational mutators and higher for `StringLiteral`/`ObjectLiteral`.
- **Coupling-effect caveat.** While the coupling effect lets us focus on FOMs, SSHOMs (Jia & Harman) can simulate realistic multi-line bugs that FOMs cannot; advanced courses should expose students to higher-order mutation as a research direction.
- **Stryker version drift.** The features described here reflect StrykerJS v9.6.1 and prior. v10 (when released) may change the configuration schema; always cross-check against `stryker-mutator.io/docs`.
- **Metric labels.** In §3.2, the Tian et al. ISSTA 2024 results are reported as **F1-score**, not precision; treat the 86.58% number accordingly.
