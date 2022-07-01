// Very simple plugin that disables resolution of the `exports` field
// for framer-motion

module.exports = function withFramerMotionEsmodulesDisabled() {
  return function withFramerMotionEsmodulesDisabledInternal(nextConfig = {}) {
    return Object.assign({}, nextConfig, {
      webpack(config, options) {
        config.module.rules.push({
          test: /framer-motion|react-motion-config/,
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
