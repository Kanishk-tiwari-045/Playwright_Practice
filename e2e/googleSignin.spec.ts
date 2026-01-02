import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('Search Introduction', async ({ page }) => {
  // Check if credentials are set
  if (!process.env.GOOGLE_EMAIL || !process.env.GOOGLE_PASSWORD) {
    throw new Error('GOOGLE_EMAIL and GOOGLE_PASSWORD environment variables must be set');
  }

  // Now perform the search
  await page.goto('https://www.google.com/', { waitUntil: 'networkidle' });
  
  // Locate the search input field and type the search query
  const searchBox = page.getByRole('combobox', { name: 'Search' });
  await searchBox.fill('Playwright official documentation');
  
  // Press Enter to perform the search
  await searchBox.press('Enter');
  
  // Wait for navigation to search results
  await page.waitForURL(/search\?q=/, { timeout: 15000 });
  
  // Verify that relevant search results are displayed (stable locator for official Playwright docs)
  await expect(page.locator('a[href*="playwright.dev"]').first()).toBeVisible({ timeout: 20000 });
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
