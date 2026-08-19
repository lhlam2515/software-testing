#!/usr/bin/env bash
# Samples RSS (KB) and %CPU of the backend process once per second,
# writing a CSV that is quantitative evidence *in addition to* the
# htop screenshot required by the assignment, not a replacement for it.
#
# Usage: ./monitor.sh <backend_pid> [output_csv]
# Stop with Ctrl+C or by killing this script; the CSV is flushed line by line.

set -euo pipefail

PID="${1:?usage: monitor.sh <backend_pid> [output_csv]}"
OUT="${2:-monitor_$(date +%Y%m%d_%H%M%S).csv}"

if ! kill -0 "$PID" 2>/dev/null; then
  echo "monitor.sh: no such process: $PID" >&2
  exit 1
fi

echo "timestamp,rss_kb,cpu_pct" > "$OUT"
echo "monitor.sh: sampling PID $PID every 1s -> $OUT (Ctrl+C to stop)"

while kill -0 "$PID" 2>/dev/null; do
  SAMPLE=$(ps -o rss=,pcpu= -p "$PID" 2>/dev/null || true)
  if [ -z "$SAMPLE" ]; then
    break
  fi
  RSS=$(echo "$SAMPLE" | awk '{print $1}')
  CPU=$(echo "$SAMPLE" | awk '{print $2}')
  TS=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)
  echo "${TS},${RSS},${CPU}" >> "$OUT"
  sleep 1
done

echo "monitor.sh: process $PID exited, stopped sampling. Output: $OUT"
