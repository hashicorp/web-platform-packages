/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export default {
  root: '.',
  contentFileGlobPattern: 'content/**/*.mdx',
  rules: {
    './rules/with-config': ['error', { message: 'This came from config' }],
  },
}
