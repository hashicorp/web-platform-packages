// eslint-disable-next-line import/no-anonymous-default-export
export default {
  type: 'content',
  id: 'must-have-h1',
  description: 'Each content file must contain an H1 the top.',
  executor: {
    async contentFile(file, context) {
      let hasH1 = false
      let hasVisitedAHeading = false

      file.visit(['heading'], (node) => {
        hasVisitedAHeading = true

        if (node.depth === 1) {
          hasH1 = true
        }

        if (!hasH1 && hasVisitedAHeading) {
          context.report(
            'Must have a level 1 heading at the top of the file.',
            file,
            node
          )
          // stop traversing
          return false
        }
      })
    },
    dataFile() {},
  },
}
