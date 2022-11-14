const makeConfig = require('./packages/configs/jest/config')

const isRunningInEsmMode = !!process.env.TEST_ESM

/**
 * These packages are authored using native ESModules, and so we want to configure jest differently to handle that
 *
 * TODO: determine this from "type": "module" in package.json
 */
const ESM_PACKAGES = ['content-conformance', 'remark-plugins']

/**
 * Override the base next jest-transformer to force it into ESM mode
 */
const esmConfig = {
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': [
      require.resolve('next/dist/build/swc/jest-transformer.js'),
      {
        isEsmProject: true,
      },
    ],
  },
}

/**
 * Exclude ESM-native packages from running when not in ESM mode
 */
const ignorePatternForModuleType = isRunningInEsmMode
  ? `<rootDir>/packages/(?!${ESM_PACKAGES.join('|')}).*/.*`
  : `<rootDir>/packages/(${ESM_PACKAGES.join('|')})/.*`

module.exports = makeConfig({
  testEnvironment: 'node',
  verbose: true,
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
})
