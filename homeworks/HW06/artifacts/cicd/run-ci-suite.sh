#!/usr/bin/env bash
# Run one FR's CI regression subset against a freshly seeded local SUT.
#
# Same entry point locally and in GitHub Actions, so a green pipeline can be
# reproduced on a developer machine with one command.
#
# Usage: STUDENT_ID=23127216 ./run-ci-suite.sh fr-02-login
set -euo pipefail

FR="${1:?usage: run-ci-suite.sh <fr-02-login|fr-08-checkout|fr-15-product-crud>}"
STUDENT_ID="${STUDENT_ID:?STUDENT_ID must be set}"

CICD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HW06="$(cd "$CICD_DIR/../.." && pwd)"
REPO="$(cd "$HW06/../.." && pwd)"
PKG="$HW06/artifacts/postman/$FR"
OUT="${NEWMAN_OUT:-$CICD_DIR/runs/$FR}"

# 127.0.0.1, not localhost: localhost intermittently fails to resolve on the
# Actions runner ("Invalid IP address: undefined") — found during the T3 spike.
BASE_URL="http://127.0.0.1:3000"

mkdir -p "$OUT"

echo "==> Rebuilding the CI iteration data from the audited suite"
node "$CICD_DIR/build-ci-data.mjs" --fr "$FR"

echo "==> Starting the SUT on a freshly seeded database"
# A leftover backend from an earlier local run keeps port 3000 and an open
# handle on the deleted database file, which makes every write fail with
# SQLITE_READONLY. Clear it before deleting the database.
if command -v fuser > /dev/null; then fuser -k 3000/tcp 2> /dev/null || true; sleep 1; fi
rm -f "$REPO/apps/backend/database.sqlite"
( cd "$REPO/apps/backend" && RESET_DB=1 node server.js > "$OUT/sut.log" 2>&1 & echo $! > "$OUT/sut.pid" )
SUT_PID="$(cat "$OUT/sut.pid")"
trap 'kill "$SUT_PID" 2>/dev/null || true' EXIT
npx --yes wait-on "$BASE_URL/api/products" --timeout 60000
kill -0 "$SUT_PID" 2> /dev/null || { echo "SUT exited during startup:"; cat "$OUT/sut.log"; exit 1; }

echo "==> Running Newman: $FR"
# FR-02 rows deliberately wait out the account-lockout window, so the request
# and script timeouts are raised well above Newman's 5s default.
npx --yes --package newman --package newman-reporter-htmlextra -- newman run \
  "$PKG/collection.postman_collection.json" \
  -e "$PKG/environment.postman_environment.json" \
  -d "$PKG/ci-data.csv" \
  --env-var "studentId=$STUDENT_ID" \
  --env-var "baseUrl=$BASE_URL" \
  --timeout-request 60000 \
  --timeout-script 60000 \
  --reporters cli,json,htmlextra \
  --reporter-json-export "$OUT/newman-report.json" \
  --reporter-htmlextra-export "$OUT/newman-report.html"
