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
const SECRET_KEY = stryMutAct_9fa48("0") ? "" : (stryCov_9fa48("0"), "super_secret_key_that_should_not_be_here");
app.use(cors());
app.use(bodyParser.json());
const userCarts = {};

// ==========================================
// AUTHENTICATION APIS
// ==========================================

app.post(stryMutAct_9fa48("1") ? "" : (stryCov_9fa48("1"), "/api/register"), (req, res) => {
  if (stryMutAct_9fa48("2")) {
    {}
  } else {
    stryCov_9fa48("2");
    const {
      name,
      email,
      password
    } = req.body;
    db.run(stryMutAct_9fa48("3") ? "" : (stryCov_9fa48("3"), "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"), stryMutAct_9fa48("4") ? [] : (stryCov_9fa48("4"), [name, email, password]), function (err) {
      if (stryMutAct_9fa48("5")) {
        {}
      } else {
        stryCov_9fa48("5");
        if (stryMutAct_9fa48("7") ? false : stryMutAct_9fa48("6") ? true : (stryCov_9fa48("6", "7"), err)) return res.status(500).json(stryMutAct_9fa48("8") ? {} : (stryCov_9fa48("8"), {
          error: err.message
        }));
        res.json(stryMutAct_9fa48("9") ? {} : (stryCov_9fa48("9"), {
          message: stryMutAct_9fa48("10") ? "" : (stryCov_9fa48("10"), "User registered successfully"),
          id: this.lastID
        }));
      }
    });
  }
});
app.post(stryMutAct_9fa48("11") ? "" : (stryCov_9fa48("11"), "/api/login"), (req, res) => {
  if (stryMutAct_9fa48("12")) {
    {}
  } else {
    stryCov_9fa48("12");
    const {
      email,
      password
    } = req.body;
    db.get(stryMutAct_9fa48("13") ? "" : (stryCov_9fa48("13"), "SELECT * FROM users WHERE email = ?"), stryMutAct_9fa48("14") ? [] : (stryCov_9fa48("14"), [email]), (err, user) => {
      if (stryMutAct_9fa48("15")) {
        {}
      } else {
        stryCov_9fa48("15");
        if (stryMutAct_9fa48("17") ? false : stryMutAct_9fa48("16") ? true : (stryCov_9fa48("16", "17"), err)) return res.status(500).json(stryMutAct_9fa48("18") ? {} : (stryCov_9fa48("18"), {
          error: err.message
        }));
        if (stryMutAct_9fa48("21") ? false : stryMutAct_9fa48("20") ? true : stryMutAct_9fa48("19") ? user : (stryCov_9fa48("19", "20", "21"), !user)) return res.status(401).json(stryMutAct_9fa48("22") ? {} : (stryCov_9fa48("22"), {
          error: stryMutAct_9fa48("23") ? "" : (stryCov_9fa48("23"), "Invalid email or password")
        }));
        if (stryMutAct_9fa48("26") ? user.locked_until || new Date() < new Date(user.locked_until) : stryMutAct_9fa48("25") ? false : stryMutAct_9fa48("24") ? true : (stryCov_9fa48("24", "25", "26"), user.locked_until && (stryMutAct_9fa48("29") ? new Date() >= new Date(user.locked_until) : stryMutAct_9fa48("28") ? new Date() <= new Date(user.locked_until) : stryMutAct_9fa48("27") ? true : (stryCov_9fa48("27", "28", "29"), new Date() < new Date(user.locked_until))))) {
          if (stryMutAct_9fa48("30")) {
            {}
          } else {
            stryCov_9fa48("30");
            return res.status(403).json(stryMutAct_9fa48("31") ? {} : (stryCov_9fa48("31"), {
              error: stryMutAct_9fa48("32") ? "" : (stryCov_9fa48("32"), "Tài khoản đã bị khóa. Vui lòng thử lại sau.")
            }));
          }
        }
        if (stryMutAct_9fa48("35") ? user.password !== password : stryMutAct_9fa48("34") ? false : stryMutAct_9fa48("33") ? true : (stryCov_9fa48("33", "34", "35"), user.password === password)) {
          if (stryMutAct_9fa48("36")) {
            {}
          } else {
            stryCov_9fa48("36");
            db.run(stryMutAct_9fa48("37") ? "" : (stryCov_9fa48("37"), "UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?"), stryMutAct_9fa48("38") ? [] : (stryCov_9fa48("38"), [user.id]));
            const token = jwt.sign(stryMutAct_9fa48("39") ? {} : (stryCov_9fa48("39"), {
              id: user.id,
              role: user.role
            }), SECRET_KEY);
            res.json(stryMutAct_9fa48("40") ? {} : (stryCov_9fa48("40"), {
              message: stryMutAct_9fa48("41") ? "" : (stryCov_9fa48("41"), "Login successful"),
              token,
              user
            }));
          }
        } else {
          if (stryMutAct_9fa48("42")) {
            {}
          } else {
            stryCov_9fa48("42");
            const newAttempts = stryMutAct_9fa48("43") ? user.login_attempts - 2 : (stryCov_9fa48("43"), user.login_attempts + 2);
            let lockedUntil = null;
            if (stryMutAct_9fa48("47") ? newAttempts < 3 : stryMutAct_9fa48("46") ? newAttempts > 3 : stryMutAct_9fa48("45") ? false : stryMutAct_9fa48("44") ? true : (stryCov_9fa48("44", "45", "46", "47"), newAttempts >= 3)) {
              if (stryMutAct_9fa48("48")) {
                {}
              } else {
                stryCov_9fa48("48");
                lockedUntil = new Date(stryMutAct_9fa48("49") ? Date.now() - 180000 : (stryCov_9fa48("49"), Date.now() + 180000)).toISOString();
              }
            }
            db.run(stryMutAct_9fa48("50") ? "" : (stryCov_9fa48("50"), "UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?"), stryMutAct_9fa48("51") ? [] : (stryCov_9fa48("51"), [newAttempts, lockedUntil, user.id]));
            res.status(401).json(stryMutAct_9fa48("52") ? {} : (stryCov_9fa48("52"), {
              error: stryMutAct_9fa48("53") ? "" : (stryCov_9fa48("53"), "Invalid email or password")
            }));
          }
        }
      }
    });
  }
});
app.post(stryMutAct_9fa48("54") ? "" : (stryCov_9fa48("54"), "/api/forgot-password"), (req, res) => {
  if (stryMutAct_9fa48("55")) {
    {}
  } else {
    stryCov_9fa48("55");
    const {
      email
    } = req.body;
    db.get(stryMutAct_9fa48("56") ? "" : (stryCov_9fa48("56"), "SELECT * FROM users WHERE email = ?"), stryMutAct_9fa48("57") ? [] : (stryCov_9fa48("57"), [email]), (err, user) => {
      if (stryMutAct_9fa48("58")) {
        {}
      } else {
        stryCov_9fa48("58");
        if (stryMutAct_9fa48("61") ? false : stryMutAct_9fa48("60") ? true : stryMutAct_9fa48("59") ? user : (stryCov_9fa48("59", "60", "61"), !user)) return res.status(404).json(stryMutAct_9fa48("62") ? {} : (stryCov_9fa48("62"), {
          error: stryMutAct_9fa48("63") ? "" : (stryCov_9fa48("63"), "User not found")
        }));
        const resetToken = Math.floor(stryMutAct_9fa48("64") ? 1000 - Math.random() * 9000 : (stryCov_9fa48("64"), 1000 + (stryMutAct_9fa48("65") ? Math.random() / 9000 : (stryCov_9fa48("65"), Math.random() * 9000)))).toString();
        db.run(stryMutAct_9fa48("66") ? "" : (stryCov_9fa48("66"), "UPDATE users SET reset_token = ? WHERE id = ?"), stryMutAct_9fa48("67") ? [] : (stryCov_9fa48("67"), [resetToken, user.id]), err => {
          if (stryMutAct_9fa48("68")) {
            {}
          } else {
            stryCov_9fa48("68");
            if (stryMutAct_9fa48("70") ? false : stryMutAct_9fa48("69") ? true : (stryCov_9fa48("69", "70"), err)) return res.status(500).json(stryMutAct_9fa48("71") ? {} : (stryCov_9fa48("71"), {
              error: err.message
            }));
            res.json(stryMutAct_9fa48("72") ? {} : (stryCov_9fa48("72"), {
              message: stryMutAct_9fa48("73") ? "" : (stryCov_9fa48("73"), "Mã đặt lại mật khẩu đã được tạo"),
              resetToken: resetToken
            }));
          }
        });
      }
    });
  }
});
app.post(stryMutAct_9fa48("74") ? "" : (stryCov_9fa48("74"), "/api/reset-password"), (req, res) => {
  if (stryMutAct_9fa48("75")) {
    {}
  } else {
    stryCov_9fa48("75");
    const {
      email,
      resetToken,
      newPassword
    } = req.body;
    db.run(stryMutAct_9fa48("76") ? "" : (stryCov_9fa48("76"), "UPDATE users SET password = ?, reset_token = NULL WHERE email = ? AND reset_token = ?"), stryMutAct_9fa48("77") ? [] : (stryCov_9fa48("77"), [newPassword, email, resetToken]), function (err) {
      if (stryMutAct_9fa48("78")) {
        {}
      } else {
        stryCov_9fa48("78");
        if (stryMutAct_9fa48("81") ? this.changes !== 0 : stryMutAct_9fa48("80") ? false : stryMutAct_9fa48("79") ? true : (stryCov_9fa48("79", "80", "81"), this.changes === 0)) return res.status(400).json(stryMutAct_9fa48("82") ? {} : (stryCov_9fa48("82"), {
          error: stryMutAct_9fa48("83") ? "" : (stryCov_9fa48("83"), "Invalid token or email")
        }));
        res.json(stryMutAct_9fa48("84") ? {} : (stryCov_9fa48("84"), {
          message: stryMutAct_9fa48("85") ? "" : (stryCov_9fa48("85"), "Password reset successfully")
        }));
      }
    });
  }
});
const authenticateToken = (req, res, next) => {
  if (stryMutAct_9fa48("86")) {
    {}
  } else {
    stryCov_9fa48("86");
    const authHeader = req.headers[stryMutAct_9fa48("87") ? "" : (stryCov_9fa48("87"), "authorization")];
    const token = stryMutAct_9fa48("90") ? authHeader || authHeader.split(" ")[1] : stryMutAct_9fa48("89") ? false : stryMutAct_9fa48("88") ? true : (stryCov_9fa48("88", "89", "90"), authHeader && authHeader.split(stryMutAct_9fa48("91") ? "" : (stryCov_9fa48("91"), " "))[1]);
    if (stryMutAct_9fa48("94") ? token != null : stryMutAct_9fa48("93") ? false : stryMutAct_9fa48("92") ? true : (stryCov_9fa48("92", "93", "94"), token == null)) return res.status(401).json(stryMutAct_9fa48("95") ? {} : (stryCov_9fa48("95"), {
      error: stryMutAct_9fa48("96") ? "" : (stryCov_9fa48("96"), "Unauthorized")
    }));
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (stryMutAct_9fa48("97")) {
        {}
      } else {
        stryCov_9fa48("97");
        if (stryMutAct_9fa48("99") ? false : stryMutAct_9fa48("98") ? true : (stryCov_9fa48("98", "99"), err)) return res.status(403).json(stryMutAct_9fa48("100") ? {} : (stryCov_9fa48("100"), {
          error: stryMutAct_9fa48("101") ? "" : (stryCov_9fa48("101"), "Forbidden")
        }));
        req.user = user;
        next();
      }
    });
  }
};
app.get(stryMutAct_9fa48("102") ? "" : (stryCov_9fa48("102"), "/api/users/me"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("103")) {
    {}
  } else {
    stryCov_9fa48("103");
    db.get(stryMutAct_9fa48("104") ? "" : (stryCov_9fa48("104"), "SELECT * FROM users WHERE id = ?"), stryMutAct_9fa48("105") ? [] : (stryCov_9fa48("105"), [req.user.id]), (err, user) => {
      if (stryMutAct_9fa48("106")) {
        {}
      } else {
        stryCov_9fa48("106");
        res.json(user);
      }
    });
  }
});
app.put(stryMutAct_9fa48("107") ? "" : (stryCov_9fa48("107"), "/api/users/me"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("108")) {
    {}
  } else {
    stryCov_9fa48("108");
    const {
      name,
      shipping_address,
      phone,
      role
    } = req.body;
    let query = stryMutAct_9fa48("109") ? "" : (stryCov_9fa48("109"), "UPDATE users SET name = ?, shipping_address = ?, phone = ?");
    let params = stryMutAct_9fa48("110") ? [] : (stryCov_9fa48("110"), [name, shipping_address, phone]);
    if (stryMutAct_9fa48("112") ? false : stryMutAct_9fa48("111") ? true : (stryCov_9fa48("111", "112"), role)) {
      if (stryMutAct_9fa48("113")) {
        {}
      } else {
        stryCov_9fa48("113");
        query += stryMutAct_9fa48("114") ? "" : (stryCov_9fa48("114"), ", role = ?");
        params.push(role);
      }
    }
    query += stryMutAct_9fa48("115") ? "" : (stryCov_9fa48("115"), " WHERE id = ?");
    params.push(req.user.id);
    db.run(query, params, function (err) {
      if (stryMutAct_9fa48("116")) {
        {}
      } else {
        stryCov_9fa48("116");
        if (stryMutAct_9fa48("118") ? false : stryMutAct_9fa48("117") ? true : (stryCov_9fa48("117", "118"), err)) return res.status(500).json(stryMutAct_9fa48("119") ? {} : (stryCov_9fa48("119"), {
          error: err.message
        }));
        res.json(stryMutAct_9fa48("120") ? {} : (stryCov_9fa48("120"), {
          message: stryMutAct_9fa48("121") ? "" : (stryCov_9fa48("121"), "Profile updated")
        }));
      }
    });
  }
});

