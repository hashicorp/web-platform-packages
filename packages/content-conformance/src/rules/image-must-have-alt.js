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
            `Warning: Found MDX image with undefined alternate text. Even if an image is decorative, it's important for alt to be set to an empty string. Please define alt text the syntax "![Some alt text.](/some-image.jpg)". Image details: ${JSON.stringify(
              { url: node.url, alt: node.alt, title: node.title }
            )}`,
            file,
            node
          )

          return false
        }
      })
    },
  },
}
