#!/usr/bin/env bash
# tmux_perf_session.sh — 2-window tmux session for a k6 scenario run
# (Stress / Spike; Load already ran manually).
#
#   window "server" — runs the backend fresh (kills whatever is bound to
#                      port 3000 first, so in-memory userCarts is cleared
#                      per the run procedure, then `exec node server.js`)
#   window "k6"      — 3 panes: k6 (left), htop -p <backend_pid> (top-right),
#                      monitor.sh sampling the same PID (bottom-right)
#
# PID discovery does NOT use `pgrep -f` against the command line — a
# backend started as `cd apps/backend && node server.js` has cmdline
# "node server.js" only (no "apps/backend" substring; that's the cwd, not
# argv), so a pattern like "node .*apps/backend/server.js" never matches
# it. Instead: the "server" pane runs `exec node server.js`, which
# replaces the pane's shell with node while KEEPING THE SAME PID, so
# `tmux list-panes -F '#{pane_pid}'` gives the exact node PID with no
# regex guessing. The pre-run "kill stray backend" check uses `fuser
# 3000/tcp` for the same reason: it asks "what's bound to the port",
# not "what does some process's argv look like".
#
# The k6 command is staged in its pane but NOT submitted, so you can
# start OBS first and press Enter yourself when ready.
#
# Usage:
#   ./tmux_perf_session.sh stress
#   ./tmux_perf_session.sh spike
#   ./tmux_perf_session.sh soak
#
# Re-running with the same scenario while its session is still alive just
# attaches to it (nothing is torn down or restarted).

set -euo pipefail

SCENARIO="${1:-}"
if [[ -z "$SCENARIO" ]]; then
  echo "usage: $0 <stress|spike|soak>" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HW05_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/../../../../apps/backend" && pwd)"
BACKEND_PORT=3000

case "$SCENARIO" in
  stress)
    PLAN="artifacts/test-plans/23127216_Stress_20260817.js"
    K6_CMD="k6 run --out csv=artifacts/results/raw/raw_stress.csv --out json=artifacts/results/raw/ts_stress.json $PLAN"
    ;;
  spike)
    PLAN="artifacts/test-plans/23127216_Spike_20260817.js"
    K6_CMD="k6 run --out csv=artifacts/results/raw/raw_spike.csv --out json=artifacts/results/raw/ts_spike.json $PLAN"
    ;;
  soak)
    # No --out json= here — see 23127216_Soak_20260817.js header comment
    # (a 10-minute run's per-datapoint JSON stream would land in the
    # hundreds of MB, well past GitHub's 100MB hard push limit).
    PLAN="artifacts/test-plans/23127216_Soak_20260817.js"
    K6_CMD="k6 run --out csv=artifacts/results/raw/raw_soak.csv $PLAN"
    ;;
  *)
    echo "unknown scenario '$SCENARIO' (expected: stress | spike | soak)" >&2
    exit 1
    ;;
esac

SESSION="hw05-${SCENARIO}"

if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "tmux session '$SESSION' already exists — attaching, nothing re-created." >&2
  exec tmux attach -t "$SESSION"
fi

if fuser "${BACKEND_PORT}/tcp" >/dev/null 2>&1; then
  echo "stopping whatever is listening on port ${BACKEND_PORT} (clears in-memory cart state)..."
  fuser -k "${BACKEND_PORT}/tcp" >/dev/null 2>&1 || true
  sleep 1
fi

echo "resetting lockout state..."
node "$SCRIPT_DIR/reset_lockout.js"

# --- window 0: server ---
tmux new-session -d -s "$SESSION" -n server -c "$BACKEND_DIR"
tmux set-window-option -t "$SESSION:server" remain-on-exit on

# pane_pid is stable across exec (exec replaces the process image, not the
# PID), so this is already the future node PID before node even starts.
BACKEND_PID="$(tmux list-panes -t "$SESSION:server" -F '#{pane_pid}')"
tmux send-keys -t "$SESSION:server" "exec node server.js" C-m

echo -n "waiting for backend to listen on port ${BACKEND_PORT}"
UP=""
for _ in $(seq 1 20); do
  if (exec 3<>"/dev/tcp/127.0.0.1/${BACKEND_PORT}") 2>/dev/null; then
    exec 3<&- 3>&-
    UP=1
    break
  fi
  echo -n "."
  sleep 0.5
done
echo
if [[ -z "$UP" ]]; then
  echo "backend did not come up in time — check the 'server' window manually" >&2
  echo "(PID is still $BACKEND_PID if the process exists at all)." >&2
else
  echo "backend PID: $BACKEND_PID (confirmed listening on ${BACKEND_PORT})"
fi

# --- window 1: k6 (left) | htop (top-right) | monitor.sh (bottom-right) ---
tmux new-window -t "$SESSION" -n k6 -c "$HW05_DIR"
tmux split-window -h -t "$SESSION:k6" -c "$HW05_DIR"
tmux split-window -v -t "$SESSION:k6.2" -c "$HW05_DIR"
tmux select-layout -t "$SESSION:k6" main-vertical
tmux resize-pane -t "$SESSION:k6.1" -x 55%

tmux send-keys -t "$SESSION:k6.2" "htop -p $BACKEND_PID" C-m
tmux send-keys -t "$SESSION:k6.3" \
  "bash artifacts/scripts/monitor.sh $BACKEND_PID artifacts/results/raw/monitor_${SCENARIO}.csv" C-m

# staged, not submitted — start OBS, then press Enter in this pane yourself
tmux send-keys -t "$SESSION:k6.1" "$K6_CMD"

tmux select-window -t "$SESSION:k6"
tmux attach -t "$SESSION"
