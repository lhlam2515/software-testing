const fs = require("fs");
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");

const ROOT_DIR = path.resolve(__dirname, "..");
const JSON_DIR = path.resolve(ROOT_DIR, "results/json");
const HTML_DIR = path.resolve(ROOT_DIR, "results/html");
const SCREENSHOT_DIR = path.resolve(ROOT_DIR, "results/screenshots");

function loadEnv() {
  dotenv.config({ path: path.resolve(ROOT_DIR, ".env") });
  return {
    API_BASE_URL: process.env.API_BASE_URL || "http://localhost:3000/api",
    WEB_BASE_URL: process.env.WEB_BASE_URL || "http://localhost:5173",
    ADMIN_BASE_URL: process.env.ADMIN_BASE_URL || "http://localhost:5174",
    USER_EMAIL: process.env.USER_EMAIL || "test@eshop.com",
    USER_PASSWORD: process.env.USER_PASSWORD || "Test1234!",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@eshop.com",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "Admin123!",
    TEST_USER_EMAIL: process.env.TEST_USER_EMAIL || "script_user@test.com",
    TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD || "Password123!",
  };
}

function ensureDirs() {
  fs.mkdirSync(JSON_DIR, { recursive: true });
  fs.mkdirSync(HTML_DIR, { recursive: true });
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

function maskToken(token) {
  if (!token) return token;
  const value = String(token);
  if (value.toLowerCase().startsWith("bearer ")) return "Bearer ***masked***";
  return "***masked***";
}

function maskDeep(value) {
  if (Array.isArray(value)) return value.map(maskDeep);
  if (value && typeof value === "object") {
    const clone = {};
    for (const [key, item] of Object.entries(value)) {
      if (key.toLowerCase() === "authorization") clone[key] = maskToken(item);
      else if (key.toLowerCase() === "token") clone[key] = "***masked***";
      else clone[key] = maskDeep(item);
    }
    return clone;
  }
  if (typeof value === "string" && value.startsWith("eyJ")) return "***masked***";
  return value;
}

function relativeFromRoot(filePath) {
  return path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");
}

function apiUrl(pathName) {
  const env = loadEnv();
  const cleanPath = pathName.startsWith("/") ? pathName : `/${pathName}`;
  return `${env.API_BASE_URL}${cleanPath.replace(/^\/api/, "")}`;
}

async function login(email, password) {
  const response = await apiRequest({
    method: "POST",
    path: "/api/login",
    body: { email, password },
  });
  return {
    token: response.responseBody && response.responseBody.token,
    user: response.responseBody && response.responseBody.user,
    response,
  };
}

async function apiRequest({ method, path: pathName, token, body, headers = {} }) {
  const requestHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };
  if (token) requestHeaders.Authorization = `Bearer ${token}`;

  try {
    const response = await axios({
      method,
      url: apiUrl(pathName),
      data: body,
      headers: requestHeaders,
      validateStatus: () => true,
    });
    return {
      endpoint: pathName,
      method: method.toUpperCase(),
      requestHeaders: maskDeep(requestHeaders),
      requestBody: maskDeep(body || {}),
      statusCode: response.status,
      responseBody: maskDeep(response.data),
      error: null,
    };
  } catch (error) {
    return {
      endpoint: pathName,
      method: method.toUpperCase(),
      requestHeaders: maskDeep(requestHeaders),
      requestBody: maskDeep(body || {}),
      statusCode: 0,
      responseBody: null,
      error: error.message || String(error),
    };
  }
}

function recordResult(results, result) {
  results.push({
    testCaseId: result.testCaseId,
    feature: result.feature,
    technique: result.technique,
    executionType: "API Automated",
    timestamp: new Date().toISOString(),
    endpoint: result.endpoint,
    method: result.method,
    requestHeaders: maskDeep(result.requestHeaders || {}),
    inputData: maskDeep(result.inputData || {}),
    expectedResult: result.expectedResult,
    actualStatusCode: result.actualStatusCode,
    actualResponseBody: maskDeep(result.actualResponseBody),
    verdictSuggestion: result.verdictSuggestion || "Needs Review",
    humanReviewRequired: true,
    evidenceJsonFile: result.evidenceJsonFile || "",
    evidenceHtmlFile: result.evidenceHtmlFile || "",
    notes: result.notes || "Manual review required before updating the feature report.",
  });
}

function writeJsonResult(filename, results) {
  ensureDirs();
  const target = path.resolve(JSON_DIR, filename);
  const rel = relativeFromRoot(target);
  for (const result of results) result.evidenceJsonFile = rel;
  fs.writeFileSync(target, JSON.stringify(results, null, 2), "utf8");
  return rel;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function writeHtmlSummary(filename, results) {
  ensureDirs();
  const target = path.resolve(HTML_DIR, filename);
  const rel = relativeFromRoot(target);
  for (const result of results) result.evidenceHtmlFile = rel;
  const rows = results.map((r) => `
    <tr>
      <td>${escapeHtml(r.testCaseId)}</td>
      <td>${escapeHtml(r.feature)}</td>
      <td>${escapeHtml(r.technique)}</td>
      <td>${escapeHtml(r.method)} ${escapeHtml(r.endpoint)}</td>
      <td>${escapeHtml(r.actualStatusCode)}</td>
      <td>${escapeHtml(r.verdictSuggestion)}</td>
      <td>${escapeHtml(r.humanReviewRequired)}</td>
      <td><pre>${escapeHtml(JSON.stringify(r.actualResponseBody, null, 2))}</pre></td>
      <td>${escapeHtml(r.notes)}</td>
    </tr>`).join("\n");
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>HW02 API Evidence</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 8px; vertical-align: top; }
    th { background: #f3f3f3; }
    pre { white-space: pre-wrap; max-width: 520px; }
  </style>
</head>
<body>
  <h1>HW02 API Evidence</h1>
  <p>Generated evidence is not a final report verdict. Manual review is required.</p>
  <table>
    <thead>
      <tr>
        <th>TC ID</th><th>Feature</th><th>Technique</th><th>Request</th>
        <th>Status</th><th>Verdict Suggestion</th><th>Human Review</th><th>Response</th><th>Notes</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
  fs.writeFileSync(target, html, "utf8");
  return rel;
}

function printSummary(featureName, results) {
  console.log(`\n${featureName} evidence summary`);
  console.log("TC ID                 Status  Suggestion");
  console.log("------------------------------------------");
  for (const result of results) {
    console.log(`${result.testCaseId.padEnd(20)} ${String(result.actualStatusCode).padEnd(7)} ${result.verdictSuggestion}`);
  }
}

function suggestion(condition, passText = "Pass", failText = "Fail") {
  return condition ? passText : failText;
}

module.exports = {
  apiRequest,
  ensureDirs,
  loadEnv,
  login,
  maskToken,
  printSummary,
  recordResult,
  suggestion,
  writeHtmlSummary,
  writeJsonResult,
};
