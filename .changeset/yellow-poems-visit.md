---
'@hashicorp/platform-markdown-utils': minor
---

BREAKING CHANGE: Removes dependency on `@hashicorp/remark-plugins`. Deprecates default set of plugins, and deprecates the `pluginOptions` and `resolveIncludes` argument properties.

To upgrade, consumers should import `allPlugins` themselves.

## Old use

```ts
import markdownDefaults from '@hashicorp/platform-markdown-utils'

const additionalPlugins = [
  /* ... more plugins ... */
]
const pluginOptions = {
  /* ... for remark-plugins allPlugins ... */
}

const { remarkPlugins, rehypePlugins } = markdownDefaults({
  pluginOptions,
  resolveIncludes: path.join(process.cwd(), localPartialsDir),
  addRemarkPlugins: additionalPlugins,
})
```

## New use

```ts
import markdownDefaults from '@hashicorp/platform-markdown-utils'
import allPlugins from '@hashicorp/remark-plugins'

const additionalPlugins = [
  /* ... more plugins ... */
]
const defaultPlugins = allPlugins({
  includeMarkdown: {
    resolveMdx: true,
    resolveFrom: path.join(process.cwd(), localPartialsDir),
  },
})

const { remarkPlugins, rehypePlugins } = markdownDefaults({
  addRemarkPlugins: [...defaultPlugins, ...additionalPlugins],
})
```
