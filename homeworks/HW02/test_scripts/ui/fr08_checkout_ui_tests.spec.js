const { test } = require("@playwright/test");
const { addFirstProductToCart, loginWeb, saveScreenshot, writeUiResult, WEB_BASE_URL } = require("./ui_helpers");

async function capture(id, page, expected, actual) {
  const screenshot = await saveScreenshot(page, `${id}-ui.png`);
  writeUiResult("fr08_checkout_ui_results.json", {
    testCaseId: id,
    feature: "FR-08 Checkout",
    expected,
    actual,
    evidenceFile: screenshot,
  });
}

async function loggedInCart(page, count = 1) {
  await loginWeb(page);
  for (let i = 0; i < count; i += 1) {
    await addFirstProductToCart(page);
  }
  await page.goto(`${WEB_BASE_URL}/cart`);
  await page.waitForTimeout(500);
}

test("FR08 UI-assisted checkout/cart screenshots", async ({ page }) => {
  await loggedInCart(page, 1);
  await capture("FR08-DT-01", page, "Logged-in user with valid cart can start checkout.", "Cart screenshot captured before checkout.");
  await capture("FR08-DT-05", page, "One cart item displays correctly.", "One-item cart screenshot captured.");
  await capture("FR08-BVA-02", page, "One-item boundary is displayed and can proceed.", "One-item boundary screenshot captured.");
  await capture("FR08-BVA-05", page, "Quantity 1 subtotal is correct.", "Quantity 1 cart screenshot captured.");

  await page.getByRole("button", { name: /thanh/i }).click();
  await page.waitForTimeout(500);
  await capture("FR08-BVA-13-ui-before-checkout", page, "Checkout page shows item before confirmation.", "Checkout page screenshot captured.");
  page.once("dialog", async (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: /X.*c|Confirm/i }).click();
  await page.waitForTimeout(800);
  await capture("FR08-DT-07", page, "Cart should be cleared after successful checkout.", "Checkout success screenshot captured; final cart requires manual review.");
  await page.goto(`${WEB_BASE_URL}/cart`);
  await page.waitForTimeout(500);
  await capture("FR08-BVA-13-ui-after-checkout-cart", page, "Cart should be empty after successful checkout.", "Cart after checkout screenshot captured.");
});

test("FR08-DT-02 checkout without login", async ({ page }) => {
  await addFirstProductToCart(page);
  await page.goto(`${WEB_BASE_URL}/cart`);
  page.once("dialog", async (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: /thanh/i }).click();
  await page.waitForTimeout(500);
  await capture("FR08-DT-02", page, "UI blocks checkout and requires login.", "Screenshot captured after checkout attempt without login.");
});

test("FR08 multiple/empty cart UI-assisted screenshots", async ({ page }) => {
  await loginWeb(page);
  await page.goto(`${WEB_BASE_URL}/cart`);
  await capture("FR08-BVA-01", page, "Empty cart blocks checkout.", "Empty cart screenshot captured.");

  await loggedInCart(page, 2);
  await capture("FR08-DT-04", page, "Multiple cart items display before checkout.", "Multiple-item cart screenshot captured.");
  await capture("FR08-DT-06", page, "Multiple cart rows and total are reviewable.", "Multiple-item total screenshot captured.");
  await capture("FR08-BVA-03", page, "Two-item boundary is displayed.", "Two-item boundary screenshot captured.");
  await capture("FR08-BVA-06", page, "Quantity 2/multiple entries are reviewable.", "Multiple entry screenshot captured.");
});

test("FR08-BVA-04 quantity zero from product detail", async ({ page }) => {
  await loginWeb(page);
  await page.goto(`${WEB_BASE_URL}/product/1`);
  await page.locator('input[type="number"]').fill("0");
  page.once("dialog", async (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: /Th.*m|Add/i }).click();
  await page.waitForTimeout(500);
  await capture("FR08-BVA-04", page, "Quantity 0 should be rejected or blocked.", "Product detail screenshot captured after quantity 0 add attempt.");
});
