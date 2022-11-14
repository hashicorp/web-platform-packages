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
