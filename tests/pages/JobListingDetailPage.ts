import { type Page, type Locator } from "@playwright/test"
import { BasePage } from "./BasePage"

/**
 * JobListingDetailPage — the split-pane view at `/job-listings/[id]`.
 *
 * On desktop (≥1024 px) the detail panel is a ResizablePanel.
 * On mobile it opens as a Sheet.  Both share the same inner markup, so
 * selectors target content rather than layout containers.
 */
export class JobListingDetailPage extends BasePage {
  // ── Detail panel content ──────────────────────────────────────────────
  readonly jobTitle: Locator
  readonly organizationName: Locator
  readonly applyButton: Locator
  readonly closeButton: Locator

  // ── Apply flow overlays ───────────────────────────────────────────────
  /** Popover shown to unauthenticated visitors */
  readonly signUpPopover: Locator
  /** Popover shown when the user has no resume on file */
  readonly uploadResumePopover: Locator
  /** Dialog shown to authenticated users who are ready to apply */
  readonly applicationDialog: Locator
  readonly applicationDialogTitle: Locator
  readonly coverLetterTextarea: Locator
  readonly submitApplicationButton: Locator

  constructor(page: Page) {
    super(page)

    this.jobTitle = page.locator("h1")
    this.organizationName = page
      .locator(".text-muted-foreground")
      .filter({ hasText: /\w+/ })
      .first()
    this.applyButton = page.getByRole("button", { name: /^apply$/i })
    this.closeButton = page.getByRole("link", { name: /close/i }).or(
      page.getByRole("button", { name: /close/i })
    )

    this.signUpPopover = page.getByText(
      /you need to create an account before applying/i
    )
    this.uploadResumePopover = page.getByText(
      /you need to upload your resume before applying/i
    )
    this.applicationDialog = page.getByRole("dialog", { name: /application/i })
    this.applicationDialogTitle = page.getByRole("heading", {
      name: /application/i,
    })
    this.coverLetterTextarea = page
      .getByRole("textbox", { name: /cover letter/i })
      .or(page.locator("textarea"))
    this.submitApplicationButton = page.getByRole("button", {
      name: /submit/i,
    })
  }

  async goto(jobListingId: string) {
    await super.goto(`/job-listings/${jobListingId}`)
  }

  /** Click the Apply button and wait for either the popover or the dialog */
  async clickApply() {
    await this.applyButton.click()
  }
}
