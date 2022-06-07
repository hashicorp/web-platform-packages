import highlight from '@mapbox/rehype-prism'
import { Pluggable } from 'unified'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSurfaceCodeNewlines from '@hashicorp/platform-code-highlighting/rehype-surface-code-newlines'

interface MarkdownDefaults {
  remarkPlugins: Pluggable[]
  rehypePlugins: Pluggable[]
}

export interface ContentPluginsOptions {
  addRemarkPlugins?: Pluggable[]
  addRehypePlugins?: Pluggable[]
  resolveIncludes?: string
  enableMath?: boolean
}

export default function markdownDefaults(
  options: ContentPluginsOptions = {}
): MarkdownDefaults {
  const res = {} as MarkdownDefaults

  // Add user-provided remark plugins if present
  res.remarkPlugins = options.addRemarkPlugins || []

  const rehypeDefaults: Pluggable[] = [
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
