# Workflow

## Recommended end-to-end workflow

### Customer flow

LOGIN
-> READ / BROWSE
-> PREPARE CART
-> CHECKOUT

### Admin flow

ADMIN LOGIN
-> `GET /api/admin/orders`

## Coverage mapping

- Auth-heavy: `POST /api/login`
- Read-heavy: `GET /api/admin/orders`
- Transactional: `POST /api/checkout`

## Identity split

This scenario uses two identities:

- Customer virtual user
- Admin virtual user

The customer path should not be assumed to have admin privileges.

## Supporting requests

The available documentation confirms:

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/cart`
- `POST /api/cart`

These may be necessary to prepare a valid checkout flow.

REQUIRES HUMAN VERIFICATION AGAINST LIVE BACKEND:

- confirm whether checkout requires cart creation through `POST /api/cart`
- confirm the exact checkout request body
- confirm whether product browsing is needed before cart preparation
- confirm whether admin order listing returns a JSON array and what fields are safe to assert

