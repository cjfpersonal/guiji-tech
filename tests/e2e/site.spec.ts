import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const routes = ["/", "/line-card/", "/capabilities/", "/quality/", "/solutions/", "/about/", "/privacy/", "/terms/"];
const visualOutput = path.resolve("test-results/visual");
const businessEmail = "chenfeng@jyera.com";
const businessPhone = "+86 134 2388 2268";
const businessAddress = "广东省深圳市南山区粤海街道高新工业村 T3 栋 A 座 403";

test.beforeEach(async () => { await mkdir(visualOutput, { recursive: true }); });

async function continueShortage(page: Page) {
  await page.locator("#rfq-partNumber").fill("TEST-MCU-001");
  await page.locator("#rfq-manufacturer").fill("Test Manufacturer");
  await page.locator("#rfq-quantity").fill("500");
  await page.getByRole("button", { name: "继续", exact: true }).click();
}

async function checkAxe(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const blocking = results.violations.filter((item) => item.impact === "serious" || item.impact === "critical");
  expect(blocking, `${label}: ${blocking.map((item) => `${item.id}(${item.impact})`).join(", ")}`).toEqual([]);
}

test("all public deep links, metadata, resources and custom 404 work from static out", async ({ page, request }) => {
  test.setTimeout(90_000);
  for (const route of routes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/html");
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `http://127.0.0.1:4173${route}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /.+/);
  }
  for (const resource of ["/sitemap.xml", "/robots.txt", "/manifest.webmanifest", "/opengraph-image.png", "/images/chip-hero-ice.webp", "/resources/bom-template.csv", "/resources/quality-checklist.txt", "/resources/selection-checklist.txt"]) {
    const response = await request.get(resource);
    expect(response.status(), resource).toBe(200);
  }
  expect((await request.get("/not-a-real-page")).status()).toBe(404);
  await page.goto("/not-a-real-page");
  await expect(page.getByRole("heading", { name: "这条路径不存在。" })).toBeVisible();
});

test("visible contact configuration matches Organization JSON-LD", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#contact")).toContainText(businessEmail);
  await expect(page.locator("#contact")).toContainText(businessPhone);
  await expect(page.locator("#contact")).toContainText(businessAddress);
  await expect(page.locator('#contact a[href="mailto:chenfeng@jyera.com"]')).toHaveCount(1);
  await expect(page.locator('#contact a[href="tel:+8613423882268"]')).toHaveCount(1);
  const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  const organization = data["@graph"].find((entry: { "@type": string }) => entry["@type"] === "Organization");
  expect(organization).toMatchObject({ email: businessEmail, telephone: businessPhone, address: { "@type": "PostalAddress", addressCountry: "CN", addressRegion: "广东省", addressLocality: "深圳市", streetAddress: "南山区粤海街道高新工业村 T3 栋 A 座 403" } });
});

test("no-JS HTML retains customer content and direct contact", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  expect((await page.goto("http://127.0.0.1:4173/"))?.status()).toBe(200);
  await expect(page.locator("h1")).toContainText("让关键器件需求");
  await expect(page.locator("#products")).toContainText("处理器与可编程逻辑");
  await expect(page.locator("#quality-matrix")).toContainText("来源流转");
  await expect(page.locator("#contact")).toContainText(businessEmail);
  await expect(page.locator(".no-script")).toBeVisible();
  await context.close();
});

test("global search suggests real categories and manufacturers and carries intent to RFQ", async ({ page }) => {
  await page.goto("/");
  const input = page.locator("#global-part-search");
  await input.fill("FPGA");
  await expect(page.locator("#global-search-results")).toContainText("处理器与可编程逻辑");
  await expect(page.locator("#global-search-results")).toContainText("非实时库存查询");
  await input.press("ArrowDown");
  await expect(page.locator("[data-search-item]").first()).toBeFocused();
  const category = page.locator(".sd-search__result").filter({ hasText: "处理器与可编程逻辑" });
  await page.screenshot({ path: path.join(visualOutput, "search-desktop.png") });
  await category.getByRole("button", { name: "带入 RFQ" }).click();
  await expect(page.locator("#rfq-partNumber")).toHaveValue("");
  await expect(page.locator("#rfq-manufacturer")).toHaveValue("");
  await expect(page.locator(".rfq-intent-notice")).toContainText("清除冲突的旧料号与品牌");
  await expect(page.locator("#rfq-step-title")).toHaveText("整理需求");
  await input.fill("Texas");
  const brand = page.locator(".sd-search__result").filter({ hasText: "Texas Instruments" });
  await brand.getByRole("button", { name: "带入 RFQ" }).click();
  await expect(page.locator("#rfq-manufacturer")).toHaveValue("Texas Instruments");
});

test("global search empty state carries the unmatched term without claiming inventory", async ({ page }) => {
  await page.goto("/");
  await page.locator("#global-part-search").fill("NO-SUCH-999");
  await expect(page.locator(".sd-search__empty")).toContainText("本地索引未匹配");
  await expect(page.locator(".sd-search__empty")).toContainText("不代表无法寻源");
  await page.locator(".sd-search__all").click();
  await expect(page.locator("#rfq-partNumber")).toHaveValue("NO-SUCH-999");
});

test("continuous part, manufacturer, category and specific-part intents never mix conflicting identities", async ({ page }) => {
  await page.goto("/");
  const search = page.locator("#global-part-search");
  await search.fill("STM32F103C8T6");
  await page.locator(".sd-search__all").click();
  await expect(page.locator("#rfq-partNumber")).toHaveValue("STM32F103C8T6");
  await page.locator("#rfq-quantity").fill("500");
  await page.getByRole("button", { name: "继续", exact: true }).click();
  await page.locator("#rfq-targetDate").fill("2028-01-31");
  await page.locator("#rfq-deliveryRegion").fill("广东省深圳市");
  await page.getByRole("button", { name: "上一步" }).click();

  await search.fill("Texas");
  await page.locator(".sd-search__result").filter({ hasText: "Texas Instruments" }).getByRole("button", { name: "带入 RFQ" }).click();
  await expect(page.locator("#rfq-partNumber")).toHaveValue("");
  await expect(page.locator("#rfq-manufacturer")).toHaveValue("Texas Instruments");
  await expect(page.locator("#rfq-quantity")).toHaveValue("500");
  await expect(page.locator(".rfq-intent-notice")).toContainText("清除旧完整料号");
  await page.screenshot({ path: path.join(visualOutput, "rfq-continuous-manufacturer.png") });

  await search.fill("FPGA");
  await page.locator(".sd-search__result").filter({ hasText: "处理器与可编程逻辑" }).getByRole("button", { name: "带入 RFQ" }).click();
  await expect(page.locator("#rfq-partNumber")).toHaveValue("");
  await expect(page.locator("#rfq-manufacturer")).toHaveValue("");
  await expect(page.locator(".rfq-intent-notice")).toContainText("清除冲突的旧料号与品牌");

  await search.fill("STM32F407VET6");
  await page.locator(".sd-search__all").click();
  await expect(page.locator("#rfq-partNumber")).toHaveValue("STM32F407VET6");
  await expect(page.locator("#rfq-manufacturer")).toHaveValue("");
  await expect(page.locator("#rfq-quantity")).toHaveValue("500");
  await page.getByRole("button", { name: "继续", exact: true }).click();
  await expect(page.locator("#rfq-targetDate")).toHaveValue("2028-01-31");
  await expect(page.locator("#rfq-deliveryRegion")).toHaveValue("广东省深圳市");
  await page.getByRole("button", { name: "生成需求单" }).click();
  const text = await page.locator(".rfq-preview pre").textContent();
  expect(text).toContain("STM32F407VET6");
  expect(text).toContain("品牌：未填写");
  expect(text).toContain("需求数量：500");
  expect(text).toContain("交付地区：广东省深圳市");
  expect(text).not.toContain("STM32F103C8T6");
  expect(text).not.toContain("Texas Instruments");
  await page.screenshot({ path: path.join(visualOutput, "rfq-continuous-final.png") });
});

test("four manual hero paths support click and keyboard without autoplay", async ({ page }) => {
  await page.goto("/");
  const bom = page.getByRole("tab", { name: /BOM 齐套/ });
  await bom.click();
  await expect(page.locator("h1")).toContainText("把整份 BOM");
  await expect(bom).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".sd-hero__media img")).toHaveAttribute("src", /supply-chain-studio/);
  await page.waitForTimeout(600);
  await expect(bom).toHaveAttribute("aria-selected", "true");
  await bom.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /工程方案/ })).toBeFocused();
  await expect(page.locator("h1")).toContainText("让供应约束");
  await page.getByRole("tab", { name: /供应链质量/ }).click();
  await expect(page.locator("h1")).toContainText("让每一次供应判断");
  await page.getByRole("tab", { name: /短缺料寻源/ }).click();
  await expect(page.locator("#quick-partNumber")).toBeVisible();
});

test("quick SourceDesk entry, full mail body, copy and download remain truthful", async ({ page }) => {
  await mkdir(visualOutput, { recursive: true });
  await page.goto("/");
  await page.locator("#quick-partNumber").fill("TEST-MCU-001");
  await page.locator("#quick-quantity").fill("500");
  await page.locator("#quick-targetDate").fill("2027-12-31");
  await page.locator("#quick-deliveryRegion").fill("广东省深圳市");
  await page.getByRole("button", { name: "整理短缺料需求" }).click();
  await expect(page.locator("#rfq-partNumber")).toHaveValue("TEST-MCU-001");
  await page.screenshot({ path: path.join(visualOutput, "rfq-step-1-desktop.png") });
  await page.getByRole("button", { name: "继续", exact: true }).click();
  await expect(page.locator("#rfq-deliveryRegion")).toHaveValue("广东省深圳市");
  await expect(page.locator("#rfq-name, #rfq-company, #rfq-email, #rfq-phone, #rfq input[type=email], #rfq input[type=tel]")).toHaveCount(0);
  await page.screenshot({ path: path.join(visualOutput, "rfq-step-2-desktop.png") });
  await page.getByRole("button", { name: "生成需求单" }).click();
  const mailto = new URL((await page.getByRole("link", { name: "打开邮件客户端", exact: true }).getAttribute("href"))!);
  const fullText = await page.locator(".rfq-preview pre").textContent();
  expect(mailto.pathname).toBe(businessEmail);
  expect(mailto.searchParams.get("body")).toBe(fullText);
  expect(fullText).toContain("交付地区：广东省深圳市");
  await page.getByRole("button", { name: "复制需求单" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(fullText);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载 .txt" }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  if (downloadPath) expect(await readFile(downloadPath, "utf8")).toBe(fullText);
});

test("BOM path parses real rows and includes complete content in mail", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: /BOM 齐套/ }).click();
  await page.getByRole("button", { name: "整理 BOM 需求" }).click();
  await expect(page.locator("#rfq-requestType")).toHaveValue("BOM 供应与成本评估");
  await page.locator("#rfq-bomText").fill("BOM-A | Brand | 100 | 2027-12-31\nBOM-B,Other Brand,50,");
  await page.getByRole("button", { name: "继续", exact: true }).click();
  await expect(page.locator(".review-card")).toContainText("2 行条目");
  await page.getByRole("button", { name: "生成需求单" }).click();
  const mailto = new URL((await page.getByRole("link", { name: "打开邮件客户端", exact: true }).getAttribute("href"))!);
  expect(mailto.searchParams.get("body")).toContain("BOM-A");
  expect(mailto.searchParams.get("body")).toContain("BOM-B");
});

test("engineering path records parameters without inventing replacement parts", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: /工程方案/ }).click();
  await page.locator(".sd-hero").getByRole("button", { name: "整理工程选型需求" }).click();
  await page.locator("#rfq-application").fill("工业机器人控制器");
  await page.locator("#rfq-projectStage").selectOption({ label: "原型开发" });
  await page.locator("#rfq-objective").fill("明确控制架构、关键接口与供应约束。");
  await page.getByRole("button", { name: "继续", exact: true }).click();
  await page.locator("#rfq-packageRequirement").fill("QFP / BGA，尺寸待核对");
  await page.locator("#rfq-temperatureRange").fill("-40°C 至 85°C");
  await page.locator("#rfq-interfaces").fill("CAN、Ethernet");
  await page.locator("#rfq-lifecycle").fill("计划量产五年");
  await page.locator("#rfq-substitutionBoundary").fill("不得改变现有接口；替代项需工程验证");
  await page.getByRole("button", { name: "生成需求单" }).click();
  await expect(page.locator(".rfq-preview pre")).toContainText("CAN、Ethernet");
  await expect(page.locator(".rfq-preview pre")).toContainText("不得改变现有接口");
  await expect(page.locator(".rfq-preview pre")).toContainText("不代表已经发送");
});

test("desktop dropdown is keyboard operable and mobile drawer keeps search accessible", async ({ page }) => {
  await page.goto("/");
  const trigger = page.locator(".sd-nav").getByRole("button", { name: /供应链服务/ });
  await trigger.focus();
  await trigger.press("ArrowDown");
  await expect(page.locator(".sd-dropdown__panel")).toBeVisible();
  await expect(page.locator(".sd-dropdown__panel a").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(page.locator(".sd-dropdown__panel")).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.getByRole("button", { name: "打开导航菜单" });
  await toggle.click();
  await expect(page.getByRole("dialog", { name: "网站导航" })).toBeVisible();
  await expect(page.locator("#global-part-search")).toBeVisible();
  await expect(page.locator("main")).toHaveAttribute("inert", "");
  await page.screenshot({ path: path.join(visualOutput, "mobile-menu.png") });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "打开导航菜单" })).toBeFocused();
});

test("desktop navigation labels and SVG chevrons stay centered at equal trigger heights", async ({ page }) => {
  for (const width of [1440, 1280, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const metrics = await page.locator(".sd-dropdown > button").evaluateAll((buttons) => buttons.slice(0, 4).map((button) => {
      const label = button.querySelector(".sd-nav-trigger__label")!;
      const icon = button.querySelector(".sd-nav-trigger__icon")!;
      const buttonRect = button.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();
      return {
        text: label.textContent,
        height: buttonRect.height,
        buttonCenter: buttonRect.y + buttonRect.height / 2,
        labelCenter: labelRect.y + labelRect.height / 2,
        iconCenter: iconRect.y + iconRect.height / 2,
        iconWidth: iconRect.width,
        iconHeight: iconRect.height,
        display: getComputedStyle(button).display,
        alignItems: getComputedStyle(button).alignItems,
      };
    }));
    expect(metrics).toHaveLength(4);
    expect(new Set(metrics.map((item) => item.height))).toEqual(new Set([43]));
    for (const item of metrics) {
      expect(Math.abs(item.labelCenter - item.iconCenter), `${width}px ${item.text}`).toBeLessThanOrEqual(1.5);
      expect(Math.abs(item.buttonCenter - item.labelCenter), `${width}px ${item.text}`).toBeLessThanOrEqual(1.5);
      expect(item.iconWidth).toBe(10);
      expect(item.iconHeight).toBe(12);
      expect(["inline-flex", "flex"]).toContain(item.display);
      expect(item.alignItems).toBe("center");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.locator(".sd-nav").screenshot({ path: path.join(visualOutput, "navigation-desktop-fixed.png") });
  const trigger = page.locator(".sd-dropdown > button").first();
  await trigger.focus();
  await trigger.press("ArrowDown");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(trigger).toHaveJSProperty("offsetHeight", 43);
  await expect(page.locator(".sd-dropdown__panel a").first()).toBeFocused();
  await page.screenshot({ path: path.join(visualOutput, "navigation-dropdown-fixed.png") });
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("all resource downloads are real static files", async ({ page, request }) => {
  await page.goto("/#resources");
  for (const [name, file] of [["下载 BOM 模板", "bom-template.csv"], ["下载质量清单", "quality-checklist.txt"], ["下载选型清单", "selection-checklist.txt"]] as const) {
    expect((await request.get(`/resources/${file}`)).status()).toBe(200);
    const pending = page.waitForEvent("download");
    await page.getByRole("link", { name: new RegExp(name) }).click();
    expect((await pending).suggestedFilename()).toBe(file);
  }
});

test("quality CTA prefills the acceptance checklist and keeps direct contact alternatives", async ({ page }) => {
  await page.goto("/quality/");
  await expect(page.getByRole("link", { name: "直接邮件" })).toHaveAttribute("href", `mailto:${businessEmail}`);
  await expect(page.getByRole("link", { name: /电话联系/ })).toHaveAttribute("href", "tel:+8613423882268");
  await page.getByRole("button", { name: "把验收要求写进需求" }).click();
  await page.locator("#rfq-partNumber").fill("QUALITY-TEST-001");
  await page.locator("#rfq-quantity").fill("10");
  await page.getByRole("button", { name: "继续", exact: true }).click();
  await expect(page.locator("#rfq-details")).toHaveValue(/Date Code、Lot、标签与丝印资料范围/);
  await expect(page.locator("#rfq-details")).toHaveValue(/来源与流转资料范围/);
  await expect(page.locator("#rfq-details")).toHaveValue(/检测主体、项目、方法、抽样、判定与费用/);
  await expect(page.locator("#rfq-details")).toHaveValue(/复核、隔离、处置与反馈路径/);
  await page.screenshot({ path: path.join(visualOutput, "quality-rfq-prefill.png") });
});

test("all routes and key interaction states have no serious or critical axe violations", async ({ page }) => {
  test.setTimeout(180_000);
  for (const route of routes) {
    await page.goto(route);
    await checkAxe(page, route);
  }
  await page.goto("/");
  await page.locator("#global-part-search").fill("FPGA");
  await checkAxe(page, "search suggestions");
  await page.locator("#global-part-search").fill("");
  await page.locator(".sd-nav").getByRole("button", { name: /供应链服务/ }).click();
  await checkAxe(page, "desktop dropdown");
  await page.getByRole("tab", { name: /供应链质量/ }).click();
  await checkAxe(page, "quality hero");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "打开导航菜单" }).click();
  await checkAxe(page, "mobile navigation");
});

test("reduced motion and responsive equivalents of 200/400 percent zoom keep tasks usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await page.getByRole("tab", { name: /工程方案/ }).click();
  await expect(page.locator(".sd-hero__copy")).toHaveCSS("animation-name", "none");
  for (const [width, height] of [[720, 500], [390, 400]]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator("#global-part-search")).toBeVisible();
    const cta = page.getByRole("button", { name: "整理短缺料需求" });
    await cta.scrollIntoViewIfNeeded();
    await expect(cta).toBeVisible();
    if (width === 390) {
      const heights = await page.locator(".sd-hero__contacts a").evaluateAll((links) => links.map((link) => link.getBoundingClientRect().height));
      expect(heights.every((height) => height >= 44)).toBe(true);
    }
  }
});

test("unoptimized images load directly without the image optimizer", async ({ page }) => {
  for (const route of ["/", "/capabilities/", "/quality/", "/solutions/"]) {
    await page.goto(route);
    const images = page.locator("main img");
    expect(await images.count()).toBeGreaterThan(0);
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
      expect(await image.getAttribute("src")).toMatch(/^\/images\//);
    }
  }
});

test("capture SourceDesk desktop and mobile customer journeys", async ({ page }) => {
  await mkdir(visualOutput, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.screenshot({ path: path.join(visualOutput, "home-desktop.png") });
  await page.screenshot({ path: path.join(visualOutput, "home-desktop-full.png"), fullPage: true });
  await page.locator("#products").scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(visualOutput, "products-desktop.png") });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.screenshot({ path: path.join(visualOutput, "home-mobile.png") });
  await page.screenshot({ path: path.join(visualOutput, "home-mobile-full.png"), fullPage: true });
  await page.locator("#global-part-search").fill("FPGA");
  await page.screenshot({ path: path.join(visualOutput, "search-mobile.png") });
  await page.locator("#global-part-search").fill("");
  await page.locator("#products").scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(visualOutput, "products-mobile.png") });
  await page.locator("#rfq").scrollIntoViewIfNeeded();
  await continueShortage(page);
  await page.screenshot({ path: path.join(visualOutput, "rfq-mobile.png") });
});
