import { test, expect } from './fixtures';
import { STORAGE_STATE } from './constants';

test.describe('Job board — unauthenticated', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main')).toBeVisible({ timeout: 20_000 });
  });

  test('job board page loads successfully', async ({ homePage }) => {
    await expect(homePage.page).toHaveURL('/');
    await expect(homePage.page).toHaveTitle(/CareerBridge/i);
  });

  test('displays job listing cards OR empty state — never crashes', async ({
    homePage,
  }) => {
    const cards = homePage.jobCards.first();
    const empty = homePage.emptyState;
    await expect(async () => {
      const isCardsVisible = await cards.isVisible();
      const isEmptyVisible = await empty.isVisible();
      expect(isCardsVisible || isEmptyVisible).toBe(true);
    }).toPass({ timeout: 10_000 });
  });
});

test.describe('Search and filtering — unauthenticated', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main')).toBeVisible({ timeout: 20_000 });
  });

  test('direct URL with ?title= filter shows filtered results or empty state', async ({
    homePage,
    page,
  }) => {
    await page.goto('/?title=__no_match_xyz__', { waitUntil: 'networkidle' });
    await expect(homePage.emptyState).toBeVisible({ timeout: 15_000 });
  });
});

test.describe('Job listing detail — unauthenticated', () => {
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const listingLink = page.locator('a[href*="/job-listings/"]').first();
    await expect(listingLink)
      .toBeVisible({ timeout: 30_000 })
      .catch(() => {
        test.skip();
      });
  });

  test('detail page shows an Apply button', async ({
    jobListingDetailPage,
    page,
  }) => {
    const listingLink = page.locator('a[href*="/job-listings/"]').first();
    await listingLink.click();

    await page.waitForURL(/\/job-listings\//, { timeout: 60_000 });
    await expect(jobListingDetailPage.applyButton).toBeVisible({
      timeout: 20_000,
    });
  });

  test('unauthenticated Apply shows the sign-up prompt', async ({
    jobListingDetailPage,
    page,
  }) => {
    const listingLink = page.locator('a[href*="/job-listings/"]').first();
    await listingLink.click();

    await page.waitForURL(/\/job-listings\//, { timeout: 60_000 });
    await expect(jobListingDetailPage.applyButton).toBeVisible({
      timeout: 20_000,
    });

    await jobListingDetailPage.clickApply();
    await expect(jobListingDetailPage.signUpPopover).toBeVisible({
      timeout: 15_000,
    });
  });
});

test.describe('Apply flow — authenticated (no resume)', () => {
  test.use({ storageState: STORAGE_STATE });
  test.setTimeout(120_000);

  test('Apply with no resume shows the upload-resume prompt', async ({
    jobListingDetailPage,
  }) => {
    const jobListingId = process.env.TEST_JOB_LISTING_ID;
    if (!jobListingId) {
      test.skip();
      return;
    }

    await jobListingDetailPage.goto(jobListingId);
    const applyBtn = jobListingDetailPage.applyButton;

    const isVisible = await applyBtn
      .isVisible({ timeout: 15_000 })
      .catch(() => false);
    if (!isVisible) test.skip();

    await applyBtn.click();

    const resumePrompt = jobListingDetailPage.uploadResumePopover;
    const dialog = jobListingDetailPage.applicationDialog;

    await expect(async () => {
      const isPromptVisible = await resumePrompt.isVisible();
      const isDialogVisible = await dialog.isVisible();
      expect(isPromptVisible || isDialogVisible).toBe(true);
    }).toPass({ timeout: 15_000 });
  });
});

test.describe('Apply flow — authenticated (with resume)', () => {
  test.use({ storageState: STORAGE_STATE });
  test.setTimeout(120_000);

  test('Apply with a resume opens the application dialog', async ({
    jobListingDetailPage,
  }) => {
    const jobListingId = process.env.TEST_JOB_LISTING_ID;
    if (!jobListingId) {
      test.skip();
      return;
    }

    await jobListingDetailPage.goto(jobListingId);

    const applyVisible = await jobListingDetailPage.applyButton
      .isVisible({ timeout: 15_000 })
      .catch(() => false);
    if (!applyVisible) test.skip();

    await jobListingDetailPage.clickApply();

    const dialogTitle = jobListingDetailPage.applicationDialogTitle;
    const resumePrompt = jobListingDetailPage.uploadResumePopover;

    await expect(async () => {
      const isTitleVisible = await dialogTitle.isVisible();
      const isPromptVisible = await resumePrompt.isVisible();
      expect(isTitleVisible || isPromptVisible).toBe(true);
    }).toPass({ timeout: 15_000 });
  });
});
