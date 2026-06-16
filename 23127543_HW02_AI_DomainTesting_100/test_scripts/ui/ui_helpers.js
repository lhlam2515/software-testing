const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const ROOT_DIR = path.resolve(__dirname, "..");
const WEB_BASE_URL = process.env.WEB_BASE_URL || "http://localhost:5173";
const ADMIN_BASE_URL = process.env.ADMIN_BASE_URL || "http://localhost:5174";
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";
const SCREENSHOT_DIR = path.resolve(ROOT_DIR, "results/screenshots");
const JSON_DIR = path.resolve(ROOT_DIR, "results/json");

function ensureDirs() {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  fs.mkdirSync(JSON_DIR, { recursive: true });
}

function relativeFromRoot(filePath) {
  return path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");
}

function uniqueFilePath(filename) {
  ensureDirs();
  const parsed = path.parse(filename);
  let candidate = path.join(SCREENSHOT_DIR, filename);
  if (!fs.existsSync(candidate)) return candidate;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return path.join(SCREENSHOT_DIR, `${parsed.name}-${stamp}${parsed.ext}`);
}

async function saveScreenshot(page, filename) {
  const target = uniqueFilePath(filename);
  await page.screenshot({ path: target, fullPage: true });
  return relativeFromRoot(target);
}

function writeUiResult(filename, entry) {
  ensureDirs();
  const target = path.join(JSON_DIR, filename);
  let existing = [];
  if (fs.existsSync(target)) {
    try {
      existing = JSON.parse(fs.readFileSync(target, "utf8"));
      if (!Array.isArray(existing)) existing = existing.results || [];
    } catch (_) {
      existing = [];
    }
  }
  existing.push({
    testCaseId: entry.testCaseId,
    feature: entry.feature,
    technique: entry.technique || "Domain Testing",
    executionType: "Manual / UI-assisted",
    timestamp: new Date().toISOString(),
    pageUrl: entry.pageUrl || "",
    inputData: entry.inputData || {},
    expectedResult: entry.expectedResult || entry.expected || "",
    actualObservation: entry.actualObservation || entry.actual || "Screenshot captured. Manual visual review required.",
    screenshotFile: entry.screenshotFile || entry.evidenceFile || "",
    verdictSuggestion: "Needs Review",
    humanReviewRequired: true,
    notes: entry.notes || "Manual Review Required. Inspect screenshot before updating Actual Result, Verdict, and Evidence.",
  });
  fs.writeFileSync(target, JSON.stringify(existing, null, 2), "utf8");
  return relativeFromRoot(target);
}

async function loginWeb(page, email = process.env.USER_EMAIL || "test@eshop.com", password = process.env.USER_PASSWORD || "Test1234!") {
  await page.goto(`${WEB_BASE_URL}/login`);
  await page.locator('input[type="text"]').first().fill(email);
  await page.locator('input[type="text"]').nth(1).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForTimeout(800);
}

async function loginAdmin(page, email = process.env.ADMIN_EMAIL || "admin@eshop.com", password = process.env.ADMIN_PASSWORD || "Admin123!") {
  await page.goto(ADMIN_BASE_URL);
  await page.locator('input[placeholder="Email"]').fill(email);
  await page.locator('input[placeholder="Password"]').fill(password);
  await page.getByRole("button", { name: /login/i }).click();
  await page.waitForTimeout(1200);
}

async function addFirstProductToCart(page) {
  await page.goto(WEB_BASE_URL);
  await page.waitForSelector("button", { timeout: 10000 });
  await page.getByRole("button", { name: /Th.*m|Add/i }).first().click();
  await page.waitForTimeout(300);
}

module.exports = {
  ADMIN_BASE_URL,
  API_BASE_URL,
  WEB_BASE_URL,
  addFirstProductToCart,
  loginAdmin,
  loginWeb,
  saveScreenshot,
  writeUiResult,
};
