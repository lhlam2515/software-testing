# Output Contract

All paths are relative to `<output-base>/<api-slug>/`.

```text
specs/openapi.yaml
specs/requirements.md
specs/security-requirement.md
domain-partition-catalog.md
state-model.md
security-cases.md
schema-cases.md
master-test-cases.md
data/test-data.csv
data/request-template.md
```

Use the columns below. Add endpoint-specific columns only when needed for traceability or
data-driven execution.

## Contract extraction

`specs/openapi.yaml` is a minimal OpenAPI 3 fragment for one operation. Start with:

```yaml
# AI-generated from docs/eshop-sut/api_specification.md; human audit required.
```

Include `paths`, operation parameters, `requestBody`, and every documented response.

`specs/requirements.md`:

```markdown
# <FR-id> <Feature> - Requirements Extract

Source: <file and section or line>

## Functional behavior
<paraphrased behavior with source references>

## Business rules
- <rule and source>

## State classification
<classification or pending classification; link to ../state-model.md>
```

`specs/security-requirement.md`:

| SEC-ID | Requirement | Applies? | Reason / attack surface |
| --- | --- | --- | --- |

Include SEC-01 through SEC-07, including explicit No rows.

## Design catalogs

`domain-partition-catalog.md`:

| Row ID | Variable | Location | Coverage ID | Class / boundary position | Concrete value or rule | Expected behavior | Trace |
| --- | --- | --- | --- | --- | --- | --- | --- |

Use `P-01`, `P-02`, ... with `EC-*` or `BVA-*` coverage ids. State the BVA model used and
include at least one row for every extracted parameter.

`state-model.md` begins with:

```markdown
## Classification
<Explicit state / Implicit state / No meaningful state - lifecycle adaptation>

Justification: <source-grounded reason>
```

For explicit or implicit state:

| Row ID | Coverage ID | Start state | Event / guard | Expected action | Finish state | Valid? | Trace |
| --- | --- | --- | --- | --- | --- | --- | --- |

For lifecycle adaptation:

| Row ID | Scenario | Expected behavior | Trace |
| --- | --- | --- | --- |

Use `S-01`, `S-02`, ... .

`security-cases.md`:

| Row ID | SEC-ID | Asset / invariant | Principal | Vector | Payload / condition | Expected control and observable oracle | Trace |
| --- | --- | --- | --- | --- | --- | --- | --- |

Use `SEC-C-01`, `SEC-C-02`, ... and only applicable SEC ids.

`schema-cases.md`:

| Row ID | Response variant | Schema facet | Atomic assertion | Expected | Trace / overlap |
| --- | --- | --- | --- | --- | --- |

Use `SC-01`, `SC-02`, ... .

## Master suite

`master-test-cases.md`:

| TC ID | Technique | Precondition | Input / action | Expected result | Oracle | Trace |
| --- | --- | --- | --- | --- | --- | --- |

Use one continuous `TC-01`, `TC-02`, ... sequence. Then append:

```markdown
## Coverage Gate

- Total: <n>/<target>
- By technique: EP=<n>, BVA=<n>, State/Lifecycle=<n>, Security=<n>, Schema=<n>
- Parameters without EP/BVA coverage: <none or list>
- Applicable SEC ids without cases: <none or list>
- Valid transitions: <covered TR ids>/<total TR ids>; missing: <none or list>
- Documented response variants: <covered>/<total>; missing: <none or list>
- Shortfall: <none or specific thin group; no duplicate padding>
```

## Data-driven inputs

`data/test-data.csv` must contain one row per master `TC ID`. Include request placeholders
and machine-readable expectations, for example:

```csv
tc_id,email,password,expected_status,expected_error_code
TC-01,user@example.com,Valid123!,200,
TC-02,,Valid123!,400,MISSING_EMAIL
```

`data/request-template.md` contains:

1. method, parameterized URL, headers, and body;
2. any required pre-request variable mapping;
3. generic assertions that read `expected_*` values from the current data row.

The request template is a design artifact, not proof of execution.
