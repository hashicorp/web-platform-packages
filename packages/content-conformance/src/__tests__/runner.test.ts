import { getFixturePath } from '../test/utils'
import { ContentConformanceRunner } from '../runner'

describe('ContentConformanceRunner', () => {
  test('init() loads config', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const runner = new ContentConformanceRunner({ cwd: fixturePath })

    await runner.init()

    expect(runner.config?.root).toContain('basic-with-content-files')
    expect(runner.config?.contentFileGlobPattern).toMatchInlineSnapshot(
      `"content/**/*.mdx"`
    )
  })

  test('init, run, report', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const runner = new ContentConformanceRunner({ cwd: fixturePath })

    await runner.init()

    await runner.run()

    expect(await runner.report()).toMatchInlineSnapshot(`
      "content/index.mdx
        1:1-1:8  warning  Level 1 headings are not allowed  local-no-h1

      content/nested/nested.mdx
        1:1-1:9  warning  Level 1 headings are not allowed  local-no-h1

      ⚠ 2 warnings"
    `)
  })

  test('accepts files filter', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const runner = new ContentConformanceRunner({
      cwd: fixturePath,
      files: ['content/index.mdx'],
    })

    await runner.init()

    await runner.run()

    expect(await runner.report()).toMatchInlineSnapshot(`
      "content/index.mdx
        1:1-1:8  warning  Level 1 headings are not allowed  local-no-h1

      ⚠ 1 warning"
    `)
  })

  test('accepts files filter - normalized paths', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const runner = new ContentConformanceRunner({
      cwd: fixturePath,
      files: ['./content/index.mdx'],
    })

    await runner.init()

    await runner.run()

    expect(await runner.report()).toMatchInlineSnapshot(`
      "content/index.mdx
        1:1-1:8  warning  Level 1 headings are not allowed  local-no-h1

      ⚠ 1 warning"
    `)
  })

  test('accepts custom config path', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const runner = new ContentConformanceRunner({
      cwd: fixturePath,
      config: './content-conformance-off.config.js',
    })

    await runner.init()

    await runner.run()

    expect(await runner.report()).toMatchInlineSnapshot(`
      "content/index.mdx: no issues found
      content/nested/nested.mdx: no issues found"
    `)
  })
})