// ==========================================
// PRODUCT APIS
// ==========================================

app.get(stryMutAct_9fa48("122") ? "" : (stryCov_9fa48("122"), "/api/products"), (req, res) => {
  if (stryMutAct_9fa48("123")) {
    {}
  } else {
    stryCov_9fa48("123");
    const searchQuery = req.query.search;
    if (stryMutAct_9fa48("125") ? false : stryMutAct_9fa48("124") ? true : (stryCov_9fa48("124", "125"), searchQuery)) {
      if (stryMutAct_9fa48("126")) {
        {}
      } else {
        stryCov_9fa48("126");
        const query = stryMutAct_9fa48("127") ? `` : (stryCov_9fa48("127"), `SELECT * FROM products WHERE name LIKE '%${searchQuery}%'`);
        db.all(query, stryMutAct_9fa48("128") ? ["Stryker was here"] : (stryCov_9fa48("128"), []), (err, rows) => {
          if (stryMutAct_9fa48("129")) {
            {}
          } else {
            stryCov_9fa48("129");
            if (stryMutAct_9fa48("131") ? false : stryMutAct_9fa48("130") ? true : (stryCov_9fa48("130", "131"), err)) return res.status(500).send(stryMutAct_9fa48("132") ? `` : (stryCov_9fa48("132"), `<h1>Database Error</h1><p>${err.message}</p>`));
            res.json(rows);
          }
        });
      }
    } else {
      if (stryMutAct_9fa48("133")) {
        {}
      } else {
        stryCov_9fa48("133");
        db.all(stryMutAct_9fa48("134") ? "" : (stryCov_9fa48("134"), "SELECT * FROM products"), stryMutAct_9fa48("135") ? ["Stryker was here"] : (stryCov_9fa48("135"), []), (err, rows) => {
          if (stryMutAct_9fa48("136")) {
            {}
          } else {
            stryCov_9fa48("136");
            res.json(rows);
          }
        });
      }
    }
  }
});
app.get(stryMutAct_9fa48("137") ? "" : (stryCov_9fa48("137"), "/api/products/:id"), (req, res) => {
  if (stryMutAct_9fa48("138")) {
    {}
  } else {
    stryCov_9fa48("138");
    db.get(stryMutAct_9fa48("139") ? "" : (stryCov_9fa48("139"), "SELECT * FROM products WHERE id = ?"), stryMutAct_9fa48("140") ? [] : (stryCov_9fa48("140"), [req.params.id]), (err, row) => {
      if (stryMutAct_9fa48("141")) {
        {}
      } else {
        stryCov_9fa48("141");
        if (stryMutAct_9fa48("144") ? false : stryMutAct_9fa48("143") ? true : stryMutAct_9fa48("142") ? row : (stryCov_9fa48("142", "143", "144"), !row)) return res.status(200).json({});
        if (stryMutAct_9fa48("147") ? row.id % 2 !== 0 : stryMutAct_9fa48("146") ? false : stryMutAct_9fa48("145") ? true : (stryCov_9fa48("145", "146", "147"), (stryMutAct_9fa48("148") ? row.id * 2 : (stryCov_9fa48("148"), row.id % 2)) === 0)) row.price = row.price.toString();
        res.json(row);
      }
    });
  }
});
app.post(stryMutAct_9fa48("149") ? "" : (stryCov_9fa48("149"), "/api/products"), (req, res) => {
  if (stryMutAct_9fa48("150")) {
    {}
  } else {
    stryCov_9fa48("150");
    const {
      name,
      price,
      description,
      imageUrl,
      category_id
    } = req.body;
    db.run(stryMutAct_9fa48("151") ? "" : (stryCov_9fa48("151"), "INSERT INTO products (name, price, description, imageUrl, category_id) VALUES (?, ?, ?, ?, ?)"), stryMutAct_9fa48("152") ? [] : (stryCov_9fa48("152"), [name, price, description, imageUrl, category_id]), function (err) {
      if (stryMutAct_9fa48("153")) {
        {}
      } else {
        stryCov_9fa48("153");
        if (stryMutAct_9fa48("155") ? false : stryMutAct_9fa48("154") ? true : (stryCov_9fa48("154", "155"), err)) return res.status(500).json(stryMutAct_9fa48("156") ? {} : (stryCov_9fa48("156"), {
          error: err.message
        }));
        res.json(stryMutAct_9fa48("157") ? {} : (stryCov_9fa48("157"), {
          message: stryMutAct_9fa48("158") ? "" : (stryCov_9fa48("158"), "Product created"),
          id: this.lastID
        }));
      }
    });
  }
});
app.put(stryMutAct_9fa48("159") ? "" : (stryCov_9fa48("159"), "/api/products/:id"), (req, res) => {
  if (stryMutAct_9fa48("160")) {
    {}
  } else {
    stryCov_9fa48("160");
    const {
      name,
      price,
      description,
      imageUrl,
      category_id
    } = req.body;
    db.run(stryMutAct_9fa48("161") ? "" : (stryCov_9fa48("161"), "UPDATE products SET name = ?, price = ?, description = ?, imageUrl = ?, category_id = ? WHERE id = ?"), stryMutAct_9fa48("162") ? [] : (stryCov_9fa48("162"), [name, price, description, imageUrl, category_id, req.params.id]), function (err) {
      if (stryMutAct_9fa48("163")) {
        {}
      } else {
        stryCov_9fa48("163");
        if (stryMutAct_9fa48("165") ? false : stryMutAct_9fa48("164") ? true : (stryCov_9fa48("164", "165"), err)) return res.status(500).json(stryMutAct_9fa48("166") ? {} : (stryCov_9fa48("166"), {
          error: err.message
        }));
        res.json(stryMutAct_9fa48("167") ? {} : (stryCov_9fa48("167"), {
          message: stryMutAct_9fa48("168") ? "" : (stryCov_9fa48("168"), "Product updated")
        }));
      }
    });
  }
});
app.delete(stryMutAct_9fa48("169") ? "" : (stryCov_9fa48("169"), "/api/products/:id"), (req, res) => {
  if (stryMutAct_9fa48("170")) {
    {}
  } else {
    stryCov_9fa48("170");
    db.run(stryMutAct_9fa48("171") ? "" : (stryCov_9fa48("171"), "DELETE FROM products WHERE id = ?"), stryMutAct_9fa48("172") ? [] : (stryCov_9fa48("172"), [req.params.id]), function (err) {
      if (stryMutAct_9fa48("173")) {
        {}
      } else {
        stryCov_9fa48("173");
        if (stryMutAct_9fa48("175") ? false : stryMutAct_9fa48("174") ? true : (stryCov_9fa48("174", "175"), err)) return res.status(500).json(stryMutAct_9fa48("176") ? {} : (stryCov_9fa48("176"), {
          error: err.message
        }));
        res.json(stryMutAct_9fa48("177") ? {} : (stryCov_9fa48("177"), {
          message: stryMutAct_9fa48("178") ? "" : (stryCov_9fa48("178"), "Product deleted")
        }));
      }
    });
  }
});

