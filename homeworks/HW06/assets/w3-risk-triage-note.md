# W3 Risk Triage Note (internal trace, not a graded deliverable)

> Not part of the graded submission. REQUIREMENTS.md has no "Risk Triage" section, so this content
> does not appear in REPORT.md or in artifacts/postman|cicd/README.md. Kept here only as an internal
> trace of the environment check performed during the W3 time block (2026-08-19, 20:30-21:10).

Verified against the local SUT checkout (`apps/backend`, `node server.js`, `http://localhost:3000`) before generation begins.

| Risk item | Status | Note |
| --- | --- | --- |
| SUT startup | OK | `node apps/backend/server.js` boots; `database.sqlite` (36 KB) already seeded; `GET /api/products` returns 200. |
| Test accounts | OK | `admin@eshop.com` / `Admin123!` (role `admin`) and `test@eshop.com` / `Test1234!` (role `user`) both log in successfully via `POST /api/login`. |
| Newman | OK | Not installed globally; `npx newman --version` resolves `6.2.2` without a global install. CI and local runs will use `npx newman`. |
| `X-Student-Id` header mechanism | OK | Arbitrary custom headers (e.g. `X-Student-Id: 23127216`) pass through to `GET /api/products` unmodified and unrejected; a Postman pre-request script can safely inject it. |
| Hostname | OK | `localhost:3000` is the accepted hostname per REQUIREMENTS.md section 11 Anti-AI-Cheat constraints. |
| Repository permissions | OK | `gh repo view` reports `viewerPermission: ADMIN` on `lhlam2515/software-testing` — sufficient to add workflows, secrets, and Issues. |
| CI/CD secrets | OK, none required (so far) | No `.github/workflows/` exists yet (expected, built in F7/S7). `gh secret list` returns empty — the SUT will be started inside the workflow from repo code, so no external secret is anticipated. Reconfirm during F7 once the workflow is drafted. |
| Postman account limits (monitors, mock servers) | OK (verified 2026-08-19 22:xx via Postman MCP) | Team Trial account (`teamId` 11817115), dedicated workspace `[CSC13003 - Software Testing] HW06 - API Testing` (`ea7efd84-42ba-4f2d-a459-29ab3193af1f`). `getAuthenticatedUser` reports `mock_usage` limit 99,999,999 (usage 0), `monitor_request_runs` limit 10,000 (usage 0), `collection_run_limit` 99,999,999 (usage 0). No blocking limit for either feature at current usage. `ai_millicredits` limit 400 — only relevant if Postman's own AI features are used, which is out of scope here. |

**Preliminary observation (not yet a filed bug — to be formally reproduced and audited at S4):** the `POST /api/login` response body for both test accounts includes the user's `password` field in plaintext inside the `user` object, alongside the JWT `token`. This is a candidate SEC-01 violation (`SRS.md` SEC-01: passwords must not be stored/exposed as plaintext) that surfaced incidentally during this environment check. It must be re-verified deliberately as part of the FR-02 pipeline (generate/audit a schema-validation and SEC-01 case for it) before being logged in `BUG_REPORT.md`.

Cross-reference: `REPORT.md` section 3.5 already carries a placeholder note for this same SEC-01 observation, consistent with this trace.
