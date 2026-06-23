---
name: commit
description: >
  Create well-formatted git commits following Conventional Commits 1.0.0 spec.
  Invoke whenever the user is ready to commit — staged or unstaged. Triggers:
  "/commit", "commit", "commit changes", "commit these", "create a commit",
  "tao commit", "tạo commit", "commit this". Handles staging, diff analysis,
  atomic split detection, message composition, and execution. No emoji anywhere.
  Body uses bullet points. Messages in English. Also trigger when user says
  "push" or "save to git" if no commit has been made yet for the current changes.
---

# Commit — Conventional Commits Workflow

This skill guides creation of a clean, atomic git commit following the
Conventional Commits 1.0.0 specification. The goal is a commit history that
communicates intent clearly to both humans and tooling (changelogs, semver bumps).

Work through these 5 steps in order. Don't skip ahead — each step informs the next.

---

## STEP 1 — Load git state

Run these two commands to understand what's staged and what's modified:

```bash
git status --porcelain
git diff --cached --name-only
```

**If nothing is staged:**
- Show the user which files are modified/untracked
- Ask: stage all, or specify files?
- If user says "all" or doesn't respond with specific files, run `git add -A`
- Never auto-stage without showing the user what will be staged

**If files are already staged:**
- Proceed with whatever is staged — don't touch unstaged files

---

## STEP 2 — Diff analysis

Run `git diff --staged` to read the full diff.

From the diff, determine:

1. **Type** — what kind of change is this? (see Type Reference below)
2. **Scope** — which module/area is affected? (see Scope Reference below)
3. **Breaking change** — does this remove/rename a public API, change a contract, or break callers?
4. **Atomic check** — do these changes form a single coherent logical unit?

The atomic check is the most important judgment call: a commit should tell one story.
If the diff mixes a bug fix with a new feature, or updates three unrelated modules with
different change types, it's not atomic — proceed to Step 3 to split.

If the changes are clearly one logical unit, skip Step 3 and go to Step 4.

---

## STEP 3 — Split check (only if needed)

When the diff mixes multiple distinct concerns (different types, unrelated modules,
independent logical changes), splitting produces a more useful history and easier reverts.

**Propose concrete split:**

Instead of asking abstractly "should we split?", show exactly what the splits would be:

```
Proposed split:
  1. feat(auth): add JWT refresh token endpoint
  2. fix(api): correct response status on empty result
  3. docs: update authentication flow diagram
```

Ask the user: "Split into N commits, or commit as one?"

**If splitting:**
1. For each proposed commit in sequence:
   - Stage the relevant files: `git add <specific files>`
   - Confirm staged set: `git diff --cached --name-only`
   - Compose message (Step 4) and execute (Step 5)
   - Then proceed to the next split
2. Remaining files carry over to the next iteration

**If committing as one:**
- Proceed to Step 4 with all staged files
- Choose the type that reflects the primary change

---

## STEP 4 — Compose the commit message

### Format

```
<type>(<scope>): <description>

- change 1
- change 2
- change 3

BREAKING CHANGE: <what breaks and how to migrate>
Closes #N
```

The subject line (first line) is mandatory. Body and footer are optional — include
them when the diff is non-trivial or the reasoning isn't obvious from the subject alone.

### Hard rules

- **No emoji, no icons** — anywhere in the message, including the subject
- **type**: lowercase, from the allowed list (see Type Reference)
- **scope**: lowercase noun in parentheses; omit entirely if changes are cross-cutting
- **description**: imperative present tense ("add", "fix", "remove" — not "added", "fixes")
- **description**: lowercase first character, no trailing period
- **header total length**: ≤ 100 characters (type + scope + description combined)
- **body**: bullet list only — no prose paragraphs; one blank line between subject and body
- **footer**: one blank line between body (or subject) and footer
- **BREAKING CHANGE**: required in footer when `!` is used in the type/scope line
- **Language**: English

### Body guidance

Include a body when the diff is non-trivial and the subject alone doesn't capture the full
picture. Concrete triggers:
- The diff contains multiple distinct logical changes within one commit
- The implementation has non-obvious details (algorithm choice, caveats, side-effects)
- There are migration notes or dependencies callers need to know about

Skip the body when the subject is self-contained — a single-file addition with a clear
name (e.g., `docs: add README with installation instructions`) doesn't gain anything from
restating the file contents in bullet form.

