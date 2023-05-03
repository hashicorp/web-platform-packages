import * as fs from 'fs'
import { glob } from 'glob'
import * as path from 'path'
import { z } from 'zod'
import { IntegrationsAPI } from './lib/generated'
import { Integration } from './schemas/integration'
import { loadDefaultIntegrationDirectory } from './strategies/default/load_integration_directory'

const Config = z.object({
  identifier: z.string(),
  repo_path: z.string(),
  version: z.string(),
  strategy: z.enum(['default', 'nomad-pack']).default('default'),
})
type Config = z.infer<typeof Config>

export default async function LoadFilesystemIntegration(
  config: Config
): Promise<Integration> {
  // Create an API client instance
  const apiClient = new IntegrationsAPI({
    BASE: process.env.INPUT_INTEGRATIONS_API_BASE_URL,
  })

  // Parse & Validate the Integration Identifier
  const [productSlug, organizationSlug, integrationSlug] =
    config.identifier.split('/')
  if (!productSlug || !organizationSlug || !integrationSlug) {
    // Throw if the identifier is invalid
    throw new Error(
      `Invalid integration identifier: '${config.identifier}'.` +
        ` The expected format is 'productSlug/organizationSlug/integrationSlug'`
    )
  }

  // Validate the Organization as specified in the identifier exists
  const organization = await apiClient.organizations.fetchOrganization(
    organizationSlug
  )
  if (organization.meta.status_code != 200) {
    throw new Error(
      `Organization not found for integration identifier: '${config.identifier}'`
    )
  }

  // Fetch the Integration from the API. We need to ensure that it exists,
  // and therefore has already been registered.
  const integrationFetchResult = await apiClient.integrations.fetchIntegration(
    productSlug,
    organization.result.id,
    integrationSlug
  )
  if (integrationFetchResult.meta.status_code !== 200) {
    throw new Error(
      `Integration not found for integration identifier: '${config.identifier}'`
    )
  }
  const apiIntegration = integrationFetchResult.result

  // Determine the location of the Integration & validate that it has a metadata.hcl file
  const integrationDirectory = path.join(
    config.repo_path,
    apiIntegration.subdirectory || ''
  )
  const metadataFilePath = path.join(integrationDirectory, 'metadata.hcl')

  // Throw if the metadata.hcl file doesn't exist. We don't validate it at
  // this point beyond checking that it exists.
  if (!fs.existsSync(metadataFilePath)) {
    const matches = await glob('**/metadata.hcl', { cwd: config.repo_path })
    // If no metadata.hcl files were found, throw a helpful error
    if (matches.length === 0) {
      throw new Error(
        `No metadata.hcl file was found in the provided repo_path: '${config.repo_path}'.` +
          ` ` +
          `This may be happening if you forgot to checkout your repo, checked it out under a different path, or the repo is missing a metadata.hcl file.` +
          ` ` +
          `Please ensure none of these conditions are true, and try again.` +
          ` ` +
          `If the problem persists, please contact open an issue at https://github.com/hashicorp/web-platform-packages/issues`
      )
    }
    // If metadata.hcl files were found elsewhere, throw a helpful error
    if (matches.length >= 1) {
      throw new Error(
        `The following metadata.hcl path, ${metadataFilePath}, was derived from config values and integration data, but it does not exist.` +
          ` ` +
          `Other metadata.hcl files were found in the provided repo_path: '${config.repo_path}'.` +
          `\n\n` +
          matches.map((m) => ` - ${m}`).join('\n') +
          `\n\n` +
          `Please double check config values, and try again.`
      )
    }
  }

  // Load the Integration's product VariableGroupConfigs. This is information
  // that we need to parse out the Integration from the Filesystem.
  const variableGroupConfigs =
    await apiClient.variableGroupConfigs.fetchVariableGroupConfigs(
      apiIntegration.product.slug,
      '100'
    )
  if (variableGroupConfigs.meta.status_code !== 200) {
    throw new Error(
      `Failed to load 'variable_group' configs for product: '${apiIntegration.product.slug}'`
    )
  }

  // Depending on the Strategy that is specified, we read the filesystem and coerce the
  // configuration to a standardized Integrations object.
  switch (config.strategy) {
    case 'nomad-pack': {
      console.log('TODO')
      return null
    }

    default: {
      return loadDefaultIntegrationDirectory(
        integrationDirectory,
        apiIntegration.id,
        apiIntegration.product.slug,
        config.version,
        variableGroupConfigs.result
      )
    }
  }
}
