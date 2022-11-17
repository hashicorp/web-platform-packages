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
      "content/has-frontmatter.mdx: no issues found
      content/index.mdx
         1:1-1:8  warning  Level 1 headings are not allowed                     local-no-h1

      content/no-h1.mdx
        1:1-1:27  warning  Must have a level 1 heading at the top of the file.  must-have-h1

      content/nested/nested.mdx
         1:1-1:9  warning  Level 1 headings are not allowed                     local-no-h1

      ⚠ 3 warnings"
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
      "content/has-frontmatter.mdx: no issues found
      content/index.mdx: no issues found
      content/no-h1.mdx: no issues found
      content/nested/nested.mdx: no issues found"
    `)
  })
})
