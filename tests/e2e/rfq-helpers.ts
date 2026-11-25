import type { Page } from "@playwright/test";

export async function shortageToStepTwo(page: Page) {
  await page.locator("#rfq-partNumber").fill("TEST-MCU-001");
  await page.locator("#rfq-manufacturer").fill("Test Manufacturer");
  await page.locator("#rfq-quantity").fill("500");
  await page.getByRole("button", { name: "继续", exact: true }).click();
}

export async function shortageToReview(page: Page) {
  await shortageToStepTwo(page);
  await page.locator("#rfq-targetDate").fill("2027-12-31");
}
