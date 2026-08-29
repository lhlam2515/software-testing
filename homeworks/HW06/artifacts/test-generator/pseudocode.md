# AI-driven API Test Generator - Pseudocode

Design artifact for the `api-test-generator` agent skill. This is pseudocode, not
source code: it is not runnable, and names such as `oracle()` or `coverage_gaps()`
describe an obligation the skill instructions place on the agent, not a function
that exists in a file. The executable part of the skill is prose plus the output
contract in `../skills/api-test-generator/`.

Notation: Python-like syntax, `SEC-01..SEC-07` for a range of security
requirement ids, `UNSPECIFIED` for a behaviour no source defines.

## Constants

```text
ORACLES               = [srs.md, api_specification.md, specs/security-requirement.md]
DEFAULT_TARGET        = 35 cases per endpoint
MAX_REFINEMENT_ROUNDS = 2      # after this, a human reads the shortfall
```

The oracle list is ranked and read-only. Anything the agent itself wrote is a
subject under review, never evidence.

## Main procedure

```text
procedure generate_api_test_suite(fr_id, method, path, target = DEFAULT_TARGET):

    slug = kebab(fr_id, short_name(path))
    out  = "homeworks/HW06/artifacts/test-cases/" + slug + "/"

    # S1. Extract the contract, once, for every downstream stage
    contract = extract_contract(fr_id, method, path, ORACLES)
    write(out + "specs/openapi.yaml", contract.openapi,
          banner = "AI-generated; human audit required")
    write(out + "specs/requirements.md",          contract.behaviour_with_sources)
    write(out + "specs/security-requirement.md",
          applicability(SEC-01..SEC-07, reason_required = true))

    # The gate every branch must pass a claim through
    function oracle(claim):
        line = locate_in(ORACLES, claim)
        if line is none:
            return UNSPECIFIED          # probe the response, assert nothing
        return Expected(value = claim.value, trace = line)

    # S2 to S5. Four independent branches off the same contract
    branches["EP"]     = partition_catalog(contract.parameters, oracle)
    branches["STATE"]  = lifecycle_model(contract, oracle)
    branches["SEC"]    = security_cases(contract, oracle)
    branches["SCHEMA"] = schema_cases(contract.responses, oracle)

    # S6. Consolidate, then decide on coverage rather than on case count
    for round in 0 .. MAX_REFINEMENT_ROUNDS:
        suite = merge_into_one_tc_sequence(branches)      # master-test-cases.md
        gaps  = coverage_gaps(suite, contract)
        if gaps is empty and count(suite) >= target:
            break
        if round == MAX_REFINEMENT_ROUNDS:
            report_shortfall(gaps, thin_group = weakest(branches))
            break
        branches = deepen(branches, gaps)                 # never pad, only cover

    # S7. Emit the data-driven execution inputs
    write(out + "master-test-cases.md",      suite)
    write(out + "data/test-data.csv",        one_row_per_case(suite))
    write(out + "data/request-template.md",  one_parameterised_request(contract))

    assert every case in suite: case.trace points to a real source line
    assert every case in suite: case has a CSV row

    return handoff(suite, next_stage = "api-test-auditor", model = "different")
```

## Branch S2 - domain partitions

One coverage obligation per row. Valid classes may be combined; each invalid
class is isolated so a failure names one cause.

```text
procedure partition_catalog(parameters, oracle):
    rows = []
    for p in parameters:                    # body, query, path, header
        for c in complete_non_overlapping_partitions(p):
            rows.append(Row(id = next_ec_id(), var = p, class = c,
                            expected = oracle(c.rule)))
        if p is ordered:                    # numeric, length, time
            for b in boundary_points(p, model = "3-value"):
                rows.append(Row(id = next_bva_id(), var = p, point = b,
                                expected = oracle(b.rule)))
    return isolate_invalid_classes(rows)
```

## Branch S3 - state or resource lifecycle

Classify first. A wrong classification here mislabels the coverage claim, which
is worse than missing a case.

```text
procedure lifecycle_model(contract, oracle):
    kind = classify(contract)               # EXPLICIT_STATE | IMPLICIT_STATE | NO_STATE

    if kind == NO_STATE:
        # Ordering, missing or deleted resource, isolation between resources.
        # Reported as lifecycle coverage, never as state-transition coverage.
        return lifecycle_cases(contract, oracle)

    table = state_table(contract)           # states x events, guards on transitions
    cases = [Case(t, expected = oracle(t.guard)) for t in table.transitions]
    cases = cases + invalid_transitions(table) + terminal_reentry(table)
    return with_coverage(cases, metric = "all-transitions")
```

## Branch S4 - security

Only SEC ids marked applicable in `specs/security-requirement.md`, and never a
bare vulnerability label.

```text
procedure security_cases(contract, oracle):
    cases = []
    for sec in applicable_sec_ids(contract):
        cases.append(Case(
            payload   = concrete_payload(sec, contract),   # not "try SQL injection"
            asset     = protected_asset(sec),
            principal = attacker_role(sec),
            control   = expected_control(sec),
            expected  = oracle(sec.requirement_line)))
    return cases
```

## Branch S5 - schema

Specification-based contract checking against documented variants only.

```text
procedure schema_cases(responses, oracle):
    cases = []
    for r in responses:                     # documented status codes
        cases.append(Case(shape    = required_and_forbidden_fields(r),
                          types    = declared_types(r),
                          expected = oracle(r.spec_line)))
    for undocumented in status_codes_implied_but_not_documented(responses):
        cases.append(Case(shape = UNSPECIFIED, note = "probe only"))
    return mark_overlaps_with(cases, group = "SEC")
```

## The coverage gate

These four checks decide whether the suite may leave the skill. Count is not one
of them.

```text
procedure coverage_gaps(suite, contract):
    return {
        parameters_without_ep_row     : [p for p in contract.parameters
                                           if not suite.covers(p)],
        applicable_sec_without_case   : [s for s in applicable_sec_ids(contract)
                                           if not suite.covers(s)],
        uncovered_valid_transitions   : suite.missing_transitions(),
        undocumented_response_variants: suite.missing_response_variants(),
    }
```

## Boundaries

Violating any of these invalidates the audit trail, so they are stated in the
skill text rather than left to judgement.

```text
FORBIDDEN_IN_THIS_SKILL = [
    "label a case VALID / INVALID / INCOMPLETE",       # belongs to api-test-auditor
    "send a request to the SUT",                       # belongs to api-test-execute
    "turn an undocumented assumption into an expected result",
]
```
