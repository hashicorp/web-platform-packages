import report from 'vfile-reporter'
import { ContentConformanceEngine } from '../engine'
import { getFixturePath } from '../test/utils'

describe('ContentConformanceEngine', () => {
  test('it loads content files based on the provided glob', async () => {
    const opts = {
      root: getFixturePath('basic-with-content-files'),
      contentFileGlobPattern: 'content/**/*.mdx',
      rules: [],
    }

    const engine = new ContentConformanceEngine(opts)

    await engine.loadContentFiles()

    expect(engine.files).toHaveLength(3)
    expect(engine.files.map((file) => file.path?.replace(opts.root, '')))
      .toMatchInlineSnapshot(`
      [
        "content/index.mdx",
        "content/no-h1.mdx",
        "content/nested/nested.mdx",
      ]
    `)
  })

  test('it loads data files based on the provided glob', async () => {
    const opts = {
      root: getFixturePath('basic-with-content-files'),
      contentFileGlobPattern: 'content/**/*.mdx',
      dataFileGlobPattern: 'data/**/*.{json,yaml}',
      rules: [],
    }

    const engine = new ContentConformanceEngine(opts)

    await engine.loadDataFiles()

    expect(engine.files).toHaveLength(2)
    expect(engine.files.map((file) => file.path?.replace(opts.root, '')))
      .toMatchInlineSnapshot(`
      [
        "data/nav-data.json",
        "data/nav-data.yaml",
      ]
    `)
  })

  test('it executes rules', async () => {
    const opts = {
      root: getFixturePath('basic-with-content-files'),
      contentFileGlobPattern: 'content/**/*.mdx',
      rules: [
        {
          level: 'warn' as const,
          type: 'content' as const,
          id: 'no-h1',
          description: 'Do not allow use of level 1 headings',
          executor: {
            async contentFile(file, context) {
              file.visit(['heading'], (node) => {
                if (node.depth === 1) {
                  context.report('Level 1 headings are not allowed', file, node)
                }
              })
            },
          },
        },
      ],
    }

    const engine = new ContentConformanceEngine(opts)

    await engine.execute()

    // @ts-expect-error -- conflicting versions of vfile are being pulled in
    expect(report(engine.files, { color: false })).toMatchInlineSnapshot(`
      "content/index.mdx
        1:1-1:8  warning  Level 1 headings are not allowed  no-h1

      content/no-h1.mdx: no issues found
      content/nested/nested.mdx
        1:1-1:9  warning  Level 1 headings are not allowed  no-h1

      ⚠ 2 warnings"
    `)
  })
})
