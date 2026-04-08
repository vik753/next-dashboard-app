import { test } from '@playwright/test';
import { AUTH_STATE_PATH } from './fixtures/auth';

/** One-time setup: logs in and saves browser storage state for all E2E tests */
test('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(process.env.E2E_EMAIL ?? 'user@nextmail.com');
  await page.getByLabel('Password').fill(process.env.E2E_PASSWORD ?? '123456');
  await page.getByRole('button', { name: /log in/i }).click();
  await page.waitForURL('/dashboard');
  await page.context().storageState({ path: AUTH_STATE_PATH });
});

