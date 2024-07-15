/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import { remark } from 'remark'
import remarkMdx from 'remark-mdx'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import typographyPlugin from './index.js'

const fileContents = `hi there

# Heading One
## Heading Two
sadklfjhlskdjf

### Heading Three
#### Heading Four
##### Heading Five
###### Heading Six

Foo bar baz wow *amaze*

- foo
- bar
`

const makeProcessor = (options) =>
  remark()
    .use(remarkMdx)
    .use(typographyPlugin, options)
    .use(remarkRehype)
    .use(rehypeStringify)

describe('type-styles', () => {
  it('adds classNames to headings, paragraphs, and list items', () => {
    const compiler = makeProcessor()
    const output = String(compiler.processSync(fileContents))
    expect(output).toMatchInlineSnapshot(`
      "<p class="g-type-long-body">hi there</p>
      <h1 class="g-type-display-2">Heading One</h1>
      <h2 class="g-type-display-3">Heading Two</h2>
      <p class="g-type-long-body">sadklfjhlskdjf</p>
      <h3 class="g-type-display-4">Heading Three</h3>
      <h4 class="g-type-display-5">Heading Four</h4>
      <h5 class="g-type-display-6">Heading Five</h5>
      <h6 class="g-type-label">Heading Six</h6>
      <p class="g-type-long-body">Foo bar baz wow <em>amaze</em></p>
      <ul>
      <li class="g-type-long-body">foo</li>
      <li class="g-type-long-body">bar</li>
      </ul>"
    `)
  })

  it('allows empty strings in map to prevent the addition of classNames', () => {
    const options = {
      map: {
        p: '',
      },
    }
    const compiler = makeProcessor(options)
    const output = String(compiler.processSync(fileContents))
    expect(output).not.toMatch('custom-paragraph')
  })

  it('allows customization of classNames', () => {
    const options = {
      map: {
        h1: 'custom-1',
        h2: 'custom-2',
        h3: 'custom-3',
        h4: 'custom-4',
        h5: 'custom-5',
        h6: 'custom-6',
        p: 'custom-paragraph',
        li: 'custom-list-item',
      },
    }
    const compiler = makeProcessor(options)
    const output = String(compiler.processSync(fileContents))
    expect(output).toMatchInlineSnapshot(`
      "<p class="custom-paragraph">hi there</p>
      <h1 class="custom-1">Heading One</h1>
      <h2 class="custom-2">Heading Two</h2>
      <p class="custom-paragraph">sadklfjhlskdjf</p>
      <h3 class="custom-3">Heading Three</h3>
      <h4 class="custom-4">Heading Four</h4>
      <h5 class="custom-5">Heading Five</h5>
      <h6 class="custom-6">Heading Six</h6>
      <p class="custom-paragraph">Foo bar baz wow <em>amaze</em></p>
      <ul>
      <li class="custom-list-item">foo</li>
      <li class="custom-list-item">bar</li>
      </ul>"
    `)
  })
})
