import { test as setup } from '@playwright/test';
import { clerkSetup } from '@clerk/testing/playwright';
import path from 'path';
import fs from 'fs';
import { STORAGE_STATE } from './constants';

setup('authenticate as job seeker', async ({ page }) => {
  setup.setTimeout(60_000);

  await clerkSetup({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  // Navigate to app to ensure session is loaded
  await page.goto('http://localhost:3000/', { waitUntil: 'load' });

  // Save auth state for other tests
  fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true });
  await page.context().storageState({ path: STORAGE_STATE });
});
