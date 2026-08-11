#!/usr/bin/env node
// @ts-nocheck
/**
 * Recomputes per-route Line %/Branch % for server.js from coverage/lcov.info,
 * with route boundaries derived automatically (paren/brace balance) instead
 * of hand-picked line ranges. Run: node scripts/coverage-by-route.js
 */
const fs = require("fs");
const path = require("path");

const SERVER_JS = path.join(__dirname, "..", "server.js");
const LCOV_INFO = path.join(__dirname, "..", "coverage", "lcov.info");

// FR ownership map: which Express routes belong to which FR group.
// method+path must match the app.<method>("<path>", ...) call exactly.
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
    const startLine = i + 1; // 1-indexed

    // Walk forward from the route-start line, balancing "(" / ")" and
    // "{" / "}" across the whole statement. The statement ends on the
    // first line where the running balance returns to 0.
    let balance = 0;
    let endLine = startLine;
    for (let j = i; j < lines.length; j++) {
      for (const ch of lines[j]) {
        if (ch === "(" || ch === "{") balance++;
        else if (ch === ")" || ch === "}") balance--;
      }
      if (balance === 0) {
        endLine = j + 1; // 1-indexed
        break;
      }
    }
    ranges.push({ method, routePath, startLine, endLine });
  }
  return ranges;
}

function parseLcovForFile(lcovText, sourceFileName) {
  const records = lcovText.split("end_of_record");
  for (const rec of records) {
    if (!rec.includes(`SF:${sourceFileName}`)) continue;
    const da = [];
    const brda = [];
    for (const line of rec.split("\n")) {
      if (line.startsWith("DA:")) {
        const [, rest] = line.split("DA:");
        const [ln, hits] = rest.split(",");
        da.push({ line: Number(ln), hits: Number(hits) });
      } else if (line.startsWith("BRDA:")) {
        const [, rest] = line.split("BRDA:");
        const [ln, block, branch, hits] = rest.split(",");
        brda.push({
          line: Number(ln),
          block: Number(block),
          branch: Number(branch),
          hits: hits === "-" ? 0 : Number(hits),
        });
      }
    }
    return { da, brda };
  }
  return null;
}

function pct(covered, total) {
  return total === 0 ? "n/a" : `${((covered / total) * 100).toFixed(0)}%`;
}

function computeForRange(da, brda, startLine, endLine) {
  const daInRange = da.filter((d) => d.line >= startLine && d.line <= endLine);
  const brdaInRange = brda.filter((b) => b.line >= startLine && b.line <= endLine);
  const lineCovered = daInRange.filter((d) => d.hits > 0).length;
  const branchCovered = brdaInRange.filter((b) => b.hits > 0).length;
  return {
    lineTotal: daInRange.length,
    lineCovered,
    branchTotal: brdaInRange.length,
    branchCovered,
  };
}

function main() {
  const source = fs.readFileSync(SERVER_JS, "utf8");
  const lcovText = fs.readFileSync(LCOV_INFO, "utf8");
  const allRoutes = findRouteRanges(source);
  const { da, brda } = parseLcovForFile(lcovText, "server.js");

  // Resolve each FR's owned routes to their auto-detected [start,end] ranges.
  const frGroups = {};
  for (const owned of ROUTE_TO_FR) {
    const found = allRoutes.find(
      (r) => r.method === owned.method && r.routePath === owned.routePath,
    );
    if (!found) {
      console.error(`WARNING: route not found in server.js: ${owned.method.toUpperCase()} ${owned.routePath}`);
      continue;
    }
    if (!frGroups[owned.fr]) frGroups[owned.fr] = { routes: [], label: [] };
    frGroups[owned.fr].routes.push(found);
    frGroups[owned.fr].label.push(owned.label);
  }

  console.log("## Auto-detected route boundaries (paren/brace balance)\n");
  console.log("| Route | Start | End |");
  console.log("|---|---|---|");
  for (const owned of ROUTE_TO_FR) {
    const found = allRoutes.find(
      (r) => r.method === owned.method && r.routePath === owned.routePath,
    );
    if (found) console.log(`| ${owned.label} | L${found.startLine} | L${found.endLine} |`);
  }

  console.log("\n## Per-FR coverage (recomputed from coverage/lcov.info)\n");
  console.log("| FR | Routes | Line range(s) | Line % | Branch % |");
  console.log("|---|---|---|---|---|");

  let overallLineTotal = 0,
    overallLineCovered = 0,
    overallBranchTotal = 0,
    overallBranchCovered = 0;

  for (const [fr, group] of Object.entries(frGroups)) {
    let lineTotal = 0,
      lineCovered = 0,
      branchTotal = 0,
      branchCovered = 0;
    const ranges = [];
    for (const r of group.routes) {
      const c = computeForRange(da, brda, r.startLine, r.endLine);
      lineTotal += c.lineTotal;
      lineCovered += c.lineCovered;
      branchTotal += c.branchTotal;
      branchCovered += c.branchCovered;
      ranges.push(`L${r.startLine}-L${r.endLine}`);
    }
    overallLineTotal += lineTotal;
    overallLineCovered += lineCovered;
    overallBranchTotal += branchTotal;
    overallBranchCovered += branchCovered;
    console.log(
      `| ${fr} | ${group.label.join(" + ")} | ${ranges.join(", ")} | **${pct(lineCovered, lineTotal)}** (${lineCovered}/${lineTotal}) | **${pct(branchCovered, branchTotal)}** (${branchCovered}/${branchTotal}) |`,
    );
  }

  console.log(
    `| **Tổng 4 FR** | | | **${pct(overallLineCovered, overallLineTotal)}** (${overallLineCovered}/${overallLineTotal}) | **${pct(overallBranchCovered, overallBranchTotal)}** (${overallBranchCovered}/${overallBranchTotal}) |`,
  );

  const fileLineTotal = da.length;
  const fileLineCovered = da.filter((d) => d.hits > 0).length;
  const fileBranchTotal = brda.length;
  const fileBranchCovered = brda.filter((b) => b.hits > 0).length;
  console.log(
    `| **server.js overall** | (whole file) | L1-L${source.split("\n").length} | **${pct(fileLineCovered, fileLineTotal)}** (${fileLineCovered}/${fileLineTotal}) | **${pct(fileBranchCovered, fileBranchTotal)}** (${fileBranchCovered}/${fileBranchTotal}) |`,
  );
}

main();
