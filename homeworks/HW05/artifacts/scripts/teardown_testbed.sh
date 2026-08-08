#!/usr/bin/env bash
# Test bed teardown (ISTQB ch.2): restores the SUT database to the clean
# baseline snapshot taken by setup_testbed.sh, undoing every row the perf
# run added (products, users, orders, in-memory cart growth is cleared by
# the backend restart itself). Run this after the last k6 scenario of a
# session so the app is handed back in its original state.
#
# Usage: ./teardown_testbed.sh
# Requires: no backend process holding a lock on database.sqlite (stop the
# backend first).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/../../../../apps/backend" && pwd)"
DB_PATH="$BACKEND_DIR/database.sqlite"
BASELINE_PATH="$BACKEND_DIR/database.sqlite.baseline"

if pgrep -f "node .*apps/backend/server.js" >/dev/null 2>&1; then
  echo "teardown_testbed.sh: a backend process is running. Stop it first." >&2
  exit 1
fi

if [ ! -f "$BASELINE_PATH" ]; then
  echo "teardown_testbed.sh: no baseline snapshot at $BASELINE_PATH." >&2
  echo "teardown_testbed.sh: falling back to RESET_DB=1 regeneration (loses" >&2
  echo "any baseline customisation, but still restores a clean default state)." >&2
  rm -f "$DB_PATH" "$DB_PATH-wal" "$DB_PATH-shm"
  (cd "$BACKEND_DIR" && RESET_DB=1 node -e "require('./database'); setTimeout(() => process.exit(0), 500);")
  echo "teardown_testbed.sh: restored via RESET_DB=1."
  exit 0
fi

rm -f "$DB_PATH" "$DB_PATH-wal" "$DB_PATH-shm"
cp "$BASELINE_PATH" "$DB_PATH"
rm -f "$BASELINE_PATH"

echo "teardown_testbed.sh: database restored from baseline snapshot."
echo "teardown_testbed.sh: baseline snapshot file removed (next setup_testbed.sh regenerates it)."
