import * as fs from 'fs'
import * as path from 'path'
import HCL from '../../lib/hcl'
import { Integration } from '../../schemas/integration'
import MetadataHCLSchema from './metadata.hcl'

const PACK_README_LOCATION = './README.md'

export async function loadNomadPackIntegrationDirectory(
  integrationDirectory: string,
  integrationID: string,
  integrationProductSlug: string,
  currentReleaseVersion: string
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
  const appStanza = hclConfig.result.data.app[0]
  const packStanza = hclConfig.result.data.pack[0]
  const integrationStanza = hclConfig.result.data.integration[0]

  // Read the README, these are required for Packs
  const readmeFile = path.join(integrationDirectory, PACK_README_LOCATION)
  if (!fs.existsSync(readmeFile)) {
    // Throw if the README file doesn't exist
    throw new Error(
      `The README file, ${readmeFile}, was not found.` +
        ` ` +
        `For Nomad Packs, the README file must be located at ./README.md, relative to the subdirectory of the Pack.`
    )
  }
  const readmeContent: string = fs.readFileSync(readmeFile, 'utf8')

  return {
    id: integrationID,
    product: integrationProductSlug,
    identifier: integrationStanza.identifier,
    name: packStanza.name,
    description: packStanza.description,
    current_release: {
      version: currentReleaseVersion,
      readme: readmeContent,
      components: [],
    },
    flags: integrationStanza.flags,
    docs: {
      process_docs: true,
      readme_location: PACK_README_LOCATION,
      external_url: appStanza.url,
    },
    hide_versions: false,
    license: {
      type: null,
      url: null,
    },
    integration_type: 'pack',
  }
}
