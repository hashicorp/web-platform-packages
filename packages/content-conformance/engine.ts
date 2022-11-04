import fs from 'fs'
import path from 'path'
import { z } from 'zod'
import { globbyStream } from 'globby'
import { ContentFile } from './content-file'

import type {
  ConformanceRuleBase,
  ConformanceRuleContext,
  ContentConformanceFile,
  DataFile,
} from './types'
import type { Node } from 'unist'

const ContentConformanceRule = z.object({
  type: z.enum(['content', 'data', 'structure']),
  id: z.string(),
  description: z.string(),
  executor: z.object({
    contentFile: z.function().optional(),
    dataFile: z.function().optional(),
    repository: z.function().optional(),
  }),
})

const ContentConformanceEngineConfig = z.object({
  root: z.string(),
  contentFileGlobPattern: z.string(),
  dataFileGlobPattern: z.string().optional(),
})

type ContentConformanceEngineConfig = z.infer<
  typeof ContentConformanceEngineConfig
>

export class ContentConformanceEngine {
  private opts: ContentConformanceEngineConfig

  private contentFiles: ContentFile[] = []

  private dataFiles: DataFile[] = []

  private rules: ConformanceRuleBase[] = []

  constructor(opts: ContentConformanceEngineConfig) {
    // TODO: validate config with zod schema
    console.log(opts)
    this.opts = opts
  }

  async loadContentFiles() {
    for await (const filepath of globbyStream(
      this.opts.contentFileGlobPattern,
      {
        onlyFiles: true,
        cwd: this.opts.root,
      }
    )) {
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

  getContext(rule: ConformanceRuleBase): ConformanceRuleContext {
    return {
      contentFiles: this.contentFiles,
      dataFiles: this.dataFiles,
      report(message: string, file?: ContentConformanceFile, node?: Node) {
        if (file) {
          file.message(message, node, rule.id)
        }
      },
    }
  }

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
    rule: ConformanceRuleBase,
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

  /**
   * The below methods are for testing purposes, they should not be accessed directly
   */

  get __contentFiles() {
    return this.contentFiles
  }

  __addRule(rule: ConformanceRuleBase) {
    this.rules.push(rule)
  }
}
