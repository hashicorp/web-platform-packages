import url from 'url'
import path from 'path'
import { loadModuleFromFilePath } from './utils.js'

const currentFilePath = url.fileURLToPath(new URL(import.meta.url))

/**
 * Rules are loaded from rules defined in a config file. Rule level can be off | warn | error. Rules can accept a config object.
 *
 * Notes:
 * - Can be defined in this package (internal)
 * - Can be defined in presets (internal to preset, maybe external?)
 * - Can be local to project being checked
 * - Can be external (remark-link plugins?)
 */
export async function loadRules(rules: $TSFixMe, cwd: string = process.cwd()) {
  // rules are an object?
  // TODO: validate rule structure?

  const loadedRules = []

  for (const [ruleNameOrPath, ruleSettings] of Object.entries(rules)) {
    let level
    let ruleConfig

    if (typeof ruleSettings === 'string') {
      // just the rule level
      level = ruleSettings
    } else if (Array.isArray(ruleSettings)) {
      level = ruleSettings[0]
      ruleConfig = ruleSettings[1]
    }

    if (level === 'off') {
      // don't load the rule if it's set to "off"
      continue
    }

    loadedRules.push(loadRule(ruleNameOrPath, { ruleConfig, cwd }))
  }

  // TODO: how do we pass a rule's configuration along?
  return Promise.all(loadedRules)
}

export async function loadRule(
  ruleNameOrPath: string,
  {
    ruleConfig,
    cwd = process.cwd(),
  }: {
    ruleConfig?: unknown
    cwd?: string
  } = {}
) {
  let rule

  // internal rule
  try {
    const internalRulePath = path.join(
      path.dirname(currentFilePath),
      'rules',
      ruleNameOrPath
    )

    const { default: internalRule } = await loadModuleFromFilePath(
      internalRulePath
    )

    if (!internalRule) {
      console.log(
        `[content-conformance] internal rule ${ruleNameOrPath} found, but no default export exists.`
      )
    }

    rule = internalRule
  } catch (err) {
    // internal rule not found
  }

  // local rule -- expected to be a fully qualified path, OR a path relative to the directory we are executing in

  // fully qualified
  try {
    const { default: localRule } = await loadModuleFromFilePath(ruleNameOrPath)

    if (!localRule) {
      console.log(
        `[content-conformance] local rule ${ruleNameOrPath} found, but no default export exists.`
      )
    }

    rule = localRule
  } catch (err) {
    // local rule - fully qualified not found
  }

  // relative
  try {
    const relativeLocalRulePath = path.join(cwd, ruleNameOrPath)

    const { default: localRule } = await loadModuleFromFilePath(
      relativeLocalRulePath
    )

    if (!localRule) {
      console.log(
        `[content-conformance] local rule ${ruleNameOrPath} found, but no default export exists.`
      )
    }

    rule = localRule
  } catch (err) {
    // local rule - relative not found
  }

  // TODO: handle unable to load rule
  return rule
}
