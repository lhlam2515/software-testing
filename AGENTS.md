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

## Agent Routing Rules

| Situation | Action |
|-----------|--------|
| Understand SUT behavior | Read `docs/eshop-sut/srs.md` |
| Look up an API endpoint | Read `docs/eshop-sut/api_specification.md` |
| Start the full SUT | `bash apps/run-servers.sh` |
| Start backend only | `cd apps/backend && node server.js` |
| Write Playwright E2E tests | Use skill `playwright-cli`; save tests in `apps/frontend-web/tests/` or `apps/frontend-admin/tests/` |
| Write backend unit/integration tests | Save in `apps/backend/`; use `supertest` (already installed) |
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
