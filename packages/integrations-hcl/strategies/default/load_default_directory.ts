/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import * as fs from 'fs'
import * as path from 'path'
import { VariableGroupConfig } from '../../lib/generated'
import HCL from '../../lib/hcl'
import {
  Component,
  Integration,
  Variable,
  VariableGroup,
} from '../../schemas/integration'
import MetadataHCLSchema from './metadata.hcl'
import { getVariablesSchema } from './variables.hcl'

export async function loadDefaultIntegrationDirectory(
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
  integrationDirectory: string,
  componentType: string,
  componentName: string,
  componentSlug: string,
  variableGroupConfigs: Array<VariableGroupConfig>
): Promise<Component> {
  // Calculate the location of the folder where the README / variables, etc reside
  const componentFolder = `${integrationDirectory}/components/${componentType}/${componentSlug}`

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
