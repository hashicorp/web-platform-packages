import { allPlugins } from '@hashicorp/remark-plugins'
import highlight from '@mapbox/rehype-prism'
import { Pluggable } from 'unified'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeSurfaceCodeNewlines from '@hashicorp/platform-code-highlighting/rehype-surface-code-newlines'

interface MarkdownDefaults {
  remarkPlugins: Pluggable[]
  rehypePlugins: Pluggable[]
}

export interface ContentPluginsOptions {
  // TODO: implement this once our @hashicorp/remark-plugins package is typed (https://app.asana.com/0/1100423001970639/1199650430485548)
  pluginOptions?: $TSFixMe
  addRemarkPlugins?: Pluggable[]
  addRehypePlugins?: Pluggable[]
  resolveIncludes?: string
  enableMath?: boolean
}

export default function markdownDefaults(
  options: ContentPluginsOptions = {}
): MarkdownDefaults {
  const res = {} as MarkdownDefaults

  // Set default remark/rehype plugins
  // Add user-provided remark plugins if present
  const remarkDefaults: Pluggable[] = [
    ...allPlugins(options.pluginOptions),
    remarkGfm,
  ]
  res.remarkPlugins = options.addRemarkPlugins
    ? [...remarkDefaults, ...options.addRemarkPlugins]
    : remarkDefaults

  const rehypeDefaults: Pluggable[] = [
    [
      rehypeRaw,
      {
        passThrough: [
          'mdxFlowExpression',
          'mdxJsxFlowElement',
          'mdxJsxTextElement',
          'mdxTextExpression',
          'mdxjsEsm',
        ],
      },
    ],
    [highlight, { ignoreMissing: true }],
    rehypeSurfaceCodeNewlines,
  ]
  res.rehypePlugins = options.addRehypePlugins
    ? [...rehypeDefaults, ...options.addRehypePlugins]
    : rehypeDefaults

  // Convenience option to replace `{ pluginOptions: { includeMarkdown: { resolveFrom: '<PATH>' } } }`
  // with simply `{ resolveIncludes: '<PATH>' }`
  if (options.resolveIncludes) {
    res.remarkPlugins = res.remarkPlugins.map((entry) => {
      const [plugin, opts] = Array.isArray(entry) ? entry : [entry, undefined]
      if (
        typeof plugin === 'function' &&
        plugin.name === 'includeMarkdownPlugin'
      ) {
        return [
          plugin,
          { resolveMdx: true, resolveFrom: options.resolveIncludes, ...opts },
        ]
      } else {
        return entry
      }
    })
  }

  // Add math plugins if enabled
  if (options.enableMath) {
    res.remarkPlugins.push(remarkMath)
    res.rehypePlugins.push(rehypeKatex)
  }

  return res
}
