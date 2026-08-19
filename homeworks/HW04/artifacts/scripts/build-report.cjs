#!/usr/bin/env node
/**
 * Build a styled PDF from a directory of Markdown report files.
 *
 * Concatenates every *.md in the directory (alphabetical order — prefix files
 * 01_, 02_, ... to control sequence), inlines local images as base64 so the PDF
 * is self-contained, and renders A4 via Chromium (bundled with Playwright).
 *
 * Ported from Triangle_SUT/Codes/build-report.js (in-class reference project) —
 * kept generic and unmodified beyond the .cjs extension, so it still works from
 * any project directory that has `marked` and `@playwright/test` installed.
 *
 * Usage:
 *   node build-report.cjs --in <markdown-dir> --out <output.pdf> [options]
 *
 * Options:
 *   --in <dir>        Directory containing .md files            (required)
 *   --out <file>      Output PDF path                           (required)
 *   --title <text>    Cover page title                          (default: "Test Report")
 *   --subtitle <text> Cover page subtitle                       (optional)
 *   --meta k=v        Cover page table row, repeatable          (optional)
 *   --no-cover        Skip the cover page
 *   --keep-html       Also write the intermediate .html next to the PDF
 */
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const opts = { meta: [], cover: true, keepHtml: false, title: 'Test Report' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--in') opts.in = argv[++i];
    else if (a === '--out') opts.out = argv[++i];
    else if (a === '--title') opts.title = argv[++i];
    else if (a === '--subtitle') opts.subtitle = argv[++i];
    else if (a === '--meta') opts.meta.push(argv[++i]);
    else if (a === '--no-cover') opts.cover = false;
    else if (a === '--keep-html') opts.keepHtml = true;
    else if (a === '-h' || a === '--help') opts.help = true;
  }
  return opts;
}

const opts = parseArgs(process.argv.slice(2));

if (opts.help || !opts.in || !opts.out) {
  console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^\/\*\*?/, ''));
  process.exit(opts.help ? 0 : 1);
}

function load(name) {
  const roots = [process.cwd(), ...(process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean)];
  try {
    return require(name);
  } catch {
    for (const root of roots) {
      try {
        return require(require.resolve(name, { paths: [path.resolve(root)] }));
      } catch { /* keep looking */ }
    }
    console.error(
      `Cannot find "${name}". Install the dependencies in your project, then run this script from the project directory:\n` +
      '  npm install marked @playwright/test\n' +
      '  npx playwright install chromium'
    );
    process.exit(1);
  }
}

const { marked } = load('marked');
const { chromium } = load('@playwright/test');

const IN_DIR = path.resolve(opts.in);
const OUT_PDF = path.resolve(opts.out);

if (!fs.existsSync(IN_DIR)) {
  console.error(`Input directory not found: ${IN_DIR}`);
  process.exit(1);
}

const mdFiles = fs.readdirSync(IN_DIR).filter((f) => f.toLowerCase().endsWith('.md')).sort();
if (!mdFiles.length) {
  console.error(`No .md files found in ${IN_DIR}`);
  process.exit(1);
}

marked.setOptions({ gfm: true, breaks: false });

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp' };

function inlineImages(html, baseDir) {
  return html.replace(/<img([^>]*?)src="([^"]+)"/g, (whole, attrs, src) => {
    if (/^(data:|https?:)/i.test(src)) return whole;
    const abs = path.resolve(baseDir, decodeURIComponent(src));
    if (!fs.existsSync(abs)) {
      console.warn(`  ! image not found, left as-is: ${src}`);
      return whole;
    }
    const mime = MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream';
    const b64 = fs.readFileSync(abs).toString('base64');
    return `<img${attrs}src="data:${mime};base64,${b64}"`;
  });
}

const sections = mdFiles.map((f) => {
  const md = fs.readFileSync(path.join(IN_DIR, f), 'utf8');
  console.log(`  + ${f}`);
  return `<section class="part">${inlineImages(marked.parse(md), IN_DIR)}</section>`;
});

const metaRows = opts.meta
  .map((kv) => {
    const i = kv.indexOf('=');
    return i < 0 ? '' : `<tr><th>${kv.slice(0, i)}</th><td>${kv.slice(i + 1)}</td></tr>`;
  })
  .join('');

const cover = opts.cover
  ? `<div class="cover">
       <h1>${opts.title}</h1>
       ${opts.subtitle ? `<div class="sub">${opts.subtitle}</div>` : ''}
       ${metaRows ? `<table>${metaRows}</table>` : ''}
     </div>`
  : '';

const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${opts.title}</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color:#1f2937; font-size:12px; line-height:1.5; }
  h1 { font-size:20px; color:#0f3d6e; border-bottom:3px solid #0f3d6e; padding-bottom:6px; margin-top:28px; page-break-after:avoid; }
  h2 { font-size:15px; color:#0b5d8a; margin-top:20px; page-break-after:avoid; }
  h3 { font-size:13px; color:#374151; page-break-after:avoid; }
  code { background:#f3f4f6; padding:1px 4px; border-radius:3px; font-family:Consolas,monospace; font-size:11px; }
  pre { background:#f3f4f6; padding:8px; border-radius:4px; overflow-x:auto; }
  pre code { background:none; padding:0; }
  table { border-collapse:collapse; width:100%; margin:10px 0; font-size:11px; page-break-inside:avoid; }
  th, td { border:1px solid #cbd5e1; padding:5px 7px; text-align:left; vertical-align:top; }
  th { background:#0f3d6e; color:#fff; font-weight:600; }
  tr:nth-child(even) td { background:#f8fafc; }
  blockquote { border-left:4px solid #f59e0b; background:#fffbeb; margin:10px 0; padding:8px 12px; }
  img { max-width:92%; border:1px solid #cbd5e1; border-radius:4px; display:block; margin:10px auto; }
  .cover { text-align:center; margin-top:60px; page-break-after:always; }
  .cover h1 { border:none; font-size:30px; }
  .cover .sub { font-size:15px; color:#374151; margin-top:8px; }
  .cover table { width:70%; margin:30px auto; }
  .part { page-break-before:always; }
  .cover + .part { page-break-before:avoid; }
</style></head><body>${cover}${sections.join('\n')}</body></html>`;

(async () => {
  fs.mkdirSync(path.dirname(OUT_PDF), { recursive: true });
  if (opts.keepHtml) {
    const htmlPath = OUT_PDF.replace(/\.pdf$/i, '.html');
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log(`HTML written: ${htmlPath}`);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.pdf({
    path: OUT_PDF,
    format: 'A4',
    printBackground: true,
    margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate:
      `<div style="font-size:8px;width:100%;text-align:center;color:#9ca3af;">${opts.title} · <span class="pageNumber"></span>/<span class="totalPages"></span></div>`,
  });
  await browser.close();
  console.log(`PDF generated: ${OUT_PDF}`);
})();
