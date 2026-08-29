# Audit Heuristics

Use authoritative specifications as the oracle. Generated test cases, catalogs, and traces
are audit subjects, not proof of their own correctness.

## Per-case checklist

Check every item before assigning a label:

- **Test intent:** one identifiable condition is tested; the row is not an unmarked duplicate.
- **Technique:** the stated EP, BVA, state, security, or schema technique matches the input.
- **Precondition:** account, data, authorization, state, counter, and timing values are concrete
  enough to reproduce the case.
- **Input/action:** endpoint, method, headers, parameters, payload, and sequence are unambiguous.
- **Expected result:** status, body, headers, state changes, and invariants match documented
  behavior; unsupported details are not invented.
- **Oracle:** every material expectation has an observable assertion, including negative and
  persistence checks where applicable.
- **Trace:** the cited location exists and directly supports the condition and expected result.
- **Isolation:** the result can be attributed to the intended condition unless the requirement
  explicitly concerns an interaction between conditions.

## Label decision rule

Apply labels in this order:

1. **INVALID:** a material claim contradicts an authoritative source, the trace is false, or
   the test intent cannot be preserved without changing what the case tests.
2. **INCOMPLETE:** the intent is source-supported, but one or more required details are missing,
   ambiguous, unreproducible, under-asserted, or incorrectly marked `UNSPECIFIED`.
3. **VALID:** every checklist item passes and no material correction is required.

When a row has multiple defects, use the first applicable label and list every material defect
in `Student fix`. Do not use `INVALID` for style preferences. A source-supported duplicate may
remain `VALID`, but flag the redundancy in reasoning and do not count it as unique coverage.

## Spec silence

A source that does not define a behavior is neither approval nor prohibition. Silence is a gap
in the specification, not a defect in the test case. Apply this as a fourth rule, after the
three above:

1. **Silent source:** when no authoritative source defines the outcome, the case stays
   admissible. Label it `VALID` when it names the undefined outcome explicitly, states what to
   record, and asserts no invented status code, body shape, or boundary inclusivity. Label it
   `INCOMPLETE` when it silently assumes one of the undefined outcomes as if it were
   documented. Never label it `INVALID` for silence alone.

Keep the two kinds of case distinct, and keep them distinct in coverage claims:

- **Contract test:** a source defines the expected outcome, pass/fail is decidable, and the
  case counts toward requirement coverage.
- **Characterization test:** no source defines the outcome, the case records actual behavior to
  expose the gap, and it counts toward input coverage only.

A characterization test is legitimate work. It converts an unwritten assumption into a recorded
observation, which is what a design-time specification review is for. Do not delete it, and do
not let it stand as proof that a requirement is satisfied.

Boundary inclusivity is silence unless the source states it. "Locked for 30 seconds" does not
decide whether the request at exactly T=30s is rejected. Asserting either outcome invents the
contract.

## Trace admissibility

A trace claims that the cited location supports this exact condition and this exact expected
result. Check direction and scope, not keyword overlap.

- **Wrong scope:** a storage requirement does not govern response fields. A requirement about
  consuming a credential does not govern issuing one. Reusing a requirement ID across domains is
  a false trace even when the underlying security idea is sound.
- **Overreach:** when a row asserts more than the cited source states, correct the trace or split
  the extra assertion into its own characterization row. Do not reject the whole row.
- **Generated artifacts:** partition catalogs, state models, security case lists, and generated
  schema files are audit subjects. Citing one of them alone is not source evidence. Cite the
  authoritative location, and use the generated ID only as a cross-reference.

## Correction checklist

For every `INVALID` or `INCOMPLETE` row:

- name each affected field;
- provide its complete replacement value, not a general recommendation;
- cite the source supporting the replacement;
- preserve the original test intent when possible;
- if the intent itself is unsupported, replace or reject the case explicitly;
- recheck precondition, expected result, oracle, and trace together after the correction;
- keep the original TC ID: a correction never renumbers, resequences, or drops IDs that
  execution data, request templates, or filed defects already reference;
