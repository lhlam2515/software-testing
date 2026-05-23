#!/bin/bash
# Khởi chạy backend + frontend-web + frontend-admin cùng lúc.
# Dừng tất cả: Ctrl+C
cd "$(dirname "$0")"
( cd backend && node server.js ) &
( cd frontend-web && npm run dev -- --host ) &
( cd frontend-admin && npm run dev -- --host ) &
wait
