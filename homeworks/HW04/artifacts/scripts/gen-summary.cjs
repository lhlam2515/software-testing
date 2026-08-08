#!/usr/bin/env node
/**
 * Aggregate the 9 Playwright JSON reports (3 features × 3 browsers) into
 * Markdown sections for build-report.cjs.
 *
 * Design (see TEST_PLAN.md §3 / §11 "Report design"): unlike Triangle_SUT's
 * single-browser gen-results.js, HW04 needs a per-feature MATRIX (TC × browser)
 * because a TC can pass on one browser and fail on another — that mismatch is
 * itself evidence for a bug (cross-browser defect), and the matrix format is
 * what makes it visible at a glance instead of diffing 3 separate reports by hand.
 *
 * Join key: cases.json[].id (NOT the Playwright spec title) — stable across
 * wording changes in the test title, per the join-key decision confirmed with
 * the student before this script was written.
 *
 * Usage: node scripts/gen-summary.cjs   (run from artifacts/)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FEATURES = ['FR-02', 'FR-09', 'FR-16'];
const BROWSERS = ['chromium', 'firefox', 'webkit'];
const OUT_DIR = path.join(ROOT, 'reports', 'markdown');

function loadJson(p) {
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
}

/** Playwright JSON reporter: walk suites recursively, one spec = one TC (title = "<id> — <title>"). */
function extractResults(reportJson) {
  const byId = {};
  function walk(suite) {
    (suite.suites || []).forEach(walk);
    (suite.specs || []).forEach((spec) => {
      const id = spec.title.split(' ')[0];
      const test = spec.tests[0];
      const result = test.results[test.results.length - 1];
      byId[id] = {
        ok: spec.ok,
        status: result ? result.status : 'unknown',
        duration: result ? result.duration : null,
      };
    });
  }
  (reportJson.suites || []).forEach(walk);
  return byId;
}

function verdictCell(entry) {
  if (!entry) return '—';
  return entry.ok ? 'PASS' : 'FAIL';
}

function buildFeatureSection(fr, ordinal) {
  const cases = loadJson(path.join(ROOT, 'test-data', fr, 'cases.json'));
  if (!cases) {
    console.warn(`  ! no cases.json for ${fr}, skipping`);
    return { md: `# ${ordinal}. Results — ${fr}\n\n_No cases.json found._\n`, stats: { total: 0, pass: 0, fail: 0, diff: 0 } };
  }

  const perBrowser = {};
  for (const browser of BROWSERS) {
    const reportPath = path.join(ROOT, 'test-results', fr, browser, 'results.json');
    const report = loadJson(reportPath);
    perBrowser[browser] = report ? extractResults(report) : null;
    if (!report) console.warn(`  ! missing ${reportPath} — column will show "—"`);
  }

  const rows = cases.map((tc) => {
    const cells = BROWSERS.map((b) => (perBrowser[b] ? perBrowser[b][tc.id] : null));
    const seen = new Set(cells.filter(Boolean).map((c) => (c.ok ? 'PASS' : 'FAIL')));
    const browserDiff = seen.size > 1;
    return { tc, cells, browserDiff };
  });

  const head = '| TC | Layer | Expected (spec) | Chromium | Firefox | WebKit | Known Defect |\n' +
    '|----|-------|------------------|----------|---------|--------|--------------|';
  const body = rows.map(({ tc, cells, browserDiff }) => {
    const expected = summarizeExpected(tc);
    const marks = cells.map((c) => {
      const v = verdictCell(c);
      return browserDiff && v !== '—' ? `**${v}**` : v;
    });
    const defect = tc.knownDefect ? tc.knownDefect : (browserDiff ? '⚠ browser-diff' : '');
    return `| ${tc.id} | ${tc.layer} | ${expected} | ${marks[0]} | ${marks[1]} | ${marks[2]} | ${defect} |`;
  }).join('\n');

  const total = rows.length;
  const fail = rows.filter((r) => r.cells.some((c) => c && !c.ok)).length;
  const diff = rows.filter((r) => r.browserDiff).length;

  const md = `# ${ordinal}. Results — ${fr}

**${total} test cases** × 3 browsers = ${total * 3} runs planned. **${diff} case(s) show cross-browser divergence** (bold cell + \`⚠ browser-diff\`) — these are automation-only findings HW02's manual pass could not produce.

${head}
${body}
`;
  return { md, stats: { total, fail, diff } };
}

function summarizeExpected(tc) {
  const a = tc.assert || {};
  const parts = [];
  if (a.ui) parts.push(`UI: ${JSON.stringify(a.ui)}`);
  if (a.api) parts.push(`API: ${JSON.stringify(a.api)}`);
  if (a.db) parts.push(`DB: ${JSON.stringify(a.db)}`);
  return parts.join('; ').replace(/\|/g, '\\|') || '—';
}

function buildSummary(sections) {
  const rows = sections.map((s, i) => `| ${FEATURES[i]} | ${s.stats.total} | ${s.stats.fail} | ${s.stats.diff} |`).join('\n');
  const total = sections.reduce((n, s) => n + s.stats.total, 0);
  const fail = sections.reduce((n, s) => n + s.stats.fail, 0);
  const diff = sections.reduce((n, s) => n + s.stats.diff, 0);
  return `# 2. Summary

**${total} test cases** across 3 features, run on Chromium / Firefox / WebKit (up to ${total * 3} runs).
**${fail} case(s)** deviate from spec on at least one browser. **${diff} case(s)** diverge between browsers — see §3–5 for the per-feature matrix.

| Feature | TC | Failed (≥1 browser) | Browser-diff |
| --- | ---: | ---: | ---: |
${rows}
| **Total** | **${total}** | **${fail}** | **${diff}** |
`;
}

function buildBugIndex(casesByFeature) {
  const lines = [];
  FEATURES.forEach((fr) => {
    const cases = casesByFeature[fr] || [];
    const withDefect = cases.filter((tc) => tc.knownDefect);
    if (!withDefect.length) return;
    lines.push(`## ${fr}\n`);
    lines.push('| TC | Known Defect | Title |');
    lines.push('|----|--------------|-------|');
    withDefect.forEach((tc) => lines.push(`| ${tc.id} | ${tc.knownDefect} | ${tc.title} |`));
    lines.push('');
  });
  return `# 6. Bug Cross-Reference

Auto-generated from \`knownDefect\` fields in \`test-data/<FR>/cases.json\`. Full narrative,
severity, and GitHub Issue links live in \`../../bugs/BUG_REPORT.md\` — this section is a
quick index, not a replacement.

${lines.join('\n')}
`;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const casesByFeature = {};
const sections = FEATURES.map((fr, i) => {
  casesByFeature[fr] = loadJson(path.join(ROOT, 'test-data', fr, 'cases.json')) || [];
  return buildFeatureSection(fr, 3 + i);
});

fs.writeFileSync(path.join(OUT_DIR, '02_summary.md'), buildSummary(sections), 'utf8');
FEATURES.forEach((fr, i) => {
  const fname = `0${3 + i}_results-${fr}.md`;
  fs.writeFileSync(path.join(OUT_DIR, fname), sections[i].md, 'utf8');
  console.log(`wrote ${fname} — ${sections[i].stats.total} cases, ${sections[i].stats.fail} failed, ${sections[i].stats.diff} browser-diff`);
});
fs.writeFileSync(path.join(OUT_DIR, '06_bugs.md'), buildBugIndex(casesByFeature), 'utf8');
console.log('wrote 02_summary.md, 06_bugs.md');
