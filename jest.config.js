const isRunningInEsmMode = !!process.env.TEST_ESM

/**
 * These packages are authored using native ESModules, and so we want to configure jest differently to handle that
 *
 * TODO: determine this from "type": "module" in package.json
 */
const ESM_PACKAGES = ['content-conformance', 'remark-plugins']

const esmConfig = {
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(t)sx?$': ['@swc/jest', { module: { type: 'es6' } }],
  },
}

/**
 * Exclude ESM-native packages from running when not in ESM mode
 */
const ignorePatternForModuleType = isRunningInEsmMode
  ? `<rootDir>/packages/(?!${ESM_PACKAGES.join('|')}).*/.*`
  : `<rootDir>/packages/(${ESM_PACKAGES.join('|')})/.*`

module.exports = {
  testEnvironment: 'node',
  verbose: true,
  transform: {
    '^.+\\.(j|t)sx?$': ['@swc/jest'],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transformIgnorePatterns: [
    '<rootDir>/packages/.*/__tests__/__fixtures__/.*',
    '<rootDir>/packages/.*/__tests__/fixtures/.*.js',
  ],
  testPathIgnorePatterns: [
    ignorePatternForModuleType,
    '<rootDir>/packages/.*/__tests__/fixtures/.*.js',
    '<rootDir>/packages/.*/__tests__/__fixtures__/.*',
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/packages/cli/__tests__/fixtures/prettier.js',
  ],
  ...(isRunningInEsmMode && esmConfig),
}
