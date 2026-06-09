import { test, expect } from './fixtures';

test.describe('Employer dashboard — unauthenticated', () => {
  test('visiting /employer redirects non-members away', async ({ page }) => {
    await page.goto('/employer', { waitUntil: 'commit' });
    await expect(page).toHaveURL(
      /\/sign-in|\/organizations\/select|\/sign-up/,
      { timeout: 15_000 },
    );
  });
});

// TODO: Employer authenticated tests
// These tests require proper Clerk session persistence via storageState.
// Currently blocked by Clerk testing SDK limitations with OAuth-only setup.
// Revisit once @clerk/testing improves localStorage/session handling.
//
// Skipped tests:
// - employer sidebar shows 'Job Listings' section
// - 'Add Job Listing' link navigates to the new-listing page
// - new listing form renders with a title input
// - submitting empty form shows validation errors
// - filling the title and saving creates a draft
