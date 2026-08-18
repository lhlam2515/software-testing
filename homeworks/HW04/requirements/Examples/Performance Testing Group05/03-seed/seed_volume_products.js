const net = require('net');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const TARGET_PRODUCTS = Number(process.env.VOLUME_PRODUCT_COUNT || 5000);
const dbPath = path.join(__dirname, 'database.sqlite');

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

function openDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (error) => {
      if (error) reject(error);
      else resolve(db);
    });
  });
}

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (error) => (error ? reject(error) : resolve()));
  });
}

function get(db, sql) {
  return new Promise((resolve, reject) => {
    db.get(sql, (error, row) => (error ? reject(error) : resolve(row)));
  });
}

function close(db) {
  return new Promise((resolve, reject) => {
    db.close((error) => (error ? reject(error) : resolve()));
  });
}

async function seedVolumeProducts() {
  if (!Number.isInteger(TARGET_PRODUCTS) || TARGET_PRODUCTS < 500) {
    throw new Error('VOLUME_PRODUCT_COUNT must be an integer greater than or equal to 500.');
  }
  if (await isPortOpen(3000)) {
    throw new Error('Backend is listening on port 3000. Stop it before preparing volume data.');
  }

  const db = await openDatabase();
  try {
    const current = await get(db, 'SELECT COUNT(*) AS count FROM products');
    if (current.count > TARGET_PRODUCTS) {
      throw new Error(
        `Working database already contains ${current.count} products. Reset it before volume seeding.`,
      );
    }

    await run(db, 'BEGIN IMMEDIATE TRANSACTION');
    for (let id = current.count + 1; id <= TARGET_PRODUCTS; id += 1) {
      const categoryId = ((id - 1) % 8) + 1;
      const price = 600000 + (((id - 1) * 137000) % 49400000);
      await run(
        db,
        `INSERT INTO products
         (id, name, price, description, imageUrl, category_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id,
          `Volume Category ${categoryId} Product ${String(id).padStart(5, '0')}`,
          price,
          `Deterministic volume-test product ${id}.`,
          `https://placehold.co/300x300/png?text=Volume+${id}`,
          categoryId,
        ],
      );
    }
    await run(db, 'COMMIT');

    const final = await get(db, 'SELECT COUNT(*) AS count FROM products');
    if (final.count !== TARGET_PRODUCTS) {
      throw new Error(`Expected ${TARGET_PRODUCTS} products, found ${final.count}.`);
    }
    console.log(`Volume dataset ready: ${final.count} products.`);
    console.log('The clean 500-product baseline database was not modified.');
  } catch (error) {
    try {
      await run(db, 'ROLLBACK');
    } catch {}
    throw error;
  } finally {
    await close(db);
  }
}

seedVolumeProducts().catch((error) => {
  console.error(`Volume seed failed: ${error.message}`);
  process.exitCode = 1;
});
