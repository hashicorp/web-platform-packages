/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

module.exports = function withGraphQl() {
  return function withGraphQlInternal(nextConfig = {}) {
    return Object.assign({}, nextConfig, {
      webpack(config, options) {
        config.module.rules.push({
          test: /\.(graphql|gql)$/,
          loader: 'graphql-tag/loader',
        })

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }

        return config
      },
    })
  }
}
