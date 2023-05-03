import * as fs from 'fs'
import { glob } from 'glob'
import * as path from 'path'
import { z } from 'zod'
import { IntegrationsAPI, VariableGroupConfig } from './lib/generated'
import HCL from './lib/hcl'
import {
  Component,
  Integration,
  Variable,
  VariableGroup,
} from './schemas/integration'
import MetadataHCLSchema from './schemas/metadata.hcl'
import { getVariablesSchema } from './schemas/variables.hcl'

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
  // TODO: put the switch statement here based off of the strategy specified
  return loadMetadatafile(
    integrationDirectory,
    apiIntegration.id,
    apiIntegration.product.slug,
    config.version,
    variableGroupConfigs.result
  )
}

async function loadMetadatafile(
  integrationDirectory: string,
  integrationID: string,
  integrationProductSlug: string,
  currentReleaseVersion: string,
  variableGroupConfigs: VariableGroupConfig[]
): Promise<Integration> {
  const metadataFilePath = path.join(integrationDirectory, 'metadata.hcl')

  // Read & Validate the Metadata file
  const fileContent = fs.readFileSync(metadataFilePath, 'utf8')
  const hclConfig = new HCL(fileContent, MetadataHCLSchema)
  // throw a verbose error message with the filepath and contents
  if (!hclConfig.result.data) {
    throw new Error(
      hclConfig.result.error.message +
        '\n' +
        'File: ' +
        metadataFilePath +
        '\n' +
        fileContent
    )
  }

  const hclIntegration = hclConfig.result.data.integration[0]

  // Read the README
  let readmeContent: string | null = null
  if (hclIntegration.docs[0].process_docs) {
    const readmeFile = path.join(
      integrationDirectory,
      hclIntegration.docs[0].readme_location
    )

    // Throw if the README file doesn't exist
    if (!fs.existsSync(readmeFile)) {
      throw new Error(
        `The README file, ${readmeFile}, was derived from config values and integration data, but it does not exist.` +
          ` ` +
          `Please double check the "readme_location" value in ${metadataFilePath}, and try again.`
      )
    }
    readmeContent = fs.readFileSync(readmeFile, 'utf8')
  }

  // Calculate each Component object
  const allComponents: Array<Component> = []
  for (let i = 0; i < hclIntegration.component.length; i++) {
    allComponents.push(
      await loadComponent(
        integrationDirectory,
        hclIntegration.component[i].type,
        hclIntegration.component[i].name,
        hclIntegration.component[i].slug,
        variableGroupConfigs
      )
    )
  }

  // Return Integration with all defaults set
  return {
    id: integrationID,
    product: integrationProductSlug,
    identifier: hclIntegration.identifier,
    name: hclIntegration.name,
    description: hclIntegration.description,
    current_release: {
      version: currentReleaseVersion,
      readme: readmeContent,
      components: allComponents,
    },
    flags: hclIntegration.flags,
    docs: hclIntegration.docs[0],
    hide_versions: hclIntegration.hide_versions,
    license: hclIntegration.license[0],
    integration_type: hclIntegration.integration_type,
  }
}

async function loadComponent(
  repoRootDirectory: string, // TODO: Rename to `integrationDirectory`
  componentType: string,
  componentName: string,
  componentSlug: string,
  variableGroupConfigs: Array<VariableGroupConfig>
): Promise<Component> {
  // Calculate the location of the folder where the README / variables, etc reside
  const componentFolder = `${repoRootDirectory}/components/${componentType}/${componentSlug}`

  // Load the README if it exists
  const componentReadmeFile = `${componentFolder}/README.md`
  let readmeContent: string | null = null
  try {
    readmeContent = fs.readFileSync(componentReadmeFile, 'utf8')
  } catch (err) {
    // No issue, there's just no README, which is OK!
  }

  // Go through each VariableGroupConfig to try see if we need to load them
  const variableGroups: Array<VariableGroup> = []

  for (let i = 0; i < variableGroupConfigs.length; i++) {
    const variableGroupConfig = variableGroupConfigs[i]
    const variableGroupFile = `${componentFolder}/${variableGroupConfig.filename}`
    if (fs.existsSync(variableGroupFile)) {
      // Load & Validate the Variable Files (parameters.hcl, outputs.hcl, etc.)
      const fileContent = fs.readFileSync(variableGroupFile, 'utf8')
      const hclConfig = new HCL(
        fileContent,
        getVariablesSchema(variableGroupConfig.stanza)
      )
      if (!hclConfig.result.data) {
        throw new Error(hclConfig.result.error.message)
      }

      // Map the HCL File variable configuration to the Variable defaults
      const variables: Array<Variable> = hclConfig.result.data[
        variableGroupConfig.stanza
      ].map((v) => {
        return {
          key: v.key,
          description: v.description ? v.description : null,
          type: v.type ? v.type : null,
          required: typeof v.required != 'undefined' ? v.required : null,
          default_value: v.default_value ? v.default_value : null,
        }
      })
      variableGroups.push({
        variable_group_config_id: variableGroupConfig.id,
        variables,
      })
    } else {
      console.warn(`Variable Group File '${variableGroupFile}' not found.`)
    }
  }

  return {
    type: componentType,
    name: componentName,
    slug: componentSlug,
    readme: readmeContent,
    variable_groups: variableGroups,
  }
}