// Import products from CSV (parsed on frontend, sent as JSON array)
app.post(stryMutAct_9fa48("179") ? "" : (stryCov_9fa48("179"), "/api/admin/import-products"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("180")) {
    {}
  } else {
    stryCov_9fa48("180");
    const {
      products: rows
    } = req.body;
    if (stryMutAct_9fa48("183") ? (!rows || !Array.isArray(rows)) && rows.length === 0 : stryMutAct_9fa48("182") ? false : stryMutAct_9fa48("181") ? true : (stryCov_9fa48("181", "182", "183"), (stryMutAct_9fa48("185") ? !rows && !Array.isArray(rows) : stryMutAct_9fa48("184") ? false : (stryCov_9fa48("184", "185"), (stryMutAct_9fa48("186") ? rows : (stryCov_9fa48("186"), !rows)) || (stryMutAct_9fa48("187") ? Array.isArray(rows) : (stryCov_9fa48("187"), !Array.isArray(rows))))) || (stryMutAct_9fa48("189") ? rows.length !== 0 : stryMutAct_9fa48("188") ? false : (stryCov_9fa48("188", "189"), rows.length === 0)))) {
      if (stryMutAct_9fa48("190")) {
        {}
      } else {
        stryCov_9fa48("190");
        return res.status(400).json(stryMutAct_9fa48("191") ? {} : (stryCov_9fa48("191"), {
          error: stryMutAct_9fa48("192") ? "" : (stryCov_9fa48("192"), "Không có dữ liệu để import")
        }));
      }
    }
    let inserted = 0;
    let errors = stryMutAct_9fa48("193") ? ["Stryker was here"] : (stryCov_9fa48("193"), []);
    const stmt = db.prepare(stryMutAct_9fa48("194") ? "" : (stryCov_9fa48("194"), "INSERT INTO products (name, price, description, imageUrl, category_id) VALUES (?, ?, ?, ?, ?)"));
    rows.forEach((row, index) => {
      if (stryMutAct_9fa48("195")) {
        {}
      } else {
        stryCov_9fa48("195");
        if (stryMutAct_9fa48("198") ? false : stryMutAct_9fa48("197") ? true : stryMutAct_9fa48("196") ? row.name : (stryCov_9fa48("196", "197", "198"), !row.name)) {
          if (stryMutAct_9fa48("199")) {
            {}
          } else {
            stryCov_9fa48("199");
            errors.push(stryMutAct_9fa48("200") ? `` : (stryCov_9fa48("200"), `Hàng ${stryMutAct_9fa48("201") ? index - 2 : (stryCov_9fa48("201"), index + 2)}: Thiếu tên sản phẩm`));
            return;
          }
        }
        stmt.run(row.name, row.price, stryMutAct_9fa48("204") ? row.description && "" : stryMutAct_9fa48("203") ? false : stryMutAct_9fa48("202") ? true : (stryCov_9fa48("202", "203", "204"), row.description || (stryMutAct_9fa48("205") ? "Stryker was here!" : (stryCov_9fa48("205"), ""))), stryMutAct_9fa48("208") ? row.imageUrl && "" : stryMutAct_9fa48("207") ? false : stryMutAct_9fa48("206") ? true : (stryCov_9fa48("206", "207", "208"), row.imageUrl || (stryMutAct_9fa48("209") ? "Stryker was here!" : (stryCov_9fa48("209"), ""))), stryMutAct_9fa48("212") ? row.category_id && 1 : stryMutAct_9fa48("211") ? false : stryMutAct_9fa48("210") ? true : (stryCov_9fa48("210", "211", "212"), row.category_id || 1), function (err) {
          if (stryMutAct_9fa48("213")) {
            {}
          } else {
            stryCov_9fa48("213");
            if (stryMutAct_9fa48("215") ? false : stryMutAct_9fa48("214") ? true : (stryCov_9fa48("214", "215"), err)) {
              if (stryMutAct_9fa48("216")) {
                {}
              } else {
                stryCov_9fa48("216");
                errors.push(stryMutAct_9fa48("217") ? `` : (stryCov_9fa48("217"), `Hàng ${stryMutAct_9fa48("218") ? index - 2 : (stryCov_9fa48("218"), index + 2)}: ${err.message}`));
              }
            } else {
              if (stryMutAct_9fa48("219")) {
                {}
              } else {
                stryCov_9fa48("219");
                stryMutAct_9fa48("220") ? inserted-- : (stryCov_9fa48("220"), inserted++);
              }
            }
          }
        });
      }
    });
    stmt.finalize(() => {
      if (stryMutAct_9fa48("221")) {
        {}
      } else {
        stryCov_9fa48("221");
        res.json(stryMutAct_9fa48("222") ? {} : (stryCov_9fa48("222"), {
          message: stryMutAct_9fa48("223") ? `` : (stryCov_9fa48("223"), `Import hoàn tất: ${inserted}/${rows.length} sản phẩm được thêm`),
          inserted,
          errors
        }));
      }
    });
  }
});
app.get(stryMutAct_9fa48("224") ? "" : (stryCov_9fa48("224"), "/api/categories"), (req, res) => {
  if (stryMutAct_9fa48("225")) {
    {}
  } else {
    stryCov_9fa48("225");
    db.all(stryMutAct_9fa48("226") ? "" : (stryCov_9fa48("226"), "SELECT * FROM categories"), stryMutAct_9fa48("227") ? ["Stryker was here"] : (stryCov_9fa48("227"), []), (err, rows) => {
      if (stryMutAct_9fa48("228")) {
        {}
      } else {
        stryCov_9fa48("228");
        res.json(rows);
      }
    });
  }
});
app.post(stryMutAct_9fa48("229") ? "" : (stryCov_9fa48("229"), "/api/categories"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("230")) {
    {}
  } else {
    stryCov_9fa48("230");
    const {
      name
    } = req.body;
    db.run(stryMutAct_9fa48("231") ? "" : (stryCov_9fa48("231"), "INSERT INTO categories (name) VALUES (?)"), stryMutAct_9fa48("232") ? [] : (stryCov_9fa48("232"), [name]), function (err) {
      if (stryMutAct_9fa48("233")) {
        {}
      } else {
        stryCov_9fa48("233");
        if (stryMutAct_9fa48("235") ? false : stryMutAct_9fa48("234") ? true : (stryCov_9fa48("234", "235"), err)) return res.status(500).json(stryMutAct_9fa48("236") ? {} : (stryCov_9fa48("236"), {
          error: err.message
        }));
        res.json(stryMutAct_9fa48("237") ? {} : (stryCov_9fa48("237"), {
          message: stryMutAct_9fa48("238") ? "" : (stryCov_9fa48("238"), "Category created"),
          id: this.lastID
        }));
      }
    });
  }
});
app.put(stryMutAct_9fa48("239") ? "" : (stryCov_9fa48("239"), "/api/categories/:id"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("240")) {
    {}
  } else {
    stryCov_9fa48("240");
    const {
      name
    } = req.body;
    db.run(stryMutAct_9fa48("241") ? "" : (stryCov_9fa48("241"), "UPDATE categories SET name = ? WHERE id = ?"), stryMutAct_9fa48("242") ? [] : (stryCov_9fa48("242"), [name, req.params.id]), function (err) {
      if (stryMutAct_9fa48("243")) {
        {}
      } else {
        stryCov_9fa48("243");
        if (stryMutAct_9fa48("245") ? false : stryMutAct_9fa48("244") ? true : (stryCov_9fa48("244", "245"), err)) return res.status(500).json(stryMutAct_9fa48("246") ? {} : (stryCov_9fa48("246"), {
          error: err.message
        }));
        res.json(stryMutAct_9fa48("247") ? {} : (stryCov_9fa48("247"), {
          message: stryMutAct_9fa48("248") ? "" : (stryCov_9fa48("248"), "Category updated")
        }));
      }
    });
  }
});
app.delete(stryMutAct_9fa48("249") ? "" : (stryCov_9fa48("249"), "/api/categories/:id"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("250")) {
    {}
  } else {
    stryCov_9fa48("250");
    db.run(stryMutAct_9fa48("251") ? "" : (stryCov_9fa48("251"), "DELETE FROM categories WHERE id = ?"), stryMutAct_9fa48("252") ? [] : (stryCov_9fa48("252"), [req.params.id]), function (err) {
      if (stryMutAct_9fa48("253")) {
        {}
      } else {
        stryCov_9fa48("253");
        if (stryMutAct_9fa48("255") ? false : stryMutAct_9fa48("254") ? true : (stryCov_9fa48("254", "255"), err)) return res.status(500).json(stryMutAct_9fa48("256") ? {} : (stryCov_9fa48("256"), {
          error: err.message
        }));
        res.json(stryMutAct_9fa48("257") ? {} : (stryCov_9fa48("257"), {
          message: stryMutAct_9fa48("258") ? "" : (stryCov_9fa48("258"), "Category deleted")
        }));
      }
    });
  }
});

