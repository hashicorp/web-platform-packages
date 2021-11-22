import flatMap from 'unist-util-flatmap'
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
