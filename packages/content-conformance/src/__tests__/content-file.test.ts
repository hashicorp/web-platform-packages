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

  describe('with frontmatter', () => {
    it('handles valid frontmatter', () => {
      const file = new ContentFile(`---
number: 1
string: two
list:
  - three
  - four
object:
  field_a: five
  field_b: six
---

# Heading 1
`)
      expect(file.value).toMatchInlineSnapshot(`
        "
        # Heading 1
        "
      `)
      expect(file.frontmatter()).toMatchInlineSnapshot(`
        {
          "list": [
            "three",
            "four",
          ],
          "number": 1,
          "object": {
            "field_a": "five",
            "field_b": "six",
          },
          "string": "two",
        }
      `)
    })

    it('does not throw on invalid frontmatter', () => {
      const file = new ContentFile(`---
field: |
  This frontmatter is missing a single dash
--

# Heading 1`)
      expect(file.value).toMatchInlineSnapshot(`
        "---
        field: |
          This frontmatter is missing a single dash
        --

        # Heading 1"
      `)
      expect(file.frontmatter()).toMatchInlineSnapshot(`{}`)
    })
  })
})
