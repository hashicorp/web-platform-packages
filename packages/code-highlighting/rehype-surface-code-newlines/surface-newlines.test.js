/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

const surfaceNewlines = require('./surface-newlines')
const unified = require('unified')
const stringify = require('rehype-stringify')

const processor = unified().use(stringify).data('settings', { fragment: true })
function hastToHtml(hastNodes) {
  const withRoot = {
    type: 'root',
    children: hastNodes,
  }
  const stringified = processor.stringify(withRoot)
  return stringified
}

it('returns simple already-surfaced input unmodified', async () => {
  const hastInput = [
    {
      type: 'element',
      tagName: 'span',
      children: [{ type: 'text', value: 'console.log("Hello world!");' }],
    },
    { type: 'text', value: '\n' },
    {
      type: 'element',
      tagName: 'span',
      children: [{ type: 'text', value: 'alert("Another line");' }],
    },
  ]
  // Compare result and expected result via static markup
  const result = surfaceNewlines(hastInput, true)
  const resultMarkup = await hastToHtml(result)
  const expectedMarkup = await hastToHtml(hastInput)
  //   console.log({ resultMarkup, expectedMarkup })
  expect(resultMarkup).toBe(expectedMarkup)
})

it('returns multi-token-line already-surfaced input unmodified', async () => {
  const hastInput = [
    {
      type: 'element',
      tagName: 'span',
      children: [{ type: 'text', value: 'console.log("Hello world!");' }],
    },
    { type: 'text', value: '\n' },
    {
      type: 'element',
      tagName: 'span',
      children: [{ type: 'text', value: 'alert(' }],
    },
    {
      type: 'element',
      tagName: 'span',
      children: [
        { type: 'text', value: '"Third token on the same line as the second"' },
      ],
    },
    {
      type: 'element',
      tagName: 'span',
      children: [{ type: 'text', value: ');' }],
    },
  ]
  // Compare result and expected result via static markup
  const result = surfaceNewlines(hastInput, true)
  const resultMarkup = await hastToHtml(result)
  const expectedMarkup = await hastToHtml(hastInput)
  //   console.log({ resultMarkup, expectedMarkup })
  expect(resultMarkup).toBe(expectedMarkup)
})

it('surfaces simple nested newlines while preserving tokens', async () => {
  const hastInput = [
    {
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'token-class',
      },
      children: [
        {
          type: 'text',
          value: 'console.log("Hello world!");\nalert("Another line");',
        },
      ],
    },
  ]
  const expectedResult = [
    {
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'token-class',
      },
      children: [{ type: 'text', value: 'console.log("Hello world!");' }],
    },
    { type: 'text', value: '\n' },
    {
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'token-class',
      },
      children: [{ type: 'text', value: 'alert("Another line");' }],
    },
  ]
  // Compare result and expected result via static markup
  const result = surfaceNewlines(hastInput, true)
  const resultMarkup = await hastToHtml(result)
  const expectedMarkup = await hastToHtml(expectedResult)
  //   console.log({ resultMarkup, expectedMarkup })
  expect(resultMarkup).toBe(expectedMarkup)
})

it('surfaces start and end edge cases of nested JSX newlines while preserving tokens', async () => {
  const hastInput = [
    {
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'token-class',
      },
      children: [
        {
          type: 'text',
          value: '\nconsole.log("Hello world!");\nalert("Another line");\n',
        },
      ],
    },
  ]
  const expectedResult = [
    { type: 'text', value: '\n' },
    {
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'token-class',
      },
      children: [{ type: 'text', value: 'console.log("Hello world!");' }],
    },
    { type: 'text', value: '\n' },
    {
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'token-class',
      },
      children: [{ type: 'text', value: 'alert("Another line");' }],
    },
    { type: 'text', value: '\n' },
  ]
  // Compare result and expected result via static markup
  const result = surfaceNewlines(hastInput, true)
  const resultMarkup = await hastToHtml(result)
  const expectedMarkup = await hastToHtml(expectedResult)
  //   console.log({ resultMarkup, expectedMarkup })
  expect(resultMarkup).toBe(expectedMarkup)
})

