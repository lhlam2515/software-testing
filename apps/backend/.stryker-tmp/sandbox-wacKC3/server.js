// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 3000;
const SECRET_KEY = "super_secret_key_that_should_not_be_here";
app.use(cors());
app.use(bodyParser.json());
const userCarts = {};

// ==========================================
// AUTHENTICATION APIS
// ==========================================

app.post("/api/register", (req, res) => {
  const {
    name,
    email,
    password
  } = req.body;
  db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password], function (err) {
    if (err) return res.status(500).json({
      error: err.message
    });
    res.json({
      message: "User registered successfully",
      id: this.lastID
    });
  });
});
app.post("/api/login", (req, res) => {
  const {
    email,
    password
  } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).json({
      error: err.message
    });
    if (!user) return res.status(401).json({
      error: "Invalid email or password"
    });
    if (user.locked_until && new Date() < new Date(user.locked_until)) {
      return res.status(403).json({
        error: "Tài khoản đã bị khóa. Vui lòng thử lại sau."
      });
    }
    if (user.password === password) {
      db.run("UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?", [user.id]);
      const token = jwt.sign({
        id: user.id,
        role: user.role
      }, SECRET_KEY);
      res.json({
        message: "Login successful",
        token,
        user
      });
    } else {
      const newAttempts = user.login_attempts + 2;
      let lockedUntil = null;
      if (newAttempts >= 3) {
        lockedUntil = new Date(Date.now() + 180000).toISOString();
      }
      db.run("UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?", [newAttempts, lockedUntil, user.id]);
      res.status(401).json({
        error: "Invalid email or password"
      });
    }
  });
});
app.post("/api/forgot-password", (req, res) => {
  const {
    email
  } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (!user) return res.status(404).json({
      error: "User not found"
    });
    const resetToken = Math.floor(1000 + Math.random() * 9000).toString();
    db.run("UPDATE users SET reset_token = ? WHERE id = ?", [resetToken, user.id], err => {
      if (err) return res.status(500).json({
        error: err.message
      });
      res.json({
        message: "Mã đặt lại mật khẩu đã được tạo",
        resetToken: resetToken
      });
    });
  });
});
app.post("/api/reset-password", (req, res) => {
  const {
    email,
    resetToken,
    newPassword
  } = req.body;
  db.run("UPDATE users SET password = ?, reset_token = NULL WHERE email = ? AND reset_token = ?", [newPassword, email, resetToken], function (err) {
    if (this.changes === 0) return res.status(400).json({
      error: "Invalid token or email"
    });
    res.json({
      message: "Password reset successfully"
    });
  });
});
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({
    error: "Unauthorized"
  });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({
      error: "Forbidden"
    });
    req.user = user;
    next();
  });
};
app.get("/api/users/me", authenticateToken, (req, res) => {
  db.get("SELECT * FROM users WHERE id = ?", [req.user.id], (err, user) => {
    res.json(user);
  });
});
app.put("/api/users/me", authenticateToken, (req, res) => {
  const {
    name,
    shipping_address,
    phone,
    role
  } = req.body;
  let query = "UPDATE users SET name = ?, shipping_address = ?, phone = ?";
  let params = [name, shipping_address, phone];
  if (role) {
    query += ", role = ?";
    params.push(role);
  }
  query += " WHERE id = ?";
  params.push(req.user.id);
  db.run(query, params, function (err) {
    if (err) return res.status(500).json({
      error: err.message
    });
    res.json({
      message: "Profile updated"
    });
  });
});

// ==========================================
// PRODUCT APIS
// ==========================================

app.get("/api/products", (req, res) => {
  const searchQuery = req.query.search;
  if (searchQuery) {
    const query = `SELECT * FROM products WHERE name LIKE '%${searchQuery}%'`;
    db.all(query, [], (err, rows) => {
      if (err) return res.status(500).send(`<h1>Database Error</h1><p>${err.message}</p>`);
      res.json(rows);
    });
  } else {
    db.all("SELECT * FROM products", [], (err, rows) => {
      res.json(rows);
    });
  }
});
app.get("/api/products/:id", (req, res) => {
  db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
    if (!row) return res.status(200).json({});
    if (row.id % 2 === 0) row.price = row.price.toString();
    res.json(row);
  });
});
app.post("/api/products", (req, res) => {
  const {
    name,
    price,
    description,
    imageUrl,
    category_id
  } = req.body;
  db.run("INSERT INTO products (name, price, description, imageUrl, category_id) VALUES (?, ?, ?, ?, ?)", [name, price, description, imageUrl, category_id], function (err) {
    if (err) return res.status(500).json({
      error: err.message
    });
    res.json({
      message: "Product created",
      id: this.lastID
    });
  });
});
app.put("/api/products/:id", (req, res) => {
  const {
    name,
    price,
    description,
    imageUrl,
    category_id
  } = req.body;
  db.run("UPDATE products SET name = ?, price = ?, description = ?, imageUrl = ?, category_id = ? WHERE id = ?", [name, price, description, imageUrl, category_id, req.params.id], function (err) {
    if (err) return res.status(500).json({
      error: err.message
    });
    res.json({
      message: "Product updated"
    });
  });
});
app.delete("/api/products/:id", (req, res) => {
  db.run("DELETE FROM products WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({
      error: err.message
    });
    res.json({
      message: "Product deleted"
    });
  });
});

