// eslint-disable-next-line import/no-anonymous-default-export
/** @type {import('../types.js').ConformanceRuleBase} */
export default {
  type: 'content',
  id: 'top-of-file-h1',
  description: 'Each content file must contain an H1 the top.',
  executor: {
    async contentFile(file, context) {
      file.visit(['root'], (node) => {
        const firstNode = node.children[0]
        const reportMessage = `- ${file.path} \nThe file listed above is missing a level 1 heading at the top of the file. Please add a level 1 heading to the top of the file and try again.`

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
