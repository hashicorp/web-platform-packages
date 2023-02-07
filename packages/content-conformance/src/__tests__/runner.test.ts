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
      "content/has-frontmatter.mdx
        12:1-12:11  error  Level 1 headings are not allowed                     local-no-h1

      content/index.mdx
           1:1-1:8  error  Level 1 headings are not allowed                     local-no-h1

      content/no-h1.mdx
          1:1-1:27  error  Must have a level 1 heading at the top of the file.  must-have-h1

      content/nested/nested.mdx
           1:1-1:9  error  Level 1 headings are not allowed                     local-no-h1

      ✖ 4 errors"
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
        1:1-1:8  error  Level 1 headings are not allowed  local-no-h1

      ✖ 1 error"
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
        1:1-1:8  error  Level 1 headings are not allowed  local-no-h1

      ✖ 1 error"
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

    expect(await runner.report()).toMatchInlineSnapshot(`""`)
  })

  test('reads rule severity level from config', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const runner = new ContentConformanceRunner({
      cwd: fixturePath,
      config: './content-conformance-severity.config.js',
    })

    await runner.init()

    await runner.run()

    expect(await runner.report()).toMatchInlineSnapshot(`
      "content/has-frontmatter.mdx
        12:1-12:11  warning  Level 1 headings are not allowed                     local-no-h1

      content/index.mdx
           1:1-1:8  warning  Level 1 headings are not allowed                     local-no-h1

      content/no-h1.mdx
          1:1-1:27  error    Must have a level 1 heading at the top of the file.  must-have-h1

      content/nested/nested.mdx
           1:1-1:9  warning  Level 1 headings are not allowed                     local-no-h1

      4 messages (✖ 1 error, ⚠ 3 warnings)"
    `)
  })

  test('passes rule config via context', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const runner = new ContentConformanceRunner({
      cwd: fixturePath,
      config: './content-conformance-rule-config.config.js',
    })

    await runner.init()

    await runner.run()

    expect(await runner.report()).toMatchInlineSnapshot(`
      "content/has-frontmatter.mdx
        12:1-12:11  error  Level 1 headings are not allowed, This came from config  with-config

      content/index.mdx
           1:1-1:8  error  Level 1 headings are not allowed, This came from config  with-config

      content/nested/nested.mdx
           1:1-1:9  error  Level 1 headings are not allowed, This came from config  with-config

      ✖ 3 errors"
    `)
  })

  test('json reporter', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const runner = new ContentConformanceRunner({
      cwd: fixturePath,
      reporter: 'json',
    })

    await runner.init()

    await runner.run()

    // parsing the JSON so we can inspect the format
    const parsedReport = JSON.parse(await runner.report())

    expect(parsedReport).toHaveLength(4)

    expect(
      parsedReport.map(({ path, messages }) => ({
        path,
        messages: messages.map(({ reason, ruleId }) => ({
          reason,
          ruleId,
        })),
      }))
    ).toMatchInlineSnapshot(`
      [
        {
          "messages": [
            {
              "reason": "Level 1 headings are not allowed",
              "ruleId": "local-no-h1",
            },
          ],
          "path": "content/has-frontmatter.mdx",
        },
        {
          "messages": [
            {
              "reason": "Level 1 headings are not allowed",
              "ruleId": "local-no-h1",
            },
          ],
          "path": "content/index.mdx",
        },
        {
          "messages": [
            {
              "reason": "Must have a level 1 heading at the top of the file.",
              "ruleId": "must-have-h1",
            },
          ],
          "path": "content/no-h1.mdx",
        },
        {
          "messages": [
            {
              "reason": "Level 1 headings are not allowed",
              "ruleId": "local-no-h1",
            },
          ],
          "path": "content/nested/nested.mdx",
        },
      ]
    `)
  })

  test('markdown reporter', async () => {
    const fixturePath = getFixturePath('basic-with-content-files')

    const runner = new ContentConformanceRunner({
      cwd: fixturePath,
      reporter: 'markdown',
    })

    await runner.init()

    await runner.run()

    expect(await runner.report()).toMatchInlineSnapshot(`
      "### 📄 Content Checks

      Updated: Date

      <details><summary>Found 4 error(s)</summary>

      #### \`content/has-frontmatter.mdx\`

      | Position | Description | Rule |
      |---|---|---|
      | \`12:1-12:11\` | Level 1 headings are not allowed | \`local-no-h1\` |

      #### \`content/index.mdx\`

      | Position | Description | Rule |
      |---|---|---|
      | \`1:1-1:8\` | Level 1 headings are not allowed | \`local-no-h1\` |

      #### \`content/no-h1.mdx\`

      | Position | Description | Rule |
      |---|---|---|
      | \`1:1-1:27\` | Must have a level 1 heading at the top of the file. | \`must-have-h1\` |

      #### \`content/nested/nested.mdx\`

      | Position | Description | Rule |
      |---|---|---|
      | \`1:1-1:9\` | Level 1 headings are not allowed | \`local-no-h1\` |

      </details>"
    `)
  })
})
