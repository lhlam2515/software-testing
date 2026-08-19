#!/usr/bin/env bash
# Test bed setup (ISTQB ch.2): brings the SUT database to a known, clean
# baseline, snapshots that baseline for teardown_testbed.sh to restore
# later, then loads the perf-test data volume on top of it.
#
# Run this BEFORE any k6 scenario. Run teardown_testbed.sh AFTER the last
# scenario of the session to hand the app back in its original state.
#
# Usage: ./setup_testbed.sh
# Requires: no backend process holding a lock on database.sqlite (stop the
# backend first if one is running against this worktree).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/../../../../apps/backend" && pwd)"
DB_PATH="$BACKEND_DIR/database.sqlite"
BASELINE_PATH="$BACKEND_DIR/database.sqlite.baseline"

if pgrep -f "node .*apps/backend/server.js" >/dev/null 2>&1; then
  echo "setup_testbed.sh: a backend process is running. Stop it first (this" >&2
  echo "script writes the db file directly and a live connection can corrupt" >&2
  echo "or silently lose the snapshot). Aborting." >&2
  exit 1
fi

rm -f "$DB_PATH" "$DB_PATH-wal" "$DB_PATH-shm"

echo "setup_testbed.sh: regenerating clean baseline (RESET_DB=1)..."
(cd "$BACKEND_DIR" && RESET_DB=1 node -e "require('./database'); setTimeout(() => process.exit(0), 500);")

cp "$DB_PATH" "$BASELINE_PATH"
echo "setup_testbed.sh: baseline snapshot saved to $BASELINE_PATH"

echo "setup_testbed.sh: loading perf test data (seed_perf.js)..."
node "$SCRIPT_DIR/seed_perf.js"

echo "setup_testbed.sh: test bed ready. Start the backend and run k6 scenarios."
echo "setup_testbed.sh: when done, run teardown_testbed.sh to restore the baseline."
