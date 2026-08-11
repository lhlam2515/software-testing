# Data-driven case file schema

One JSON (or TS/YAML, if that's the project's convention — match it) array,
one object per test case. This is the single source that Phase 4's spec
iterates over; nothing case-specific belongs hardcoded in the spec itself.

```jsonc
{
  "id": "TC-06",
  "sourceRef": "domain-testing.md#tc-06",   // traceability back to the design doc/ticket; omit if the case has no upstream design doc
  "title": "Wrong password increments the attempt counter",
  "layer": "hybrid",                         // "ui" | "api" | "hybrid" — which layer(s) this case exercises
  "type": "negative",                        // "positive" | "negative" | "edge"
  "arrange": { "email": "test@example.com", "setAttempts": 0 },
  "act":     { "password": "WrongPass1!" },
  "assert": {
    "ui":  { "errorText": "Invalid email or password" },   // pattern #1 — always present if layer includes "ui"
    "api": { "status": 401 },                              // pattern #2 — only if this case needs a network assertion
    "db":  { "login_attempts": 1 }                          // pattern #3 — only if this case needs a persisted-state assertion
  },
  "knownDefect": "BUG-02-003"                // the defect ID if this case is expected to fail against the current SUT; null otherwise
}
```

## Field notes

- **`id`** — stable, human-referenceable. Keep the numbering scheme the
  source design doc used (`TC-01`, `TC-BVA-01`, etc.) so a reviewer can trace
  spec failures back to a specific design decision without a lookup table.
- **`layer`** — drives which spec file (or `describe` block) a case belongs
  in if the project splits EP-level and BVA-level specs, and signals to the
  Phase 6 reviewer which assertion patterns to expect present.
- **`arrange`** — everything that must be true *before* the action: DB seed
  values, session/auth state, feature flags. If a case needs DB seeding,
  that's a signal it belongs behind the state-manipulation fixture from
  Phase 3, not behind manual UI setup steps that would make the case slow
  or flaky (e.g. seeding a lockout timestamp directly instead of waiting
  out a real lockout window).
- **`act`** — the input under test. Keep this minimal — only the values that
  vary between cases; anything constant across all cases of a feature
  belongs in the fixture/POM defaults, not repeated in every case object.
- **`assert`** — one sub-object per assertion pattern this case actually
  needs. Don't add an `api` or `db` block just for completeness if the case
  doesn't meaningfully exercise that layer — an assertion that always
  trivially passes is noise the Phase 6 reviewer has to sift through.
- **`knownDefect`** — the mechanism for the one rule that matters most in
  this whole schema (see below). `null`/absent means the case is expected to
  pass against a spec-compliant SUT.

## The rule `assert` must never break

**`assert` encodes the specification's correct behavior. It never encodes
the SUT's currently observed behavior.**

Concretely: if you find, while building this file, that the real system
currently does something different from what the spec says it should do,
write the *spec-correct* expected value into `assert` and record the
divergence via `knownDefect` (or a `note` field if there's no formal defect
ID yet). Do not "fix" the case by loosening `assert` to match what you
observed — a suite built that way goes green not because the system is
correct, but because the suite stopped checking anything. The whole value of
this pipeline (as demonstrated in the workflow this skill packages) came
from cases that were *expected* to fail against a real defect, and did.

When the design doc and the SUT's actual source code disagree about what
"correct" means (the design doc assumed a validation exists that the handler
never runs, or assumed an auth check that a route is missing), prefer reading
the source over trusting the design doc blindly — but only for pinning down
what the *spec's intent* actually was, never for adopting the buggy behavior
as the new expectation.
