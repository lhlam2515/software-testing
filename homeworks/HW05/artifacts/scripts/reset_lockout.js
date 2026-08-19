// Clears account-lockout state between k6 runs. Real e-Shop behaviour
// (see apps/backend/server.js:54-58): a failed login adds +2 to
// login_attempts and locks the account for 180s once login_attempts >= 3
// (i.e. after 2 consecutive failures, not 3 as the assignment brief's
// generic wording implies). Auth-heavy scenarios (Spike) will trip this
// deliberately, so every run needs a clean reset before the next one.
//
// Usage: node reset_lockout.js

const path = require("path");

const BACKEND_DIR = path.resolve(__dirname, "../../../../apps/backend");
const DB_PATH = path.join(BACKEND_DIR, "database.sqlite");

const sqlite3 = require(path.join(BACKEND_DIR, "node_modules", "sqlite3")).verbose();

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Could not open database:", err.message);
    process.exit(1);
  }
});

db.run(
  "UPDATE users SET login_attempts = 0, locked_until = NULL",
  [],
  function (err) {
    if (err) {
      console.error("Reset failed:", err.message);
      db.close();
      process.exit(1);
    }
    console.log(`reset_lockout.js: ${this.changes} user row(s) reset at ${new Date().toISOString()}`);
    db.close();
  },
);
