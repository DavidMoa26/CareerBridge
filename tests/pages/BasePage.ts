import { type Page, type Locator } from "@playwright/test"

/**
 * BasePage — shared selectors and helpers that every page inherits.
 *
 * Navigation landmarks use ARIA roles + accessible text so tests stay
 * decoupled from CSS classes and implementation details.
 */
export class BasePage {
  readonly page: Page

  // ── Sidebar ──────────────────────────────────────────────────────────
  readonly sidebar: Locator
  readonly sidebarTrigger: Locator
  readonly logo: Locator

  // ── Sidebar nav links (visible in the job-seeker layout) ─────────────
  readonly jobBoardLink: Locator
  readonly aiSearchLink: Locator
  readonly employerDashboardLink: Locator
  readonly signInNavLink: Locator

  constructor(page: Page) {
    this.page = page

    this.sidebar = page.locator("aside")
    // The sidebar collapse toggle rendered by <SidebarTrigger>
    this.sidebarTrigger = page.getByRole("button", { name: /toggle sidebar/i })
    this.logo = page.getByAltText("CareerBridge")

    this.jobBoardLink = page.getByRole("link", { name: /job board/i })
    this.aiSearchLink = page.getByRole("link", { name: /ai search/i })
    this.employerDashboardLink = page.getByRole("link", {
      name: /employer dashboard/i,
    })
    this.signInNavLink = page.getByRole("link", { name: /sign in/i })
  }

  async waitForHydration() {
    // Next.js marks the document as interactive once client JS has run
    await this.page.waitForLoadState("domcontentloaded")
  }

  /** Navigate to a path relative to baseURL */
  async goto(path: string = "/") {
    await this.page.goto(path)
    await this.waitForHydration()
  }
}
