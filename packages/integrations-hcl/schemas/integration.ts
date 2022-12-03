import { z } from 'zod'

enum Product {
  TERRAFORM = 'terraform',
  VAULT = 'vault',
  NOMAD = 'nomad',
  CONSUL = 'consul',
  PACKER = 'packer',
  VAGRANT = 'vagrant',
  WAYPOINT = 'waypoint',
  BOUNDARY = 'boundary',
}

export const License = z.object({
  type: z.string().nullable(),
  url: z.string().nullable(),
})
export type License = z.infer<typeof License>

export const Docs = z.object({
  process_docs: z.boolean(),
  readme_location: z.string(),
  external_url: z.string().nullable(),
})
export type Docs = z.infer<typeof Docs>

export const Component = z.object({
  slug: z.string(),
  readme: z.string().nullable(),
})
export type Component = z.infer<typeof Component>

export const Release = z.object({
  version: z.string(),
  readme: z.string().nullable(),
  components: Component.array(),
})
export type Release = z.infer<typeof Release>

export const Integration = z.object({
  id: z.string(),
  product: z.nativeEnum(Product),
  name: z.string(),
  description: z.string(),
  identifier: z.string(),
  current_release: Release,
  flags: z.string().array(),
  hide_versions: z.boolean(),
  license: License,
  docs: Docs,
})
export type Integration = z.infer<typeof Integration>
