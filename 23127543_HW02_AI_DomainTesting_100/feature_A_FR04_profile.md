# FR-04 - Personal Profile Management

## 1. Feature Overview

FR-04 allows a logged-in user to view and update their personal profile on the web application: full name, phone number, and default shipping address. The actual implementation uses `GET /api/users/me` and `PUT /api/users/me`, both requiring a JWT in `Authorization: Bearer <token>`.

## 2. Requirement Summary

According to the requirement, a user may update only their own profile. Email must not be editable through the UI. A valid phone number must start with `0` and contain 10-11 digits. A user must not be able to change their own `role`. In the actual code, the web UI validates phone numbers with `^[1-9][0-9]{8,9}$`, which accepts 9-10 digits that do not start with `0`. The backend does not validate phone/email, and `PUT /api/users/me` updates `role` if the client sends it.

## 3. Domain Testing

### 3.1 Input Variables / Conditions

| Variable / Condition | Description | Valid Domain | Invalid Domain |
|---|---|---|---|
| Login token | Access permission for `/api/users/me` | Valid JWT for the current user | No token, invalid/expired token |
| Full name | `name` field on web form/API | Non-empty string according to HTML `required` | Empty, whitespace-only, too long |
| Phone number | `phone` field | SRS: starts with `0`, 10-11 digits | Does not start with `0`, fewer than 10 or more than 11 digits, contains letters/special characters |
| Shipping address | Backend field is `shipping_address` | Valid address text, safely displayed HTML | Rendered script/HTML, too long, wrong field name |
| Email | Login identifier | Displayed as disabled in UI, not sent in update | Client manually sends a new `email` through API |
| Role | User permission | Must not be sent or changed from profile | Client sends `role: "admin"` |
| Profile ownership | Object being updated | `/api/users/me` updates only the token owner | Payload includes another user's `id` to attempt privilege bypass |

### 3.2 Domain Testing Explanation

1. Identify input variables and business conditions: token, name, phone, address, email, role, and profile ownership.
2. Divide each variable into valid and invalid domains based on the SRS and actual implementation.
3. Select representative values: SRS-valid phone numbers, UI-valid/UI-invalid phone numbers, and payloads containing sensitive fields.
4. Combine valid and invalid domains into positive and negative test cases.
5. Add API, security, and UI cases because backend and frontend differ in phone validation and address field naming.
6. Review coverage against code: web sends `shipping_address`, mobile sends `shippingAddress`, and backend accepts `role` when present in the request body.

### 3.3 Domain Testing Test Cases

> Execution reset note: Previous screenshot evidence was removed. Current results are reset to `To be executed`. API tests can generate JSON/HTML evidence under `test_scripts/results/`, while UI and mobile behavior require manual review before final verdicts are written.


