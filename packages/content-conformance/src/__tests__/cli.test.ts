import path from 'path'
import { execFileSync } from 'child_process'
import { currentFilePath } from '../test/utils'

const baseFixturePath = path.join(
  currentFilePath,
  '../..',
  './__tests__/__fixtures__/basic-with-content-files'
)

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
    const res = execCli('content-check', '--cwd', `${baseFixturePath}`)

    expect(res).toMatchInlineSnapshot(`
"Configuring content conformance runner...
[content-conformance] loaded config from /Users/nickayres/Repos/web-platform-packages/packages/content-conformance/src/__tests__/__fixtures__/basic-with-content-files/content-conformance.config.mjs
{
  root: '/Users/nickayres/Repos/web-platform-packages/packages/content-conformance/src/__tests__/__fixtures__/basic-with-content-files',
  contentFileGlobPattern: 'content/**/*.mdx',
  rules: [
    {
      type: 'content',
      id: 'local-no-h1',
      description: 'Do not allow use of level 1 headings',
      executor: [Object],
      level: 'error',
      config: undefined
    },
    {
      type: 'content',
      id: 'must-have-h1',
      description: 'Each content file must contain an H1 the top.',
      executor: [Object],
      level: 'error',
      config: undefined
    }
  ],
  partialsDirectory: 'content/partials',
  files: []
}
Included file:
Running content conformance checks...

Status:  success

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

  test('Accepts glob pattern when no content file specified', () => {
    const res = execCli('content-check', '--cwd', `${baseFixturePath}`)

    expect(res).toMatchInlineSnapshot(`
"Configuring content conformance runner...
[content-conformance] loaded config from /Users/nickayres/Repos/web-platform-packages/packages/content-conformance/src/__tests__/__fixtures__/basic-with-content-files/content-conformance.config.mjs
{
  root: '/Users/nickayres/Repos/web-platform-packages/packages/content-conformance/src/__tests__/__fixtures__/basic-with-content-files',
  contentFileGlobPattern: 'content/**/*.mdx',
  rules: [
    {
      type: 'content',
      id: 'local-no-h1',
      description: 'Do not allow use of level 1 headings',
      executor: [Object],
      level: 'error',
      config: undefined
    },
    {
      type: 'content',
      id: 'must-have-h1',
      description: 'Each content file must contain an H1 the top.',
      executor: [Object],
      level: 'error',
      config: undefined
    }
  ],
  partialsDirectory: 'content/partials',
  files: []
}
Included file:
Running content conformance checks...

Status:  success

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
      `${baseFixturePath}`,
      '--files',
      `./no-h1.mdx`,
      '--config',
      './content-conformance-severity.config.js'
    )

    expect(res).toMatchInlineSnapshot(`
"Configuring content conformance runner...
[content-conformance] loaded config from /Users/nickayres/Repos/web-platform-packages/packages/content-conformance/src/__tests__/__fixtures__/basic-with-content-files/content-conformance-severity.config.js
{
  root: '/Users/nickayres/Repos/web-platform-packages/packages/content-conformance/src/__tests__/__fixtures__/basic-with-content-files',
  contentFileGlobPattern: 'content/**/*.mdx',
  rules: [
    {
      type: 'content',
      id: 'local-no-h1',
      description: 'Do not allow use of level 1 headings',
      executor: [Object],
      level: 'warn',
      config: undefined
    },
    {
      type: 'content',
      id: 'must-have-h1',
      description: 'Each content file must contain an H1 the top.',
      executor: [Object],
      level: 'error',
      config: undefined
    }
  ],
  partialsDirectory: 'content/partials',
  files: [ 'no-h1.mdx' ]
}
Included file:
- ./no-h1.mdx 

Running content conformance checks...

Status:  success


"
`)
  })
})
