import { remark } from 'remark'
import remarkMdx from 'remark-mdx'

import jumpToSection from '.'

describe('jump-to', () => {
  it('should insert a jump-to component after the first h1', () => {
    const md = `
# Hello World
## Hello World
### Hello World
#### Hello World
##### Hello World
###### Hello World
`

    const result = execute(md)

    const expected = `# Hello World

<JumpToSection headings={headings}/>

## Hello World

### Hello World

#### Hello World

##### Hello World

###### Hello World
`
    expect(result).toEqual(expected)
  })
})

function execute(input, options = {}) {
  return remark()
    .use(jumpToSection, options)
    .use(remarkMdx)
    .processSync(input)
    .toString()
}
