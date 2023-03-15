import fs from 'fs'
import { testRule, getFixturePath } from '../../test/utils'
import noTopOfFileH1 from '../no-top-of-file-h1'

const fixturePath = getFixturePath('basic-with-content-files')

describe('no-top-of-file-h1', () => {
  test('Content with level 2 heading', () => {
    testRule(noTopOfFileH1, [
      {
        fixture: {
          path: `level-2-heading.mdx`,
          value: `## Level 2 heading`,
        },
        messages: [],
      },
    ])
  })

  test('Content with no top level h1', () => {
    testRule(noTopOfFileH1, [
      {
        fixture: {
          path: `no-h1.mdx`,
          value: `
            This is some text

            # Heading
          `,
        },
        messages: [],
      },
    ])
  })

  test('Content with top level h1', () => {
    testRule(noTopOfFileH1, [
      {
        fixture: {
          path: `has-h1.mdx`,
          value: `# Has level 1 heading`,
        },
        messages: [
          `Expected file not to start with a level 1 heading. A level 1 heading is programmatically added to this page. Remove the level 1 heading at the top of the document.`,
        ],
      },
    ])
  })

  test('Content with path to content file with H1', () => {
    testRule(noTopOfFileH1, [
      {
        fixture: {
          path: `${fixturePath}/content/index.mdx`,
          value: String(fs.readFileSync(`${fixturePath}/content/index.mdx`)),
        },
        messages: [
          `Expected file not to start with a level 1 heading. A level 1 heading is programmatically added to this page. Remove the level 1 heading at the top of the document.`,
        ],
      },
    ])
  })
})
