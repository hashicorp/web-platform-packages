/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

module.exports = {
  extends: [
    require('path').resolve(
      __dirname,
      './packages/cli/config/stylelint.config.js'
    ),
  ],
}
