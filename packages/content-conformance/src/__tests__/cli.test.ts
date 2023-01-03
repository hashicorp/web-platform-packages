import path from 'path'
import { execFileSync } from 'child_process'
import { currentFilePath, getFixturePath } from '../test/utils'

const fixturePath = getFixturePath('basic-with-content-files')

function execCli(...args: string[]) {
  return String(
    execFileSync('node', [
      path.join(currentFilePath, '../../..', '/dist/cli.js'),
      ...args,
    ])
  )
}

describe('Content-conformance CLI', () => {
  test('Successful run with content file and default config', () => {
    const res = execCli(
      'content-check',
      '--cwd',
      `${fixturePath}`,
      '--files',
      './content/has-frontmatter.mdx'
    )

    expect(res).toMatchInlineSnapshot(`
"[ 'content-check' ]
Configuring content conformance runner...

Included file:
- ./content/has-frontmatter.mdx

Running content conformance checks...

Status:  failure

content/has-frontmatter.mdx
  12:1-12:11  error  Level 1 headings are not allowed  local-no-h1

✖ 1 error
"
`)
  })

  test('Successful run with multiple content files and default config', () => {
    const res = execCli(
      'content-check',
      '--cwd',
      `${fixturePath}`,
      '--files',
      './content/has-frontmatter.mdx',
      './content/index.mdx',
      './content/no-h1.mdx'
    )

    expect(res).toMatchInlineSnapshot(`
"[ 'content-check' ]
Configuring content conformance runner...

Included files:
- ./content/has-frontmatter.mdx
- ./content/index.mdx
- ./content/no-h1.mdx

Running content conformance checks...

Status:  failure

content/has-frontmatter.mdx
  12:1-12:11  error  Level 1 headings are not allowed                     local-no-h1

content/index.mdx
     1:1-1:8  error  Level 1 headings are not allowed                     local-no-h1

content/no-h1.mdx
    1:1-1:27  error  Must have a level 1 heading at the top of the file.  must-have-h1

✖ 3 errors
"
`)
  })

  test('Accepts glob pattern when no content file specified', () => {
    const res = execCli('content-check', '--cwd', `${fixturePath}`)

    expect(res).toMatchInlineSnapshot(`
"[ 'content-check' ]
Configuring content conformance runner...

Running content conformance checks...

Status:  failure

content/has-frontmatter.mdx
  12:1-12:11  error  Level 1 headings are not allowed                     local-no-h1

content/index.mdx
     1:1-1:8  error  Level 1 headings are not allowed                     local-no-h1

content/no-h1.mdx
    1:1-1:27  error  Must have a level 1 heading at the top of the file.  must-have-h1

content/nested/nested.mdx
     1:1-1:9  error  Level 1 headings are not allowed                     local-no-h1

✖ 4 errors
"
`)
  })

  test('Accepts specified config file', () => {
    const res = execCli(
      'content-check',
      '--cwd',
      `${fixturePath}`,
      '--files',
      `./content/index.mdx`,
      '--config',
      './content-conformance.config.mjs'
    )

    expect(res).toMatchInlineSnapshot(`
"[ 'content-check' ]
Configuring content conformance runner...

Included file:
- ./content/index.mdx

Running content conformance checks...

Status:  failure

content/index.mdx
  1:1-1:8  error  Level 1 headings are not allowed  local-no-h1

✖ 1 error
"
`)
  })
})
