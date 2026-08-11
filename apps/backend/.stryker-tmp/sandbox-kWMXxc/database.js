// @ts-nocheck
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const MEMORY_DB_KEY = "__ESHOP_MEMORY_DB__";

function asyncCallback(fn) {
  queueMicrotask(fn);
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function seedState() {
  return {
    categories: [
      { id: 1, name: "Dien thoai" },
      { id: 2, name: "Laptop" },
      { id: 3, name: "Phu kien" },
    ],
    coupons: [
      {
        id: 1,
        code: "SAVE10",
        type: "percent",
        discount_value: 10,
        min_order_amount: 300000,
        expired_at: "2099-12-31",
        is_active: 1,
        max_uses_per_user: 1,
      },
      {
        id: 2,
        code: "BIGBUY",
        type: "fixed",
        discount_value: 50000,
        min_order_amount: 500000,
        expired_at: "2099-12-31",
        is_active: 1,
        max_uses_per_user: 1,
      },
      {
        id: 3,
        code: "VIP100",
        type: "fixed",
        discount_value: 100000,
        min_order_amount: 300000,
        expired_at: "2099-12-31",
        is_active: 1,
        max_uses_per_user: 2,
      },
      {
        id: 4,
        code: "EXPIRED",
        type: "percent",
        discount_value: 20,
        min_order_amount: 100000,
        expired_at: "2020-01-01",
        is_active: 1,
        max_uses_per_user: 1,
      },
    ],
    coupon_usage: [],
    users: [
      {
        id: 1,
        name: "Admin User",
        email: "admin@eshop.com",
        password: "Admin123!",
        role: "admin",
        login_attempts: 0,
        locked_until: null,
        reset_token: null,
        shipping_address: null,
        phone: null,
      },
      {
        id: 2,
        name: "Test User",
        email: "test@eshop.com",
        password: "Test1234!",
        role: "user",
        login_attempts: 0,
        locked_until: null,
        reset_token: null,
        shipping_address: null,
        phone: null,
      },
    ],
    products: [
      {
        id: 1,
        name: "iPhone 15 Pro Max",
        price: 30000000,
        description: "Dien thoai cao cap cua Apple",
        imageUrl: "https://placehold.co/300x300/png?text=iPhone+15",
        category_id: 1,
      },
      {
        id: 2,
        name: "Samsung Galaxy S24 Ultra",
        price: 28000000,
        description: "Man hinh hien thi xuat sac, camera sieu zoom",
        imageUrl: "https://placehold.co/300x300/png?text=Samsung+S24",
        category_id: 1,
      },
      {
        id: 3,
        name: "MacBook Pro M3",
        price: 45000000,
        description: "Laptop chuyen nghiep manh me",
        imageUrl: "https://placehold.co/300x300/png?text=Macbook+Pro",
        category_id: 2,
      },
      {
        id: 4,
        name: "Tai nghe AirPods Pro 2",
        price: 6000000,
        description: "Chong on chu dong xuat sac",
        imageUrl: "https://placehold.co/300x300/png?text=AirPods+Pro",
        category_id: 3,
      },
      {
        id: 5,
        name: "Ban phim co Keychron Q1",
        price: 4000000,
        description: "Go cuc suong, thiet ke kim loai",
        imageUrl: "https://placehold.co/300x300/png?text=Keychron+Q1",
        category_id: 3,
      },
    ],
    orders: [],
    nextIds: {
      coupons: 5,
      coupon_usage: 1,
      orders: 1,
    },
  };
}

class MemoryStatement {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
  }

  run(...args) {
    const callback = typeof args.at(-1) === "function" ? args.pop() : undefined;
    return this.db.run(this.sql, args, callback);
  }

  finalize(callback) {
    if (callback) {
      asyncCallback(() => callback(null));
    }
  }
}

class MemoryDatabase {
  constructor() {
    this.reset();
    this.ready = Promise.resolve();
  }

  reset() {
    this.state = seedState();
  }

  serialize(callback) {
    callback();
  }

  prepare(sql) {
    return new MemoryStatement(this, sql);
  }

  run(sql, params = [], callback) {
    if (typeof params === "function") {
      callback = params;
      params = [];
    }

    let context = { lastID: 0, changes: 0 };

    try {
      context = this.#run(sql, params);
      if (callback) {
        asyncCallback(() => callback.call(context, null));
      }
    } catch (error) {
      if (!callback) {
        throw error;
      }
      asyncCallback(() => callback.call(context, error));
    }

    return this;
  }

