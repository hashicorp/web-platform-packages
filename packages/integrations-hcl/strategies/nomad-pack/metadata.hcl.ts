/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { z } from 'zod'

const app = z.object({
  url: z.string(),
})

const pack = z.object({
  name: z.string(),
  description: z.string(),
})

const integration = z.object({
  identifier: z.string(),
  flags: z.string().array().default([]),
  name: z.string().optional(),
})

const schema = z.object({
  app: app.array().length(1),
  pack: pack.array().length(1),
  integration: integration.array().length(1),
})

export default schema
