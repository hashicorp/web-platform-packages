export default {
  preset: 'base-mdx',
  contentFileGlobPattern: 'content/**/*.mdx',
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
  },
}
