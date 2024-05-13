/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import visit from 'unist-util-visit'
import surfaceNewlines from './surface-newlines'

import type { Node } from 'unist'
import type { Element } from 'hast'

/**
 * Visits code elements, and ensures newlines are
 * surfaced as top-level children, rather than nested
 * within tokens as refractor does by default
 */
export default function rehypeSurfaceCodeNewlines() {
  return function transformer(tree: Node): void {
    visit(tree, 'element', (node: Element) => {
      // We're looking for code elements
      // (note these are distinct from `inlineCode` elements)
      if (node.tagName !== 'code') return
      // The code element must have children
      if (!node.children || node.children.length === 0) return
      // Surface newlines, re-assigning to the children prop
      node.children = surfaceNewlines(node.children)
    })
  }
}
