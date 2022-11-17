import type { VFile } from 'vfile'
import type { Node } from 'unist'
import { ContentFile } from './content-file.js'
import type { RuleLevels } from './config.js'

type ConformanceRuleType = 'content' | 'data' | 'structure'

/**
 * Rule structure
 */
export interface ConformanceRuleBase {
  type: ConformanceRuleType
  id: string
  description: string
  executor: ConformanceRuleExecutor
}

/**
 * Loaded rules will get decorated with additional information from the conformance config file (level, rule config)
 */
export interface LoadedConformanceRule extends ConformanceRuleBase {
  level: RuleLevels
}

export interface ConformanceRuleContent extends ConformanceRuleBase {
  type: 'content'
}

export interface ConformanceRuleStructure extends ConformanceRuleBase {
  type: 'structure'
}

export interface ConformanceRuleData extends ConformanceRuleBase {
  type: 'data'
}

/**
 * Represents a file with data. Potentially JSON, YAML, or some other serializable data type. Docs nav data is an example of this
 */
export interface DataFile extends VFile {
  __type: 'data'
}

export type ContentConformanceFile = ContentFile | DataFile

/**
 * Rule context
 */
export interface ConformanceRuleContext {
  contentFiles?: ContentFile[]
  dataFiles?: DataFile[]
  report(message: string, file?: ContentConformanceFile, node?: Node): void
}

/**
 * Functions that actually executes the rule's logic. Accepts a visitor for content files, data files, and the repository. At least one visitor should be defined.
 *
 * TOOD: asset file visitor?
 */
export interface ConformanceRuleExecutor {
  contentFile?(
    file: ContentFile,
    context: ConformanceRuleContext
  ): Promise<void>
  dataFile?(file: DataFile, context: ConformanceRuleContext): Promise<void>
  repository?(context: ConformanceRuleContent): Promise<void>
}
