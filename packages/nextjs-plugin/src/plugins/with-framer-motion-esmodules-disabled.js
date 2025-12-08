/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// Very simple plugin that disables resolution of the `exports` field
// for framer-motion

module.exports = function withFramerMotionEsmodulesDisabled() {
  return function withFramerMotionEsmodulesDisabledInternal(nextConfig = {}) {
    return Object.assign({}, nextConfig, {
      webpack(config, options) {
        config.module.rules.push({
          test: /framer-motion|motion-config/,
          resolve: {
            exportsFields: [],
          },
        })

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }

        return config
      },
    })
  }
}
