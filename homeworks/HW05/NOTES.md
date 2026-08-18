# NOTES — pending items for [AI-02]_AI_Audit_Report.md

Scratch file, not a deliverable. Each line is a TODO for M8 when the full
audit report gets written up (5 sub-items per artifact: Prompt, AI Output,
Verdict, Reasoning, Student Fix). Points back to prompt_log.md for the
verbatim prompt/output instead of duplicating it here.

- [ ] [AI-02] Artifact (Spike test plan, `23127216_Spike_20260817.js`, lockout sub-scenario): AI initially assumed the lockout response was `423 Locked`; the real backend (`apps/backend/server.js:40-44`) returns `403`, since the lockout check runs before the password compare and the 2nd failed attempt (the one that sets `locked_until`) still gets a `401`, not the lockout status — only the 3rd attempt gets `403`. Self-caught and fixed against the real source before the answer was given (see `prompt_log.md` Entry 006, "Human review" line). Likely verdict: `INVALID` (initial assumption) → corrected same-turn, no separate student fix pass needed.
