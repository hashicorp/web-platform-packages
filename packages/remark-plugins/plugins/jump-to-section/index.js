import flatMap from 'unist-util-flatmap'
import { is } from 'unist-util-is'
import { u } from 'unist-builder'

export default function jumpToSection() {
  return function transformer(tree) {
    flatMap(tree, (node, index) => {
      if (is(node, 'heading') && index === 0) {
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
