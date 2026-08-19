---
name: using-worktree
description: Use when starting homework work (HW01-HW05...), isolated SUT changes, or parallel assignment work that should avoid disturbing the current checkout. Trigger on "làm HWxx song song", "tạo worktree cho HWxx", "isolate this homework", "work on HW04 and HW05 at the same time".
---

# Using Worktree

Create an isolated Git worktree before starting work on a homework (HW01-HW05, or a future HWxx) when: the current checkout has unrelated in-progress work, the homework should be reviewable/committable on its own branch, more than one homework is being worked on in parallel, or the user explicitly asks to use a worktree.

This repo hosts one shared SUT (`apps/`) and multiple independent homework tracks (`homeworks/HW01` .. `HW05`). Homeworks are graded and committed independently, so keeping each active homework in its own worktree avoids cross-contaminating `git status`/diffs and lets deep work on HW04 continue while HW05 is reviewed, or vice versa.

## Safety Rules

- Never overwrite, stash, reset, or move uncommitted user changes unless explicitly asked.
- If already inside a linked worktree, do not create another one by default — confirm the user actually wants a second parallel worktree.
- Use `.worktrees/<branch-name>` as the default location when no workspace-native worktree tool is available.
- Before creating `.worktrees/...`, verify `.worktrees/` is ignored. If not ignored, add it to `.gitignore` first (see Setup below) rather than stopping — this repo does not yet ignore it by default.
- Do not run `git pull` or other network-update commands unless the user explicitly allows it.
- Never create a second worktree for a homework branch that already has one checked out elsewhere (`git worktree list`) — reuse it instead.

## Setup: Ignore `.worktrees/`

Check once per repo:

```bash
git check-ignore -q .worktrees/ && echo ignored || echo NOT-ignored
```

If not ignored, append to `.gitignore`:

```
.worktrees/
```

This is a one-line, low-risk addition — do it directly rather than blocking the workflow, then report it was added.

## Baseline Gate

This repo has no unified `pnpm check`/monorepo root script. There is no mandatory baseline gate. If the user wants a sanity check before branching, offer the relevant one for the area being touched instead:

- Backend touched: `cd apps/backend && node server.js` (manual smoke start; no automated test script is wired up yet — `npm test` is a stub).
- Frontend touched: `cd apps/frontend-web && npm run build` (or `frontend-admin` / `frontend-mobile`).
- Otherwise: record `baseline: NOT RUN` and proceed — do not block homework setup on this.

## Workflow

### 1. Inspect Environment

```bash
git status --short
git branch --show-current
git rev-parse --git-dir
git rev-parse --git-common-dir
git worktree list
git check-ignore -q .worktrees/ && echo ignored || echo NOT-ignored
```

If `git rev-parse --git-dir` and `git rev-parse --git-common-dir` resolve to different directories, you are already in a linked worktree. Report that and continue in the current worktree unless the user asked for another parallel one.

If `.worktrees/` is not ignored, apply the Setup step above before creating anything.

### 2. Choose Branch Name

Follow this repo's existing convention (see `git branch -a`): homework branches are named `feature/HW<NN>` (e.g. `feature/HW04`, `feature/HW05`), matching the existing `feature/HW03` pattern. For non-homework isolated work, fall back to `feature/`, `bugfix/`, `hotfix/`, `chore/` + short technical description.

- Homework work → `feature/HW<NN>` (zero-padded to match existing branches, e.g. `HW04` not `HW4`).
- Ad hoc SUT/tooling work → `<prefix>/<short-description>`, no PBI/ticket IDs.

### 3. Create Worktree

Use the current `main` checkout as the base unless the user specified another safe base (e.g. continuing from an existing remote branch):

```bash
git worktree add -b feature/HW<NN> .worktrees/HW<NN> main
```

If the branch already exists (including remote-tracked, e.g. `feature/HW03`), attach to it instead of creating a new one:

```bash
git worktree add .worktrees/HW<NN> feature/HW<NN>
```

Use `.worktrees/HW<NN>` (not the full branch name) as the directory so multiple homeworks stay short and predictable, e.g. `.worktrees/HW04`, `.worktrees/HW05`.

Do not delete an existing path to make room. Stop and report the collision.

### 4. Confirm

Report:

- worktree path;
- branch name;
- base used;
- baseline status (`PASS`, `FAIL`, or `NOT RUN` — see Baseline Gate);
- other active worktrees (from `git worktree list`), so parallel homework tracks stay visible;
- any uncommitted changes in the original checkout that were left untouched.
