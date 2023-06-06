import { getFixturePath } from '../test/utils'

import { loadConfig } from '../config'

describe('loadConfig', () => {
  test('it loads a config file', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const config = await loadConfig({
      cwd: fixturePath,
    })

    expect(config.root).toEqual(fixturePath)
    expect(config.contentFileGlobPattern).toEqual('content/**/*.mdx')
    expect(config.rules).toMatchInlineSnapshot(`
      {
        "./rules/local-no-h1": "error",
        "./rules/must-have-h1": "error",
      }
    `)
    expect(config.partialsDirectories).toEqual([
      'content/partials',
      'docs/partials',
    ])
  })

  test('it loads config presets', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const config = await loadConfig({
      cwd: fixturePath,
      pathToConfigOrPresetName: 'base-mdx',
    })

    expect(config.contentFileGlobPattern).toEqual('content/**/*.mdx')
  })

  test('it loads config presets - multiple levels', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const config = await loadConfig({
      cwd: fixturePath,
      pathToConfigOrPresetName: 'base-docs',
    })

    expect(config.contentFileGlobPattern).toEqual('{content,docs}/**/*.mdx')
  })

  test('it loads config presets - via "preset"', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const config = await loadConfig({
      cwd: fixturePath,
      pathToConfigOrPresetName: 'content-conformance-preset.config.js',
    })

    const configPreset = await loadConfig({
      cwd: fixturePath,
      pathToConfigOrPresetName: 'base-mdx',
    })

    expect(config).toMatchObject(configPreset)
  })

  test('it loads config presets without a local config file', async () => {
    const fixturePath = getFixturePath('no-config-file')

    const config = await loadConfig({
      cwd: fixturePath,
      pathToConfigOrPresetName: 'base-mdx',
    })

    expect(config.contentFileGlobPattern).toEqual('content/**/*.mdx')
  })

  test('throws when invalid preset is specified', async () => {
    const fixturePath = getFixturePath('invalid-config')

    await expect(
      loadConfig({
        cwd: fixturePath,
        pathToConfigOrPresetName:
          'content-conformance-invalid-preset.config.js',
      })
    ).rejects.toThrowError('error loading preset')
  })

  test('throws when no config file is found', async () => {
    const fixturePath = getFixturePath('no-config-file')

    await expect(
      loadConfig({
        cwd: fixturePath,
      })
    ).rejects.toThrowError('Config file not found')
  })

  test('throws when an invalid config file is found', async () => {
    const fixturePath = getFixturePath('invalid-config')

    await expect(
      loadConfig({
        cwd: fixturePath,
      })
    ).rejects.toThrowError()
  })
})
