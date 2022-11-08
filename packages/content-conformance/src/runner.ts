import report from 'vfile-reporter'
import path from 'path'

import { ContentConformanceConfig, loadConfig } from './config.js'
import { ContentConformanceEngine } from './engine.js'
import { loadRules } from './rules.js'
import { ConformanceRuleBase } from './types.js'

interface RunnerOptions {
  cwd?: string
  config?: string
  files?: string[]
}

/**
 * TODO: this will accept options that will eventually be passed as CLI args
 */
export class ContentConformanceRunner {
  private opts: RunnerOptions

  config?: ContentConformanceConfig

  rules: ConformanceRuleBase[] = []

  engine?: ContentConformanceEngine

  constructor(opts?: RunnerOptions) {
    this.opts = {
      config: opts?.config,
      cwd: opts?.cwd ?? process.cwd(),
      // normalize the passed in filepaths here to ensure consistent equality checks against found paths
      files: (opts?.files ?? []).map((filepath) => path.normalize(filepath)),
    }
  }

  async init() {
    this.config = await loadConfig({
      cwd: this.opts.cwd!,
      pathToConfig: this.opts.config,
    })

    if (this.config.rules) {
      this.rules = await loadRules(this.config.rules, this.opts.cwd)
    }

    this.engine = new ContentConformanceEngine({
      ...this.config,
      files: this.opts.files,
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
