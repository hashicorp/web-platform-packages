/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

export default {
  root: '.',
  contentFileGlobPattern: 'content/**/*.mdx',
  rules: {
    './rules/local-no-h1': 'error',
    './rules/must-have-h1': 'error',
  },
}
