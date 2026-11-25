import { expect, test } from "@playwright/test";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

test.use({ video: "on", reducedMotion: "no-preference", viewport: { width: 1440, height: 1000 } });

test("record SourceDesk search, hero paths and RFQ interaction", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(500);
  await page.getByRole("tab", { name: /BOM 齐套/ }).click();
  await page.waitForTimeout(350);
  await page.getByRole("tab", { name: /工程方案/ }).click();
  await page.waitForTimeout(350);
  await page.getByRole("tab", { name: /供应链质量/ }).click();
  await page.waitForTimeout(350);
  await page.getByRole("tab", { name: /短缺料寻源/ }).click();
  await page.locator("#global-part-search").pressSequentially("FPGA", { delay: 80 });
  await expect(page.locator("#global-search-results")).toContainText("处理器与可编程逻辑");
  const category = page.locator(".sd-search__result").filter({ hasText: "处理器与可编程逻辑" });
  await category.getByRole("button", { name: "带入 RFQ" }).click();
  await page.locator("#rfq-partNumber").fill("TEST-MCU-001");
  await page.locator("#rfq-quantity").fill("500");
  await page.getByRole("button", { name: "继续", exact: true }).click();
  await page.locator("#rfq-targetDate").fill("2027-12-31");
  await page.locator("#rfq-deliveryRegion").fill("广东省深圳市");
  await page.getByRole("button", { name: "生成需求单" }).click();
  await expect(page.locator(".rfq-result")).toContainText("尚未发送");
  const video = page.video();
  await page.close();
  if (video) {
    const output = path.resolve("test-results/visual");
    await mkdir(output, { recursive: true });
    await copyFile(await video.path(), path.join(output, "sourcedesk-interaction.webm"));
  }
});
