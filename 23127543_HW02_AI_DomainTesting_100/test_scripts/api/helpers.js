const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";
const RESULTS_DIR = path.resolve(__dirname, "../results/json");

function ensureDirs() {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  fs.mkdirSync(path.resolve(__dirname, "../results/screenshots"), { recursive: true });
  fs.mkdirSync(path.resolve(__dirname, "../results/html"), { recursive: true });
}

function maskToken(value) {
  if (!value) return value;
  return String(value).replace(/Bearer\s+([A-Za-z0-9._-]+)/g, "Bearer ***JWT***").replace(/eyJ[A-Za-z0-9._-]+/g, "***JWT***");
}

function safeStringify(data) {
  return maskToken(JSON.stringify(data, null, 2));
}

function safeLog(message, data) {
  if (data === undefined) console.log(maskToken(message));
  else console.log(maskToken(message), safeStringify(data));
}

async function login(email, password) {
  const response = await apiRequest("POST", "/login", { email, password });
  return {
    token: response.data && response.data.token,
    user: response.data && response.data.user,
    response,
  };
}

async function apiRequest(method, pathName, body, token) {
  const url = `${API_BASE_URL}${pathName.startsWith("/") ? pathName : `/${pathName}`}`;
  try {
    const response = await axios({
      method,
      url,
      data: body,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      validateStatus: () => true,
    });
    return { status: response.status, data: response.data, error: null };
  } catch (error) {
    return {
      status: 0,
      data: null,
      error: error.message || String(error),
    };
  }
}

function writeJsonResult(filename, data) {
  ensureDirs();
  const target = path.resolve(RESULTS_DIR, filename);
  fs.writeFileSync(target, JSON.stringify(data, null, 2), "utf8");
  return path.relative(path.resolve(__dirname, ".."), target).replace(/\\/g, "/");
}

function appendResult(resultsArray, result) {
  resultsArray.push({
    executionType: "API Automated",
    humanReviewRequired: true,
    evidenceFile: "",
    notes: "Review before copying into report.",
    ...result,
  });
}

function verdictFromStatus(actualOk, review = false) {
  if (review) return "Needs Review";
  return actualOk ? "Pass" : "Fail";
}

function printSummary(feature, results) {
  console.log(`\n${feature} API evidence summary`);
  console.log("TC ID                 Status  Suggestion");
  console.log("------------------------------------------");
  for (const r of results) {
    console.log(`${r.testCaseId.padEnd(20)} ${String(r.statusCode).padEnd(7)} ${r.verdictSuggestion}`);
  }
}

module.exports = {
  API_BASE_URL,
  apiRequest,
  appendResult,
  ensureDirs,
  login,
  printSummary,
  safeLog,
  verdictFromStatus,
  writeJsonResult,
};