it('splits more deeply nested JSX newlines while preserving tokens', async () => {
  const hastInput = [
    {
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'foobar-token',
      },
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: {
            className: 'nested-token',
          },
          children: [
            {
              type: 'text',
              value: 'console.log("Hello world!");\nalert("Another line");',
            },
          ],
        },
      ],
    },
  ]
  const expectedResult = [
    {
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'foobar-token',
      },
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: {
            className: 'nested-token',
          },
          children: [
            {
              type: 'text',
              value: 'console.log("Hello world!");',
            },
          ],
        },
      ],
    },
    { type: 'text', value: '\n' },
    {
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'foobar-token',
      },
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: {
            className: 'nested-token',
          },
          children: [
            {
              type: 'text',
              value: 'alert("Another line");',
            },
          ],
        },
      ],
    },
  ]
  // Compare result and expected result via static markup
  const result = surfaceNewlines(hastInput, true)
  const resultMarkup = await hastToHtml(result)
  const expectedMarkup = await hastToHtml(expectedResult)
  // console.log({ resultMarkup, expectedMarkup })
  expect(resultMarkup).toBe(expectedMarkup)
})

it('splits deeply nested JSX newlines while preserving tokens', async () => {
  // Compare result and expected result via static markup
  const hastInput = [
    {
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'foobar-complex-token',
      },
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: {
            className: 'nested-token',
          },
          children: [
            {
              type: 'text',
              value: 'neat-token',
            },
          ],
        },
        {
          type: 'element',
          tagName: 'span',
          properties: {
            className: 'token-with-deep-nesting',
          },
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: {
                className: 'more-nesting',
              },
              children: [
                {
                  type: 'text',
                  value: 'console.log("Hello world!");\nalert("Another line");',
                },
              ],
            },
          ],
        },
        {
          type: 'element',
          tagName: 'span',
          properties: {
            className: 'subsequent-token',
          },
          children: [
            {
              type: 'text',
              value: 'con...\nclusion',
            },
          ],
        },
      ],
    },
  ]
  const expectedResult = [
    {
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'foobar-complex-token',
      },
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: {
            className: 'nested-token',
          },
          children: [
            {
              type: 'text',
              value: 'neat-token',
            },
          ],
        },
        {
          type: 'element',
          tagName: 'span',
          properties: {
            className: 'token-with-deep-nesting',
          },
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: {
                className: 'more-nesting',
              },
              children: [
                {
                  type: 'text',
                  value: 'console.log("Hello world!");',
                },
              ],
            },
          ],
        },
      ],
    },
    { type: 'text', value: '\n' },
    {
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'foobar-complex-token',
      },
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: {
            className: 'token-with-deep-nesting',
          },
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: {
                className: 'more-nesting',
              },
              children: [
                {
                  type: 'text',
                  value: 'alert("Another line");',
                },
              ],
            },
          ],
        },
        {
          type: 'element',
          tagName: 'span',
          properties: {
            className: 'subsequent-token',
          },
          children: [
            {
              type: 'text',
              value: 'con...',
            },
          ],
        },
      ],
    },
    { type: 'text', value: '\n' },
    {
      type: 'element',
      tagName: 'span',
      properties: {
        className: 'foobar-complex-token',
      },
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: {
            className: 'subsequent-token',
          },
          children: [
            {
              type: 'text',
              value: 'clusion',
            },
          ],
        },
      ],
    },
  ]
  // Compare result and expected result via static markup
  const result = surfaceNewlines(hastInput, true)
  const resultMarkup = await hastToHtml(result)
  const expectedMarkup = await hastToHtml(expectedResult)
  // console.log({ resultMarkup, expectedMarkup })
  expect(resultMarkup).toBe(expectedMarkup)
})
