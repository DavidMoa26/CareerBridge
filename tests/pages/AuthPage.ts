import { type Page, type Locator } from "@playwright/test"
import { BasePage } from "./BasePage"

/**
 * AuthPage — Clerk-hosted sign-in/sign-up at `/sign-in`.
 *
 * Clerk renders its own iframe/component, so we target the Clerk
 * component container and the visible input labels rather than internals.
 */
export class AuthPage extends BasePage {
  // ── Clerk UI elements ─────────────────────────────────────────────────
  /** The root element of the embedded Clerk sign-in component */
  readonly clerkCard: Locator

  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly continueButton: Locator
  readonly signInButton: Locator

  /** Link that switches to the sign-up flow */
  readonly signUpLink: Locator

  constructor(page: Page) {
    super(page)

    // Clerk renders a <div data-clerk-component> or with its own class names
    this.clerkCard = page
      .locator("[data-clerk-component]")
      .or(page.locator(".cl-card"))
      .or(page.locator(".cl-rootBox"))

    this.emailInput = page
      .getByLabel(/email address/i)
      .or(page.locator('input[name="identifier"]'))
    this.passwordInput = page
      .getByLabel(/password/i)
      .or(page.locator('input[name="password"]'))
    this.continueButton = page.getByRole("button", { name: /continue/i })
    this.signInButton = page
      .getByRole("button", { name: /^sign in$/i })
      .or(page.getByRole("button", { name: /^sign in with email$/i }))
    this.signUpLink = page
      .getByRole("link", { name: /sign up/i })
      .or(page.getByText(/don't have an account/i))
  }

  async goto() {
    await super.goto("/sign-in")
  }

  /**
   * Fill in email + password and submit.
   * Only works in Clerk's "test mode" — requires CLERK_SECRET_KEY
   * and a seeded test account.
   */
  async signIn(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.continueButton.click()
    await this.passwordInput.waitFor({ state: "visible" })
    await this.passwordInput.fill(password)
    await this.signInButton.click()
    // Wait until Clerk redirects away from /sign-in
    await this.page.waitForURL(url => !url.pathname.startsWith("/sign-in"), {
      timeout: 15_000,
    })
  }
}
