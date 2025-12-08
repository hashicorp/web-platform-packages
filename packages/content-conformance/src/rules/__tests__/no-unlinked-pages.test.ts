/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import { testRule } from '../../test/utils.js'

import noUnlinkedPages from '../no-unlinked-pages'

describe('no-unlinked-pages', () => {
  test('validates that content files exist in nav-data', () => {
    testRule(noUnlinkedPages, [
      {
        fixture: {
          path: 'content/docs/index.mdx',
        },
        /* no messages signals successful rule validation */
        messages: [],
        dataFiles: [
          {
            path: 'data/docs-nav-data.json',
            value: JSON.stringify([
              {
                title: 'Docs',
                routes: [
                  {
                    title: 'Overview',
                    path: '',
                  },
                ],
              },
            ]),
          },
        ],
      },
    ])
  })

  test('a file name with index in it', () => {
    testRule(noUnlinkedPages, [
      {
        fixture: {
          path: 'content/docs/foo/index-fn.mdx',
        },
        /* no messages signals successful rule validation */
        messages: [],
        dataFiles: [
          {
            path: 'data/docs-nav-data.json',
            value: JSON.stringify([
              {
                title: 'Docs',
                routes: [
                  {
                    title: 'Foo',
                    routes: [
                      {
                        title: 'index-fn',
                        path: 'foo/index-fn',
                      },
                    ],
                  },
                ],
              },
            ]),
          },
        ],
      },
    ])
  })

  test('index route', () => {
    testRule(noUnlinkedPages, [
      {
        fixture: {
          path: 'content/docs/index.mdx',
        },
        /* no messages signals successful rule validation */
        messages: [],
        dataFiles: [
          {
            path: 'data/docs-nav-data.json',
            value: JSON.stringify([
              {
                title: 'Docs',
                routes: [
                  {
                    title: 'Overview',
                    path: 'index',
                  },
                ],
              },
            ]),
          },
        ],
      },
    ])
  })

  test('root index route not required', () => {
    testRule(noUnlinkedPages, [
      {
        fixture: {
          path: 'content/docs/index.mdx',
        },
        /* no messages signals successful rule validation */
        messages: [],
        dataFiles: [
          {
            path: 'data/docs-nav-data.json',
            value: JSON.stringify([]),
          },
        ],
      },
    ])
  })

  test('nested path', () => {
    testRule(noUnlinkedPages, [
      {
        fixture: {
          path: 'content/docs/foo/bar.mdx',
        },
        /* no messages signals successful rule validation */
        messages: [],
        dataFiles: [
          {
            path: 'data/docs-nav-data.json',
            value: JSON.stringify([
              {
                title: 'Docs',
                routes: [
                  {
                    title: 'Foo Bar',
                    path: 'foo/bar',
                  },
                ],
              },
            ]),
          },
        ],
      },
    ])
  })

  test('file not in nav-data', () => {
    testRule(noUnlinkedPages, [
      {
        fixture: {
          path: 'content/docs/foo/bar.mdx',
        },
        messages: [
          `This file is not present in the nav data file at data/docs-nav-data.json. Either add a path that maps to this file in the nav data or remove the file. If you want the page to exist but not be linked in the navigation, add a \`hidden\` property to the associated nav node.`,
        ],
        dataFiles: [
          {
            path: 'data/docs-nav-data.json',
            value: JSON.stringify([
              {
                title: 'Docs',
                routes: [
                  {
                    title: 'Foo',
                    path: 'foo',
                  },
                ],
              },
            ]),
          },
          {
            path: 'data/api-docs-nav-data.json',
            value: JSON.stringify([
              {
                title: 'API Docs',
                routes: [
                  {
                    title: 'Foo',
                    path: 'foo/bar',
                  },
                ],
              },
            ]),
          },
        ],
      },
    ])
  })

  test('developer relative paths', () => {
    testRule(noUnlinkedPages, [
      {
        fixture: {
          path: 'content/docs/index.mdx',
        },
        /* no messages signals successful rule validation */
        messages: [],
        dataFiles: [
          {
            path: 'data/docs-nav-data.json',
            value: JSON.stringify([
              {
                title: 'Docs',
                routes: [
                  {
                    title: 'Overview',
                    path: '/waypoint/docs',
                  },
                ],
              },
            ]),
          },
        ],
      },
    ])
  })

  test('developer-relative file not in nav-data', () => {
    testRule(noUnlinkedPages, [
      {
        fixture: {
          path: 'content/docs/foo/bar.mdx',
        },
        messages: [
          `This file is not present in the nav data file at data/docs-nav-data.json. Either add a path that maps to this file in the nav data or remove the file. If you want the page to exist but not be linked in the navigation, add a \`hidden\` property to the associated nav node.`,
        ],
        dataFiles: [
          {
            path: 'data/docs-nav-data.json',
            value: JSON.stringify([
              {
                title: 'Docs',
                routes: [
                  {
                    title: 'Foo',
                    path: '/waypoint/docs/foo',
                  },
                ],
              },
            ]),
          },
          {
            path: 'data/api-docs-nav-data.json',
            value: JSON.stringify([
              {
                title: 'API Docs',
                routes: [
                  {
                    title: 'Foo',
                    path: 'waypoint/api-docs/foo/bar',
                  },
                ],
              },
            ]),
          },
        ],
      },
    ])
  })
})
