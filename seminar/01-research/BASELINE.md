# BASELINE — Mutation Score & Coverage (EShop SUT)

> **PLACEHOLDER** — điền số đo thật ở Tuần 1–2 (gate 28/06 coverage, gate 05/07 mutation score).
> Nguồn lệnh: `stryker.config.mjs` (`mutate: ['server.js']`, `testRunner: 'jest'`, `coverageAnalysis: 'perTest'`).
> Owner: M1 (Lâm) chạy full run · M2 (Vũ) review. SUT: `apps/backend/server.js`.

---

## 1. Môi trường đo

| Field | Value |
|-------|-------|
| Ngày đo | _TODO YYYY-MM-DD_ |
| StrykerJS version | _TODO (vd 9.6.1)_ |
| Test runner | Jest + supertest |
| Node version | _TODO_ |
| Commit hash | _TODO `git rev-parse --short HEAD`_ |

## 2. Coverage baseline (gate 28/06)

> Đo bằng test runner trước khi chạy mutation. 4 route mục tiêu.

| Cụm | Route (FR) | Line % | Branch % |
|-----|-----------|--------|----------|
| A | `apply-coupon` (FR-09) | _TODO_ | _TODO_ |
| A | _(route 2)_ | _TODO_ | _TODO_ |
| B | `order-status` (FR-10) | _TODO_ | _TODO_ |
| B | `cart/checkout` (FR-08) | _TODO_ | _TODO_ |
| **Tổng** | | **_TODO_** | **_TODO_** |

## 3. Mutation score baseline (gate 05/07)

| File | Mutants total | Killed | Survived | Timeout | No-cov | **Mutation Score %** |
|------|--------------|--------|----------|---------|--------|----------------------|
| `server.js` | _TODO_ | _TODO_ | _TODO_ | _TODO_ | _TODO_ | **_TODO_** |

> **Insight cần ghi:** chênh lệch coverage cao vs mutation score thấp = bằng chứng "coverage lies" (luận điểm chính của seminar).

## 4. Survivor mutants đã phân tích (≥3)

| # | Mutant (operator) | Vị trí | Loại | Vì sao sống sót | AI assertion đề xuất |
|---|-------------------|--------|------|-----------------|----------------------|
| 1 | _TODO_ | `server.js:L__` | survivor / equivalent | _TODO_ | _TODO_ |
| 2 | _TODO_ | | | | |
| 3 | _TODO_ | | | | |

## 5. Failure modes ghi nhận (≥3)

1. _TODO — vd: test gọi đúng endpoint nhưng không assert response body._
2. _TODO_
3. _TODO_

## 6. Delta sau khi thêm AI assertion

| Metric | Trước | Sau | Δ |
|--------|-------|-----|---|
| Mutation score % | _TODO_ | _TODO_ | _TODO_ |
| Survivor count | _TODO_ | _TODO_ | _TODO_ |
