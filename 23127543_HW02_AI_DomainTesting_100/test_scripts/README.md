# HW02 Domain Testing Evidence Scripts

These scripts help generate fresh API logs, HTML summaries, and UI screenshots for FR04, FR08, FR18, and FR20. They do not produce final report verdicts. Review the evidence manually before updating any feature report table.

For the full step-by-step runner guide, read [RUN_TESTS.md](RUN_TESTS.md).

## Prerequisites

Required:

- Node.js 18 or newer
- npm
- Backend running at `http://localhost:3000/api`
- Web frontend running at `http://localhost:5173`
- Admin frontend running at `http://localhost:5174`
- Optional: Expo for mobile manual tests

```bash
node -v
npm -v
```

## Start Backend

```bash
cd eshop-sut/backend
npm install
node database.js
node server.js
```

`node database.js` resets and reseeds the database. Use it only when you are ready to discard local runtime data.

## Start Web Frontend

```bash
cd eshop-sut/frontend-web
npm install
npm run dev
```

Default URL: `http://localhost:5173`

## Start Admin Frontend

```bash
cd eshop-sut/frontend-admin
npm install
npm run dev
```

Default URL: `http://localhost:5174`

## Install Test Dependencies

```bash
cd 23127543_HW02_AI_DomainTesting_100/test_scripts
npm install
npx playwright install
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

If this folder is nested under `software-testing`, run:

```bash
cd software-testing/23127543_HW02_AI_DomainTesting_100/test_scripts
```

## Run API Tests

```bash
npm run test:api:all
```

Individual runs:

```bash
npm run test:api:fr04
npm run test:api:fr08
npm run test:api:fr18
```

## Run UI Tests

```bash
npm run test:ui:all
```

Individual runs:

```bash
npm run test:ui:fr04
npm run test:ui:fr08
npm run test:ui:fr18
```

## Result Locations

```text
test_scripts/results/json/
test_scripts/results/html/
test_scripts/results/screenshots/
```

Screenshots use collision-safe names. Existing screenshots are not overwritten; a timestamp suffix is added when needed.

## How To Use Results As Evidence

1. Open the generated JSON file for the feature.
2. Inspect linked screenshots in `results/screenshots/`.
3. Manually copy confirmed Actual Result / Verdict into the feature report.
4. Link screenshot paths only after reviewing them.
5. Create GitHub Issues only for confirmed Fail cases.

Generated values named `verdictSuggestion` are suggestions only, not final report verdicts.

UI and mobile evidence requires human visual review. Do not mark final Pass/Fail in the feature Markdown files until you have checked the generated JSON logs and screenshots.

After this reset, report rows should remain `To be executed` until you rerun scripts or perform manual UI/mobile execution and review the new evidence.
