/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { fileURLToPath } from 'url'
import { readSync } from 'to-vfile'
import { remark } from 'remark'
import remarkMdx from 'remark-mdx'
import normalizeNewline from 'normalize-newline'
import includeMarkdown from './index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('include-markdown', () => {
  test('basic', () => {
    remark()
      .use(includeMarkdown)
      .process(loadFixture('basic'), (err, file) => {
        if (err) throw new Error(err)
        expect(file.contents).toEqual(loadFixture('basic.expected').contents)
      })
  })

  test('include mdx', () => {
    remark()
      .use(includeMarkdown)
      .process(loadFixture('mdx-format'), (err, file) => {
        if (err) throw new Error(err)
        expect(file.contents).toEqual(
          loadFixture('mdx-format.expected').contents
        )
      })
  })

  test('include custom mdx components', async () => {
    // Set up a basic snippet as an mdast tree
    const sourceMdx = `hello\n\n@include 'include-with-component.mdx'\n\nworld`
    const resolveFrom = path.join(__dirname, 'fixtures')
    const compiler = remark()
      .use(remarkMdx)
      .use(includeMarkdown, { resolveFrom, resolveMdx: true })
    const tree = await compiler.run(await compiler.parse(sourceMdx))
    // Set up the includes plugin which will also run remark-mdx
    // Expect the custom component to appear in the resulting tree as JSX
    expect(tree.children.length).toBe(4)
    const [beforeP, includedText, includedComponent, afterP] = tree.children
    expect(beforeP.children[0].value).toBe('hello')
    expect(includedText.children[0].value).toBe('some text in an include')
    expect(includedComponent.type).toBe('mdxJsxFlowElement')
    expect(includedComponent.name).toBe('CustomComponent')
    expect(afterP.children[0].value).toBe('world')
  })

  test('include nested custom mdx components', () => {
    // Set up a basic snippet as an mdast tree
    const sourceMdx = `hello\n\n@include 'include-nested-component.mdx'\n\nworld`
    const rawTree = remark().use(remarkMdx).parse(sourceMdx)
    // Set up the includes plugin which will also run remark-mdx
    const resolveFrom = path.join(__dirname, 'fixtures')
    const tree = includeMarkdown({ resolveFrom, resolveMdx: true })(rawTree)
    // Expect the custom component to appear in the resulting tree as JSX
    expect(tree.children.length).toBe(5)
    const [
      beforeP,
      includedText,
      nestedText,
      nestedComponent,
      afterP,
    ] = tree.children
    expect(beforeP.children[0].value).toBe('hello')
    expect(includedText.children[0].value).toBe('text at depth one')
    expect(nestedText.children[0].value).toBe('some text in a nested include')
    expect(nestedComponent.name).toBe('NestedComponent')
    expect(nestedComponent.type).toBe('mdxJsxFlowElement')
    expect(afterP.children[0].value).toBe('world')
  })

  test('include non-markdown', () => {
    remark()
      .use(includeMarkdown)
      .process(loadFixture('non-markdown'), (err, file) => {
        if (err) throw new Error(err)
        expect(file.contents).toEqual(
          loadFixture('non-markdown.expected').contents
        )
      })
  })

  test('invalid path', () => {
    expect(() =>
      remark()
        .use(includeMarkdown)
        .process(loadFixture('invalid-path'), (err) => {
          if (err) throw err
        })
    ).toThrow(
      /The @include file path at .*bskjbfkhj was not found\.\s+Include Location: .*invalid-path\.md:3:1/gm
    )
  })

  test('resolveFrom option', () => {
    remark()
      .use(includeMarkdown, {
        resolveFrom: path.join(__dirname, 'fixtures/nested'),
      })
      .process(loadFixture('resolve-from'), (err, file) => {
        if (err) throw new Error(err)
        expect(file.contents).toEqual(
          loadFixture('resolve-from.expected').contents
        )
      })
  })
})

function loadFixture(name) {
  const vfile = readSync(path.join(__dirname, 'fixtures', `${name}.md`), 'utf8')
  vfile.value = normalizeNewline(vfile.value)
  return vfile
}
