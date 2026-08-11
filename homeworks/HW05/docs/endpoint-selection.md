# Endpoint Selection

## Original proposal

- Read-heavy: `GET /api/admin/orders`
- Transactional: `POST /api/checkout`
- Auth-heavy: `POST /api/register`

## Audit finding

`POST /api/register` is a weaker match for the assignment's auth-heavy intent than `POST /api/login`.

Why this matters:

- The HW05 requirements explicitly use login and account-lockout behavior as the auth-heavy example.
- Registration creates a new account, but it does not exercise login failure handling or lockout behavior.
- Registration is also usually a setup action, not the repeated auth path that becomes performance-sensitive under load.

## Recommended final groups

- Auth-heavy: `POST /api/login`
- Read-heavy: `GET /api/admin/orders`
- Transactional: `POST /api/checkout`

## Identity issue

`/api/admin/orders` requires an admin identity.

That means the workflow cannot be treated as a single customer user journey:

- customer virtual user: login, browse, prepare cart, checkout
- admin virtual user: admin login, read orders

## Recommended workflow

See [`workflow.md`](workflow.md) for the detailed scenario design.

## Human verification required

- REQUIRES HUMAN VERIFICATION AGAINST LIVE BACKEND: confirm the final auth route, checkout body, and any cart/preparation requests against the live SUT before running JMeter.

