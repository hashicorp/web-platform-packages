module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
  testPathIgnorePatterns: [
    '<rootDir>/packages/.*/__tests__/fixtures/.*.js',
    '<rootDir>/packages/.*/__tests__/__fixtures__/.*',
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/packages/cli/__tests__/fixtures/prettier.js',
  ],
}
