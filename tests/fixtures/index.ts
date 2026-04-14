import { test as base, expect } from "@playwright/test"
import { clerkSetup } from "@clerk/testing/playwright"
import { HomePage } from "../pages/HomePage"
import { JobListingDetailPage } from "../pages/JobListingDetailPage"
import { AuthPage } from "../pages/AuthPage"
import { EmployerDashboardPage } from "../pages/EmployerDashboardPage"

/**
 * Extended Playwright fixtures.
 *
 * Each fixture is lazily constructed and receives the current `page`,
 * keeping POM construction out of individual spec files.
 *
 * Usage in a spec:
 *   import { test, expect } from "../fixtures"
 *   test("...", async ({ homePage }) => { ... })
 */
type Fixtures = {
  homePage: HomePage
  jobListingDetailPage: JobListingDetailPage
  authPage: AuthPage
  employerDashboardPage: EmployerDashboardPage
}

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  jobListingDetailPage: async ({ page }, use) => {
    await use(new JobListingDetailPage(page))
  },
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page))
  },
  employerDashboardPage: async ({ page }, use) => {
    await use(new EmployerDashboardPage(page))
  },
})

export { expect, clerkSetup }
