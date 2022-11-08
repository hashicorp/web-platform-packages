import z from 'zod'
import { findUp } from 'find-up'
import path from 'path'
import { loadModuleFromFilePath } from './utils.js'

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

  const importedConfig = (await loadModuleFromFilePath(configPath)).default

  // TODO: catch here and return meaningful error? Maybe use parseSafe instead
  const config = ContentConformanceConfig.parse(importedConfig)

  config.root = resolveConfigRoot(config.root, cwd)

  return config
}

function resolveConfigRoot(rootValue: string, cwd: string) {
  return path.resolve(cwd, rootValue)
}
