import fs from 'fs'
import { testRule, getFixturePath } from '../../test/utils'
import topOfFileH1 from '../top-of-file-h1'

const fixturePath = getFixturePath('basic-with-content-files')

describe('top-of-file-h1', () => {
  test('Content with level 2 heading', () => {
    testRule(topOfFileH1, [
      {
        fixture: {
          path: `level-2-heading.mdx`,
          value: `## Level 2 heading`,
        },
        messages: [
          `- level-2-heading.mdx \nThe file listed above is missing a level 1 heading at the top of the file. Please add a level 1 heading to the top of the file and try again.`,
        ],
      },
    ])
  })

  test('Content with no top level h1', () => {
    testRule(topOfFileH1, [
      {
        fixture: {
          path: `no-h1.mdx`,
          value: `
            This is some text

            # Heading
          `,
        },
        messages: [
          '- no-h1.mdx \nThe file listed above is missing a level 1 heading at the top of the file. Please add a level 1 heading to the top of the file and try again.',
        ],
      },
    ])
  })

  test('Content with top level h1', () => {
    testRule(topOfFileH1, [
      {
        fixture: {
          path: `has-h1.mdx`,
          value: `# Has level 1 heading`,
        },
        messages: [],
      },
    ])
  })

  test('Content with path to content file with H1', () => {
    testRule(topOfFileH1, [
      {
        fixture: {
          path: `${fixturePath}/content/index.mdx`,
          value: String(fs.readFileSync(`${fixturePath}/content/index.mdx`)),
        },
        messages: [],
      },
    ])
  })
})
