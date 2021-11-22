import { is } from 'unist-util-is'
import { u } from 'unist-builder'

/**
 * @usage
 * ```ts
 * let headings = []
 *
 * const mdxSource = await serialize(content, {
 *   mdxOptions: {
 *     remarkPlugins: [
 *       jumpToSection,
 *       // or
 *       [jumpToSection, { hide: false }],
 *     ],
 *   },
 *   scope: { headings },
 * });
 * ```
 */
export default function jumpToSection(options) {
  if (options?.hide) return
  return function transformer(tree) {
    let found = false
    flatMap(tree, (node) => {
      if (is(node, 'heading') && node.depth === 1 && !found) {
        found = true
        return [
          node,
          u('mdxJsxFlowElement', {
            name: 'JumpToSection',
            attributes: [
              u('mdxJsxAttribute', {
                name: 'headings',
                value: u(
                  'mdxJsxAttributeValueExpression',
                  { data: { estree: undefined } },
                  'headings'
                ),
              }),
            ],
          }),
        ]
      }

      // No change
      return [node]
    })
  }
}

/**
 * copied from https://gitlab.com/staltz/unist-util-flatmap/-/blob/master/index.js which is exported using commonjs
 */
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
