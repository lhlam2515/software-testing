# How to Run HW02 Test Scripts

These instructions explain how to run the helper scripts in `23127543_HW02_AI_DomainTesting_100/test_scripts/`. The scripts generate fresh JSON logs, HTML summaries, and screenshots only. Final Pass/Fail decisions must be reviewed manually before updating the feature Markdown reports.

## 1. Prerequisites

You need:

- Node.js 18 or newer
- npm
- Backend running
- Frontend Web running
- Admin Web running
- Optional: Expo for mobile manual tests

Check Node.js and npm:

```bash
node -v
npm -v
```

## 2. Start the Backend

Open a terminal from the homework workspace root.

PowerShell:

```powershell
cd eshop-sut/backend
npm install
node database.js
node server.js
```

Git Bash / WSL:

```bash
cd eshop-sut/backend
npm install
node database.js
node server.js
```

Expected backend URL:

```text
http://localhost:3000/api
```

Note: `node database.js` resets and reseeds the database. Run it only when you are ready to reset local runtime data.

## 3. Start the Web Frontend

Open a second terminal from the homework workspace root.

PowerShell:

```powershell
cd eshop-sut/frontend-web
npm install
npm run dev
```

Git Bash / WSL:

```bash
cd eshop-sut/frontend-web
npm install
npm run dev
```

Expected web URL:

```text
http://localhost:5173
```

## 4. Start the Admin Frontend

Open a third terminal from the homework workspace root.

PowerShell:

```powershell
cd eshop-sut/frontend-admin
npm install
npm run dev
```

Git Bash / WSL:

```bash
cd eshop-sut/frontend-admin
npm install
npm run dev
```

Expected admin URL:

```text
http://localhost:5174
```

## 5. Install Test Script Dependencies

Open a fourth terminal from the homework workspace root.

If the homework folder is nested under `software-testing`, use:

```bash
cd software-testing/23127543_HW02_AI_DomainTesting_100/test_scripts
```

If your workspace root is already the report parent folder, use:

```bash
cd 23127543_HW02_AI_DomainTesting_100/test_scripts
```

Install dependencies:

PowerShell:

```powershell
npm install
npx playwright install
Copy-Item .env.example .env
```

Git Bash / WSL:

```bash
npm install
npx playwright install
cp .env.example .env
```

## 6. Check Environment Settings

Open `.env` and confirm these defaults match your local ports:

```env
API_BASE_URL=http://localhost:3000/api
WEB_BASE_URL=http://localhost:5173
ADMIN_BASE_URL=http://localhost:5174

USER_EMAIL=test@eshop.com
USER_PASSWORD=Test1234!

ADMIN_EMAIL=admin@eshop.com
ADMIN_PASSWORD=Admin123!
```

The seeded coupons used by the API tests are:

```text
SAVE10
BIGBUY
VIP100
EXPIRED
```

## 7. Run API Evidence Scripts

Run all API scripts:

```bash
npm run test:api:all
```

Run one feature at a time:

```bash
npm run test:api:fr04
npm run test:api:fr08
npm run test:api:fr18
```

API scripts create JSON logs in:

```text
test_scripts/results/json/
test_scripts/results/html/
```

Example files:

```text
results/json/fr04_profile_api_results.json
results/json/fr08_checkout_api_results.json
results/json/fr18_admin_order_api_results.json
results/html/fr04_profile_api_results.html
results/html/fr08_checkout_api_results.html
results/html/fr18_admin_order_api_results.html
```

## 8. Run UI-Assisted Screenshot Scripts

Make sure backend, web frontend, and admin frontend are already running.

Run all UI-assisted scripts:

```bash
npm run test:ui:all
```

Run one feature at a time:

```bash
npm run test:ui:fr04
npm run test:ui:fr08
npm run test:ui:fr18
```

UI scripts create:

```text
test_scripts/results/screenshots/
test_scripts/results/json/
```

Screenshots are not overwritten. If a file name already exists, the helper adds a timestamp suffix.

## 9. Mobile Manual Tests

Mobile tests are manual. Use the plan in:

```text
test_scripts/mobile/fr20_mobile_manual_test_plan.md
```

Optional Expo setup:

```bash
cd eshop-sut/frontend-mobile
npm install
npx expo start
```

The mobile app has a hard-coded LAN API URL in source code. If the emulator or phone cannot reach the backend, review the mobile manual plan before testing.

## 10. Where Evidence Is Saved

Generated JSON result logs:

```text
23127543_HW02_AI_DomainTesting_100/test_scripts/results/json/
```

Generated UI screenshots:

```text
23127543_HW02_AI_DomainTesting_100/test_scripts/results/screenshots/
```

Reserved HTML output folder:

```text
23127543_HW02_AI_DomainTesting_100/test_scripts/results/html/
```

## 11. How to Use Generated Results as Evidence

1. Open the JSON file for the feature.
2. Find the row by `testCaseId`, for example `FR08-DT-08`.
3. Read `expected`, `actual`, `statusCode`, `verdictSuggestion`, and `notes`.
4. Open any screenshot referenced by `evidenceFile`.
5. Compare the evidence with the expected result in the feature Markdown file.
6. Manually update the feature report only after review.

Use links like this in feature Markdown files:

```md
[FR08-BVA-13-ui-after-checkout-cart.png](../test_scripts/results/screenshots/FR08-BVA-13-ui-after-checkout-cart.png)
```

If the generated screenshot has a timestamp suffix, link the exact file name.

## 12. Manual Review Rule

The scripts intentionally use `verdictSuggestion`, not a final `Verdict`.

- API evidence can suggest likely Pass/Fail, but you must still review it.
- UI screenshots require human visual judgment.
- Mobile behavior must be verified manually on Expo/emulator/device.
- Do not copy script output directly into the final report without checking it.

Use final report values only after review:

- `Pass`: evidence confirms expected behavior
- `Fail`: evidence confirms incorrect behavior
- `Needs Review`: evidence is incomplete or ambiguous
- `Not Executed`: test was not run

## 13. Troubleshooting

If API scripts fail with connection errors:

- Confirm backend is running on `http://localhost:3000`.
- Confirm `.env` has the correct `API_BASE_URL`.
- Confirm the database has seeded users.

If UI scripts fail to open pages:

- Confirm web frontend is running on `http://localhost:5173`.
- Confirm admin frontend is running on `http://localhost:5174`.
- Run `npx playwright install` again if browser binaries are missing.

If login fails:

- Confirm the database was seeded.
- Use `test@eshop.com / Test1234!` for regular user tests.
- Use `admin@eshop.com / Admin123!` for admin tests.
