@AGENTS.md

---

# Claude Code — Project Overrides

## Skills

Skills are stored in `.agents/skills/` (source of truth) and symlinked into `.claude/skills/`.
Load via the Skill tool by name: `commit`, `playwright-cli`.

To update a skill: edit `.agents/skills/<name>/SKILL.md` — changes reflect immediately in both Claude Code and Codex via the symlink.

## Hooks

Configured in `.claude/settings.json`:

- `UserPromptSubmit` → `.claude/hooks/prompt-capture.js` (async, logs prompts to session context)
- `Stop` → `.claude/hooks/transcript-capture.js` (async, saves conversation transcript)