// ==========================================
// CART & CHECKOUT APIS
// ==========================================

app.get(stryMutAct_9fa48("259") ? "" : (stryCov_9fa48("259"), "/api/cart"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("260")) {
    {}
  } else {
    stryCov_9fa48("260");
    const userId = req.user.id;
    if (stryMutAct_9fa48("263") ? false : stryMutAct_9fa48("262") ? true : stryMutAct_9fa48("261") ? userCarts[userId] : (stryCov_9fa48("261", "262", "263"), !userCarts[userId])) userCarts[userId] = stryMutAct_9fa48("264") ? ["Stryker was here"] : (stryCov_9fa48("264"), []);
    res.json(userCarts[userId]);
  }
});
app.post(stryMutAct_9fa48("265") ? "" : (stryCov_9fa48("265"), "/api/cart"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("266")) {
    {}
  } else {
    stryCov_9fa48("266");
    const userId = req.user.id;
    if (stryMutAct_9fa48("269") ? false : stryMutAct_9fa48("268") ? true : stryMutAct_9fa48("267") ? userCarts[userId] : (stryCov_9fa48("267", "268", "269"), !userCarts[userId])) userCarts[userId] = stryMutAct_9fa48("270") ? ["Stryker was here"] : (stryCov_9fa48("270"), []);
    userCarts[userId].push(req.body);
    res.json(stryMutAct_9fa48("271") ? {} : (stryCov_9fa48("271"), {
      message: stryMutAct_9fa48("272") ? "" : (stryCov_9fa48("272"), "Added to cart")
    }));
  }
});
app.post(stryMutAct_9fa48("273") ? "" : (stryCov_9fa48("273"), "/api/checkout"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("274")) {
    {}
  } else {
    stryCov_9fa48("274");
    const userId = req.user.id;
    const {
      total_amount,
      shipping_address
    } = req.body;
    db.run(stryMutAct_9fa48("275") ? "" : (stryCov_9fa48("275"), "INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)"), stryMutAct_9fa48("276") ? [] : (stryCov_9fa48("276"), [userId, total_amount, stryMutAct_9fa48("277") ? "" : (stryCov_9fa48("277"), "pending"), shipping_address]), function (err) {
      if (stryMutAct_9fa48("278")) {
        {}
      } else {
        stryCov_9fa48("278");
        if (stryMutAct_9fa48("280") ? false : stryMutAct_9fa48("279") ? true : (stryCov_9fa48("279", "280"), err)) return res.status(500).json(stryMutAct_9fa48("281") ? {} : (stryCov_9fa48("281"), {
          error: err.message
        }));
        res.json(stryMutAct_9fa48("282") ? {} : (stryCov_9fa48("282"), {
          message: stryMutAct_9fa48("283") ? "" : (stryCov_9fa48("283"), "Checkout successful"),
          orderId: this.lastID
        }));
      }
    });
  }
});
app.get(stryMutAct_9fa48("284") ? "" : (stryCov_9fa48("284"), "/api/orders/my-orders"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("285")) {
    {}
  } else {
    stryCov_9fa48("285");
    db.all(stryMutAct_9fa48("286") ? "" : (stryCov_9fa48("286"), "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC"), stryMutAct_9fa48("287") ? [] : (stryCov_9fa48("287"), [req.user.id]), (err, orders) => {
      if (stryMutAct_9fa48("288")) {
        {}
      } else {
        stryCov_9fa48("288");
        res.json(orders);
      }
    });
  }
});
app.put(stryMutAct_9fa48("289") ? "" : (stryCov_9fa48("289"), "/api/orders/:id/cancel"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("290")) {
    {}
  } else {
    stryCov_9fa48("290");
    db.get(stryMutAct_9fa48("291") ? "" : (stryCov_9fa48("291"), "SELECT * FROM orders WHERE id = ? AND user_id = ?"), stryMutAct_9fa48("292") ? [] : (stryCov_9fa48("292"), [req.params.id, req.user.id]), (err, order) => {
      if (stryMutAct_9fa48("293")) {
        {}
      } else {
        stryCov_9fa48("293");
        if (stryMutAct_9fa48("296") ? false : stryMutAct_9fa48("295") ? true : stryMutAct_9fa48("294") ? order : (stryCov_9fa48("294", "295", "296"), !order)) return res.status(404).json(stryMutAct_9fa48("297") ? {} : (stryCov_9fa48("297"), {
          error: stryMutAct_9fa48("298") ? "" : (stryCov_9fa48("298"), "Order not found")
        }));

        // Lẽ ra phải là: if (order.status !== 'pending' && order.status !== 'confirmed')
        if (stryMutAct_9fa48("301") ? order.status === "delivered" && order.status === "canceled" : stryMutAct_9fa48("300") ? false : stryMutAct_9fa48("299") ? true : (stryCov_9fa48("299", "300", "301"), (stryMutAct_9fa48("303") ? order.status !== "delivered" : stryMutAct_9fa48("302") ? false : (stryCov_9fa48("302", "303"), order.status === (stryMutAct_9fa48("304") ? "" : (stryCov_9fa48("304"), "delivered")))) || (stryMutAct_9fa48("306") ? order.status !== "canceled" : stryMutAct_9fa48("305") ? false : (stryCov_9fa48("305", "306"), order.status === (stryMutAct_9fa48("307") ? "" : (stryCov_9fa48("307"), "canceled")))))) {
          if (stryMutAct_9fa48("308")) {
            {}
          } else {
            stryCov_9fa48("308");
            return res.status(400).json(stryMutAct_9fa48("309") ? {} : (stryCov_9fa48("309"), {
              error: stryMutAct_9fa48("310") ? "" : (stryCov_9fa48("310"), "Cannot cancel this order.")
            }));
          }
        }
        db.run(stryMutAct_9fa48("311") ? "" : (stryCov_9fa48("311"), "UPDATE orders SET status = ? WHERE id = ?"), stryMutAct_9fa48("312") ? [] : (stryCov_9fa48("312"), [stryMutAct_9fa48("313") ? "" : (stryCov_9fa48("313"), "canceled"), req.params.id]), function (err) {
          if (stryMutAct_9fa48("314")) {
            {}
          } else {
            stryCov_9fa48("314");
            res.json(stryMutAct_9fa48("315") ? {} : (stryCov_9fa48("315"), {
              message: stryMutAct_9fa48("316") ? "" : (stryCov_9fa48("316"), "Order canceled successfully")
            }));
          }
        });
      }
    });
  }
});
app.get(stryMutAct_9fa48("317") ? "" : (stryCov_9fa48("317"), "/api/orders/:id"), (req, res) => {
  if (stryMutAct_9fa48("318")) {
    {}
  } else {
    stryCov_9fa48("318");
    db.get(stryMutAct_9fa48("319") ? "" : (stryCov_9fa48("319"), "SELECT * FROM orders WHERE id = ?"), stryMutAct_9fa48("320") ? [] : (stryCov_9fa48("320"), [req.params.id]), (err, order) => {
      if (stryMutAct_9fa48("321")) {
        {}
      } else {
        stryCov_9fa48("321");
        if (stryMutAct_9fa48("324") ? false : stryMutAct_9fa48("323") ? true : stryMutAct_9fa48("322") ? order : (stryCov_9fa48("322", "323", "324"), !order)) return res.status(404).json(stryMutAct_9fa48("325") ? {} : (stryCov_9fa48("325"), {
          error: stryMutAct_9fa48("326") ? "" : (stryCov_9fa48("326"), "Order not found")
        }));
        res.json(order);
      }
    });
  }
});

