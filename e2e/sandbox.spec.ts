import { test, expect } from '@playwright/test';

test.describe('Sandbox Decision Simulator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3004');
  });

  test('should load simulator page', async ({ page }) => {
    await page.goto('http://localhost:3004/simulator');
    await expect(page).toHaveTitle(/Sandbox/);
    await expect(page.locator('text=决策模拟器')).toBeVisible();
  });

  test('should display scenarios', async ({ page }) => {
    await page.goto('http://localhost:3004/scenarios');
    await expect(page.locator('text=场景分析')).toBeVisible();
    await expect(page.locator('[data-testid="scenario-list"]')).toBeVisible();
  });

  test('should show sensitivity analysis', async ({ page }) => {
    await page.goto('http://localhost:3004/scenarios');
    await expect(page.locator('text=敏感性分析')).toBeVisible();
    await expect(page.locator('[data-testid="sensitivity-chart"]')).toBeVisible();
  });

  test('should load visualizer', async ({ page }) => {
    await page.goto('http://localhost:3004/visualizer');
    await expect(page.locator('text=数据可视化')).toBeVisible();
    await expect(page.locator('[data-testid="3d-viz"]')).toBeVisible();
  });

  test('should switch between views', async ({ page }) => {
    await page.goto('http://localhost:3004/simulator');
    await page.click('button:has-text("3D视图")');
    await expect(page.locator('[data-testid="3d-view"]')).toBeVisible();
    
    await page.click('button:has-text("表格视图")');
    await expect(page.locator('[data-testid="table-view"]')).toBeVisible();
  });
});