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

  beforeAll(() => {
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
    const scope = nock('http://localhost:5000')
      .get('/products/waypoint/integrations/aws-ecs')
      .reply(200, {
        meta: { status_code: 200, status_text: 'OK' },
        result: {
          id: '052c3e37-f556-4f7d-81ca-ddc8843dd600',
          slug: 'aws-ecs',
          name: null,
          description: null,
          license_type: null,
          license_url: null,
          external_only: false,
          external_url: null,
          tier: 'official',
          repo_url: 'https://github.com/hashicorp/waypoint',
          subdirectory: '/builtin/aws/ecs',
          hide_versions: false,
          created_at: '2022-11-29T21:12:08.507Z',
          updated_at: '2022-11-29T21:12:08.507Z',
          organization: {
            id: 'efbc4a3d-ab26-418b-a7da-d7d2ec9f3f1f',
            slug: 'hashicorp',
            created_at: '2022-11-29T21:12:08.259Z',
            updated_at: '2022-11-29T21:12:08.259Z',
          },
          product: {
            id: '68c85272-e2bf-4330-aa43-4ce4e6d899ee',
            slug: 'waypoint',
            name: 'Waypoint',
            created_at: '2022-11-29T21:12:08.083Z',
            updated_at: '2022-11-29T21:12:08.083Z',
          },
          releases: [],
          flags: [],
        },
      })

    const result = await LoadFilesystemIntegration({
      identifier: 'waypoint/aws-ecs',
      repo_path: fixtureDir,
      version: '0.0.0',
    })

    expect(scope.isDone()).toBe(true)
    expect(result).toMatchInlineSnapshot(`
      {
        "current_release": {
          "components": [
            {
              "readme": null,
              "slug": "platform",
            },
            {
              "readme": null,
              "slug": "task",
            },
          ],
          "readme": "# README
      ",
          "version": "0.0.0",
        },
        "description": "TODO",
        "docs": {
          "external_url": null,
          "process_docs": true,
          "readme_location": "./README.md",
        },
        "flags": [
          "builtin",
        ],
        "hide_versions": false,
        "id": "052c3e37-f556-4f7d-81ca-ddc8843dd600",
        "identifier": "waypoint/aws-ecs",
        "license": {
          "type": "MPL-2.0",
          "url": "https://github.com/hashicorp/waypoint/blob/main/LICENSE",
        },
        "name": "AWS ECS",
        "product": "waypoint",
      }
    `)
  })
})
