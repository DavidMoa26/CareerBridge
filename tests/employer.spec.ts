import { test, expect } from './fixtures';
import { EMPLOYER_STORAGE_STATE } from './constants';

test.describe('Employer dashboard — unauthenticated', () => {
  test('visiting /employer redirects non-members away', async ({ page }) => {
    await page.goto('/employer', { waitUntil: 'commit' });
    await expect(page).toHaveURL(
      /\/sign-in|\/organizations\/select|\/sign-up/,
      { timeout: 15_000 },
    );
  });
});

test.describe('Employer dashboard — authenticated', () => {
  test.use({ storageState: EMPLOYER_STORAGE_STATE });
  test.setTimeout(90_000);

  test.beforeEach(async ({ employerDashboardPage, page }, testInfo) => {
    const email = process.env.TEST_EMPLOYER_EMAIL;
    if (!email) {
      testInfo.skip();
      return;
    }
    await employerDashboardPage.goto();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('main')).toBeVisible({ timeout: 25_000 });
  });

  test("employer sidebar shows 'Job Listings' section", async ({
    employerDashboardPage,
  }) => {
    await expect(employerDashboardPage.jobListingsSection).toBeVisible({
      timeout: 15_000,
    });
  });

  test("'Add Job Listing' link navigates to the new-listing page", async ({
    employerDashboardPage,
    page,
  }) => {
    await expect(employerDashboardPage.addJobListingButton).toBeVisible({
      timeout: 15_000,
    });
    await employerDashboardPage.addJobListingButton.click();
    await page.waitForURL(/\/employer\/job-listings\/new/, { timeout: 15_000 });
    await expect(employerDashboardPage.newListingPageTitle).toBeVisible({
      timeout: 10_000,
    });
  });

  test('new listing form renders with a title input', async ({
    employerDashboardPage,
  }) => {
    await employerDashboardPage.gotoNewListing();
    await expect(employerDashboardPage.titleInput).toBeVisible({
      timeout: 20_000,
    });
  });

  test('submitting empty form shows validation errors', async ({
    employerDashboardPage,
  }) => {
    await employerDashboardPage.gotoNewListing();
    await expect(employerDashboardPage.titleInput).toBeVisible({
      timeout: 15_000,
    });
    await employerDashboardPage.submitEmptyForm();
    await expect(employerDashboardPage.formError.first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('filling the title and saving creates a draft', async ({
    employerDashboardPage,
    page,
  }) => {
    await employerDashboardPage.gotoNewListing();
    const title = `PW Test Listing ${Date.now()}`;
    await employerDashboardPage.fillAndSaveDraft({ title });

    const toast = page.locator("[data-sonner-toast], [role='status']").first();
    await expect(async () => {
      const currentUrl = page.url();
      const isRedirected =
        currentUrl.includes('/employer/job-listings/') &&
        !currentUrl.endsWith('/new');
      const isToastVisible = await toast.isVisible();
      expect(isRedirected || isToastVisible).toBe(true);
    }).toPass({ timeout: 20_000 });
  });
});
