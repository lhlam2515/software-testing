// DB state manipulation helper for Playwright test execution
// Usage: node test-db.cjs <operation> [args...]
// Operations:
//   reset <email>                  → login_attempts=0, locked_until=NULL
//   set-attempts <email> <n>       → login_attempts=n, locked_until=NULL
//   set-locked <email> <+Ns|-Ns>   → login_attempts=3, locked_until=datetime('now','<offset>')
//   get <email>                    → print current state as JSON

const sqlite3 = require('./apps/backend/node_modules/sqlite3').verbose();
const DB_PATH = './apps/backend/database.sqlite';

const [, , op, email, arg] = process.argv;

if (!op || !email) {
  console.error('Usage: node test-db.cjs <operation> <email> [arg]');
  process.exit(1);
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) { console.error('DB open error:', err.message); process.exit(1); }
});

const done = (err) => {
  if (err) { console.error('SQL error:', err.message); db.close(); process.exit(1); }
  db.close();
};

switch (op) {
  case 'reset':
    db.run(
      `UPDATE users SET login_attempts=0, locked_until=NULL WHERE email=?`,
      [email], done
    );
    break;

  case 'set-attempts':
    db.run(
      `UPDATE users SET login_attempts=?, locked_until=NULL WHERE email=?`,
      [parseInt(arg), email], done
    );
    break;

  case 'set-locked': {
    // arg = offset in seconds, e.g. '+30', '-1', '+0'
    // Uses JS Date to generate ISO 8601 format (T + Z) matching the server's storage format
    const offsetSec = parseInt(arg.replace(/[^-0-9]/g, '')) || 0;
    const lockUntil = new Date(Date.now() + offsetSec * 1000).toISOString();
    db.run(
      `UPDATE users SET login_attempts=3, locked_until=? WHERE email=?`,
      [lockUntil, email], done
    );
    break;
  }

  case 'get':
    db.get(
      `SELECT login_attempts, locked_until FROM users WHERE email=?`,
      [email], (err, row) => {
        if (err) { console.error(err.message); db.close(); process.exit(1); }
        console.log(JSON.stringify(row));
        db.close();
      }
    );
    break;

  default:
    console.error('Unknown operation:', op);
    db.close();
    process.exit(1);
}
