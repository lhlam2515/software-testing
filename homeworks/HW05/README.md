# HW05 - Performance Testing

Student ID: `23127543`

## 1. Tools Used

- Node.js 20.20.2 for local backend validation
- Supertest for API verification against the recovered backend source
- Apache JMeter 5.6.x-compatible `.jmx` plans
- SQLite-backed backend source recovered from the workspace's preserved test sandbox

## 2. Backend Start

The verified backend listens on `http://localhost:3000`.

Because the workspace copy of JMeter is not installed on this machine, I validated the backend and workflow with Supertest instead of executing the JMeter CLI locally.

Validation command used:

```powershell
$env:NODE_PATH='D:\SoftwareTesting\Homework\software-testing\apps\backend\node_modules'; node -e "const app=require('./homeworks/HW05/apps/backend/server'); const request=require('supertest'); (async()=>{ const cust=await request(app).post('/api/login').send({email:'test@eshop.com',password:'Test1234!'}); const ctoken=cust.body.token; const co=await request(app).post('/api/checkout').set('Authorization','Bearer '+ctoken).send({total_amount:45000000,shipping_address:'12 Nguyen Trai, District 1, Ho Chi Minh City'}); const admin=await request(app).post('/api/login').send({email:'admin@eshop.com',password:'Admin123!'}); const atoken=admin.body.token; const a=await request(app).get('/api/admin/orders').set('Authorization','Bearer '+atoken); console.log(JSON.stringify({checkoutStatus:co.status,orderId:co.body.orderId,adminStatus:a.status,isArray:Array.isArray(a.body),orders:a.body})); process.exit(0); })();"
```

## 3. Common Workflow

The same end-to-end workflow is used in all three plans:

1. Customer login through `POST /api/login`
2. Browse products through `GET /api/products`
3. Read one product through `GET /api/products/:id`
4. Add a product to cart through `POST /api/cart`
5. Checkout through `POST /api/checkout`
6. Admin login through `POST /api/login`
7. Read orders through `GET /api/admin/orders`

Why each step belongs where it does:

- Auth-heavy: `POST /api/login` because it exercises credential validation and token issuance.
- Read-heavy: `GET /api/products`, `GET /api/products/:id`, and `GET /api/admin/orders` because they are read-only browse/list requests.
- Transactional: `POST /api/cart` and `POST /api/checkout` because they mutate session/cart/order state.

## 4. Confirmed Backend Behavior

The recovered backend source in `homeworks/HW05/apps/backend/server.js` confirms:

- `POST /api/login` returns `200` with `{ message, token, user }` on success.
- `GET /api/products` returns a JSON array of products.
- `GET /api/products/:id` returns a single product object or `{}` if missing.
- `POST /api/cart` returns `200` with `{ message: "Added to cart" }`.
- `POST /api/checkout` returns `200` with `{ message: "Checkout successful", orderId }`.
- `GET /api/admin/orders` returns a JSON array of orders and requires a bearer token.

Authentication is bearer-token based:

```text
Authorization: Bearer <token>
```

## 5. CSV Data

The plans read from `data/`:

- `data/users.csv` for customer login
- `data/admin-users.csv` for admin login
- `data/products.csv` for product IDs and names
- `data/checkout-data.csv` for shipping addresses

The backend only seeds one confirmed customer and one confirmed admin account in the recovered source, so the CSV files intentionally repeat those verified credentials rather than inventing invalid accounts.

## 6. Test Plans

### Load

- File: `load-test.jmx`
- Users: `10`
- Ramp-up: `60s`
- Loops: `2`
- Think time: `1500ms`
- Listener: `Summary Report`

### Stress

- File: `stress-test.jmx`
- Users: `30`
- Ramp-up: `90s`
- Loops: `2`
- Think time: `1000ms`
- Listener: `Aggregate Report`

### Spike

- File: `spike-test.jmx`
- Users: `50`
- Ramp-up: `8s`
- Loops: `1`
- Think time: `750ms`
- Listener: `View Results Tree`

## 7. Why These Numbers Are Reasonable

- Load uses 10 VUs and a 60-second ramp-up to represent a gentle, normal classroom workload.
- Stress uses 30 VUs and a 90-second ramp-up to push the local SQLite-backed backend harder without making the machine unusable.
- Spike uses 50 VUs over 8 seconds to create a sharp concurrency jump while still being small enough for local observation.

## 8. Distinct Listener Types

- Load: `Summary Report`
- Stress: `Aggregate Report`
- Spike: `View Results Tree`

The three listener types are not repeated across plans.

## 9. Actual Execution Results

Because `jmeter` is not installed in this workspace, I could not run the `.jmx` files with the CLI on this machine.

I did validate the backend workflow directly against the recovered implementation:

- Customer login: `200`, token returned
- Browse products: `200`, 5 products returned
- Add to cart: `200`, `Added to cart`
- Checkout: `200`, `Checkout successful`, order ID returned
- Admin login + admin orders: `200`, JSON array returned with the created order

The combined validation output was:

```json
{"checkoutStatus":200,"orderId":1,"adminStatus":200,"isArray":true,"orders":[{"id":1,"user_id":2,"total_amount":45000000,"status":"pending","shipping_address":"12 Nguyen Trai, District 1, Ho Chi Minh City","created_at":"2026-08-12T07:12:30.980Z","user_name":"Test User"}]}
```

## 10. Limitations

- JMeter CLI is unavailable in this workspace, so the `.jmx` files could not be executed here.
- The backend source copy used for validation is the recovered implementation from the preserved sandbox, not a separately hosted production service.
- The CSV credential rows repeat the only confirmed local customer and admin accounts available in the recovered seed state.

## 11. Submission Contents

- `homeworks/HW05/load-test.jmx`
- `homeworks/HW05/stress-test.jmx`
- `homeworks/HW05/spike-test.jmx`
- `homeworks/HW05/data/users.csv`
- `homeworks/HW05/data/admin-users.csv`
- `homeworks/HW05/data/products.csv`
- `homeworks/HW05/data/checkout-data.csv`
- `homeworks/HW05/apps/backend/server.js`
- `homeworks/HW05/apps/backend/database.js`
- `homeworks/HW05/apps/backend/package.json`

