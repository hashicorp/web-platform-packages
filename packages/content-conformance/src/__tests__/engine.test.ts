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

    expect(engine.__contentFiles).toHaveLength(2)
    expect(
      engine.__contentFiles.map((file) => file.path?.replace(opts.root, ''))
    ).toMatchInlineSnapshot(`
      [
        "content/index.mdx",
        "content/nested/nested.mdx",
      ]
    `)
  })

  test('it executes rules', async () => {
    const opts = {
      root: getFixturePath('basic-with-content-files'),
      contentFileGlobPattern: 'content/**/*.mdx',
      rules: [],
    }

    const engine = new ContentConformanceEngine(opts)

    engine.__addRule({
      type: 'content',
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
    })

    await engine.execute()

    // @ts-expect-error -- conflicting versions of vfile are being pulled in
    expect(report(engine.__contentFiles, { color: false }))
      .toMatchInlineSnapshot(`
      "content/index.mdx
        1:1-1:8  warning  Level 1 headings are not allowed  no-h1

      content/nested/nested.mdx
        1:1-1:9  warning  Level 1 headings are not allowed  no-h1

      ⚠ 2 warnings"
    `)
  })
})
