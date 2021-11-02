module.exports = function cssPluginMock(options) {
  return function cssPluginMockInternal(nextConfig = {}) {
    return Object.assign({}, nextConfig, {
      __cssPluginOptions: options,
    })
  }
}
