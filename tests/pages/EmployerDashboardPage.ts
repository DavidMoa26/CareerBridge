import { type Page, type Locator } from "@playwright/test"
import { BasePage } from "./BasePage"

/**
 * EmployerDashboardPage — the employer sidebar + job listing management UI
 * rooted at `/employer`.
 */
export class EmployerDashboardPage extends BasePage {
  // ── Sidebar elements ──────────────────────────────────────────────────
  readonly addJobListingButton: Locator
  readonly jobListingsSection: Locator

  // ── New job listing page (/employer/job-listings/new) ─────────────────
  readonly newListingPageTitle: Locator

  // ── Job listing form ──────────────────────────────────────────────────
  readonly titleInput: Locator
  readonly descriptionEditor: Locator
  readonly wageInput: Locator
  readonly cityInput: Locator
  readonly countryInput: Locator

  // ── Submit / save controls ────────────────────────────────────────────
  readonly saveDraftButton: Locator
  readonly publishButton: Locator

  // ── Validation ────────────────────────────────────────────────────────
  /** Any visible form error message */
  readonly formError: Locator

  constructor(page: Page) {
    super(page)

    // Sidebar — use data-slot first; role-based query can fail in Chromium when
    // button attributes are merged onto <a> via Radix Slot (asChild pattern).
    this.addJobListingButton = page
      .locator('[data-slot="sidebar-group-action"]')
      .or(page.getByRole("link", { name: /add job listing/i }))
      .or(page.getByTitle(/add job listing/i))
    this.jobListingsSection = page.getByText(/job listings/i).first()

    // New listing page heading
    this.newListingPageTitle = page.getByRole("heading", {
      name: /new job listing/i,
    })

    // Form fields — names/labels come from JobListingForm
    this.titleInput = page
      .getByLabel(/title/i)
      .or(page.locator('input[name="title"]'))
    this.descriptionEditor = page
      .locator(".mdxeditor")
      .or(page.locator('[contenteditable="true"]'))
    this.wageInput = page
      .getByLabel(/wage/i)
      .or(page.locator('input[name="wage"]'))
    this.cityInput = page
      .getByLabel(/city/i)
      .or(page.locator('input[name="city"]'))
    this.countryInput = page
      .getByLabel(/country/i)
      .or(page.locator('input[name="country"]'))

    // Action buttons — the form uses "Create Job Listing" / "Update Job Listing"
    this.saveDraftButton = page.getByRole("button", {
      name: /create job listing|update job listing/i,
    })
    this.publishButton = page.getByRole("button", { name: /publish/i })

    // Validation
    this.formError = page
      .locator('[role="alert"]')
      .or(page.locator(".text-destructive"))
  }

  async goto() {
    await super.goto("/employer")
    // Wait for the sidebar to fully render (permission-based items stream in async)
    await this.page.waitForLoadState("networkidle")
    // Explicitly wait for the sidebar group label to be visible — Suspense-streamed
    // server components can settle after networkidle in Chromium.
    await this.page
      .locator('[data-slot="sidebar-group-label"]')
      .waitFor({ state: "visible", timeout: 10_000 })
  }

  async gotoNewListing() {
    await super.goto("/employer/job-listings/new")
  }

  /**
   * Attempt to save a draft without filling in required fields.
   * Used to verify form validation.
   */
  async submitEmptyForm() {
    await this.saveDraftButton
      .or(this.publishButton)
      .first()
      .click({ force: true })
  }

  /**
   * Fill in the minimum required fields and submit the form.
   * Sets locationRequirement to Remote so city/country are not required.
   */
  async fillAndSaveDraft(params: { title: string }) {
    await this.titleInput.fill(params.title)

    // Switch location to Remote — eliminates the city/country required fields
    const locationSelect = this.page.getByLabel(/location requirement/i)
    await locationSelect.click()
    await this.page.getByRole("option", { name: /remote/i }).click()

    // Description is required (min 1 char) — MDX Editor uses ProseMirror which
    // requires real keyboard events; fill() sets innerText directly and bypasses
    // the editor's event listeners. pressSequentially fires keydown/input/keyup.
    const editor = this.page.locator('[contenteditable="true"]').first()
    await editor.click()
    await editor.pressSequentially("Test.", { delay: 30 })

    await this.saveDraftButton.click()
  }
}
