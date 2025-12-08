/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import paragraphCustomAlerts from './index.js'

const compiler = unified()
  .use(remarkParse)
  .use(paragraphCustomAlerts)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true })

describe('paragraph-custom-alerts', () => {
  it('should produce the expected html output', () => {
    expect(
      compiler.processSync(`=> this is a success paragraph`).toString()
    ).toMatchInlineSnapshot(
      `"<div class="alert alert-success g-type-body"><p>this is a success paragraph</p></div>"`
    )
  })

  it('should handle multiple paragraph blocks', () => {
    const md = `this is a normal, non-alert paragraph

~> this is a warning block

this is another "normal" block

=> success block here! yeah!`
    expect(compiler.processSync(md).toString()).toMatchInlineSnapshot(`
      "<p>this is a normal, non-alert paragraph</p>
      <div class="alert alert-warning g-type-body"><p>this is a warning block</p></div>
      <p>this is another "normal" block</p>
      <div class="alert alert-success g-type-body"><p>success block here! yeah!</p></div>"
    `)
  })
})
