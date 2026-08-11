#!/usr/bin/env node
// @ts-nocheck
/**
 * Extracts mutant data from a StrykerJS HTML mutation report into structured JSON/CSV.
 *
 * The HTML report embeds `app.report = {...}` as a JS object literal (not strict JSON —
 * long strings can be split as `"a"+"b"` concatenations), so it must be evaluated as JS,
 * not parsed with JSON.parse.
 *
 * Usage:
 *   node scripts/extract-mutants.js [options]
 *
 * Options:
 *   --report <path>     Path to mutation.html (default: reports/mutation/mutation.html)
 *   --file <name>       Only this source file in the report (default: all files)
 *   --status <status>   Filter by status: Survived | Killed | NoCoverage | Timeout | ... (default: all)
 *   --line-min <n>      Only mutants whose start line >= n
 *   --line-max <n>      Only mutants whose end line <= n
 *   --context <n>       Lines of source context around each mutant (default: 1)
 *   --out <path>        Write JSON array to this file instead of stdout
 *   --csv <path>        Also write a flat CSV summary to this file
 *
 * Example (survivors in server.js order-status route, with source context):
 *   node scripts/extract-mutants.js --file server.js --status Survived \
 *     --line-min 525 --line-max 580 --context 2 --out /tmp/survivors.json
 */

const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = { report: "reports/mutation/mutation.html", context: 1 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

/**
 * Stryker's HTML report holds `app.report = <JS object literal>;` inline. Long string
 * values are sometimes emitted as concatenated chunks ("a"+"b"), which is valid JS but
 * not valid JSON — so this pulls the literal by brace-balancing (quote-aware) and
 * evaluates it as JS rather than JSON.parse-ing it.
 */
function extractReportObject(html) {
  const marker = "app.report = ";
  const idx = html.indexOf(marker);
  if (idx === -1) {
    throw new Error(
      'Could not find "app.report = " in the HTML report. Is this a StrykerJS HTML report?'
    );
  }
  const start = idx + marker.length;
  let depth = 0;
  let inStr = false;
  let esc = false;
  let i = start;
  for (; i < html.length; i++) {
    const c = html[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  const literal = html.slice(start, i);
  // eslint-disable-next-line no-new-func -- trusted local Stryker output, not untrusted input
  return new Function(`return (${literal});`)();
}

function sliceLines(source, startLine, endLine, contextLines) {
  const lines = source.split("\n");
  const from = Math.max(1, startLine - contextLines);
  const to = Math.min(lines.length, endLine + contextLines);
  const out = [];
  for (let ln = from; ln <= to; ln++) {
    out.push({ line: ln, text: lines[ln - 1] ?? "" });
  }
  return out;
}

function originalSnippet(source, loc) {
  const lines = source.split("\n");
  if (loc.start.line === loc.end.line) {
    return lines[loc.start.line - 1].slice(loc.start.column - 1, loc.end.column - 1);
  }
  const parts = [];
  for (let ln = loc.start.line; ln <= loc.end.line; ln++) {
    const text = lines[ln - 1] ?? "";
    if (ln === loc.start.line) parts.push(text.slice(loc.start.column - 1));
    else if (ln === loc.end.line) parts.push(text.slice(0, loc.end.column - 1));
    else parts.push(text);
  }
  return parts.join("\n");
}

function toCsvRow(fields) {
  return fields
    .map((f) => {
      const s = String(f ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    })
    .join(",");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const reportPath = path.resolve(process.cwd(), args.report);
  const html = fs.readFileSync(reportPath, "utf-8");
  const report = extractReportObject(html);

  const fileNames = args.file ? [args.file] : Object.keys(report.files);
  const contextLines = Number(args.context) || 0;
  const lineMin = args["line-min"] ? Number(args["line-min"]) : null;
  const lineMax = args["line-max"] ? Number(args["line-max"]) : null;
  const statusFilter = args.status || null;

  const results = [];

  for (const fileName of fileNames) {
    const file = report.files[fileName];
    if (!file) {
      console.error(`Warning: file "${fileName}" not found in report. Skipping.`);
      continue;
    }
    const source = file.source;

    for (const m of file.mutants) {
      if (statusFilter && m.status !== statusFilter) continue;
      if (lineMin !== null && m.location.start.line < lineMin) continue;
      if (lineMax !== null && m.location.end.line > lineMax) continue;

      results.push({
        id: m.id,
        file: fileName,
        status: m.status,
        mutatorName: m.mutatorName,
        location: m.location,
        original: originalSnippet(source, m.location),
        replacement: m.replacement,
        statusReason: m.statusReason || null,
        static: m.static ?? null,
        coveredBy: m.coveredBy || [],
        killedBy: m.killedBy || [],
        testsCompleted: m.testsCompleted ?? null,
        sourceContext: sliceLines(
          source,
          m.location.start.line,
          m.location.end.line,
          contextLines
        ),
      });
    }
  }

  results.sort((a, b) => a.file.localeCompare(b.file) || a.location.start.line - b.location.start.line);

  const json = JSON.stringify(results, null, 2);

  if (args.out) {
    fs.writeFileSync(path.resolve(process.cwd(), args.out), json);
    console.error(`Wrote ${results.length} mutants -> ${args.out}`);
  } else {
    console.log(json);
  }

  if (args.csv) {
    const header = [
      "id",
      "file",
      "status",
      "mutatorName",
      "startLine",
      "endLine",
      "original",
      "replacement",
      "killedBy",
    ];
    const rows = [toCsvRow(header)];
    for (const r of results) {
      rows.push(
        toCsvRow([
          r.id,
          r.file,
          r.status,
          r.mutatorName,
          r.location.start.line,
          r.location.end.line,
          r.original,
          r.replacement,
          r.killedBy.join(" | "),
        ])
      );
    }
    fs.writeFileSync(path.resolve(process.cwd(), args.csv), rows.join("\n"));
    console.error(`Wrote CSV -> ${args.csv}`);
  }

  console.error(`Total: ${results.length} mutant(s) matched.`);
}

main();
