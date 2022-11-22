import url from 'url'
import path from 'path'
import { lintRule } from 'unified-lint-rule'
import { loadModuleFromFilePath } from './utils.js'
import type { LoadedConformanceRule } from './types.js'
import type {
  ContentConformanceConfig,
  RuleConfig,
  RuleLevels,
} from './config.js'

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
    loadedRules.push(
      loadRule(ruleNameOrPath, {
        level,
        ruleConfig,
        cwd,
      })
    )
  }

  // TODO: how do we pass a rule's configuration along?
  return (await Promise.all(loadedRules)).filter(
    Boolean
  ) as LoadedConformanceRule[]
}

export async function loadRule(
  ruleNameOrPath: string,
  {
    level,
    ruleConfig,
    cwd = process.cwd(),
  }: {
    level: RuleLevels
    ruleConfig?: RuleConfig
    cwd?: string
  }
): Promise<LoadedConformanceRule | undefined> {
  let rule

  /**
   * If the rule name starts with remark-lint-, we assume it's a remark-lint rule and attempt to load the module and convert it to our rule format.
   */
  if (ruleNameOrPath.startsWith('remark-lint-')) {
    try {
      const { default: remarkLintRule } = await import(ruleNameOrPath)

      rule = convertRemarkLintRule(remarkLintRule, level, ruleConfig)

      return rule
    } catch (error: any) {
      if (error.message.includes('Cannot find module')) {
        console.error(
          `[content-conformance] error loading remark-lint rule: ${ruleNameOrPath}. Is it installed?

  npm install --save-dev ${ruleNameOrPath}`
        )
      }
      return
    }
  }

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

  // ensure the rule severity level and any rule config get included so we can reference it when reporting
  rule.level = level
  rule.config = ruleConfig

  // TODO: handle unable to load rule
  return rule
}

/**
 * Converts a remark-lint rule created using `unified-lint-rule` into the rule format expected by our system.
 */
export function convertRemarkLintRule(
  rule: ReturnType<typeof lintRule>,
  level: RuleLevels,
  ruleConfig?: RuleConfig
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
