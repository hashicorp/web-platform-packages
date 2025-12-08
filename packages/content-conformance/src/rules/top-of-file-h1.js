/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

// eslint-disable-next-line import/no-anonymous-default-export
/** @type {import('../types.js').ConformanceRuleBase} */
export default {
  type: 'content',
  id: 'top-of-file-h1',
  description: 'Each content file must contain an H1 the top.',
  executor: {
    async contentFile(file, context) {
      // Ignore partials as they do not represent the entire content file
      if (file.isPartial) return false

      file.visit(['root'], (node) => {
        const firstNode = node.children[0]
        const reportMessage = `Expected file to start with a level 1 heading. A level 1 heading is important for accessibility and layout consistency. Add a level 1 heading at the top of the document.`

        if (firstNode.type === 'heading') {
          if (firstNode.depth > 1) {
            context.report(reportMessage, file, firstNode)

            return false
          }

          return true
        }

        context.report(reportMessage, file, firstNode)

        return false
      })
    },
    dataFile() {},
  },
}
