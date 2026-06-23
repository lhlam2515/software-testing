# CSC13003 Software Testing — Workspace Guide

Academic project for the Software Testing course (CSC13003) at HCMUS.
The System Under Test (SUT) is **e-Shop** — a full-stack Vietnamese e-commerce application.
Testing methodology follows **ISTQB Foundation Level** (Chapters 1–6).

---

## Directory Structure

```
csc13003-software-testing/
├── apps/                    # SUT — e-Shop application (all runnable source)
│   ├── backend/             # Node.js/Express API + SQLite database
│   ├── frontend-web/        # Vite + React customer storefront (port 5173)
│   ├── frontend-admin/      # Vite admin dashboard (port 5174)
│   ├── frontend-mobile/     # Mobile variant
│   └── run-servers.sh       # Start backend + web + admin together
├── docs/                    # Reference material (read-only, never modify)
│   ├── eshop-sut/
│   │   ├── srs.md           # System Requirements Specification
│   │   ├── api_specification.md  # Full REST API reference
│   │   └── setup_guide.md   # Environment setup instructions
│   └── istqb/
│       ├── ch1_fundamentals.md
│       ├── ch2_lifecycle.md
│       ├── ch3_static.md
│       ├── ch4_design.md    # Test design techniques (EP, BVA, decision tables…)
│       ├── ch5_management.md
│       └── ch6_tools.md
├── seminar/                 # T10 seminar work (Mutation Testing)
│   ├── 00-brief/            # Course materials — read-only
│   ├── 01-research/         # Research notes, clips, baseline metrics
│   ├── 02-planning/         # Working docs: conventions, outline, task split, timeline
│   └── 03-deliverables/     # Submission outputs (fixed naming, never rename)
├── context/                 # Course policies and AI use agreements
│   ├── homework_polices.md  # Assignment rules, grading criteria
│   └── ai_use_agreement.md  # Required AI disclosure policy
├── templates/               # Submission form templates
├── .agents/
│   └── skills/              # Source of truth for shared agent skills
│       ├── commit/          # Conventional Commits workflow
│       └── playwright-cli/  # Browser automation + test generation
└── .claude/
    └── skills/              # Symlinks → .agents/skills/ (Claude Code entry point)
```

---

## Architecture: e-Shop SUT

```
Browser / Test Runner
       │
       ▼
frontend-web  (Vite, :5173)   frontend-admin  (Vite, :5174)
       │                              │
       └──────────────┬───────────────┘
                      ▼
              backend API  (:3000)
              Node.js / Express
                      │
                      ▼
               SQLite (database.sqlite)
```

**Key backend facts:**

- Base URL: `http://localhost:3000`
- Auth: JWT (pass token in `Authorization: Bearer <token>` header)
- Database file: `apps/backend/database.sqlite`
- Full API reference: `docs/eshop-sut/api_specification.md`

---

## Seminar: T10 — Mutation Testing & Test Effectiveness

**Live date:** 22/07/2026 | **Dashboard:** `seminar/README.md` (gate checklist + deliverable status)

### Task Ownership

| Person | Code | Test files | FR coverage |
|--------|------|-----------|-------------|
| Lâm (T3a) | `coupon.test.js`, `auth.test.js`, shared `helpers/` | `apps/backend/__tests__/` | FR-09 (Coupon), FR-02 (Auth) |
| Vũ (T3b) | `order-status.test.js`, `cart.test.js` | `apps/backend/__tests__/` | FR-10 (Order Status), FR-08 (Cart) |

### Key Planning Files

| Purpose | File |
|---------|------|
| Gate checklist + deliverable status | `seminar/README.md` |
| Test naming, DB strategy, auth helper | `seminar/02-planning/test-convention.md` |
| Seminar content outline + slide topics | `seminar/02-planning/content-outline.md` |
| Preparation plan + weekly timeline | `seminar/02-planning/prep-plan.md` |
| T3a / T3b task split detail | `seminar/02-planning/task-assignment.md` |
| Current week checklist | `seminar/02-planning/weekly-checklist.md` |
| Topic spec, learning objectives, rubric | `seminar/00-brief/topic-t10.md` |
| Stage workflow S1–S8 | `seminar/00-brief/seminar-workflow.md` |

---

## Test Tooling (Backend)

| Tool | Purpose |
|------|---------|
| **Jest 30** | Unit + integration test framework |
| **supertest** | HTTP assertion library for Express routes |
| **Stryker** | Mutation testing |

```bash
# from apps/backend/
npm test                  # run all tests
npm run test:coverage     # with coverage report
npm run stryker           # mutation testing (tests must pass first)
```

**Auth helper:** `getAuthToken()` in `apps/backend/__tests__/helpers/auth.js` — returns a valid JWT for `Authorization: Bearer <token>` headers. Always import this; never hardcode tokens.

**Test convention:** follow `seminar/02-planning/test-convention.md` for file structure, naming (`it('returns 400 when coupon is expired')`), and DB strategy before writing any test.

---

## Agent Routing Rules

| Situation | Action |
|-----------|--------|
| Understand SUT behavior | Read `docs/eshop-sut/srs.md` |
| Look up an API endpoint | Read `docs/eshop-sut/api_specification.md` |
| Start the full SUT | `bash apps/run-servers.sh` |
| Start backend only | `cd apps/backend && node server.js` |
| Write Playwright E2E tests | Use skill `playwright-cli`; save tests in `apps/frontend-web/tests/` or `apps/frontend-admin/tests/` |
| Write backend unit/integration tests | Read `seminar/02-planning/test-convention.md` first; save in `apps/backend/__tests__/`; use `supertest` |
| Run mutation testing | `cd apps/backend && npm run stryker` (tests must pass first) |
| Understand seminar scope and gates | Read `seminar/README.md` |
| Check seminar topic and grading rubric | Read `seminar/00-brief/topic-t10.md` |
| Check seminar stage workflow (S1–S8) | Read `seminar/00-brief/seminar-workflow.md` |
| See seminar content outline / slide topics | Read `seminar/02-planning/content-outline.md` |
| See preparation timeline | Read `seminar/02-planning/prep-plan.md` |
| See T3a / T3b task split | Read `seminar/02-planning/task-assignment.md` |
| Check current week checklist | Read `seminar/02-planning/weekly-checklist.md` |
| View or edit deliverables | Work in `seminar/03-deliverables/` — never rename files |
| Commit work | Use skill `commit` |
| Look up test design techniques | Read `docs/istqb/ch4_design.md` |
| Check assignment rules | Read `context/homework_polices.md` |
| Modify SUT code | Allowed with caution — both app logic and test files live inside `apps/` |

---

## Skills

Both Claude Code and Codex load skills via the Skill tool.

| Skill | Trigger | Purpose |
|-------|---------|---------|
| `commit` | `/commit`, "commit", "tạo commit" | Atomic git commits following Conventional Commits 1.0.0 |
| `playwright-cli` | "open browser", "test this page", "generate playwright test" | Browser automation, test generation, screenshot, session capture |

Skill files live in `.agents/skills/` and are symlinked into `.claude/skills/`.
To add a new skill shared between agents: add it to `.agents/skills/`, then symlink from `.claude/skills/`.

---

## Git Workflow

- **Commit frequently** — single-commit submissions score 0
- **Commit messages**: English, Conventional Commits format (use `commit` skill)
- **Only commit your own work**: do not commit teammates' files
- AI use must be disclosed per `context/ai_use_agreement.md`
