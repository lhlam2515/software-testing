#!/usr/bin/env python3
"""
analyze_soak.py — recompute the Soak run's headline numbers directly from
the raw --out csv= log (raw_soak.csv) and the RSS/CPU sampler
(monitor_soak.csv), for REPORT.md 4.8 / README.md "Endurance Threshold".

Unlike analyze_raw.py (Stress), Soak holds ONE constant VU level for the
whole run (23127216_Soak_20260817.js: constant-vus, 80 VU, 10m) — there are
no load stages to bucket by. What matters here is DEGRADATION OVER TIME at
a fixed, already-known-safe VU level, so this script buckets by elapsed
MINUTE instead of by VU stage, and cross-references monitor_soak.csv for
the RSS growth trend (the actual falsifiable signal for BUG-05-LAM-003,
the in-memory unbounded userCarts leak).

Usage:
    python3 analyze_soak.py <raw_soak.csv> <monitor_soak.csv> [--out summary.json]
"""

import argparse
import csv
import json

STEPS = ["login", "search", "cart", "checkout"]


def percentile(sorted_values, p):
    """Linear-interpolation percentile — same convention as numpy.percentile's default."""
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


def extract_step(row):
    """k6's csv output has no top-level `step` column — the `tags: {step:...}`
    set in config.js lands packed into extra_tags as "step=<value>;..." —
    verified against this run's own header (metric_name,...,extra_tags,metadata,
    no bare `step` column)."""
    for pair in (row.get("extra_tags") or "").split(";"):
        if pair.startswith("step="):
            return pair[len("step=") :]
    return "other"


