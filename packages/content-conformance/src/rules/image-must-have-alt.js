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
            'Expected image to include alt text. Alt text is important because it allows people to understand the content of an image even if they cannot see it. Please add alt text to this image.',
            file,
            node
          )

          return false
        }
      })
    },
  },
}
