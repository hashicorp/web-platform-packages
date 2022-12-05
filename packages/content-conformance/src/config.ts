import z from 'zod'
import { findUp } from 'find-up'
import path from 'path'
import fs from 'fs'
import { loadModuleFromFilePath, getPackageFilePath } from './utils.js'

const CONFIG_FILE_NAME = 'content-conformance.config.mjs'

const CONFIG_DEFAULTS = {
  partialsDirectory: 'content/partials',
}

const RuleLevels = z.enum(['off', 'warn', 'error'])

const RuleConfig = z.record(z.any())

const ContentConformanceConfigRule = RuleLevels.or(
  z.tuple([RuleLevels, RuleConfig])
)

const ContentConformanceConfig = z.object({
  root: z.string(),
  preset: z.string().optional(),
  contentFileGlobPattern: z.string(),
  partialsDirectory: z.string().optional(),
  dataFileGlobPattern: z.string().optional(),
  presets: z.array(z.string()).optional(),
  rules: z.record(ContentConformanceConfigRule).optional(),
})

export type RuleLevels = z.infer<typeof RuleLevels>

export type RuleConfig = z.infer<typeof RuleConfig>

export type ContentConformanceConfig = z.infer<typeof ContentConformanceConfig>

export type ContentConformanceConfigRule = z.infer<
  typeof ContentConformanceConfigRule
>

/**
 * Load a content-conformance.config.js file
 */
export async function loadConfig({
  cwd = process.cwd(),
  pathToConfigOrPresetName,
  shouldValidateConfig = true,
}: {
  cwd: string
  pathToConfigOrPresetName?: string
  shouldValidateConfig?: boolean
}): Promise<ContentConformanceConfig> {
  let configPath
  if (pathToConfigOrPresetName) {
    configPath = path.resolve(cwd, pathToConfigOrPresetName)
  } else {
    configPath = await findUp(CONFIG_FILE_NAME, { cwd })
  }

  if (!configPath) {
    throw new Error(
      `[content-conformance] Config file not found: ${path.join(
        cwd,
        CONFIG_FILE_NAME
      )}`
    )
  }

  // If a config path is provided, but the resolved path doesn't exist, try and load an included preset in `./configs/`
  if (!fs.existsSync(configPath) && pathToConfigOrPresetName) {
    configPath = getPackageFilePath(`configs/${pathToConfigOrPresetName}.js`)
  }

  const importedConfig = (await loadModuleFromFilePath(configPath)).default

  // If the config has specified a preset, load it and merge the configs
  let config = await resolveConfigPreset(importedConfig, { cwd })

  if (shouldValidateConfig) {
    // TODO: catch here and return meaningful error? Maybe use parseSafe instead
    config = ContentConformanceConfig.parse(config)
  }

  config.root = resolveConfigRoot(config.root, cwd)

  applyConfigDefaults(config)

  return config
}

function applyConfigDefaults(config: ContentConformanceConfig) {
  if (!config.partialsDirectory) {
    config.partialsDirectory = CONFIG_DEFAULTS.partialsDirectory
  }
}

function resolveConfigRoot(rootValue: string, cwd: string) {
  return path.resolve(cwd, rootValue)
}

/**
 * Attempts to load a preset, if `config.preset` is defined, and merge them. The loaded config takes precedence over the preset.
 */
async function resolveConfigPreset(
  config: ContentConformanceConfig,
  { cwd }: { cwd: string }
) {
  if ('preset' in config) {
    const loadedPreset = await loadConfig({
      cwd,
      pathToConfigOrPresetName: config.preset,
      shouldValidateConfig: false,
    })

    const configWithPreset = {
      ...loadedPreset,
      ...config,
      rules: {
        ...loadedPreset.rules,
        ...config.rules,
      },
    }

    return configWithPreset
  }

  return config
}
