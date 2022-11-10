// eslint-disable-next-line import/no-anonymous-default-export
export default {
  type: 'content',
  id: 'local-no-h1',
  description: 'Do not allow use of level 1 headings',
  executor: {
    async contentFile(file, context) {
      file.visit(['heading'], (node) => {
        // @ts-expect-error -- Node is a generic type
        if (node.depth === 1) {
          context.report('Level 1 headings are not allowed', file, node)
        }
      })
    },
    dataFile() {},
  },
}
