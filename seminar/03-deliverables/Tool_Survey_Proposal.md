# Tool Survey Proposal — T10 Mutation Testing & Test Effectiveness

## 1. Topic

**T10 — Mutation Testing & Test Effectiveness**: our team will measure and improve the effectiveness of a test suite for the EShop Node.js backend by seeding faults (mutants) and using AI to synthesise assertions that kill surviving mutants.

## 2. Candidate Tools

**StrykerJS** (`@stryker-mutator/core` + jest-runner) — A mutation-testing framework that injects faults into JavaScript/TypeScript source and reports a mutation score per file [1]. It is the native JS-ecosystem choice and runs against an existing test runner such as Jest, making it the primary instrument for EShop.

**Claude / ChatGPT (AI-augmented)** — General-purpose LLMs used here as an *assertion-synthesis assistant*: given a surviving mutant and its source context, the model proposes new or strengthened test assertions. They have no native mutation engine; their role is a human-in-the-loop workflow layered on top of StrykerJS output [2].

**PIT / PITest** (backup) — A mature mutation-testing system for the JVM (Java/Kotlin), driven via Maven or Gradle and requiring a green JUnit suite [3] [4]. It is industry-standard but targets bytecode, not Node.js, so it cannot mutate EShop's source.

## 3. Comparison Matrix

| Tool | Licence Cost | Learning Curve | EShop Fit | AI Capability | Community Size |
|------|--------------|----------------|-----------|---------------|----------------|
| **StrykerJS** | Free, open-source (Apache-2.0) [1] | Medium — config + runner setup, but JS-native [1] | **High** — (a) supports CommonJS JS; (b) no suite exists, so Jest must be configured first before Stryker can run; (c) monolithic `server.js` route handlers → use `supertest` HTTP-level tests over pure unit tests | None native; consumes/produces JSON+HTML reports an LLM can read *(workflow integration is our design, not a built-in feature)* | ~2.9k★ GitHub (Apr 2025) [5]; npm weekly downloads 817,663 (2026-05-25 to 2026-05-31) |
| **Claude / ChatGPT** | Freemium — free tier + paid; | Low — natural-language prompting | **Medium** — language-agnostic; reads CommonJS fine; cannot run tests or guarantee correctness — every suggested assertion must be human-reviewed and executed against Stryker | **Native** — assertion synthesis, mutant explanation, edge-case generation | N/A (hosted service, no star/download metric) |
| **PIT (PITest)** | Free, open-source (Apache-2.0) [3] | High for this SUT — requires JVM toolchain irrelevant to EShop [3] [4] | **None** — JVM-only; cannot mutate Node.js/CommonJS source. Listed as backup only | None native | GitHub `hcoles/pitest` widely used in JVM CI [3] |

**Sources**

1. StrykerJS — npm `@stryker-mutator/core`, <https://www.npmjs.com/package/@stryker-mutator/core> (Apache-2.0; latest 9.6.x, 2025)
2. Anthropic / OpenAI product docs — <https://docs.claude.com> , <https://platform.openai.com/docs> (LLM capabilities; no mutation engine)
3. PIT official site & repo — <https://pitest.org> , <https://github.com/hcoles/pitest> (Apache-2.0, JVM)
4. PIT Maven plugin docs — <https://pitest.org/quickstart/maven/> (requires green JUnit suite)
5. StrykerJS GitHub releases page, ~2.9k★ as of v9.6.1, Apr 2025 — <https://github.com/stryker-mutator/stryker-js>

## 4. Recommended Pick + Rationale

**We recommend StrykerJS (traditional) + Claude / ChatGPT (AI-augmented) for T10.**

- **EShop Fit (High):** StrykerJS is the only candidate that mutates CommonJS JavaScript natively; PIT's *None* rating confirms it cannot touch the Node.js source, which is exactly why PIT stays a backup.
- **Licence Cost + Learning Curve:** StrykerJS is free/Apache-2.0 with a *Medium* curve (JS-native, no foreign toolchain), versus PIT's *High* curve from the irrelevant JVM stack — lower friction for a one-semester seminar.
- **AI Capability:** StrykerJS scores *None* natively, so we pair it with Claude/ChatGPT (*Native* assertion synthesis) to turn surviving mutants into new assertions — a human-in-the-loop loop neither tool delivers alone.

## 5. AI Disclosure

- Which AI tool(s) you used to research this proposal
  We used both Claude to research mutation testing concepts, StrykerJS features, and to brainstorm how to integrate AI into the workflow. We also consulted official documentation and GitHub repos for StrykerJS and PIT to verify capabilities and community metrics.

- Which specific claims you cross-checked against non-AI sources
  We cross-checked all technical claims about StrykerJS and PIT against their official documentation and GitHub repositories, including licence, supported languages, configuration requirements, and community size. We also verified the AI capabilities of Claude and ChatGPT against their respective product docs.
