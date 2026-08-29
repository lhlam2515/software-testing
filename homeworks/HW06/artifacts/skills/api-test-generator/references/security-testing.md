# Security testing

Sources: `docs/slides/S11_security_performance.md` and the applicable SEC requirements in
`docs/eshop-sut/srs.md`. The SRS is the behavioral oracle.

Start from the endpoint's attack surface and applicable SEC ids. For each applicable
requirement, identify:

- protected asset or invariant;
- actor or principal and required privilege;
- entry point and trust boundary;
- concrete attack condition or payload;
- preventive control expected by the requirement;
- observable response and side-effect invariant.

Derive distinct cases when failure modes exercise different controls. Examples include
missing, malformed, expired, and insufficient-privilege credentials; these are not one
generic "invalid token" case. Use non-destructive injection strings unless destructive
behavior is explicitly required downstream. For authorization and IDOR, use two distinct
resource owners and assert both response rejection and unchanged protected state.

Cover relevant slide categories:

- **Authentication:** password rules, recovery flow, enumeration-resistant errors, and
  fail-closed behavior when authentication fails.
- **Authorization and trust:** role or ownership checks, protected-field assignment,
  admin-function access, and multi-step workflow bypass.
- **Input validation:** concrete injection or malformed payloads on every reachable input
  class for which the SEC requirement applies.
- **Confidentiality and integrity:** sensitive fields absent from responses and logs;
  rejected requests do not modify protected data.

Do not generate a generic vulnerability catalog. Every case must trace to an applicable
SEC id and endpoint surface. When a concern is not observable through this API, record it
as not applicable at this layer instead of inventing an oracle.
