#!/usr/bin/env python3
"""
build_spike_report.py — render the Spike scenario's HTML report folder as a
time-series view, from the raw --out json= stream (ts_spike.json).

Deliberately reads the raw k6 JSON-lines stream directly (one k6 Point per
metric sample, `{"type":"Point","metric":...,"data":{"time":...,"value":...,
"tags":{...}}}`) rather than any pre-aggregated summary — this is the
report mechanism README.md documents for Spike ("time-series view ...
plotted against elapsed time to read recovery behaviour"), distinct from
Load's handleSummary/HTML and Stress's per-stage recompute.

Buckets samples into fixed-width time windows (default 2s) and renders:
  - VU count + login step error rate over time (the lockout sub-scenario's
    surge/recovery shape).
  - Overall http_req_duration p95 over time (the latency recovery shape).
No matplotlib dependency — the chart is a hand-built inline SVG so the
output HTML file is fully self-contained and offline-renderable.

Usage:
    python3 build_spike_report.py <ts_spike.json> --out <html_path> [--bucket-s 2]
"""

import argparse
import json
from statistics import median


def percentile(sorted_values, p):
    if not sorted_values:
        return None
    if len(sorted_values) == 1:
        return sorted_values[0]
    k = (len(sorted_values) - 1) * (p / 100.0)
    f = int(k)
    c = min(f + 1, len(sorted_values) - 1)
    if f == c:
        return sorted_values[f]
    return sorted_values[f] + (sorted_values[c] - sorted_values[f]) * (k - f)


def parse_time(iso):
    # k6 JSON output timestamps are RFC3339 with numeric offset and a
    # variable-precision fractional-second field (not always 6 or 9 digits),
    # e.g. 2026-08-18T14:56:50.21257996+07:00 — fromisoformat handles both
    # the variable precision and the offset natively (Python 3.11+).
    from datetime import datetime

    return datetime.fromisoformat(iso)


def load_stream(path):
    vus_points = []  # (t, value)
    req_points = []  # (t, duration_ms, step, status)
    t0 = None
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            d = json.loads(line)
            if d.get("type") != "Point":
                continue
            metric = d.get("metric")
            data = d["data"]
            t = parse_time(data["time"])
            if t0 is None or t < t0:
                t0 = t
            if metric == "vus":
                vus_points.append((t, data["value"]))
            elif metric == "http_req_duration":
                tags = data.get("tags", {})
                req_points.append((t, data["value"], tags.get("step", "other"), tags.get("status", "")))
    return t0, vus_points, req_points


