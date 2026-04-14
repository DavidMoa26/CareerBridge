/**
 * employer.spec.ts — Employer dashboard flow
 *
 * COVERAGE:
 *  ✓ Unauthenticated visit to /employer redirects to org selection
 *  ✓ Authenticated employer sees the sidebar with "Job Listings" section
 *  ✓ "Add Job Listing" action link navigates to /employer/job-listings/new
 *  ✓ New listing page renders the form with a title input
 *  ✓ Submitting an empty form reveals validation errors
 *  ✓ Filling required fields and saving creates a draft (redirects or shows
 *    success feedback)
 *
 * GREEN BASELINE:
 *  The unauthenticated redirect test runs with no env vars.
 *  All employer-authenticated tests require:
 *   - TEST_EMPLOYER_EMAIL + TEST_EMPLOYER_PASSWORD  (an org-member account)
 *  in .env.test.  The setup project (auth.setup.ts) uses TEST_USER_EMAIL;
 *  for the employer flow we store a separate session file.
 */

import { test, expect } from "./fixtures"
import path from "path"

const EMPLOYER_STORAGE_STATE = path.join(__dirname, ".auth/employer.json")

// ── Unauthenticated guard ───────────────────────────────────────────────────
test.describe("Employer dashboard — unauthenticated", () => {
  test("visiting /employer redirects non-members away", async ({ page }) => {
    await page.goto("/employer")
    await page.waitForLoadState("networkidle")

    // Clerk redirects unauthenticated users to sign-in or org-selection
    const url = page.url()
    const isRedirected =
      url.includes("/sign-in") ||
      url.includes("/organizations/select") ||
      url.includes("/sign-up")

    expect(isRedirected).toBe(true)
  })
})

// ── Employer auth setup (inline, separate from job-seeker setup) ────────────
// We create a second setup test in a separate describe so we can re-use its
// storage state independently from the job-seeker state.
test.describe("Employer auth setup", () => {
  test("sign in as employer", async ({ page }) => {
    const email = process.env.TEST_EMPLOYER_EMAIL
    const password = process.env.TEST_EMPLOYER_PASSWORD

    if (!email || !password) {
      test.skip()
      return
    }

    await page.goto("/sign-in")

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
    await page.getByRole("button", { name: /^sign in/i }).click()

    await page.waitForURL(url => !url.pathname.startsWith("/sign-in"), {
      timeout: 20_000,
    })

    const fs = await import("fs")
    fs.mkdirSync(path.dirname(EMPLOYER_STORAGE_STATE), { recursive: true })
    await page.context().storageState({ path: EMPLOYER_STORAGE_STATE })
  })
})

// ── Authenticated employer tests ────────────────────────────────────────────
test.describe("Employer dashboard — authenticated", () => {
  test.use({ storageState: EMPLOYER_STORAGE_STATE })

  test.beforeEach(async ({}, testInfo) => {
    const email = process.env.TEST_EMPLOYER_EMAIL
    if (!email) {
      testInfo.skip()
    }
  })

  test("employer sidebar shows 'Job Listings' section", async ({
    employerDashboardPage,
  }) => {
    await employerDashboardPage.goto()

    await expect(employerDashboardPage.jobListingsSection).toBeVisible({
      timeout: 10_000,
    })
  })

  test("'Add Job Listing' link navigates to the new-listing page", async ({
    employerDashboardPage,
    page,
  }) => {
    await employerDashboardPage.goto()

    await employerDashboardPage.addJobListingButton.click()

    await expect(page).toHaveURL(/\/employer\/job-listings\/new/, {
      timeout: 10_000,
    })
    await expect(employerDashboardPage.newListingPageTitle).toBeVisible()
  })

  test("new listing form renders with a title input", async ({
    employerDashboardPage,
  }) => {
    await employerDashboardPage.gotoNewListing()

    await expect(employerDashboardPage.titleInput).toBeVisible({ timeout: 8_000 })
  })

  test("submitting empty form shows validation errors", async ({
    employerDashboardPage,
  }) => {
    await employerDashboardPage.gotoNewListing()

    await employerDashboardPage.submitEmptyForm()

    // At least one validation message should appear
    await expect(employerDashboardPage.formError.first()).toBeVisible({
      timeout: 5_000,
    })
  })

  test("filling the title and saving creates a draft", async ({
    employerDashboardPage,
    page,
  }) => {
    await employerDashboardPage.gotoNewListing()

    await employerDashboardPage.fillAndSaveDraft({
      title: `PW Test Listing ${Date.now()}`,
    })

    // After a successful save the app either redirects to the edit page
    // or stays on the new page with a success toast
    const redirected = await page
      .waitForURL(/\/employer\/job-listings\/(?!new)/, { timeout: 8_000 })
      .then(() => true)
      .catch(() => false)

    const toastVisible = await page
      .locator("[data-sonner-toast]")
      .or(page.locator('[role="status"]'))
      .first()
      .isVisible()
      .catch(() => false)

    expect(redirected || toastVisible).toBe(true)
  })
})
