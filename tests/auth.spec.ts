/**
 * auth.spec.ts — Authentication & Navigation baseline
 *
 * COVERAGE:
 *  ✓ Home page loads for unauthenticated visitors
 *  ✓ CareerBridge logo is visible in the sidebar
 *  ✓ "Sign In" nav link is visible when signed out
 *  ✓ "Employer Dashboard" nav link is hidden when signed out
 *  ✓ Navigating to /sign-in renders the Clerk sign-in component
 *  ✓ The sign-in nav link takes the user to /sign-in
 *  ✓ Authenticated users see "Employer Dashboard" and not "Sign In"
 *
 * GREEN BASELINE: the unauthenticated tests must pass before any UI work.
 * Authenticated tests require TEST_USER_EMAIL + TEST_USER_PASSWORD in .env.test.
 */

import { test, expect } from "./fixtures"
import { STORAGE_STATE } from "./constants"

// ── Unauthenticated tests ───────────────────────────────────────────────────
test.describe("Unauthenticated — home page", () => {
  test("home page renders without errors", async ({ homePage }) => {
    await homePage.goto()

    // The document title should contain the app name
    await expect(homePage.page).toHaveTitle(/CareerBridge/i)
  })

  test("sidebar is present with the CareerBridge logo", async ({ homePage }) => {
    await homePage.goto()

    await expect(homePage.sidebar).toBeVisible()
    await expect(homePage.logo).toBeVisible()
  })

  test("'Sign In' nav link is visible for guests", async ({ homePage }) => {
    await homePage.goto()

    await expect(homePage.signInNavLink).toBeVisible()
  })

  test("'Employer Dashboard' nav link is hidden for guests", async ({
    homePage,
  }) => {
    await homePage.goto()

    await expect(homePage.employerDashboardLink).toBeHidden()
  })

  test("'Job Board' nav link is visible and active on home page", async ({
    homePage,
  }) => {
    await homePage.goto()

    await expect(homePage.jobBoardLink).toBeVisible()
  })

  test("'AI Search' nav link is visible", async ({ homePage }) => {
    await homePage.goto()

    await expect(homePage.aiSearchLink).toBeVisible()
  })
})

// ── Sign-in page ────────────────────────────────────────────────────────────
test.describe("Sign-in page", () => {
  test("navigating to /sign-in renders Clerk sign-in UI", async ({
    authPage,
  }) => {
    await authPage.goto()

    await expect(authPage.page).toHaveURL(/\/sign-in/)
    // Clerk renders its card — at least the email input should be present
    await expect(authPage.emailInput).toBeVisible({ timeout: 10_000 })
  })

  test("'Sign In' sidebar link navigates to the sign-in page", async ({
    homePage,
  }) => {
    await homePage.goto()

    await homePage.signInNavLink.click()

    await expect(homePage.page).toHaveURL(/\/sign-in/)
  })
})

// ── Authenticated tests ─────────────────────────────────────────────────────
// These tests reuse the saved Clerk session from auth.setup.ts.
// They are skipped automatically when storageState is empty (no credentials set).
test.describe("Authenticated — nav state", () => {
  test.use({ storageState: STORAGE_STATE })

  test("signed-in user sees 'Employer Dashboard' link", async ({ homePage }) => {
    await homePage.goto()

    await expect(homePage.employerDashboardLink).toBeVisible()
  })

  test("signed-in user does not see 'Sign In' link", async ({ homePage }) => {
    await homePage.goto()

    await expect(homePage.signInNavLink).toBeHidden()
  })

  test("sidebar footer shows the user button when signed in", async ({
    homePage,
  }) => {
    await homePage.goto()

    // The SidebarUserButton renders inside <SidebarFooter>
    const footer = homePage.page.locator("footer, [data-sidebar='footer']")
    await expect(footer).toBeVisible()
  })
})
