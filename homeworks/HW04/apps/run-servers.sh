#!/bin/bash

# Start Backend + Frontend Web + Frontend Admin
# Stop everything with Ctrl+C

cd "$(dirname "$0")"

cleanup() {
    echo ""
    echo "Stopping all servers..."
    kill 0
}

trap cleanup SIGINT SIGTERM

(
    cd backend
    node server.js
) &

(
    cd frontend-web
    npm run dev -- --host
) &

(
    cd frontend-admin
    npm run dev -- --host
) &

wait