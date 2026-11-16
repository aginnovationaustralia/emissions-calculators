module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  moduleNameMapper: {
    // veerg-calculators' CommonJS build requires calculator-units and calculator-inputs, which are
    // ESM only. Jest can't require ESM in CommonJS mode (Node itself can), so point at their
    // TypeScript source instead. Their source imports siblings with `.js` extensions.
    '^@aginnovationaustralia/(calculator-units|calculator-inputs)$':
      '<rootDir>/../$1/src/index.ts',
    '^@aginnovationaustralia/(calculator-units|calculator-inputs)/(.*)$':
      '<rootDir>/../$1/src/$2',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
