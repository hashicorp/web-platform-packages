import { testRule } from '../../test/utils.js'

import ensureValidNavPaths from '../ensure-valid-nav-paths'

describe('ensure-valid-nav-paths', () => {
  test('validates nav node paths with content file paths', () => {
    testRule(ensureValidNavPaths, [
      {
        fixture: {
          path: 'docs-nav-data.json',
          value: JSON.stringify([
            {
              title: 'Upgrading Waypoint',
              routes: [
                { path: 'upgrading' },
                { path: 'upgrading/compatibility' },
                {
                  routes: [
                    { path: 'upgrading/version-guides' },
                    { path: 'upgrading/version-guides/0.10.0' },
                  ],
                },
              ],
            },
          ]),
        },
        /* no messages signals successful rule validation */
        messages: [],
        contentFiles: [
          { path: 'content/docs/upgrading/index.mdx' },
          { path: 'content/docs/upgrading/compatibility.mdx' },
          { path: 'content/docs/upgrading/version-guides/index.mdx' },
          { path: 'content/docs/upgrading/version-guides/0.10.0.mdx' },
        ],
      },
    ])
  })
  test('reports when nav nodes are missing an associated content file', () => {
    testRule(ensureValidNavPaths, [
      {
        fixture: {
          path: 'data/docs-nav-data.json',
          value: JSON.stringify([
            {
              title: 'Upgrading Waypoint',
              routes: [
                { path: 'upgrading' },
                { path: 'upgrading/compatibility' },
                {
                  routes: [
                    { path: 'upgrading/version-guides' },
                    { path: 'upgrading/version-guides/0.10.0' },
                  ],
                },
              ],
            },
          ]),
        },
        messages: [
          'NavData path (upgrading) is missing a corresponding file in the content directory',
        ],
        contentFiles: [
          { path: 'content/docs/upgrading/compatibility.mdx' },
          { path: 'content/docs/upgrading/version-guides/index.mdx' },
          { path: 'content/docs/upgrading/version-guides/0.10.0.mdx' },
        ],
      },
    ])
  })
  test('reports when nav nodes have a matching named and index file', () => {
    testRule(ensureValidNavPaths, [
      {
        fixture: {
          path: 'data/docs-nav-data.json',
          value: JSON.stringify([
            {
              title: 'Upgrading Waypoint',
              routes: [{ path: 'upgrading' }],
            },
          ]),
        },
        messages: [
          'NavData path (upgrading) should not have both a named file and an index file in the content directory',
        ],
        contentFiles: [
          { path: 'content/docs/upgrading/index.mdx' },
          { path: 'content/docs/upgrading.mdx' },
        ],
      },
    ])
  })
})
