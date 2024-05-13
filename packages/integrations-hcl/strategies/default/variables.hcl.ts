/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { z } from 'zod'

const variable = z.object({
  key: z.string(),
  description: z.string().optional(),
  type: z.string().optional(),
  required: z.boolean().optional(),
  default_value: z.string().optional(),
})

export function getVariablesSchema(stanza: string) {
  return z.object({
    [stanza]: variable.array(),
  })
}
