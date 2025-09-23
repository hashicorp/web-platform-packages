/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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

const Variable = z.object({
  key: z.string(),
  description: z.string().optional(),
  type: z.string().optional(),
  required: z.boolean().optional(),
  default_value: z.string().optional(),
})
export type Variable = z.infer<typeof Variable>

export const VariableGroup = z.object({
  variable_group_config_id: z.string(),
  variables: Variable.array(),
})
export type VariableGroup = z.infer<typeof VariableGroup>

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
  type: z.string(),
  slug: z.string(),
  name: z.string(),
  readme: z.string().nullable(),
  variable_groups: VariableGroup.array().optional(),
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
  product: z.nativeEnum(Product).or(z.string()),
  name: z.string(),
  description: z.string(),
  identifier: z.string(),
  current_release: Release,
  flags: z.string().array(),
  hide_versions: z.boolean(),
  license: License,
  docs: Docs,
  integration_type: z.string().optional().default(null),
})
export type Integration = z.infer<typeof Integration>