def bucket_index(t, t0, bucket_s):
    return int((t - t0).total_seconds() // bucket_s)


def summarize(t0, vus_points, req_points, bucket_s):
    n_buckets = max(
        [bucket_index(t, t0, bucket_s) for t, _ in vus_points]
        + [bucket_index(t, t0, bucket_s) for t, _, _, _ in req_points]
    ) + 1

    vus_by_bucket = {}
    for t, v in vus_points:
        vus_by_bucket.setdefault(bucket_index(t, t0, bucket_s), []).append(v)

    dur_by_bucket = {}
    login_total = {}
    login_fail = {}
    for t, v, step, status in req_points:
        b = bucket_index(t, t0, bucket_s)
        dur_by_bucket.setdefault(b, []).append(v)
        if step == "login":
            login_total[b] = login_total.get(b, 0) + 1
            if status != "200":
                login_fail[b] = login_fail.get(b, 0) + 1

    rows = []
    for b in range(n_buckets):
        vus_vals = vus_by_bucket.get(b, [])
        durs = sorted(dur_by_bucket.get(b, []))
        lt = login_total.get(b, 0)
        lf = login_fail.get(b, 0)
        rows.append(
            {
                "t_s": b * bucket_s,
                "vus": (max(vus_vals) if vus_vals else (rows[-1]["vus"] if rows else 0)),
                "reqs": len(durs),
                "p95_ms": percentile(durs, 95),
                "median_ms": median(durs) if durs else None,
                "login_total": lt,
                "login_fail": lf,
                "login_error_rate": (lf / lt) if lt else 0.0,
            }
        )
    return rows


def svg_chart(rows, width=900, height=420):
    if not rows:
        return "<p>No data.</p>"
    pad_l, pad_r, pad_t, pad_b = 55, 20, 20, 30
    plot_w = width - pad_l - pad_r
    plot_h_top = 140  # VU + login error-rate panel
    plot_h_bot = 140  # latency panel
    gap = 40

    t_max = rows[-1]["t_s"] or 1
    vu_max = max(r["vus"] for r in rows) or 1
    lat_vals = [r["p95_ms"] for r in rows if r["p95_ms"] is not None]
    lat_max = max(lat_vals) if lat_vals else 1

    def x(t):
        return pad_l + (t / t_max) * plot_w

    def y_top(v, vmax):
        return pad_t + plot_h_top - (v / vmax) * plot_h_top

    def y_bot(v, vmax):
        base = pad_t + plot_h_top + gap
        return base + plot_h_bot - (v / vmax) * plot_h_bot

    vu_path = " ".join(f"{'M' if i == 0 else 'L'}{x(r['t_s']):.1f},{y_top(r['vus'], vu_max):.1f}" for i, r in enumerate(rows))
    err_path = " ".join(f"{'M' if i == 0 else 'L'}{x(r['t_s']):.1f},{y_top(r['login_error_rate'] * vu_max, vu_max):.1f}" for i, r in enumerate(rows))
    lat_rows = [r for r in rows if r["p95_ms"] is not None]
    lat_path = " ".join(f"{'M' if i == 0 else 'L'}{x(r['t_s']):.1f},{y_bot(r['p95_ms'], lat_max):.1f}" for i, r in enumerate(lat_rows))

    base_bot = pad_t + plot_h_top + gap
    total_h = base_bot + plot_h_bot + pad_b

    return f"""
<svg viewBox="0 0 {width} {total_h}" width="100%" style="max-width:{width}px;">
  <text x="{pad_l}" y="12" font-size="11" fill="#5B6B70">VU count (blue) vs. login-step error rate scaled to VU axis (red) — surge at t&asymp;0s, recovery window after</text>
  <line x1="{pad_l}" y1="{pad_t}" x2="{pad_l}" y2="{pad_t+plot_h_top}" stroke="#999"/>
  <line x1="{pad_l}" y1="{pad_t+plot_h_top}" x2="{width-pad_r}" y2="{pad_t+plot_h_top}" stroke="#999"/>
  <text x="4" y="{pad_t+8}" font-size="10" fill="#5B6B70">{vu_max:.0f}</text>
  <text x="4" y="{pad_t+plot_h_top}" font-size="10" fill="#5B6B70">0</text>
  <path d="{vu_path}" fill="none" stroke="#12707F" stroke-width="1.6"/>
  <path d="{err_path}" fill="none" stroke="#C0392B" stroke-width="1.4" stroke-dasharray="3,2"/>

  <text x="{pad_l}" y="{base_bot-8}" font-size="11" fill="#5B6B70">http_req_duration p95 (ms) over time — journey overall</text>
  <line x1="{pad_l}" y1="{base_bot}" x2="{pad_l}" y2="{base_bot+plot_h_bot}" stroke="#999"/>
  <line x1="{pad_l}" y1="{base_bot+plot_h_bot}" x2="{width-pad_r}" y2="{base_bot+plot_h_bot}" stroke="#999"/>
  <text x="4" y="{base_bot+8}" font-size="10" fill="#5B6B70">{lat_max:.0f}</text>
  <text x="4" y="{base_bot+plot_h_bot}" font-size="10" fill="#5B6B70">0</text>
  <path d="{lat_path}" fill="none" stroke="#7F3B12" stroke-width="1.6"/>

  <text x="{pad_l}" y="{total_h-4}" font-size="10" fill="#5B6B70">0s</text>
  <text x="{width-pad_r-24}" y="{total_h-4}" font-size="10" fill="#5B6B70">{t_max:.0f}s</text>
</svg>
"""


def table_rows(rows, every_s):
    out = []
    step = max(1, every_s // (rows[1]["t_s"] - rows[0]["t_s"]) if len(rows) > 1 else 1)
    for i in range(0, len(rows), int(step)):
        r = rows[i]
        out.append(
            f"""<tr>
    <td>{r['t_s']}</td>
    <td>{r['vus']:.0f}</td>
    <td>{r['reqs']}</td>
    <td>{'-' if r['p95_ms'] is None else f"{r['p95_ms']:.1f}"}</td>
    <td>{'-' if r['median_ms'] is None else f"{r['median_ms']:.1f}"}</td>
    <td>{r['login_total']}</td>
    <td>{r['login_fail']}</td>
    <td>{100*r['login_error_rate']:.1f}%</td>
  </tr>"""
        )
    return "\n".join(out)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("ts_json", help="ts_spike.json (--out json= stream)")
    parser.add_argument("--out", required=True, help="output HTML path")
    parser.add_argument("--bucket-s", type=int, default=2, help="time bucket width in seconds")
    parser.add_argument("--table-every-s", type=int, default=6, help="table row spacing in seconds")
    args = parser.parse_args()

    t0, vus_points, req_points = load_stream(args.ts_json)
    rows = summarize(t0, vus_points, req_points, args.bucket_s)

    peak_vu = max(r["vus"] for r in rows)
    peak_login_err = max(rows, key=lambda r: r["login_error_rate"])
    total_login = sum(r["login_total"] for r in rows)
    total_login_fail = sum(r["login_fail"] for r in rows)

    html = f"""<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<title>23127216 — Spike Test Report (time-series view)</title>
<style>
  body {{ font-family: -apple-system, Segoe UI, Roboto, sans-serif; margin: 2rem; color: #0A3A45; }}
  h1 {{ font-size: 1.25rem; }}
  table {{ border-collapse: collapse; width: 100%; margin-top: 1rem; }}
  th, td {{ border: 1px solid #d0d7d8; padding: 0.35rem 0.6rem; text-align: right; font-variant-numeric: tabular-nums; font-size: 0.9rem; }}
  th:first-child, td:first-child {{ text-align: left; }}
  th {{ background: #12707F; color: white; }}
  tr:nth-child(even) {{ background: #f4f8f8; }}
  caption {{ text-align: left; font-size: 0.85rem; color: #5B6B70; margin-bottom: 0.5rem; }}
  .note {{ background: #FDE3E3; border: 1px solid #E88; padding: 0.75rem 1rem; border-radius: 4px; margin: 1rem 0; }}
  .chart-wrap {{ background: #fff; border: 1px solid #d0d7d8; border-radius: 4px; padding: 0.5rem; }}
</style>
</head>
<body>
  <h1>23127216 — Spike Test Report</h1>
  <p>Scenario: Spike (15 &rarr; 200 VU surge in 5s, hold 30s, drop to 15 VU in 5s, 60s recovery hold,
     plus a dedicated lockout sub-scenario). Report mechanism: raw <code>--out json=</code> time-series
     stream, bucketed into {args.bucket_s}s windows and plotted against elapsed time — this is the view
     that shows recovery behaviour, which no aggregate summary carries (see README.md "Report views used").</p>
  <div class="note">
    Peak VU observed: {peak_vu:.0f}. Login-step error rate breach:
    {total_login_fail}/{total_login} login requests failed overall ({100*total_login_fail/total_login:.2f}%),
    peaking at {100*peak_login_err['login_error_rate']:.1f}% in the bucket starting t={peak_login_err['t_s']}s.
    This matches the account-lockout sub-scenario: a batch of VUs fail login once during the surge
    (locked via the SUT's 2-consecutive-failure rule, HTTP 403) and keep retrying every iteration for
    the rest of the run, since journey.js has no retry backoff — see REPORT.md §4.7 and
    NOTES.md's [AI-02] entry on the 403-vs-423 status-code correction.
  </div>
  <div class="chart-wrap">
    {svg_chart(rows)}
  </div>
  <table>
    <caption>Time-bucketed view, one row every ~{args.table_every_s}s (full-resolution {args.bucket_s}s buckets
      used for the chart above; raw per-request log attached separately per section 14).</caption>
    <thead>
      <tr>
        <th>t (s)</th><th>VUs</th><th>Reqs (bucket)</th><th>p95 (ms)</th><th>median (ms)</th>
        <th>Login reqs</th><th>Login fails</th><th>Login err%</th>
      </tr>
    </thead>
    <tbody>
      {table_rows(rows, args.table_every_s)}
    </tbody>
  </table>
  <p style="font-size:0.85rem;color:#5B6B70;margin-top:1rem;">
    Source: <code>artifacts/results/raw/ts_spike.json</code> (k6 <code>--out json=</code> stream,
    {len(req_points) + len(vus_points)} points parsed) &rarr; this report, built by
    <code>artifacts/scripts/build_spike_report.py</code>.
  </p>
</body>
</html>"""

    with open(args.out, "w") as f:
        f.write(html)
    print(f"Spike report written to {args.out} ({len(rows)} buckets, peak VU={peak_vu:.0f})")


if __name__ == "__main__":
    main()
