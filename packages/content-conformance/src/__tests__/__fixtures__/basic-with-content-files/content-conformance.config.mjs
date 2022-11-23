export default {
  root: '.',
  contentFileGlobPattern: 'content/**/*.mdx',
  rules: {
    './rules/local-no-h1': 'error',
    './rules/must-have-h1': 'error',
  },
}