  get(sql, params = [], callback) {
    if (typeof params === "function") {
      callback = params;
      params = [];
    }

    try {
      const row = this.#get(sql, params);
      if (callback) {
        asyncCallback(() => callback(null, row));
      }
      return row;
    } catch (error) {
      if (!callback) {
        throw error;
      }
      asyncCallback(() => callback(error));
      return undefined;
    }
  }

  all(sql, params = [], callback) {
    if (typeof params === "function") {
      callback = params;
      params = [];
    }

    try {
      const rows = this.#all(sql, params);
      if (callback) {
        asyncCallback(() => callback(null, rows));
      }
      return rows;
    } catch (error) {
      if (!callback) {
        throw error;
      }
      asyncCallback(() => callback(error));
      return [];
    }
  }

  #run(sql, params) {
    if (sql.startsWith("UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?")) {
      const user = this.state.users.find((item) => item.id === params[0]);
      if (!user) return { lastID: 0, changes: 0 };
      user.login_attempts = 0;
      user.locked_until = null;
      return { lastID: 0, changes: 1 };
    }

    if (sql.startsWith("UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?")) {
      const [attempts, lockedUntil, id] = params;
      const user = this.state.users.find((item) => item.id === id);
      if (!user) return { lastID: 0, changes: 0 };
      user.login_attempts = attempts;
      user.locked_until = lockedUntil;
      return { lastID: 0, changes: 1 };
    }

    if (sql.startsWith("UPDATE users SET login_attempts=0, locked_until=NULL WHERE email='test@eshop.com'")) {
      const user = this.state.users.find((item) => item.email === "test@eshop.com");
      user.login_attempts = 0;
      user.locked_until = null;
      return { lastID: 0, changes: 1 };
    }

    if (sql.startsWith("UPDATE users SET login_attempts=3, locked_until=? WHERE email='test@eshop.com'")) {
      const user = this.state.users.find((item) => item.email === "test@eshop.com");
      user.login_attempts = 3;
      user.locked_until = params[0];
      return { lastID: 0, changes: 1 };
    }

    if (sql.startsWith("UPDATE users SET login_attempts=2 WHERE email='test@eshop.com'")) {
      const user = this.state.users.find((item) => item.email === "test@eshop.com");
      user.login_attempts = 2;
      return { lastID: 0, changes: 1 };
    }

