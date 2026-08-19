# Bug Report

## BUG-001 - Non-admin users can read admin orders

### Severity
High

### Type
Authorization / Security

### Endpoint
GET `/api/admin/orders`

### Preconditions
- Log in as a normal user
- Use the returned bearer token

### Steps to Reproduce
1. Log in with `test@eshop.com / Test1234!`.
2. Call `GET /api/admin/orders` with `Authorization: Bearer <userToken>`.

### Request
```http
GET /api/admin/orders HTTP/1.1
Authorization: Bearer <userToken>
X-Student-Id: YOUR_STUDENT_ID
```

### Expected Result
`403 Forbidden`

### Actual Result
`200 OK` with the full admin order list.

### Evidence
- Newman failures on `TC-075`, `TC-077`, `TC-085`, `TC-086`, `TC-087`, `TC-092`, `TC-095`, `TC-098`, `TC-108`
- Direct verification returned `200`

### Requirement / Specification
- FR-18 admin order access
- OpenAPI security scheme requires bearer auth

### Impact
Any authenticated user can read all admin order data, exposing order and customer information.

### Source
AI-audit test and direct manual verification

### AI missed this bug
Yes

### Why the AI missed this
The original generation treated many admin-access cases as generic security permutations but did not separate the authorization boundary for admin-only read access from login/authentication checks.

## BUG-002 - Non-admin users can change order status through the admin endpoint

### Severity
High

### Type
Authorization / Security / State Transition

### Endpoint
PUT `/api/admin/orders/{id}/status`

### Preconditions
- Log in as a normal user
- Have an existing pending order id

### Steps to Reproduce
1. Log in with `test@eshop.com / Test1234!`.
2. Use a pending order id, for example `5`.
3. Call `PUT /api/admin/orders/5/status` with `{"status":"confirmed"}`.

### Request
```http
PUT /api/admin/orders/5/status HTTP/1.1
Authorization: Bearer <userToken>
Content-Type: application/json
X-Student-Id: YOUR_STUDENT_ID

{"status":"confirmed"}
```

### Expected Result
`403 Forbidden`

### Actual Result
`200 OK` with `{"message":"Order status updated"}`

### Evidence
- Direct verification returned `200`
- Newman failures on the admin status cases exposed the same authorization gap when the request was routed correctly

### Requirement / Specification
- FR-18 admin-only order management
- FR-10 order state machine

### Impact
Normal users can mutate order states through an admin endpoint, which is a serious authorization failure and can corrupt order workflow.

### Source
Manual verification and AI-audit test

### AI missed this bug
Yes

### Why the AI missed this
The original suite did not fully enumerate the authorization matrix for admin state changes and did not force a normal-user write attempt on a valid pending order id.

## BUG-003 - Checkout returns 500 on text/plain input

### Severity
Medium

### Type
Validation / Error Handling

### Endpoint
POST `/api/checkout`

### Preconditions
- Log in as a normal user

### Steps to Reproduce
1. Log in with `test@eshop.com / Test1234!`.
2. Send `POST /api/checkout` with `Content-Type: text/plain`.
3. Use any body text, for example `not-json`.

### Request
```http
POST /api/checkout HTTP/1.1
Authorization: Bearer <userToken>
Content-Type: text/plain
X-Student-Id: YOUR_STUDENT_ID

not-json
```

### Expected Result
`400 Bad Request` or another controlled validation error

### Actual Result
`500 Internal Server Error` with a `TypeError` from destructuring `req.body`

### Evidence
- Direct verification returned `500`
- Newman failure on `TC-061`

### Requirement / Specification
- FR-08 checkout request validation
- OpenAPI requestBody contract for JSON input

### Impact
Malformed content can crash the endpoint with a server error instead of a controlled validation response.

### Source
AI-generated test and direct manual verification

### AI missed this bug
Yes

### Why the AI missed this
The original generator explored malformed JSON, but it did not specifically probe non-JSON content-types against the checkout route's body parsing path.

## BUG-004 - Canceled orders can transition to delivered

### Severity
Medium

### Type
State Transition

### Endpoint
PUT `/api/admin/orders/{id}/status`

### Preconditions
- Have an order in `canceled` state
- Use an authenticated admin token

### Steps to Reproduce
1. Log in as admin with `admin@eshop.com / Admin123!`.
2. Ensure order `1` is in `canceled` state.
3. Call `PUT /api/admin/orders/1/status` with `{"status":"delivered"}`.

### Request
```http
PUT /api/admin/orders/1/status HTTP/1.1
Authorization: Bearer <adminToken>
Content-Type: application/json
X-Student-Id: YOUR_STUDENT_ID

{"status":"delivered"}
```

### Expected Result
`400 Bad Request` because canceled orders should not move to delivered under the FR-10 state machine

### Actual Result
`200 OK` with `{"message":"Order status updated"}`

### Evidence
- Direct verification returned `200`

### Requirement / Specification
- FR-10 order state machine
- Assignment instructions call out pending, confirmed, shipping, delivered, and cancellation rules

### Impact
Terminal canceled orders can be resurrected into a completed state, violating the intended lifecycle rules.

### Source
Manual verification

### AI missed this bug
Yes

### Why the AI missed this
The original AI suite noted the backend-specific transition but did not escalate it into a definite defect or isolate it as a terminal-state violation.