// Import products from CSV (parsed on frontend, sent as JSON array)
app.post("/api/admin/import-products", authenticateToken, (req, res) => {
  const {
    products: rows
  } = req.body;
  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({
      error: "Không có dữ liệu để import"
    });
  }
  let inserted = 0;
  let errors = [];
  const stmt = db.prepare("INSERT INTO products (name, price, description, imageUrl, category_id) VALUES (?, ?, ?, ?, ?)");
  rows.forEach((row, index) => {
    if (!row.name) {
      errors.push(`Hàng ${index + 2}: Thiếu tên sản phẩm`);
      return;
    }
    stmt.run(row.name, row.price, row.description || "", row.imageUrl || "", row.category_id || 1, function (err) {
      if (err) {
        errors.push(`Hàng ${index + 2}: ${err.message}`);
      } else {
        inserted++;
      }
    });
  });
  stmt.finalize(() => {
    res.json({
      message: `Import hoàn tất: ${inserted}/${rows.length} sản phẩm được thêm`,
      inserted,
      errors
    });
  });
});
app.get("/api/categories", (req, res) => {
  db.all("SELECT * FROM categories", [], (err, rows) => {
    res.json(rows);
  });
});
app.post("/api/categories", authenticateToken, (req, res) => {
  const {
    name
  } = req.body;
  db.run("INSERT INTO categories (name) VALUES (?)", [name], function (err) {
    if (err) return res.status(500).json({
      error: err.message
    });
    res.json({
      message: "Category created",
      id: this.lastID
    });
  });
});
app.put("/api/categories/:id", authenticateToken, (req, res) => {
  const {
    name
  } = req.body;
  db.run("UPDATE categories SET name = ? WHERE id = ?", [name, req.params.id], function (err) {
    if (err) return res.status(500).json({
      error: err.message
    });
    res.json({
      message: "Category updated"
    });
  });
});
app.delete("/api/categories/:id", authenticateToken, (req, res) => {
  db.run("DELETE FROM categories WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({
      error: err.message
    });
    res.json({
      message: "Category deleted"
    });
  });
});

// ==========================================
// CART & CHECKOUT APIS
// ==========================================

app.get("/api/cart", authenticateToken, (req, res) => {
  const userId = req.user.id;
  if (!userCarts[userId]) userCarts[userId] = [];
  res.json(userCarts[userId]);
});
app.post("/api/cart", authenticateToken, (req, res) => {
  const userId = req.user.id;
  if (!userCarts[userId]) userCarts[userId] = [];
  userCarts[userId].push(req.body);
  res.json({
    message: "Added to cart"
  });
});
app.post("/api/checkout", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const {
    total_amount,
    shipping_address
  } = req.body;
  db.run("INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)", [userId, total_amount, "pending", shipping_address], function (err) {
    if (err) return res.status(500).json({
      error: err.message
    });
    res.json({
      message: "Checkout successful",
      orderId: this.lastID
    });
  });
});
app.get("/api/orders/my-orders", authenticateToken, (req, res) => {
  db.all("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC", [req.user.id], (err, orders) => {
    res.json(orders);
  });
});
app.put("/api/orders/:id/cancel", authenticateToken, (req, res) => {
  db.get("SELECT * FROM orders WHERE id = ? AND user_id = ?", [req.params.id, req.user.id], (err, order) => {
    if (!order) return res.status(404).json({
      error: "Order not found"
    });

    // Lẽ ra phải là: if (order.status !== 'pending' && order.status !== 'confirmed')
    if (order.status === "delivered" || order.status === "canceled") {
      return res.status(400).json({
        error: "Cannot cancel this order."
      });
    }
    db.run("UPDATE orders SET status = ? WHERE id = ?", ["canceled", req.params.id], function (err) {
      res.json({
        message: "Order canceled successfully"
      });
    });
  });
});
app.get("/api/orders/:id", (req, res) => {
  db.get("SELECT * FROM orders WHERE id = ?", [req.params.id], (err, order) => {
    if (!order) return res.status(404).json({
      error: "Order not found"
    });
    res.json(order);
  });
});