| TC ID | Technique | Domain Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
|FR04-DT-01 | Domain Testing | Valid profile update according to SRS | User `test@eshop.com` is logged in | `name=Nguyen Van A`, `phone=0912345678`, `shipping_address=1 Le Loi` | Open Profile, enter data, click Update | According to SRS, a 10-digit phone starting with `0` is accepted and profile is saved | UI displayed an invalid phone alert for `0912345678`, so the SRS-valid profile update was blocked. | Fail | [FR04-DT-01 screenshot](evidence/screenshots/FR04-DT-01.png)|
|FR04-DT-02 | Domain Testing | Empty full name | User is logged in | `name=""`, valid phone/address | Clear the full name field and submit | Browser/app blocks submission because name is required | Browser required-field validation blocked submission for the empty name field. | Pass | [FR04-DT-02 screenshot](evidence/screenshots/FR04-DT-02.png)|
|FR04-DT-03 | Domain Testing | 10-digit phone starting with 0 | User is logged in | `phone=0912345678` | Update phone | Accepted according to SRS | UI displayed an invalid phone alert for the SRS-valid 10-digit phone number `0912345678`. | Fail | [FR04-DT-03 screenshot](evidence/screenshots/FR04-DT-03.png)|
|FR04-DT-04 | Domain Testing | 11-digit phone starting with 0 | User is logged in | `phone=09123456789` | Update phone | Accepted according to SRS | UI displayed an invalid phone alert for the SRS-valid 11-digit phone number `09123456789`. | Fail | [FR04-DT-04 screenshot](evidence/screenshots/FR04-DT-04.png)|
|FR04-DT-05 | Domain Testing | Phone does not start with 0 | User is logged in | `phone=9123456789` | Update phone | Rejected according to SRS | UI displayed an update-success alert for `9123456789`, even though the phone does not start with `0`. | Fail | [FR04-DT-05 screenshot](evidence/screenshots/FR04-DT-05.png)|
|FR04-DT-06 | Domain Testing | Phone contains letters/special characters | User is logged in | `phone=09A234567!` | Update phone | Rejected and not saved | UI displayed an invalid phone alert for `09A234567!`, so the invalid phone was blocked. | Pass | [FR04-DT-06 screenshot](evidence/screenshots/FR04-DT-06.png)|
| FR04-DT-07 | Domain Testing | Attempt to change email through API | User is logged in and has token | Body: `{"name":"A","phone":"9123456789","shipping_address":"X","email":"attacker@eshop.com"}` | Send `PUT /api/users/me`, then call `GET /api/users/me` | Email remains unchanged; API ignores or rejects `email` | API returned HTTP 403 Forbidden when the update payload included an email field; follow-up profile checks also returned Forbidden. | Fail | Result log available in test_scripts/results/ |
| FR04-DT-08 | Domain Testing | Attempt role escalation with `role` | Regular user is logged in | Body includes `role:"admin"` | Send `PUT /api/users/me`, then call `GET /api/users/me` or an admin API | Role must not change; API ignores or rejects `role` | API returned HTTP 403 Forbidden when the update payload included role escalation data. | Pass | Result log available in test_scripts/results/ |
| FR04-DT-09 | Domain Testing | Attempt to update another user | User A and User B exist | User A token, payload includes User B id | Send `PUT /api/users/me` with User B id, then check both users | Only User A from token is affected; User B remains unchanged | API returned HTTP 403 Forbidden for the profile ownership payload; follow-up checks also returned Forbidden and require review. | Needs Review | Result log available in test_scripts/results/ |
| FR04-DT-10 | Domain Testing | Address contains HTML/script | User is logged in | `shipping_address=<script>alert(1)</script>` | Save address, reopen Profile/Checkout/Admin order if order exists | String is escaped and script does not execute | API returned HTTP 403 Forbidden for the HTML/script address payload; UI rendering still requires manual review. | Needs Review | Result log available in test_scripts/results/ |
| FR04-DT-11 | Domain Testing | No token | User is not logged in | Valid profile body | Send `PUT /api/users/me` without Authorization header | Returns `401 Unauthorized`, no data saved | API returned HTTP 401 Unauthorized, so unauthenticated access was blocked. | Pass | Result log available in test_scripts/results/ |
| FR04-DT-12 | Domain Testing | Very long address | User is logged in | Address length 500-1000 characters | Save address and reopen UI | System handles it stably or shows a clear limit | API returned HTTP 403 Forbidden for the long-address update; stored-data behavior requires review. | Needs Review | Result log available in test_scripts/results/ |

## 4. Boundary Value Analysis

### 4.1 Boundary Variables

| Variable | Boundary Rule | Below Boundary | On Boundary | Above Boundary |
|---|---|---:|---:|---:|
| Minimum phone length | SRS valid from 10 digits | 9 | 10 | 11 |
| Maximum phone length | SRS valid up to 11 digits | 10 | 11 | 12 |
| First phone character | SRS requires starting with `0` | `9` | `0` | `00` |
| Name length | Web form has `required` | 0 | 1 | 2+ |
| Address length | No clear code limit | 0 | 1 | 500+ |
| Sensitive fields count | `email`/`role` must not be updated | 0 | 1 | 2 |

### 4.2 BVA Explanation

1. Identify boundary variables: phone length, first phone character, name/address length, and number of sensitive fields in the payload.
2. Select below, on, and above boundary values: 9/10/11/12 digits, empty/1-character name, empty/very long address.
3. Create tests around these values to distinguish SRS behavior from implementation behavior.
4. Include both valid and invalid boundaries.
5. Review against code: current UI phone boundary differs from SRS; backend has no phone validation.

### 4.3 Boundary Value Analysis Test Cases

> Execution reset note: Previous screenshot evidence was removed. Current results are reset to `To be executed`. API tests can generate JSON/HTML evidence under `test_scripts/results/`, while UI and mobile behavior require manual review before final verdicts are written.


