import { defineConfig, devices } from "@playwright/test"

/**
 * Load test-specific environment variables.
 * Copy .env.test.example → .env.test and fill in your values.
 */
import dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(__dirname, ".env.test") })

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000"

export default defineConfig({
  testDir: "./tests",

  /* Run each spec file in parallel; tests within a file run sequentially */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  /* HTML report written to playwright-report/ */
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: BASE_URL,

    /* Record a trace for failed tests so you can open them in the Playwright Trace Viewer */
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    /* Default viewport — overridden per-project for responsive tests */
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    /* ── Auth setup projects ──────────────────────────────────────────────
       Each runs once (in a single browser) to create a session file.
       Browser-specific projects depend on the appropriate setup project.
    ───────────────────────────────────────────────────────────────────── */
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "employer-setup",
      testMatch: /employer\.setup\.ts/,
      dependencies: ["setup"],
    },

    /* ── Desktop browsers ─────────────────────────────────────────────── */
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup", "employer-setup"],
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      dependencies: ["setup", "employer-setup"],
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      dependencies: ["setup", "employer-setup"],
    },

    /* ── Mobile viewports (responsive tests) ─────────────────────────── */
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
      dependencies: ["setup", "employer-setup"],
      /* Only run files that include "responsive" in their name */
      testMatch: /.*responsive.*/,
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"] },
      dependencies: ["setup", "employer-setup"],
      testMatch: /.*responsive.*/,
    },
  ],

  /* Start the Next.js dev server automatically during `npx playwright test` */
  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