- correct fields, not scenarios: rewriting `Input / action` into a different sequence produces a
  new case, so add it in the gap pass instead of overwriting the audited row;
- when one assertion is unsupported but the rest of the row holds, strip that assertion rather
  than rejecting the row.

## Gap checklist

Compare the original suite and upstream catalogs against the sources. Look for missing:

- equivalence classes and exact boundary neighbors;
- lifecycle transitions, forbidden transitions, reset behavior, and repeated actions;
- authentication, authorization, IDOR, injection, sensitive-data, and role-escalation cases;
- response schemas, error schemas, required headers, types, optional fields, and invariants;
- endpoint-specific concurrency, replay/idempotency, header handling, encoding, normalization,
  and timing behavior, but only when a source defines the expected outcome;
- intersections between already-modeled dimensions when the interaction is itself required.

A proposed addition counts only if it is absent, source-backed, independently observable, and
not a reworded duplicate.

## Miss taxonomy

- **Prompt quality:** a specific generator instruction or omission excluded the case type.
- **Model limitation:** the case required a traceable cross-source or cross-model connection
  that the generator failed to make.
- **API characteristic:** an endpoint-specific behavior was not covered by the generic design
  process.

For `Why the AI missed it`, name the concrete instruction, missing connection, or endpoint
behavior. Avoid generic claims such as "AI is imperfect."

## Auditor self-checks

Run these against the audit itself before presenting the label table:

- **Symmetric standard:** hold your own corrections to the evidence bar you applied to the
  original. If silence disqualifies an original expected result, it also disqualifies a
  replacement expected result you inferred from that same silence.
- **Reasoning is evidence:** "Matches" is not a reasoning entry. Name the check that decided the
  label. A `VALID` row asserts that every per-case check passed, so it must say which one was
  load-bearing.
- **Label distribution is a signal, not a target:** a near-zero `INVALID` count usually means
  traces were accepted without opening them. A near-total `INVALID` count usually means a
  standard outside this document was applied, most often a contract-only reading that rejects
  characterization. Investigate either extreme before presenting the table.
- **Downstream cost:** state whether the corrections invalidate existing execution data, request
  templates, generated collections, or filed defects. Breaking a downstream artifact without
  disclosing it is a defect in the audit.
- **Gate discipline:** provisional labels belong in the review pass, not on disk. Write nothing
  under `audit/` before the user accepts the table, and never record a confirmation the session
  did not receive.

## Re-audit challenge rules

Applies to Pass 2 only, when the artifact under review is a prior audit.

Three defect classes to hunt, in this order:

1. **False negative** — a `VALID` row that fails a mandatory per-case check the prior pass never
   named, or whose `Trace` the prior pass accepted without opening the cited location.
2. **False positive** — an `INVALID` / `INCOMPLETE` row where the prior pass invented a
   requirement no source states, misapplied the spec-silence rule, or penalized a row for a
   defect that actually lives in a different row.
3. **Bad fix** — a `Student fix` that cannot be verified against a source, silently changes the
   test intent, upgrades an `UNSPECIFIED` to a concrete value, or contradicts the fix given to
   another row.

Verdict assignment:

| Situation | Verdict |
| --- | --- |
| Label and fix both survive re-derivation | `upheld` |
| Label changes | `overturned` |
| Label survives, fix text is replaced | `fix-corrected` |
| A Pass 1 addition is removed from the suite | `dropped` |

Constraints:

- A prior audit's reasoning is never admissible evidence. Re-open the oracle.
- Spec silence still governs: a prior pass that resolved an `UNSPECIFIED` is a false positive
  even when its resolution is plausible.
- Preserve original TC IDs across passes. A dropped addition leaves a documented gap in the
  sequence; do not renumber.
- Report disagreement counts even when they are zero, and state which rows were re-derived.
