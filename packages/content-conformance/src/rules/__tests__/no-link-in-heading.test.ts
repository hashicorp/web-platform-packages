/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { testRule } from '../../test/utils'

import noLinkInHeading from '../no-link-in-heading'

describe('no-link-in-heading', () => {
  test('basic link in heading', () => {
    testRule(noLinkInHeading, [
      {
        fixture: '# I have a [link](/link)',
        messages: [
          `Heading with text "I have a link" contains a link with text "link". Remove the nested link, as links in headings can cause issues with anchor link generation and accessibility.`,
        ],
      },
    ])
  })

  test('no error', () => {
    testRule(noLinkInHeading, [
      {
        fixture: '# I have no link',
        messages: [],
      },
    ])
  })

  test('nested', () => {
    testRule(noLinkInHeading, [
      {
        fixture: '# I have a _nested [link](/link)_',
        messages: [
          `Heading with text "I have a nested link" contains a link with text "link". Remove the nested link, as links in headings can cause issues with anchor link generation and accessibility.`,
        ],
      },
    ])
  })
})
