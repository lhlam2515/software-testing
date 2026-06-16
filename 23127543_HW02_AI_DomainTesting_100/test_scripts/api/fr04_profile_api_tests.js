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

const FEATURE = "FR-04 Profile";
const JSON_FILE = "fr04_profile_api_results.json";
const HTML_FILE = "fr04_profile_api_results.html";

async function getProfile(token) {
  return apiRequest({ method: "GET", path: "/api/users/me", token });
}

async function runProfileUpdate(results, testCaseId, technique, inputData, expectedResult, token, verdictRule) {
  try {
    const before = token ? await getProfile(token) : null;
    const update = await apiRequest({ method: "PUT", path: "/api/users/me", token, body: inputData });
    const after = token ? await getProfile(token) : null;
    const verdictSuggestion = verdictRule ? verdictRule(update, before, after) : "Needs Review";
    recordResult(results, {
      testCaseId,
      feature: FEATURE,
      technique,
      endpoint: update.endpoint,
      method: update.method,
      requestHeaders: update.requestHeaders,
      inputData,
      expectedResult,
      actualStatusCode: update.statusCode,
      actualResponseBody: {
        updateResponse: update.responseBody,
        followUpGetBefore: before && before.responseBody,
        followUpGetAfter: after && after.responseBody,
      },
      verdictSuggestion,
      notes: "Review the update response and follow-up GET /api/users/me before updating the report.",
    });
  } catch (error) {
    recordResult(results, {
      testCaseId,
      feature: FEATURE,
      technique,
      endpoint: "/api/users/me",
      method: "PUT",
      requestHeaders: token ? { Authorization: "Bearer ***masked***", "Content-Type": "application/json" } : { "Content-Type": "application/json" },
      inputData,
      expectedResult,
      actualStatusCode: 0,
      actualResponseBody: { error: error.message },
      verdictSuggestion: "Error",
      notes: "Script/environment error. Do not treat as product failure without rerun.",
    });
  }
}

async function main() {
  const env = loadEnv();
  const results = [];
  const auth = await login(env.USER_EMAIL, env.USER_PASSWORD);
  const token = auth.token;

  await runProfileUpdate(
    results,
    "FR04-DT-07",
    "Domain Testing",
    { name: "FR04 Email Attempt", phone: "9123456789", shipping_address: "FR04 email attempt", email: "attacker@eshop.com" },
    "Email remains unchanged when email is included in the profile update body.",
    token,
    (update, before, after) => suggestion(update.statusCode === 200 && before.responseBody.email === after.responseBody.email),
  );

  await runProfileUpdate(
    results,
    "FR04-DT-08",
    "Domain Testing",
    { name: "FR04 Role Attempt", phone: "9123456789", shipping_address: "FR04 role attempt", role: "admin" },
    "Regular user must not be able to change role to admin.",
    token,
    (update, before, after) => suggestion(update.statusCode !== 200 || before.responseBody.role === after.responseBody.role),
  );

  await runProfileUpdate(
    results,
    "FR04-DT-09",
    "Domain Testing",
    { id: 1, name: "FR04 Other User Attempt", phone: "9123456789", shipping_address: "FR04 id attempt" },
    "Payload id must not allow updating another user; /api/users/me should use the token owner.",
    token,
    () => "Needs Review",
  );

  await runProfileUpdate(
    results,
    "FR04-DT-10",
    "Domain Testing",
    { name: "FR04 Script Address", phone: "9123456789", shipping_address: "<script>alert(1)</script>" },
    "Script-like shipping address is stored/displayed safely and does not execute in UI.",
    token,
    () => "Needs Review",
  );

  const noTokenBody = { name: "FR04 No Token", phone: "0912345678", shipping_address: "No token address" };
  const noToken = await apiRequest({ method: "PUT", path: "/api/users/me", body: noTokenBody });
  recordResult(results, {
    testCaseId: "FR04-DT-11",
    feature: FEATURE,
    technique: "Domain Testing",
    endpoint: noToken.endpoint,
    method: noToken.method,
    requestHeaders: noToken.requestHeaders,
    inputData: noTokenBody,
    expectedResult: "Request without Authorization token returns 401 Unauthorized.",
    actualStatusCode: noToken.statusCode,
    actualResponseBody: noToken.responseBody,
    verdictSuggestion: suggestion(noToken.statusCode === 401),
    notes: "Review response body before copying final result.",
  });

  await runProfileUpdate(
    results,
    "FR04-DT-12",
    "Domain Testing",
    { name: "FR04 Long Address", phone: "9123456789", shipping_address: "A".repeat(1000) },
    "Very long address is handled stably or rejected with a clear limit.",
    token,
    () => "Needs Review",
  );

  const bvaCases = [
    ["FR04-BVA-01", "Phone below 10-digit minimum should be rejected.", "012345678"],
    ["FR04-BVA-02", "Phone at 10 digits should be accepted according to SRS.", "0123456789"],
    ["FR04-BVA-03", "Phone at 11 digits should be accepted according to SRS.", "01234567890"],
    ["FR04-BVA-04", "Phone above maximum should be rejected.", "012345678901"],
    ["FR04-BVA-05", "Phone not starting with 0 should be rejected according to SRS.", "9123456789"],
  ];
  for (const [testCaseId, expectedResult, phone] of bvaCases) {
    await runProfileUpdate(
      results,
      testCaseId,
      "Boundary Value Analysis",
      { name: testCaseId, phone, shipping_address: `${testCaseId} address` },
      expectedResult,
      token,
      () => "Needs Review",
    );
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
  console.error("FR04 API evidence script failed:", error.message);
});
