// eslint-disable-next-line import/no-anonymous-default-export
/** @type {import('../types.js').ConformanceRuleBase} */
export default {
  type: 'content',
  id: 'no-top-of-file-h1',
  description: 'Each content file must not contain an H1 the top.',
  executor: {
    async contentFile(file, context) {
      // Ignore partials as they do not represent the entire content file
      if (file.isPartial) return false

      file.visit(['root'], (node) => {
        const firstNode = node.children[0]
        const reportMessage = `Expected file not to start with a level 1 heading. A level 1 heading is programmatically added to this page. Remove the level 1 heading at the top of the document.`

        if (firstNode.type === 'heading') {
          context.report(reportMessage, file, firstNode)

          return false
        }

        return true
      })
    },
    dataFile() {},
  },
}
