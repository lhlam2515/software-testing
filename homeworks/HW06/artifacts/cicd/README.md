# CI/CD Artifacts

This directory will contain a copy of the pipeline configuration, or a link to it, plus screenshots of the two sample runs required by REQUIREMENTS.md section 6: one all-passing run and one run with a single failing test. These files will support the CI/CD report required by section 14.

TODO: add pipeline config/link and the two sample-run screenshots after the workflow is drafted and run. Suggested approach: run the SUT (`node apps/backend/server.js`) and `npx newman run <collection> -e <environment>` in the same job — no external secret should be needed.

## T3 spike readiness (confirmed 20/08)

- **Workflow/Actions permissions**: confirmed via `gh api repos/lhlam2515/software-testing/actions/permissions` → `enabled: true`, `allowed_actions: all`. `gh auth status` token scope includes `workflow`; repo viewer permission is `ADMIN`. No blocker.
- **Secrets**: none required. The SUT runs on local SQLite with seeded test/dev accounts (`test@eshop.com` / `admin@eshop.com`), already committed in `assets/t2-spike-environment.json` — not production credentials.
- **SUT startup mechanism**: confirmed both locally (T1/T2) and in a real Actions run — `node server.js` + `wait-on http://127.0.0.1:3000/api/products`; gotcha `localhost` → intermittent DNS failure, must use `127.0.0.1`.
- **Link/screenshot capability**: **confirmed with a real run.** Pushed `assets/t3-spike-workflow-pushable.yml` to a throwaway branch (`spike/hw06-ci-t3`, deleted after the spike) and triggered it via a real `push` event (workflow_dispatch is not dispatchable until a workflow file exists on the default branch — a GitHub platform constraint, not something specific to this repo).
  - Real run: **https://github.com/lhlam2515/software-testing/actions/runs/32319719528** — status `Success`, 26s, 1 artifact (`hw06-ci-spike-newman-32319719528`, Newman JSON report, 6.91 KB).
  - Newman result against the T2 spike collection (7 requests): **7/7 executed, 0 failed** (requests, test-scripts, and assertions all 7/7).
  - Screenshot and downloaded JSON artifact saved as real evidence: `assets/t3-ci-spike-run-screenshot.png`, `assets/t3-ci-spike-newman-report.json`.
- This spike workflow is **not** the final CI/CD skeleton (that official `.github/workflows/` commit is task F7) and its run is **not** one of the two official sample runs required by section 6 (those are task S7, against the full 35+ test-case collection per API, executed by the student).

### Real gotchas found during the spike (carry into F7)

1. **`npm ci` false-positive `EUSAGE`**: `apps/backend/package-lock.json` (committed since the initial `init` commit) makes the Actions runner's `npm ci` fail with `Missing: picomatch@4.0.5 from lock file` (a real but unresolved `tinyglobby` → `picomatch` dependency entry). Reproducible on the runner across Node 20 (forced to 24), Node 22, and after `npm install -g npm@latest` in-job. **Not reproducible locally** — `npm ci` and `npm install` both succeed locally (npm 11.6.2) against the identical, unmodified lock file, even from a clean `node_modules`. Root cause not fully isolated. Workaround used: `npm install` instead of `npm ci` in the workflow. F7 should either keep this workaround or investigate further (try `npm ci --) --legacy-peer-deps`, or regenerate the lock file with a matching npm major version).
2. **Missing `newman-reporter-html`**: the `html` reporter is not bundled with `newman` — `npx --yes newman run ... --reporters cli,json,html` silently drops the HTML report ("could not find 'html' reporter") and only produces JSON. F6/F7 need `npm install newman-reporter-html` (or `npx --package newman-reporter-html`) if an HTML report artifact is wanted for the two official S7 runs.
