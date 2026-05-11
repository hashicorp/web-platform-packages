/**
 * Copyright IBM Corp. 2021, 2026
 * SPDX-License-Identifier: MPL-2.0
 */

module.exports = {
  root: true,
  extends: './packages/cli/config/.eslintrc.js',
  ignorePatterns: ['packages/cli/__tests__/**'],
  rules: {
    '@next/next/no-server-import-in-page': 'off',
  },
}
