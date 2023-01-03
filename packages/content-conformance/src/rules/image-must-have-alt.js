// eslint-disable-next-line import/no-anonymous-default-export
/** @type {import('../types.js').ConformanceRuleBase} */
export default {
  type: 'content',
  id: 'image-must-have-alt',
  description: 'Images must have alt text to ensure accessibility for everyone',
  executor: {
    async contentFile(file, context) {
      file.visit(['image'], (node) => {
        if (!node.alt) {
          context.report(
            `The image with url ${node.url} is missing alternate text. Providing alt text on an image is important for accessibility. Add alt text on the image with the following syntax "![My alt text.](url)"`,
            file,
            node
          )

          return false
        }
      })
    },
  },
}
