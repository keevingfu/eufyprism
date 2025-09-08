import { test, expect } from '@playwright/test';

test.describe('GEO Content Engine', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3003');
  });

  test('should load editor page', async ({ page }) => {
    await page.goto('http://localhost:3003/editor');
    await expect(page).toHaveTitle(/GEO/);
    await expect(page.locator('text=内容编辑器')).toBeVisible();
  });

  test('should display content types', async ({ page }) => {
    await page.goto('http://localhost:3003/editor');
    await expect(page.locator('text=文章')).toBeVisible();
    await expect(page.locator('text=产品页面')).toBeVisible();
    await expect(page.locator('text=登陆页')).toBeVisible();
  });

  test('should show map view', async ({ page }) => {
    await page.goto('http://localhost:3003/editor');
    await page.click('button:has-text("地图视图")');
    await expect(page.locator('[data-testid="geo-map"]')).toBeVisible();
  });

  test('should filter by region', async ({ page }) => {
    await page.goto('http://localhost:3003/editor');
    await page.selectOption('select[data-testid="region-filter"]', 'asia');
    await expect(page.locator('[data-testid="content-list"]')).toBeVisible();
  });

  test('should open content editor', async ({ page }) => {
    await page.goto('http://localhost:3003/editor');
    await page.click('button:has-text("新建内容")');
    await expect(page.locator('[data-testid="content-editor"]')).toBeVisible();
  });
});