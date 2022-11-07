import report from 'vfile-reporter'

import { ContentConformanceConfig, loadConfig } from './config.js'
import { ContentConformanceEngine } from './engine.js'
import { loadRules } from './rules.js'
import { ConformanceRuleBase } from './types.js'

interface RunnerOptions {
  cwd?: string
}

/**
 * TODO: this will accept options that will eventually be passed as CLI args
 */
export class ContentConformanceRunner {
  private opts: Required<RunnerOptions>

  config?: ContentConformanceConfig

  rules: ConformanceRuleBase[] = []

  engine?: ContentConformanceEngine

  constructor(opts?: RunnerOptions) {
    this.opts = {
      cwd: opts?.cwd ?? process.cwd(),
    }
  }

  async init() {
    this.config = await loadConfig({ cwd: this.opts.cwd })

    if (this.config.rules) {
      this.rules = await loadRules(this.config.rules, this.opts.cwd)
    }

    this.engine = new ContentConformanceEngine({
      ...this.config,
      rules: this.rules,
    })
  }

  async run() {
    return this.engine?.execute()
  }

  /**
   * TODO: support arbitrary reporters
   */
  async report() {
    // @ts-expect-error -- need to sort out VFile types here
    return report(this.engine?.files, { color: false })
  }
}
