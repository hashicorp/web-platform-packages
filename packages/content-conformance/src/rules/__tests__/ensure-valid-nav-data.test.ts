/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { testRule } from '../../test/utils.js'

import ensureValidNavData from '../ensure-valid-nav-data.js'

describe('ensure-valid-nav-data', () => {
  test('ignores files that do not end in nav-data.json', () => {
    testRule(ensureValidNavData, [
      {
        fixture: {
          path: 'something-else.json',
          value: JSON.stringify([]),
        },
        messages: [],
      },
    ])
  })

  test('empty nav data', () => {
    testRule(ensureValidNavData, [
      {
        fixture: {
          path: 'nav-data.json',
          value: JSON.stringify([]),
        },
        messages: [
          'Found empty array of navNodes at depth 0. There must be more than one route.',
        ],
      },
    ])
  })

  test('empty routes', () => {
    testRule(ensureValidNavData, [
      {
        fixture: {
          path: 'nav-data.json',
          value: JSON.stringify([
            {
              title: 'Directory',
              routes: [],
            },
          ]),
        },
        messages: [
          'Found empty array of navNodes at depth 1. There must be more than one route.',
        ],
      },
    ])
  })

  test('missing title', () => {
    testRule(ensureValidNavData, [
      {
        fixture: {
          path: 'nav-data.json',
          value: JSON.stringify([
            {
              title: 'Directory',
              routes: [
                {
                  path: '/about',
                },
              ],
            },
          ]),
        },
        messages: [
          'Missing nav-data title. Please add a non-empty title to the node with the path "/about".',
        ],
      },
    ])
  })

  test('sibling routes with different parents', () => {
    testRule(ensureValidNavData, [
      {
        fixture: {
          path: 'nav-data.json',
          value: JSON.stringify([
            {
              title: 'Directory',
              routes: [
                {
                  title: 'Overview',
                  path: 'directory',
                },
                {
                  title: 'Valid Parent',
                  path: 'directory/some-file',
                },
                {
                  title: 'Invalid Parent',
                  path: 'another-directory/another-file',
                },
              ],
            },
          ]),
        },
        messages: [
          `Found mismatched paths at depth 1, with paths: ["directory","directory/some-file","another-directory/another-file"]. Implies mismatched parent directories: ["directory","another-directory"].`,
        ],
      },
    ])
  })

  test('duplicate routes', () => {
    testRule(ensureValidNavData, [
      {
        fixture: {
          path: 'nav-data.json',
          value: JSON.stringify([
            {
              title: 'Directory Dupe',
              path: 'directory',
            },
            {
              title: 'Directory',
              routes: [
                {
                  title: 'Overview',
                  path: 'directory',
                },
                {
                  title: 'Some File',
                  path: 'directory/some-file',
                },
              ],
            },
          ]),
        },
        messages: [
          `Duplicate routes found for "directory". Please resolve duplicates.`,
        ],
      },
    ])
  })

  test('empty href', () => {
    testRule(ensureValidNavData, [
      {
        fixture: {
          path: 'nav-data.json',
          value: JSON.stringify([
            {
              title: 'Empty Href Link',
              href: '',
            },
          ]),
        },
        messages: [
          `Empty href value on NavDirectLink. href values must be non-empty strings. Node: {"title":"Empty Href Link","href":""}.`,
        ],
      },
    ])
  })
})
