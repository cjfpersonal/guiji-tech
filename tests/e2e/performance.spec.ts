import { expect, test } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

test("throttled mobile LCP, CLS and long tasks meet SourceDesk budgets", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "CDP metrics require Chromium");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 120, downloadThroughput: 200000, uploadThroughput: 93750 });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.addInitScript(() => {
    const metrics = { lcp: 0, cls: 0, lcpElement: "", lcpUrl: "", longTasks: [] as { startTime: number; duration: number; attribution?: string[] }[] };
    Object.assign(window, { __sourceMetrics: metrics });
    new PerformanceObserver((list) => { for (const entry of list.getEntries()) { const lcp = entry as PerformanceEntry & { element?: Element; url?: string }; metrics.lcp = entry.startTime; metrics.lcpElement = lcp.element ? `${lcp.element.tagName}.${String(lcp.element.className).slice(0, 120)}: ${(lcp.element.textContent || "").trim().slice(0, 160)}` : "none"; metrics.lcpUrl = lcp.url || ""; } }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => { for (const entry of list.getEntries()) { const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean }; if (!shift.hadRecentInput) metrics.cls += shift.value; } }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => { for (const entry of list.getEntries()) { const task = entry as PerformanceEntry & { attribution?: { name: string }[] }; metrics.longTasks.push({ startTime: entry.startTime, duration: entry.duration, attribution: task.attribution?.map((item) => item.name) }); } }).observe({ type: "longtask", buffered: true });
  });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("h1")).toBeVisible();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __sourceMetrics: { lcp: number } }).__sourceMetrics.lcp), { timeout: 15_000 }).toBeGreaterThan(0);
  await page.waitForTimeout(2500);
  const metrics = await page.evaluate(() => {
    const value = (window as unknown as { __sourceMetrics: { lcp: number; cls: number; longTasks: { startTime: number; duration: number }[] } }).__sourceMetrics;
    return { ...value, longestTask: value.longTasks.reduce((max, task) => Math.max(max, task.duration), 0), resources: performance.getEntriesByType("resource").map((entry) => { const resource = entry as PerformanceResourceTiming; return { name: resource.name, startTime: resource.startTime, duration: resource.duration, transferSize: resource.transferSize, encodedBodySize: resource.encodedBodySize, decodedBodySize: resource.decodedBodySize }; }), navigation: performance.getEntriesByType("navigation").map((entry) => ({ domContentLoaded: (entry as PerformanceNavigationTiming).domContentLoadedEventEnd, load: (entry as PerformanceNavigationTiming).loadEventEnd }))[0] };
  });
  const output = path.resolve("test-results/visual");
  await mkdir(output, { recursive: true });
  const longTaskGoalMet = metrics.longestTask <= 200;
  await writeFile(path.join(output, "mobile-performance.json"), JSON.stringify({ conditions: { viewport: "390x844", cpuSlowdown: 4, latencyMs: 120, downloadBytesPerSecond: 200000, uploadBytesPerSecond: 93750 }, budgets: { lcpMs: 3000, cls: 0.1, longestTaskMs: 200 }, longTaskGoalMet, metrics }, null, 2));
  console.info(`SourceDesk long-task goal: ${longTaskGoalMet ? "met" : `not met (${metrics.longestTask}ms; see mobile-performance.json and CPU profile)`}`);
  expect(metrics.lcp).toBeLessThanOrEqual(3000);
  expect(metrics.cls).toBeLessThan(0.1);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
});
