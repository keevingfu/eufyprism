import { test, expect } from '@playwright/test';

test.describe('Intelligence System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3010');
  });

  test('should load dashboard', async ({ page }) => {
    await expect(page).toHaveTitle(/Intelligence/);
    await expect(page.locator('h1').first()).toContainText('Intelligence Dashboard');
  });

  test('should display competitor analysis', async ({ page }) => {
    await page.goto('http://localhost:3010/dashboard');
    await expect(page.locator('text=竞争对手分析')).toBeVisible();
    await expect(page.locator('[data-testid="competitor-chart"]')).toBeVisible();
  });

  test('should display market opportunities', async ({ page }) => {
    await page.goto('http://localhost:3010/dashboard');
    await expect(page.locator('text=市场机会')).toBeVisible();
    await expect(page.locator('[data-testid="opportunity-list"]')).toBeVisible();
  });

  test('should display real-time alerts', async ({ page }) => {
    await page.goto('http://localhost:3010/dashboard');
    await expect(page.locator('text=实时告警')).toBeVisible();
    await expect(page.locator('[data-testid="alert-list"]')).toBeVisible();
  });

  test('API should respond', async ({ request }) => {
    const response = await request.get('http://localhost:3010/api/intelligence/opportunities');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });
});