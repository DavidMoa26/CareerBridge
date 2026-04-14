import { type Page, type Locator } from "@playwright/test"
import { BasePage } from "./BasePage"

/**
 * HomePage — the job-seeker job board at `/`.
 *
 * Responsibilities:
 *  - Job listing cards
 *  - Search / filter controls (when implemented in the sidebar)
 */
export class HomePage extends BasePage {
  // ── Job listing cards ─────────────────────────────────────────────────
  /** All job listing cards currently rendered in the feed */
  readonly jobCards: Locator
  readonly emptyState: Locator

  // ── Search / filter controls in the sidebar ───────────────────────────
  readonly searchInput: Locator
  readonly locationFilterInput: Locator

  constructor(page: Page) {
    super(page)

    this.jobCards = page.locator('[data-testid="job-card"]')
    // Fallback selector used when no test-id is present yet
    this.emptyState = page.getByText(/no job listings found/i)

    // These controls live inside the @sidebar parallel route
    this.searchInput = page
      .getByRole("textbox", { name: /search/i })
      .or(page.locator('input[name="title"]'))
    this.locationFilterInput = page
      .getByRole("textbox", { name: /city/i })
      .or(page.locator('input[name="city"]'))
  }

  /** Navigate to the home / job board page */
  async goto() {
    await super.goto("/")
  }

  /**
   * Type into the title search box and submit.
   * Adjust the selector once the real search UI is wired up.
   */
  async searchByTitle(title: string) {
    await this.searchInput.fill(title)
    await this.searchInput.press("Enter")
    await this.page.waitForURL(url => url.searchParams.has("title"))
  }

  /**
   * Click the first job card in the feed.
   * Returns the job listing ID extracted from the resulting URL.
   */
  async openFirstJobListing(): Promise<string> {
    await this.jobCards.first().click()
    await this.page.waitForURL(/\/job-listings\//)
    const url = new URL(this.page.url())
    const segments = url.pathname.split("/")
    return segments[segments.length - 1]
  }
}
