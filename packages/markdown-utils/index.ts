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
  remarkPlugins?: Pluggable[]
  addRehypePlugins?: Pluggable[]
  enableMath?: boolean
}

export default function markdownDefaults(
  options: ContentPluginsOptions = {}
): MarkdownDefaults {
  const res = {} as MarkdownDefaults

  // Add user-provided remark plugins if present
  res.remarkPlugins = options.remarkPlugins || []

  const rehypeDefaults: Pluggable[] = [
    [highlight, { ignoreMissing: true }],
    rehypeSurfaceCodeNewlines,
  ]
  res.rehypePlugins = options.addRehypePlugins
    ? [...rehypeDefaults, ...options.addRehypePlugins]
    : rehypeDefaults

  // Add math plugins if enabled
  if (options.enableMath) {
    res.remarkPlugins.push(remarkMath)
    res.rehypePlugins.push(rehypeKatex)
  }

  return res
}
