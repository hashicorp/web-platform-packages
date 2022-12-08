import { z } from 'zod'

// https://github.com/hashicorp/integration-template
const license = z.object({
  type: z.string().nullable().default(null),
  url: z.string().url().nullable().default(null),
})

const docs = z.discriminatedUnion('process_docs', [
  z.object({
    process_docs: z.literal(false),
    readme_location: z.string().default('./README.md'),
    external_url: z
      .string({
        required_error:
          'docs.external_url is required if docs.process_docs is false',
        invalid_type_error: 'docs.external_url must be a valid URL',
      })
      .url('docs.external_url must be a valid URL'),
  }),
  z.object({
    process_docs: z.literal(true),
    readme_location: z.string().default('./README.md'),
    external_url: z.string().nullable().default(null),
  }),
])

const integration = z.object({
  // required
  name: z.string(),
  description: z.string(),
  identifier: z.string(),
  components: z.string().array().min(1, 'At least one component is required.'),
  // optionals
  flags: z.string().array().default([]),
  hide_versions: z.boolean().default(false),
  license: license
    .array()
    .length(1)
    .default([{ type: null, url: null }]),
  docs: docs
    .array()
    .length(1)
    .default([
      {
        process_docs: true,
        readme_location: './README.md',
      },
    ]),
})

const schema = z.object({
  integration: integration.array().length(1),
})

export default schema
