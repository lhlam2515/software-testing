# BVA Skill

## Goal
Provide a reusable process for designing Boundary Value Analysis cases for features with numeric values, text length, lists, states, or business thresholds.

## Process
1. Read the requirement and identify variables with boundaries:
   - Numeric: quantity, price, total amount, coupon usage count.
   - Text length: name, phone number, address.
   - List size: number of cart items, number of displayed orders.
   - State boundary: before/on/after a state in a state machine.
2. Record the boundary rule for each variable.
3. Choose below-boundary, on-boundary, and above-boundary values.
4. Always consider common boundary groups:
   - Empty/null.
   - Min-1, min, min+1.
   - Max-1, max, max+1.
   - Overflow or very long strings.
   - Final states or forbidden transitions.
5. Create the `Boundary Variables` table.
6. Create BVA test cases with clear TC IDs, for example `FR08-BVA-01`.
7. Review against the specification to ensure boundaries are correct and not assumption-based.
8. If execution has not been performed, set `Actual Result` and `Verdict` to `Not Executed`.

## Checklist
- Each feature has at least 6 BVA cases.
- Each case clearly states below/on/above boundary or state boundary.
- Security-related boundaries are included when values affect permissions, tokens, or sensitive payloads.
- Do not claim pass/fail without execution evidence.

