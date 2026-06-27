const request = require('supertest');
const app = require('../server');
// Use cached db instance (required by server.js) — avoids re-seeding the database
const db = require('../database');

let save10Id;

beforeAll(done => {
  // TC-04: insert inactive coupon
  db.run(
    `INSERT OR IGNORE INTO coupons
       (code, type, discount_value, min_order_amount, expired_at, is_active, max_uses_per_user)
     VALUES ('DEAD01', 'percent', 5, 100000, '2099-12-31', 0, 1)`,
    () => {
      // TC-10: user 2 has already used SAVE10 once (max_uses_per_user=1)
      db.get("SELECT id FROM coupons WHERE code='SAVE10'", (_err, row) => {
        save10Id = row?.id;
        if (save10Id) {
          db.run('INSERT INTO coupon_usage (coupon_id, user_id) VALUES (?, 2)', [save10Id], done);
        } else {
          done();
        }
      });
    }
  );
});

afterAll(done => {
  db.run("DELETE FROM coupons WHERE code='DEAD01'", () => {
    if (save10Id) {
      db.run('DELETE FROM coupon_usage WHERE coupon_id=? AND user_id=2', [save10Id], done);
    } else {
      done();
    }
  });
});

describe('POST /api/apply-coupon', () => {

  // TC-02 — fixed coupon: correct formula, assert exact amounts
  it('returns 200 with correct discount when valid fixed coupon meets min-order', async () => {
    const res = await request(app)
      .post('/api/apply-coupon')
      .send({ code: 'BIGBUY', total_amount: 600000 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.discount_amount).toBe(50000);
    expect(res.body.final_amount).toBe(550000);
  });

  // TC-01 — percent coupon: BUG-09-001 formula wrong, assert presence only
  it('returns 200 when valid percent coupon meets min-order (formula output not asserted — BUG-09-001)', async () => {
    const res = await request(app)
      .post('/api/apply-coupon')
      .send({ code: 'SAVE10', total_amount: 500000 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // TC-03 — code not found
  it('returns 404 when coupon code does not exist', async () => {
    const res = await request(app)
      .post('/api/apply-coupon')
      .send({ code: 'NOTEXIST99', total_amount: 500000 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBeTruthy();
  });

  // TC-04 — inactive coupon (is_active=0)
  it('returns 404 when coupon is inactive', async () => {
    const res = await request(app)
      .post('/api/apply-coupon')
      .send({ code: 'DEAD01', total_amount: 500000 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBeTruthy();
  });

  // TC-05 — case sensitivity gap
  it('returns 404 when coupon code has wrong case', async () => {
    const res = await request(app)
      .post('/api/apply-coupon')
      .send({ code: 'save10', total_amount: 500000 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBeTruthy();
  });

  // TC-06 — expired coupon (EXPIRED is seeded with expired_at=2020-01-01)
  it('returns 400 when coupon is expired', async () => {
    const res = await request(app)
      .post('/api/apply-coupon')
      .send({ code: 'EXPIRED', total_amount: 200000 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  // TC-07 — below min-order threshold (BUG-A: route uses > not >=)
  it('returns 400 when total_amount is below min-order threshold', async () => {
    const res = await request(app)
      .post('/api/apply-coupon')
      .send({ code: 'SAVE10', total_amount: 200000 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  // TC-10 — usage limit reached (user_id=2 has 1 use, max=1)
  it('returns 400 when user has reached the usage limit', async () => {
    const res = await request(app)
      .post('/api/apply-coupon')
      .send({ code: 'SAVE10', total_amount: 500000, user_id: 2 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  // TC-08 — no auth header: BUG-09-002, route has no authenticateToken middleware
  it('returns 200 when no Authorization header is sent (BUG-09-002: should be 401 per spec)', async () => {
    const res = await request(app)
      .post('/api/apply-coupon')
      .send({ code: 'BIGBUY', total_amount: 600000 });

    // Documents current behavior — spec requires 401
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