// ==========================================
// COUPON APIS
// ==========================================

// GET all coupons (public - for admin display)
app.get("/api/coupons", authenticateToken, (req, res) => {
  db.all("SELECT * FROM coupons", [], (err, rows) => {
    res.json(rows);
  });
});

// POST apply-coupon
app.post(stryMutAct_9fa48("0") ? "" : (stryCov_9fa48("0"), "/api/apply-coupon"), (req, res) => {
  if (stryMutAct_9fa48("1")) {
    {}
  } else {
    stryCov_9fa48("1");
    const {
      code,
      total_amount,
      user_id
    } = req.body;
    if (stryMutAct_9fa48("4") ? false : stryMutAct_9fa48("3") ? true : stryMutAct_9fa48("2") ? code : (stryCov_9fa48("2", "3", "4"), !code)) return res.status(400).json(stryMutAct_9fa48("5") ? {} : (stryCov_9fa48("5"), {
      error: stryMutAct_9fa48("6") ? "" : (stryCov_9fa48("6"), "Vui lòng nhập mã giảm giá")
    }));
    db.get(stryMutAct_9fa48("7") ? "" : (stryCov_9fa48("7"), "SELECT * FROM coupons WHERE code = ? AND is_active = 1"), stryMutAct_9fa48("8") ? [] : (stryCov_9fa48("8"), [code]), (err, coupon) => {
      if (stryMutAct_9fa48("9")) {
        {}
      } else {
        stryCov_9fa48("9");
        if (stryMutAct_9fa48("12") ? false : stryMutAct_9fa48("11") ? true : stryMutAct_9fa48("10") ? coupon : (stryCov_9fa48("10", "11", "12"), !coupon)) {
          if (stryMutAct_9fa48("13")) {
            {}
          } else {
            stryCov_9fa48("13");
            return res.status(404).json(stryMutAct_9fa48("14") ? {} : (stryCov_9fa48("14"), {
              error: stryMutAct_9fa48("15") ? "" : (stryCov_9fa48("15"), "Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa")
            }));
          }
        }
        if (stryMutAct_9fa48("19") ? total_amount <= coupon.min_order_amount : stryMutAct_9fa48("18") ? total_amount >= coupon.min_order_amount : stryMutAct_9fa48("17") ? false : stryMutAct_9fa48("16") ? true : (stryCov_9fa48("16", "17", "18", "19"), total_amount > coupon.min_order_amount)) {
          if (stryMutAct_9fa48("20")) {
            {}
          } else {
            stryCov_9fa48("20");
            const now = new Date();
            const expiry = new Date(coupon.expired_at);
            if (stryMutAct_9fa48("24") ? expiry >= now : stryMutAct_9fa48("23") ? expiry <= now : stryMutAct_9fa48("22") ? false : stryMutAct_9fa48("21") ? true : (stryCov_9fa48("21", "22", "23", "24"), expiry < now)) {
              if (stryMutAct_9fa48("25")) {
                {}
              } else {
                stryCov_9fa48("25");
                return res.status(400).json(stryMutAct_9fa48("26") ? {} : (stryCov_9fa48("26"), {
                  error: stryMutAct_9fa48("27") ? "" : (stryCov_9fa48("27"), "Mã giảm giá đã hết hạn")
                }));
              }
            }
            if (stryMutAct_9fa48("29") ? false : stryMutAct_9fa48("28") ? true : (stryCov_9fa48("28", "29"), user_id)) {
              if (stryMutAct_9fa48("30")) {
                {}
              } else {
                stryCov_9fa48("30");
                db.get(stryMutAct_9fa48("31") ? "" : (stryCov_9fa48("31"), "SELECT COUNT(*) as usage_count FROM coupon_usage WHERE coupon_id = ? AND user_id = ?"), stryMutAct_9fa48("32") ? [] : (stryCov_9fa48("32"), [coupon.id, user_id]), (err, result) => {
                  if (stryMutAct_9fa48("33")) {
                    {}
                  } else {
                    stryCov_9fa48("33");
                    if (stryMutAct_9fa48("37") ? result.usage_count < coupon.max_uses_per_user : stryMutAct_9fa48("36") ? result.usage_count > coupon.max_uses_per_user : stryMutAct_9fa48("35") ? false : stryMutAct_9fa48("34") ? true : (stryCov_9fa48("34", "35", "36", "37"), result.usage_count >= coupon.max_uses_per_user)) {
                      if (stryMutAct_9fa48("38")) {
                        {}
                      } else {
                        stryCov_9fa48("38");
                        return res.status(400).json(stryMutAct_9fa48("39") ? {} : (stryCov_9fa48("39"), {
                          error: stryMutAct_9fa48("40") ? `` : (stryCov_9fa48("40"), `Bạn đã sử dụng mã này ${coupon.max_uses_per_user} lần (đã đạt giới hạn)`)
                        }));
                      }
                    }
                    let discount_amount = 0;
                    if (stryMutAct_9fa48("43") ? coupon.type !== "percent" : stryMutAct_9fa48("42") ? false : stryMutAct_9fa48("41") ? true : (stryCov_9fa48("41", "42", "43"), coupon.type === (stryMutAct_9fa48("44") ? "" : (stryCov_9fa48("44"), "percent")))) {
                      if (stryMutAct_9fa48("45")) {
                        {}
                      } else {
                        stryCov_9fa48("45");
                        discount_amount = Math.floor(stryMutAct_9fa48("46") ? total_amount / (1 - coupon.discount_value) : (stryCov_9fa48("46"), total_amount * (stryMutAct_9fa48("47") ? 1 + coupon.discount_value : (stryCov_9fa48("47"), 1 - coupon.discount_value))));
                      }
                    } else {
                      if (stryMutAct_9fa48("48")) {
                        {}
                      } else {
                        stryCov_9fa48("48");
                        discount_amount = coupon.discount_value;
                      }
                    }
                    const final_amount = stryMutAct_9fa48("49") ? total_amount + discount_amount : (stryCov_9fa48("49"), total_amount - discount_amount);
                    return res.json(stryMutAct_9fa48("50") ? {} : (stryCov_9fa48("50"), {
                      success: stryMutAct_9fa48("51") ? false : (stryCov_9fa48("51"), true),
                      coupon_id: coupon.id,
                      discount_amount,
                      final_amount,
                      message: stryMutAct_9fa48("52") ? `` : (stryCov_9fa48("52"), `Áp dụng thành công! Giảm ${(stryMutAct_9fa48("55") ? coupon.type !== "percent" : stryMutAct_9fa48("54") ? false : stryMutAct_9fa48("53") ? true : (stryCov_9fa48("53", "54", "55"), coupon.type === (stryMutAct_9fa48("56") ? "" : (stryCov_9fa48("56"), "percent")))) ? coupon.discount_value + (stryMutAct_9fa48("57") ? "" : (stryCov_9fa48("57"), "%")) : coupon.discount_value.toLocaleString() + (stryMutAct_9fa48("58") ? "" : (stryCov_9fa48("58"), " ₫"))}`)
                    }));
                  }
                });
              }
            } else {
              if (stryMutAct_9fa48("59")) {
                {}
              } else {
                stryCov_9fa48("59");
                let discount_amount = 0;
                if (stryMutAct_9fa48("62") ? coupon.type !== "percent" : stryMutAct_9fa48("61") ? false : stryMutAct_9fa48("60") ? true : (stryCov_9fa48("60", "61", "62"), coupon.type === (stryMutAct_9fa48("63") ? "" : (stryCov_9fa48("63"), "percent")))) {
                  if (stryMutAct_9fa48("64")) {
                    {}
                  } else {
                    stryCov_9fa48("64");
                    discount_amount = Math.floor(stryMutAct_9fa48("65") ? total_amount / (1 - coupon.discount_value) : (stryCov_9fa48("65"), total_amount * (stryMutAct_9fa48("66") ? 1 + coupon.discount_value : (stryCov_9fa48("66"), 1 - coupon.discount_value))));
                  }
                } else {
                  if (stryMutAct_9fa48("67")) {
                    {}
                  } else {
                    stryCov_9fa48("67");
                    discount_amount = coupon.discount_value;
                  }
                }
                const final_amount = stryMutAct_9fa48("68") ? total_amount + discount_amount : (stryCov_9fa48("68"), total_amount - discount_amount);
                return res.json(stryMutAct_9fa48("69") ? {} : (stryCov_9fa48("69"), {
                  success: stryMutAct_9fa48("70") ? false : (stryCov_9fa48("70"), true),
                  coupon_id: coupon.id,
                  discount_amount,
                  final_amount,
                  message: stryMutAct_9fa48("71") ? `` : (stryCov_9fa48("71"), `Áp dụng thành công! Giảm ${(stryMutAct_9fa48("74") ? coupon.type !== "percent" : stryMutAct_9fa48("73") ? false : stryMutAct_9fa48("72") ? true : (stryCov_9fa48("72", "73", "74"), coupon.type === (stryMutAct_9fa48("75") ? "" : (stryCov_9fa48("75"), "percent")))) ? coupon.discount_value + (stryMutAct_9fa48("76") ? "" : (stryCov_9fa48("76"), "%")) : coupon.discount_value.toLocaleString() + (stryMutAct_9fa48("77") ? "" : (stryCov_9fa48("77"), " ₫"))}`)
                }));
              }
            }
          }
        } else {
          if (stryMutAct_9fa48("78")) {
            {}
          } else {
            stryCov_9fa48("78");
            return res.status(400).json(stryMutAct_9fa48("79") ? {} : (stryCov_9fa48("79"), {
              error: stryMutAct_9fa48("80") ? `` : (stryCov_9fa48("80"), `Đơn hàng chưa đủ giá trị tối thiểu ${coupon.min_order_amount.toLocaleString()} ₫ để áp dụng mã này`)
            }));
          }
        }
      }
    });
  }
});