def load_raw(csv_path):
    """Single pass over the raw log: overall per-step stats + per-minute
    (checkout p95, error rate, throughput) trend, to see whether things get
    WORSE over the 10-minute window, not just what they average out to."""
    overall_durations = {s: [] for s in STEPS}
    overall_fail = {s: [0, 0] for s in STEPS}
    minute_durations = {}  # (minute, step) -> [durations]
    minute_fail = {}  # (minute, step) -> [n_fail, n_total]
    t0 = None

    with open(csv_path, newline="") as f:
        reader = csv.DictReader(f)
        for r in reader:
            metric = r.get("metric_name")
            if metric not in ("http_req_duration", "http_req_failed"):
                continue
            step = extract_step(r)
            if step not in STEPS:
                continue
            ts = float(r["timestamp"])
            if t0 is None or ts < t0:
                t0 = ts

    if t0 is None:
        raise SystemExit(f"No http_req_duration/http_req_failed samples found in {csv_path}")

    with open(csv_path, newline="") as f:
        reader = csv.DictReader(f)
        for r in reader:
            metric = r.get("metric_name")
            if metric not in ("http_req_duration", "http_req_failed"):
                continue
            step = extract_step(r)
            if step not in STEPS:
                continue
            ts = float(r["timestamp"])
            minute = int((ts - t0) // 60)
            value = float(r["metric_value"])

            if metric == "http_req_duration":
                overall_durations[step].append(value)
                minute_durations.setdefault((minute, step), []).append(value)
            else:  # http_req_failed
                overall_fail[step][1] += 1
                minute_fail.setdefault((minute, step), [0, 0])[1] += 1
                if value >= 1:
                    overall_fail[step][0] += 1
                    minute_fail[(minute, step)][0] += 1

    return overall_durations, overall_fail, minute_durations, minute_fail, t0


def summarize_overall(overall_durations, overall_fail, run_seconds):
    rows = []
    for step in STEPS:
        values = sorted(overall_durations[step])
        fails, total = overall_fail[step]
        rows.append(
            {
                "step": step,
                "count": len(values),
                "error_rate": (fails / total) if total else 0.0,
                "p50_ms": percentile(values, 50),
                "p90_ms": percentile(values, 90),
                "p95_ms": percentile(values, 95),
                "p99_ms": percentile(values, 99),
                "max_ms": values[-1] if values else None,
                "rps": (len(values) / run_seconds) if run_seconds else None,
            }
        )
    return rows


def summarize_by_minute(minute_durations, minute_fail, step="checkout"):
    minutes = sorted({m for (m, s) in minute_durations if s == step})
    rows = []
    for m in minutes:
        values = sorted(minute_durations.get((m, step), []))
        fails, total = minute_fail.get((m, step), [0, 0])
        rows.append(
            {
                "minute": m,
                "count": len(values),
                "error_rate": (fails / total) if total else 0.0,
                "p50_ms": percentile(values, 50),
                "p95_ms": percentile(values, 95),
                "p99_ms": percentile(values, 99),
            }
        )
    return rows


def load_monitor(monitor_path):
    rows = []
    with open(monitor_path, newline="") as f:
        for r in csv.DictReader(f):
            rows.append(
                {
                    "timestamp": r["timestamp"],
                    "rss_kb": float(r["rss_kb"]),
                    "cpu_pct": float(r["cpu_pct"]),
                }
            )
    return rows


def summarize_monitor(rows):
    if not rows:
        return None
    rss = [r["rss_kb"] for r in rows]
    cpu = [r["cpu_pct"] for r in rows]
    n = len(rows)
    # Skip the first ~5% of samples (startup burst: process spawn, first-login
    # UPDATE wave) when computing the "steady-state" CPU ceiling, so a
    # transient spawn spike doesn't get reported as the sustained CPU cost.
    steady_start = max(1, n // 20)
    steady_cpu = cpu[steady_start:]
    duration_minutes = n / 60.0  # monitor.sh samples once per second

    return {
        "samples": n,
        "duration_minutes": round(duration_minutes, 2),
        "rss_start_kb": rss[0],
        "rss_end_kb": rss[-1],
        "rss_max_kb": max(rss),
        "rss_growth_kb": rss[-1] - rss[0],
        "rss_growth_kb_per_min": (rss[-1] - rss[0]) / duration_minutes if duration_minutes else None,
        "rss_monotonic_nondecreasing": all(b >= a for a, b in zip(rss, rss[1:])),
        "cpu_avg_pct": sum(cpu) / n,
        "cpu_max_pct": max(cpu),
        "cpu_steady_avg_pct": sum(steady_cpu) / len(steady_cpu) if steady_cpu else None,
        "cpu_steady_max_pct": max(steady_cpu) if steady_cpu else None,
    }


def fmt(v):
    return f"{v:.1f}" if isinstance(v, float) else ("-" if v is None else str(v))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("raw_csv", help="raw --out csv= log from the Soak run (raw_soak.csv)")
    parser.add_argument("monitor_csv", help="monitor.sh RSS/CPU sampler output (monitor_soak.csv)")
    parser.add_argument("--out", default=None, help="also write the summary as JSON to this path")
    args = parser.parse_args()

    overall_durations, overall_fail, minute_durations, minute_fail, t0 = load_raw(args.raw_csv)
    # Run span in seconds, derived from the last populated minute bucket
    # (not from durations, which are latencies, not timestamps).
    observed_minutes = sorted({m for (m, _s) in minute_durations})
    run_seconds = (observed_minutes[-1] + 1) * 60 if observed_minutes else 0

    overall_rows = summarize_overall(overall_durations, overall_fail, run_seconds)
    checkout_by_minute = summarize_by_minute(minute_durations, minute_fail, step="checkout")

    print("=== Overall per-step stats (whole 10-minute soak run) ===")
    header = f'{"step":<10}{"count":>8}{"err%":>8}{"rps":>8}{"p50":>9}{"p90":>9}{"p95":>9}{"p99":>9}{"max":>9}'
    print(header)
    print("-" * len(header))
    for r in overall_rows:
        print(
            f'{r["step"]:<10}{r["count"]:>8}{100*r["error_rate"]:>7.2f}%{fmt(r["rps"]):>8}'
            f'{fmt(r["p50_ms"]):>9}{fmt(r["p90_ms"]):>9}{fmt(r["p95_ms"]):>9}{fmt(r["p99_ms"]):>9}{fmt(r["max_ms"]):>9}'
        )

    print("\n=== checkout p95 / error rate by minute (degradation-over-time check) ===")
    header2 = f'{"minute":>7}{"count":>8}{"err%":>8}{"p50":>9}{"p95":>9}{"p99":>9}'
    print(header2)
    print("-" * len(header2))
    for r in checkout_by_minute:
        print(
            f'{r["minute"]:>7}{r["count"]:>8}{100*r["error_rate"]:>7.2f}%'
            f'{fmt(r["p50_ms"]):>9}{fmt(r["p95_ms"]):>9}{fmt(r["p99_ms"]):>9}'
        )

    monitor_rows = load_monitor(args.monitor_csv)
    mon = summarize_monitor(monitor_rows)
    print("\n=== Backend RSS/CPU (monitor_soak.csv) ===")
    if mon:
        print(f'Samples: {mon["samples"]} (~{mon["duration_minutes"]} min @ 1/s)')
        print(f'RSS: start={mon["rss_start_kb"]:.0f}KB end={mon["rss_end_kb"]:.0f}KB max={mon["rss_max_kb"]:.0f}KB')
        print(
            f'RSS growth: {mon["rss_growth_kb"]:.0f}KB total, '
            f'{mon["rss_growth_kb_per_min"]:.0f}KB/min, monotonic non-decreasing = {mon["rss_monotonic_nondecreasing"]}'
        )
        print(f'CPU: avg={mon["cpu_avg_pct"]:.1f}% max={mon["cpu_max_pct"]:.1f}% '
              f'(steady-state avg={mon["cpu_steady_avg_pct"]:.1f}% max={mon["cpu_steady_max_pct"]:.1f}%)')
    else:
        print("No monitor samples found.")

    if args.out:
        with open(args.out, "w") as f:
            json.dump(
                {"overall": overall_rows, "checkout_by_minute": checkout_by_minute, "monitor": mon},
                f,
                indent=2,
            )
        print(f"\nJSON summary written to {args.out}")


if __name__ == "__main__":
    main()
