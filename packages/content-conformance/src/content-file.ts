import { VFile, type Compatible } from 'vfile'
import { matter } from 'vfile-matter'
import { LineCounter as YamlLineCounter } from 'yaml'
import remark from 'remark'
// @ts-expect-error - remark-mdx@1.6.22 has no types
import remarkMdx from 'remark-mdx'
import { visit as unistVisit } from 'unist-util-visit'

import type { Visitor } from 'unist-util-visit'
import type { Test } from 'unist-util-is'
import type { Node } from 'unist'

/**
 * Represents a file with content that is processed by our content workflows (today: MDX)
 *
 * Notes:
 * - AST would get lazily parsed when first needed, re-used for subsequent visits
 * - To start, the system will not support writes, strictly read-only
 * - Is memory going to be an issue if we're checking a large amount of files? (e.g. tutorials)
 */
export class ContentFile extends VFile {
  __type = 'content' as const

  constructor(value: Compatible) {
    super(value)
    this.parseFrontmatter()
  }

  private tree?: Readonly<Node>

  private parseContent() {
    this.tree = remark().use(remarkMdx).parse(this)
  }

  private parseFrontmatter() {
    const lineCounter = new YamlLineCounter()
    // @ts-expect-error - this.content is required by vfile-matter
    // at compile-time but not at run-time
    matter(this, {
      strip: true,
      yaml: { lineCounter },
    })

    // if newlines are detected in frontmatter, prepend N+2 empty new lines
    // so that content line number reporting remains accurate.
    if (lineCounter.lineStarts.length > 0) {
      this.value = `\n`.repeat(lineCounter.lineStarts.length + 2) + this.value
    }
  }

  visit(test: Test, visitor: Visitor): void
  visit(visitor: Visitor): void
  visit(test: Test | Visitor, visitor?: Visitor): void {
    /**
     * If the tree hasn't been parsed, do so lazily
     */
    if (!this.tree) {
      this.parseContent()
    }

    /**
     * Make TypeScript kind of happy by doing some loose type guarding. It's hard because the visit type definition accepts either a test and a visitor or just a visitor
     */
    if (typeof visitor === 'undefined' && typeof test === 'function') {
      unistVisit(this.tree!, test)
    } else if (typeof visitor !== 'undefined') {
      unistVisit(this.tree!, test as Test, visitor)
    }
  }

  frontmatter(): Record<string, unknown> {
    // @ts-expect-error - the matter property on data is injected by `vfile-matter`
    return this.data.matter
  }
}

export function isContentFile(file: unknown): file is ContentFile {
  return (file as ContentFile).__type === 'content'
}
