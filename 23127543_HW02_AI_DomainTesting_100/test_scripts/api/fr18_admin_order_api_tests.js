const {
  apiRequest,
  appendResult,
  login,
  printSummary,
  writeJsonResult,
} = require("./helpers");

const FEATURE = "FR-18 Admin Order Management";
const FILE = "fr18_admin_order_api_results.json";

async function createOrder(userToken, label, total = 100000) {
  const response = await apiRequest("POST", "/checkout", {
    total_amount: total,
    shipping_address: label,
  }, userToken);
  return { response, orderId: response.data && response.data.orderId };
}

async function update(adminToken, orderId, status) {
  return apiRequest("PUT", `/admin/orders/${orderId}/status`, { status }, adminToken);
}

async function getOrder(orderId) {
  return apiRequest("GET", `/orders/${orderId}`);
}

function add(results, id, expected, response, review = true, extra = {}) {
  appendResult(results, {
    testCaseId: id,
    feature: FEATURE,
    expected,
    actual: `Status ${response.status}; body ${JSON.stringify(response.data)}`,
    statusCode: response.status,
    verdictSuggestion: extra.suggestion || "Needs Review",
    humanReviewRequired: review,
    ...extra,
  });
}

async function main() {
  const results = [];
  const userAuth = await login(process.env.USER_EMAIL || "test@eshop.com", process.env.USER_PASSWORD || "Test1234!");
  const adminAuth = await login(process.env.ADMIN_EMAIL || "admin@eshop.com", process.env.ADMIN_PASSWORD || "Admin123!");
  const userToken = userAuth.token;
  const adminToken = adminAuth.token;

  const seed = await createOrder(userToken, "FR18 seed order");
  const adminList = await apiRequest("GET", "/admin/orders", null, adminToken);
  add(results, "FR18-DT-01", "Admin can view all orders.", adminList, true, { createdOrderId: seed.orderId });

  const regularList = await apiRequest("GET", "/admin/orders", null, userToken);
  add(results, "FR18-DT-02", "Regular user should be rejected with 401/403.", regularList, true, {
    suggestion: regularList.status === 401 || regularList.status === 403 ? "Pass" : "Fail",
  });

  const noToken = await apiRequest("GET", "/admin/orders");
  add(results, "FR18-DT-03", "No token returns 401 Unauthorized.", noToken, false, {
    suggestion: noToken.status === 401 ? "Pass" : "Fail",
  });

  const o1 = await createOrder(userToken, "FR18 pending to delivered invalid");
  add(results, "FR18-DT-09", "pending -> delivered is rejected and remains pending.", await update(adminToken, o1.orderId, "delivered"), true, {
    orderAfter: await getOrder(o1.orderId),
  });

  const o2 = await createOrder(userToken, "FR18 transition chain");
  add(results, "FR18-DT-04", "pending -> confirmed succeeds.", await update(adminToken, o2.orderId, "confirmed"), true, { orderAfter: await getOrder(o2.orderId) });
  add(results, "FR18-DT-05", "confirmed -> shipping succeeds.", await update(adminToken, o2.orderId, "shipping"), true, { orderAfter: await getOrder(o2.orderId) });
  add(results, "FR18-DT-06", "shipping -> delivered succeeds.", await update(adminToken, o2.orderId, "delivered"), true, { orderAfter: await getOrder(o2.orderId) });
  add(results, "FR18-DT-10", "delivered -> canceled is rejected.", await update(adminToken, o2.orderId, "canceled"), true, { orderAfter: await getOrder(o2.orderId) });
  add(results, "FR18-BVA-05", "Delivered final-state boundary rejects canceled.", await update(adminToken, o2.orderId, "canceled"), true, { orderAfter: await getOrder(o2.orderId) });

  const o3 = await createOrder(userToken, "FR18 pending cancel");
  add(results, "FR18-DT-07", "pending -> canceled succeeds.", await update(adminToken, o3.orderId, "canceled"), true, { orderAfter: await getOrder(o3.orderId) });
  add(results, "FR18-DT-11", "canceled -> delivered should be rejected.", await update(adminToken, o3.orderId, "delivered"), true, { orderAfter: await getOrder(o3.orderId) });
  add(results, "FR18-BVA-06", "Canceled final-state boundary rejects delivered.", await update(adminToken, o3.orderId, "delivered"), true, { orderAfter: await getOrder(o3.orderId) });

  const o4 = await createOrder(userToken, "FR18 confirmed cancel");
  await update(adminToken, o4.orderId, "confirmed");
  add(results, "FR18-DT-08", "confirmed -> canceled succeeds.", await update(adminToken, o4.orderId, "canceled"), true, { orderAfter: await getOrder(o4.orderId) });

  const b1 = await createOrder(userToken, "FR18 BVA one order");
  const b2 = await createOrder(userToken, "FR18 BVA two orders");
  add(results, "FR18-BVA-02", "At least one created order is visible to admin.", await apiRequest("GET", "/admin/orders", null, adminToken), true, { createdOrderIds: [b1.orderId] });
  add(results, "FR18-BVA-03", "Two or more orders are visible and sorted for admin review.", await apiRequest("GET", "/admin/orders", null, adminToken), true, { createdOrderIds: [b1.orderId, b2.orderId] });

  const c1 = await createOrder(userToken, "FR18 confirmed boundary shipping");
  const c2 = await createOrder(userToken, "FR18 confirmed boundary cancel");
  await update(adminToken, c1.orderId, "confirmed");
  await update(adminToken, c2.orderId, "confirmed");
  add(results, "FR18-BVA-04-shipping", "One confirmed order can transition to shipping.", await update(adminToken, c1.orderId, "shipping"), true, { orderAfter: await getOrder(c1.orderId) });
  add(results, "FR18-BVA-04-canceled", "Another confirmed order can transition to canceled.", await update(adminToken, c2.orderId, "canceled"), true, { orderAfter: await getOrder(c2.orderId) });

  add(results, "FR18-BVA-01", "0-order empty state requires a clean database and is manual/destructive; script does not reset DB.", { status: 0, data: { note: "Not executed by script to avoid deleting existing evidence data." } }, true, { suggestion: "Needs Review" });

  const evidenceFile = writeJsonResult(FILE, {
    generatedAt: new Date().toISOString(),
    feature: FEATURE,
    warning: "Verdict suggestions are not final report verdicts. Review manually before updating report tables.",
    results,
  });
  results.forEach((r) => (r.evidenceFile = evidenceFile));
  writeJsonResult(FILE, { generatedAt: new Date().toISOString(), feature: FEATURE, results });
  printSummary(FEATURE, results);
}

main().catch((error) => {
  console.error("FR18 API run error:", error.message);
});
