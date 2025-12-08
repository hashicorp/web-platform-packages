/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

module.exports = {
  '*.+(css|js|jsx|ts|tsx|md|yml|yaml|json|html|graphql)': (filenames) => {
    return [
      `next-hashicorp format ${filenames.join(' ')}`,
      `next-hashicorp lint ${filenames.join(' ')}`,
    ]
  },
}