Each bullet should describe **what** changed — not restate the subject line.
Keep bullets concise; one line each when possible.

### Breaking changes

Two required markers when introducing a breaking change:
1. Append `!` to the type/scope: `feat(api)!: remove /v1/status endpoint`
2. Add `BREAKING CHANGE: <description>` in the footer explaining what breaks and how to adapt

---

## STEP 5 — Confirm and execute

Show the proposed commit message in a code block:

```
feat(hooks): add workspace slug to transcript paths

- derive slug from cwd relative to $HOME
- append slug as subdirectory under context/transcripts/
- update pending buffer file to include slug prefix
```

Ask the user to confirm, or offer adjustments:
- Rephrase the description?
- Change type or scope?
- Add/remove body bullets?

Once confirmed, execute with the heredoc form to preserve multi-line formatting:

```bash
git commit -m "$(cat <<'EOF'
feat(hooks): add workspace slug to transcript paths

- derive slug from cwd relative to $HOME
- append slug as subdirectory under context/transcripts/
- update pending buffer file to include slug prefix
EOF
)"
```

After committing, show the commit hash and subject line from `git log -1 --oneline`.

---

## Type Reference

| Type | When to use |
|------|-------------|
| `feat` | New feature, new endpoint, new component, new capability added to the user |
| `fix` | Corrects a bug or incorrect behavior |
| `refactor` | Restructures code without changing behavior (rename, extract, reorganize) |
| `perf` | Specifically improves performance — a specialized form of refactor |
| `docs` | Documentation and comments only; zero logic change |
| `test` | Adds or corrects tests; does not modify production code |
| `build` | Dependency updates, build scripts, tooling configuration |
| `ci` | CI/CD pipeline configuration (GitHub Actions, hooks, deploy scripts) |
| `chore` | Admin tasks: .gitignore, initial commit, version bumps, metadata |
| `style` | Formatting only — whitespace, semicolons, line breaks; zero logic change |
| `revert` | Reverts a previous commit; reference the reverted hash in the footer |

**Choosing between types when uncertain:**
- `feat` vs `refactor`: did user-facing behavior change? Yes → `feat`. No → `refactor`.
- `fix` vs `refactor`: was there a bug (incorrect behavior)? Yes → `fix`. No → `refactor`.
- `build` vs `chore`: does it affect the build output? Yes → `build`. No → `chore`.
- `ci` vs `chore`: does it affect CI/CD pipeline config files (GitHub Actions, Drone, etc.)? Yes → `ci`. Local shell hooks or scripts → `feat` or `fix` depending on whether they're new.

**New file rule:** When the diff adds a file that did not previously exist, the type should reflect what the file *introduces*, not what the file says it does internally. A new Python script that repairs connections is a new capability → `feat(tools)`. A new test file → `test`. A new markdown article → `docs`. Only use `fix` for a new file if the file itself directly patches a broken behavior (e.g., a missing config that caused failures).

---

## Scope Reference

Scope narrows the type to a specific area. Omit it when changes span multiple areas or
when the type alone is sufficiently precise.

**AI-OS path-based inference:**

| Changed paths contain | Scope |
|-----------------------|-------|
| `hooks/` | `hooks` |
| `tools/` | `tools` |
| `knowledge/` | `knowledge` |
| `context/` | `context` |
| `.claude/skills/` | `skills` |
| `wiki/` | `wiki` |
| `projects/<name>/` | `<name>` (project slug) |
| Multiple areas above | omit scope |

For other projects, derive scope from the module, feature, or package name
(e.g., `feat(auth):`, `fix(shopping-cart):`, `docs(api):`).

---

## Examples

**Single-file fix, no body needed:**
```
fix(hooks): correct slug derivation when path contains dots
```

**Feature with body:**
```
feat(knowledge): add kp-repair-connections script

- detect asymmetric wiki connections (A links B, B does not link A)
- repair in both directions automatically
- write repair summary to knowledge/log.md
```

**Breaking change:**
```
feat(api)!: remove /v1/status endpoint

- consolidated health check to /v1/health
- removed /v1/status which returned redundant data

BREAKING CHANGE: /v1/status no longer exists; update clients to use /v1/health
```

**Revert:**
```
revert: revert "feat(hooks): mirror projects/ folder in transcript paths"

Refs: 139a6bf
```

**Chore (no scope, no body):**
```
chore: add AI-OS.code-workspace to repo
```
