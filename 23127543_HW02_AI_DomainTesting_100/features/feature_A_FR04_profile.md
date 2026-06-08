# FR-04 - Personal Profile Management

## 1. Feature Overview
FR-04 allows a logged-in user to update personal profile information such as full name, phone number, and default shipping address. The business purpose is to keep customer contact and delivery information accurate for order fulfillment and after-sales support.

## 2. Requirement Summary
According to the EShop SRS, a user can only update their own profile. A valid phone number must start with `0` and contain 10-11 digits. Email cannot be changed through the UI. Users must not be able to change their own `role`.

## 3. Domain Testing

### 3.1 Input Variables / Conditions
| Variable / Condition | Description | Valid Domain | Invalid Domain |
|---|---|---|---|
| Login status | User accessing profile update | Valid JWT | No token, expired/invalid token |
| Profile ownership | Profile being updated | The logged-in user's own profile | Another user's profile |
| Full name | Customer display name | Non-empty string with valid letters/spaces | Empty if required, whitespace-only, too long |
| Phone number | Contact number | Starts with `0`, contains 10 or 11 digits | Does not start with `0`, fewer than 10 digits, more than 11 digits, contains letters/special characters |
| Shipping address | Default delivery address | Valid text within UI/API limits | HTML/script if rendered, too long, empty if required |
| Email | Login identifier | Display-only and not editable through UI | Client attempts to send a new email |
| Role | User permission | Not present in the form and not changeable from client | Client sends `role=admin` |

### 3.2 Domain Analysis Explanation
Domain analysis is performed by splitting each input variable into valid and invalid domains. For phone numbers, the main valid domain is `0` followed by 9 or 10 digits. For access control, the valid domain is the token of the current user; invalid domains include unauthenticated requests, another user's token, and payloads containing sensitive fields. The test cases also cover UI/API differences because the UI may lock email while the API still needs to reject out-of-spec data.

### 3.3 Domain Testing Test Cases
| TC ID | Technique | Domain Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR04-DT-01 | Valid domain | Valid full profile update | User is logged in | Name: Nguyen Van A; Phone: 0912345678; Address: 1 Le Loi | Open Profile, enter data, click Update | Profile is updated successfully and data is saved correctly | UI rejected valid phone `0912345678` with invalid-phone alert requiring 9-10 digits. Bug candidate: BUG-FR04-01 | Fail | [FR04-DT-01.png](evidence/test_execution_screenshots/FR04-DT-01.png) |
| FR04-DT-02 | Invalid domain | Empty full name | User is logged in | Name: empty; valid phone; valid address | Clear full name and save | System rejects it if full name is required or shows a clear validation error | Browser required-field validation was shown for the empty full name. | Pass | [FR04-DT-02.png](evidence/test_execution_screenshots/FR04-DT-02.png) |
| FR04-DT-03 | Valid domain | 10-digit phone | User is logged in | Phone: 0912345678 | Update phone | Accepted because it starts with 0 and has 10 digits | UI rejected valid 10-digit phone `0912345678` with invalid-phone alert requiring 9-10 digits. Bug candidate: BUG-FR04-01 | Fail | [FR04-DT-03.png](evidence/test_execution_screenshots/FR04-DT-03.png) |
| FR04-DT-04 | Valid domain | 11-digit phone | User is logged in | Phone: 09123456789 | Update phone | Accepted because it starts with 0 and has 11 digits | UI rejected valid 11-digit phone `09123456789` with invalid-phone alert requiring 9-10 digits. Bug candidate: BUG-FR04-01 | Fail | [FR04-DT-04.png](evidence/test_execution_screenshots/FR04-DT-04.png) |
| FR04-DT-05 | Invalid domain | Phone does not start with 0 | User is logged in | Phone: 9123456789 | Update phone | Rejected with invalid phone message | UI accepted phone `9123456789` and showed success message even though it does not start with 0. Bug candidate: BUG-FR04-01 | Fail | [FR04-DT-05.png](evidence/test_execution_screenshots/FR04-DT-05.png) |
| FR04-DT-06 | Invalid domain | Phone contains letters/special characters | User is logged in | Phone: 09A234567! | Update phone | Rejected and data is not saved | UI rejected `09A234567!` with invalid-phone alert. | Pass | [FR04-DT-06.png](evidence/test_execution_screenshots/FR04-DT-06.png) |
| FR04-DT-07 | Security domain | Attempt to change email through UI/API | User is logged in | email: attacker@eshop.com | Verify email is disabled in UI; send PUT request with new email | Email remains unchanged in database/response | API returned `200 Profile updated` when an `email` field was included, but screenshot does not show the stored/profile email after the request; needs manual confirmation. | Needs Review | [FR04-DT-07.png](evidence/test_execution_screenshots/FR04-DT-07.png) |
| FR04-DT-08 | Security domain | Attempt to change role | Regular user is logged in | role: admin | Send PUT /api/users/me with role=admin | Role does not change; API ignores field or returns an error | API returned `200 Profile updated` when `role: admin` was included, but screenshot does not show whether the stored role changed; needs manual confirmation. | Needs Review | [FR04-DT-08.png](evidence/test_execution_screenshots/FR04-DT-08.png) |
| FR04-DT-09 | Authorization domain | Update another user's profile | Two users exist | User A token, target user B | Try updating user B through endpoint/client modification if available | Request is rejected; only `/users/me` for the token can be changed | API returned `200 Profile updated` for `/api/users/me` with an extra user id field, but screenshot does not confirm whether User B remained unchanged; needs manual confirmation. | Needs Review | [FR04-DT-09.png](evidence/test_execution_screenshots/FR04-DT-09.png) |
| FR04-DT-10 | Security domain | Address contains HTML/script | User is logged in | Address: `<script>alert(1)</script>` | Save address, reopen Profile/Checkout/Admin order | Content is escaped and script does not execute | API accepted the address and UI displayed the `<script>` string as text in the textarea; no script execution is shown. | Pass | [FR04-DT-10.png](evidence/test_execution_screenshots/FR04-DT-10.png)<br>[FR04-DT-10-2.png](evidence/test_execution_screenshots/FR04-DT-10-2.png) |
| FR04-DT-11 | Invalid domain | Not logged in | No token | Valid name/phone/address | Call profile update | Returns 401/403 and no data is saved | API returned `401 Unauthorized` for the no-token request. | Pass | [FR04-DT-11.png](evidence/test_execution_screenshots/FR04-DT-11.png) |
| FR04-DT-12 | Robustness domain | Very long address | User is logged in | Address length 500-1000 characters | Save long address | System handles it with a clear limit and UI does not break | API returned `200 Profile updated`; UI displayed the long address in the textarea with scrolling and no visible page breakage. | Pass | [FR04-DT-12-1.png](evidence/test_execution_screenshots/FR04-DT-12-1.png)<br>[FR04-DT-12-2.png](evidence/test_execution_screenshots/FR04-DT-12-2.png) |

