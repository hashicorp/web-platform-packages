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
          `The image with url /img/new-waypoint-install-ui.png is missing alternate text. Providing alt text on an image is important for accessibility. Add alt text on the image with the following syntax "![My alt text.](url)"`,
        ],
      },
    ])
  })
})
