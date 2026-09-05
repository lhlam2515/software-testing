# Equivalence partitioning and boundary value analysis

Sources: `docs/istqb/ch4_design.md` section 4.2 and
`docs/slides/S04_domain_testing.md`.

Use the endpoint specification as the behavioral oracle. Use ISTQB and the slides to
derive coverage. Do not present a course-slide extension as an ISTQB requirement.

## Build equivalence partitions

For every input and relevant output variable:

1. Record its type, location, requiredness, documented constraints, and dependency on
   other variables.
2. Partition the entire documented domain. Two values belong to the same class only when
   the specification predicts the same handling and outcome.
3. Check that classes do not overlap. If one class contains values handled differently,
   split it.
4. Assign a stable `EC-*` id and choose one concrete representative for each class.

Apply the rule matching the condition:

- **Range:** one valid class for the range and separate invalid classes below and above it;
  add wrong-type or malformed classes when the contract distinguishes them.
- **Set or enum:** one valid class per value when values trigger different handling;
  otherwise one valid set class. Add a value outside the set as an invalid class.
- **Must-be or required:** one class satisfying the condition and one violating it. Keep
  missing, null, empty, and blank separate only when the contract can distinguish them.
- **Dependent conditions:** use a decision table or explicit combination rows when the
  expected result depends on a combination. Do not hide interaction rules inside a single
  parameter's class.

For test selection, combine compatible valid classes when one case can cover them without
obscuring the oracle. Isolate one invalid class per case while keeping other inputs valid,
unless the specification defines a multi-invalid combination as distinct behavior. The
catalog itself still contains one row per coverage obligation.

## Select boundary values

Apply BVA only to an ordered partition with a documented boundary. Identify each lower and
upper boundary before selecting points.

- **2-value BVA:** boundary and nearest value across the boundary.
- **3-value BVA:** boundary plus the nearest value on each side. Default to this when the
  assignment does not choose a model and the neighboring values are representable.
- **Course 9-point model:** midpoint, `LB-1`, `LB`, `LB+1`, `UB-1`, `UB`, `UB+1`, and the
  smallest/largest representable extremes. Use only when the assignment expects the S04
  slide model or when the extreme-value risks are relevant. Mark the two extreme points as
  course extensions, not ISTQB Foundation requirements.

Use the domain's real smallest step: 1 for integer/count, the documented precision for
decimal values, one character for length, and the smallest observable time unit for TTL.
Do not invent a maximum length or precision. Do not apply numeric BVA to unordered enums or
format-only strings.

Record `BVA-*` ids, the model, boundary, point position, concrete value, expected class,
and source. Deduplicate a point only if the artifact retains every coverage id it satisfies.
