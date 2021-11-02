# `@hashicorp/platform-markdown-utils`

Shared utilities for rendering markdown content across our marketing properties

### `markdownDefaults`

Returns an object containing `rehypePlugins` and `remarkPlugins`, with our default plugins used for rendering markdown content.

```ts
import markdownDefaults from '@hashicorp/platform-markdown-utils'

const defaults = markdownDefaults({
  // Additional rehype or remark plugins
  addRehypePlugins?: []Plugin,
  addRemarkPlugins?: []Plugin,
  // options passed to remark plugins, example shown below
  // see https://github.com/hashicorp/remark-plugins for more info
  pluginOptions?: PluginOptions,
  // passes the value to `resolveFrom` include-markdown plugin
  // https://github.com/hashicorp/remark-plugins/blob/master/plugins/include-markdown/README.md#options
  resolveIncludes?: String,
  // enables math function processing via https://github.com/remarkjs/remark-math
  enableMath?: Boolean

})
```

### `markdownToHtml`

Converts a markdown string into HTML.

```ts
import markdownToHtml from '@hashicorp/platform-markdown-utils/markdown-to-html'

const html = markdownToHtml('# Hello world!')
```

### `markdownToInlineHtml`

Converts a markdown string into inline HTML.

```ts
import markdownToInlineHtml from '@hashicorp/platform-markdown-utils/markdown-to-inline-html'

const html = markdownToInlineHtml('Some inline *markdown* to _test_.')
```
