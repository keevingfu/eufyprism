module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/apps/*/tests/**/*.test.js',
    '<rootDir>/services/*/tests/**/*.test.js'
  ],
  collectCoverageFrom: [
    'apps/**/*.{js,ts,tsx}',
    'services/**/*.{js,ts}',
    'packages/**/*.{js,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/dist/**'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  verbose: true
};