# EShop SUT — Course Test Target

The EShop is intentionally buggy for CS423/CSC13003 (FIT@HCMUS, 2026). Look for UI/UX, validation, security (SQL injection, XSS, authorization), and business logic defects.

## Running the app

```bash
bash apps/run-servers.sh   # start all services at once
```

| Service | URL | Notes |
|---------|-----|-------|
| Customer storefront | http://localhost:5173 | Vite + React |
| Admin panel | http://localhost:5174 | Login: admin@eshop.com / Admin123! |
| Backend API | http://localhost:3000 | Express + SQLite |

## Quick exploration

```bash
playwright-cli open http://localhost:5173
playwright-cli snapshot
```

## Testing workflow for this SUT

### Exploratory testing
1. `playwright-cli open <url>` — open the target page
2. `playwright-cli snapshot` — read page structure and element refs
3. Interact using snapshot refs (`playwright-cli click e5`, `playwright-cli fill e3 "value"`)
4. `playwright-cli snapshot` after each action — look for unexpected state changes
5. `playwright-cli console` / `playwright-cli requests` — check for JS errors or API anomalies
6. `playwright-cli screenshot --filename=bug-evidence.png` — capture defect evidence

### Form validation testing
1. Snapshot the page to identify form element refs
2. Try empty submit: `playwright-cli click <submit-ref>`
3. Try boundary/malicious inputs: `""`, `"-1"`, very long strings, `<script>alert(1)</script>`, `' OR 1=1 --`
4. Snapshot after each attempt to verify error messages

### Known intentional defects (reference)
- Login: password field is `type="text"` (plaintext visible), wrong heading "Đăng Ký" on login page
- Cart: add-to-cart button fires no API request; cart state not persisted
- Admin: revenue calculation doubled, `total_amount` always NULL, XSS in `shipping_address`
