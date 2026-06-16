const { test } = require("@playwright/test");
const axios = require("axios");
const { API_BASE_URL, loginAdmin, saveScreenshot, writeUiResult } = require("./ui_helpers");

async function apiLogin(email, password) {
  const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
  return res.data.token;
}

async function createXssOrder() {
  const token = await apiLogin(process.env.USER_EMAIL || "test@eshop.com", process.env.USER_PASSWORD || "Test1234!");
  const res = await axios.post(`${API_BASE_URL}/checkout`, {
    total_amount: 100000,
    shipping_address: "<img src=x onerror=alert('FR18-XSS')>",
  }, { headers: { Authorization: `Bearer ${token}` } });
  return res.data.orderId;
}

test("FR18-DT-01 admin views orders UI-assisted", async ({ page }) => {
  await loginAdmin(page);
  await page.getByText(/n h.*ng/i).click();
  await page.waitForTimeout(1000);
  const screenshot = await saveScreenshot(page, "FR18-DT-01-ui.png");
  writeUiResult("fr18_admin_order_ui_results.json", {
    testCaseId: "FR18-DT-01",
    feature: "FR-18 Admin Order Management",
    expected: "Admin Orders tab displays order rows or an empty state without crashing.",
    actual: "Admin Orders screenshot captured. Manual review required.",
    evidenceFile: screenshot,
  });
});

test("FR18-DT-12 admin order shipping-address XSS rendering", async ({ page }) => {
  const orderId = await createXssOrder();
  let dialogAppeared = false;
  page.on("dialog", async (dialog) => {
    dialogAppeared = true;
    await dialog.dismiss();
  });
  await loginAdmin(page);
  await page.getByText(/n h.*ng/i).click();
  await page.waitForTimeout(1500);
  const screenshot = await saveScreenshot(page, "FR18-DT-12-admin-xss.png");
  writeUiResult("fr18_admin_order_ui_results.json", {
    testCaseId: "FR18-DT-12",
    feature: "FR-18 Admin Order Management",
    expected: "Shipping address is escaped as text and no alert dialog appears.",
    actual: `Created orderId ${orderId}. Dialog appeared: ${dialogAppeared}. Screenshot captured for manual review.`,
    evidenceFile: screenshot,
    dialogAppeared,
    createdOrderId: orderId,
  });
});

test("FR18 optional admin status-change UI screenshot", async ({ page }) => {
  await loginAdmin(page);
  await page.getByText(/n h.*ng/i).click();
  await page.waitForTimeout(1000);
  const screenshot = await saveScreenshot(page, "FR18-status-change-ui.png");
  writeUiResult("fr18_admin_order_ui_results.json", {
    testCaseId: "FR18-UI-STATUS-OPTIONAL",
    feature: "FR-18 Admin Order Management",
    expected: "Status action buttons are visible when order state supports a transition.",
    actual: "Admin Orders status-control screenshot captured. Manual review required.",
    evidenceFile: screenshot,
  });
});
