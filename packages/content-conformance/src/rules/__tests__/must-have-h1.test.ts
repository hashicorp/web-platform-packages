import { testRule } from '../../test/utils'
import topOfFileH1 from '../top-of-file-h1'

describe('must-have-h1', () => {
  test('Content with level 2 heading', () => {
    testRule(topOfFileH1, [
      {
        fixture: `## I am not an H1`,
        messages: ['Must have a level 1 heading at the top of the file.'],
      },
    ])
  })

  test('Content with no top level h1', () => {
    testRule(topOfFileH1, [
      {
        fixture: `
            I am some text
            # I am not an H1
        `,
        messages: ['Must have a level 1 heading at the top of the file.'],
      },
    ])
  })

  test('Content with top level h1', () => {
    testRule(topOfFileH1, [
      {
        fixture: `# I am an H1`,
        messages: [],
      },
    ])
  })
})
