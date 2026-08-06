# Assertion patterns

Three patterns cover almost every case in the schema. A fourth is worth
reaching for when a feature specifically benefits from it, but isn't
required.

## Pattern #1 — Web-first UI assertion

`expect(locator).toHaveText(...)`, `.toBeVisible()`, `.toHaveURL(...)`,
`.toHaveAttribute(...)`. These auto-retry until they pass or time out — never
wrap them in a manual `waitForTimeout` before asserting, and never read a
value once with `.textContent()` and compare it with a plain `if`. The
auto-retry is the entire point: it's what lets a UI assertion tolerate
normal render latency without becoming a fixed sleep in disguise.

This is the only pattern used in the Phase 4 skeleton. Patterns #2 and #3
get layered in during Phase 5.

## Pattern #2 — Network / API response assertion

Two ways to get this, pick based on what the case needs:

- **Intercept the request the UI action triggers**: `page.waitForResponse()`
  around the action, then assert on the captured response's status and body.
  Use this when the case is exercising the UI flow and the network call is
  incidental evidence of correctness (e.g. confirming the login form really
  did hit `/api/login` and got a 401, not just that an error message
  appeared — those aren't the same claim).
- **Call the endpoint directly via a request fixture**: for cases whose
  `layer` is `"api"` rather than `"ui"`/`"hybrid"` — there's no UI path to
  the behavior being tested, or the UI path is blocked by client-side
  validation that the case is deliberately bypassing.

Either way, assert both status and enough of the body to distinguish "the
right kind of failure" from "a failure" — a bare `expect(status).toBe(401)`
can't tell a wrong-password rejection apart from a locked-out rejection if
both return 401.

## Pattern #3 — Database / persisted-state assertion

Read the state directly from wherever the SUT persists it (a DB file, a
cache, a session store) via the fixture built in Phase 3. This is the
pattern that catches defects neither the UI nor the network response would
reveal on their own — e.g. a counter that increments by 2 instead of 1 when
the UI shows the same generic error either way, or a lockout timestamp that
doesn't actually reset on a successful login even though the login itself
"worked."

### The race condition this pattern almost always runs into

A server can respond to the client before its own write to persisted state
actually completes — a `db.run(UPDATE ...)` fired without being awaited
before the HTTP response is sent is a common shape of this bug (and it's a
server-side bug worth flagging on its own, independent of the test). From
the test's side, this shows up as a DB assertion that reads *stale* state
immediately after the response resolves — not because the assertion targets
the wrong field, but because it ran a beat too early.

**Fix: poll, don't read once.** Use an auto-retrying assertion
(`expect.poll(() => readState(...)).toBe(...)`, or the equivalent in
whatever DB client the fixture wraps) instead of a single read. This is the
same auto-retry idea Pattern #1 gets for free from Playwright's locator
assertions — Pattern #3 has to opt into it explicitly because a raw DB read
doesn't retry on its own.

**Do not fix this with a fixed sleep before the read.** A sleep long enough
to be reliable is also long enough to slow the suite down noticeably once
there are a dozen cases doing it, and it's still theoretically flaky under
load — polling with a reasonable timeout is strictly better on both axes.

### Concurrency mode, if the DB is file-based

If the fixture and the running server share the same DB file (e.g. SQLite),
a bare default connection from the fixture can produce "database is locked"
errors when it tries to read while the server is mid-write. Enable a
concurrency-friendly journal mode (WAL, for SQLite) and a busy-timeout on the
fixture's own connection — this is a one-time fixture setup cost, not
something to work around per-test.

## Pattern #4 (optional) — Structural / accessibility snapshot

`expect(locator).toMatchAriaSnapshot()` or equivalent. Useful for one or two
cases per feature to demonstrate structural correctness beyond what patterns
1 to 3 cover (e.g. confirming a table's row/column structure after an
import), but not a substitute for patterns 1 to 3 — reach for it as a bonus
on top, not instead of.
