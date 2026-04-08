import { test as base, expect, type Page } from '@playwright/test';
import path from 'path';

/** Path where authenticated browser storage state is saved */
export const AUTH_STATE_PATH = path.join(__dirname, '../../e2e/.auth/user.json');

/** Fixture that provides a pre-authenticated page.
 *  Run `pnpm e2e:setup` once to generate the auth state file.
 */
export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: AUTH_STATE_PATH,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect };

