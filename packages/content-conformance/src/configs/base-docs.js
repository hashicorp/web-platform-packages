/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

export default {
  preset: 'base-mdx',
  contentFileGlobPattern: '{content,docs}/**/*.mdx',
  dataFileGlobPattern: 'data/*-nav-data.json',
  rules: {
    'ensure-valid-frontmatter': [
      'error',
      { requiredKeys: ['page_title', 'description'] },
    ],
    'ensure-valid-nav-data': 'error',
    'ensure-valid-nav-paths': 'error',
    'no-link-in-heading': 'error',
    'no-unlinked-pages': 'error',
    'ensure-valid-link-format': ['error', { contentType: 'docs' }],
  },
}
