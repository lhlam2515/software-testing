const {
  apiRequest,
  appendResult,
  login,
  printSummary,
  writeJsonResult,
} = require("./helpers");

const FEATURE = "FR-04 Profile";
const FILE = "fr04_profile_api_results.json";

async function currentProfile(token) {
  return apiRequest("GET", "/users/me", null, token);
}

async function runCase(results, testCaseId, expected, body, token, review = true) {
  const before = token ? await currentProfile(token) : null;
  const response = await apiRequest("PUT", "/users/me", body, token);
  const after = token ? await currentProfile(token) : null;
  appendResult(results, {
    testCaseId,
    feature: FEATURE,
    expected,
    actual: `PUT status ${response.status}; body ${JSON.stringify(response.data)}; profile after ${JSON.stringify(after && after.data)}`,
    statusCode: response.status,
    verdictSuggestion: review ? "Needs Review" : response.status === 401 ? "Pass" : "Fail",
    humanReviewRequired: review,
    requestBody: body,
    profileBefore: before && before.data,
    profileAfter: after && after.data,
  });
}

async function main() {
  const results = [];
  let token;
  try {
    const auth = await login(process.env.USER_EMAIL || "test@eshop.com", process.env.USER_PASSWORD || "Test1234!");
    token = auth.token;
  } catch (error) {
    appendResult(results, {
      testCaseId: "FR04-SETUP",
      feature: FEATURE,
      expected: "Seeded user can log in.",
      actual: error.message,
      statusCode: 0,
      verdictSuggestion: "Error",
      humanReviewRequired: true,
    });
  }

  if (token) {
    await runCase(results, "FR04-DT-07", "Email remains unchanged when email is included in profile update body.", {
      name: "FR04 Email Attempt",
      phone: "9123456789",
      shipping_address: "FR04 email attempt",
      email: "attacker@eshop.com",
    }, token);

    await runCase(results, "FR04-DT-08", "Role must not change for a regular user.", {
      name: "FR04 Role Attempt",
      phone: "9123456789",
      shipping_address: "FR04 role attempt",
      role: "admin",
    }, token);

    await runCase(results, "FR04-DT-09", "Only the authenticated user from the token is updated; payload id is ignored.", {
      id: 1,
      name: "FR04 Other User Attempt",
      phone: "9123456789",
      shipping_address: "FR04 id attempt",
    }, token);

    await runCase(results, "FR04-DT-10", "Script-like address is stored/displayed safely and does not execute in UI.", {
      name: "FR04 Script Address",
      phone: "9123456789",
      shipping_address: "<script>alert(1)</script>",
    }, token);

    await runCase(results, "FR04-DT-12", "Very long address is handled stably or rejected with a clear limit.", {
      name: "FR04 Long Address",
      phone: "9123456789",
      shipping_address: "A".repeat(1000),
    }, token);

    const phoneCases = [
      ["FR04-BVA-phone-9-digits", "Phone with 9 digits", "012345678"],
      ["FR04-BVA-phone-10-digits", "Phone with 10 digits", "0123456789"],
      ["FR04-BVA-phone-11-digits", "Phone with 11 digits", "01234567890"],
      ["FR04-BVA-phone-12-digits", "Phone with 12 digits", "012345678901"],
      ["FR04-BVA-phone-not-starting-0", "Phone not starting with 0", "9123456789"],
    ];
    for (const [id, expected, phone] of phoneCases) {
      await runCase(results, id, `${expected}; backend behavior should be compared with SRS/UI validation.`, {
        name: `FR04 ${phone}`,
        phone,
        shipping_address: "FR04 phone boundary",
      }, token);
    }
  }

  const noToken = await apiRequest("PUT", "/users/me", {
    name: "No Token",
    phone: "0912345678",
    shipping_address: "No token address",
  });
  appendResult(results, {
    testCaseId: "FR04-DT-11",
    feature: FEATURE,
    expected: "Returns 401 Unauthorized and saves no data.",
    actual: `PUT status ${noToken.status}; body ${JSON.stringify(noToken.data)}`,
    statusCode: noToken.status,
    verdictSuggestion: noToken.status === 401 ? "Pass" : "Fail",
    humanReviewRequired: false,
  });

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
  console.error("FR04 API run error:", error.message);
});
