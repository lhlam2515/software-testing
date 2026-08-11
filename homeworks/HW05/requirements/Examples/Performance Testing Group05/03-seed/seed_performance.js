const fs = require('fs');
const net = require('net');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const projectRoot = path.resolve(__dirname, '..');
const testDataDir = path.join(projectRoot, 'test-data');
const workingDbPath = path.join(__dirname, 'database.sqlite');
const baselineDbPath = path.join(__dirname, 'database.performance.baseline.sqlite');
const temporaryDbPath = path.join(__dirname, 'database.performance.tmp.sqlite');

const categories = [
  'Smartphones',
  'Laptops',
  'Tablets',
  'Audio',
  'Keyboards',
  'Mice',
  'Monitors',
  'Accessories',
];

const addresses = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  recipient: `Load Test User ${String(index + 1).padStart(2, '0')}`,
  phone: `090000${String(index + 1).padStart(4, '0')}`,
  address: `${100 + index} Performance Test Street, District ${(index % 10) + 1}, Ho Chi Minh City`,
}));

const users = Array.from({ length: 50 }, (_, index) => {
  const number = index + 1;
  const address = addresses[index % addresses.length];
  return {
    id: number + 1,
    name: `Load Test User ${String(number).padStart(2, '0')}`,
    email: number === 1 ? 'test@eshop.com' : `loadtest${String(number).padStart(2, '0')}@eshop.com`,
    password: 'Test1234!',
    role: 'user',
    shipping_address: address.address,
    phone: address.phone,
  };
});

const products = Array.from({ length: 500 }, (_, index) => {
  const id = index + 1;
  const categoryId = (index % categories.length) + 1;
  const category = categories[categoryId - 1];
  const price = 600000 + ((index * 137000) % 49400000);
  return {
    id,
    name: `${category} Performance Product ${String(id).padStart(3, '0')}`,
    price,
    description: `Deterministic performance-test product ${id} in ${category}.`,
    imageUrl: `https://placehold.co/300x300/png?text=Product+${id}`,
    category_id: categoryId,
  };
});

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port });
    socket.setTimeout(500);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    const finishClosed = () => {
      socket.destroy();
      resolve(false);
    };
    socket.once('error', finishClosed);
    socket.once('timeout', finishClosed);
  });
}

function openDatabase(filePath) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(filePath, (error) => {
      if (error) reject(error);
      else resolve(db);
    });
  });
}

function exec(db, sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (error) => (error ? reject(error) : resolve()));
  });
}

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) reject(error);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => (error ? reject(error) : resolve(row)));
  });
}

function close(db) {
  return new Promise((resolve, reject) => {
    db.close((error) => (error ? reject(error) : resolve()));
  });
}

