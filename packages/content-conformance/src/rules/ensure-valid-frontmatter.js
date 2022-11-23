/** @type {import('../types.js').ConformanceRuleBase} */
export default {
  type: 'content',
  id: 'ensure-valid-frontmatter',
  description:
    "Ensures that the provided keys are present in a content file's frontmatter",
  executor: {
    async contentFile(file, context) {
      for (const key of context.config.requiredKeys) {
        if (!file.frontmatter()[key]) {
          context.report(`Expected frontmatter to contain: ${key}`)
        }
      }
    },
  },
}
