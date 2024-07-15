/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  type: 'content',
  id: 'with-config',
  description: 'Shows how to use rule config off of the context',
  executor: {
    async contentFile(file, context) {
      file.visit(['heading'], (node) => {
        // @ts-expect-error -- Node is a generic type
        if (node.depth === 1) {
          context.report(
            `Level 1 headings are not allowed, ${context.config.message}`,
            file,
            node
          )
        }
      })
    },
    dataFile() {},
  },
}
