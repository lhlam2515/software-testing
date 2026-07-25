# Activity Worksheet: Kill the Mutant in the EShop Backend

> **Seminar:** T10, Mutation Testing and Test Effectiveness
> **System under test:** EShop backend, covering Auth, Cart, Order Status, and Coupon
> **Tools:** StrykerJS, Jest, and supertest
> **Duration:** 25 minutes
> **Team size:** 3 to 4 students
> **Sandbox repository:** <https://github.com/lhlam2515/eshop-kill-the-mutant>
> **Evidence source:** `/tmp/eshop-kill-the-mutant/apps/backend/reports/mutation/mutation.html`

---

## 0. Objective

The sandbox mutation report contains useful mutants across the EShop backend, not only in the coupon route. This activity uses six mutants from four business areas. Each mutant represents a different weakness in test design.

For every station, write an assertion that:

1. passes against the original program;
2. fails when the target mutant is active;
3. checks the output or state affected by the mutation.

Executing a mutated line is not enough. A test kills a mutant only when it observes a behavioral difference between the original program and the mutant.

### Mutants used in this activity

| Station | Business area | Report mutant | Report status | Mutator |
|---|---|---:|---|---|
| A | Auth: failed login | `#22`, `#23` | Survived | `ObjectLiteral`, `StringLiteral` |
| B | Cart: new cart | `#264` | Survived | `ArrayDeclaration` |
| C | Order Status: canceled transition | `src/routes/admin.routes.js:29` | Survived | `ConditionalExpression` |
| D | Order Status: invalid transition | `#491` | Survived | `LogicalOperator` |
| E | Coupon: percentage calculation | `#378` | NoCoverage | `ArithmeticOperator` |

Mutants `#22` and `#23` use the same request. One precise response oracle can kill both.

---

## 1. Sandbox context

The mutation report contains a source snapshot from the stage when the route logic still lived in `server.js`. The prepared sandbox now separates that logic into routers under `src/routes/`. The mutant IDs and report line numbers remain useful evidence, while the current locations show where the same logic now resides.

| Mutation report snapshot | Current sandbox location |
|---|---|
| `server.js` line 38 | `src/routes/auth.routes.js`, failed-login response |
| `server.js` line 286 | `src/routes/commerce.routes.js`, cart initialization |
| `server.js` order-status handler | `src/routes/admin.routes.js`, `canceled` transition rule |
| `server.js` lines 543 to 544 | `src/routes/admin.routes.js`, `confirmed` transition rule |
| `server.js` line 400 | `src/routes/coupons.routes.js`, percentage formula |

### Provided test harness

```js
const app = require('../server');
const db = require('../database');
const { getAuthToken } = require('./helpers/auth');
const { createApi } = require('./helpers/http');

const api = createApi(app);
const userAuth = `Bearer ${getAuthToken(2)}`;
const adminAuth = `Bearer ${getAuthToken(1)}`;
```

For the Order Status stations, the facilitator also provides the fixture helper already used in `order-status.test.js`:

```js
const orderId = await createOrder('pending');
```

The helper creates an isolated order and registers it for cleanup after the test.

---

## 2. Mutant stations

Read the diff at each station before writing an assertion. First identify the observable difference. Then select the input and oracle needed to expose it.

### Station A: Auth response oracle

**Endpoint:** `POST /api/login`

**Report evidence:** mutant `#22` (`ObjectLiteral`) and mutant `#23` (`StringLiteral`), both Survived.

```diff
  return res.status(401).json({ error: "Invalid email or password" });

# Mutant #22
- return res.status(401).json({ error: "Invalid email or password" });
+ return res.status(401).json({});

# Mutant #23
- return res.status(401).json({ error: "Invalid email or password" });
+ return res.status(401).json({ error: "" });
```

Use an email address that does not exist. The password may contain any non-empty value.

**Task:** Write one response-body assertion that kills both `#22` and `#23`.

`expect(res.status).toBe(401)` is a weak oracle here. The original and both mutants return the same status.

### Station B: Exact cart contents

