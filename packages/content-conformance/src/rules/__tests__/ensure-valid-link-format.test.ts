import { testRule } from '../../test/utils'

import ensureValidLinkFormat from '../ensure-valid-link-format'

describe('ensure-valid-link-format', () => {
  test('does nothing for valid developer links', () => {
    testRule(ensureValidLinkFormat, [
      {
        fixture: `[I am a valid link](/waypoint/docs/foo/bar)`,
        messages: [],
      },
      {
        fixture: `[I am a valid link](/boundary/docs/foo/bar)`,
        messages: [],
      },
      {
        fixture: `[I am a valid tutorial link](/boundary/tutorials/foo/bar)`,
        messages: [],
      },
      {
        fixture: `[I am a valid collection link](/boundary/tutorials/foo)`,
        messages: [],
      },
    ])
  })

  test('errors for learn.hashicorp.com links', () => {
    testRule(ensureValidLinkFormat, [
      {
        fixture: `[learn link](https://learn.hashicorp.com/tutorials/waypoint/aws-ecs)`,
        messages: [/Unexpected link to `learn\.hashicorp\.com`/],
      },
      {
        fixture: `[invalid learn link](https://learn.hashicorp.com/tutorials/waypoint)`,
        messages: [/Unexpected link to `learn\.hashicorp\.com`/],
      },
    ])
  })

  test('errors for .io site docs links', () => {
    testRule(ensureValidLinkFormat, [
      {
        fixture: `[.io docs link](https://www.waypointproject.io/docs)`,
        messages: [/Unexpected link to documentation on `waypointproject\.io`/],
      },
      {
        fixture: `[.io docs link](https://waypointproject.io/docs)`,
        messages: [/Unexpected link to documentation on `waypointproject\.io`/],
      },
      {
        fixture: `[Another .io docs link](https://www.consul.io/commands)`,
        messages: [/Unexpected link to documentation on `consul\.io`/],
      },
    ])
  })

  test('errors for fully qualified developer.hashicorp.com links', () => {
    testRule(ensureValidLinkFormat, [
      {
        fixture: `[full developer link](https://developer.hashicorp.com)`,
        messages: [
          /Unexpected fully-qualified link to `developer\.hashicorp\.com`/,
        ],
      },
      {
        fixture: `[another full developer link](https://developer.hashicorp.com/tutorials/library)`,
        messages: [
          /Unexpected fully-qualified link to `developer\.hashicorp\.com`/,
        ],
      },
      {
        fixture: `[full developer link](https://developer.hashicorp.com/waypoint/docs)`,
        messages: [
          /Unexpected fully-qualified link to `developer\.hashicorp\.com`/,
        ],
      },
    ])
  })

  test('errors for links without product base paths', () => {
    testRule(ensureValidLinkFormat, [
      {
        fixture: `[relative docs link](/docs/foo)`,
        messages: [/Unexpected product-relative link/],
      },
      {
        fixture: `[relative docs link](/api-docs)`,
        messages: [/Unexpected product-relative link/],
      },
      {
        fixture: `[relative docs link](/commands)`,
        messages: [/Unexpected product-relative link/],
      },
    ])
  })

  test('errors for folder-relative links', () => {
    testRule(ensureValidLinkFormat, [
      {
        fixture: `[folder-relative link](./foo/bar)`,
        messages: [/Unexpected folder-relative link/],
      },
    ])
  })

  test('tutorials-specific errors', () => {
    testRule(
      ensureValidLinkFormat,
      [
        {
          fixture: `[search](/search)`,
          messages: [/Old Learn search page link/],
        },
        {
          fixture: `[waf](/collections/well-architected-framework)
[onboarding](/collections/onboarding)
[waf tutorial](/tutorials/well-architected-framework/foo)
[onboarding tutorial](/tutorials/onboarding/foo)`,
          messages: [
            /Old WAF\/onboarding collection page link/,
            /Old WAF\/onboarding tutorials page link/,
          ],
        },
        {
          fixture: `[collections](/collections)`,
          messages: [/Old collection page link/],
        },
        {
          fixture: `[tutorials](/tutorials/waypoint/blah)`,
          messages: [/Old tutorial page link/],
        },
      ],
      { isTutorials: true }
    )
  })
})