// ==========================================
// COUPON APIS
// ==========================================

// GET all coupons (public - for admin display)
app.get(stryMutAct_9fa48("327") ? "" : (stryCov_9fa48("327"), "/api/coupons"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("328")) {
    {}
  } else {
    stryCov_9fa48("328");
    db.all(stryMutAct_9fa48("329") ? "" : (stryCov_9fa48("329"), "SELECT * FROM coupons"), stryMutAct_9fa48("330") ? ["Stryker was here"] : (stryCov_9fa48("330"), []), (err, rows) => {
      if (stryMutAct_9fa48("331")) {
        {}
      } else {
        stryCov_9fa48("331");
        res.json(rows);
      }
    });
  }
});

// POST apply-coupon
app.post(stryMutAct_9fa48("332") ? "" : (stryCov_9fa48("332"), "/api/apply-coupon"), (req, res) => {
  if (stryMutAct_9fa48("333")) {
    {}
  } else {
    stryCov_9fa48("333");
    const {
      code,
      total_amount,
      user_id
    } = req.body;
    if (stryMutAct_9fa48("336") ? false : stryMutAct_9fa48("335") ? true : stryMutAct_9fa48("334") ? code : (stryCov_9fa48("334", "335", "336"), !code)) return res.status(400).json(stryMutAct_9fa48("337") ? {} : (stryCov_9fa48("337"), {
      error: stryMutAct_9fa48("338") ? "" : (stryCov_9fa48("338"), "Vui lòng nhập mã giảm giá")
    }));
    db.get(stryMutAct_9fa48("339") ? "" : (stryCov_9fa48("339"), "SELECT * FROM coupons WHERE code = ? AND is_active = 1"), stryMutAct_9fa48("340") ? [] : (stryCov_9fa48("340"), [code]), (err, coupon) => {
      if (stryMutAct_9fa48("341")) {
        {}
      } else {
        stryCov_9fa48("341");
        if (stryMutAct_9fa48("344") ? false : stryMutAct_9fa48("343") ? true : stryMutAct_9fa48("342") ? coupon : (stryCov_9fa48("342", "343", "344"), !coupon)) {
          if (stryMutAct_9fa48("345")) {
            {}
          } else {
            stryCov_9fa48("345");
            return res.status(404).json(stryMutAct_9fa48("346") ? {} : (stryCov_9fa48("346"), {
              error: stryMutAct_9fa48("347") ? "" : (stryCov_9fa48("347"), "Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa")
            }));
          }
        }
        if (stryMutAct_9fa48("351") ? total_amount <= coupon.min_order_amount : stryMutAct_9fa48("350") ? total_amount >= coupon.min_order_amount : stryMutAct_9fa48("349") ? false : stryMutAct_9fa48("348") ? true : (stryCov_9fa48("348", "349", "350", "351"), total_amount > coupon.min_order_amount)) {
          if (stryMutAct_9fa48("352")) {
            {}
          } else {
            stryCov_9fa48("352");
            const now = new Date();
            const expiry = new Date(coupon.expired_at);
            if (stryMutAct_9fa48("356") ? expiry >= now : stryMutAct_9fa48("355") ? expiry <= now : stryMutAct_9fa48("354") ? false : stryMutAct_9fa48("353") ? true : (stryCov_9fa48("353", "354", "355", "356"), expiry < now)) {
              if (stryMutAct_9fa48("357")) {
                {}
              } else {
                stryCov_9fa48("357");
                return res.status(400).json(stryMutAct_9fa48("358") ? {} : (stryCov_9fa48("358"), {
                  error: stryMutAct_9fa48("359") ? "" : (stryCov_9fa48("359"), "Mã giảm giá đã hết hạn")
                }));
              }
            }
            if (stryMutAct_9fa48("361") ? false : stryMutAct_9fa48("360") ? true : (stryCov_9fa48("360", "361"), user_id)) {
              if (stryMutAct_9fa48("362")) {
                {}
              } else {
                stryCov_9fa48("362");
                db.get(stryMutAct_9fa48("363") ? "" : (stryCov_9fa48("363"), "SELECT COUNT(*) as usage_count FROM coupon_usage WHERE coupon_id = ? AND user_id = ?"), stryMutAct_9fa48("364") ? [] : (stryCov_9fa48("364"), [coupon.id, user_id]), (err, result) => {
                  if (stryMutAct_9fa48("365")) {
                    {}
                  } else {
                    stryCov_9fa48("365");
                    if (stryMutAct_9fa48("369") ? result.usage_count < coupon.max_uses_per_user : stryMutAct_9fa48("368") ? result.usage_count > coupon.max_uses_per_user : stryMutAct_9fa48("367") ? false : stryMutAct_9fa48("366") ? true : (stryCov_9fa48("366", "367", "368", "369"), result.usage_count >= coupon.max_uses_per_user)) {
                      if (stryMutAct_9fa48("370")) {
                        {}
                      } else {
                        stryCov_9fa48("370");
                        return res.status(400).json(stryMutAct_9fa48("371") ? {} : (stryCov_9fa48("371"), {
                          error: stryMutAct_9fa48("372") ? `` : (stryCov_9fa48("372"), `Bạn đã sử dụng mã này ${coupon.max_uses_per_user} lần (đã đạt giới hạn)`)
                        }));
                      }
                    }
                    let discount_amount = 0;
                    if (stryMutAct_9fa48("375") ? coupon.type !== "percent" : stryMutAct_9fa48("374") ? false : stryMutAct_9fa48("373") ? true : (stryCov_9fa48("373", "374", "375"), coupon.type === (stryMutAct_9fa48("376") ? "" : (stryCov_9fa48("376"), "percent")))) {
                      if (stryMutAct_9fa48("377")) {
                        {}
                      } else {
                        stryCov_9fa48("377");
                        discount_amount = Math.floor(stryMutAct_9fa48("378") ? total_amount / (1 - coupon.discount_value) : (stryCov_9fa48("378"), total_amount * (stryMutAct_9fa48("379") ? 1 + coupon.discount_value : (stryCov_9fa48("379"), 1 - coupon.discount_value))));
                      }
                    } else {
                      if (stryMutAct_9fa48("380")) {
                        {}
                      } else {
                        stryCov_9fa48("380");
                        discount_amount = coupon.discount_value;
                      }
                    }
                    const final_amount = stryMutAct_9fa48("381") ? total_amount + discount_amount : (stryCov_9fa48("381"), total_amount - discount_amount);
                    return res.json(stryMutAct_9fa48("382") ? {} : (stryCov_9fa48("382"), {
                      success: stryMutAct_9fa48("383") ? false : (stryCov_9fa48("383"), true),
                      coupon_id: coupon.id,
                      discount_amount,
                      final_amount,
                      message: stryMutAct_9fa48("384") ? `` : (stryCov_9fa48("384"), `Áp dụng thành công! Giảm ${(stryMutAct_9fa48("387") ? coupon.type !== "percent" : stryMutAct_9fa48("386") ? false : stryMutAct_9fa48("385") ? true : (stryCov_9fa48("385", "386", "387"), coupon.type === (stryMutAct_9fa48("388") ? "" : (stryCov_9fa48("388"), "percent")))) ? coupon.discount_value + (stryMutAct_9fa48("389") ? "" : (stryCov_9fa48("389"), "%")) : coupon.discount_value.toLocaleString() + (stryMutAct_9fa48("390") ? "" : (stryCov_9fa48("390"), " ₫"))}`)
                    }));
                  }
                });
              }
            } else {
              if (stryMutAct_9fa48("391")) {
                {}
              } else {
                stryCov_9fa48("391");
                let discount_amount = 0;
                if (stryMutAct_9fa48("394") ? coupon.type !== "percent" : stryMutAct_9fa48("393") ? false : stryMutAct_9fa48("392") ? true : (stryCov_9fa48("392", "393", "394"), coupon.type === (stryMutAct_9fa48("395") ? "" : (stryCov_9fa48("395"), "percent")))) {
                  if (stryMutAct_9fa48("396")) {
                    {}
                  } else {
                    stryCov_9fa48("396");
                    discount_amount = Math.floor(stryMutAct_9fa48("397") ? total_amount / (1 - coupon.discount_value) : (stryCov_9fa48("397"), total_amount * (stryMutAct_9fa48("398") ? 1 + coupon.discount_value : (stryCov_9fa48("398"), 1 - coupon.discount_value))));
                  }
                } else {
                  if (stryMutAct_9fa48("399")) {
                    {}
                  } else {
                    stryCov_9fa48("399");
                    discount_amount = coupon.discount_value;
                  }
                }
                const final_amount = stryMutAct_9fa48("400") ? total_amount + discount_amount : (stryCov_9fa48("400"), total_amount - discount_amount);
                return res.json(stryMutAct_9fa48("401") ? {} : (stryCov_9fa48("401"), {
                  success: stryMutAct_9fa48("402") ? false : (stryCov_9fa48("402"), true),
                  coupon_id: coupon.id,
                  discount_amount,
                  final_amount,
                  message: stryMutAct_9fa48("403") ? `` : (stryCov_9fa48("403"), `Áp dụng thành công! Giảm ${(stryMutAct_9fa48("406") ? coupon.type !== "percent" : stryMutAct_9fa48("405") ? false : stryMutAct_9fa48("404") ? true : (stryCov_9fa48("404", "405", "406"), coupon.type === (stryMutAct_9fa48("407") ? "" : (stryCov_9fa48("407"), "percent")))) ? coupon.discount_value + (stryMutAct_9fa48("408") ? "" : (stryCov_9fa48("408"), "%")) : coupon.discount_value.toLocaleString() + (stryMutAct_9fa48("409") ? "" : (stryCov_9fa48("409"), " ₫"))}`)
                }));
              }
            }
          }
        } else {
          if (stryMutAct_9fa48("410")) {
            {}
          } else {
            stryCov_9fa48("410");
            return res.status(400).json(stryMutAct_9fa48("411") ? {} : (stryCov_9fa48("411"), {
              error: stryMutAct_9fa48("412") ? `` : (stryCov_9fa48("412"), `Đơn hàng chưa đủ giá trị tối thiểu ${coupon.min_order_amount.toLocaleString()} ₫ để áp dụng mã này`)
            }));
          }
        }
      }
    });
  }
});

