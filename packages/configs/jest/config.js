/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

const nextJest = require('next/jest')

module.exports = async ({ nextDir, ...customConfig }) => {
  customConfig = customConfig ?? {}

  customConfig.moduleNameMapper = {
    /* supports native esm node imports, which require the .js extension */
    '^(\\.{1,2}/.*)\\.js$': '$1',

    /* Mock graphql queries & fragments */
    '\\.graphql$': require.resolve('./__mocks__/graphql-fragment-mock.js'),

    /**
     * For .svg?include imports, remove the ?include suffix, so that it can be resolved and loaded with jest-raw-loader
     */
    '(.*)\\.svg\\?include$': '$1.svg',

    ...customConfig.moduleNameMapper,
  }

  customConfig.transform = {
    /* Load .svg imports as raw strings. Our mapping above means this only targets .svg?include imports. */
    '\\.svg$': 'jest-raw-loader',

    ...customConfig.transform,
  }

  const config = await nextJest({ dir: nextDir })(customConfig)()

  config.transformIgnorePatterns = config.transformIgnorePatterns.map(
    (pattern) => {
      if (pattern === '/node_modules/') {
        // ensure that @hashicorp/ and unist- packages get properly transformed
        return '/node_modules/(?!(@hashicorp/|unist-))'
      }

      return pattern
    }
  )

  return config
}
