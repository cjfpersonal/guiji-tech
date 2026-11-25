import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = (process.env.PROJECT_PAGE_BASE_URL || "http://127.0.0.1:4174/guiji-tech").replace(/\/+$/, "");
const basePath = new URL(base).pathname.replace(/\/+$/, "");
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === "true" ? "chrome" : undefined, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const failures = [];
page.on("response", (response) => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });

for (const route of ["/", "/quality/", "/line-card/", "/about/"]) {
  const response = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, route);
  await page.locator("h1").first().waitFor();
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  assert.equal(canonical, `${base}${route}`, `${route} canonical`);
  const rootReferences = await page.evaluate((prefix) => {
    const references = [];
    const resource = /^\/(?:_next\/|images\/|resources\/|opengraph-image\.png|icon\.svg)/;
    for (const element of document.querySelectorAll("[src],[href],[srcset],[content]")) {
      for (const attribute of ["src", "href", "srcset", "content"]) {
        const value = element.getAttribute(attribute)?.trim();
        if (value && resource.test(value) && !value.startsWith(`${prefix}/`)) references.push(`${element.tagName}.${attribute}=${value}`);
      }
    }
    return references;
  }, basePath);
  assert.deepEqual(rootReferences, [], `${route} contains root-only asset references`);
}

await page.goto(`${base}/`, { waitUntil: "networkidle" });
for (const image of await page.locator("main img").all()) {
  await image.scrollIntoViewIfNeeded();
  assert.ok(await image.evaluate((element) => element.complete && element.naturalWidth > 0), await image.getAttribute("src"));
}
for (const href of await page.locator("#resources a[download]").evaluateAll((links) => links.map((link) => link.getAttribute("href")))) {
  assert.ok(href.startsWith(`${basePath}/resources/`), href);
  const response = await page.request.get(href);
  assert.equal(response.status(), 200, href);
}
const manifest = await page.request.get(`${basePath}/manifest.webmanifest`);
assert.equal(manifest.status(), 200);
assert.equal((await manifest.json()).start_url, `${basePath}/`);
assert.deepEqual(failures, [], "HTTP resource failures");
console.log(`PASS project page ${base}: routes, canonical, images, downloads, manifest and no root-only asset references.`);
await browser.close();
