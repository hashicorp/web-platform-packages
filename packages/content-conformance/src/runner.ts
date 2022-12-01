import report from 'vfile-reporter'
import { statistics, Statistics } from 'vfile-statistics'
import path from 'path'

import { ContentConformanceConfig, loadConfig } from './config.js'
import { ContentConformanceEngine } from './engine.js'
import { loadRules } from './rules.js'
import type { LoadedConformanceRule } from './types.js'

interface RunnerOptions {
  cwd?: string
  config?: string
  files?: string[]
}

export enum RunnerStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  RUNNING = 'RUNNING',
}

/**
 * TODO: this will accept options that will eventually be passed as CLI args
 */
export class ContentConformanceRunner {
  private opts: RunnerOptions

  status?: keyof typeof RunnerStatus

  config?: ContentConformanceConfig

  rules: LoadedConformanceRule[] = []

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

  getStatisticsStatus(statistics: Statistics, warnThreshold?: number) {
    if (
      statistics.fatal > 0 ||
      (warnThreshold && statistics.warn >= warnThreshold)
    ) {
      return RunnerStatus.FAILURE
    }

    return RunnerStatus.SUCCESS
  }

  /**
   * TODO: Determine best ways to surface warnThreshold to user & default warnThreshold
   */
  async run() {
    if (this.status === RunnerStatus.RUNNING) return null

    // @ts-expect-error -- need to sort out VFile types here as well
    const _statistics = statistics(this.engine?.files)

    this.status = RunnerStatus.RUNNING
    try {
      await this.engine?.execute()
    } catch {
      this.status = RunnerStatus.FAILURE
    }

    /**
     * check vFile-statistics for fatal messages, optionally pass in a warning count threshold
     * getStatisticsStatus(statistics, warnThreshold)
     */
    this.status = this.getStatisticsStatus(_statistics)
  }

  /**
   * TODO: support arbitrary reporters
   */
  report() {
    // @ts-expect-error -- need to sort out VFile types here
    return report(this.engine?.files, { color: false })
  }
}
