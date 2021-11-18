# `@hashicorp/platform-remark-plugins`

A potpourri of [remark](https://github.com/remarkjs/remark) plugins used by [HashiCorp](https://www.hashicorp.com/) to process markdown files.

## Overview

[MDX](https://mdxjs.com) uses [remark](https://github.com/remarkjs/remark) internally to process and transform markdown via [plugins](https://github.com/remarkjs/remark/blob/master/doc/plugins.md#list-of-plugins). We use MDX to process markdown content to build out our docs, learning guides, and write rich content from our CMS. This set of plugins ensures that written markdown is translated properly into markup.

### Anchor Links

The `anchorLinks` plugin adds anchor links to headings and when a list begins with an `inline code` element so that users are able to easily link to a specific place even if it is further down the page. See [its readme](plugins/anchor-links/README.md) for more details.

### Include Markdown

The `includeMarkdown` plugin gives authors the ability to use a directive like `@include "filename.md" to import markdown from a separate file, like a partial. See [its readme](plugins/include-markdown/README.md) for more details.

### Custom Alerts

The `paragraphCustomAlerts` plugin adds a custom syntax for creating alert boxes. See [its readme](plugins/inline-code-linkable/README.md) for more details. This plugin will be deprecated for a `<Alert />` component in the future in a step to move us toward full [commonmark](https://commonmark.org/) compliance.

### Typography

The `typography` plugin adds css classes to certain typographical elements so that they adhere to the typography standards from our design system. See [its readme](plugins/inline-code-linkable/README.md) for more details.

## Usage

Each of the plugins are individually exposed from the default export from this module and can be used as any other remark plugin would be normally. For example, with raw mdx:

```js
import { compileSync } from '@mdx-js/mdx'
import { typography, anchorLinks } from '@hashicorp/platform-remark-plugins'

console.log(compileSync('some markdown content', {
  remarkPlugins: [typography, anchorLinks]
})
```

If you'd like to use all of the plugins in one shot, which is typically the case with this module, an array of all the plugins is returned from the `allPlugins` export, as such:

```js
import { compileSync } from '@mdx-js/mdx'
import allPlugins from '@hashicorp/platform-remark-plugins/all'

console.log(compileSync('some markdown content', {
  remarkPlugins: allPlugins(/* options */)
})
```

Plugin options can be passed to `allPlugins` as an object, with the keys being plugin names. For example, to pass options to `headingLinkable`, you could call `allPlugins({ headingLinkable: { foo: 'bar' } })`.

If you are using `next-hashicorp`, all of these plugins will be included by default.
