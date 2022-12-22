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
          'Expected image to include alt text. Alt text is important because it allows people to understand the content of an image even if they cannot see it. Please add alt text to this image.',
        ],
      },
    ])
  })
})