| TC ID | Technique | Domain Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR04-BVA-01 | Boundary Value Analysis | Phone below 10-digit minimum | User is logged in | `phone=012345678` | Update profile | Rejected | API returned HTTP 403 Forbidden for this profile boundary update; the result requires review against the expected boundary behavior. | Needs Review | Result log available in test_scripts/results/ |
| FR04-BVA-02 | Boundary Value Analysis | Phone at 10-digit minimum | User is logged in | `phone=0123456789` | Update profile | Accepted according to SRS | API returned HTTP 403 Forbidden for this profile boundary update; the result requires review against the expected boundary behavior. | Needs Review | Result log available in test_scripts/results/ |
| FR04-BVA-03 | Boundary Value Analysis | Phone at 11-digit maximum | User is logged in | `phone=01234567890` | Update profile | Accepted according to SRS | API returned HTTP 403 Forbidden for this profile boundary update; the result requires review against the expected boundary behavior. | Needs Review | Result log available in test_scripts/results/ |
| FR04-BVA-04 | Boundary Value Analysis | Phone above 12-digit maximum | User is logged in | `phone=012345678901` | Update profile | Rejected | API returned HTTP 403 Forbidden for this profile boundary update; the result requires review against the expected boundary behavior. | Needs Review | Result log available in test_scripts/results/ |
| FR04-BVA-05 | Boundary Value Analysis | First character is not 0 | User is logged in | `phone=1123456789` | Update profile | Rejected according to SRS | API returned HTTP 403 Forbidden for this profile boundary update; the result requires review against the expected boundary behavior. | Needs Review | Result log available in test_scripts/results/ |
|FR04-BVA-06 | Boundary Value Analysis | Empty and 1-character name | User is logged in | `name=""`, then `name="A"` | Submit form/API | Empty is blocked; 1-character behavior is clear | Empty name was blocked by browser validation, and the 1-character name `A` was accepted with an update-success alert. | Pass | [FR04-BVA-06 screenshot](evidence/screenshots/FR04-BVA-06.png), [FR04-BVA-06 second screenshot](evidence/screenshots/FR04-BVA-06-2.png)|

## 5. AI Gap Analysis

### 5.1 AI-Suggested Cases

AI commonly suggests valid profile update, invalid phone format, too-short/too-long phone, unauthenticated user, and disabled email UI.

### 5.2 Missing / Weak AI Cases

AI may miss that the backend accepts `role`, the API does not validate phone, `shipping_address` differs from `shippingAddress`, and stored state must be checked after a `200` response.

### 5.3 Why AI Might Miss Them

The causes include a general prompt, not inspecting source code, validation being implemented only in frontend, hidden backend logic in `PUT /api/users/me`, and different address field names between mobile and web.

### 5.4 Human Corrections

After reading the code, tests were corrected to use `/api/users/me` and request body fields `name`, `phone`, and `shipping_address`. Role, email, token, HTML/script, and phone UI/SRS mismatch cases were added. FR-04 execution results were reset and require new evidence before final verdicts are written.

## 6. Potential or Confirmed Bugs

Confirmed FR-04 bugs are listed in `bug_report.md`.

| Related Test Case | Verdict | Notes | Evidence |
|---|---|---|---|
| FR04-DT-01, FR04-DT-03, FR04-DT-04, FR04-DT-05 | Fail | Web UI phone validation conflicts with the SRS: valid `0`-starting phone numbers are rejected, while a non-`0` phone number is accepted. | [FR04-DT-01 screenshot](evidence/screenshots/FR04-DT-01.png), [FR04-DT-03 screenshot](evidence/screenshots/FR04-DT-03.png), [FR04-DT-04 screenshot](evidence/screenshots/FR04-DT-04.png), [FR04-DT-05 screenshot](evidence/screenshots/FR04-DT-05.png) |
| FR04-DT-07 | Fail | Profile update with email field returned HTTP 403 instead of a clear protected-field behavior. | `test_scripts/results/json/fr04_profile_api_results.json`, `test_scripts/results/html/fr04_profile_api_results.html` |
| FR04-DT-09, FR04-DT-10, FR04-DT-12, FR04-BVA-01, FR04-BVA-02, FR04-BVA-03, FR04-BVA-04, FR04-BVA-05 | Needs Review | Automated API results returned HTTP 403, but the expected profile validation/storage behavior cannot be fully judged from the result log alone. | `test_scripts/results/json/fr04_profile_api_results.json`, `test_scripts/results/html/fr04_profile_api_results.html` |

FR04-DT-08 is not listed as a bug because the result log shows the role escalation attempt was blocked with HTTP 403.