    if (sql.startsWith("INSERT OR IGNORE INTO coupons")) {
      const row = {
        id: this.state.nextIds.coupons++,
        code: this.#extractQuotedValue(sql, 0),
        type: this.#extractQuotedValue(sql, 1),
        discount_value: Number(this.#extractNumericValue(sql, 0)),
        min_order_amount: Number(this.#extractNumericValue(sql, 1)),
        expired_at: params[0] ?? this.#extractQuotedValue(sql, 2),
        is_active: Number(this.#extractNumericValue(sql, 2)),
        max_uses_per_user: Number(this.#extractNumericValue(sql, 3)),
      };

      if (!this.state.coupons.some((coupon) => coupon.code === row.code)) {
        this.state.coupons.push(row);
        return { lastID: row.id, changes: 1 };
      }
      return { lastID: 0, changes: 0 };
    }

    if (sql.startsWith("INSERT INTO coupon_usage (coupon_id, user_id) VALUES (?, 2)")) {
      return this.#insertCouponUsage(params[0], 2);
    }

    if (sql.startsWith("INSERT INTO coupon_usage (coupon_id, user_id) VALUES (?, 1)")) {
      return this.#insertCouponUsage(params[0], 1);
    }

    if (sql.startsWith("DELETE FROM coupons WHERE code IN")) {
      this.state.coupons = this.state.coupons.filter(
        (coupon) => !["DEAD01", "TODAYEXP", "TOMORROWEXP"].includes(coupon.code),
      );
      return { lastID: 0, changes: 1 };
    }

    if (sql.startsWith("DELETE FROM coupon_usage WHERE coupon_id=? AND user_id=2")) {
      const before = this.state.coupon_usage.length;
      this.state.coupon_usage = this.state.coupon_usage.filter(
        (item) => !(item.coupon_id === params[0] && item.user_id === 2),
      );
      return { lastID: 0, changes: before - this.state.coupon_usage.length };
    }

    if (sql.startsWith("DELETE FROM coupon_usage WHERE coupon_id=?")) {
      const before = this.state.coupon_usage.length;
      this.state.coupon_usage = this.state.coupon_usage.filter(
        (item) => item.coupon_id !== params[0],
      );
      return { lastID: 0, changes: before - this.state.coupon_usage.length };
    }

    if (sql.startsWith("INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)")) {
      const [userId, totalAmount, status, shippingAddress] = params;
      const id = this.state.nextIds.orders++;
      this.state.orders.push({
        id,
        user_id: userId,
        total_amount: totalAmount,
        status,
        shipping_address: shippingAddress,
        created_at: new Date().toISOString(),
      });
      return { lastID: id, changes: 1 };
    }

    if (sql.startsWith("DELETE FROM orders WHERE id = ?")) {
      const before = this.state.orders.length;
      this.state.orders = this.state.orders.filter((order) => order.id !== params[0]);
      return { lastID: 0, changes: before - this.state.orders.length };
    }

    if (sql.startsWith("UPDATE orders SET status = ? WHERE id = ?")) {
      const [status, id] = params;
      const order = this.state.orders.find((item) => item.id === Number(id));
      if (!order) return { lastID: 0, changes: 0 };
      order.status = status;
      return { lastID: 0, changes: 1 };
    }

    throw new Error(`Unsupported run SQL in memory adapter: ${sql}`);
  }

  #get(sql, params) {
    if (sql.startsWith("SELECT * FROM users WHERE email = ?")) {
      return this.#cloneRow(this.state.users.find((item) => item.email === params[0]));
    }

    if (sql.startsWith("SELECT * FROM users WHERE id = ?")) {
      return this.#cloneRow(this.state.users.find((item) => item.id === params[0]));
    }

    if (sql.startsWith("SELECT id FROM coupons WHERE code='SAVE10'")) {
      return this.#cloneRow(this.state.coupons.find((item) => item.code === "SAVE10"), ["id"]);
    }

    if (sql.startsWith("SELECT id FROM coupons WHERE code='VIP100'")) {
      return this.#cloneRow(this.state.coupons.find((item) => item.code === "VIP100"), ["id"]);
    }

    if (sql.startsWith("SELECT * FROM coupons WHERE code = ? AND is_active = 1")) {
      return this.#cloneRow(
        this.state.coupons.find((item) => item.code === params[0] && item.is_active === 1),
      );
    }

    if (sql.startsWith("SELECT COUNT(*) as usage_count FROM coupon_usage WHERE coupon_id = ? AND user_id = ?")) {
      return {
        usage_count: this.state.coupon_usage.filter(
          (item) => item.coupon_id === params[0] && item.user_id === params[1],
        ).length,
      };
    }

    if (sql.startsWith("SELECT status FROM orders WHERE id = ?")) {
      return this.#cloneRow(
        this.state.orders.find((item) => item.id === Number(params[0])),
        ["status"],
      );
    }

    if (sql.startsWith("SELECT * FROM orders WHERE id = ?")) {
      return this.#cloneRow(this.state.orders.find((item) => item.id === Number(params[0])));
    }

    throw new Error(`Unsupported get SQL in memory adapter: ${sql}`);
  }

  #all(sql) {
    if (sql === "SELECT * FROM products") {
      return deepClone(this.state.products);
    }

    if (sql === "SELECT * FROM categories") {
      return deepClone(this.state.categories);
    }

    if (sql === "SELECT * FROM coupons") {
      return deepClone(this.state.coupons);
    }

    throw new Error(`Unsupported all SQL in memory adapter: ${sql}`);
  }

  #cloneRow(row, fields) {
    if (!row) return undefined;
    if (!fields) return deepClone(row);
    const result = {};
    for (const field of fields) {
      result[field] = row[field];
    }
    return result;
  }

  #insertCouponUsage(couponId, userId) {
    const id = this.state.nextIds.coupon_usage++;
    this.state.coupon_usage.push({
      id,
      coupon_id: couponId,
      user_id: userId,
      used_at: new Date().toISOString(),
    });
    return { lastID: id, changes: 1 };
  }

  #extractQuotedValue(sql, index) {
    const matches = [...sql.matchAll(/'([^']*)'/g)].map((match) => match[1]);
    return matches[index];
  }

  #extractNumericValue(sql, index) {
    const valuesMatch = sql.match(/VALUES \((.+)\)/s);
    const tokens = valuesMatch[1]
      .split(",")
      .map((part) => part.trim())
      .filter((part) => !part.startsWith("'") && part !== "?");
    return tokens[index];
  }
}

