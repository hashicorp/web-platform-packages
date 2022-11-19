import url from 'url'
import path from 'path'
import { lintRule } from 'unified-lint-rule'
import { loadModuleFromFilePath } from './utils.js'
import type { ConformanceRuleBase, LoadedConformanceRule } from './types.js'
import type { ContentConformanceConfig, RuleLevels } from './config.js'

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
export async function loadRules(
  rules: Pick<ContentConformanceConfig, 'rules'>,
  cwd: string = process.cwd()
): Promise<LoadedConformanceRule[]> {
  // TODO: validate rule structure?

  const loadedRules = []

  for (const [ruleNameOrPath, ruleSettings] of Object.entries(rules)) {
    let level: RuleLevels = 'error'
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

    // Decorate the rule with the level provided in config
    const promise: Promise<LoadedConformanceRule> = loadRule(ruleNameOrPath, {
      ruleConfig,
      cwd,
    }).then((rule) => ({
      ...rule,
      level,
    }))

    loadedRules.push(promise)
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
): Promise<ConformanceRuleBase> {
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

/**
 * Converts a remark-lint rule created using `unified-lint-rule` into the rule format expected by our system.
 */
export function convertRemarkLintRule(
  rule: ReturnType<typeof lintRule>,
  level: RuleLevels,
  ruleConfig?: $TSFixMe
): LoadedConformanceRule | undefined {
  /**
   * remark-lint rules are effectively remark/unified plugins that accept a specific config/options format. Here we are unwrapping the plugin method by passing it the proper config.
   */
  // @ts-expect-error - I think the types are off here from the unified packages, this does work.
  const ruleFn = rule([level, ruleConfig])

  if (!ruleFn) {
    console.warn(`unable to convert remark-lint rule: ${rule.name}`)
    return
  }

  const convertedRule: LoadedConformanceRule = {
    level,
    type: 'content',
    id: rule.name,
    description: '',
    executor: {
      async contentFile(file) {
        /**
         * The rule function accepts a tree, a file, and a callback. By convention remark-lint rules already handle attaching messages, so there's nothing else we need to do here to handle proper reporting.
         */
        ruleFn(file.tree(), file, () => void 0)
      },
    },
  }

  return convertedRule
}
