export default {
  root: '.',
  contentFileGlobPattern: 'content/**/*.mdx',
  rules: {
    './rules/local-no-h1': 'warn',
    './rules/must-have-h1': 'error',
  },
}
