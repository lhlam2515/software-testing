# 7. Notes & How to Reproduce

## 7.1 Reading the matrix (§3–5)

- **PASS / FAIL** — verdict of that TC on that browser, from the Playwright JSON reporter (`spec.ok`).
- **Bold cell** — this row's cells disagree across browsers (`⚠ browser-diff` in the last column). Investigate before assuming it is "just" the known defect in the `Known Defect` column — a browser-diff can stack on top of a spec bug.
- **`—`** — that browser's `results.json` was not found (run not executed yet, or run failed to produce a report).
- **Known Defect** — copied from `knownDefect` in `test-data/<FR>/cases.json`. `null`/empty means the case is expected to PASS; anything else names the bug this case's FAIL is expected evidence for.

## 7.2 Verdict notes

- Expected values in `test-data/<FR>/cases.json` are written against **spec**, not against the SUT's observed behaviour (see §1). A FAIL against a `knownDefect` case is the intended, correct outcome — it is evidence, not suite breakage.
- `retries: 0` in `playwright.config.ts` — no automatic retry, so a FAIL is never masked by a lucky rerun.

## 7.3 How to regenerate this report

```bash
cd homeworks/HW04/artifacts
npm install
npx playwright install chromium firefox webkit

# terminal khác:
bash ../../../apps/run-servers.sh          # :3000 / :5173 / :5174

# 1 run = 1 feature x 1 browser, JSON + HTML both written:
STUDENT_ID=23127216 \
HTML_OUT=html-reports/FR-02/chromium \
JSON_OUT=test-results/FR-02/chromium/results.json \
npx playwright test tests/FR-02 --project=chromium
# repeat for FR-09, FR-16 x chromium, firefox, webkit (9 runs total)

npm run report:summary   # reads all test-results/*/*/results.json -> reports/markdown/02,03,04,05,06_*.md
npm run report:pdf       # concatenates reports/markdown/*.md -> pdf/HW04_Test_Report.pdf
```

**Artifacts produced**

| Path | Contents |
| --- | --- |
| `test-data/<FR>/cases.json` | Data-driven test cases (source of truth for expected + knownDefect) |
| `tests/<FR>/*.spec.ts` | Data-driven Playwright specs, one loop per feature |
| `html-reports/<FR>/<browser>/` | Interactive Playwright HTML report (9 folders) |
| `test-results/<FR>/<browser>/results.json` | Machine-readable results (9 files) |
| `reports/markdown/` | This report's Markdown source (auto + hand-written sections) |
| `pdf/HW04_Test_Report.pdf` | Rendered, self-contained PDF — the single-file view |
