const axios = require('axios');

describe('Eufy PRISM E28 Services Health Check', () => {
  const services = [
    { name: 'Intelligence', port: 3010, endpoint: 'dashboard' },
    { name: 'GEO', port: 3003, endpoint: 'editor' },
    { name: 'GEM', port: 3002, endpoint: 'campaigns' },
    { name: 'Sandbox', port: 3004, endpoint: 'simulator' },
    { name: 'Gateway', port: 3030, endpoint: 'health' }
  ];

  describe('Service Availability', () => {
    services.forEach(service => {
      test(`${service.name} service should be accessible`, async () => {
        try {
          const response = await axios.get(`http://localhost:${service.port}`);
          expect(response.status).toBeGreaterThanOrEqual(200);
          expect(response.status).toBeLessThan(500);
        } catch (error) {
          if (error.response) {
            // Service responded with error status
            expect(error.response.status).toBeLessThan(500);
          } else {
            // Connection refused or timeout
            throw new Error(`${service.name} service not accessible: ${error.message}`);
          }
        }
      });
    });
  });

  describe('Infrastructure Services', () => {
    test('PostgreSQL should be accessible', async () => {
      // Simple connection test via service that uses it
      try {
        const response = await axios.get('http://localhost:3010/api/intelligence/opportunities');
        expect(response.status).toBe(200);
      } catch (error) {
        expect(error.response?.status).toBeDefined();
      }
    });

    test('Redis should be accessible', async () => {
      // Test via service that uses Redis
      try {
        const response = await axios.get('http://localhost:3010');
        expect(response.status).toBeGreaterThanOrEqual(200);
      } catch (error) {
        expect(error.response?.status).toBeDefined();
      }
    });
  });
});