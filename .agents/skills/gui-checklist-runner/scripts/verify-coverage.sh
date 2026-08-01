#!/usr/bin/env bash
# Verify that every checklist item under a given IA-0x prefix in gui-checklist.md
# has a corresponding row with a real verdict (Passed|Failed|N/A) in a screen's
# checklist-run.md. Prints missing IDs and exits 1 if any are found.
#
# Usage:
#   verify-coverage.sh <gui-checklist.md> <checklist-run.md> <IA-prefix>
# Example:
#   verify-coverage.sh homeworks/HW03/group/gui-checklist.md \
#     homeworks/HW03/artifacts/screens/B1-home-event-list/checklist-run.md IA-01

set -euo pipefail

if [ "$#" -ne 3 ]; then
  echo "Usage: $0 <gui-checklist.md> <checklist-run.md> <IA-prefix>" >&2
  exit 2
fi

CHECKLIST="$1"
RUN="$2"
PREFIX="$3"

for f in "$CHECKLIST" "$RUN"; do
  if [ ! -f "$f" ]; then
    echo "ERROR: file not found: $f" >&2
    exit 2
  fi
done

# All item IDs defined for this cluster in the source checklist.
all_ids=$( { grep -oE "^\| ${PREFIX}-[0-9]+ " "$CHECKLIST" || true; } | tr -d '| ' | sort -u)

if [ -z "$all_ids" ]; then
  echo "ERROR: no items found for prefix '$PREFIX' in $CHECKLIST" >&2
  exit 2
fi

# IDs that already have a real verdict recorded in the run table.
run_ids=$( { grep -oE "^\| *${PREFIX}-[0-9]+ *\| *(Passed|Failed|N/A) *\|" "$RUN" || true; } \
  | awk -F'|' '{gsub(/ /,"",$2); print $2}' \
  | sort -u)

missing=$(comm -23 <(echo "$all_ids") <(echo "$run_ids") | sed '/^$/d')

if [ -z "$missing" ]; then
  total=$(echo "$all_ids" | wc -l)
  echo "OK: all $total item(s) with prefix '$PREFIX' are present in $RUN"
  exit 0
else
  echo "MISSING $PREFIX item(s) in $RUN:"
  echo "$missing"
  exit 1
fi
