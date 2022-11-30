export default {
  root: '.',
  contentFileGlobPattern: 'content/**/*.mdx',
  rules: {
    './rules/with-config': ['error', { message: 'This came from config' }],
  },
}
