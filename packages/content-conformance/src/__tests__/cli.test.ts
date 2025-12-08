/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { execFileSync } from 'child_process'
import { currentFilePath, getFixturePath } from '../test/utils'

const fixturePath = getFixturePath('basic-with-content-files')

function execCli(...args: string[]) {
  try {
    return String(
      execFileSync('node', [
        path.join(currentFilePath, '../../..', '/dist/cli.js'),
        ...args,
      ])
    )
  } catch (error) {
    return String(error.stdout)
  }
}

function execCliExitCode(...args: string[]) {
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
      '--cwd',
      `${fixturePath}`,
      './content/has-frontmatter.mdx'
    )

    expect(res).toMatchInlineSnapshot(`
      "
      Running content conformance checks...

      Checking file: ./content/has-frontmatter.mdx
      Status:  failure

      content/has-frontmatter.mdx
        12:1-12:11  error  Level 1 headings are not allowed  local-no-h1

      ✖ 1 error
      "
    `)
  })

  test('Successful run with multiple content files and default config', () => {
    const res = execCli(
      '--cwd',
      `${fixturePath}`,
      './content/has-frontmatter.mdx',
      './content/index.mdx',
      './content/no-h1.mdx'
    )

    expect(res).toMatchInlineSnapshot(`
      "
      Running content conformance checks...

      Checking files: ./content/has-frontmatter.mdx, ./content/index.mdx, ./content/no-h1.mdx
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
    const res = execCli('--cwd', `${fixturePath}`)

    expect(res).toMatchInlineSnapshot(`
      "
      Running content conformance checks...

      Checking files matching: content/**/*.mdx
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
      '--cwd',
      `${fixturePath}`,
      `./content/index.mdx`,
      '--config',
      './content-conformance.config.mjs'
    )

    expect(res).toMatchInlineSnapshot(`
      "
      Running content conformance checks...

      Checking file: ./content/index.mdx
      Status:  failure

      content/index.mdx
        1:1-1:8  error  Level 1 headings are not allowed  local-no-h1

      ✖ 1 error
      "
    `)
  })

  test('Returns non-zero exit code on failure', () => {
    expect(() =>
      execCliExitCode(
        '--cwd',
        `${fixturePath}`,
        `./content/index.mdx`,
        '--config',
        './content-conformance.config.mjs'
      )
    ).toThrow()
  })
})
