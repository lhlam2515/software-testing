# FR20 Mobile Manual Test Plan

FR20 should be tested manually with Expo/emulator screenshots. API-level risks can be cross-checked with the API scripts, but final mobile behavior requires a human reviewer.

## Start Backend

```bash
cd eshop-sut/backend
npm install
node database.js
node server.js
```

The backend listens on `http://localhost:3000/api`.

## Check Mobile API URL

The mobile app currently uses a hard-coded LAN URL in `frontend-mobile/App.js`:

```text
http://192.168.10.13:3000/api
```

If the phone/emulator cannot connect:

1. Find the computer LAN IP.
2. Confirm the phone/emulator is on the same network.
3. Update/check `API_URL` in the mobile app for local testing.
4. For Android emulator, `http://10.0.2.2:3000/api` may be needed.
5. Restart Expo after changing the URL.

Do not change source code for this homework evidence workflow unless your instructor allows it. If you must change it locally to test, document the change in your notes.

## Run Expo

```bash
cd eshop-sut/frontend-mobile
npm install
npx expo start
```

Open the app in an emulator or Expo Go.

## Seeded Accounts And Coupons

- User: `test@eshop.com` / `Test1234!`
- Admin: `admin@eshop.com` / `Admin123!`
- Coupons: `SAVE10`, `BIGBUY`, `VIP100`, `EXPIRED`

## FR20 Domain Test Cases

| Test Case | Manual Steps | Evidence To Capture |
| --- | --- | --- |
| FR20-DT-01 | Log in, add one product, open Cart, Checkout, Confirm. | Cart before checkout, checkout screen, success screen, cart after success. |
| FR20-DT-02 | Add item while logged out, tap checkout. | Alert/login screen after checkout attempt. |
| FR20-DT-03 | Log in with empty cart, open Cart. | Empty cart screen with no checkout action. |
| FR20-DT-04 | Add one item qty 1, open Checkout. | Checkout item list and total. |
| FR20-DT-05 | Add two or more items, open Checkout. | Checkout item list and total. |
| FR20-DT-06 | With two or more items, confirm checkout and inspect request with proxy/logs if available. | Request evidence or note that proxy inspection was not available. |
| FR20-DT-07 | Use API/proxy to send manipulated `total_amount=1`. | API response and mobile behavior if replayed through app flow. |
| FR20-DT-08 | Apply `SAVE10` or `VIP100`, then confirm checkout. | Coupon result, final amount, success, optional coupon usage evidence. |
| FR20-DT-09 | Apply `EXPIRED`, a nonexistent code, and below-minimum total. | Error messages and unchanged final amount. |
| FR20-DT-10 | Stop backend or use an unreachable API URL, then attempt checkout. | Error alert and cart state after failure. |
| FR20-DT-11 | Complete checkout, return to Cart and Profile/order history. | Empty cart and refreshed orders. |
| FR20-DT-12 | Try quantity `0`, text, `1`, and `2` in cart/product screens. | Quantity behavior and total calculation. |

## FR20 Boundary Cases

| Test Case | Manual Steps | Evidence To Capture |
| --- | --- | --- |
| FR20-BVA-01 | Cart length 0. | Empty cart screenshot. |
| FR20-BVA-02 | Cart length 1. | Checkout screen with one item. |
| FR20-BVA-03 | Cart length 2. | Checkout screen and request/payload note if available. |
| FR20-BVA-04 | Quantity 0, 1, 2. | Screenshots for each quantity and total. |
| FR20-BVA-05 | `SAVE10` at 299999, 300000, 300001 using API/proxy or equivalent app totals. | Coupon responses and final amount. |
| FR20-BVA-06 | Total around actual sum using API/proxy: 29999999, 30000000, 30000001. | API responses and notes. |

## Capturing Screenshots

- Android emulator: use the emulator screenshot button or `adb exec-out screencap`.
- iOS simulator: use the simulator screenshot command.
- Physical phone: use the device screenshot shortcut.

Save reviewed screenshots under the report evidence folder and link them manually from the FR20 report table.

## Updating The Report

After testing, manually update:

- Actual Result
- Verdict
- Evidence link
- Bug report or GitHub Issue link for confirmed failures

Do not paste raw script/API output as the final result without human review.
