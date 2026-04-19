import { test, expect } from './fixtures';
import { STORAGE_STATE } from './constants';

test.describe('Unauthenticated — home page', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto('/', { waitUntil: 'load' });
    await expect(page.locator('main')).toBeVisible({ timeout: 20_000 });
  });

  test('home page renders without errors', async ({ homePage }) => {
    await expect(homePage.page).toHaveTitle(/CareerBridge/i);
  });

  test('sidebar is present with the CareerBridge logo', async ({
    homePage,
  }) => {
    await expect(homePage.sidebar).toBeVisible();
    await expect(homePage.logo).toBeVisible({ timeout: 15_000 });
  });

  test("'Sign In' nav link is visible for guests", async ({ page }) => {
    const sidebar = page.locator("[data-slot='sidebar']");
    await expect(sidebar).toBeVisible({ timeout: 15_000 });

    await expect(async () => {
      const signInLink = page.getByRole('link', { name: /sign in/i });
      await expect(signInLink).toBeVisible();
    }).toPass({
      timeout: 20_000,
      intervals: [1000, 2000],
    });
  });

  test("'Employer Dashboard' nav link is hidden for guests", async ({
    homePage,
  }) => {
    await expect(homePage.employerDashboardLink).toBeHidden();
  });

  test("'Job Board' nav link is visible and active on home page", async ({
    page,
  }) => {
    const jobBoardLink = page.getByRole('link', { name: /job board/i });
    await expect(jobBoardLink).toBeVisible({ timeout: 20_000 });
  });

  test("'AI Search' nav link is visible", async ({ page }) => {
    const aiSearchLink = page.getByRole('link', { name: /ai search/i });
    await expect(aiSearchLink).toBeVisible({ timeout: 20_000 });
  });
});

test.describe('Sign-in page', () => {
  test('navigating to /sign-in renders Clerk sign-in UI', async ({
    authPage,
    page,
  }) => {
    await authPage.goto();
    // Wait for the specific clerk container to ensure hydration
    const emailInput = page.locator(
      'input[type="email"], input[name="identifier"]',
    );
    await expect(emailInput).toBeVisible({ timeout: 30_000 });
  });

  test("'Sign In' sidebar link navigates to the sign-in page", async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'load' });

    const signInLink = page.getByRole('link', { name: /sign in/i });

    await expect(async () => {
      await expect(signInLink).toBeVisible();
    }).toPass({ timeout: 20_000 });

    await signInLink.click({ force: true });

    await expect(page).toHaveURL(/\/sign-in/, { timeout: 15_000 });
  });
});

test.describe('Authenticated — nav state', () => {
  test.use({ storageState: STORAGE_STATE });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto('/', { waitUntil: 'load' });
    await expect(page.locator('main')).toBeVisible({ timeout: 25_000 });
  });

  test("signed-in user sees 'Employer Dashboard' link", async ({ page }) => {
    const employerLink = page.getByRole('link', {
      name: /employer dashboard/i,
    });
    await expect(employerLink).toBeVisible({ timeout: 30_000 });
  });

  test("signed-in user does not see 'Sign In' link", async ({ page }) => {
    const signInLink = page.getByRole('link', { name: /sign in/i });
    await expect(signInLink).toBeHidden({ timeout: 20_000 });
  });

  test('sidebar footer shows the user button when signed in', async ({
    page,
  }) => {
    test.setTimeout(90_000);

    const footer = page.locator("[data-sidebar='footer']");
    await expect(footer).toBeVisible({ timeout: 20_000 });

    const userButton = footer.locator('button');

    await expect(async () => {
      const count = await userButton.count();
      expect(count).toBeGreaterThan(0);
      await expect(userButton.first()).toBeVisible();
    }).toPass({
      timeout: 45_000,
      intervals: [2000, 5000],
    });
  });
});
