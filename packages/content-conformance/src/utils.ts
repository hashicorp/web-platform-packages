import url from 'url'
import { Statistics } from 'vfile-reporter/lib/index.js'
import { RunnerStatus } from './types.js'

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

export function getStatisticsStatus(
  statistics: Statistics,
  warnThreshold?: number
) {
  if (
    statistics.fatal > 0 ||
    (warnThreshold && statistics.warn >= warnThreshold)
  ) {
    return RunnerStatus.FAILURE
  }

  return RunnerStatus.SUCCESS
}