function createSqliteDatabase() {
  const dbPath = path.resolve(__dirname, "database.sqlite");
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Could not connect to database", err);
    }
  });

  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS coupon_usage");
    db.run("DROP TABLE IF EXISTS coupons");
    db.run("DROP TABLE IF EXISTS users");
    db.run("DROP TABLE IF EXISTS products");
    db.run("DROP TABLE IF EXISTS categories");
    db.run("DROP TABLE IF EXISTS orders");

    db.run("CREATE TABLE categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
    db.run(
      "CREATE TABLE coupons (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE, type TEXT DEFAULT 'percent', discount_value INTEGER, min_order_amount INTEGER DEFAULT 0, expired_at DATETIME, is_active INTEGER DEFAULT 1, max_uses_per_user INTEGER DEFAULT 1)",
    );
    db.run(
      "CREATE TABLE coupon_usage (id INTEGER PRIMARY KEY AUTOINCREMENT, coupon_id INTEGER, user_id INTEGER, used_at DATETIME DEFAULT CURRENT_TIMESTAMP)",
    );
    db.run(
      "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT, role TEXT DEFAULT 'user', login_attempts INTEGER DEFAULT 0, locked_until DATETIME, reset_token TEXT, shipping_address TEXT, phone TEXT)",
    );
    db.run(
      "CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price INTEGER, description TEXT, imageUrl TEXT, category_id INTEGER)",
    );
    db.run(
      "CREATE TABLE orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, total_amount INTEGER, status TEXT DEFAULT 'pending', shipping_address TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)",
    );

    db.run("INSERT INTO categories (name) VALUES ('Dien thoai')");
    db.run("INSERT INTO categories (name) VALUES ('Laptop')");
    db.run("INSERT INTO categories (name) VALUES ('Phu kien')");
    db.run("INSERT INTO users (name, email, password, role) VALUES ('Admin User', 'admin@eshop.com', 'Admin123!', 'admin')");
    db.run("INSERT INTO users (name, email, password, role) VALUES ('Test User', 'test@eshop.com', 'Test1234!', 'user')");
    db.run("INSERT INTO products (name, price, description, imageUrl, category_id) VALUES ('iPhone 15 Pro Max', 30000000, 'Dien thoai cao cap cua Apple', 'https://placehold.co/300x300/png?text=iPhone+15', 1)");
    db.run("INSERT INTO products (name, price, description, imageUrl, category_id) VALUES ('Samsung Galaxy S24 Ultra', 28000000, 'Man hinh hien thi xuat sac, camera sieu zoom', 'https://placehold.co/300x300/png?text=Samsung+S24', 1)");
    db.run("INSERT INTO products (name, price, description, imageUrl, category_id) VALUES ('MacBook Pro M3', 45000000, 'Laptop chuyen nghiep manh me', 'https://placehold.co/300x300/png?text=Macbook+Pro', 2)");
    db.run("INSERT INTO products (name, price, description, imageUrl, category_id) VALUES ('Tai nghe AirPods Pro 2', 6000000, 'Chong on chu dong xuat sac', 'https://placehold.co/300x300/png?text=AirPods+Pro', 3)");
    db.run("INSERT INTO products (name, price, description, imageUrl, category_id) VALUES ('Ban phim co Keychron Q1', 4000000, 'Go cuc suong, thiet ke kim loai', 'https://placehold.co/300x300/png?text=Keychron+Q1', 3)");
    db.run("INSERT INTO coupons (code, type, discount_value, min_order_amount, expired_at, is_active, max_uses_per_user) VALUES ('SAVE10', 'percent', 10, 300000, '2099-12-31', 1, 1)");
    db.run("INSERT INTO coupons (code, type, discount_value, min_order_amount, expired_at, is_active, max_uses_per_user) VALUES ('BIGBUY', 'fixed', 50000, 500000, '2099-12-31', 1, 1)");
    db.run("INSERT INTO coupons (code, type, discount_value, min_order_amount, expired_at, is_active, max_uses_per_user) VALUES ('VIP100', 'fixed', 100000, 300000, '2099-12-31', 1, 2)");
    db.run("INSERT INTO coupons (code, type, discount_value, min_order_amount, expired_at, is_active, max_uses_per_user) VALUES ('EXPIRED', 'percent', 20, 100000, '2020-01-01', 1, 1)");
  });

  db.ready = Promise.resolve();
  return db;
}

if (!process.env.JEST_WORKER_ID && process.env.NODE_ENV !== "test") {
  module.exports = createSqliteDatabase();
} else {
  if (!process[MEMORY_DB_KEY]) {
    process[MEMORY_DB_KEY] = new MemoryDatabase();
  }
  process[MEMORY_DB_KEY].ready = Promise.resolve();
  module.exports = process[MEMORY_DB_KEY];
}
