const request = require('supertest');
const app = require('../server');
const db = require('../database');
const { getAuthToken } = require('./helpers/auth');

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

describe('Cart and checkout routes - T3b baseline', () => {
  const userToken = getAuthToken(2);
  const authHeader = `Bearer ${userToken}`;
  const createdOrderIds = [];

  afterEach(async () => {
    while (createdOrderIds.length > 0) {
      await dbRun('DELETE FROM orders WHERE id = ?', [createdOrderIds.pop()]);
    }
  });

  it('returns 401 when cart is requested without token', async () => {
    const res = await request(app).get('/api/cart');

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/unauthorized/i);
  });

  it('returns 200 and an array when authenticated user requests cart', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', authHeader);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 200 and stores item when authenticated user adds item to cart', async () => {
    const item = {
      id: 3,
      name: 'MacBook Pro M3',
      price: 45000000,
      quantity: 1,
    };

    const addRes = await request(app)
      .post('/api/cart')
      .set('Authorization', authHeader)
      .send(item);

    expect(addRes.status).toBe(200);
    expect(addRes.body.message).toMatch(/added/i);

    const listRes = await request(app)
      .get('/api/cart')
      .set('Authorization', authHeader);

    expect(listRes.status).toBe(200);
    expect(listRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }),
      ])
    );
  });

  it('returns 200 and creates pending order when checkout is authenticated', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .set('Authorization', authHeader)
      .send({
        total_amount: 45000000,
        shipping_address: 'T3b checkout address',
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/checkout successful/i);
    expect(res.body.orderId).toBeTruthy();
    createdOrderIds.push(res.body.orderId);

    const order = await dbGet('SELECT * FROM orders WHERE id = ?', [res.body.orderId]);
    expect(order.user_id).toBe(2);
    expect(order.total_amount).toBe(45000000);
    expect(order.status).toBe('pending');
    expect(order.shipping_address).toBe('T3b checkout address');
  });

  it('returns 401 when checkout is requested without token', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .send({
        total_amount: 45000000,
        shipping_address: 'Unauthorized checkout address',
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/unauthorized/i);
  });
});
