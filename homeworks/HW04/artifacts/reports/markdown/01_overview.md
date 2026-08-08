# 1. Scope & Oracle

| Item | Value |
| --- | --- |
| **SUT** | EShop (`apps/` monorepo) — storefront `:5173`, admin `:5174`, API `:3000` |
| **Features under test** | FR-02 Login & Account Lockout · FR-09 Discount Coupons · FR-16 CSV Import |
| **Test design source** | HW02 `domain-testing.md` + `bva.md` per feature, re-verified against `server.js` for HW04 |
| **Technique** | Domain Testing (Equivalence Partitioning) + Boundary Value Analysis, automated with Playwright |
| **Test type** | Data-driven, multi-browser (Chromium / Firefox / WebKit), one `test()` per case in `test-data/<FR>/cases.json` |
| **Oracle** | The **spec** (`docs/eshop-sut/srs.md`, `api_specification.md`) — NOT the SUT's current implementation. A discrepancy between spec and implementation is a bug, not a reason to change the expected value. |

## 1.1 Why a cross-browser matrix, not a single-column table

Each test case runs on 3 browsers. A case can pass on Chromium and fail on
WebKit for reasons unrelated to the feature under test (HTML5 validation
differences, number formatting, file input handling) — this is itself a
defect worth reporting, and HW02's manual, single-pass testing could not
surface it. §3–5 present results as **TC × browser** matrices instead of one
PASS/FAIL column, so any row with disagreeing cells is visible without
diffing 3 separate HTML reports by hand.

## 1.2 Report layers

| Layer | Purpose | Location |
| --- | --- | --- |
| 1. Playwright HTML report (native) | Deep-dive: trace, screenshot, timeline for one case | `html-reports/<FR>/<browser>/index.html` |
| 2. JSON reporter | Machine-readable input for layer 3 | `test-results/<FR>/<browser>/results.json` |
| 3. This PDF | Single-file, human-first view: summary + per-feature matrix + bug index | `pdf/HW04_Test_Report.pdf` |
