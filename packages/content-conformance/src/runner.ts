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

/**
 * TODO: this will accept options that will eventually be passed as CLI args
 */
export class ContentConformanceRunner {
  private opts: RunnerOptions

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
    if (!this.engine) {
      throw new Error(
        '[content-conformance] engine instance not found, did you call runner.run()?'
      )
    }

    switch (this.opts.reporter) {
      case 'markdown': {
        // TODO: used for constructing a GitHub markdown comment
        throw new Error('not implemented!')
      }
      case 'json': {
        const report = (await import('vfile-reporter-json')).default

        return report(this.engine.files, { quiet: true })
      }
      case 'text':
      default: {
        const report = (await import('vfile-reporter')).default

        // @ts-expect-error -- need to sort out VFile types here
        return report(this.engine.files, { color: false, quiet: true })
      }
    }
  }
}
