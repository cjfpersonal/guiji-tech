import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
    channel: process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === "true" ? "chrome" : undefined,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    permissions: ["clipboard-read", "clipboard-write"],
  },
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:4173",
      NEXT_PUBLIC_ALLOW_LOCAL_SITE_URL: "true",
      NEXT_PUBLIC_SALES_EMAIL: "chenfeng@jyera.com",
      NEXT_PUBLIC_SALES_PHONE: "+86 134 2388 2268",
      NEXT_PUBLIC_COMPANY_ADDRESS: "广东省深圳市南山区粤海街道高新工业村 T3 栋 A 座 403",
    },
  },
});
