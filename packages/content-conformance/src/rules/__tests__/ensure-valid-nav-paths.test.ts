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
  test('validates nav node paths with non 1:1 subpath mappings', () => {
    testRule(ensureValidNavPaths, [
      {
        fixture: {
          path: 'cloud-docs-agents-nav-data.json',
          value: JSON.stringify([
            {
              heading: 'Terraform Cloud Agents',
            },
            { title: 'Overview', path: '' },
            { title: 'Requirements', path: 'requirements' },
          ]),
        },
        /* no messages signals successful rule validation */
        messages: [],
        contentFiles: [
          { path: 'docs/cloud-docs/agents/index.mdx' },
          { path: 'docs/cloud-docs/agents/requirements.mdx' },
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
          'Failed to ensure valid nav paths exist. A nav data path (upgrading) was found, but is missing a corresponding file in the website content directory. Please ensure that a (content/docs/upgrading.mdx) or (content/docs/upgrading/index.mdx) file exists.',
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
          'Failed to ensure valid nav paths exist. Both a named file (content/docs/upgrading.mdx) and an index file (content/docs/upgrading/index.mdx) were detected for a single nav data path (upgrading) in the website content directory Please ensure only one exists.',
        ],
        contentFiles: [
          { path: 'content/docs/upgrading/index.mdx' },
          { path: 'content/docs/upgrading.mdx' },
        ],
      },
    ])
  })
})
