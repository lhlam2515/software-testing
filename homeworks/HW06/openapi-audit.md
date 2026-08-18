# OpenAPI Audit - HW06

## Endpoints Found

### FR-04 - Personal profile management

- `GET /api/users/me`
- `PUT /api/users/me`

### FR-08 - Checkout

- `POST /api/checkout`

### FR-18 - Order management (admin)

- `GET /api/admin/orders`
- `PUT /api/admin/orders/:id/status`

## Assignment vs SUT Discrepancies

- The assignment describes FR-18 as admin order management, but the backend only applies JWT authentication. I did not find a role check that restricts `/api/admin/orders` or `/api/admin/orders/:id/status` to admin users only.
- `PUT /api/users/me` accepts an optional `role` field in the request body, even though profile management normally should not allow privilege changes.
- `GET /api/users/me` returns the full user row from the database. The OpenAPI schema allows the observed fields and additional properties because the backend returns the raw row rather than a documented minimal profile shape.
- `GET /api/admin/orders` returns a joined order list with `user_name`, which is reflected in the OpenAPI schema.
- `PUT /api/admin/orders/:id/status` enforces status-transition rules in code. The OpenAPI schema documents the values that the backend actually accepts as targets.

## Security Coverage

The OpenAPI file includes bearer JWT security for all documented operations because the backend uses `authenticateToken` on those endpoints.

Relevant security observations from the code:

- `GET /api/users/me` and `PUT /api/users/me` require a JWT bearer token.
- `POST /api/checkout` requires a JWT bearer token.
- `GET /api/admin/orders` and `PUT /api/admin/orders/:id/status` require a JWT bearer token, but no admin-role authorization check was found.
- The `/api/users/me` update path allows a `role` field, which is a potential privilege-escalation concern.

## Validation Result

- YAML syntax validation: passed
- OpenAPI structure validation: passed at the schema level used for this task

## Assumptions and Manual Review Notes

- I documented only FR-04, FR-08, and FR-18, as requested.
- I did not invent validation rules that are not present in `server.js`.
- Because the backend returns raw database rows for some responses, the schemas allow additional properties where necessary.
- The assignment mentions SEC-01 through SEC-07, but the exact text of those security requirements was not exposed in the code. I therefore mapped the documented security behavior from the assignment and backend implementation rather than guessing the numbered requirement text.
