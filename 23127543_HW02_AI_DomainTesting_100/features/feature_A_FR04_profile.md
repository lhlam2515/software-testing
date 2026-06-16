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

Execution method note for UI-heavy rows: UI-assisted manual review using Playwright screenshots may be used to collect additional evidence. Do not change existing Actual Result or Verdict values until the generated screenshots and JSON logs have been manually reviewed.

| TC ID | Technique | Domain Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR04-DT-01 | Domain Testing | Valid profile update according to SRS | User `test@eshop.com` is logged in | `name=Nguyen Van A`, `phone=0912345678`, `shipping_address=1 Le Loi` | Open Profile, enter data, click Update | According to SRS, a 10-digit phone starting with `0` is accepted and profile is saved | UI shows invalid-phone alert for `0912345678`. | Failed | [FR04-DT-01.png](../evidence/test_execution_screenshots/FR04-DT-01.png) |
| FR04-DT-02 | Domain Testing | Empty full name | User is logged in | `name=""`, valid phone/address | Clear the full name field and submit | Browser/app blocks submission because name is required | Browser required-field validation is shown for empty name. | Passed | [FR04-DT-02.png](../evidence/test_execution_screenshots/FR04-DT-02.png) |
| FR04-DT-03 | Domain Testing | 10-digit phone starting with 0 | User is logged in | `phone=0912345678` | Update phone | Accepted according to SRS | UI rejects an SRS-valid phone number. | Failed | [FR04-DT-03.png](../evidence/test_execution_screenshots/FR04-DT-03.png) |
| FR04-DT-04 | Domain Testing | 11-digit phone starting with 0 | User is logged in | `phone=09123456789` | Update phone | Accepted according to SRS | UI rejects an SRS-valid phone number. | Failed | [FR04-DT-04.png](../evidence/test_execution_screenshots/FR04-DT-04.png) |
| FR04-DT-05 | Domain Testing | Phone does not start with 0 | User is logged in | `phone=9123456789` | Update phone | Rejected according to SRS | UI accepts it and shows update success. | Failed | [FR04-DT-05.png](../evidence/test_execution_screenshots/FR04-DT-05.png) |
| FR04-DT-06 | Domain Testing | Phone contains letters/special characters | User is logged in | `phone=09A234567!` | Update phone | Rejected and not saved | UI rejects it with an invalid-phone alert. | Passed | [FR04-DT-06.png](../evidence/test_execution_screenshots/FR04-DT-06.png) |
| FR04-DT-07 | Domain Testing | Attempt to change email through API | User is logged in and has token | Body: `{"name":"A","phone":"9123456789","shipping_address":"X","email":"attacker@eshop.com"}` | Send `PUT /api/users/me`, then call `GET /api/users/me` | Email remains unchanged; API ignores or rejects `email` | API returns `200 Profile updated` when body includes `email`, but screenshot does not confirm whether DB email changed. | Needs Review | [FR04-DT-07.png](../evidence/test_execution_screenshots/FR04-DT-07.png) |
| FR04-DT-08 | Domain Testing | Attempt role escalation with `role` | Regular user is logged in | Body includes `role:"admin"` | Send `PUT /api/users/me`, then call `GET /api/users/me` or an admin API | Role must not change; API ignores or rejects `role` | API returns `200 Profile updated` when `role: admin` is included, but screenshot does not confirm stored role after update. | Needs Review | [FR04-DT-08.png](../evidence/test_execution_screenshots/FR04-DT-08.png) |
| FR04-DT-09 | Domain Testing | Attempt to update another user | User A and User B exist | User A token, payload includes User B id | Send `PUT /api/users/me` with User B id, then check both users | Only User A from token is affected; User B remains unchanged | API returns `200 Profile updated` for `/api/users/me`, but screenshot does not confirm User B remains unchanged. | Needs Review | [FR04-DT-09.png](../evidence/test_execution_screenshots/FR04-DT-09.png) |
| FR04-DT-10 | Domain Testing | Address contains HTML/script | User is logged in | `shipping_address=<script>alert(1)</script>` | Save address, reopen Profile/Checkout/Admin order if order exists | String is escaped and script does not execute | API accepts it; profile UI displays script text in textarea and no script execution is shown. | Passed | [FR04-DT-10.png](../evidence/test_execution_screenshots/FR04-DT-10.png)<br>[FR04-DT-10-2.png](../evidence/test_execution_screenshots/FR04-DT-10-2.png) |
| FR04-DT-11 | Domain Testing | No token | User is not logged in | Valid profile body | Send `PUT /api/users/me` without Authorization header | Returns `401 Unauthorized`, no data saved | API returns `401 Unauthorized`. | Passed | [FR04-DT-11.png](../evidence/test_execution_screenshots/FR04-DT-11.png) |
| FR04-DT-12 | Domain Testing | Very long address | User is logged in | Address length 500-1000 characters | Save address and reopen UI | System handles it stably or shows a clear limit | API returns `200 Profile updated`; UI displays long address in textarea without obvious layout breakage. | Passed | [FR04-DT-12-1.png](../evidence/test_execution_screenshots/FR04-DT-12-1.png)<br>[FR04-DT-12-2.png](../evidence/test_execution_screenshots/FR04-DT-12-2.png) |

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

