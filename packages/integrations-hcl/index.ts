import * as path from 'path'
import * as fs from 'fs'

import { IntegrationsAPI, VariableGroupConfig } from './lib/generated'

import HCL from './lib/hcl'
import MetadataHCLSchema from './schemas/metadata.hcl'
import { getVariablesSchema } from './schemas/variables.hcl'
import { Component, Docs, Integration, License } from './schemas/integration'

import { z } from 'zod'

const Config = z.object({
  identifier: z.string(),
  repo_path: z.string(),
  version: z.string(),
})
type Config = z.infer<typeof Config>

export default async function LoadFilesystemIntegration(
  config: Config
): Promise<Integration> {
  // Create the API client
  const client = new IntegrationsAPI({
    BASE: process.env.INPUT_INTEGRATIONS_API_BASE_URL,
  })

  // Fetch the Integration from the API that we're looking to update
  const [productSlug, integrationSlug] = config.identifier.split('/')
  const integrationFetchResult = await client.integrations
    .fetchIntegration(productSlug, integrationSlug)
    .catch((err) => {
      console.error(err)
      throw new Error(`Integration '${config.identifier}' not found.`)
    })

  const apiIntegration = integrationFetchResult.result

  // Parse out & validate the metadata.hcl file
  const repoRootDirectory = path.join(
    config.repo_path,
    apiIntegration.subdirectory || ''
  )
  const metadataFilePath = path.join(repoRootDirectory, 'metadata.hcl')

  const fileContent = fs.readFileSync(metadataFilePath, 'utf8')
  const hclConfig = new HCL(fileContent, MetadataHCLSchema)
  if (!hclConfig.result.data) {
    throw new Error(hclConfig.result.error.message)
  }
  const hclIntegration = hclConfig.result.data.integration[0]

  // Read the README
  let readmeContent: string | null = null
  if (hclIntegration.docs[0].process_docs) {
    const readmeFile = path.join(
      repoRootDirectory,
      hclIntegration.docs[0].readme_location
    )
    readmeContent = fs.readFileSync(readmeFile, 'utf8')
  }

  // Load the Products VariableGroupConfigs so we can load any component variables
  const variableGroupConfigs = await client.variableGroupConfigs
    .fetchVariableGroupConfigs(apiIntegration.product.slug, '100')
    .catch((err) => {
      console.error(err)
      throw new Error(`Failed to load 'variable_group' configs`)
    })

  // Calculate each Component object
  const allComponents: Array<Component> = []
  for (let i = 0; i < hclIntegration.components.length; i++) {
    allComponents.push(
      await loadComponent(
        repoRootDirectory,
        hclIntegration.components[i],
        variableGroupConfigs.result
      )
    )
  }

  // Return Integration with all defaults set
  return {
    id: apiIntegration.id,
    // @ts-expect-error - we can ignore this Enum vs. String mismatch
    product: apiIntegration.product.slug,
    identifier: hclIntegration.identifier,
    name: hclIntegration.name,
    description: hclIntegration.description,
    current_release: {
      version: config.version,
      readme: readmeContent,
      components: allComponents,
    },
    flags: hclIntegration.flags,
    docs: hclIntegration.docs[0],
    hide_versions: hclIntegration.hide_versions,
    license: hclIntegration.license[0],
  }
}

async function loadComponent(
  repoRootDirectory: string,
  componentSlug: string,
  variableGroupConfigs: Array<VariableGroupConfig>
): Promise<Component> {
  const componentReadmeFile = `${repoRootDirectory}/components/${componentSlug}/README.md`
  let readmeContent: string | null = null
  try {
    readmeContent = fs.readFileSync(componentReadmeFile, 'utf8')
  } catch (err) {
    // No issue, there's just no README, which is OK!
  }

  // Go through each VariableGroupConfig to try see if we need to load them
  const variableGroups /**@todo Type Me */ = []

  for (let i = 0; i < variableGroupConfigs.length; i++) {
    const variableGroupConfig = variableGroupConfigs[i]
    const variableGroupFile = `${repoRootDirectory}/components/${componentSlug}/${variableGroupConfig.filename}`
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
      const variables /** @todo Type Me */ = hclConfig.result.data[
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
    slug: componentSlug,
    readme: readmeContent,
    // @ts-expect-error - TODO: Type Me
    variable_groups: variableGroups,
  }
}