## 4. Boundary Value Analysis

### 4.1 Boundary Variables
| Variable | Boundary Rule | Below Boundary | On Boundary | Above Boundary |
|---|---|---:|---:|---:|
| Minimum phone length | Valid from 10 digits | 9 | 10 | 11 |
| Maximum phone length | Valid up to 11 digits | 10 | 11 | 12 |
| First phone character | Must be `0` | `9` | `0` | `00` prefix considered with total length |
| Full name length | Non-empty if required | 0 | 1 | 2+ |
| Address length | Needs reasonable UI/API limit | 0 | 1 | Very long string |
| Sensitive fields in payload | Email/role must not be changed | 0 | 1 sensitive field | 2 sensitive fields |

### 4.2 BVA Explanation
BVA focuses on error-prone boundaries: phone length 9/10/11/12, the first phone character, empty fields, and payloads containing sensitive fields. Below-boundary, on-boundary, and above-boundary values are selected to verify that both UI and backend follow the specification.

### 4.3 BVA Test Cases
| TC ID | Technique | Boundary Focus | Preconditions | Input Data | Steps | Expected Result | Actual Result | Verdict | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| FR04-BVA-01 | BVA | Phone below minimum | User is logged in | Phone: 012345678 (9 digits) | Save profile | Rejected | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-BVA-01.png |
| FR04-BVA-02 | BVA | Phone at minimum | User is logged in | Phone: 0123456789 (10 digits) | Save profile | Accepted | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-BVA-02.png |
| FR04-BVA-03 | BVA | Phone at maximum | User is logged in | Phone: 01234567890 (11 digits) | Save profile | Accepted | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-BVA-03.png |
| FR04-BVA-04 | BVA | Phone above maximum | User is logged in | Phone: 012345678901 (12 digits) | Save profile | Rejected | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-BVA-04.png |
| FR04-BVA-05 | BVA | First phone character | User is logged in | Phone: 1123456789 | Save profile | Rejected because it does not start with 0 | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-BVA-05.png |
| FR04-BVA-06 | BVA | Empty/minimal full name | User is logged in | Name: ""; valid phone | Save profile | If required, rejected; otherwise behavior must be clear | Not Executed | Not Executed | evidence/test_execution_screenshots/FR04-BVA-06.png |

## 5. AI Gap Analysis

### 5.1 AI-Suggested Cases
AI commonly suggests basic cases such as valid profile update, invalid phone format, too-short/too-long phone numbers, and unauthenticated user.

### 5.2 Missing / Weak AI Cases
AI may miss cases that send `role=admin`, send `email` through the API, update another user's profile, use HTML/script in address, and check the mismatch between API field `shipping_address` and client field `shippingAddress`.

### 5.3 Why AI Might Miss Them
The causes may include an overly general prompt, not inspecting the exact specification/API, or overlooking backend security behavior. Some defects are UI/API mismatch issues and do not appear when only the UI is reviewed.

### 5.4 Human Corrections
The tester added authorization, role-escalation, email immutability, HTML escaping, and 10-11 digit phone boundary cases based on the SRS. Results remain `Not Executed` until manual execution is performed.