Execution method note for UI-heavy rows: UI-assisted manual review using Playwright screenshots may be used to collect additional evidence. API boundary behavior may be checked separately because backend and UI phone validation differ.

| TC ID | Technique | Boundary Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR04-BVA-01 | Boundary Value Analysis | Phone below 10-digit minimum | User is logged in | `phone=012345678` | Update profile | Rejected | UI profile page rejects `012345678` with an invalid-phone alert. | Passed | [FR04-BVA-01.png](../evidence/test_execution_screenshots/FR04-BVA-01.png) |
| FR04-BVA-02 | Boundary Value Analysis | Phone at 10-digit minimum | User is logged in | `phone=0123456789` | Update profile | Accepted according to SRS | UI profile page rejects `0123456789` with an invalid-phone alert. Bug candidate: BUG-FR04-BVA-02. | Failed | [FR04-BVA-02.png](../evidence/test_execution_screenshots/FR04-BVA-02.png) |
| FR04-BVA-03 | Boundary Value Analysis | Phone at 11-digit maximum | User is logged in | `phone=01234567890` | Update profile | Accepted according to SRS | UI profile page rejects `01234567890` with an invalid-phone alert. Bug candidate: BUG-FR04-BVA-03. | Failed | [FR04-BVA-03.png](../evidence/test_execution_screenshots/FR04-BVA-03.png) |
| FR04-BVA-04 | Boundary Value Analysis | Phone above 12-digit maximum | User is logged in | `phone=012345678901` | Update profile | Rejected | UI profile page rejects `012345678901` with an invalid-phone alert. | Passed | [FR04-BVA-04.png](../evidence/test_execution_screenshots/FR04-BVA-04.png) |
| FR04-BVA-05 | Boundary Value Analysis | First character is not 0 | User is logged in | `phone=1123456789` | Update profile | Rejected according to SRS | UI profile page accepts `1123456789` and shows update success. Bug candidate: BUG-FR04-BVA-05. | Failed | [FR04-BVA-05.png](../evidence/test_execution_screenshots/FR04-BVA-05.png) |
| FR04-BVA-06 | Boundary Value Analysis | Empty and 1-character name | User is logged in | `name=""`, then `name="A"` | Submit form/API | Empty is blocked; 1-character behavior is clear | Screenshot shows `name="A"` accepted with update success, but does not show the empty-name boundary. | Needs Review | [FR04-BVA-06.png](../evidence/test_execution_screenshots/FR04-BVA-06.png) |

## 5. AI Gap Analysis

### 5.1 AI-Suggested Cases

AI commonly suggests valid profile update, invalid phone format, too-short/too-long phone, unauthenticated user, and disabled email UI.

### 5.2 Missing / Weak AI Cases

AI may miss that the backend accepts `role`, the API does not validate phone, `shipping_address` differs from `shippingAddress`, and stored state must be checked after a `200` response.

### 5.3 Why AI Might Miss Them

The causes include a general prompt, not inspecting source code, validation being implemented only in frontend, hidden backend logic in `PUT /api/users/me`, and different address field names between mobile and web.

### 5.4 Human Corrections

After reading the code, tests were corrected to use `/api/users/me` and request body fields `name`, `phone`, and `shipping_address`. Role, email, token, HTML/script, and phone UI/SRS mismatch cases were added. FR-04 screenshot-backed results were updated honestly; BVA cases without evidence remain `Not Executed`.

## 6. Potential Bugs / Bug Report Placeholders

### Potential BUG-FR04-02: Backend profile API may allow role escalation

**Feature:** FR-04  
**Related Test Case:** FR04-DT-08  
**Severity:** Critical  
**Status:** Potential bug - needs execution confirmation  

#### Steps to Reproduce
1. Log in as a regular user.
2. Send `PUT /api/users/me` with body containing `role: "admin"`.
3. Call `GET /api/users/me` or try accessing an admin API.

#### Expected Result

Backend does not allow a user to change their own `role`.

#### Actual Result
To be filled after execution.

#### Evidence
To be added after execution.

#### GitHub Issue Link
To be filled after creating GitHub Issue.

### Potential BUG-FR04-03: Mobile profile sends `shippingAddress` instead of backend field `shipping_address`

**Feature:** FR-04 / FR-20  
**Related Test Case:** FR04-DT-12, FR20-DT-12  
**Severity:** Medium  
**Status:** Potential bug - needs execution confirmation  

#### Steps to Reproduce
1. Log in on mobile.
2. Update the shipping address.
3. Call `GET /api/users/me` to check `shipping_address`.

#### Expected Result

Mobile address is saved into `shipping_address`.

#### Actual Result
To be filled after execution.

#### Evidence
To be added after execution.

#### GitHub Issue Link
To be filled after creating GitHub Issue.
