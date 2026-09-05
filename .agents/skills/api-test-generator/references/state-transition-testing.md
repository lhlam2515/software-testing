# State transition and resource-lifecycle testing

Sources: `docs/istqb/ch4_design.md` section 4.2 and
`docs/slides/S06_state_usecase_testing.md`.

## Decide whether a state model exists

A state model is valid only when the same event can produce different behavior depending
on current state. Classify it as explicit state, implicit counter/time state, or no
meaningful state. Cite the rule that supports the classification.

For explicit or implicit state, define:

- states, including initial and terminal states;
- events and guards;
- expected action or observable response;
- resulting state, including self-transitions.

Build a state table whose cells represent `(current state, event/guard) -> (action, next
state)`. Assign `TR-*` ids to valid transitions. Empty, prohibited, or unspecified cells
are invalid-transition candidates; never invent a valid next state for them.

## Derive cases and measure coverage

- Target **all-transitions coverage**, equivalent to 0-switch coverage: every documented
  valid transition appears in at least one case.
- Use all-states coverage only as a supporting metric; it does not prove all transitions.
- Use 1-switch or higher N-switch coverage only when consecutive transitions create a
  documented or plausible risk worth testing. State the chosen N and enumerate the
  required valid sequences before deriving cases.
- Add representative invalid transitions from meaningful empty/prohibited cells. Include
  terminal-state re-entry and guard violations when applicable.

Each case must identify start state, setup/precondition, event and guard data, expected
action or response, expected finish state, and covered `TR-*` or invalid-cell id.

Report `covered valid TR ids / total valid TR ids` and list missing ids. Count transition
sequences, not merely distinct states. If the endpoint has no meaningful state, create
resource-lifecycle cases but label state-transition coverage as not applicable.
