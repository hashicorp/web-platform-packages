/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const fs = require('fs')
const path = require('path')

function readFile(file) {
  return fs.readFileSync(path.join(__dirname, `./${file}`), 'utf-8')
}

module.exports = readFile
