import url from 'url'

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
  if (!fileImportPath.endsWith('.js')) {
    fileImportPath += '.js'
  }

  return import(fileImportPath)
}
