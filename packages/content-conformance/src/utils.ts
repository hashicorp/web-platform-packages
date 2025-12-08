/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import url from 'url'

/**
 * This is used to derive the current directory, as __dirname is not available in a native ESM environment.
 */
const currentFilePath = url.fileURLToPath(new URL(import.meta.url))

/**
 * Helper method to handle loading an ESModule from a filepath.
 */
export async function loadModuleFromFilePath(filepath: string) {
  // dynamic imports with a file URL are not supported in jest
  let fileImportPath =
    process.env.NODE_ENV === 'test'
      ? filepath
      : url.pathToFileURL(filepath).href

  // ESModules require the .js file extension to be loaded correctly by Node. Appending the extension if it's missing here
  if (!fileImportPath.endsWith('.js') && !fileImportPath.endsWith('.mjs')) {
    fileImportPath += '.js'
  }

  return import(fileImportPath)
}

/**
 * Returns the path to a file in this package, relative to the package root.
 */
export function getPackageFilePath(filepath: string) {
  return path.join(path.dirname(currentFilePath), filepath)
}
