/**
 * auth.setup.ts — Clerk authentication setup
 *
 * This file is matched by the "setup" project in playwright.config.ts
 * (testMatch: /.*\.setup\.ts/).  It runs once before any test project
 * that declares `dependencies: ["setup"]`.
 *
 * What it does:
 *  1. Uses @clerk/testing to bypass Clerk's UI and issue a real session
 *     token for the seeder test account.
 *  2. Saves browser storage state (cookies + localStorage) to
 *     tests/.auth/user.json so authenticated test projects can reuse it
 *     without re-logging-in on every test.
 *
 * Requirements:
 *  - CLERK_SECRET_KEY in .env.test (never commit the real key)
 *  - TEST_USER_EMAIL + TEST_USER_PASSWORD in .env.test
 *  - The test account must exist in your Clerk dashboard.
 *
 * If you skip authenticated flows for now, simply don't set those env
 * variables — tests that call `test.use({ storageState: STORAGE_STATE })`
 * will be skipped at runtime with a helpful warning.
 */

import { test as setup } from "@playwright/test"
import { clerkSetup } from "@clerk/testing/playwright"
import path from "path"
import fs from "fs"
import { STORAGE_STATE } from "./constants"

setup("authenticate as job seeker", async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL
  const password = process.env.TEST_USER_PASSWORD

  if (!email || !password) {
    console.warn(
      "[auth.setup] TEST_USER_EMAIL / TEST_USER_PASSWORD not set — " +
        "skipping Clerk session creation.  Authenticated tests will fail."
    )
    // Write an empty state file so downstream projects don't crash
    fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true })
    fs.writeFileSync(STORAGE_STATE, JSON.stringify({ cookies: [], origins: [] }))
    return
  }

  // clerkSetup configures Playwright to work with Clerk's testing helpers
  await clerkSetup()

  await page.goto("/sign-in")

  // Fill the Clerk sign-in form
  const emailInput = page
    .getByLabel(/email address/i)
    .or(page.locator('input[name="identifier"]'))
  await emailInput.waitFor({ state: "visible", timeout: 15_000 })
  await emailInput.fill(email)
  await page.getByRole("button", { name: /continue/i }).click()

  const passwordInput = page
    .getByLabel(/password/i)
    .or(page.locator('input[name="password"]'))
  await passwordInput.waitFor({ state: "visible" })
  await passwordInput.fill(password)
  await page
    .getByRole("button", { name: /^sign in/i })
    .click()

  // Wait until redirected away from the sign-in page
  await page.waitForURL(url => !url.pathname.startsWith("/sign-in"), {
    timeout: 20_000,
  })

  // Persist auth state for all downstream projects
  fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true })
  await page.context().storageState({ path: STORAGE_STATE })
})
