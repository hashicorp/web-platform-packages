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
    expect(config.partialsDirectory).toEqual('content/partials')
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
