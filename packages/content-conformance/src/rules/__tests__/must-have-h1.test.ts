import { testRule } from '../../test/utils'

import mustHaveH1 from '../must-have-h1'

describe('must-have-h1', () => {
  test('Content without H1', () => {
    testRule(mustHaveH1, [
      {
        fixture: `## I am not an H1`,
        messages: ['Must have a level 1 heading at the top of the file.'],
      },
    ])
  })

  test('no error', () => {
    testRule(mustHaveH1, [
      {
        fixture: `# I am an H1`,
        messages: [],
      },
    ])
  })
})
