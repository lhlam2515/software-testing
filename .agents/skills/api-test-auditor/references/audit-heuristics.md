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

## Correction checklist

For every `INVALID` or `INCOMPLETE` row:

- name each affected field;
- provide its complete replacement value, not a general recommendation;
- cite the source supporting the replacement;
- preserve the original test intent when possible;
- if the intent itself is unsupported, replace or reject the case explicitly;
- recheck precondition, expected result, oracle, and trace together after the correction.

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
