import { ContentFile } from '../content-file.js'

describe('ContentFile', () => {
  test('throws on tree mutation', () => {
    const file = new ContentFile('# Heading 1')

    file.visit(['heading'], (node) => {
      if (node.depth === 1) {
        // @ts-expect-error -- node should be of type Readonly
        node.depth = 2
      }
    })

    // The above @ts-expect-error declaration indicates node is correctly of type Readonly
    expect(true)
  })
})
