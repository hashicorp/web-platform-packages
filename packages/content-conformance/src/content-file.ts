import { VFile } from 'vfile'
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

  private _tree?: Readonly<Node>

  private parseContent() {
    this._tree = remark().use(remarkMdx).parse(this)
  }

  visit(test: Test, visitor: Visitor): void
  visit(visitor: Visitor): void
  visit(test: Test | Visitor, visitor?: Visitor): void {
    /**
     * Make TypeScript kind of happy by doing some loose type guarding. It's hard because the visit type definition accepts either a test and a visitor or just a visitor
     */
    if (typeof visitor === 'undefined' && typeof test === 'function') {
      unistVisit(this.tree(), test)
    } else if (typeof visitor !== 'undefined') {
      unistVisit(this.tree(), test as Test, visitor)
    }
  }

  tree() {
    /**
     * If the tree hasn't been parsed, do so lazily
     */
    if (!this._tree) {
      this.parseContent()
    }

    return this._tree!
  }
}

export function isContentFile(file: unknown): file is ContentFile {
  return (file as ContentFile).__type === 'content'
}
