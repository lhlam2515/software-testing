// lib/csvData.js — CSV-driven data pools for Load/Stress/Spike (P-4).
// Each pool is wrapped in SharedArray, so k6 parses the CSV file exactly
// ONCE (inside the init-context callback below) and every VU then reads
// the SAME underlying array by reference — no per-VU copy. Reading these
// files with a bare open() call directly inside a VU's iteration function
// would instead re-parse and re-allocate the whole file once per VU, which
// is the RAM-multiplication failure mode P-4 explicitly warned about at
// high VU counts (Stress/Spike peak at 220-350 VU).
//
// Do not add a third-party CSV library here: the three files this module
// reads (../../test-data/*.csv) are simple enough (only shipping_address
// has embedded commas) that a ~15-line quoted-field parser is both correct
// and avoids depending on a remote jslib.k6.io import at test-run time.

import { SharedArray } from 'k6/data';

// Minimal RFC4180-ish line parser: handles double-quoted fields (so
// shipping_address values like "Số 12, Đường Test, Quận 1, TP.HCM" don't
// get split on their internal commas) and "" as an escaped quote.
function parseCsvLine(line) {
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      fields.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

function loadCsv(path) {
  // open() only works here, in SharedArray's init-context callback — never
  // call it from inside shopJourney()/exec functions (that's the per-VU
  // anti-pattern this whole module exists to avoid).
  const raw = open(path);
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const header = parseCsvLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cols = parseCsvLine(line);
    const row = {};
    header.forEach((h, i) => {
      row[h] = (cols[i] || '').trim();
    });
    return row;
  });
}

// email, password, valid_flag — valid_flag=false rows use a REAL pool
// account with a WRONG password (never a nonexistent email; the backend
// short-circuits unknown emails with 401 before touching login_attempts,
// so a fake email could never demonstrate the lockout counter). Consumed
// only by the Spike script's dedicated low-VU lockout sub-scenario — see
// README.md "Login is cached per VU" section.
export const authCredentials = new SharedArray('auth_credentials', function () {
  return loadCsv('../../test-data/auth_credentials.csv');
});

// keyword, expected_hit_rate — real seeded keywords (weighted, see
// seed_perf.js KEYWORD_WEIGHTS) plus deliberate miss keywords (0 hits).
// Drives the `search products` step's keyword choice via shopJourney()'s
// `overrides.keyword` so Stress's breaking-point curve isn't flattened by
// every VU hitting the exact same selectivity.
export const readKeywords = new SharedArray('read_keywords', function () {
  return loadCsv('../../test-data/read_keywords.csv');
});

// product_id, quantity, total_amount, shipping_address — product_id stays
// inside the real seeded range (1-2005). Drives `overrides.productId` /
// `overrides.quantity` (cart) and `overrides.payload` (checkout).
export const cartCheckoutPayloads = new SharedArray('cart_checkout_payloads', function () {
  return loadCsv('../../test-data/cart_checkout_payloads.csv');
});
