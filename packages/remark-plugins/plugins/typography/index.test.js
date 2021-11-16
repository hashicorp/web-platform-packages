import { createProcessor } from '@mdx-js/mdx'
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

describe('type-styles', () => {
  it('adds classNames to headings, paragraphs, and list items', () => {
    const compiler = createProcessor({ remarkPlugins: [typographyPlugin] })
    const output = compiler.processSync(fileContents)
    expect(output).toMatchInlineSnapshot()
  })

  it('allows empty strings in map to prevent the addition of classNames', () => {
    const options = {
      map: {
        p: '',
      },
    }
    const compiler = createProcessor({
      remarkPlugins: [[typographyPlugin, options]],
    })
    const output = compiler.processSync(fileContents)
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
    const compiler = createProcessor({
      remarkPlugins: [[typographyPlugin, options]],
    })
    const output = compiler.processSync(fileContents)
    expect(output).toMatchInlineSnapshot()
  })
})
