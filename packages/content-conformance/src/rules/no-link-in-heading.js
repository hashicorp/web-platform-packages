import { visit } from 'unist-util-visit'

/**
 * Visit each node in a subtree to build a string representation
 */
function getStringValue(node) {
  let string = ''
  visit(node, (child) => {
    if ('value' in child) {
      string += child.value
    }
  })
  return string
}

// eslint-disable-next-line import/no-anonymous-default-export
/** @type {import('../types.js').ConformanceRuleBase} */
export default {
  type: 'content',
  id: 'no-link-in-heading',
  description:
    'Links should not be used in headings, as it can cause issues with anchor link generation and accessibility',
  executor: {
    async contentFile(file, context) {
      file.visit(['heading'], (node) => {
        const headingStringValue = getStringValue(node)

        // visit any link nodes in the heading subtree
        visit(node, ['link'], (linkNode) => {
          const linkStringValue = getStringValue(linkNode)

          context.report(
            `Heading with text "${headingStringValue}" contains a link with text "${linkStringValue}". Remove the nested link, as links in headings can cause issues with anchor link generation and accessibility.`,
            file,
            linkNode
          )
        })
      })
    },
  },
}
