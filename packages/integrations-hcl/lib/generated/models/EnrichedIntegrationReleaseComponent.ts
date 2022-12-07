/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EnrichedIntegrationReleaseComponent = {
  id: string
  created_at: string
  updated_at: string
  readme: string | null
  integration_release_id: string
  component: {
    id: string
    created_at: string
    updated_at: string
    slug: string
    name: string
    plural_name: string
    product_id: string
  }
  variable_groups: Array<{
    id: string
    created_at: string
    updated_at: string
    variable_group_config_id: string
    integration_release_component_id: string
  }>
}
