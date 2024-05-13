/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { test } from 'lib/index'

console.log(process.env.FOO)
console.log(process.argv.splice(2))
test()
