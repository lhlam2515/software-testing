const request = require('supertest');
const app = require('../server');
// Use cached db instance (required by server.js) — avoids re-seeding the database
const db = require('../database');

// Reset test account to clean state before every test
beforeEach(done => {
  db.run(
    "UPDATE users SET login_attempts=0, locked_until=NULL WHERE email='test@eshop.com'",
    done
  );
});

describe('POST /api/login', () => {

  // TC-01 — happy path: correct credentials
  it('returns 200 and token when credentials are correct', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'test@eshop.com', password: 'Test1234!' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user).toBeDefined();
  });

  // TC-04 — email not registered
  it('returns 401 when email is not registered', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'notfound@example.com', password: 'Test1234!' });

    expect(res.status).toBe(401);
    expect(res.body.token).toBeUndefined();
  });

  // TC-05 — empty password (sent as empty string, does not match stored password)
  it('returns 401 when password is empty', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'test@eshop.com', password: '' });

    expect(res.status).toBe(401);
    expect(res.body.token).toBeUndefined();
  });

  // TC-06 — wrong password
  it('returns 401 when password is wrong', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'test@eshop.com', password: 'WrongPass1!' });

    expect(res.status).toBe(401);
    expect(res.body.token).toBeUndefined();
    expect(res.body.error).toBeTruthy();
  });

  describe('when account is locked', () => {
    // beforeEach (not beforeAll) so it runs AFTER the outer beforeEach reset,
    // ensuring the locked state is set last
    beforeEach(done => {
      const future = new Date(Date.now() + 120000).toISOString();
      db.run(
        "UPDATE users SET login_attempts=3, locked_until=? WHERE email='test@eshop.com'",
        [future],
        done
      );
    });

    // TC-07 — correct credentials but account is locked → 403
    it('returns 403 when account is locked even with correct credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ email: 'test@eshop.com', password: 'Test1234!' });

      expect(res.status).toBe(403);
      expect(res.body.token).toBeUndefined();
      expect(res.body.error).toBeTruthy();
    });
  });
});
