// mock/server.js — a tiny fake eShop API so the k6 demo runs with ZERO setup.
// It implements the same contract as the real eShop SUT, adds a little random
// latency, and degrades under high concurrency (returns 503) so STRESS and
// SPIKE tests actually show a failure mode. Pure Node — no dependencies.
//
//   node mock/server.js         # listens on http://localhost:5000
//
// Point k6 at it:  k6 run -e BASE_URL=http://localhost:5000 ../k6/01-load.js

const http = require('http');

const PORT = process.env.PORT || 5000;
let inFlight = 0;                 // current concurrent requests
const SOFT_LIMIT = 120;          // above this, latency climbs
const HARD_LIMIT = 300;          // above this, start shedding load (503)

const products = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: +(5 + Math.random() * 195).toFixed(2),
}));

function send(res, code, body) {
  const data = JSON.stringify(body);
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(data);
}

// Base latency + a penalty that grows with concurrency (models contention).
function latencyMs() {
  const penalty = Math.max(0, inFlight - SOFT_LIMIT) * 6;
  return 40 + Math.random() * 60 + penalty;
}

const server = http.createServer((req, res) => {
  inFlight++;
  const done = () => { inFlight--; };

  // Load shedding: past the hard limit, degrade gracefully with 503 (not crash).
  if (inFlight > HARD_LIMIT) {
    setTimeout(() => { send(res, 503, { error: 'Service Unavailable' }); done(); }, 5);
    return;
  }

  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    const url = req.url.split('?')[0];
    const wait = latencyMs();

    setTimeout(() => {
      // Routing against the eShop contract.
      if (req.method === 'POST' && url === '/auth/login') {
        return send(res, 200, { token: 'demo-token-' + Math.random().toString(36).slice(2) }) & done();
      }
      if (req.method === 'GET' && url === '/products') {
        return send(res, 200, { items: products, total: products.length }) & done();
      }
      if (req.method === 'GET' && url === '/products/search') {
        return send(res, 200, { items: products.slice(0, 10) }) & done();
      }
      if (req.method === 'GET' && /^\/products\/\d+$/.test(url)) {
        const id = +url.split('/')[2];
        return send(res, 200, products[id - 1] || products[0]) & done();
      }
      if (req.method === 'POST' && url === '/cart/items') {
        return send(res, 201, { ok: true }) & done();
      }
      if (req.method === 'POST' && url === '/checkout') {
        // checkout is heavier — add extra latency
        return setTimeout(() => {
          send(res, 201, { orderId: 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000) });
          done();
        }, 60 + Math.random() * 120);
      }
      send(res, 404, { error: 'Not Found' });
      done();
    }, wait);
  });
});

// Stay alive under abusive load: a dropped/reset client socket must never
// take the whole server down during a live demo.
server.on('clientError', (err, socket) => {
  try { socket.end('HTTP/1.1 400 Bad Request\r\n\r\n'); } catch (e) { /* ignore */ }
});
process.on('uncaughtException', (err) => {
  console.error('[warn] uncaught:', err.message);   // log, do NOT exit
});
process.on('unhandledRejection', (err) => {
  console.error('[warn] unhandled rejection:', err && err.message);
});

// Friendly message if the port is already taken (a previous run left a mock up).
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[error] Port ${PORT} is already in use — a mock is probably still running.`);
    console.error(`        Stop it first:  pkill -f "mock/server.js"   (or use a different PORT=... )`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  console.log(`Mock eShop API listening on http://localhost:${PORT}`);
  console.log(`Soft limit ${SOFT_LIMIT} concurrent (latency climbs), hard limit ${HARD_LIMIT} (503 shedding).`);
});
