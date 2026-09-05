#!/usr/bin/env node
// Build the CI iteration-data file for one FR package.
//
// The full audited suites contain test cases that fail against the current SUT
// because of real, filed bugs (see BUG_REPORT.md). Those cases stay in the
// suite as evidence; the CI gate runs the remaining regression subset, so a
// green pipeline means "no new regression", not "no known bugs".
//
// Two removal reasons are recorded:
//   bug        — the case fails because of a filed SUT bug (ci-quarantine.json)
//   dependency — the case survives the bug filter but references a removed
//                case in precondition_note / tc_ref, so it can no longer run
//
// Usage: node build-ci-data.mjs --fr fr-02-login [--check]

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const HW06 = resolve(HERE, "..", "..");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { quoted = false; }
      } else { field += ch; }
      continue;
    }
    if (ch === '"') { quoted = true; }
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (ch === "\r") { /* skip */ }
    else { field += ch; }
  }
  if (field !== "" || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

function serializeCsv(rows) {
  const cell = (v) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return rows.map((r) => r.map(cell).join(",")).join("\n") + "\n";
}

const args = process.argv.slice(2);
const fr = args[args.indexOf("--fr") + 1];
const checkOnly = args.includes("--check");
if (!fr || fr.startsWith("--")) {
  console.error("usage: node build-ci-data.mjs --fr <fr-dir> [--check]");
  process.exit(2);
}

const manifest = JSON.parse(readFileSync(resolve(HERE, "ci-quarantine.json"), "utf8"));
const entry = manifest.suites[fr];
if (!entry) {
  console.error(`no quarantine entry for ${fr} in ci-quarantine.json`);
  process.exit(2);
}

const srcPath = resolve(HW06, "artifacts", "postman", fr, "test-data.csv");
const outPath = resolve(HW06, "artifacts", "postman", fr, "ci-data.csv");

const rows = parseCsv(readFileSync(srcPath, "utf8")).filter((r) => r.some((c) => c !== ""));
const header = rows[0];
const body = rows.slice(1);

const idIdx = header.indexOf("tc_id");
const refIdxs = ["precondition_note", "tc_ref"]
  .map((c) => header.indexOf(c))
  .filter((i) => i >= 0);

const quarantined = new Set(entry.cases.map((c) => c.tc_id));
const removed = new Map();
for (const c of entry.cases) removed.set(c.tc_id, "bug");

// Transitively drop rows that reference an already-removed case.
let changed = true;
while (changed) {
  changed = false;
  for (const r of body) {
    const id = r[idIdx];
    if (removed.has(id)) continue;
    const refs = refIdxs.map((i) => r[i] || "").join(" ");
    for (const gone of removed.keys()) {
      if (new RegExp(`\\b${gone.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(refs)) {
        removed.set(id, "dependency");
        changed = true;
        break;
      }
    }
  }
}

const kept = body.filter((r) => !removed.has(r[idIdx]));
const missing = [...quarantined].filter((id) => !body.some((r) => r[idIdx] === id));

console.log(`[${fr}] source rows: ${body.length}`);
console.log(`[${fr}] removed (bug):        ${[...removed].filter(([, w]) => w === "bug").map(([i]) => i).join(", ") || "-"}`);
console.log(`[${fr}] removed (dependency): ${[...removed].filter(([, w]) => w === "dependency").map(([i]) => i).join(", ") || "-"}`);
console.log(`[${fr}] CI rows kept: ${kept.length}`);
if (missing.length) {
  console.error(`[${fr}] ERROR: quarantined ids absent from test-data.csv: ${missing.join(", ")}`);
  process.exit(1);
}

if (checkOnly) process.exit(0);
writeFileSync(outPath, serializeCsv([header, ...kept]));
console.log(`[${fr}] wrote ${outPath}`);
