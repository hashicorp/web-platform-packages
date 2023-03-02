// Very simple plugin that loads external graphql files as strings.
// We use this in concert with the rivet data loading system.

module.exports = function withGraphQlBasic() {
  return function withGraphQlBasicInternal(nextConfig = {}) {
    return Object.assign({}, nextConfig, {
      webpack(config, options) {
        config.module.rules.push({
          test: /\.(graphql|gql)$/,
          // see: https://webpack.js.org/guides/asset-modules/
          type: 'asset/source',
        })

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }

        return config
      },
    })
  }
}