function csvEscape(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeTestDataFiles() {
  fs.mkdirSync(testDataDir, { recursive: true });
  const credentialRows = users.map(({ id, email, password }) => ({ id, email, password }));
  fs.writeFileSync(
    path.join(testDataDir, 'users.json'),
    `${JSON.stringify(credentialRows, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(testDataDir, 'addresses.json'),
    `${JSON.stringify(addresses, null, 2)}\n`,
  );

  const headers = ['id', 'name', 'price', 'description', 'imageUrl', 'category_id'];
  const rows = products.map((product) => headers.map((header) => csvEscape(product[header])).join(','));
  fs.writeFileSync(
    path.join(testDataDir, 'products_500.csv'),
    `${headers.join(',')}\n${rows.join('\n')}\n`,
  );

  const manifest = {
    generated_at: new Date().toISOString(),
    deterministic_ids: true,
    admin: { id: 1, email: 'admin@eshop.com', password: 'Admin123!' },
    counts: {
      categories: categories.length,
      products: products.length,
      test_users: users.length,
      admin_users: 1,
      shipping_addresses: addresses.length,
      load_test_coupons: 1,
      orders: 0,
      coupon_usage: 0,
    },
    coupon: {
      id: 1,
      code: 'LOADTEST',
      type: 'fixed',
      discount_value: 50000,
      min_order_amount: 300000,
      expired_at: '2099-12-31',
      max_uses_per_user: 1000000,
    },
  };
  fs.writeFileSync(
    path.join(testDataDir, 'seed-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
}

async function seed() {
  if (await isPortOpen(3000)) {
    throw new Error('Backend is listening on port 3000. Stop server.js before seeding the database.');
  }

  fs.rmSync(temporaryDbPath, { force: true });
  const db = await openDatabase(temporaryDbPath);

  try {
    await exec(db, `
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = DELETE;
      PRAGMA synchronous = FULL;

      CREATE TABLE categories (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );

      CREATE TABLE coupons (
        id INTEGER PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL DEFAULT 'percent',
        discount_value INTEGER NOT NULL,
        min_order_amount INTEGER NOT NULL DEFAULT 0,
        expired_at DATETIME NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        max_uses_per_user INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE coupon_usage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        coupon_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (coupon_id) REFERENCES coupons(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        login_attempts INTEGER DEFAULT 0,
        locked_until DATETIME,
        reset_token TEXT,
        shipping_address TEXT,
        phone TEXT
      );

      CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        description TEXT,
        imageUrl TEXT,
        category_id INTEGER NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );

      CREATE TABLE orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total_amount INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        shipping_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE INDEX idx_products_name ON products(name);
      CREATE INDEX idx_products_category ON products(category_id);
      CREATE INDEX idx_orders_user ON orders(user_id);
      CREATE INDEX idx_coupon_usage_user_coupon ON coupon_usage(user_id, coupon_id);
    `);

    await run(db, 'BEGIN IMMEDIATE TRANSACTION');

    for (const [index, name] of categories.entries()) {
      await run(db, 'INSERT INTO categories (id, name) VALUES (?, ?)', [index + 1, name]);
    }

    await run(
      db,
      `INSERT INTO users
       (id, name, email, password, role, shipping_address, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [1, 'Performance Test Admin', 'admin@eshop.com', 'Admin123!', 'admin', addresses[0].address, addresses[0].phone],
    );

    for (const user of users) {
      await run(
        db,
        `INSERT INTO users
         (id, name, email, password, role, shipping_address, phone)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user.id, user.name, user.email, user.password, user.role, user.shipping_address, user.phone],
      );
    }

    for (const product of products) {
      await run(
        db,
        `INSERT INTO products
         (id, name, price, description, imageUrl, category_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [product.id, product.name, product.price, product.description, product.imageUrl, product.category_id],
      );
    }

    await run(
      db,
      `INSERT INTO coupons
       (id, code, type, discount_value, min_order_amount, expired_at, is_active, max_uses_per_user)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [1, 'LOADTEST', 'fixed', 50000, 300000, '2099-12-31', 1, 1000000],
    );

    await run(db, 'COMMIT');

    const expectedCounts = {
      categories: 8,
      products: 500,
      users: 51,
      coupons: 1,
      orders: 0,
      coupon_usage: 0,
    };

    for (const [table, expected] of Object.entries(expectedCounts)) {
      const row = await get(db, `SELECT COUNT(*) AS count FROM ${table}`);
      if (row.count !== expected) {
        throw new Error(`Seed validation failed for ${table}: expected ${expected}, got ${row.count}`);
      }
    }
  } catch (error) {
    try {
      await run(db, 'ROLLBACK');
    } catch {}
    throw error;
  } finally {
    await close(db);
  }

  writeTestDataFiles();
  fs.copyFileSync(temporaryDbPath, workingDbPath);
  fs.copyFileSync(temporaryDbPath, baselineDbPath);
  fs.rmSync(temporaryDbPath, { force: true });

  console.log('Performance database seeded successfully.');
  console.log('Categories: 8');
  console.log('Products: 500');
  console.log('Test users: 50 (+ 1 admin)');
  console.log('Shipping addresses: 30');
  console.log('Load-test coupon: LOADTEST');
  console.log('Orders: 0');
  console.log(`Working database: ${workingDbPath}`);
  console.log(`Baseline backup: ${baselineDbPath}`);
  console.log(`Generated test data: ${testDataDir}`);
}

seed().catch((error) => {
  fs.rmSync(temporaryDbPath, { force: true });
  console.error(`Performance seed failed: ${error.message}`);
  process.exitCode = 1;
});
