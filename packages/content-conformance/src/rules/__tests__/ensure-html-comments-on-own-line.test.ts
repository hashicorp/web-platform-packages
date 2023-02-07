import { testRule } from '../../test/utils.js'
import rule from '../ensure-html-comments-on-own-line'

describe('no-nested-html-comments', () => {
  test('correctly formatted html comments', () => {
    testRule(rule, [
      {
        fixture: `<!-- html-comment -->`,
        messages: [],
      },
    ])
  })

  test('disallow nesting', () => {
    testRule(rule, [
      {
        fixture: `* <!-- html-comment -->`,
        messages: [
          'Detected an HTML comment that is likely nested. You may be using this in a bullet point or other markdown primitive, which is not permitted. Please ensure HTML comments are on their own line, without any indentation.',
        ],
      },
    ])
  })

  test('disallow indentation', () => {
    testRule(rule, [
      {
        fixture: ` <!-- html-comment -->`,
        messages: [
          'Detected an HTML comment that is indented. This is not permitted. Please ensure HTML comments are on their own line, without any indentation.',
        ],
      },
    ])
  })

  test('disallow html comments in codeblocks', () => {
    testRule(rule, [
      {
        fixture: `    <!-- html-comment -->`,
        messages: [
          'Detected an HTML comment in a code block. This is not permitted. Please ensure HTML comments are on their own line, without any indentation.',
        ],
      },
    ])
  })
})
