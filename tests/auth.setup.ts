import { test as setup } from '@playwright/test';
import { clerkSetup } from '@clerk/testing/playwright';
import path from 'path';
import fs from 'fs';
import { STORAGE_STATE } from './constants';

setup('authenticate as job seeker', async ({ page }) => {
  setup.setTimeout(60_000);

  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true });
    fs.writeFileSync(
      STORAGE_STATE,
      JSON.stringify({ cookies: [], origins: [] }),
    );
    return;
  }

  await clerkSetup();

  await page.goto('/sign-in', { waitUntil: 'networkidle' });

  const emailInput = page.locator(
    'input[type="email"], input[name="identifier"]',
  );
  await emailInput.waitFor({ state: 'visible', timeout: 45_000 });
  await emailInput.fill(email);

  await page.getByRole('button', { name: /continue/i, exact: false }).click();

  const passwordInput = page
    .locator('input[type="password"], input[name="password"]')
    .first();
  await passwordInput.waitFor({ state: 'visible', timeout: 20_000 });
  await passwordInput.fill(password);

  await page.getByRole('button', { name: /continue/i, exact: false }).click();

  await page.waitForURL((url) => !url.pathname.startsWith('/sign-in'), {
    timeout: 30_000,
  });

  await page.context().storageState({ path: STORAGE_STATE });
});
