const {
  isModuleInstalled,
  detectLoaders,
  getHandledImageTypes,
  getNumOptimizationLoadersInstalled,
  appendLoaders,
} = require('../../lib/loaders')
const { getConfig } = require('../../lib/config')

module.exports = () => () => ({ plugin: true })

describe('next-optimized-images/loaders', () => {
  it('detects if a module is installed', () => {
    expect(isModuleInstalled('path')).toEqual(true)
    expect(isModuleInstalled('pathalksdfjladksfj')).toEqual(false)
    expect(isModuleInstalled('img-loader.test.js')).toEqual(false)
    expect(isModuleInstalled('img-loader.test.js', __dirname)).toEqual(true)
  })

  it('detects installed loaders', () => {
    expect(detectLoaders()).toEqual({
      jpeg: 'imagemin-mozjpeg', // installed in monorepo
      gif: false,
      svg: 'imagemin-svgo', // installed in monorepo
      svgSprite: 'svg-sprite-loader', // is in the devDependencies
      webp: false,
      png: 'imagemin-optipng', // installed in monorepo
      lqip: false,
      responsive: false,
      responsiveAdapter: false,
    })
  })

  it('returns the handled image types', () => {
    expect(getHandledImageTypes(getConfig({}))).toEqual({
      jpeg: true,
      png: true,
      svg: true,
      webp: true,
      gif: true,
      ico: false,
    })

    expect(
      getHandledImageTypes(getConfig({ handleImages: ['jpg', 'png', 'ico'] }))
    ).toEqual({
      jpeg: true,
      png: true,
      svg: false,
      webp: false,
      gif: false,
      ico: true,
    })

    expect(getHandledImageTypes(getConfig({ handleImages: [] }))).toEqual({
      jpeg: false,
      png: false,
      svg: false,
      webp: false,
      gif: false,
      ico: false,
    })
  })

  it('counts the number of optimization loaders', () => {
    expect(
      getNumOptimizationLoadersInstalled({
        jpeg: 'imagemin-jpeg',
        png: 'imagemin-png',
        svgSprite: 'svg-sprite-loader',
      })
    ).toEqual(2)
  })

  it('appends loaders to the webpack config', () => {
    const webpackConfig = { module: { rules: [] } }

    appendLoaders(
      webpackConfig,
      getConfig({}),
      {
        jpeg: __filename,
        webp: __filename,
      },
      false,
      true
    )

    expect(webpackConfig.module.rules).toHaveLength(2)
  })
})
