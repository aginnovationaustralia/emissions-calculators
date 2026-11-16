module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  testPathIgnorePatterns: ['/fullcam/test/scenarios/'],
  setupFiles: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        useESM: false,
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!nanoclone)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // The calculator-units and calculator-inputs packages are ESM only, which Jest can't require
    // in CommonJS mode before Node 24.9. Point at their TypeScript source so ts-jest compiles them
    // with everything else. Their source imports siblings with `.js` extensions.
    '^@aginnovationaustralia/(calculator-units|calculator-inputs)$':
      '<rootDir>/../$1/src/index.ts',
    '^@aginnovationaustralia/(calculator-units|calculator-inputs)/(.*)$':
      '<rootDir>/../$1/src/$2',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
