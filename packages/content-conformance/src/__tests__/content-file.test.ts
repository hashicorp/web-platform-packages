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
    it('replaces valid frontmatter with empty newlines', () => {
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

    it('does not throw on invalid fences', () => {
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

    it('should attach a message for invalid frontmatter', () => {
      const file = new ContentFile(`---
description: |
this is an invalid multi-line description.
---

# Heading 1`)
      expect(file.value).toMatchInlineSnapshot(`
        "---
        description: |
        this is an invalid multi-line description.
        ---

        # Heading 1"
      `)
      expect(file.frontmatter()).toMatchInlineSnapshot(`{}`)
      expect(file.messages).toMatchInlineSnapshot(`
        [
          [1:1: Error parsing frontmatter: YAMLParseError: Implicit map keys need to be followed by map values at line 2, column 1:

        description: |
        this is an invalid multi-line description.
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        ],
        ]
      `)
    })

    it('should attach a message for empty fences', () => {
      const file = new ContentFile(`---
---

# Heading 1`)
      expect(file.value).toMatchInlineSnapshot(`
        "---
        ---

        # Heading 1"
      `)
      expect(file.frontmatter()).toMatchInlineSnapshot(`{}`)
      expect(file.messages).toMatchInlineSnapshot(`
        [
          [1:1: Error parsing frontmatter: TypeError: Cannot read properties of undefined (reading 'length')],
        ]
      `)
    })
  })
})
