import { remark } from 'remark'
import html from 'remark-html'
import anchorLinks from './index'

describe('anchor-links', () => {
  describe('headings', () => {
    test('basic', () => {
      const headings = []
      expect(execute('# hello world', { headings })).toMatch(
        [
          '<h1>',
          '<a class="__permalink-h" href="#hello-world" aria-label="hello world permalink">»</a>',
          '<a class="__target-h" id="hello-world" aria-hidden="true"></a>',
          'hello world',
          '</h1>',
        ].join('')
      )
      expect(headings).toMatchInlineSnapshot(`
        [
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "hello-world",
            "slug": "hello-world",
            "title": "hello world",
          },
        ]
      `)
    })

    test('multiple heading levels', () => {
      const headings = []
      execute(
        [
          '# Heading 1',
          '## Heading 2',
          '### Heading 3',
          '#### Heading 4',
          '##### Heading 5',
          '###### Heading 6',
        ],
        { headings }
      )
      expect(headings).toMatchInlineSnapshot(`
        [
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "heading-1",
            "slug": "heading-1",
            "title": "Heading 1",
          },
          {
            "aliases": [],
            "level": 2,
            "permalinkSlug": "heading-2",
            "slug": "heading-2",
            "title": "Heading 2",
          },
          {
            "aliases": [],
            "level": 3,
            "permalinkSlug": "heading-3",
            "slug": "heading-3",
            "title": "Heading 3",
          },
          {
            "aliases": [],
            "level": 4,
            "permalinkSlug": "heading-4",
            "slug": "heading-4",
            "title": "Heading 4",
          },
          {
            "aliases": [],
            "level": 5,
            "permalinkSlug": "heading-5",
            "slug": "heading-5",
            "title": "Heading 5",
          },
          {
            "aliases": [],
            "level": 6,
            "permalinkSlug": "heading-6",
            "slug": "heading-6",
            "title": "Heading 6",
          },
        ]
      `)
    })

    test('without headings option', () => {
      const headings = []
      execute('# hello world')
      expect(headings).toMatchInlineSnapshot(`[]`)
    })

    test('duplicate slugs', () => {
      const headings = []
      expect(
        execute(
          ['# hello world', '# hello world', '# foo', '# hello world', '# foo'],
          { headings }
        )
      ).toMatch(
        [
          expectedHeadingResult({
            slug: 'hello-world',
            text: 'hello world',
          }),
          expectedHeadingResult({
            slug: 'hello-world-1',
            text: 'hello world',
          }),
          expectedHeadingResult({ slug: 'foo' }),
          expectedHeadingResult({
            slug: 'hello-world-2',
            text: 'hello world',
          }),
          expectedHeadingResult({ text: 'foo', slug: 'foo-1', aria: 'foo' }),
        ].join('\n')
      )
      expect(headings).toMatchInlineSnapshot(`
        [
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "hello-world",
            "slug": "hello-world",
            "title": "hello world",
          },
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "hello-world-1",
            "slug": "hello-world-1",
            "title": "hello world",
          },
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "foo",
            "slug": "foo",
            "title": "foo",
          },
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "hello-world-2",
            "slug": "hello-world-2",
            "title": "hello world",
          },
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "foo-1",
            "slug": "foo-1",
            "title": "foo",
          },
        ]
      `)
    })

    test('strips html', () => {
      const headings = []
      expect(
        execute(
          [
            '# hello world <a href="wow"></a>',
            '# hello <a href="wow">world</a>',
          ],
          { headings }
        )
      ).toMatch(
        [
          expectedHeadingResult({
            slug: 'hello-world',
            text: 'hello world <a href="wow"></a>',
            aria: 'hello world',
          }),
          expectedHeadingResult({
            slug: 'hello-world-1',
            text: 'hello <a href="wow">world</a>',
            aria: 'hello world',
          }),
        ].join('\n')
      )
      expect(headings).toMatchInlineSnapshot(`
        [
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "hello-world",
            "slug": "hello-world",
            "title": "hello world",
          },
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "hello-world-1",
            "slug": "hello-world-1",
            "title": "hello world",
          },
        ]
      `)
    })

    test('removes leading hyphens', () => {
      const headings = []
      expect(
        execute(['# - hello world', '# <a></a> hello world'], { headings })
      ).toMatch(
        [
          expectedHeadingResult({
            slug: 'hello-world',
            text: '- hello world',
            aria: 'hello world',
          }),
          expectedHeadingResult({
            slug: 'hello-world-1',
            text: '<a></a> hello world',
            aria: 'hello world',
          }),
        ].join('\n')
      )
      expect(headings).toMatchInlineSnapshot(`
        [
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "hello-world",
            "slug": "hello-world",
            "title": "- hello world",
          },
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "hello-world-1",
            "slug": "hello-world-1",
            "title": "hello world",
          },
        ]
      `)
    })

    test('removes double hyphens', () => {
      const headings = []
      expect(
        execute(
          ['# hEllO----world', '# hello :&-- world', '# hello world (foo)()'],
          { headings }
        )
      ).toMatch(
        [
          expectedHeadingResult({
            slug: 'hello-world',
            text: 'hEllO----world',
            aria: 'hello world',
          }),
          expectedHeadingResult({
            slug: 'hello-world-1',
            text: 'hello :&#x26;-- world',
            aria: 'hello world',
          }),
          expectedHeadingResult({
            slug: 'hello-world-foo',
            text: 'hello world (foo)()',
            aria: 'hello world foo',
          }),
        ].join('\n')
      )
      expect(headings).toMatchInlineSnapshot(`
        [
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "hello-world",
            "slug": "hello-world",
            "title": "hEllO----world",
          },
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "hello-world-1",
            "slug": "hello-world-1",
            "title": "hello :&-- world",
          },
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "hello-world-foo",
            "slug": "hello-world-foo",
            "title": "hello world (foo)()",
          },
        ]
      `)
    })

    test('generates an extra slug if the compatibilitySlug argument is provided', () => {
      const headings = []
      expect(
        execute('# hello world', { compatibilitySlug: () => 'foo', headings })
      ).toMatch(
        expectedHeadingResult({
          slug: 'hello-world',
          text: 'hello world',
          compatSlugs: ['foo'],
        })
      )
      expect(headings).toMatchInlineSnapshot(`
        [
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "foo",
            "slug": "hello-world",
            "title": "hello world",
          },
        ]
      `)
    })

    test('does not render duplicate compatibility slugs', () => {
      const headings = []
      expect(
        execute('# hello world', {
          compatibilitySlug: () => 'hello-world',
          headings,
        })
      ).toMatch(
        expectedHeadingResult({
          slug: 'hello-world',
          text: 'hello world',
        })
      )
      expect(headings).toMatchInlineSnapshot(`
        [
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "hello-world",
            "slug": "hello-world",
            "title": "hello world",
          },
        ]
      `)
    })

    test('anchor aliases', () => {
      let headings = []
      expect(execute('# hello world ((#foo))', { headings })).toMatch(
        expectedHeadingResult({
          slug: 'hello-world',
          text: 'hello world',
          compatSlugs: ['foo'],
        })
      )
      expect(headings).toMatchInlineSnapshot(`
        [
          {
            "aliases": [
              "foo",
            ],
            "level": 1,
            "permalinkSlug": "foo",
            "slug": "hello-world",
            "title": "hello world",
          },
        ]
      `)

      headings = []
      expect(execute('# hello world ((#\\_foo))', { headings })).toMatch(
        expectedHeadingResult({
          slug: 'hello-world',
          text: 'hello world',
          compatSlugs: ['_foo'],
        })
      )
      expect(headings).toMatchInlineSnapshot(`
        [
          {
            "aliases": [
              "_foo",
            ],
            "level": 1,
            "permalinkSlug": "_foo",
            "slug": "hello-world",
            "title": "hello world",
          },
        ]
      `)

      headings = []
      expect(execute('# hello world ((#foo, #bar))', { headings })).toMatch(
        expectedHeadingResult({
          slug: 'hello-world',
          text: 'hello world',
          compatSlugs: ['foo', 'bar'],
        })
      )
      expect(headings).toMatchInlineSnapshot(`
        [
          {
            "aliases": [
              "foo",
              "bar",
            ],
            "level": 1,
            "permalinkSlug": "foo",
            "slug": "hello-world",
            "title": "hello world",
          },
        ]
      `)

      // this *shouldn't* work but currently does, so it has coverage
      headings = []
      expect(execute('# hello world ((#foo)) more text', { headings })).toMatch(
        expectedHeadingResult({
          slug: 'hello-world-more-text',
          text: 'hello world more text',
          compatSlugs: ['foo'],
        })
      )
      expect(headings).toMatchInlineSnapshot(`
        [
          {
            "aliases": [
              "foo",
            ],
            "level": 1,
            "permalinkSlug": "foo",
            "slug": "hello-world-more-text",
            "title": "hello world more text",
          },
        ]
      `)
    })
  })

  describe('lists starting with inline code', () => {
    test('basic', () => {
      const headings = []
      expect(
        execute(
          [
            'some text',
            '',
            '- raw text',
            '- `code with spaces`',
            '- `code_with_text_after` - explanation of code',
            '- text `followed_by_code` then more text',
            '- <a>html</a> `followed_by_code` then more text',
            '- `code_with_text_and_link` - heres [a link](#foo) and some more text',
            '',
            'some more text',
          ],
          { headings }
        )
      ).toMatch(
        [
          '<p>some text</p>',
          '<ul>',
          '<li>raw text</li>',
          expectedInlineCodeResult({
            slug: 'code-with-spaces',
            code: 'code with spaces',
          }),
          expectedInlineCodeResult({
            slug: 'code_with_text_after',
            afterCode: ' - explanation of code',
          }),
          '<li>text <code>followed_by_code</code> then more text</li>',
          '<li><a>html</a> <code>followed_by_code</code> then more text</li>',
          expectedInlineCodeResult({
            slug: 'code_with_text_and_link',
            afterCode: ' - heres <a href="#foo">a link</a> and some more text',
          }),
          '</ul>',
          '<p>some more text</p>',
        ].join('\n')
      )
      expect(headings).toMatchInlineSnapshot(`[]`)
    })

    test('duplicate slugs', () => {
      const headings = []
      expect(execute(['- `foo`', '- `foo`'], { headings })).toMatch(
        [
          '<ul>',
          expectedInlineCodeResult({ slug: 'foo' }),
          expectedInlineCodeResult({ slug: 'foo-1', code: 'foo' }),
          '</ul>',
        ].join('\n')
      )
      expect(headings).toMatchInlineSnapshot(`[]`)
    })

    test('prefix option', () => {
      const headings = []
      expect(
        execute('- `foo`', { headings, listWithInlineCodePrefix: 'inlinecode' })
      ).toMatch(
        [
          '<ul>',
          expectedInlineCodeResult({
            slug: 'inlinecode-foo',
            code: 'foo',
          }),
          '</ul>',
        ].join('\n')
      )
      expect(headings).toMatchInlineSnapshot(`[]`)
    })

    test('generates an extra slug if the compatibilitySlug argument is provided', () => {
      const headings = []
      expect(
        execute('- `hello world`', {
          compatibilitySlug: () => 'foo',
          headings,
        })
      ).toMatch(
        '<ul>',
        expectedInlineCodeResult({
          slug: 'hello-world',
          text: 'hello world',
          compatSlugs: ['foo'],
        }),
        '</ul>'
      )
      expect(headings).toMatchInlineSnapshot(`[]`)
    })

    test('does not render duplicate compatibility slugs', () => {
      const headings = []
      expect(
        execute('- `hello world`', {
          compatibilitySlug: () => 'hello-world',
          headings,
        })
      ).toMatch(
        '<ul>',
        expectedInlineCodeResult({
          slug: 'hello-world',
          text: 'hello world',
        }),
        '</ul>'
      )
      expect(headings).toMatchInlineSnapshot(`[]`)
    })

    test('duplicate slug with headline', () => {
      const headings = []
      expect(execute(['# foo', '', '- `foo`'], { headings })).toMatch(
        [
          expectedHeadingResult({ slug: 'foo' }),
          '<ul>',
          expectedInlineCodeResult({ slug: 'foo-1', code: 'foo' }),
          '</ul>',
        ].join('\n')
      )
      expect(headings).toMatchInlineSnapshot(`
        [
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "foo",
            "slug": "foo",
            "title": "foo",
          },
        ]
      `)
    })

    test('duplicate slug with headline and prefix option', () => {
      const headings = []
      expect(
        execute(['# foo', '', '- `foo`'], {
          headings,
          listWithInlineCodePrefix: 'inlinecode',
        })
      ).toMatch(
        [
          expectedHeadingResult({ slug: 'foo' }),
          '<ul>',
          expectedInlineCodeResult({
            slug: 'inlinecode-foo',
            code: 'foo',
          }),
          '</ul>',
        ].join('\n')
      )
      expect(headings).toMatchInlineSnapshot(`
        [
          {
            "aliases": [],
            "level": 1,
            "permalinkSlug": "foo",
            "slug": "foo",
            "title": "foo",
          },
        ]
      `)
    })

    test('anchor aliases', () => {
      let headings = []
      expect(
        execute(
          [
            '- `foo` ((#bar)) - other text',
            '- `foo` ((#baz, #quux))',
            '- `foo` some text ((#wow)) more text', // this one *shouldn't* work but it does currently
          ],
          { headings }
        )
      ).toMatch(
        [
          '<ul>',
          expectedInlineCodeResult({
            slug: 'foo',
            compatSlugs: ['bar'],
            afterCode: ' - other text',
          }),
          expectedInlineCodeResult({
            slug: 'foo-1',
            code: 'foo',
            compatSlugs: ['baz', 'quux'],
          }),
          expectedInlineCodeResult({
            slug: 'foo-2',
            code: 'foo',
            compatSlugs: ['wow'],
            afterCode: ' some text more text',
          }),
          '</ul>',
        ].join('\n')
      )
      expect(headings).toMatchInlineSnapshot(`[]`)
    })

    test('anchor aliases with special characters', () => {
      const headings = []
      expect(
        execute(
          [
            '- `baz` ((#\\_bar)) text',
            '- `quux` ((#foo wow',
            '- `foo` ((#\\_wow)) text [link](#test) more',
          ],
          { headings }
        )
      ).toMatch(
        [
          '<ul>',
          expectedInlineCodeResult({
            slug: 'baz',
            compatSlugs: ['_bar'],
            afterCode: ' text',
          }),
          expectedInlineCodeResult({
            slug: 'quux',
            afterCode: ' ((#foo wow',
          }),
          expectedInlineCodeResult({
            slug: 'foo',
            compatSlugs: ['_wow'],
            afterCode: ' text <a href="#test">link</a> more',
          }),
          '</ul>',
        ].join('\n')
      )
      expect(headings).toMatchInlineSnapshot(`[]`)
    })
  })
})

