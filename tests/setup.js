// Test Environment Setup
// global.fetch = require('node-fetch'); // Commented out due to ES module issues

// Mock console methods in test environment
if (process.env.NODE_ENV === 'test') {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
}

// Global test configuration
jest.setTimeout(30000);