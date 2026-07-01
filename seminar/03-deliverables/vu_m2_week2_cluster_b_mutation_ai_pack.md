# Vũ (M2) - Week 2 Cluster B Mutation and AI Pack

## 1. Scope and Sources

| Source | Use |
|---|---|
| `02-planning/weekly-checklist.md` | Confirms Week 2 tasks T5b, T6b, T7b, T8, and the Cluster B failure-mode note assigned to Vũ (M2). |
| `02-planning/task-assignment.md` | Confirms Cluster B ownership: `order-status` (FR-10) and `cart/checkout` (FR-08). |
| `02-planning/test-convention.md` | Provides the expected Jest/supertest test style and file ownership for `order-status.test.js` and `cart.test.js`. |
| `apps/backend/server.js` | Source inspected for Cluster B mutation targets: cart, checkout, and admin order status routes. |
| `apps/backend/__tests__/order-status.test.js` | Week 1 context: existing T3b baseline tests for FR-10. |
| `apps/backend/__tests__/cart.test.js` | Week 1 context: existing T3b baseline tests for FR-08. |
| `seminar/01-research/BASELINE.md` | Checked for Week 2 baseline metrics; currently a placeholder, so numeric mutation results are not claimed. |

## 2. T5b - Survivor Classification and Selected Mutants

| Candidate ID | Route / Area | Source Location | Mutant Pattern | Classification | Why It May Survive Current T3b Baseline | Selected |
|---|---|---|---|---|---|---|
| M2B-01 | `PUT /api/admin/orders/:id/status` | `apps/backend/server.js:538-541` | Change or remove the `status === "canceled"` branch from the `pending` transition. | Real test gap | Existing tests cover `pending -> confirmed` and `pending -> delivered` rejection, but do not cover valid `pending -> canceled`. | Yes |
| M2B-02 | `PUT /api/admin/orders/:id/status` | `apps/backend/server.js:543-546` | Change or remove the `status === "canceled"` branch from the `confirmed` transition. | Real test gap | Existing tests cover `confirmed -> shipping`, but do not cover valid `confirmed -> canceled`. | Yes |
| M2B-03 | `PUT /api/admin/orders/:id/status` | `apps/backend/server.js:550-551` | The implementation allows `canceled -> delivered`. | Product/spec defect candidate, not accepted as a kill assertion yet | A test for the intended state machine should reject this transition, but it would fail against the current original source. | No, log as defect/question |
| M2B-04 | `POST /api/checkout` | `apps/backend/server.js:297-306` | Missing validation for negative or missing `total_amount` / `shipping_address`. | Requirement gap / unclear oracle | Current tests assert successful checkout persistence and unauthenticated rejection, but planning does not define validation rules for malformed checkout input. | No, move to questions |

## 3. T6b - Kill Assertions for Selected Cluster B Survivors

These assertions are designed to pass on the current original source and fail on the selected mutants. They should be added to `apps/backend/__tests__/order-status.test.js` during implementation, but this deliverable records them only because this task may update files only inside `03-deliverables/`.

```js
it('returns 200 and updates status when transition is pending to canceled', async () => {
  const orderId = await createOrder('pending');
  createdOrderIds.push(orderId);

  const res = await request(app)
    .put(`/api/admin/orders/${orderId}/status`)
    .set('Authorization', authHeader)
    .send({ status: 'canceled' });

  expect(res.status).toBe(200);
  expect(res.body.message).toMatch(/updated/i);

  const row = await dbGet('SELECT status FROM orders WHERE id = ?', [orderId]);
  expect(row.status).toBe('canceled');
});

it('returns 200 and updates status when transition is confirmed to canceled', async () => {
  const orderId = await createOrder('confirmed');
  createdOrderIds.push(orderId);

  const res = await request(app)
    .put(`/api/admin/orders/${orderId}/status`)
    .set('Authorization', authHeader)
    .send({ status: 'canceled' });

  expect(res.status).toBe(200);
  expect(res.body.message).toMatch(/updated/i);

  const row = await dbGet('SELECT status FROM orders WHERE id = ?', [orderId]);
  expect(row.status).toBe('canceled');
});
```

## 4. T7b - AI Assertion Synthesis and Validation Gate

### Prompt Used for M2B-01 / M2B-02

```text
You are an expert in Node.js API testing with Jest and supertest.
Source under test: the EShop admin order-status route in apps/backend/server.js.
Existing tests cover pending->confirmed, confirmed->shipping, shipping->delivered,
pending->delivered rejection, and unknown order rejection.

Target survivor:
- A mutant removes or changes the allowed canceled transition from pending or confirmed.

Write one focused supertest test that:
1. passes on the original implementation,
2. fails when the target transition is removed,
3. asserts both HTTP response and persisted database state,
4. follows the existing helper style in order-status.test.js.
Return only the Jest test code.
```

### Validation Gate Record

| Candidate | Original Must Pass | Target Mutant Must Fail | Other Mutants / Regression Notes | Decision |
|---|---|---|---|---|
| M2B-01 pending-to-canceled assertion | Pending execution | Pending execution | Should also protect the route's persisted-state oracle, not just HTTP status. | Accept for execution |
| M2B-02 confirmed-to-canceled assertion | Pending execution | Pending execution | Complements existing `confirmed -> shipping`; avoids overfitting to one branch. | Accept for execution |
| M2B-03 canceled-to-delivered rejection | Would fail on current source | Would likely fail/pass depending on mutant | Indicates a likely state-machine defect in the SUT, so it is not a valid mutation-kill assertion until the product behavior is clarified/fixed. | Reject for T6b; log as question |

## 5. Cluster B Failure Mode for User Guide F4

| Failure Mode | Evidence from Cluster B | Risk | Mitigation |
|---|---|---|---|
| State-machine survivors can hide in untested valid transitions. | Existing order-status baseline tests cover the main happy path chain and one invalid transition, but miss valid cancel transitions from `pending` and `confirmed`. | Mutation score may overstate confidence in FR-10 because the test suite proves only the forward delivery path, not the cancel path. | For each state-machine branch, assert one valid transition and one invalid transition, and verify persisted state after the API response. |

## 6. Assumptions and Questions

| Item | Description | Impact |
|---|---|---|
| A1 | No real Stryker report was available in `03-deliverables/` or `01-research/BASELINE.md`; `BASELINE.md` still contains TODO placeholders. | Candidate survivors are source/test based and need confirmation in the Stryker HTML report. |
| Q1 | Should FR-10 allow `canceled -> delivered`? The current source permits it, but that appears inconsistent with an order state machine. | Determines whether M2B-03 becomes a product defect test after source correction or remains out of scope. |
| Q2 | Should checkout reject negative totals, zero totals, or missing shipping addresses? | Determines whether cart/checkout validation mutants can be classified as real gaps or unclear-oracle cases. |
