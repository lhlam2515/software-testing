// @ts-nocheck
const app = require('../server');
// Use cached db instance (required by server.js) — avoids re-seeding the database
const db = require('../database');
const { createApi } = require('./helpers/http');

const api = createApi(app);

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) =>
    db.run(sql, params, err => (err ? reject(err) : resolve()))
  );
}

beforeAll(async () => {
  await db.ready;
});

// Reset test account to clean state before every test
beforeEach(async () => {
  await dbRun(
    "UPDATE users SET login_attempts=0, locked_until=NULL WHERE email='test@eshop.com'"
  );
});

// ─── EP (Equivalence Partitioning) ───────────────────────────────────────────

describe('POST /api/login — EP', () => {

  // TC-01 — happy path: correct credentials
  it('returns 200 and token when credentials are correct', async () => {
    const res = await api
      .post('/api/login')
      .send({ email: 'test@eshop.com', password: 'Test1234!' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user).toBeDefined();
  });

  // TC-04 — email not registered
  it('returns 401 when email is not registered', async () => {
    const res = await api
      .post('/api/login')
      .send({ email: 'notfound@example.com', password: 'Test1234!' });

    expect(res.status).toBe(401);
    expect(res.body.token).toBeUndefined();
  });

  // TC-05 — empty password (sent as empty string, does not match stored password)
  it('returns 401 when password is empty', async () => {
    const res = await api
      .post('/api/login')
      .send({ email: 'test@eshop.com', password: '' });

    expect(res.status).toBe(401);
    expect(res.body.token).toBeUndefined();
  });

  // TC-06 — wrong password
  it('returns 401 when password is wrong', async () => {
    const res = await api
      .post('/api/login')
      .send({ email: 'test@eshop.com', password: 'WrongPass1!' });

    expect(res.status).toBe(401);
    expect(res.body.token).toBeUndefined();
    expect(res.body.error).toBeTruthy();
  });

  describe('when account is locked', () => {
    // beforeEach (not beforeAll) so it runs AFTER the outer beforeEach reset,
    // ensuring the locked state is set last
    beforeEach(async () => {
      const future = new Date(Date.now() + 120000).toISOString();
      await dbRun(
        "UPDATE users SET login_attempts=3, locked_until=? WHERE email='test@eshop.com'",
        [future]
      );
    });

    // TC-07 — correct credentials but account is locked → 403
    it('returns 403 when account is locked even with correct credentials', async () => {
      const res = await api
        .post('/api/login')
        .send({ email: 'test@eshop.com', password: 'Test1234!' });

      expect(res.status).toBe(403);
      expect(res.body.token).toBeUndefined();
      expect(res.body.error).toBeTruthy();
    });
  });
});

// ─── BVA (Boundary Value Analysis) ───────────────────────────────────────────

describe('POST /api/login — BVA', () => {

  // ── Target 1: login_attempts lock threshold = 3 ──────────────────────────

  describe('login_attempts boundary (lock threshold = 3)', () => {

    // TC-BVA-02 — UB of valid class: login_attempts=2, success → counter resets to 0
    it('returns 200 and resets counter when login succeeds at login_attempts=2 (UB valid class)', async () => {
      await dbRun(
        "UPDATE users SET login_attempts=2 WHERE email='test@eshop.com'"
      );

      const res = await api
        .post('/api/login')
        .send({ email: 'test@eshop.com', password: 'Test1234!' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeTruthy();
      // Verify counter reset: one more wrong password should give 401 (not 403)
      const afterRes = await api
        .post('/api/login')
        .send({ email: 'test@eshop.com', password: 'WrongPass1!' });
      expect(afterRes.status).toBe(401); // not 403 — counter was reset, not locked yet
    });

    // TC-BVA-01 — ON point transition: login_attempts=2, fail once → lock triggered
    it('locks account on failure when login_attempts=2 (ON point: 2 → locked)', async () => {
      await dbRun(
        "UPDATE users SET login_attempts=2 WHERE email='test@eshop.com'"
      );

      // Submit wrong password — triggers lock (2+2=4 >= 3 due to BUG counter +2)
      const failRes = await api
        .post('/api/login')
        .send({ email: 'test@eshop.com', password: 'WrongPass1!' });
      expect(failRes.status).toBe(401);

      // Immediately try with correct credentials → must be locked now
      const lockedRes = await api
        .post('/api/login')
        .send({ email: 'test@eshop.com', password: 'Test1234!' });
      expect(lockedRes.status).toBe(403);
    });
  });

  // ── Target 2: locked_until window boundary ────────────────────────────────

  describe('locked_until window boundary', () => {

    // TC-BVA-03 — UB-1: locked_until = NOW()+1s → still inside window → 403
    it('returns 403 when 1 second remains in lock window (UB-1: locked_until = now+1s)', async () => {
      const oneSecondAhead = new Date(Date.now() + 1000).toISOString();
      await dbRun(
        "UPDATE users SET login_attempts=3, locked_until=? WHERE email='test@eshop.com'",
        [oneSecondAhead]
      );

      const res = await api
        .post('/api/login')
        .send({ email: 'test@eshop.com', password: 'Test1234!' });

      expect(res.status).toBe(403);
      expect(res.body.token).toBeUndefined();
    });

    // TC-BVA-04 — UB: freeze the server clock so equality is deterministic
    it('returns 200 when locked_until exactly equals the server clock (UB: locked_until = now)', async () => {
      const RealDate = global.Date;
      const frozen = new RealDate('2026-07-03T10:00:00.000Z');

      class FrozenDate extends RealDate {
        constructor(...args) {
          super(...(args.length === 0 ? [frozen.getTime()] : args));
        }

        static now() {
          return frozen.getTime();
        }
      }
      FrozenDate.parse = RealDate.parse;
      FrozenDate.UTC = RealDate.UTC;

      try {
        global.Date = FrozenDate;
        await dbRun(
          "UPDATE users SET login_attempts=3, locked_until=? WHERE email='test@eshop.com'",
          [frozen.toISOString()]
        );

        const res = await api
          .post('/api/login')
          .send({ email: 'test@eshop.com', password: 'Test1234!' });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeTruthy();
      } finally {
        global.Date = RealDate;
      }
    });

    // TC-BVA-05 — UB+1: locked_until = NOW()-1s → clearly past expiry → 200
    it('returns 200 when lock expired 1 second ago (UB+1: locked_until = now-1s)', async () => {
      const oneSecondAgo = new Date(Date.now() - 1000).toISOString();
      await dbRun(
        "UPDATE users SET login_attempts=3, locked_until=? WHERE email='test@eshop.com'",
        [oneSecondAgo]
      );

      const res = await api
        .post('/api/login')
        .send({ email: 'test@eshop.com', password: 'Test1234!' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeTruthy();
    });
  });
});
