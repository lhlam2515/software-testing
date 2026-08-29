#!/usr/bin/env node

import fs from 'node:fs';

function usage(message) {
  if (message) console.error(message);
  console.error('Usage: node append-bug-report.mjs --report <BUG_REPORT.md> --input <bugs.json>');
  process.exit(2);
}

const args = process.argv.slice(2);
const options = {};
for (let index = 0; index < args.length; index += 2) {
  const key = args[index];
  const value = args[index + 1];
  if (!key?.startsWith('--') || value === undefined) usage(`Invalid argument: ${key ?? ''}`);
  options[key.slice(2)] = value;
}
if (!options.report) usage('Missing --report.');
if (!options.input) usage('Missing --input.');

if (!fs.existsSync(options.report)) usage(`Report file does not exist: ${options.report}`);

let bugs;
try {
  bugs = JSON.parse(fs.readFileSync(options.input, 'utf8'));
} catch (error) {
  console.error(`Cannot read bug input JSON: ${error.message}`);
  process.exit(2);
}
if (!Array.isArray(bugs) || bugs.length === 0) usage('Input JSON must be a non-empty array of bug objects.');

const normalize = (text) => String(text ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '');

// Bug Summary table columns.
const SUMMARY_COLUMNS = [
  { header: 'Bug ID', keys: ['id', 'bugid'], required: true },
  { header: 'API', keys: ['api', 'endpoint'], required: true },
  { header: 'Severity', keys: ['severity'], required: true, enum: ['Critical', 'High', 'Medium', 'Low'] },
  { header: 'Found By', keys: ['foundby', 'found'], required: true, enum: ['AI', 'Beyond AI'] },
  { header: 'Status', keys: ['status'], required: false, fallback: 'Open' },
  { header: 'GitHub Issue', keys: ['githubissue', 'githubissuelink', 'issuelink'], required: false, fallback: 'Pending' },
];

// Fields used to render the "### BUG-ID - <title>" detailed section.
const DETAIL_FIELDS = [
  { key: 'title', aliases: ['title', 'summary', 'headline'], required: true },
  { key: 'description', aliases: ['description', 'desc'], required: true },
  { key: 'steps', aliases: ['steps', 'stepstoreproduce'], required: true },
  { key: 'rootCause', aliases: ['rootcause', 'root'], required: false, fallback: '' },
  { key: 'expected', aliases: ['expected'], required: true },
  { key: 'actual', aliases: ['actual'], required: true },
  { key: 'screenshot', aliases: ['screenshot'], required: false, fallback: 'Pending' },
];

function fieldValue(bug, aliases) {
  const normalizedEntries = Object.entries(bug).map(([key, value]) => [normalize(key), value]);
  for (const alias of aliases) {
    const found = normalizedEntries.find(([key]) => key === normalize(alias));
    if (found && found[1] !== undefined && found[1] !== null && String(found[1]).trim() !== '') return found[1];
  }
  return undefined;
}

function splitRow(line) {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map((cell) => cell.trim());
}

function escapeCell(value) {
  return String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function stepsToMarkdown(value) {
  if (Array.isArray(value)) {
    return value.map((step, index) => `${index + 1}. ${step}`).join('\n');
  }
  const text = String(value).trim();
  // Already numbered/multi-line: keep as-is.
  if (/\n/.test(text) || /^\d+[.)]/.test(text)) return text;
  return `1. ${text}`;
}

const source = fs.readFileSync(options.report, 'utf8');
const lines = source.split(/\r?\n/);

