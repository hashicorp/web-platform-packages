import fs from 'fs'
import path from 'path'
import { globbyStream } from 'globby'
import type { Node } from 'unist'
import { ContentFile } from './content-file.js'

import type {
  ConformanceRuleContext,
  ContentConformanceFile,
  DataFile,
  LoadedConformanceRule,
} from './types.js'
import { ContentConformanceConfig } from './config.js'

interface ContentConformanceEngineOptions
  extends Omit<ContentConformanceConfig, 'rules'> {
  rules: LoadedConformanceRule[]

  /**
   * Only load the specified files
   */
  files?: string[]
}

export class ContentConformanceEngine {
  private opts: Omit<ContentConformanceEngineOptions, 'rules'>

  private contentFiles: ContentFile[] = []

  private dataFiles: DataFile[] = []

  private rules: LoadedConformanceRule[] = []

  constructor(opts: ContentConformanceEngineOptions) {
    const { rules, ...restOpts } = opts
    console.log(opts)

    this.opts = restOpts
    this.rules = opts.rules ?? []
  }

  async loadContentFiles() {
    for await (const filepath of globbyStream(
      this.opts.contentFileGlobPattern,
      {
        onlyFiles: true,
        cwd: this.opts.root,
      }
    )) {
      // If an array of filepaths are provided, only load the file if it matches one of the provided paths
      if (
        this.opts.files?.length &&
        !this.opts.files.includes(String(filepath))
      ) {
        continue
      }

      const fullPath = path.join(this.opts.root, String(filepath))
      const contents = await fs.promises.readFile(fullPath, 'utf-8')

      const file = new ContentFile({
        cwd: this.opts.root,
        path: String(filepath),
        value: contents,
      })
      this.contentFiles.push(file)
    }
  }

  getContext(rule: LoadedConformanceRule): ConformanceRuleContext {
    return {
      contentFiles: this.contentFiles,
      dataFiles: this.dataFiles,
      report(message: string, file?: ContentConformanceFile, node?: Node) {
        if (file) {
          const fileMessage = file.message(message, node, rule.id)

          if (rule.level === 'error') {
            fileMessage.fatal = true
          }
        }
      },
    }
  }

  /**
   * TODO: think about a way to parallelize the work here. Threads / workers might be something to consider, but we rely on shared memory.
   * Potentially segment out the files to be checked and instantiate the *File classes in each worker. Would need to aggregate the results of the reporter
   * back into the main thread.
   */
  async execute(): Promise<void> {
    // load files
    // TODO: will this scale? We're loading every file into memory
    await this.loadContentFiles()
    // await this.loadDataFiles()

    const promises = []

    for (const file of this.contentFiles) {
      promises.push(this.checkFile(file))
    }

    for (const file of this.dataFiles) {
      promises.push(this.checkFile(file))
    }

    await Promise.all(promises)
  }

  async checkFile(file: ContentConformanceFile): Promise<void> {
    const promises = []

    for (const rule of this.rules) {
      promises.push(this.executeRule(rule, file))
    }

    await Promise.all(promises)
  }

  /**
   * Execute a conformance rule against the provided file. Based on the file type, uses the contentFile or dataFile executor
   */
  async executeRule(
    rule: LoadedConformanceRule,
    file: ContentConformanceFile
  ): Promise<void> {
    const context = this.getContext(rule)

    const promises = []

    const { contentFile, dataFile } = rule.executor

    switch (file.__type) {
      case 'content':
        if (contentFile) {
          promises.push(contentFile(file, context))
        }
        break
      case 'data':
        if (dataFile) {
          promises.push(dataFile(file, context))
        }
        break
      // TODO: handle repository executor
      default:
      // noop
    }

    await Promise.all(promises)
  }

  get files() {
    return [...this.contentFiles, ...this.dataFiles]
  }
}