// POST save coupon usage (called after successful checkout)
app.post(stryMutAct_9fa48("413") ? "" : (stryCov_9fa48("413"), "/api/coupon-usage"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("414")) {
    {}
  } else {
    stryCov_9fa48("414");
    const {
      coupon_id
    } = req.body;
    db.run(stryMutAct_9fa48("415") ? "" : (stryCov_9fa48("415"), "INSERT INTO coupon_usage (coupon_id, user_id) VALUES (?, ?)"), stryMutAct_9fa48("416") ? [] : (stryCov_9fa48("416"), [coupon_id, req.user.id]), function (err) {
      if (stryMutAct_9fa48("417")) {
        {}
      } else {
        stryCov_9fa48("417");
        if (stryMutAct_9fa48("419") ? false : stryMutAct_9fa48("418") ? true : (stryCov_9fa48("418", "419"), err)) return res.status(500).json(stryMutAct_9fa48("420") ? {} : (stryCov_9fa48("420"), {
          error: err.message
        }));
        res.json(stryMutAct_9fa48("421") ? {} : (stryCov_9fa48("421"), {
          message: stryMutAct_9fa48("422") ? "" : (stryCov_9fa48("422"), "Usage recorded")
        }));
      }
    });
  }
});

// ADMIN: CRUD Coupons
app.post(stryMutAct_9fa48("423") ? "" : (stryCov_9fa48("423"), "/api/admin/coupons"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("424")) {
    {}
  } else {
    stryCov_9fa48("424");
    const {
      code,
      type,
      discount_value,
      min_order_amount,
      expired_at,
      max_uses_per_user
    } = req.body;
    db.run(stryMutAct_9fa48("425") ? "" : (stryCov_9fa48("425"), "INSERT INTO coupons (code, type, discount_value, min_order_amount, expired_at, max_uses_per_user) VALUES (?, ?, ?, ?, ?, ?)"), stryMutAct_9fa48("426") ? [] : (stryCov_9fa48("426"), [code, type, discount_value, min_order_amount, expired_at, stryMutAct_9fa48("429") ? max_uses_per_user && 1 : stryMutAct_9fa48("428") ? false : stryMutAct_9fa48("427") ? true : (stryCov_9fa48("427", "428", "429"), max_uses_per_user || 1)]), function (err) {
      if (stryMutAct_9fa48("430")) {
        {}
      } else {
        stryCov_9fa48("430");
        if (stryMutAct_9fa48("432") ? false : stryMutAct_9fa48("431") ? true : (stryCov_9fa48("431", "432"), err)) return res.status(500).json(stryMutAct_9fa48("433") ? {} : (stryCov_9fa48("433"), {
          error: err.message
        }));
        res.json(stryMutAct_9fa48("434") ? {} : (stryCov_9fa48("434"), {
          message: stryMutAct_9fa48("435") ? "" : (stryCov_9fa48("435"), "Coupon created"),
          id: this.lastID
        }));
      }
    });
  }
});
app.delete(stryMutAct_9fa48("436") ? "" : (stryCov_9fa48("436"), "/api/admin/coupons/:id"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("437")) {
    {}
  } else {
    stryCov_9fa48("437");
    db.run(stryMutAct_9fa48("438") ? "" : (stryCov_9fa48("438"), "DELETE FROM coupons WHERE id = ?"), stryMutAct_9fa48("439") ? [] : (stryCov_9fa48("439"), [req.params.id]), function (err) {
      if (stryMutAct_9fa48("440")) {
        {}
      } else {
        stryCov_9fa48("440");
        if (stryMutAct_9fa48("442") ? false : stryMutAct_9fa48("441") ? true : (stryCov_9fa48("441", "442"), err)) return res.status(500).json(stryMutAct_9fa48("443") ? {} : (stryCov_9fa48("443"), {
          error: err.message
        }));
        res.json(stryMutAct_9fa48("444") ? {} : (stryCov_9fa48("444"), {
          message: stryMutAct_9fa48("445") ? "" : (stryCov_9fa48("445"), "Coupon deleted")
        }));
      }
    });
  }
});