**Endpoint:** `GET /api/cart`

**Report evidence:** mutant `#264` (`ArrayDeclaration`), Survived.

```diff
- if (!userCarts[userId]) userCarts[userId] = [];
+ if (!userCarts[userId]) userCarts[userId] = ["Stryker was here"];
```

Use a user ID that has not accessed the cart during the current process:

```js
const freshAuth = `Bearer ${getAuthToken(880264)}`;
const res = await api
  .get('/api/cart')
  .set('Authorization', freshAuth);
```

**Task:** Replace `Array.isArray(res.body)` with an assertion that checks the exact contents of a new cart.

### Station C: Canceled order transition

**Endpoint:** `PUT /api/admin/orders/:id/status`

**Report evidence:** `ConditionalExpression` at `src/routes/admin.routes.js:29`, Survived.

```diff
  if (
-   currentStatus === "canceled" && status === "delivered"
+   false
  ) isValidTransition = true;
```

Create an order in `canceled` state and request a transition to `delivered`:

```js
const orderId = await createOrder('canceled');
const res = await api
  .put(`/api/admin/orders/${orderId}/status`)
  .set('Authorization', adminAuth)
  .send({ status: 'delivered' });
```

**Task:** Write an assertion that distinguishes the observed transition in the original program from the mutant that disables this branch. Compare the observed behavior with the FR-10 state machine and record the specification defect separately.

### Station D: Invalid order transition

**Endpoint:** `PUT /api/admin/orders/:id/status`

**Report evidence:** mutant `#491` (`LogicalOperator`), Survived.

```diff
- currentStatus === "confirmed" &&
-   (status === "shipping" || status === "canceled")
+ currentStatus === "confirmed" || status === "shipping" || status === "canceled"
```

Create an order in `pending` state and attempt to move it directly to `shipping`:

```js
const orderId = await createOrder('pending');
const res = await api
  .put(`/api/admin/orders/${orderId}/status`)
  .set('Authorization', adminAuth)
  .send({ status: 'shipping' });
```

**Task:** Assert the HTTP result of this invalid transition. Explain why the mutant accepts the request.

### Station E: Exact coupon calculation

**Endpoint:** `POST /api/apply-coupon`

**Report evidence:** mutant `#378` (`ArithmeticOperator`), NoCoverage.

```diff
- discount_amount = Math.floor(total_amount * (1 - coupon.discount_value));
+ discount_amount = Math.floor(total_amount / (1 - coupon.discount_value));
```

Apply `SAVE10` to a total of `400000`. Omit `user_id` so the request follows the no-user branch.

```js
const res = await api
  .post('/api/apply-coupon')
  .send({ code: 'SAVE10', total_amount: 400000 });
```

**Task:** Assert the exact `discount_amount` produced by the original program.

The current percentage formula does not comply with FR-09. For this exercise, assert the observed baseline behavior so the test can distinguish the original from the mutant. Record the specification defect separately. Mutation testing measures test sensitivity; it does not prove that the baseline behavior is correct.

---

## 3. Team answer sheet

| Station | Original result | Mutant result | Proposed assertion | KILL, WEAK, or BROKEN |
|---|---|---|---|---|
| A: Auth response |  |  |  |  |
| B: Empty cart |  |  |  |  |
| C: Canceled transition |  |  |  |  |
| D: Invalid transition |  |  |  |  |
| E: Percentage calculation |  |  |  |  |

### Review questions

1. Why can the assertion at Station A kill two mutants?
2. Which stations require state setup, and which require only input selection?
3. How does a NoCoverage mutant differ from a Survived mutant?
4. Which station is most likely to produce a weak oracle?

---

## 4. Peer review

Exchange worksheets with another team. Classify every assertion:

- **KILL:** passes against the original and fails against the mutant;
- **WEAK:** passes against both versions;
- **BROKEN:** fails against the original;
- **STATE LEAK:** depends on a cart or order left by another test.

For each classification, state the observable difference or explain why no difference is observed.

---

## 5. Timing and rules

