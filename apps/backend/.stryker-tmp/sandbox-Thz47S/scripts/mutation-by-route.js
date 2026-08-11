#!/usr/bin/env node
// @ts-nocheck
/**
 * Recomputes per-route mutation score for server.js from
 * reports/mutation/mutation_baseline.html, using the same auto-detected
 * route boundaries as scripts/coverage-by-route.js (paren/brace balance
 * from the app.<method>(...) line) instead of hand-picked line ranges.
 * Run: node scripts/mutation-by-route.js
 */
const fs = require("fs");
const path = require("path");

const SERVER_JS = path.join(__dirname, "..", "server.js");
const REPORT_HTML = path.join(__dirname, "..", "reports", "mutation", "mutation_baseline.html");

const ROUTE_TO_FR = [
  { method: "post", routePath: "/api/login", fr: "FR-02", label: "POST /api/login" },
  { method: "post", routePath: "/api/apply-coupon", fr: "FR-09", label: "POST /api/apply-coupon" },
  { method: "post", routePath: "/api/cart", fr: "FR-08", label: "POST /api/cart" },
  { method: "post", routePath: "/api/checkout", fr: "FR-08", label: "POST /api/checkout" },
  { method: "put", routePath: "/api/admin/orders/:id/status", fr: "FR-10", label: "PUT /api/admin/orders/:id/status" },
];

function findRouteRanges(source) {
  const lines = source.split("\n");
  const startRe = /^app\.(get|post|put|delete|patch)\(\s*["'`]([^"'`]+)["'`]/;
  const ranges = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(startRe);
    if (!m) continue;
    const method = m[1];
    const routePath = m[2];
    const startLine = i + 1;
    let balance = 0;
    let endLine = startLine;
    for (let j = i; j < lines.length; j++) {
      for (const ch of lines[j]) {
        if (ch === "(" || ch === "{") balance++;
        else if (ch === ")" || ch === "}") balance--;
      }
      if (balance === 0) {
        endLine = j + 1;
        break;
      }
    }
    ranges.push({ method, routePath, startLine, endLine });
  }
  return ranges;
}

function loadMutants() {
  const html = fs.readFileSync(REPORT_HTML, "utf8");
  const marker = "app.report = ";
  const start = html.indexOf(marker) + marker.length;
  let depth = 0;
  let end = -1;
  for (let i = start; i < html.length; i++) {
    const ch = html[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  // The embedded blob is a JS object literal (uses string concatenation via
  // "+" in some replacement fields), not strict JSON, so it must be
  // evaluated as JS rather than JSON.parse'd. Source is our own generated
  // report (trusted, local file).
  const objLiteral = html.slice(start, end);
  const data = (0, eval)("(" + objLiteral + ")");
  return data.files["server.js"].mutants;
}

function inRange(mutant, startLine, endLine) {
  return mutant.location.start.line >= startLine && mutant.location.start.line <= endLine;
}

function summarize(mutants) {
  const total = mutants.length;
  const killed = mutants.filter((m) => m.status === "Killed").length;
  const survived = mutants.filter((m) => m.status === "Survived").length;
  const timeout = mutants.filter((m) => m.status === "Timeout").length;
  const noCov = mutants.filter((m) => m.status === "NoCoverage").length;
  const covered = total - noCov;
  const scoreTotal = total === 0 ? "n/a" : ((killed / total) * 100).toFixed(2) + "%";
  const denom = killed + survived + timeout;
  const scoreCovered = denom === 0 ? "n/a" : ((killed / denom) * 100).toFixed(2) + "%";
  return { total, killed, survived, timeout, noCov, covered, scoreTotal, scoreCovered };
}

function main() {
  const source = fs.readFileSync(SERVER_JS, "utf8");
  const allRoutes = findRouteRanges(source);
  const mutants = loadMutants();

  const frRanges = {};
  for (const owned of ROUTE_TO_FR) {
    const found = allRoutes.find((r) => r.method === owned.method && r.routePath === owned.routePath);
    if (!found) {
      console.error(`WARNING: route not found: ${owned.method.toUpperCase()} ${owned.routePath}`);
      continue;
    }
    if (!frRanges[owned.fr]) frRanges[owned.fr] = { ranges: [], labels: [] };
    frRanges[owned.fr].ranges.push(found);
    frRanges[owned.fr].labels.push(`${owned.label} (L${found.startLine}-L${found.endLine})`);
  }

  console.log("## Auto-detected route boundaries\n");
  for (const [fr, g] of Object.entries(frRanges)) {
    console.log(`${fr}: ${g.labels.join(", ")}`);
  }

  console.log("\n## Per-route mutation score (mutation_baseline.html, 541 mutants total)\n");
  console.log("| Route | Total | Killed | Survived | NoCov | Covered | Score (K/total) | Score (K/K+S+T) |");
  console.log("|---|---|---|---|---|---|---|---|");

  let scopedMutants = [];
  for (const [fr, g] of Object.entries(frRanges)) {
    const inScope = mutants.filter((m) => g.ranges.some((r) => inRange(m, r.startLine, r.endLine)));
    scopedMutants = scopedMutants.concat(inScope);
    const s = summarize(inScope);
    console.log(
      `| ${fr} | ${s.total} | ${s.killed} | ${s.survived} | ${s.noCov} | ${s.covered} | ${s.scoreTotal} | ${s.scoreCovered} |`,
    );
  }
  const totalScoped = summarize(scopedMutants);
  console.log(
    `| **Tổng 4 routes** | ${totalScoped.total} | ${totalScoped.killed} | ${totalScoped.survived} | ${totalScoped.noCov} | ${totalScoped.covered} | ${totalScoped.scoreTotal} | ${totalScoped.scoreCovered} |`,
  );
  const fullFile = summarize(mutants);
  console.log(
    `| **Full server.js** | ${fullFile.total} | ${fullFile.killed} | ${fullFile.survived} | ${fullFile.noCov} | ${fullFile.covered} | ${fullFile.scoreTotal} | ${fullFile.scoreCovered} |`,
  );

  console.log(`\n## Ngoài 4 routes (denominator check)\n`);
  const scopedIds = new Set(scopedMutants.map((m) => m.id));
  const outside = mutants.filter((m) => !scopedIds.has(m.id));
  console.log(`Trong 4 routes: ${scopedMutants.length} | Ngoài 4 routes: ${outside.length} | Tổng: ${mutants.length}`);

  console.log("\n## Survivor mutators trong 4 routes được test\n");
  const survivorsScoped = scopedMutants.filter((m) => m.status === "Survived");
  const byMutator = {};
  for (const m of survivorsScoped) byMutator[m.mutatorName] = (byMutator[m.mutatorName] || 0) + 1;
  console.log(`Total survivors: ${survivorsScoped.length}`);
  console.log("| Mutator | Count |");
  console.log("|---|---|");
  for (const [mutator, count] of Object.entries(byMutator).sort((a, b) => b[1] - a[1])) {
    console.log(`| ${mutator} | ${count} |`);
  }

  console.log("\n## Survivor IDs per route (for cross-check with section 4)\n");
  for (const [fr, g] of Object.entries(frRanges)) {
    const inScope = mutants.filter((m) => g.ranges.some((r) => inRange(m, r.startLine, r.endLine)));
    const survivedIds = inScope.filter((m) => m.status === "Survived").map((m) => m.id);
    console.log(`${fr}: [${survivedIds.join(", ")}]`);
  }
}

main();