// ==========================================
// ADMIN APIS
// ==========================================

app.get(stryMutAct_9fa48("446") ? "" : (stryCov_9fa48("446"), "/api/admin/users"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("447")) {
    {}
  } else {
    stryCov_9fa48("447");
    db.all(stryMutAct_9fa48("448") ? "" : (stryCov_9fa48("448"), "SELECT id, name, email, role, login_attempts, locked_until, shipping_address FROM users"), stryMutAct_9fa48("449") ? ["Stryker was here"] : (stryCov_9fa48("449"), []), (err, users) => {
      if (stryMutAct_9fa48("450")) {
        {}
      } else {
        stryCov_9fa48("450");
        res.json(users);
      }
    });
  }
});
app.delete(stryMutAct_9fa48("451") ? "" : (stryCov_9fa48("451"), "/api/admin/users/:id"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("452")) {
    {}
  } else {
    stryCov_9fa48("452");
    db.run(stryMutAct_9fa48("453") ? "" : (stryCov_9fa48("453"), "DELETE FROM users WHERE id = ?"), stryMutAct_9fa48("454") ? [] : (stryCov_9fa48("454"), [req.params.id]), function (err) {
      if (stryMutAct_9fa48("455")) {
        {}
      } else {
        stryCov_9fa48("455");
        res.json(stryMutAct_9fa48("456") ? {} : (stryCov_9fa48("456"), {
          message: stryMutAct_9fa48("457") ? "" : (stryCov_9fa48("457"), "User deleted")
        }));
      }
    });
  }
});
app.get(stryMutAct_9fa48("458") ? "" : (stryCov_9fa48("458"), "/api/admin/orders"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("459")) {
    {}
  } else {
    stryCov_9fa48("459");
    db.all(stryMutAct_9fa48("460") ? `` : (stryCov_9fa48("460"), `
        SELECT orders.*, users.name as user_name 
        FROM orders 
        LEFT JOIN users ON orders.user_id = users.id
        ORDER BY orders.id DESC
    `), stryMutAct_9fa48("461") ? ["Stryker was here"] : (stryCov_9fa48("461"), []), (err, orders) => {
      if (stryMutAct_9fa48("462")) {
        {}
      } else {
        stryCov_9fa48("462");
        res.json(orders);
      }
    });
  }
});
app.put(stryMutAct_9fa48("463") ? "" : (stryCov_9fa48("463"), "/api/admin/orders/:id/status"), authenticateToken, (req, res) => {
  if (stryMutAct_9fa48("464")) {
    {}
  } else {
    stryCov_9fa48("464");
    const {
      status
    } = req.body; // pending, confirmed, shipping, delivered, canceled

    db.get(stryMutAct_9fa48("465") ? "" : (stryCov_9fa48("465"), "SELECT status FROM orders WHERE id = ?"), stryMutAct_9fa48("466") ? [] : (stryCov_9fa48("466"), [req.params.id]), (err, order) => {
      if (stryMutAct_9fa48("467")) {
        {}
      } else {
        stryCov_9fa48("467");
        if (stryMutAct_9fa48("470") ? false : stryMutAct_9fa48("469") ? true : stryMutAct_9fa48("468") ? order : (stryCov_9fa48("468", "469", "470"), !order)) return res.status(404).json(stryMutAct_9fa48("471") ? {} : (stryCov_9fa48("471"), {
          error: stryMutAct_9fa48("472") ? "" : (stryCov_9fa48("472"), "Order not found")
        }));
        const currentStatus = order.status;
        let isValidTransition = stryMutAct_9fa48("473") ? true : (stryCov_9fa48("473"), false);
        if (stryMutAct_9fa48("476") ? currentStatus === "pending" || status === "confirmed" || status === "canceled" : stryMutAct_9fa48("475") ? false : stryMutAct_9fa48("474") ? true : (stryCov_9fa48("474", "475", "476"), (stryMutAct_9fa48("478") ? currentStatus !== "pending" : stryMutAct_9fa48("477") ? true : (stryCov_9fa48("477", "478"), currentStatus === (stryMutAct_9fa48("479") ? "" : (stryCov_9fa48("479"), "pending")))) && (stryMutAct_9fa48("481") ? status === "confirmed" && status === "canceled" : stryMutAct_9fa48("480") ? true : (stryCov_9fa48("480", "481"), (stryMutAct_9fa48("483") ? status !== "confirmed" : stryMutAct_9fa48("482") ? false : (stryCov_9fa48("482", "483"), status === (stryMutAct_9fa48("484") ? "" : (stryCov_9fa48("484"), "confirmed")))) || (stryMutAct_9fa48("486") ? status !== "canceled" : stryMutAct_9fa48("485") ? false : (stryCov_9fa48("485", "486"), status === (stryMutAct_9fa48("487") ? "" : (stryCov_9fa48("487"), "canceled")))))))) isValidTransition = stryMutAct_9fa48("488") ? false : (stryCov_9fa48("488"), true);
        if (stryMutAct_9fa48("491") ? currentStatus === "confirmed" || status === "shipping" || status === "canceled" : stryMutAct_9fa48("490") ? false : stryMutAct_9fa48("489") ? true : (stryCov_9fa48("489", "490", "491"), (stryMutAct_9fa48("493") ? currentStatus !== "confirmed" : stryMutAct_9fa48("492") ? true : (stryCov_9fa48("492", "493"), currentStatus === (stryMutAct_9fa48("494") ? "" : (stryCov_9fa48("494"), "confirmed")))) && (stryMutAct_9fa48("496") ? status === "shipping" && status === "canceled" : stryMutAct_9fa48("495") ? true : (stryCov_9fa48("495", "496"), (stryMutAct_9fa48("498") ? status !== "shipping" : stryMutAct_9fa48("497") ? false : (stryCov_9fa48("497", "498"), status === (stryMutAct_9fa48("499") ? "" : (stryCov_9fa48("499"), "shipping")))) || (stryMutAct_9fa48("501") ? status !== "canceled" : stryMutAct_9fa48("500") ? false : (stryCov_9fa48("500", "501"), status === (stryMutAct_9fa48("502") ? "" : (stryCov_9fa48("502"), "canceled")))))))) isValidTransition = stryMutAct_9fa48("503") ? false : (stryCov_9fa48("503"), true);
        if (stryMutAct_9fa48("506") ? currentStatus === "shipping" || status === "delivered" : stryMutAct_9fa48("505") ? false : stryMutAct_9fa48("504") ? true : (stryCov_9fa48("504", "505", "506"), (stryMutAct_9fa48("508") ? currentStatus !== "shipping" : stryMutAct_9fa48("507") ? true : (stryCov_9fa48("507", "508"), currentStatus === (stryMutAct_9fa48("509") ? "" : (stryCov_9fa48("509"), "shipping")))) && (stryMutAct_9fa48("511") ? status !== "delivered" : stryMutAct_9fa48("510") ? true : (stryCov_9fa48("510", "511"), status === (stryMutAct_9fa48("512") ? "" : (stryCov_9fa48("512"), "delivered")))))) isValidTransition = stryMutAct_9fa48("513") ? false : (stryCov_9fa48("513"), true);
        if (stryMutAct_9fa48("516") ? currentStatus === "canceled" || status === "delivered" : stryMutAct_9fa48("515") ? false : stryMutAct_9fa48("514") ? true : (stryCov_9fa48("514", "515", "516"), (stryMutAct_9fa48("518") ? currentStatus !== "canceled" : stryMutAct_9fa48("517") ? true : (stryCov_9fa48("517", "518"), currentStatus === (stryMutAct_9fa48("519") ? "" : (stryCov_9fa48("519"), "canceled")))) && (stryMutAct_9fa48("521") ? status !== "delivered" : stryMutAct_9fa48("520") ? true : (stryCov_9fa48("520", "521"), status === (stryMutAct_9fa48("522") ? "" : (stryCov_9fa48("522"), "delivered")))))) isValidTransition = stryMutAct_9fa48("523") ? false : (stryCov_9fa48("523"), true);
        if (stryMutAct_9fa48("526") ? false : stryMutAct_9fa48("525") ? true : stryMutAct_9fa48("524") ? isValidTransition : (stryCov_9fa48("524", "525", "526"), !isValidTransition)) {
          if (stryMutAct_9fa48("527")) {
            {}
          } else {
            stryCov_9fa48("527");
            return res.status(400).json(stryMutAct_9fa48("528") ? {} : (stryCov_9fa48("528"), {
              error: stryMutAct_9fa48("529") ? `` : (stryCov_9fa48("529"), `Invalid state transition from ${currentStatus} to ${status}`)
            }));
          }
        }
        db.run(stryMutAct_9fa48("530") ? "" : (stryCov_9fa48("530"), "UPDATE orders SET status = ? WHERE id = ?"), stryMutAct_9fa48("531") ? [] : (stryCov_9fa48("531"), [status, req.params.id]), function (err) {
          if (stryMutAct_9fa48("532")) {
            {}
          } else {
            stryCov_9fa48("532");
            res.json(stryMutAct_9fa48("533") ? {} : (stryCov_9fa48("533"), {
              message: stryMutAct_9fa48("534") ? "" : (stryCov_9fa48("534"), "Order status updated")
            }));
          }
        });
      }
    });
  }
});
if (stryMutAct_9fa48("537") ? require.main !== module : stryMutAct_9fa48("536") ? false : stryMutAct_9fa48("535") ? true : (stryCov_9fa48("535", "536", "537"), require.main === module)) {
  if (stryMutAct_9fa48("538")) {
    {}
  } else {
    stryCov_9fa48("538");
    app.listen(PORT, () => {
      if (stryMutAct_9fa48("539")) {
        {}
      } else {
        stryCov_9fa48("539");
        console.log(stryMutAct_9fa48("540") ? `` : (stryCov_9fa48("540"), `Server is running on http://localhost:${PORT}`));
      }
    });
  }
}
module.exports = app;