// --- Locate the Bug Summary table ---
let summaryHeadingIndex = lines.findIndex((line) => /^##\s+Bug Summary/i.test(line.trim()));
if (summaryHeadingIndex < 0) usage(`No "## Bug Summary" section found in ${options.report}.`);

let tableHeaderIndex = -1;
for (let index = summaryHeadingIndex; index < lines.length; index += 1) {
  if (lines[index].trim().startsWith('|') && /^\s*\|[\s:-]+\|/.test(lines[index + 1] ?? '')) {
    tableHeaderIndex = index;
    break;
  }
}
if (tableHeaderIndex < 0) usage(`No Markdown table found under "## Bug Summary" in ${options.report}.`);

const headerCells = splitRow(lines[tableHeaderIndex]).map((cell) => ({ raw: cell, key: normalize(cell) }));
const columnPlan = SUMMARY_COLUMNS.map((column) => {
  const matchIndex = headerCells.findIndex((cell) => cell.key === normalize(column.header));
  return { ...column, tableIndex: matchIndex };
});
for (const column of columnPlan) {
  if (column.required && column.tableIndex < 0) {
    usage(`Bug Summary table is missing required column "${column.header}".`);
  }
}

const separatorIndex = tableHeaderIndex + 1;
let bodyEnd = separatorIndex + 1;
while (bodyEnd < lines.length && lines[bodyEnd].trim().startsWith('|')) bodyEnd += 1;
const bodyLines = lines.slice(separatorIndex + 1, bodyEnd);

const bugIdColumn = columnPlan.find((column) => column.header === 'Bug ID');
const existingIds = new Set();
const keptBodyLines = [];
for (const line of bodyLines) {
  const cells = splitRow(line);
  const idCell = (cells[bugIdColumn.tableIndex] ?? '').trim();
  if (idCell === '_TBD_' || idCell === 'TBD') continue;
  if (idCell) existingIds.add(idCell);
  keptBodyLines.push(line);
}

// --- Locate the Detailed Findings section (insertion point for new "### " sections) ---
let detailsHeadingIndex = lines.findIndex((line) => /^##\s+Detailed Findings/i.test(line.trim()));
if (detailsHeadingIndex < 0) usage(`No "## Detailed Findings" section found in ${options.report}.`);

// Insert new detail sections right before the next "## " heading (or end of file),
// and before any trailing "> " blockquote note that sits after the last "### " section.
let detailsInsertIndex = lines.length;
for (let index = detailsHeadingIndex + 1; index < lines.length; index += 1) {
  if (/^##\s+/.test(lines[index].trim())) {
    detailsInsertIndex = index;
    break;
  }
}
// Back up past any trailing blank lines / "---" / "> " note block that closes the section.
let cursor = detailsInsertIndex;
while (cursor > detailsHeadingIndex + 1) {
  const trimmed = lines[cursor - 1].trim();
  if (trimmed === '' || trimmed === '---' || trimmed.startsWith('>')) {
    cursor -= 1;
  } else {
    break;
  }
}
detailsInsertIndex = cursor;

const added = [];
const skipped = [];
const newSummaryRows = [];
const newDetailBlocks = [];

for (const bug of bugs) {
  const idValue = fieldValue(bug, bugIdColumn.keys);
  if (!idValue) {
    console.error(`Skipping bug with no id: ${JSON.stringify(bug)}`);
    continue;
  }
  if (existingIds.has(String(idValue))) {
    skipped.push(idValue);
    continue;
  }

  // Build the summary row.
  const rowCells = new Array(headerCells.length).fill('');
  let missingRequired = null;
  for (const column of columnPlan) {
    if (column.tableIndex < 0) continue;
    let value = fieldValue(bug, column.keys);
    if (value === undefined) {
      if (column.required) {
        missingRequired = column.header;
        break;
      }
      value = column.fallback ?? '';
    }
    if (column.enum) {
      const match = column.enum.find((option) => normalize(option) === normalize(value));
      if (!match) {
        missingRequired = `${column.header} (must be one of: ${column.enum.join(', ')})`;
        break;
      }
      value = match;
    }
    rowCells[column.tableIndex] = escapeCell(value);
  }
  if (missingRequired) {
    console.error(`Skipping bug "${idValue}": invalid or missing "${missingRequired}".`);
    continue;
  }

  // Build the detail fields.
  const detail = {};
  let missingDetail = null;
  for (const field of DETAIL_FIELDS) {
    let value = fieldValue(bug, field.aliases);
    if (value === undefined) {
      if (field.required) {
        missingDetail = field.key;
        break;
      }
      value = field.fallback ?? '';
    }
    detail[field.key] = value;
  }
  if (missingDetail) {
    console.error(`Skipping bug "${idValue}": missing required detail field "${missingDetail}".`);
    continue;
  }

  const api = fieldValue(bug, columnPlan.find((c) => c.header === 'API').keys);
  const severity = rowCells[columnPlan.find((c) => c.header === 'Severity').tableIndex];
  const foundBy = rowCells[columnPlan.find((c) => c.header === 'Found By').tableIndex];
  const githubIssueColumn = columnPlan.find((c) => c.header === 'GitHub Issue');
  const githubIssue = githubIssueColumn.tableIndex >= 0 ? rowCells[githubIssueColumn.tableIndex] : 'Pending';

  existingIds.add(String(idValue));
  added.push(idValue);
  newSummaryRows.push(`| ${rowCells.join(' | ')} |`);

  const stepsMarkdown = stepsToMarkdown(detail.steps);
  newDetailBlocks.push(
    [
      `### ${idValue} - ${detail.title}`,
      '',
      `**API:** \`${api}\``,
      `**Found By:** ${foundBy}`,
      `**Severity:** ${severity}`,
      `**GitHub Issue:** ${githubIssue}`,
      '',
      '#### Description',
      '',
      detail.description,
      '',
      '#### Steps to Reproduce',
      '',
      stepsMarkdown,
      '',
      ...(detail.rootCause ? ['#### Root Cause', '', detail.rootCause, ''] : []),
      '#### Expected vs Actual Result',
      '',
      '| | Result |',
      '| -- | ------ |',
      `| **Expected** | ${escapeCell(detail.expected)} |`,
      `| **Actual** | ${escapeCell(detail.actual)} |`,
      '',
      '#### Screenshot',
      '',
      detail.screenshot,
      '',
      '---',
      '',
    ].join('\n'),
  );
}

const rebuiltSummary = [
  ...lines.slice(0, separatorIndex + 1),
  ...keptBodyLines,
  ...newSummaryRows,
];

const afterSummary = lines.slice(bodyEnd, detailsInsertIndex);
const tail = lines.slice(detailsInsertIndex);

const detailInsertLines = newDetailBlocks.length
  ? newDetailBlocks.join('\n').split('\n')
  : [];

const rebuilt = [
  ...rebuiltSummary,
  ...afterSummary,
  ...detailInsertLines,
  ...tail,
];

let output = rebuilt.join('\n');
// Collapse a run of consecutive "---" horizontal rules (with only blank lines between them)
// into a single one — happens when new detail blocks are inserted directly before the
// existing trailing "---" that precedes the closing note.
output = output.replace(/(\n---\n)(?:\s*\n---\n)+/g, '$1');
output = output.replace(/\n{3,}/g, '\n\n\n').replace(/\n{3,}$/, '\n');
if (!output.endsWith('\n')) output += '\n';
fs.writeFileSync(options.report, output);

console.log(`Added: ${added.length ? added.join(', ') : '(none)'}`);
if (skipped.length) console.log(`Skipped (already present): ${skipped.join(', ')}`);
