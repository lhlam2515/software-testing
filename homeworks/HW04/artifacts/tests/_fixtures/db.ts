import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

const DB_PATH =
  process.env.DB_PATH ?? path.resolve(process.cwd(), '../../../apps/backend/database.sqlite');

function open() {
  const db = new DatabaseSync(DB_PATH);
  // The backend server holds its own connection to the same file. Without WAL
  // + a busy timeout, a read/write here racing a server-side query throws
  // "database is locked" instead of waiting — flaky, not a real assertion
  // failure. See TEST_PLAN.md §8 risk #5 (tests must not depend on timing).
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA busy_timeout = 5000;');
  return db;
}

export interface UserLoginState {
  login_attempts: number;
  locked_until: string | null;
}

export function getUserLoginState(email: string): UserLoginState {
  const db = open();
  try {
    const row = db
      .prepare('SELECT login_attempts, locked_until FROM users WHERE email = ?')
      .get(email) as UserLoginState | undefined;
    if (!row) throw new Error(`User not found: ${email}`);
    return row;
  } finally {
    db.close();
  }
}

export function setUserLoginState(email: string, state: Partial<UserLoginState>): void {
  const db = open();
  try {
    const current = db
      .prepare('SELECT login_attempts, locked_until FROM users WHERE email = ?')
      .get(email) as UserLoginState | undefined;
    if (!current) throw new Error(`User not found: ${email}`);
    const next = { ...current, ...state };
    db.prepare('UPDATE users SET login_attempts = ?, locked_until = ? WHERE email = ?').run(
      next.login_attempts,
      next.locked_until,
      email,
    );
  } finally {
    db.close();
  }
}

export function resetUserLoginState(email: string): void {
  setUserLoginState(email, { login_attempts: 0, locked_until: null });
}

export interface CouponRow {
  id: number;
  code: string;
  type: string;
  discount_value: number;
  min_order_amount: number;
  expired_at: string;
  is_active: number;
  max_uses_per_user: number;
}

export function getCouponByCode(code: string): CouponRow | undefined {
  const db = open();
  try {
    return db.prepare('SELECT * FROM coupons WHERE code = ?').get(code) as
      | CouponRow
      | undefined;
  } finally {
    db.close();
  }
}

export interface NewCoupon {
  code: string;
  type: string;
  discount_value: number;
  min_order_amount: number;
  expired_at: string;
  max_uses_per_user: number;
}

/**
 * Deletes any prior coupon (+ its usage rows) with the same code first, so
 * re-running a case always starts from the exact coupon the TC declares —
 * same idempotent-arrange idea as resetUserLoginState.
 */
export function createCoupon(coupon: NewCoupon): void {
  const db = open();
  try {
    const existing = db.prepare('SELECT id FROM coupons WHERE code = ?').get(coupon.code) as
      | { id: number }
      | undefined;
    if (existing) {
      db.prepare('DELETE FROM coupon_usage WHERE coupon_id = ?').run(existing.id);
      db.prepare('DELETE FROM coupons WHERE id = ?').run(existing.id);
    }
    db.prepare(
      `INSERT INTO coupons (code, type, discount_value, min_order_amount, expired_at, is_active, max_uses_per_user)
       VALUES (?, ?, ?, ?, ?, 1, ?)`,
    ).run(
      coupon.code,
      coupon.type,
      coupon.discount_value,
      coupon.min_order_amount,
      coupon.expired_at,
      coupon.max_uses_per_user,
    );
  } finally {
    db.close();
  }
}

export function deactivateCoupon(code: string): void {
  const db = open();
  try {
    db.prepare('UPDATE coupons SET is_active = 0 WHERE code = ?').run(code);
  } finally {
    db.close();
  }
}

export function recordCouponUsage(couponId: number, userId: number): void {
  const db = open();
  try {
    db.prepare('INSERT INTO coupon_usage (coupon_id, user_id) VALUES (?, ?)').run(
      couponId,
      userId,
    );
  } finally {
    db.close();
  }
}

export interface OrderRow {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
}

export function getLatestOrderForUser(userId: number): OrderRow | undefined {
  const db = open();
  try {
    return db
      .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 1')
      .get(userId) as OrderRow | undefined;
  } finally {
    db.close();
  }
}

export function getCouponUsageCount(couponId: number, userId: number): number {
  const db = open();
  try {
    const row = db
      .prepare('SELECT COUNT(*) as count FROM coupon_usage WHERE coupon_id = ? AND user_id = ?')
      .get(couponId, userId) as { count: number };
    return row.count;
  } finally {
    db.close();
  }
}

export function resetCouponUsage(couponId: number, userId: number): void {
  const db = open();
  try {
    db.prepare('DELETE FROM coupon_usage WHERE coupon_id = ? AND user_id = ?').run(
      couponId,
      userId,
    );
  } finally {
    db.close();
  }
}

export function countProducts(): number {
  const db = open();
  try {
    const row = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
    return row.count;
  } finally {
    db.close();
  }
}

export function getProductByName(name: string) {
  const db = open();
  try {
    return db.prepare('SELECT * FROM products WHERE name = ?').get(name);
  } finally {
    db.close();
  }
}

export function deleteProductsByName(names: string[]): void {
  if (names.length === 0) return;
  const db = open();
  try {
    const stmt = db.prepare('DELETE FROM products WHERE name = ?');
    for (const name of names) stmt.run(name);
  } finally {
    db.close();
  }
}
