import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

const DB_PATH =
  process.env.DB_PATH ?? path.resolve(process.cwd(), '../../../apps/backend/database.sqlite');

function open() {
  return new DatabaseSync(DB_PATH);
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

export function getCouponByCode(code: string) {
  const db = open();
  try {
    return db.prepare('SELECT * FROM coupons WHERE code = ?').get(code);
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