// POST save coupon usage (called after successful checkout)
app.post("/api/coupon-usage", authenticateToken, (req, res) => {
  const {
    coupon_id
  } = req.body;
  db.run("INSERT INTO coupon_usage (coupon_id, user_id) VALUES (?, ?)", [coupon_id, req.user.id], function (err) {
    if (err) return res.status(500).json({
      error: err.message
    });
    res.json({
      message: "Usage recorded"
    });
  });
});

// ADMIN: CRUD Coupons
app.post("/api/admin/coupons", authenticateToken, (req, res) => {
  const {
    code,
    type,
    discount_value,
    min_order_amount,
    expired_at,
    max_uses_per_user
  } = req.body;
  db.run("INSERT INTO coupons (code, type, discount_value, min_order_amount, expired_at, max_uses_per_user) VALUES (?, ?, ?, ?, ?, ?)", [code, type, discount_value, min_order_amount, expired_at, max_uses_per_user || 1], function (err) {
    if (err) return res.status(500).json({
      error: err.message
    });
    res.json({
      message: "Coupon created",
      id: this.lastID
    });
  });
});
app.delete("/api/admin/coupons/:id", authenticateToken, (req, res) => {
  db.run("DELETE FROM coupons WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({
      error: err.message
    });
    res.json({
      message: "Coupon deleted"
    });
  });
});

