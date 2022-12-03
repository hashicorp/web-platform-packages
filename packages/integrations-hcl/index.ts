import * as path from 'path'
import * as fs from 'fs'

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
    flags: hclIntegration.flags,
    docs: hclIntegration.docs[0],
    hide_versions: hclIntegration.hide_versions,
    license: hclIntegration.license[0],
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
