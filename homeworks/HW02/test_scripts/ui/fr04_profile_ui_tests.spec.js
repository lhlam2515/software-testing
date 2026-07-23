const { test } = require("@playwright/test");
const { loginWeb, saveScreenshot, writeUiResult, WEB_BASE_URL } = require("./ui_helpers");

async function captureProfileCase(page, id, input, expected) {
  await loginWeb(page);
  await page.goto(`${WEB_BASE_URL}/profile`);
  await page.locator("input").nth(1).fill(input.name);
  await page.locator("input").nth(2).fill(input.phone);
  await page.locator("textarea").fill(input.shipping_address);
  page.once("dialog", async (dialog) => {
    await dialog.dismiss();
  });
  await page.getByRole("button", { name: /C.*p|Update/i }).click();
  await page.waitForTimeout(500);
  const screenshot = await saveScreenshot(page, `${id}-ui.png`);
  writeUiResult("fr04_profile_ui_results.json", {
    testCaseId: id,
    feature: "FR-04 Profile",
    expected,
    actual: "Screenshot captured after profile form submission. Manual visual review required.",
    evidenceFile: screenshot,
    inputData: input,
  });
}

test("FR04 UI-assisted profile validation screenshots", async ({ page }) => {
  const cases = [
    ["FR04-DT-01", { name: "Nguyen Van A", phone: "0912345678", shipping_address: "1 Le Loi" }, "SRS-valid 10-digit phone starting with 0 should be accepted."],
    ["FR04-DT-03", { name: "Phone 10", phone: "0912345678", shipping_address: "FR04 DT03" }, "10-digit phone starting with 0 should be accepted according to SRS."],
    ["FR04-DT-04", { name: "Phone 11", phone: "09123456789", shipping_address: "FR04 DT04" }, "11-digit phone starting with 0 should be accepted according to SRS."],
    ["FR04-DT-05", { name: "No Zero", phone: "9123456789", shipping_address: "FR04 DT05" }, "Phone not starting with 0 should be rejected according to SRS."],
    ["FR04-DT-06", { name: "Bad Phone", phone: "09A234567!", shipping_address: "FR04 DT06" }, "Phone with letters/special characters should be rejected."],
    ["FR04-DT-10", { name: "Script Address", phone: "9123456789", shipping_address: "<script>alert(1)</script>" }, "Script-like address should not execute."],
    ["FR04-BVA-01", { name: "BVA 9", phone: "012345678", shipping_address: "FR04 BVA01" }, "Below minimum phone length should be rejected."],
    ["FR04-BVA-02", { name: "BVA 10", phone: "0123456789", shipping_address: "FR04 BVA02" }, "At minimum phone length should be accepted by SRS."],
    ["FR04-BVA-03", { name: "BVA 11", phone: "01234567890", shipping_address: "FR04 BVA03" }, "At maximum phone length should be accepted by SRS."],
    ["FR04-BVA-04", { name: "BVA 12", phone: "012345678901", shipping_address: "FR04 BVA04" }, "Above maximum phone length should be rejected."],
    ["FR04-BVA-05", { name: "BVA first", phone: "1123456789", shipping_address: "FR04 BVA05" }, "First character not 0 should be rejected."],
    ["FR04-BVA-06", { name: "A", phone: "9123456789", shipping_address: "FR04 BVA06" }, "One-character name behavior should be clear."],
  ];
  for (const [id, input, expected] of cases) {
    await captureProfileCase(page, id, input, expected);
  }
});

test("FR04-DT-02 empty full name browser validation", async ({ page }) => {
  await loginWeb(page);
  await page.goto(`${WEB_BASE_URL}/profile`);
  await page.locator("input").nth(1).fill("");
  await page.locator("input").nth(2).fill("9123456789");
  await page.locator("textarea").fill("FR04 empty name");
  await page.getByRole("button", { name: /C.*p|Update/i }).click();
  const screenshot = await saveScreenshot(page, "FR04-DT-02-ui.png");
  writeUiResult("fr04_profile_ui_results.json", {
    testCaseId: "FR04-DT-02",
    feature: "FR-04 Profile",
    expected: "Browser/app blocks submission because name is required.",
    actual: "Screenshot captured after empty-name submission attempt. Manual visual review required.",
    evidenceFile: screenshot,
  });
});
