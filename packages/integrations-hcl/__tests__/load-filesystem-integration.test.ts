/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

import * as path from 'path'

// bypass vercel-fetch during testing; nock-ing doesn't
// appear to work and fetch requests will cause jest to timeout
import * as fetch from 'node-fetch'
jest.mock('@vercel/fetch', () => () => fetch)

import nock from 'nock'

import LoadFilesystemIntegration from '../index'

const fixtureDir = path.join(__dirname, '__fixtures__')

describe('LoadFilesystemIntegration', () => {
  const env = process.env
  let scope: nock.Scope

  beforeAll(() => {
    scope = nock('http://localhost:5000')
    nock.disableNetConnect()
  })

  beforeEach(() => {
    process.env = { ...env }
    process.env.INPUT_INTEGRATIONS_API_BASE_URL = 'http://localhost:5000'
  })

  afterEach(() => {
    process.env = { ...env }
  })

  afterAll(() => {
    nock.cleanAll()
    nock.restore()
  })

  it('should return a release object', async () => {
    scope.get('/organizations/BrandonRomano').reply(200, {
      meta: {
        status_code: 200,
        status_text: 'OK',
      },
      result: {
        id: 'f5225571-394f-4dce-ab01-bb16d46910f8',
        slug: 'BrandonRomano',
        created_at: '2023-02-01T14:55:14.178Z',
        updated_at: '2023-02-01T14:55:14.178Z',
      },
    })
    // mock the API call to fetch the integration
    scope
      .get(
        '/products/waypoint/organizations/f5225571-394f-4dce-ab01-bb16d46910f8/integrations/docker'
      )
      .reply(200, {
        meta: {
          status_code: 200,
          status_text: 'OK',
        },
        result: {
          id: '42928403-1ab8-435e-85a2-5a8f274a5a50',
          slug: 'docker',
          name: 'Docker',
          description: 'Use Waypoint on a Docker instance.',
          license_type: 'MPL-2.0',
          license_url:
            'https://github.com/hashicorp/waypoint/blob/main/LICENSE',
          external_only: false,
          external_url: null,
          tier: 'official',
          repo_url: 'https://github.com/BrandonRomano/waypoint',
          subdirectory: '/builtin/docker',
          hide_versions: false,
          created_at: '2022-12-07T17:32:57.205Z',
          updated_at: '2022-12-07T17:33:26.875Z',
          organization: {
            id: 'd5259f5b-b6e9-48d4-861c-39281c55f3df',
            slug: 'BrandonRomano',
            created_at: '2022-12-07T17:32:56.942Z',
            updated_at: '2022-12-07T17:32:56.942Z',
          },
          product: {
            id: '68c85272-e2bf-4330-aa43-4ce4e6d899ee',
            slug: 'waypoint',
            name: 'Waypoint',
            created_at: '2022-12-07T17:32:56.744Z',
            updated_at: '2022-12-07T17:32:56.744Z',
          },
          versions: ['0.0.1'],
          components: [
            {
              id: '0e596da5-dd4a-4ce0-9b45-535046d7a65c',
              slug: 'builder',
              name: 'Builder',
              plural_name: 'Builders',
            },
            {
              id: 'eaf5a966-8a56-4b75-a76f-f40c874037de',
              slug: 'platform',
              name: 'Platform',
              plural_name: 'Platforms',
            },
            {
              id: '38804bd2-8484-4cf7-ac30-437c54cb34fb',
              slug: 'registry',
              name: 'Registry',
              plural_name: 'Registries',
            },
            {
              id: 'e392f368-325f-4014-ace4-e5e87ee351c8',
              slug: 'task',
              name: 'Task',
              plural_name: 'Tasks',
            },
          ],
          flags: [
            {
              id: 'd2a85dd2-1cca-4ce9-8f88-fef3c8dd0510',
              slug: 'builtin',
              name: 'Builtin',
              description:
                'This integration is shipped in the core product and does not need to be installed.',
              created_at: '2022-12-07T17:32:56.770Z',
              updated_at: '2022-12-07T17:32:56.770Z',
            },
          ],
        },
      })

    // mock the API call to fetch variable-group-configs
    scope
      .get('/products/waypoint/variable-group-configs?limit=100')
      .reply(200, {
        meta: {
          status_code: 200,
          status_text: 'OK',
        },
        result: [
          {
            id: '263c5c35-8751-466c-aa7a-7f1a76973bd6',
            product_id: '68c85272-e2bf-4330-aa43-4ce4e6d899ee',
            name: 'Parameters',
            filename: 'parameters.hcl',
            stanza: 'parameter',
            display_order: 1,
            created_at: '2022-12-07T17:33:00.042Z',
            updated_at: '2022-12-07T17:33:00.042Z',
          },
          {
            id: '917f7cae-7d3e-426c-97e0-cbbda32a6d5a',
            product_id: '68c85272-e2bf-4330-aa43-4ce4e6d899ee',
            name: 'Outputs',
            filename: 'outputs.hcl',
            stanza: 'output',
            display_order: 2,
            created_at: '2022-12-07T17:33:00.047Z',
            updated_at: '2022-12-07T17:33:00.047Z',
          },
        ],
      })

    const result = await LoadFilesystemIntegration({
      identifier: 'waypoint/BrandonRomano/docker',
      repo_path: path.join(fixtureDir, 'waypoint'),
      version: '0.0.0',
    })

    expect(scope.isDone()).toBe(true)
    expect(result).toMatchInlineSnapshot(`
      {
        "current_release": {
          "components": [
            {
              "name": "Docker Builder",
              "readme": null,
              "slug": "docker-builder",
              "type": "builder",
              "variable_groups": [],
            },
            {
              "name": "Docker Platform",
              "readme": null,
              "slug": "docker-platform",
              "type": "platform",
              "variable_groups": [],
            },
            {
              "name": "Docker Registry",
              "readme": null,
              "slug": "docker-registry",
              "type": "registry",
              "variable_groups": [],
            },
            {
              "name": "Docker Task",
              "readme": null,
              "slug": "docker-task",
              "type": "task",
              "variable_groups": [],
            },
          ],
          "readme": "# README
      ",
          "version": "0.0.0",
        },
        "description": "Use Waypoint on a Docker instance.",
        "docs": {
          "external_url": null,
          "process_docs": true,
          "readme_location": "./README.md",
        },
        "flags": [
          "builtin",
        ],
        "hide_versions": false,
        "id": "42928403-1ab8-435e-85a2-5a8f274a5a50",
        "identifier": "waypoint/docker",
        "integration_type": null,
        "license": {
          "type": "MPL-2.0",
          "url": "https://github.com/hashicorp/waypoint/blob/main/LICENSE",
        },
        "name": "Docker",
        "product": "waypoint",
      }
    `)
  })

  it.each([
    // fixure directory, error regexp
    ['incorrect-path', /The following metadata.hcl path/i],
    ['forgot-to-checkout', /No metadata.hcl file was found/i],
  ] as const)(
    'should return a useful error if metadata.hcl could not be found',
    async (testDir, errorRegExp) => {
      // mock the API call to fetch the organization
      scope.get('/organizations/BrandonRomano').reply(200, {
        meta: {
          status_code: 200,
          status_text: 'OK',
        },
        result: {
          id: 'f5225571-394f-4dce-ab01-bb16d46910f8',
        },
      })

      // mock the API call to fetch the integration
      scope
        .get(
          '/products/waypoint/organizations/f5225571-394f-4dce-ab01-bb16d46910f8/integrations/docker'
        )
        .reply(200, {
          meta: {
            status_code: 200,
            status_text: 'OK',
          },
          result: {},
        })

      await expect(() =>
        LoadFilesystemIntegration({
          identifier: 'waypoint/BrandonRomano/docker',
          repo_path: path.join(fixtureDir, testDir),
          version: '0.0.0',
        })
      ).rejects.toThrow(errorRegExp)
    }
  )
})
