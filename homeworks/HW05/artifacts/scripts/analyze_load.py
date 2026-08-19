#!/usr/bin/env python3
"""
analyze_load.py — recompute overall per-step stats directly from the raw
--out csv= log for the Load scenario (23127216_Load_*.js), for REPORT.md
5.1 (AI Audit Report) baseline numbers.

Unlike analyze_raw.py (Stress, bucketed by VU stage) and analyze_soak.py
(Soak, bucketed by elapsed minute), Load has no VU-stage ramp and no
degradation-over-time question to answer — it is the steady, healthy
baseline scenario, so there is nothing to bucket by. This script simply
recomputes count/error_rate/p50/p90/p95/p99/max/rps per step over the
whole run, the same numbers analyze_raw.py's stage1_baseline row and
analyze_soak.py's "overall" block already give for their own scenarios,
so Load has a directly comparable baseline artifact instead of being read
off k6's own console summary.

Deliberately does NOT read any percentile out of k6's end-of-run summary
or ts_load.json — every number is recomputed from individual
http_req_duration / http_req_failed samples in raw_load.csv, same
convention as analyze_raw.py and analyze_soak.py (see their docstrings).

Usage:
    python3 analyze_load.py <raw_load.csv> [--out summary.json]
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
    """k6's CSV output has no top-level `step` column — the tag set with
    `tags: { step: ... }` in config.js lands in `extra_tags` as a raw
    "step=<value>" string instead, same layout verified for Stress/Soak
    in analyze_raw.py / analyze_soak.py. Parse it out of there."""
    for pair in (row.get("extra_tags") or "").split(";"):
        if pair.startswith("step="):
            return pair[len("step="):]
    return "other"


def load_samples(csv_path):
    """Single pass over the raw log: per-step durations + pass/fail counts,
    plus the run's elapsed span (for rps)."""
    durations = {s: [] for s in STEPS}
    fail = {s: [0, 0] for s in STEPS}
    t_min = None
    t_max = None

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
            if t_min is None or ts < t_min:
                t_min = ts
            if t_max is None or ts > t_max:
                t_max = ts
            value = float(r["metric_value"])

            if metric == "http_req_duration":
                durations[step].append(value)
            else:  # http_req_failed
                fail[step][1] += 1
                if value >= 1:
                    fail[step][0] += 1

    if t_min is None:
        raise SystemExit(
            f"No http_req_duration/http_req_failed samples found in {csv_path} — wrong file or empty run?"
        )

    return durations, fail, t_max - t_min


def summarize(durations, fail, run_seconds):
    rows = []
    for step in STEPS:
        values = sorted(durations[step])
        fails, total = fail[step]
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


def fmt(v):
    return f"{v:.1f}" if isinstance(v, float) else ("-" if v is None else str(v))


def print_table(rows, run_seconds):
    print(f"=== Overall per-step stats (whole Load run, {run_seconds:.0f}s span) ===")
    header = f'{"step":<10}{"count":>8}{"err%":>8}{"rps":>8}{"p50":>9}{"p90":>9}{"p95":>9}{"p99":>9}{"max":>9}'
    print(header)
    print("-" * len(header))
    for r in rows:
        print(
            f'{r["step"]:<10}{r["count"]:>8}{100*r["error_rate"]:>7.2f}%{fmt(r["rps"]):>8}'
            f'{fmt(r["p50_ms"]):>9}{fmt(r["p90_ms"]):>9}{fmt(r["p95_ms"]):>9}{fmt(r["p99_ms"]):>9}{fmt(r["max_ms"]):>9}'
        )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_path", help="raw --out csv= log from the Load run (raw_load.csv)")
    parser.add_argument("--out", default=None, help="also write the summary as JSON to this path")
    args = parser.parse_args()

    durations, fail, run_seconds = load_samples(args.csv_path)
    rows = summarize(durations, fail, run_seconds)
    print_table(rows, run_seconds)

    if args.out:
        with open(args.out, "w") as f:
            json.dump({"overall": rows, "run_seconds": run_seconds}, f, indent=2)
        print(f"\nJSON summary written to {args.out}")


if __name__ == "__main__":
    main()
