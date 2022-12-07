export default {
  preset: 'base-mdx',
  contentFileGlobPattern: 'content/**/*.mdx',
  rules: {
    'ensure-valid-frontmatter': [
      'error',
      { requiredKeys: ['page_title', 'description'] },
    ],
    'ensure-valid-nav-data': 'error',
  },
}
