import z from 'zod'
import { findUp } from 'find-up'
import url from 'url'
import path from 'path'

const CONFIG_FILE_NAME = 'content-conformance.config.js'

const ContentConformanceConfigRule = z
  .string()
  .or(z.tuple([z.string(), z.record(z.any())]))

const ContentConformanceConfig = z.object({
  root: z.string(),
  contentFileGlobPattern: z.string(),
  dataFileGlobPattern: z.string().optional(),
  presets: z.array(z.string()).optional(),
  rules: z.record(ContentConformanceConfigRule).optional(),
})

export type ContentConformanceConfig = z.infer<typeof ContentConformanceConfig>

/**
 * Load a content-conformance.config.js file
 */
export async function loadConfig({
  cwd = process.cwd(),
}: {
  cwd: string
}): Promise<ContentConformanceConfig> {
  const configPath = await findUp(CONFIG_FILE_NAME, { cwd })

  if (!configPath) {
    throw new Error(
      `[content-conformance] Config file not found: ${path.join(
        cwd,
        CONFIG_FILE_NAME
      )}`
    )
  }

  // dynamic imports with a file URL are not supported in jest
  const configImportPath =
    process.env.NODE_ENV === 'test'
      ? configPath
      : url.pathToFileURL(configPath).href

  const importedConfig = (await import(configImportPath)).default

  // TODO: catch here and return meaningful error? Maybe use parseSafe instead
  const config = ContentConformanceConfig.parse(importedConfig)

  config.root = resolveConfigRoot(config.root, cwd)

  return config
}

function resolveConfigRoot(rootValue: string, cwd: string) {
  return path.resolve(cwd, rootValue)
}