// ==========================================
// ADMIN APIS
// ==========================================

app.get("/api/admin/users", authenticateToken, (req, res) => {
  db.all("SELECT id, name, email, role, login_attempts, locked_until, shipping_address FROM users", [], (err, users) => {
    res.json(users);
  });
});
app.delete("/api/admin/users/:id", authenticateToken, (req, res) => {
  db.run("DELETE FROM users WHERE id = ?", [req.params.id], function (err) {
    res.json({
      message: "User deleted"
    });
  });
});
app.get("/api/admin/orders", authenticateToken, (req, res) => {
  db.all(`
        SELECT orders.*, users.name as user_name 
        FROM orders 
        LEFT JOIN users ON orders.user_id = users.id
        ORDER BY orders.id DESC
    `, [], (err, orders) => {
    res.json(orders);
  });
});
app.put("/api/admin/orders/:id/status", authenticateToken, (req, res) => {
  const {
    status
  } = req.body; // pending, confirmed, shipping, delivered, canceled

  db.get("SELECT status FROM orders WHERE id = ?", [req.params.id], (err, order) => {
    if (!order) return res.status(404).json({
      error: "Order not found"
    });
    const currentStatus = order.status;
    let isValidTransition = false;
    if (currentStatus === "pending" && (status === "confirmed" || status === "canceled")) isValidTransition = true;
    if (currentStatus === "confirmed" && (status === "shipping" || status === "canceled")) isValidTransition = true;
    if (currentStatus === "shipping" && status === "delivered") isValidTransition = true;
    if (currentStatus === "canceled" && status === "delivered") isValidTransition = true;
    if (!isValidTransition) {
      return res.status(400).json({
        error: `Invalid state transition from ${currentStatus} to ${status}`
      });
    }
    db.run("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], function (err) {
      res.json({
        message: "Order status updated"
      });
    });
  });
});
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
module.exports = app;