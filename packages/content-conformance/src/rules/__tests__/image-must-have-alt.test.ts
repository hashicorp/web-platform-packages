import { testRule } from '../../test/utils'

import imageMustHaveAlt from '../image-must-have-alt'

describe('image-must-have-alt', () => {
  test('Image with alt text', () => {
    testRule(imageMustHaveAlt, [
      {
        fixture: '![new-install](/img/new-waypoint-install-ui.png)',
        messages: [],
      },
    ])
  })

  test('Image without alt text', () => {
    testRule(imageMustHaveAlt, [
      {
        fixture: '![](/img/new-waypoint-install-ui.png)',
        messages: [
          `Warning: Found MDX image with undefined alternate text. Even if an image is decorative, it's important for alt to be set to an empty string. Please define alt text the syntax "![Some alt text.](/some-image.jpg)". Image details: ${JSON.stringify(
            { url: '/img/new-waypoint-install-ui.png', alt: null, title: null }
          )}`,
        ],
      },
    ])
  })
})
