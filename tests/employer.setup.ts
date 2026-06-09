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
  await clerkSetup({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  fs.mkdirSync(path.dirname(EMPLOYER_STORAGE_STATE), { recursive: true })
  await page.context().storageState({ path: EMPLOYER_STORAGE_STATE })
})