| Time | Activity |
|---|---|
| 0:00 to 0:03 | The facilitator explains the pass-original, fail-mutant rule and assigns stations |
| 0:03 to 0:12 | Each team writes five candidate assertions |
| 0:12 to 0:17 | Teams exchange worksheets and review the observable differences |
| 0:17 to 0:22 | The facilitator runs the assertions in the sandbox and records killed mutants |
| 0:22 to 0:25 | The winning team explains one strong oracle and one weak oracle |

- Do not modify production code during the activity.
- Use the assigned fixtures and tokens to avoid state leaks.
- Run every AI-suggested assertion against both the original and the mutant.
- The score is based on mutants killed, not the number of assertions written.

---

# Answer key: facilitator only

Do not distribute this section before minute 17. The expected results below come from the source snapshot embedded in the mutation report and the corresponding logic in the current sandbox.

## Station A: Kill `#22` and `#23`

```js
const res = await api
  .post('/api/login')
  .send({ email: 'notfound@example.com', password: 'anything' });

expect(res.status).toBe(401);
expect(res.body.error).toBe('Invalid email or password');
```

The original returns the complete error message. Mutant `#22` returns an empty object, so `error` is `undefined`. Mutant `#23` returns an empty string. The exact-value assertion fails against both mutants.

## Station B: Kill `#264`

```js
const freshAuth = `Bearer ${getAuthToken(880264)}`;
const res = await api
  .get('/api/cart')
  .set('Authorization', freshAuth);

expect(res.status).toBe(200);
expect(res.body).toEqual([]);
```

The original initializes a new cart as `[]`. The mutant initializes it as `["Stryker was here"]`. An array type check passes against both versions, but the exact-content assertion kills the mutant.

## Station C: Kill the canceled-transition mutant

```js
const orderId = await createOrder('canceled');
const res = await api
  .put(`/api/admin/orders/${orderId}/status`)
  .set('Authorization', adminAuth)
  .send({ status: 'delivered' });

expect(res.status).toBe(200);
expect(res.body.message).toBe('Order status updated');

const row = await dbGet('SELECT status FROM orders WHERE id = ?', [orderId]);
expect(row.status).toBe('delivered');
```

The original accepts `canceled` to `delivered`, returns 200, and updates the stored state. The mutant replaces the condition with `false`, so no rule validates the transition and the response becomes 400. FR-10 does not allow a canceled order to become delivered, so this assertion deliberately pins the observed baseline behavior for mutation analysis; it does not certify that behavior as specification-correct.

## Station D: Kill `#491`

```js
const orderId = await createOrder('pending');
const res = await api
  .put(`/api/admin/orders/${orderId}/status`)
  .set('Authorization', adminAuth)
  .send({ status: 'shipping' });

expect(res.status).toBe(400);
expect(res.body.error).toBe(
  'Invalid state transition from pending to shipping'
);
```

The original rejects `pending` to `shipping`. In the mutant, `status === 'shipping'` makes the new `||` expression true even though the current state is not `confirmed`. The mutant updates the order and returns 200.

## Station E: Kill `#378`

```js
const res = await api
  .post('/api/apply-coupon')
  .send({ code: 'SAVE10', total_amount: 400000 });

expect(res.status).toBe(200);
expect(res.body.discount_amount).toBe(-3600000);
```

The original calculates `floor(400000 * (1 - 10))`, which is `-3600000`. The mutant calculates `floor(400000 / (1 - 10))`, which is `-44445`. Both values are numbers, so a type assertion is weak. The exact numeric assertion kills the mutant.

## Debrief map

| Test-design issue | Station |
|---|---|
| Status-only assertion misses a response-payload defect | A |
| Type checking is weaker than an exact-content oracle | B |
| A transition decision table needs valid and invalid cases | C, D |
| State setup determines whether a mutant is reached | B, C, D |
| An exact numeric oracle kills an arithmetic mutant | E |
| Mutation testing does not replace specification-based testing | E |

---
*Voice-check: Technical mode applied; zero em/en dashes, no self-narrating prose, no forced rule of three, and direct causal explanations retained.*
