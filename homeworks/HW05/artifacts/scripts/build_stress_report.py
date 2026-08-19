#!/usr/bin/env python3
"""
build_stress_report.py — render the Stress scenario's HTML report folder
from the already-computed `stress_percentiles_by_stage.json` (produced by
analyze_raw.py over raw_stress.csv).

Deliberately does NOT rerun k6 or recompute percentiles here — this only
renders the numbers analyze_raw.py already recomputed from raw samples,
matching README.md's documented report mechanism for Stress ("raw
per-request log with percentiles recomputed from it", not handleSummary).

Usage:
    python3 build_stress_report.py <stress_percentiles_by_stage.json> --out <html_path>
"""

import argparse
import json

STEPS = ["login", "search", "cart", "checkout"]


def fmt(v):
    return f"{v:.1f}" if v is not None else "-"


def stage_label(stage_name, target_vu):
    return f"{stage_name} (target {target_vu} VU)"


def build_rows(rows, breaking_point):
    out = []
    current_stage = None
    for r in rows:
        is_break = (
            breaking_point is not None
            and r["stage"] == breaking_point["stage"]
            and r["step"] == breaking_point["step"]
        )
        if r["stage"] != current_stage:
            current_stage = r["stage"]
            out.append(
                f'<tr class="stage-sep"><td colspan="9">{stage_label(r["stage"], r["target_vu"])}</td></tr>'
            )
        cls = ' class="breaking"' if is_break else ""
        out.append(
            f"""<tr{cls}>
    <td>{r['step']}</td>
    <td>{r['count']}</td>
    <td>{100 * r['error_rate']:.2f}%</td>
    <td>{fmt(r['p50_ms'])}</td>
    <td>{fmt(r['p90_ms'])}</td>
    <td>{fmt(r['p95_ms'])}</td>
    <td>{fmt(r['p99_ms'])}</td>
    <td>{fmt(r['max_ms'])}</td>
    <td>{'&larr; breaking point' if is_break else ''}</td>
  </tr>"""
        )
    return "\n".join(out)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("summary_json", help="stress_percentiles_by_stage.json")
    parser.add_argument("--out", required=True, help="output HTML path")
    args = parser.parse_args()

    with open(args.summary_json) as f:
        data = json.load(f)

    rows = data["rows"]
    breaking_point = data.get("breaking_point")

    bp_note = "No stage crossed the 1000ms p95 checkout threshold."
    if breaking_point:
        bp_note = (
            f"Breaking point: <b>{breaking_point['stage']}</b> "
            f"(target {breaking_point['target_vu']} VU) — checkout p95 = "
            f"{fmt(breaking_point['p95_ms'])}ms, error rate = "
            f"{100 * breaking_point['error_rate']:.2f}%."
        )

    html = f"""<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<title>23127216 — Stress Test Report (per-stage percentiles, recomputed from raw log)</title>
<style>
  body {{ font-family: -apple-system, Segoe UI, Roboto, sans-serif; margin: 2rem; color: #0A3A45; }}
  h1 {{ font-size: 1.25rem; }}
  table {{ border-collapse: collapse; width: 100%; margin-top: 1rem; }}
  th, td {{ border: 1px solid #d0d7d8; padding: 0.4rem 0.65rem; text-align: right; font-variant-numeric: tabular-nums; }}
  th:first-child, td:first-child {{ text-align: left; }}
  th {{ background: #7F3B12; color: white; }}
  tr:nth-child(even) {{ background: #faf6f3; }}
  tr.stage-sep td {{ background: #EFE3D8; font-weight: 600; text-align: left; color: #5B3B1E; }}
  tr.breaking {{ background: #FDE3E3; font-weight: 600; }}
  caption {{ text-align: left; font-size: 0.85rem; color: #5B6B70; margin-bottom: 0.5rem; }}
  .note {{ background: #FDE3E3; border: 1px solid #E88; padding: 0.75rem 1rem; border-radius: 4px; margin: 1rem 0; }}
</style>
</head>
<body>
  <h1>23127216 — Stress Test Report</h1>
  <p>Scenario: Stress (5 stages, 0 &rarr; 40 &rarr; 120 &rarr; 220 &rarr; 350 &rarr; 0 VU, 430s total).
     Report mechanism: raw per-request log (<code>--out csv=</code>) with percentiles recomputed
     <b>per load stage</b> by <code>analyze_raw.py</code> — deliberately not read off k6's own
     end-of-run summary, so the breaking point is pinned to a specific VU stage instead of being
     averaged away across the whole run (see README.md "Report views used").</p>
  <div class="note">{bp_note}</div>
  <table>
    <caption>One row per (load stage &times; journey step). Error rate = k6 <code>http_req_failed</code>
      over that stage/step's samples. Percentiles recomputed with linear-interpolation from raw
      <code>http_req_duration</code> samples (see analyze_raw.py).</caption>
    <thead>
      <tr>
        <th>Step</th><th>Count</th><th>Error rate</th>
        <th>p50 (ms)</th><th>p90 (ms)</th><th>p95 (ms)</th><th>p99 (ms)</th><th>Max (ms)</th><th></th>
      </tr>
    </thead>
    <tbody>
      {build_rows(rows, breaking_point)}
    </tbody>
  </table>
  <p style="font-size:0.85rem;color:#5B6B70;margin-top:1rem;">
    Source: <code>artifacts/results/raw/raw_stress.csv</code> &rarr;
    <code>artifacts/scripts/analyze_raw.py</code> &rarr;
    <code>artifacts/results/raw/stress_percentiles_by_stage.json</code> &rarr; this report.
    Raw request-level log attached separately per section 14.
  </p>
</body>
</html>"""

    with open(args.out, "w") as f:
        f.write(html)
    print(f"Stress report written to {args.out}")


if __name__ == "__main__":
    main()
