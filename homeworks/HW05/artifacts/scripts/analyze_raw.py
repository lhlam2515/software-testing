#!/usr/bin/env python3
"""
analyze_raw.py — recompute p50/p90/p95/p99 per (load stage, step) directly
from k6's raw --out csv= log for the Stress scenario (23127216_Stress_*.js),
to pin the breaking point to a specific VU stage.

Deliberately does NOT read any percentile out of k6's own end-of-run
summary (handleSummary/console). Every number below is recomputed from
individual http_req_duration samples in the raw CSV — see HW05
prompt_log.md P-4 and README.md "Stress: percentiles recomputed from the
raw rows rather than read off a summary".

Algorithm follows ref/Demo/demo/analyze.py's bucket-by-elapsed-time
approach (own numpy-free percentile function here, since the raw source is
a CSV of individual samples, not a JSON stream of pre-aggregated points).

Usage:
    python3 analyze_raw.py <raw_stress.csv> [--out summary.json]

Stage boundaries mirror the exact `stages` array in
23127216_Stress_<date>.js (prompt_log.md Entry 003) — keep the two in sync
if the Stress options ever change.
"""

import argparse
import csv
import json

STAGES = [
    {"name": "stage1_baseline_0-40VU", "target_vu": 40, "start": 0, "end": 80},
    {"name": "stage2_approach_40-120VU", "target_vu": 120, "start": 80, "end": 190},
    {"name": "stage3_break_120-220VU", "target_vu": 220, "start": 190, "end": 300},
    {"name": "stage4_confirm_220-350VU", "target_vu": 350, "start": 300, "end": 410},
    {"name": "stage5_rampdown_350-0VU", "target_vu": 0, "start": 410, "end": 430},
]
STEPS = ["login", "search", "cart", "checkout"]

# checkout is the write path most exposed to SQLite's single-writer
# serialization (prompt_log Entry 003 calibration: p95 289ms@20VU ->
# 781ms@60VU -> 2.16s@150VU on a zero-think isolated checkout probe), so it
# is the primary signal for where the breaking point actually lands.
BREAKING_STEP = "checkout"
BREAKING_P95_MS = (
    1000.0  # between the observed 60VU (781ms) and 150VU (2.16s) calibration points
)


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


def stage_for(elapsed_s):
    for stage in STAGES:
        if stage["start"] <= elapsed_s < stage["end"]:
            return stage["name"]
    return None


def extract_step(row):
    """k6's CSV output has no top-level `step` column — the tag set with
    `tags: { step: ... }` in config.js lands in `extra_tags` as a raw
    "step=<value>" string instead (verified against a real run's header:
    metric_name,timestamp,...,extra_tags,metadata — no `step` column at
    all). Parse it out of there."""
    for pair in (row.get("extra_tags") or "").split(";"):
        if pair.startswith("step="):
            return pair[len("step="):]
    return "other"


def load_samples(csv_path):
    """Bucket raw http_req_duration / http_req_failed rows by (stage, step)."""
    with open(csv_path, newline="") as f:
        rows = list(csv.DictReader(f))

    durations = [
        float(r["timestamp"])
        for r in rows
        if r.get("metric_name") == "http_req_duration"
    ]
    if not durations:
        raise SystemExit(
            f"No http_req_duration samples found in {csv_path} — wrong file or empty run?"
        )
    t0 = min(durations)

    duration_buckets = {}  # (stage, step) -> [duration_ms, ...]
    fail_buckets = {}  # (stage, step) -> [n_fail, n_total]

    for r in rows:
        step = extract_step(r)
        if step not in STEPS:
            continue
        elapsed = float(r["timestamp"]) - t0
        stage = stage_for(elapsed)
        if stage is None:
            continue
        key = (stage, step)

        metric = r.get("metric_name")
        if metric == "http_req_duration":
            duration_buckets.setdefault(key, []).append(float(r["metric_value"]))
        elif metric == "http_req_failed":
            counts = fail_buckets.setdefault(key, [0, 0])
            counts[1] += 1
            if float(r["metric_value"]) >= 1:
                counts[0] += 1

    return duration_buckets, fail_buckets


def summarize(duration_buckets, fail_buckets):
    rows = []
    for stage in STAGES:
        for step in STEPS:
            key = (stage["name"], step)
            values = sorted(duration_buckets.get(key, []))
            fails, total = fail_buckets.get(key, [0, 0])
            rows.append(
                {
                    "stage": stage["name"],
                    "target_vu": stage["target_vu"],
                    "step": step,
                    "count": len(values),
                    "error_rate": (fails / total) if total else 0.0,
                    "p50_ms": percentile(values, 50),
                    "p90_ms": percentile(values, 90),
                    "p95_ms": percentile(values, 95),
                    "p99_ms": percentile(values, 99),
                    "max_ms": values[-1] if values else None,
                }
            )
    return rows


def detect_breaking_point(rows):
    """First non-rampdown stage where BREAKING_STEP's p95 crosses the threshold."""
    for r in rows:
        if r["step"] != BREAKING_STEP or r["stage"] == "stage5_rampdown_350-0VU":
            continue
        if r["p95_ms"] is not None and r["p95_ms"] > BREAKING_P95_MS:
            return r
    return None


def fmt(v):
    return f"{v:.0f}" if v is not None else "-"


def print_table(rows):
    header = f"{'stage':<26}{'VU':>5}  {'step':<10}{'count':>8}{'err%':>8}{'p50':>9}{'p90':>9}{'p95':>9}{'p99':>9}{'max':>9}"
    print(header)
    print("-" * len(header))
    for r in rows:
        print(
            f"{r['stage']:<26}{r['target_vu']:>5}  {r['step']:<10}{r['count']:>8}"
            f"{100 * r['error_rate']:>7.2f}%{fmt(r['p50_ms']):>9}{fmt(r['p90_ms']):>9}"
            f"{fmt(r['p95_ms']):>9}{fmt(r['p99_ms']):>9}{fmt(r['max_ms']):>9}"
        )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "csv_path", help="raw --out csv= log from the Stress run (e.g. raw_stress.csv)"
    )
    parser.add_argument(
        "--out", default=None, help="also write the summary as JSON to this path"
    )
    args = parser.parse_args()

    duration_buckets, fail_buckets = load_samples(args.csv_path)
    rows = summarize(duration_buckets, fail_buckets)
    print_table(rows)

    breaking = detect_breaking_point(rows)
    print()
    if breaking:
        print(
            f"Breaking point: {breaking['stage']} (~{breaking['target_vu']} VU) — "
            f"{BREAKING_STEP} p95 = {fmt(breaking['p95_ms'])}ms > {BREAKING_P95_MS:.0f}ms threshold"
        )
    else:
        print(
            f"No stage crossed the {BREAKING_P95_MS:.0f}ms p95 threshold on '{BREAKING_STEP}' "
            "— breaking point not reached in this run (re-check calibration bounds or run longer)."
        )

    if args.out:
        with open(args.out, "w") as f:
            json.dump({"rows": rows, "breaking_point": breaking}, f, indent=2)
        print(f"\nJSON summary written to {args.out}")


if __name__ == "__main__":
    main()
