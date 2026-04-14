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

    // Sidebar
    this.addJobListingButton = page
      .getByRole("link", { name: /add job listing/i })
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

    // Action buttons
    this.saveDraftButton = page.getByRole("button", { name: /save draft/i })
    this.publishButton = page.getByRole("button", { name: /publish/i })

    // Validation
    this.formError = page
      .locator('[role="alert"]')
      .or(page.locator(".text-destructive"))
  }

  async goto() {
    await super.goto("/employer")
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
   * Fill in the minimum required fields and save a draft.
   */
  async fillAndSaveDraft(params: { title: string }) {
    await this.titleInput.fill(params.title)
    await this.saveDraftButton.click()
  }
}
