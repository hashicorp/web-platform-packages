import markdownDefaults from './index'

test('mdx options default', () => {
  const opts = markdownDefaults()
  expect(opts.remarkPlugins).toHaveLength(5)
  expect(opts.remarkPlugins[0][0].name).toBe('includeMarkdownPlugin')
  expect(opts.remarkPlugins[1][0].name).toBe('anchorLinksPlugin')
  expect(opts.remarkPlugins[2][0].name).toBe('paragraphCustomAlertsPlugin')
  expect(opts.remarkPlugins[3][0].name).toBe('typographyPlugin')
  expect(opts.remarkPlugins[4].name).toBe('remarkGfm')
  expect(opts.rehypePlugins[0][0].name).toBe('rehypeRaw')
  expect(opts.rehypePlugins[1][0].name).toBe('') // rehype-prism, exports an anonymous function
  expect(opts.rehypePlugins[2].name).toBe('rehypeSurfaceCodeNewlines')
})

test('mdx options with custom plugins & options', () => {
  const opts = markdownDefaults({
    addRemarkPlugins: [function foo() {}],
    addRehypePlugins: [function bar() {}],
    resolveIncludes: 'foo',
    enableMath: true,
  })

  expect(opts.remarkPlugins[0][0].name).toBe('includeMarkdownPlugin')
  expect(opts.remarkPlugins[0][1].resolveFrom).toBe('foo')
  expect(opts.remarkPlugins[1][0].name).toBe('anchorLinksPlugin')
  expect(opts.remarkPlugins[2][0].name).toBe('paragraphCustomAlertsPlugin')
  expect(opts.remarkPlugins[3][0].name).toBe('typographyPlugin')
  expect(opts.remarkPlugins[4].name).toBe('remarkGfm')
  expect(opts.remarkPlugins[6].name).toBe('remarkMath')
  expect(opts.rehypePlugins[0][0].name).toBe('rehypeRaw')
  expect(opts.rehypePlugins[1][0].name).toBe('') // rehype-prism, exports an anonymous function
  expect(opts.rehypePlugins[2].name).toBe('rehypeSurfaceCodeNewlines')
  expect(opts.rehypePlugins[3].name).toBe('bar')
  expect(opts.rehypePlugins[4].name).toBe('rehypeKatex')
})
