module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  verbose: true,
  globals: {
    'ts-jest': {
      useESM: true,
      diagnostics: {
        warnOnly: true,
      },
    },
  },
  testPathIgnorePatterns: ['<rootDir>/packages/.*/__tests__/fixtures/.*.js'],
  watchPathIgnorePatterns: [
    '<rootDir>/packages/cli/__tests__/fixtures/prettier.js',
  ],
}
