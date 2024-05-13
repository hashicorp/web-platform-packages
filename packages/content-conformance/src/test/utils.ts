/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import path from 'path'
import url from 'url'
import { VFileCompatible } from 'vfile'
import { ContentFile } from '../content-file.js'
import { DataFile } from '../data-file.js'
import { ConformanceRuleBase, ConformanceRuleContext } from '../types.js'

export const currentFilePath = url.fileURLToPath(new URL(import.meta.url))

export function getFixturePath(fixtureName: string) {
  return path.join(
    path.dirname(currentFilePath),
    '..',
    '__tests__',
    '__fixtures__',
    fixtureName
  )
}

function makeTestFileAndContext(
  rule: ConformanceRuleBase,
  fixture: VFileCompatible,
  contentFiles: VFileCompatible[] = [],
  dataFiles: VFileCompatible[] = [],
  config?: Record<string, any>
) {
  let file
  const context: ConformanceRuleContext = {
    dataFiles: dataFiles.map((e) => new DataFile(e)),
    contentFiles: contentFiles.map((e) => new ContentFile(e)),
    report: () => {
      void 0
    },
    config,
  }

  switch (rule.type) {
    case 'data': {
      file = new DataFile(fixture)
      context.dataFiles = [file]
      break
    }
    default:
    case 'content': {
      file = new ContentFile(fixture)
      context.contentFiles = [file]
      break
    }
  }

  context.report = (message, file, node) => {
    if (file) {
      file.message(message, node, rule.id)
    }
  }

  return [file, context] as const
}

/**
 * A test helper to write assertions against a conformance rule.
 *
 * Usage:
 *
 * ```js
 * testRule(myRule, [{ fixture: JSON.stringify([]), messages: ['No empty array'] }])
 * ```
 */
export function testRule(
  rule: ConformanceRuleBase,
  testCases: {
    fixture: VFileCompatible
    messages: (string | RegExp)[]
    contentFiles?: VFileCompatible[]
    dataFiles?: VFileCompatible[]
  }[],
  config?: Record<string, any>
) {
  function test(testCase: typeof testCases[number]) {
    const [file, context] = makeTestFileAndContext(
      rule,
      testCase.fixture,
      testCase.contentFiles,
      testCase.dataFiles,
      config
    )

    switch (rule.type) {
      case 'data': {
        rule.executor?.dataFile?.(
          file as DataFile,
          context as ConformanceRuleContext
        )
        break
      }
      case 'content': {
        rule.executor?.contentFile?.(
          file as ContentFile,
          context as ConformanceRuleContext
        )
      }
    }

    // Handle the case where messages is empty, indicating we aren't expecting any messages to be reported.
    if (testCase.messages.length === 0 && file.messages.length > 0) {
      const err = new Error(`Expected no reported messages, but found:
${file.messages.map(({ reason }) => `\t- ${reason}`).join('\n')}`)
      err.stack = undefined

      throw err
    }

    expect(() => {
      testCase.messages.every((message: string | RegExp) => {
        const match = file.messages.some((msg) => {
          if (typeof message === 'string') {
            return msg.reason === message
          } else {
            return msg.message.match(message)
          }
        })

        if (!match) {
          const err = new Error(
            `\nexpected reported messages:
${file.messages.map(({ reason }) => `\t- ${reason}`).join('\n')}
to contain message matching:
  ${message}`
          )

          err.stack = undefined

          throw err
        }
      })
    }).not.toThrow()
  }

  for (const testCase of testCases) {
    test(testCase)
  }
}
