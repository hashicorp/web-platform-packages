/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { statistics, Statistics } from 'vfile-statistics'
import path from 'path'

import { ContentConformanceConfig, loadConfig } from './config.js'
import { ContentConformanceEngine } from './engine.js'
import { loadRules } from './rules.js'
import type { LoadedConformanceRule } from './types.js'

type Reporter = 'text' | 'json' | 'markdown'

interface RunnerOptions {
  cwd?: string
  config?: string
  files?: string[]
  reporter?: Reporter
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
      reporter: opts?.reporter ?? 'text',
    }
  }

  async init() {
    this.config = await loadConfig({
      cwd: this.opts.cwd!,
      pathToConfigOrPresetName: this.opts.config,
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

    this.status = RunnerStatus.RUNNING
    try {
      await this.engine?.execute()

      /**
       * check vFile-statistics for fatal messages, optionally pass in a warning count threshold
       * getStatisticsStatus(statistics, warnThreshold)
       */
      // @ts-expect-error -- need to sort out VFile types here as well
      const _statistics = statistics(this.engine?.files)
      this.status = this.getStatisticsStatus(_statistics)
    } catch {
      this.status = RunnerStatus.FAILURE
    }
  }

  /**
   * TODO: support arbitrary reporters
   */
  async report() {
    if (!this.engine) {
      throw new Error(
        '[content-conformance] engine instance not found, did you call runner.run()?'
      )
    }

    switch (this.opts.reporter) {
      case 'markdown': {
        const report = (await import('./reporters/markdown-reporter.js'))
          .markdownReporter

        return report(this.engine.files)
      }
      case 'json': {
        const report = (await import('vfile-reporter-json')).default

        return report(this.engine.files, { quiet: true })
      }
      case 'text':
      default: {
        const report = (await import('vfile-reporter')).default

        // @ts-expect-error -- need to sort out VFile types here
        return report(this.engine.files, {
          // no color when running tests so the output can be snapshot
          color: process.env.NODE_ENV === 'test' ? false : null,
          quiet: true,
        })
      }
    }
  }
}
