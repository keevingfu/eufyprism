import { test, expect } from '@playwright/test';

test.describe('GEM Growth Engine', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002');
  });

  test('should load campaigns page', async ({ page }) => {
    await page.goto('http://localhost:3002/campaigns');
    await expect(page).toHaveTitle(/GEM/);
    await expect(page.locator('text=营销活动管理')).toBeVisible();
  });

  test('should open campaign creation modal', async ({ page }) => {
    await page.goto('http://localhost:3002/campaigns');
    await page.click('button:has-text("新建活动")');
    await expect(page.locator('text=创建新活动')).toBeVisible();
  });

  test('should display conversion funnel', async ({ page }) => {
    await page.goto('http://localhost:3002/campaigns');
    await expect(page.locator('text=转化漏斗')).toBeVisible();
    await expect(page.locator('[data-testid="funnel-chart"]')).toBeVisible();
  });

  test('should display A/B test results', async ({ page }) => {
    await page.goto('http://localhost:3002/campaigns');
    await expect(page.locator('text=A/B测试')).toBeVisible();
  });

  test('should filter campaigns', async ({ page }) => {
    await page.goto('http://localhost:3002/campaigns');
    await page.selectOption('select[data-testid="campaign-filter"]', 'active');
    await expect(page.locator('[data-testid="campaign-list"]')).toBeVisible();
  });
});