/**
 * employer.setup.ts — Clerk authentication setup for employer account
 *
 * Matched by the "employer-setup" project in playwright.config.ts
 * (testMatch: /.*employer\.setup\.ts/).  Runs once before any project
 * that declares `dependencies: ["employer-setup"]`.
 *
 * Requirements:
 *  - TEST_EMPLOYER_EMAIL + TEST_EMPLOYER_PASSWORD in .env.test
 */

import { test as setup } from "@playwright/test"
import { clerkSetup } from "@clerk/testing/playwright"
import path from "path"
import fs from "fs"
import { EMPLOYER_STORAGE_STATE } from "./constants"

setup("sign in as employer", async ({ page }) => {
  const email = process.env.TEST_EMPLOYER_EMAIL
  const password = process.env.TEST_EMPLOYER_PASSWORD

  if (!email || !password) {
    console.warn(
      "[employer.setup] TEST_EMPLOYER_EMAIL / TEST_EMPLOYER_PASSWORD not set — " +
        "skipping employer session creation.  Employer-authenticated tests will be skipped."
    )
    fs.mkdirSync(path.dirname(EMPLOYER_STORAGE_STATE), { recursive: true })
    fs.writeFileSync(
      EMPLOYER_STORAGE_STATE,
      JSON.stringify({ cookies: [], origins: [] })
    )
    return
  }

  await clerkSetup()

  await page.goto("/sign-in")
  await page.waitForLoadState("load")

  const emailInput = page
    .getByLabel(/email address/i)
    .or(page.locator('input[name="identifier"]'))
  await emailInput.waitFor({ state: "visible", timeout: 30_000 })
  await emailInput.fill(email)
  await page.getByRole("button", { name: /continue/i }).click()

  const passwordInput = page.locator('input[type="password"]').first()
  await passwordInput.waitFor({ state: "visible" })
  await passwordInput.fill(password)
  await page.getByRole("button", { name: /continue/i }).click()

  await page.waitForURL(url => !url.pathname.startsWith("/sign-in"), {
    timeout: 20_000,
  })

  fs.mkdirSync(path.dirname(EMPLOYER_STORAGE_STATE), { recursive: true })
  await page.context().storageState({ path: EMPLOYER_STORAGE_STATE })
})
