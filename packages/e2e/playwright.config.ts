import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E テスト設定
 *
 * 対象: 主要フローのみ（認証・コアユーザーフロー）
 * ブラウザ: Chromium のみ（CI コスト削減）
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  workers: process.env["CI"] ? 1 : undefined,
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],

  use: {
    // BASE_URL 環境変数で切り替え（ローカル / CI）
    baseURL: process.env["BASE_URL"] ?? "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // ローカル開発時は frontend dev サーバーを自動起動
  webServer: process.env["CI"]
    ? undefined
    : {
        command: "pnpm --filter @monorepo/frontend dev",
        url: "http://localhost:5173",
        reuseExistingServer: true,
        timeout: 30000,
      },
});
