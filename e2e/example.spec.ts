import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('Search Introduction', async ({ page }) => {
  await page.goto('https://www.bing.com/', { waitUntil: 'networkidle' });
  
  // Locate the search input field and type the search query
  const searchBox = page.locator('textarea[name="q"], input[name="q"]').first();
  await searchBox.waitFor({ state: 'visible', timeout: 10000 });
  await searchBox.fill('Playwright introduction');
  
  // Press Enter to perform the search
  await searchBox.press('Enter');
  
  // Wait for navigation to search results
  await page.waitForURL(/search\?q=/, { timeout: 15000 });
  
  // Verify that relevant search results are displayed
  await expect(page.locator('.b_algo h2, .b_title h2, h2 a').first()).toContainText('Playwright', { timeout: 20000 });
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
