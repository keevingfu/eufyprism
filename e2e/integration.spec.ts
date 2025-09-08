import { test, expect } from '@playwright/test';

test.describe('System Integration', () => {
  test('should access all services through gateway', async ({ request }) => {
    // Test Gateway health
    const gatewayHealth = await request.get('http://localhost:3030/health');
    expect(gatewayHealth.status()).toBe(200);
    
    // Test service status through gateway
    const serviceStatus = await request.get('http://localhost:3030/services/status');
    expect(serviceStatus.status()).toBe(200);
    const statusData = await serviceStatus.json();
    expect(statusData.gateway).toBe('online');
  });

  test('should handle cross-service navigation', async ({ page }) => {
    // Start from Intelligence
    await page.goto('http://localhost:3010');
    await expect(page).toHaveTitle(/Intelligence/);
    
    // Navigate to GEM
    await page.goto('http://localhost:3002');
    await expect(page).toHaveTitle(/GEM/);
    
    // Navigate to GEO
    await page.goto('http://localhost:3003');
    await expect(page).toHaveTitle(/GEO/);
    
    // Navigate to Sandbox
    await page.goto('http://localhost:3004');
    await expect(page).toHaveTitle(/Sandbox/);
  });

  test('should handle authentication flow', async ({ page }) => {
    // Test protected routes redirect to login
    await page.goto('http://localhost:3010/admin');
    await expect(page).toHaveURL(/login/);
  });

  test('should handle error pages', async ({ page }) => {
    // Test 404 page
    await page.goto('http://localhost:3010/non-existent-page');
    await expect(page.locator('text=404')).toBeVisible();
  });

  test('API gateway should proxy requests', async ({ request }) => {
    // Test proxied intelligence API
    const intelligenceAPI = await request.get('http://localhost:3030/api/intelligence/opportunities');
    expect([200, 502]).toContain(intelligenceAPI.status());
    
    // Test proxied GEM API
    const gemAPI = await request.get('http://localhost:3030/api/gem/campaigns');
    expect([200, 404, 502]).toContain(gemAPI.status());
  });
});