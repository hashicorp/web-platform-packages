import fs from 'fs'
import { fetchIntegration, Product } from './lib/api-client'

import HCL from './lib/hcl'
import MetadataHCLSchema from './schemas/metadata.hcl'
import { Component, Docs, Integration, License } from './schemas/integration'

import { z } from 'zod'

const Config = z.object({
  identifier: z.string(),
  repo_path: z.string(),
  version: z.string(),
})
type Config = z.infer<typeof Config>

/**
 * @usage
 * ```typescript
 * async function consumeIntegrationRelease() {
 *   const fsIntegration = await LoadFilesystemIntegration({
 *     identifier: process.env.INPUT_INTEGRATION_IDENTIFIER,
 *     repo_path: process.env.INPUT_INTEGRATION_REPO_PATH,
 *     version: process.env.INPUT_INTEGRATION_VERSION,
 *   })
 * // ...
 * ```
 *
 */
export default async function LoadFilesystemIntegration(
  config: Config
): Promise<Integration> {
  // Fetch the Integration from the API that we're looking to update
  const identifier = config.identifier.split('/')
  const integrationFetchResult = await fetchIntegration(
    identifier[0] as Product,
    identifier[1]
  )
  if (integrationFetchResult.meta.status_code != 200) {
    throw new Error(`Integration '${config.identifier}' not found.`)
  }
  const apiIntegration = integrationFetchResult.result

  // Parse out & validate the metadata.hcl file
  const repoRootDirectory = `${config.repo_path}${
    apiIntegration.subdirectory || ''
  }`
  const metadataFilePath = `${repoRootDirectory}/metadata.hcl`

  const fileContent = fs.readFileSync(metadataFilePath, 'utf8')
  const hclConfig = new HCL(fileContent, MetadataHCLSchema)
  if (!hclConfig.result.data) {
    throw new Error(hclConfig.result.error.message)
  }
  const hclIntegration = hclConfig.result.data.integration[0]

  // Calculate the Docs Block
  const docs: Docs = {
    process_docs: true,
    readme_location: './README.md',
    external_url: null,
  }
  if (hclIntegration.docs && hclIntegration.docs[0]) {
    const hclDocsBlock = hclIntegration.docs[0]
    if (typeof hclDocsBlock.process_docs !== 'undefined') {
      docs.process_docs = hclDocsBlock.process_docs
    }
    if (typeof hclDocsBlock.readme_location !== 'undefined') {
      docs.readme_location = hclDocsBlock.readme_location
    }
    if (typeof hclDocsBlock.external_url !== 'undefined') {
      docs.external_url = hclDocsBlock.external_url
    }
  }

  // Calculate License Block
  const license: License = {
    type: null,
    url: null,
  }
  if (hclIntegration.license && hclIntegration.license[0]) {
    const licenseBlock = hclIntegration.license[0]
    license.type = licenseBlock.type || null
    license.url = licenseBlock.url || null
  }

  // Read the README
  let readmeContent: string | null = null
  if (docs.process_docs) {
    const readmeFile = `${config.repo_path}${
      apiIntegration.subdirectory || ''
    }/${docs.readme_location}`
    readmeContent = fs.readFileSync(readmeFile, 'utf8')
  }

  // Ensure that external_url is provided if process_docs is false
  if (!docs.process_docs && !docs.external_url) {
    throw new Error(
      '`docs.external_url` is required if `docs.process_docs` is set to false.'
    )
  }

  // Ensure there is at least one component
  if (hclIntegration.components.length < 1) {
    throw new Error('At least one component is required.')
  }

  // Calculate each Component object
  const allComponents: Array<Component> = []
  for (let i = 0; i < hclIntegration.components.length; i++) {
    allComponents.push(
      await loadComponent(repoRootDirectory, hclIntegration.components[i])
    )
  }

  // Return Integration with all defaults set
  return {
    id: apiIntegration.id,
    product: apiIntegration.product.slug,
    identifier: hclIntegration.identifier,
    name: hclIntegration.name,
    description: hclIntegration.description,
    current_release: {
      version: config.version,
      readme: readmeContent,
      components: allComponents,
    },
    flags: hclIntegration.flags ? hclIntegration.flags : [],
    docs: docs,
    hide_versions:
      typeof hclIntegration.hide_versions !== 'undefined'
        ? hclIntegration.hide_versions
        : false,
    license: license,
  }
}

async function loadComponent(
  repoRootDirectory: string,
  componentSlug: string
): Promise<Component> {
  const componentReadmeFile = `${repoRootDirectory}/components/${componentSlug}/README.md`
  let readmeContent: string | null = null
  try {
    readmeContent = fs.readFileSync(componentReadmeFile, 'utf8')
  } catch (err) {
    // No issue, there's just no README, which is OK!
  }
  return {
    slug: componentSlug,
    readme: readmeContent,
  }
}
