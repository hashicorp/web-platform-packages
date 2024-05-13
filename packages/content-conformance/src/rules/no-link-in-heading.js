/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'

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
        const headingStringValue = toString(node)

        // visit any link nodes in the heading subtree
        visit(node, ['link'], (linkNode) => {
          const linkStringValue = toString(linkNode)

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
