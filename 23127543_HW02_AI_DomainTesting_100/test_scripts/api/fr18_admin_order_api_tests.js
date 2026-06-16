const {
  apiRequest,
  loadEnv,
  login,
  printSummary,
  recordResult,
  suggestion,
  writeHtmlSummary,
  writeJsonResult,
} = require("./helpers");

const FEATURE = "FR-18 Admin Order Management";
const JSON_FILE = "fr18_admin_order_api_results.json";
const HTML_FILE = "fr18_admin_order_api_results.html";

async function createOrder(userToken, label, total = 100000) {
  const response = await apiRequest({
    method: "POST",
    path: "/api/checkout",
    token: userToken,
    body: { total_amount: total, shipping_address: label },
  });
  return { response, orderId: response.responseBody && response.responseBody.orderId };
}

async function adminOrders(adminToken) {
  return apiRequest({ method: "GET", path: "/api/admin/orders", token: adminToken });
}

function findOrder(listResponse, orderId) {
  const rows = Array.isArray(listResponse.responseBody) ? listResponse.responseBody : [];
  return rows.find((order) => Number(order.id) === Number(orderId)) || null;
}

async function recordTransition(results, { testCaseId, technique, adminToken, orderId, initialStatus, targetStatus, expectedResult, verdictRule, notes }) {
  const update = await apiRequest({
    method: "PUT",
    path: `/api/admin/orders/${orderId}/status`,
    token: adminToken,
    body: { status: targetStatus },
  });
  const followUp = await adminOrders(adminToken);
  const orderAfter = findOrder(followUp, orderId);
  recordResult(results, {
    testCaseId,
    feature: FEATURE,
    technique,
    endpoint: update.endpoint,
    method: update.method,
    requestHeaders: update.requestHeaders,
    inputData: { orderId, initialStatus, targetStatus, requestBody: { status: targetStatus } },
    expectedResult,
    actualStatusCode: update.statusCode,
    actualResponseBody: {
      updateResponse: update.responseBody,
      followUpOrderStatus: orderAfter && orderAfter.status,
      followUpOrder: orderAfter,
    },
    verdictSuggestion: verdictRule ? verdictRule(update, orderAfter) : "Needs Review",
    notes: notes || "Review transition response and follow-up order status before updating the report.",
  });
}

function recordListResult(results, { testCaseId, technique, response, expectedResult, tokenType, verdictRule, notes }) {
  recordResult(results, {
    testCaseId,
    feature: FEATURE,
    technique,
    endpoint: response.endpoint,
    method: response.method,
    requestHeaders: response.requestHeaders,
    inputData: { tokenType },
    expectedResult,
    actualStatusCode: response.statusCode,
    actualResponseBody: response.responseBody,
    verdictSuggestion: verdictRule ? verdictRule(response) : "Needs Review",
    notes: notes || "Manual review required before updating the report.",
  });
}

