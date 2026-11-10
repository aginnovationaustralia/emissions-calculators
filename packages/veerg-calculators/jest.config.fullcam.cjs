const baseConfig = require('./jest.config.cjs');

module.exports = {
  ...baseConfig,
  testMatch: ['**/fullcam/test/scenarios/**/*.test.ts'],
  testPathIgnorePatterns: [],
  testTimeout: 600_000,
};
