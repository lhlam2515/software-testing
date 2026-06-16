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

const FEATURE = "FR-08 Checkout";
const JSON_FILE = "fr08_checkout_api_results.json";
const HTML_FILE = "fr08_checkout_api_results.html";

async function recordApiCase(results, { testCaseId, technique, request, expectedResult, verdictRule, notes }) {
  try {
    const response = await apiRequest(request);
    recordResult(results, {
      testCaseId,
      feature: FEATURE,
      technique,
      endpoint: response.endpoint,
      method: response.method,
      requestHeaders: response.requestHeaders,
      inputData: request.body || {},
      expectedResult,
      actualStatusCode: response.statusCode,
      actualResponseBody: response.responseBody,
      verdictSuggestion: verdictRule ? verdictRule(response) : "Needs Review",
      notes: notes || "Manual review required before updating the report.",
    });
    return response;
  } catch (error) {
    recordResult(results, {
      testCaseId,
      feature: FEATURE,
      technique,
      endpoint: request.path,
      method: request.method,
      requestHeaders: {},
      inputData: request.body || {},
      expectedResult,
      actualStatusCode: 0,
      actualResponseBody: { error: error.message },
      verdictSuggestion: "Error",
      notes: "Script/environment error. Do not treat as product failure without rerun.",
    });
    return null;
  }
}

async function main() {
  const env = loadEnv();
  const results = [];
  const auth = await login(env.USER_EMAIL, env.USER_PASSWORD);
  const token = auth.token;
  const userId = auth.user && auth.user.id;

  const noTokenRequest = { method: "POST", path: "/api/checkout", body: { total_amount: 30000000, shipping_address: "FR08 no token" } };
  await recordApiCase(results, {
    testCaseId: "FR08-DT-03",
    technique: "Domain Testing",
    request: noTokenRequest,
    expectedResult: "Checkout API without token returns 401 Unauthorized and creates no order.",
    verdictRule: (r) => suggestion(r.statusCode === 401),
  });
  await recordApiCase(results, {
    testCaseId: "FR08-BVA-07",
    technique: "Boundary Value Analysis",
    request: noTokenRequest,
    expectedResult: "Authentication below boundary: no token is rejected.",
    verdictRule: (r) => suggestion(r.statusCode === 401),
  });

  await recordApiCase(results, {
    testCaseId: "FR08-BVA-08",
    technique: "Boundary Value Analysis",
    request: { method: "POST", path: "/api/checkout", token, body: { total_amount: 100000, shipping_address: "FR08 valid token" } },
    expectedResult: "Authentication on boundary: valid token checkout succeeds with orderId.",
    verdictRule: (r) => suggestion(r.statusCode === 200 && r.responseBody && r.responseBody.orderId),
  });

  await recordApiCase(results, {
    testCaseId: "FR08-DT-08",
    technique: "Domain Testing",
    request: { method: "POST", path: "/api/checkout", token, body: { total_amount: 1, shipping_address: "FR08 manipulated total" } },
    expectedResult: "Backend recalculates from trusted cart/product data or rejects manipulated total_amount = 1.",
    verdictRule: (r) => suggestion(r.statusCode !== 200, "Pass", "Fail"),
    notes: "If status is 200, observed behavior indicates possible backend total-trust bug.",
  });

  for (const [suffix, total] of [["negative", -1], ["zero", 0]]) {
    await recordApiCase(results, {
      testCaseId: `FR08-DT-09-${suffix}`,
      technique: "Domain Testing",
      request: { method: "POST", path: "/api/checkout", token, body: { total_amount: total, shipping_address: `FR08 total ${total}` } },
      expectedResult: `Backend rejects invalid total_amount = ${total}.`,
      verdictRule: (r) => suggestion(r.statusCode !== 200, "Pass", "Fail"),
      notes: "If status is 200, observed behavior indicates possible invalid-money checkout bug.",
    });
  }

  await recordApiCase(results, {
    testCaseId: "FR08-DT-10",
    technique: "Domain Testing",
    request: { method: "POST", path: "/api/checkout", token, body: { total_amount: 500000 } },
    expectedResult: "Missing shipping address behavior is documented and reviewed against requirements.",
    verdictRule: () => "Needs Review",
  });

  await recordApiCase(results, {
    testCaseId: "FR08-DT-11",
    technique: "Domain Testing",
    request: { method: "POST", path: "/api/apply-coupon", body: { code: "VIP100", total_amount: 70000000, user_id: userId } },
    expectedResult: "Valid coupon VIP100 applies a fixed discount when total is above the minimum.",
    verdictRule: (r) => suggestion(r.statusCode === 200 && r.responseBody && r.responseBody.success),
  });

  await recordApiCase(results, {
    testCaseId: "FR08-DT-12",
    technique: "Domain Testing",
    request: { method: "POST", path: "/api/apply-coupon", body: { code: "EXPIRED", total_amount: 200000, user_id: userId } },
    expectedResult: "Expired coupon EXPIRED is rejected and total remains unchanged.",
    verdictRule: (r) => suggestion(r.statusCode !== 200),
  });

  for (const [testCaseId, total, expected] of [
    ["FR08-BVA-09", 299999, "SAVE10 below minimum is rejected."],
    ["FR08-BVA-10", 300000, "SAVE10 exactly at minimum is accepted according to SRS."],
    ["FR08-BVA-11", 300001, "SAVE10 above minimum is accepted."],
  ]) {
    await recordApiCase(results, {
      testCaseId,
      technique: "Boundary Value Analysis",
      request: { method: "POST", path: "/api/apply-coupon", body: { code: "SAVE10", total_amount: total, user_id: userId } },
      expectedResult: expected,
      verdictRule: () => "Needs Review",
      notes: "Review exact threshold behavior because implementation uses total_amount > min_order_amount.",
    });
  }

  const couponApply = await recordApiCase(results, {
    testCaseId: "FR08-BVA-12-apply",
    technique: "Boundary Value Analysis",
    request: { method: "POST", path: "/api/apply-coupon", body: { code: "VIP100", total_amount: 70000000, user_id: userId } },
    expectedResult: "VIP100 can be applied before recording usage when within max uses.",
    verdictRule: () => "Needs Review",
  });
  if (couponApply && couponApply.responseBody && couponApply.responseBody.coupon_id) {
    await recordApiCase(results, {
      testCaseId: "FR08-BVA-12",
      technique: "Boundary Value Analysis",
      request: { method: "POST", path: "/api/coupon-usage", token, body: { coupon_id: couponApply.responseBody.coupon_id } },
      expectedResult: "Coupon usage is recorded after successful checkout when coupon_id is available.",
      verdictRule: (r) => suggestion(r.statusCode === 200),
      notes: "This records one usage. Full first/second/third-use boundary still needs review with fresh data.",
    });
  }

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
  console.error("FR08 API evidence script failed:", error.message);
});
