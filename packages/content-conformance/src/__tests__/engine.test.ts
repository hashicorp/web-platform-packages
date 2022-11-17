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

    expect(engine.files).toHaveLength(4)
    expect(engine.files.map((file) => file.path?.replace(opts.root, '')))
      .toMatchInlineSnapshot(`
      [
        "content/has-frontmatter.mdx",
        "content/index.mdx",
        "content/no-h1.mdx",
        "content/nested/nested.mdx",
      ]
    `)
  })

  test('it executes rules', async () => {
    const opts = {
      root: getFixturePath('basic-with-content-files'),
      contentFileGlobPattern: 'content/**/*.mdx',
      rules: [
        {
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
        {
          type: 'content' as const,
          id: 'required-frontmatter-fields',
          description: 'Must have required frontmatter fields',
          executor: {
            async contentFile(file, context) {
              if (!('title' in file.frontmatter())) {
                context.report('A "title" frontmatter field is required', file)
              }
            },
          },
        },
      ],
    }

    const engine = new ContentConformanceEngine(opts)

    await engine.execute()

    // @ts-expect-error -- conflicting versions of vfile are being pulled in
    expect(report(engine.files, { color: false })).toMatchInlineSnapshot(`
      "content/has-frontmatter.mdx: no issues found
      content/index.mdx
            1:1  warning  A "title" frontmatter field is required  required-frontmatter-fields
        1:1-1:8  warning  Level 1 headings are not allowed         no-h1

      content/no-h1.mdx
            1:1  warning  A "title" frontmatter field is required  required-frontmatter-fields

      content/nested/nested.mdx
            1:1  warning  A "title" frontmatter field is required  required-frontmatter-fields
        1:1-1:9  warning  Level 1 headings are not allowed         no-h1

      ⚠ 5 warnings"
    `)
  })
})
