import { z } from 'zod'

const license = z.object({
  type: z.string().optional(),
  url: z.string().url().optional(),
})

const docs = z.object({
  process_docs: z.boolean().optional(),
  readme_location: z.string().optional(),
  external_url: z.string().url().optional(),
})

const integration = z.object({
  name: z.string(),
  description: z.string(),
  identifier: z.string(),
  components: z.string().array(),
  flags: z.string().array().optional(),
  hide_versions: z.boolean().optional(),
  license: license.array().length(1).optional(),
  docs: docs.array().length(1).optional(),
})

const schema = z.object({
  integration: integration.array().length(1),
})

export default schema