function execute(input, options = {}) {
  return remark()
    .use(anchorLinks, options)
    .use(html, { sanitize: false })
    .processSync([].concat(input).join('\n'))
    .toString()
    .trim()
}

function expectedHeadingResult({ slug, compatSlugs, aria, text, level }) {
  const res = [`<h${level || '1'}>`]
  res.push(
    `<a class="__permalink-h" href="#${
      compatSlugs && compatSlugs.length ? compatSlugs[0] : slug
    }" aria-label="${aria || text || slug} permalink">»</a>`
  )

  if (compatSlugs) {
    compatSlugs.map((compatSlug) =>
      res.push(
        `<a class="__target-h __compat" id="${compatSlug}" aria-hidden="true"></a>`
      )
    )
  }
  res.push(`<a class="__target-h" id="${slug}" aria-hidden="true"></a>`)
  res.push(text || slug)
  res.push(`</h${level || '1'}>`)
  return res.join('')
}

function expectedInlineCodeResult({
  slug,
  compatSlugs,
  aria,
  code,
  afterCode,
}) {
  const res = ['<li>\n']

  res.push(`<a id="${slug}" class="__target-lic" aria-hidden="true"></a>\n`)
  if (compatSlugs) {
    compatSlugs.map((compatSlug) =>
      res.push(
        `<a class="__target-lic __compat" id="${compatSlug}" aria-hidden="true"></a>\n`
      )
    )
  }
  res.push(
    `<a href="#${
      compatSlugs && compatSlugs.length ? compatSlugs[0] : slug
    }" aria-label="${aria || code || slug} permalink" class="__permalink-lic">`
  )
  res.push(`<code>${code || slug}</code>`)
  res.push('</a>')
  afterCode && res.push(afterCode)
  res.push('</li>')

  return res.join('')
}
