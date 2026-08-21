const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.sqlite");

db.serialize(() => {
  db.run("DELETE FROM orders");
  db.run("DELETE FROM sqlite_sequence WHERE name = 'orders'");
  db.get("SELECT COUNT(*) AS count FROM orders", (err, row) => {
    if (err) {
      console.error(err.message);
      process.exitCode = 1;
    } else {
      console.log(`orders count = ${row.count}`);
    }
    db.close();
  });
});
