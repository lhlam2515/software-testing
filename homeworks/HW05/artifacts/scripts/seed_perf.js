// Seeds the e-Shop SQLite database with a realistic volume of data for
// performance testing (HW05). Talks to database.sqlite directly with its
// own sqlite3 connection instead of requiring apps/backend/database.js, so
// it never triggers that module's own (now idempotent) seed/reset logic.
//
// Usage: node seed_perf.js
// Safe to run against a live backend process (SQLite tolerates a second
// writer connection to the same file) and safe to re-run (additive only,
// does not delete existing rows).

const path = require("path");
const fs = require("fs");

const BACKEND_DIR = path.resolve(__dirname, "../../../../apps/backend");
const DB_PATH = path.join(BACKEND_DIR, "database.sqlite");
const REPORT_PATH = path.resolve(
  __dirname,
  "../results/raw/seed_report.txt",
);

const sqlite3 = require(path.join(BACKEND_DIR, "node_modules", "sqlite3")).verbose();

const PRODUCT_COUNT = 2000;
const USER_COUNT = 200;
const ORDER_COUNT = 3000;

// Weighted keyword pool: some keywords hit many products (frequent match),
// some hit only a handful (sparse match), so read_keywords.csv can later
// pick keywords with genuinely different selectivity instead of every
// search touching the same fraction of rows.
const KEYWORD_WEIGHTS = [
  { keyword: "Laptop", weight: 30 },
  { keyword: "iPhone", weight: 25 },
  { keyword: "Samsung", weight: 20 },
  { keyword: "Tai nghe", weight: 15 },
  { keyword: "Bàn phím", weight: 8 },
  { keyword: "Chuột", weight: 6 },
  { keyword: "Màn hình", weight: 5 },
  { keyword: "Ổ cứng", weight: 3 },
  { keyword: "Sạc dự phòng", weight: 2 },
  { keyword: "Webcam", weight: 1 },
];
const BRANDS = ["Pro", "Max", "Ultra", "Lite", "Plus", "Air", "Neo", "Studio"];

function pickKeyword() {
  const totalWeight = KEYWORD_WEIGHTS.reduce((s, k) => s + k.weight, 0);
  let r = Math.random() * totalWeight;
  for (const k of KEYWORD_WEIGHTS) {
    if (r < k.weight) return k.keyword;
    r -= k.weight;
  }
  return KEYWORD_WEIGHTS[0].keyword;
}

function productName(i) {
  const keyword = pickKeyword();
  const brand = BRANDS[i % BRANDS.length];
  return `${keyword} ${brand} ${1000 + i}`;
}

const ORDER_STATUSES = ["pending", "confirmed", "shipping", "delivered", "canceled"];

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Could not open database:", err.message);
    process.exit(1);
  }
});

function run(sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function get(sql, params) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

async function main() {
  await run("BEGIN TRANSACTION");

  const categories = ["Điện thoại", "Laptop", "Phụ kiện"];
  for (let i = 0; i < PRODUCT_COUNT; i++) {
    const price = 100000 + Math.floor(Math.random() * 40000000);
    const category_id = 1 + (i % categories.length);
    await run(
      "INSERT INTO products (name, price, description, imageUrl, category_id) VALUES (?, ?, ?, ?, ?)",
      [
        productName(i),
        price,
        `Sản phẩm seed cho perf testing #${i}`,
        `https://placehold.co/300x300/png?text=Perf+${i}`,
        category_id,
      ],
    );
  }

  const userIds = [];
  for (let i = 0; i < USER_COUNT; i++) {
    const email = `perf_user_${i}@eshop.test`;
    const result = await run(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [`Perf User ${i}`, email, "PerfTest1234!", "user"],
    );
    userIds.push(result.lastID);
  }

  for (let i = 0; i < ORDER_COUNT; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const status = ORDER_STATUSES[Math.floor(Math.random() * ORDER_STATUSES.length)];
    const total = 50000 + Math.floor(Math.random() * 5000000);
    await run(
      "INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)",
      [userId, total, status, `Seed address #${i}, District ${1 + (i % 12)}, HCMC`],
    );
  }

  await run("COMMIT");

  const productCount = (await get("SELECT count(*) as c FROM products", [])).c;
  const userCount = (await get("SELECT count(*) as c FROM users", [])).c;
  const orderCount = (await get("SELECT count(*) as c FROM orders", [])).c;

  const report = [
    `seed_perf.js run at ${new Date().toISOString()}`,
    `products: ${productCount} (target inserted this run: ${PRODUCT_COUNT})`,
    `users: ${userCount} (target inserted this run: ${USER_COUNT})`,
    `orders: ${orderCount} (target inserted this run: ${ORDER_COUNT})`,
    `perf user password (all): PerfTest1234!`,
    `perf user email pattern: perf_user_{0..${USER_COUNT - 1}}@eshop.test`,
  ].join("\n");

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, report + "\n");

  console.log(report);
  db.close();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  db.close();
  process.exit(1);
});
