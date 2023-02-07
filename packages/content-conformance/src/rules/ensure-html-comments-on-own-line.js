/* eslint-disable import/no-anonymous-default-export */
/** @type {import('../types.js').ConformanceRuleBase} */
export default {
  type: 'content',
  id: 'ensure-html-comments-on-own-line',
  description: 'Ensures that HTML comments are on their own line.',
  executor: {
    async contentFile(file, context) {
      file.visit('jsx', (node) => {
        // is HTML comment
        if (node.value.includes('<!--')) {
          // // if child of another node
          if (node.position.start.column != 1) {
            context.report(
              'Detected an HTML comment that is likely nested. You may be using this in a bullet point or other markdown primitive, which is not permitted. Please ensure HTML comments are on their own line, without any indentation.',
              file,
              node
            )
          }

          // if leading whitespace
          if (node.value.match(/^\s/i)) {
            context.report(
              'Detected an HTML comment that is indented. This is not permitted. Please ensure HTML comments are on their own line, without any indentation.',
              file,
              node
            )
          }
        }
      })

      // check for accidental 4-space indentation (codeblock)
      file.visit('code', (node) => {
        if (node.value.includes('<!--')) {
          context.report(
            'Detected an HTML comment in a code block. This is not permitted. Please ensure HTML comments are on their own line, without any indentation.',
            file,
            node
          )
        }
      })
    },
  },
}
