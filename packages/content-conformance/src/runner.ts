import { ContentConformanceConfig, loadConfig } from './config.js'
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

  rules?: ConformanceRuleBase[]

  constructor(opts?: RunnerOptions) {
    this.opts = {
      cwd: opts?.cwd ?? process.cwd(),
    }
  }

  async init() {
    this.config = await loadConfig({ cwd: this.opts.cwd })
  }
}
