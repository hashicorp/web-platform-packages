import path from 'path'
import { COMPONENT_TYPES } from './constants'
import {
  isValidDocsPath,
  isValidDocsContentPath,
} from './is-valid-docs-file-path'

// Given an array of file paths within the "docs" folder,
// validate that no unexpected files are being included,
// and that there is at least one component subfolder
// with at least one .mdx file within it.
export function validatePluginDocsFiles(filePaths: string[]) {
  const invalidPaths = filePaths.filter((f) => !isValidDocsPath(f))
  if (invalidPaths.length > 0) {
    return `Found invalid files or folders in the docs directory: ${JSON.stringify(
      invalidPaths
    )}. Please ensure the docs folder contains only component subfolders and .mdx files within those subfolders. Valid component types are: ${JSON.stringify(
      COMPONENT_TYPES
    )}.`
  }
  const validPaths = filePaths.filter(isValidDocsPath)
  const mdxFiles = validPaths.filter(isValidDocsContentPath)
  const isMissingDocs = mdxFiles.length == 0
  if (isMissingDocs) {
    return `Could not find valid .mdx files. Please ensure there is at least one component subfolder in the docs directory, which contains at least one .mdx file. Valid component types are: ${JSON.stringify(
      COMPONENT_TYPES
    )}.`
  }
  return null
}
