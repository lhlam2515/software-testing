const app = require('../server');
const db = require('../database');
const { getAuthToken } = require('./helpers/auth');
const { createApi } = require('./helpers/http');

const api = createApi(app);

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) =>
    db.run(sql, params, function onRun(err) {
      if (err) reject(err);
      else resolve(this);
    })
  );
}

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) =>
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)))
  );
}

async function createOrder(status = 'pending', total = 100000) {
  const result = await dbRun(
    'INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)',
    [2, total, status, `T3b order-status ${status}`]
  );
  return result.lastID;
}

async function deleteOrder(orderId) {
  await dbRun('DELETE FROM orders WHERE id = ?', [orderId]);
}

beforeAll(async () => {
  await db.ready;
});

describe('PUT /api/admin/orders/:id/status - T3b baseline', () => {
  const adminToken = getAuthToken(1);
  const authHeader = `Bearer ${adminToken}`;
  const createdOrderIds = [];

  afterEach(async () => {
    while (createdOrderIds.length > 0) {
      await deleteOrder(createdOrderIds.pop());
    }
  });

  it('returns 200 and updates status when transition is pending to confirmed', async () => {
    const orderId = await createOrder('pending');
    createdOrderIds.push(orderId);

    const res = await api
      .put(`/api/admin/orders/${orderId}/status`)
      .set('Authorization', authHeader)
      .send({ status: 'confirmed' });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/updated/i);

    const row = await dbGet('SELECT status FROM orders WHERE id = ?', [orderId]);
    expect(row.status).toBe('confirmed');
  });

  it('returns 200 and updates status when transition is confirmed to shipping', async () => {
    const orderId = await createOrder('confirmed');
    createdOrderIds.push(orderId);

    const res = await api
      .put(`/api/admin/orders/${orderId}/status`)
      .set('Authorization', authHeader)
      .send({ status: 'shipping' });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/updated/i);

    const row = await dbGet('SELECT status FROM orders WHERE id = ?', [orderId]);
    expect(row.status).toBe('shipping');
  });

  it('returns 200 and updates status when transition is shipping to delivered', async () => {
    const orderId = await createOrder('shipping');
    createdOrderIds.push(orderId);

    const res = await api
      .put(`/api/admin/orders/${orderId}/status`)
      .set('Authorization', authHeader)
      .send({ status: 'delivered' });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/updated/i);

    const row = await dbGet('SELECT status FROM orders WHERE id = ?', [orderId]);
    expect(row.status).toBe('delivered');
  });

  it('returns 200 and updates status when transition is canceled to delivered', async () => {
    const orderId = await createOrder('canceled');
    createdOrderIds.push(orderId);

    const res = await api
      .put(`/api/admin/orders/${orderId}/status`)
      .set('Authorization', authHeader)
      .send({ status: 'delivered' });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/updated/i);

    const row = await dbGet('SELECT status FROM orders WHERE id = ?', [orderId]);
    expect(row.status).toBe('delivered');
  });

  it('returns 400 when transition is pending to delivered', async () => {
    const orderId = await createOrder('pending');
    createdOrderIds.push(orderId);

    const res = await api
      .put(`/api/admin/orders/${orderId}/status`)
      .set('Authorization', authHeader)
      .send({ status: 'delivered' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid state transition/i);

    const row = await dbGet('SELECT status FROM orders WHERE id = ?', [orderId]);
    expect(row.status).toBe('pending');
  });

  it('returns 404 when order id does not exist', async () => {
    const res = await api
      .put('/api/admin/orders/999999/status')
      .set('Authorization', authHeader)
      .send({ status: 'confirmed' });

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});
