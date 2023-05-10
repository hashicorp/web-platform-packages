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

  // Read the README
  const rawReadmeContent: string = fs.readFileSync(readmeFile, 'utf8')

  // If the first line is a H1, remove it. Keeping it will create a
  // duplicate title in our content on the website.
  const readmeLines = rawReadmeContent.split('\n')
  const h1Regex = /^# .*/g
  if (h1Regex.test(readmeLines[0])) {
    readmeLines.shift()
    // The next line is likely an empty line, so let's remove that
    if (readmeLines[0] === '') {
      readmeLines.shift()
    }
  }
  const readmeContent = readmeLines.join('\n')

  return {
    id: integrationID,
    product: integrationProductSlug,
    identifier: integrationStanza.identifier,
    name: integrationStanza.name ? integrationStanza.name : packStanza.name,
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
    // This comes from the pack `integration_type` configuration in our integrations repo.
    // In the event the slug there ever changes, so does this.
    // https://github.com/hashicorp/integrations/blob/main/nomad/_config.hcl#L6
    integration_type: 'pack',
  }
}
