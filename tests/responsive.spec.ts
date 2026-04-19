import { test, expect } from './fixtures';

test.describe('Desktop layout', () => {
  test.skip(({ isMobile }) => isMobile);
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main')).toBeVisible({ timeout: 20_000 });
  });

  test('sidebar is visible and expanded by default', async ({ homePage }) => {
    await expect(homePage.sidebar).toBeVisible();
    await expect(homePage.logo).toBeVisible();
  });

  test('sidebar trigger collapses the sidebar', async ({ homePage, page }) => {
    await page.waitForLoadState('domcontentloaded');
    await expect(homePage.logo).toBeVisible({ timeout: 10_000 });
    await homePage.sidebarTrigger.click();
    const sidebar = page.locator('[data-slot="sidebar"]');
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed', {
      timeout: 15_000,
    });
    await expect(homePage.logo).toBeHidden();
  });

  test('clicking trigger again re-expands the sidebar', async ({
    homePage,
    page,
  }) => {
    const sidebar = page.locator('[data-slot="sidebar"]');
    await homePage.sidebarTrigger.click();
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed', {
      timeout: 15_000,
    });
    await page.waitForTimeout(1000);
    await homePage.sidebarTrigger.click({ force: true });
    await expect(sidebar).toHaveAttribute('data-state', 'expanded', {
      timeout: 15_000,
    });
    await expect(homePage.logo).toBeVisible({ timeout: 10_000 });
  });

  test('main content is accessible when sidebar is collapsed', async ({
    homePage,
    page,
  }) => {
    const sidebar = page.locator('[data-slot="sidebar"]');

    // Ensure we are in a clean state before clicking
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');
    await homePage.sidebarTrigger.click();

    // Webkit specific: Wait for the attribute to toggle
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed', {
      timeout: 15_000,
    });

    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Use toPass to handle layout calculation delays in Webkit
    await expect(async () => {
      const box = await main.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(100);
    }).toPass();
  });

  test('nav links remain accessible on desktop', async ({ homePage, page }) => {
    const sidebar = page.locator('[data-slot="sidebar"]');

    await expect(sidebar).toHaveAttribute('data-state', 'expanded', {
      timeout: 15_000,
    });

    await expect(async () => {
      await expect(homePage.jobBoardLink).toBeVisible();
      await expect(homePage.aiSearchLink).toBeVisible();
    }).toPass({ timeout: 10_000 });
  });
});

test.describe('Mobile layout', () => {
  test.skip(
    ({ isMobile, viewport }) => !isMobile && (viewport?.width ?? 0) > 600,
  );
  test.use({ viewport: { width: 393, height: 851 } });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('button').first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test('sidebar is hidden by default on mobile', async ({ homePage }) => {
    await expect(homePage.sidebar).toBeHidden();
  });

  test('sidebar trigger button is visible on mobile', async ({ homePage }) => {
    await expect(homePage.sidebarTrigger).toBeVisible({ timeout: 15_000 });
  });

  test('tapping the trigger opens the sidebar', async ({ homePage, page }) => {
    await homePage.sidebarTrigger.click();
    const mobileSidebar = page.getByRole('dialog');
    await expect(mobileSidebar).toBeVisible({ timeout: 15_000 });
    await expect(homePage.jobBoardLink).toBeVisible({ timeout: 10_000 });
  });

  test('open sidebar contains navigation links', async ({ homePage, page }) => {
    await homePage.sidebarTrigger.click();
    const mobileSidebar = page.getByRole('dialog');
    await expect(mobileSidebar).toBeVisible({ timeout: 15_000 });
    await expect(homePage.jobBoardLink).toBeVisible({ timeout: 10_000 });
  });

  test('main content area has correct mobile width', async ({ page }) => {
    const main = page.locator('main');
    await expect(main).toBeVisible({ timeout: 15_000 });
    const box = await main.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(300);
  });
});
