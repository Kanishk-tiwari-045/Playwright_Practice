import { test, expect, Page } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('Produktiv Signin Test Suite', () => {
  test('Signin to Produktiv Application and Connect OneDrive', async ({ page }) => {
    // Check if credentials are set
    if (!process.env.PROD_EMAIL || !process.env.PROD_PASSWORD) {
      throw new Error('PROD_EMAIL and PROD_PASSWORD environment variables must be set');
    }

    const email = process.env.PROD_EMAIL!;
    const password = process.env.PROD_PASSWORD!;

    // Navigate to the Produktiv signin page
    await page.goto('https://dev.produktiv.ai/login');
    await page.waitForLoadState('networkidle');

    // Verify the signin page elements
    await expect(page.getByText('produktiv.ai')).toBeVisible();
    await expect(page.getByText('Please sign in to continue')).toBeVisible();

    // Click on the "Sign in with Microsoft" button
    await page.getByRole('button', { name: 'Sign in with Microsoft' }).click();

    // Wait for navigation to Microsoft OAuth
    await page.waitForURL(/login\.microsoftonline\.com/);
    await page.waitForLoadState('networkidle');

    // Microsoft Sign-In Flow
    await handleMicrosoftSignIn(page, email, password);

    // Wait for redirect back to Produktiv dashboard
    await page.waitForURL(/dev\.produktiv\.ai\/dashboard/);

    // Verify dashboard
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Click on "Data Connectors" card
    await page.getByText('Data Connectors').click();

    // Wait for connect page
    await page.waitForURL(/dev\.produktiv\.ai\/connect/);
    // Verify the page title
    await expect(page.getByRole('heading', { name: 'Data Sources' })).toBeVisible();
    // Type in search bar
    await page.getByPlaceholder('Search connectors...').fill('Microsoft OneDrive');

    // Find and click the "Microsoft OneDrive" card
    await page.locator('div.cursor-pointer').filter({ hasText: 'Microsoft OneDrive' }).click();

    // @ts-ignore
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Click "Continue to Authentication"
    await page.getByRole('button', { name: 'Continue to Authentication' }).click();

    // Click "Connect with OneDrive ->"
    await page.getByRole('button', { name: 'Connect with OneDrive' }).click();

    // Verify connection or wait for success
    await page.waitForURL(/dev\.produktiv\.ai\/connect/);
    // Add assertion for successful connection if possible
  });
});

async function handleMicrosoftSignIn(page: Page, email: string, password: string) {
  // Fill email
  await page.getByPlaceholder('Email or Phone').fill(email);
  await page.getByRole('button', { name: 'Next' }).click();

  // Fill password
  await page.getByPlaceholder('Password').waitFor({ state: 'visible' });
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Check "Don't ask again" and click "Yes"
  await page.getByRole('checkbox', { name: "Don't show this again" }).check();
  await page.getByRole('button', { name: 'Yes' }).click();
}