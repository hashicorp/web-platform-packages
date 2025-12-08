/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import { remark } from 'remark'
import remarkMdx from 'remark-mdx'
import { readSync } from 'to-vfile'

function flatMap(ast, fn) {
  return transform(ast, 0, null)[0]

  function transform(node, index, parent) {
    if (node.children) {
      var out = []
      for (var i = 0, n = node.children.length; i < n; i++) {
        var xs = transform(node.children[i], i, node)
        if (xs) {
          for (var j = 0, m = xs.length; j < m; j++) {
            out.push(xs[j])
          }
        }
      }
      node.children = out
    }

    return fn(node, index, parent)
  }
}

export default function includeMarkdownPlugin({
  resolveFrom,
  resolveMdx,
} = {}) {
  return function transformer(tree, file) {
    return flatMap(tree, (node) => {
      if (node.type !== 'paragraph') return [node]
      // detect an `@include` statement
      const includeMatch =
        node.children[0].value &&
        node.children[0].value.match(/^@include\s['"](.*)['"]$/)
      if (!includeMatch) return [node]

      // read the file contents
      const includePath = path.join(
        resolveFrom || file.dirname,
        includeMatch[1]
      )
      let includeContents
      try {
        includeContents = readSync(includePath, 'utf8')
      } catch (err) {
        throw new Error(
          `The @include file path at ${includePath} was not found.\n\nInclude Location: ${file.path}:${node.position.start.line}:${node.position.start.column}`
        )
      }

      // if we are including a ".md" or ".mdx" file, we add the contents as processed markdown
      // if any other file type, they are embedded into a code block
      if (includePath.match(/\.md(?:x)?$/)) {
        // return the file contents in place of the @include
        // (takes a couple steps because we're processing includes with remark)
        const processor = remark()
        // if the include is MDX, and the plugin consumer has confirmed their
        // ability to stringify MDX nodes (eg "jsx"), then use remarkMdx to support
        // custom components (which would otherwise appear as likely invalid HTML nodes)
        const isMdx = includePath.match(/\.mdx$/)
        if (isMdx && resolveMdx) processor.use(remarkMdx)
        // use the includeMarkdown plugin to allow recursive includes
        processor.use(includeMarkdownPlugin, { resolveFrom, resolveMdx })
        // Process the file contents, then return them
        const ast = processor.parse(includeContents)
        const res = processor.runSync(ast, includeContents)
        return res.children
      } else {
        // trim trailing newline
        includeContents.value = includeContents.value.trim()

        // return contents wrapped inside a "code" node
        return [
          {
            type: 'code',
            lang: includePath.match(/\.(\w+)$/)[1],
            value: includeContents,
          },
        ]
      }
    })
  }
}
