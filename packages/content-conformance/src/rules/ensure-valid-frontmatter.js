/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

/** @type {import('../types.js').ConformanceRuleBase} */
export default {
  type: 'content',
  id: 'ensure-valid-frontmatter',
  description:
    "Ensures that the provided keys are present in a content file's frontmatter",
  executor: {
    async contentFile(file, context) {
      // Ignore partials as they are not expected to contain frontmatter
      if (file.isPartial) {
        return
      }

      for (const key of context.config.requiredKeys) {
        if (!file.frontmatter()[key]) {
          context.report(
            `Document does not have a \`${key}\` key in its frontmatter. Add a \`${key}\` key at the top of the document.`,
            file
          )
        }
      }
    },
  },
}
