/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { visit } from 'unist-util-visit'

export default function typographyPlugin(options = {}) {
  function getClassName(elemKey) {
    const defaultMap = {
      h1: 'g-type-display-2',
      h2: 'g-type-display-3',
      h3: 'g-type-display-4',
      h4: 'g-type-display-5',
      h5: 'g-type-display-6',
      h6: 'g-type-label',
      p: 'g-type-long-body',
      li: 'g-type-long-body',
    }
    const customMap = options.map || {}
    return typeof customMap[elemKey] === 'string'
      ? customMap[elemKey]
      : defaultMap[elemKey]
  }

  function addClassName(node, className) {
    if (!className) return true
    const data = node.data || (node.data = {})
    const props = data.hProperties || (data.hProperties = {})
    data.id = className
    props.className = className
  }

  return function transformer(tree) {
    // Add typography classes to headings
    visit(tree, 'heading', (node) => {
      addClassName(node, getClassName(`h${node.depth}`))
    })

    // Add typography classes to paragraph text
    visit(tree, 'paragraph', (node) => {
      addClassName(node, getClassName('p'))
    })

    // Add typography classes to list items
    visit(tree, 'listItem', (node) => {
      addClassName(node, getClassName('li'))
    })
  }
}
