#!/usr/bin/env bash
# run-demo.sh — reproduce the in-class performance demo end to end.
# Starts the mock eShop, runs the three tests, captures text + JSON, stops the mock.
#   bash demo/run-demo.sh
set -u
HERE="$(cd "$(dirname "$0")/.." && pwd)"   # repo root
OUT="$HERE/demo/out"; mkdir -p "$OUT"
BASE="${BASE_URL:-http://localhost:5000}"

echo "==> starting mock eShop"
node "$HERE/mock/server.js" & MOCK=$!
sleep 2
trap 'kill $MOCK 2>/dev/null' EXIT

run () { # name script
  echo; echo "===================================================="
  echo "  DEMO: $1"
  echo "===================================================="
  k6 run --out "json=$OUT/$1.json" -e BASE_URL="$BASE" "$HERE/demo/$2" 2>&1 | tee "$OUT/$1.txt"
}

run load       load.js         # expect PASS  (exit 0)
run breakpoint breakpoint.js   # expect BREACH (exit 99) — the knee + 503s
run spike      spike.js        # latency jumps, then recovers

echo; echo "==> done. Text + JSON in demo/out/. Build charts with: python3 demo/analyze.py"