async function main() {
  const env = loadEnv();
  const results = [];
  const userAuth = await login(env.USER_EMAIL, env.USER_PASSWORD);
  const adminAuth = await login(env.ADMIN_EMAIL, env.ADMIN_PASSWORD);
  const userToken = userAuth.token;
  const adminToken = adminAuth.token;

  const seed = await createOrder(userToken, "FR18 seed order");
  const adminList = await adminOrders(adminToken);
  recordListResult(results, {
    testCaseId: "FR18-DT-01",
    technique: "Domain Testing",
    response: adminList,
    tokenType: "admin",
    expectedResult: "Admin can view all orders.",
    verdictRule: (r) => suggestion(r.statusCode === 200 && Array.isArray(r.responseBody)),
    notes: `Created seed order ID: ${seed.orderId}. Review admin order list.`,
  });

  const regularList = await adminOrders(userToken);
  recordListResult(results, {
    testCaseId: "FR18-DT-02",
    technique: "Domain Testing",
    response: regularList,
    tokenType: "regular user",
    expectedResult: "Regular user should be rejected with 401/403.",
    verdictRule: (r) => suggestion(r.statusCode === 401 || r.statusCode === 403, "Pass", "Fail"),
    notes: "If status is 200, observed behavior indicates possible missing admin role check.",
  });

  const noTokenList = await apiRequest({ method: "GET", path: "/api/admin/orders" });
  recordListResult(results, {
    testCaseId: "FR18-DT-03",
    technique: "Domain Testing",
    response: noTokenList,
    tokenType: "none",
    expectedResult: "No token returns 401 Unauthorized.",
    verdictRule: (r) => suggestion(r.statusCode === 401),
  });

  const invalidPending = await createOrder(userToken, "FR18 pending to delivered invalid");
  await recordTransition(results, {
    testCaseId: "FR18-DT-09",
    technique: "Domain Testing",
    adminToken,
    orderId: invalidPending.orderId,
    initialStatus: "pending",
    targetStatus: "delivered",
    expectedResult: "Invalid pending -> delivered transition is rejected and order remains pending.",
    verdictRule: (r, order) => suggestion(r.statusCode !== 200 && order && order.status === "pending"),
  });

  const chain = await createOrder(userToken, "FR18 transition chain");
  await recordTransition(results, {
    testCaseId: "FR18-DT-04",
    technique: "Domain Testing",
    adminToken,
    orderId: chain.orderId,
    initialStatus: "pending",
    targetStatus: "confirmed",
    expectedResult: "pending -> confirmed succeeds.",
    verdictRule: (r, order) => suggestion(r.statusCode === 200 && order && order.status === "confirmed"),
  });
  await recordTransition(results, {
    testCaseId: "FR18-DT-05",
    technique: "Domain Testing",
    adminToken,
    orderId: chain.orderId,
    initialStatus: "confirmed",
    targetStatus: "shipping",
    expectedResult: "confirmed -> shipping succeeds.",
    verdictRule: (r, order) => suggestion(r.statusCode === 200 && order && order.status === "shipping"),
  });
  await recordTransition(results, {
    testCaseId: "FR18-DT-06",
    technique: "Domain Testing",
    adminToken,
    orderId: chain.orderId,
    initialStatus: "shipping",
    targetStatus: "delivered",
    expectedResult: "shipping -> delivered succeeds.",
    verdictRule: (r, order) => suggestion(r.statusCode === 200 && order && order.status === "delivered"),
  });
  await recordTransition(results, {
    testCaseId: "FR18-DT-10",
    technique: "Domain Testing",
    adminToken,
    orderId: chain.orderId,
    initialStatus: "delivered",
    targetStatus: "canceled",
    expectedResult: "delivered -> canceled is rejected and status remains delivered.",
    verdictRule: (r, order) => suggestion(r.statusCode !== 200 && order && order.status === "delivered"),
  });
  await recordTransition(results, {
    testCaseId: "FR18-BVA-05",
    technique: "Boundary Value Analysis",
    adminToken,
    orderId: chain.orderId,
    initialStatus: "delivered",
    targetStatus: "canceled",
    expectedResult: "Delivered final boundary rejects canceled.",
    verdictRule: (r, order) => suggestion(r.statusCode !== 200 && order && order.status === "delivered"),
  });

  const cancelFromPending = await createOrder(userToken, "FR18 pending cancel");
  await recordTransition(results, {
    testCaseId: "FR18-DT-07",
    technique: "Domain Testing",
    adminToken,
    orderId: cancelFromPending.orderId,
    initialStatus: "pending",
    targetStatus: "canceled",
    expectedResult: "pending -> canceled succeeds.",
    verdictRule: (r, order) => suggestion(r.statusCode === 200 && order && order.status === "canceled"),
  });
  await recordTransition(results, {
    testCaseId: "FR18-DT-11",
    technique: "Domain Testing",
    adminToken,
    orderId: cancelFromPending.orderId,
    initialStatus: "canceled",
    targetStatus: "delivered",
    expectedResult: "canceled -> delivered is rejected and status remains canceled.",
    verdictRule: (r, order) => suggestion(r.statusCode !== 200 && order && order.status === "canceled", "Pass", "Fail"),
    notes: "If status becomes delivered, observed behavior indicates possible final-state bug.",
  });
  await recordTransition(results, {
    testCaseId: "FR18-BVA-06",
    technique: "Boundary Value Analysis",
    adminToken,
    orderId: cancelFromPending.orderId,
    initialStatus: "canceled",
    targetStatus: "delivered",
    expectedResult: "Canceled final boundary rejects delivered.",
    verdictRule: (r, order) => suggestion(r.statusCode !== 200 && order && order.status === "canceled", "Pass", "Fail"),
  });

  const confirmedCancel = await createOrder(userToken, "FR18 confirmed cancel");
  await recordTransition(results, {
    testCaseId: "FR18-DT-04-setup-for-DT08",
    technique: "Domain Testing",
    adminToken,
    orderId: confirmedCancel.orderId,
    initialStatus: "pending",
    targetStatus: "confirmed",
    expectedResult: "Prepare confirmed order for FR18-DT-08.",
    verdictRule: (r, order) => suggestion(r.statusCode === 200 && order && order.status === "confirmed"),
  });
  await recordTransition(results, {
    testCaseId: "FR18-DT-08",
    technique: "Domain Testing",
    adminToken,
    orderId: confirmedCancel.orderId,
    initialStatus: "confirmed",
    targetStatus: "canceled",
    expectedResult: "confirmed -> canceled succeeds.",
    verdictRule: (r, order) => suggestion(r.statusCode === 200 && order && order.status === "canceled"),
  });

  const c1 = await createOrder(userToken, "FR18 confirmed boundary shipping");
  const c2 = await createOrder(userToken, "FR18 confirmed boundary canceled");
  await recordTransition(results, {
    testCaseId: "FR18-BVA-04-setup-1",
    technique: "Boundary Value Analysis",
    adminToken,
    orderId: c1.orderId,
    initialStatus: "pending",
    targetStatus: "confirmed",
    expectedResult: "Prepare first confirmed order for BVA-04.",
    verdictRule: (r, order) => suggestion(r.statusCode === 200 && order && order.status === "confirmed"),
  });
  await recordTransition(results, {
    testCaseId: "FR18-BVA-04-setup-2",
    technique: "Boundary Value Analysis",
    adminToken,
    orderId: c2.orderId,
    initialStatus: "pending",
    targetStatus: "confirmed",
    expectedResult: "Prepare second confirmed order for BVA-04.",
    verdictRule: (r, order) => suggestion(r.statusCode === 200 && order && order.status === "confirmed"),
  });
  await recordTransition(results, {
    testCaseId: "FR18-BVA-04-shipping",
    technique: "Boundary Value Analysis",
    adminToken,
    orderId: c1.orderId,
    initialStatus: "confirmed",
    targetStatus: "shipping",
    expectedResult: "Confirmed boundary allows shipping.",
    verdictRule: (r, order) => suggestion(r.statusCode === 200 && order && order.status === "shipping"),
  });
  await recordTransition(results, {
    testCaseId: "FR18-BVA-04",
    technique: "Boundary Value Analysis",
    adminToken,
    orderId: c2.orderId,
    initialStatus: "confirmed",
    targetStatus: "canceled",
    expectedResult: "Confirmed boundary allows canceled.",
    verdictRule: (r, order) => suggestion(r.statusCode === 200 && order && order.status === "canceled"),
  });

  const htmlPath = writeHtmlSummary(HTML_FILE, results);
  const jsonPath = writeJsonResult(JSON_FILE, results);
  for (const result of results) {
    result.evidenceHtmlFile = htmlPath;
    result.evidenceJsonFile = jsonPath;
  }
  writeHtmlSummary(HTML_FILE, results);
  writeJsonResult(JSON_FILE, results);
  printSummary(FEATURE, results);
}

main().catch((error) => {
  console.error("FR18 API evidence script failed:", error.message);
});
