const {
  apiRequest,
  appendResult,
  login,
  printSummary,
  writeJsonResult,
} = require("./helpers");

const FEATURE = "FR-08 Checkout";
const FILE = "fr08_checkout_api_results.json";

async function checkout(token, body) {
  return apiRequest("POST", "/checkout", body, token);
}

async function coupon(body) {
  return apiRequest("POST", "/apply-coupon", body);
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
  const token = userAuth.token;
  const userId = userAuth.user && userAuth.user.id;

  const noToken = await checkout(null, { total_amount: 30000000, shipping_address: "FR08 no token" });
  add(results, "FR08-DT-03", "Checkout without token returns 401 Unauthorized.", noToken, false, { suggestion: noToken.status === 401 ? "Pass" : "Fail" });
  add(results, "FR08-BVA-07", "No-token authentication boundary returns 401 Unauthorized.", noToken, false, { suggestion: noToken.status === 401 ? "Pass" : "Fail" });

  const valid = await checkout(token, { total_amount: 100000, shipping_address: "FR08 valid token" });
  add(results, "FR08-BVA-08", "Valid token checkout returns success with orderId.", valid, true);

  add(results, "FR08-DT-08", "Backend rejects or recalculates manipulated total_amount = 1.", await checkout(token, { total_amount: 1, shipping_address: "FR08 manipulated total" }), true);
  add(results, "FR08-DT-09-negative", "Backend rejects total_amount = -1.", await checkout(token, { total_amount: -1, shipping_address: "FR08 negative total" }), true);
  add(results, "FR08-DT-09-zero", "Backend rejects total_amount = 0.", await checkout(token, { total_amount: 0, shipping_address: "FR08 zero total" }), true);
  add(results, "FR08-DT-10", "Missing shipping address behavior is documented and reviewed.", await checkout(token, { total_amount: 500000 }), true);

  add(results, "FR08-DT-11", "Valid coupon VIP100/SAVE10 applies discount above minimum.", await coupon({ code: "VIP100", total_amount: 70000000, user_id: userId }), true);
  add(results, "FR08-DT-12", "Expired coupon EXPIRED is rejected.", await coupon({ code: "EXPIRED", total_amount: 200000, user_id: userId }), false);
  add(results, "FR08-BVA-09", "SAVE10 below minimum at 299999 is rejected.", await coupon({ code: "SAVE10", total_amount: 299999, user_id: userId }), false);
  add(results, "FR08-BVA-10", "SAVE10 exactly at minimum 300000 is reviewed against SRS.", await coupon({ code: "SAVE10", total_amount: 300000, user_id: userId }), true);
  add(results, "FR08-BVA-11", "SAVE10 above minimum at 300001 is accepted.", await coupon({ code: "SAVE10", total_amount: 300001, user_id: userId }), true);

  const applyVip = await coupon({ code: "VIP100", total_amount: 70000000, user_id: userId });
  let usage = { status: 0, data: null };
  if (applyVip.data && applyVip.data.coupon_id) {
    usage = await apiRequest("POST", "/coupon-usage", { coupon_id: applyVip.data.coupon_id }, token);
  }
  add(results, "FR08-BVA-12", "Coupon usage can be recorded after successful checkout if coupon_id is available.", usage, true, {
    couponApplyResponse: applyVip,
  });

  const evidenceFile = writeJsonResult(FILE, {
    generatedAt: new Date().toISOString(),
    feature: FEATURE,
    seededCoupons: ["SAVE10", "BIGBUY", "VIP100", "EXPIRED"],
    warning: "Verdict suggestions are not final report verdicts. Review manually before updating report tables.",
    results,
  });
  results.forEach((r) => (r.evidenceFile = evidenceFile));
  writeJsonResult(FILE, { generatedAt: new Date().toISOString(), feature: FEATURE, results });
  printSummary(FEATURE, results);
}

main().catch((error) => {
  console.error("FR08 API run error:", error.message);
});
