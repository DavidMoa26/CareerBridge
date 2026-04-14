/**
 * responsive.spec.ts — Sidebar / layout responsive design
 *
 * These tests run against the "mobile-chrome" and "mobile-safari" projects
 * (Pixel 5 / iPhone 12 viewports) as well as the default desktop projects,
 * because playwright.config.ts scopes the mobile projects to files whose
 * name contains "responsive". Desktop projects pick up the file normally.
 *
 * COVERAGE:
 *  Desktop (≥1280 px)
 *    ✓ Sidebar is expanded by default
 *    ✓ CareerBridge logo is visible
 *    ✓ Clicking the sidebar trigger collapses it (icon-only mode)
 *    ✓ Clicking again re-expands it
 *    ✓ Main content area is still accessible when sidebar is collapsed
 *
 *  Mobile (≤430 px — Pixel 5 / iPhone 12)
 *    ✓ Sidebar is NOT visible by default (off-canvas)
 *    ✓ The sidebar trigger button is visible
 *    ✓ Clicking the trigger slides the sidebar open
 *    ✓ Sidebar contains nav links when open
 */

import { test, expect } from "./fixtures"

// ── Desktop ─────────────────────────────────────────────────────────────────
test.describe("Desktop layout", () => {
  // Force desktop viewport for every test in this describe block
  test.use({ viewport: { width: 1280, height: 720 } })

  test.beforeEach(async ({ homePage }) => {
    await homePage.goto()
  })

  test("sidebar is visible and expanded by default", async ({ homePage }) => {
    // The sidebar should be rendered and not in collapsed/icon-only state
    await expect(homePage.sidebar).toBeVisible()
    // Logo is only visible when sidebar is expanded
    await expect(homePage.logo).toBeVisible()
  })

  test("sidebar trigger collapses the sidebar", async ({ homePage }) => {
    await expect(homePage.logo).toBeVisible()

    await homePage.sidebarTrigger.click()

    // After collapsing, the logo disappears (sidebar in icon-only mode)
    await expect(homePage.logo).toBeHidden({ timeout: 3_000 })
  })

  test("clicking trigger again re-expands the sidebar", async ({ homePage }) => {
    // Collapse
    await homePage.sidebarTrigger.click()
    await expect(homePage.logo).toBeHidden({ timeout: 3_000 })

    // Re-expand
    await homePage.sidebarTrigger.click()
    await expect(homePage.logo).toBeVisible({ timeout: 3_000 })
  })

  test("main content is accessible when sidebar is collapsed", async ({
    homePage,
    page,
  }) => {
    await homePage.sidebarTrigger.click()
    await expect(homePage.logo).toBeHidden({ timeout: 3_000 })

    // The main element should still be visible and have non-zero dimensions
    const main = page.locator("main")
    await expect(main).toBeVisible()
    const box = await main.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(100)
  })

  test("nav links remain accessible on desktop", async ({ homePage }) => {
    await expect(homePage.jobBoardLink).toBeVisible()
    await expect(homePage.aiSearchLink).toBeVisible()
  })
})

// ── Mobile ───────────────────────────────────────────────────────────────────
test.describe("Mobile layout", () => {
  // Pixel 5 viewport
  test.use({ viewport: { width: 393, height: 851 } })

  test.beforeEach(async ({ homePage }) => {
    await homePage.goto()
  })

  test("sidebar is hidden by default on mobile", async ({ homePage }) => {
    // On mobile the sidebar starts off-canvas; it should not be visible
    // The sidebar element exists in the DOM but the SidebarProvider hides it
    const sidebarBox = await homePage.sidebar.boundingBox()
    // Either not visible or positioned off-screen (x < 0 or width = 0)
    if (sidebarBox) {
      const isOffScreen = sidebarBox.x < 0 || sidebarBox.width < 10
      expect(isOffScreen).toBe(true)
    }
    // If boundingBox() returns null, the element is hidden — also fine
  })

  test("sidebar trigger button is visible on mobile", async ({ homePage }) => {
    await expect(homePage.sidebarTrigger).toBeVisible()
  })

  test("tapping the trigger opens the sidebar", async ({ homePage }) => {
    await homePage.sidebarTrigger.click()

    // After opening, the sidebar should slide in and be visible
    await expect(homePage.sidebar).toBeVisible({ timeout: 3_000 })
  })

  test("open sidebar contains navigation links", async ({ homePage }) => {
    await homePage.sidebarTrigger.click()

    await expect(homePage.sidebar).toBeVisible({ timeout: 3_000 })
    await expect(homePage.jobBoardLink).toBeVisible()
  })

  test("main content area has correct mobile width", async ({ homePage, page }) => {
    const main = page.locator("main")
    await expect(main).toBeVisible()

    const box = await main.boundingBox()
    expect(box).not.toBeNull()
    // On mobile the main should take up most of the 393px viewport
    expect(box!.width).toBeGreaterThan(300)
  })
})
