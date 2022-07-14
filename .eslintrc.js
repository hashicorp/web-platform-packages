module.exports = {
  root: true,
  extends: './packages/cli/config/.eslintrc.js',
  ignorePatterns: ['packages/cli/__tests__/**'],
  rules: {
    '@next/next/no-server-import-in-page': 'off',
  },
}
